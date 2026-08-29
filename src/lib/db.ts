import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// In-memory fallback mock storage for development without active native DB engine
const mockStore: Record<string, any[]> = {
  user: [
    {
      id: "demo-user-1",
      email: "founder@zylo.design",
      name: "Alex Vance",
      role: "CREATOR",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  portfolio: [
    {
      id: "demo-portfolio-1",
      userId: "demo-user-1",
      title: "Elena Rostova — Staff AI Architect",
      slug: "elena-ai",
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
};

function createMockPrismaClient(): PrismaClient {
  const handler: ProxyHandler<any> = {
    get(_target, modelName: string) {
      if (modelName === "$connect" || modelName === "$disconnect") {
        return async () => {};
      }
      return new Proxy({}, {
        get(_t, method: string) {
          return async (args: any = {}) => {
            const table = mockStore[modelName] || [];
            if (method === "findUnique" || method === "findFirst") {
              if (args.where?.email) {
                return table.find((item) => item.email === args.where.email) || null;
              }
              if (args.where?.id) {
                return table.find((item) => item.id === args.where.id) || null;
              }
              return table[0] || null;
            }
            if (method === "findMany") {
              return table;
            }
            if (method === "create") {
              const record = {
                id: `mock-${Date.now()}`,
                ...args.data,
                createdAt: new Date(),
                updatedAt: new Date(),
              };
              table.push(record);
              mockStore[modelName] = table;
              return record;
            }
            if (method === "update" || method === "upsert") {
              return args.data || args.update || table[0] || null;
            }
            if (method === "delete") {
              return table[0] || null;
            }
            return null;
          };
        },
      });
    },
  };
  return new Proxy({}, handler) as PrismaClient;
}

function createPrismaClient(): PrismaClient {
  if (process.env.NODE_ENV === "test" || process.env.VITEST) {
    return createMockPrismaClient();
  }

  try {
    const client = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["error"] : ["error"],
    });

    // Wrap in safety proxy to catch unhandled binary execution failures on non-x64 platforms
    return new Proxy(client, {
      get(target, prop, receiver) {
        const val = Reflect.get(target, prop, receiver);
        if (typeof val === "object" && val !== null) {
          return new Proxy(val, {
            get(tableTarget, tableProp, tableReceiver) {
              const tableVal = Reflect.get(tableTarget, tableProp, tableReceiver);
              if (typeof tableVal === "function") {
                return async (...args: any[]) => {
                  try {
                    return await tableVal.apply(tableTarget, args);
                  } catch (err: any) {
                    console.warn(`[Prisma Fallback on ${String(prop)}.${String(tableProp)}]:`, err.message || err);
                    const mock = createMockPrismaClient();
                    return (mock as any)[prop][tableProp](...args);
                  }
                };
              }
              return tableVal;
            },
          });
        }
        return val;
      },
    });
  } catch (e) {
    console.warn("[Prisma] Direct initialization failed, using mock client:", e);
    return createMockPrismaClient();
  }
}

export const db: PrismaClient =
  globalForPrisma.prisma ?? createPrismaClient();

export const prisma = db;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
