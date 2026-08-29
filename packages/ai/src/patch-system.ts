import { AIPatchOperation, AIPatchBatch } from "@/schemas/ai.schema";

/**
 * Applies a batch of validated JSON patch operations to a target object.
 */
export function applyAIPatches<T extends Record<string, any>>(
  target: T,
  batch: AIPatchBatch | AIPatchOperation[]
): { updated: T; appliedCount: number; errors: string[] } {
  const operations = Array.isArray(batch) ? batch : batch.operations;
  const cloned = JSON.parse(JSON.stringify(target));
  const errors: string[] = [];
  let appliedCount = 0;

  for (const op of operations) {
    try {
      const pathParts = op.path
        .split("/")
        .filter(Boolean)
        .map((p) => (isNaN(Number(p)) ? p : Number(p)));

      if (pathParts.length === 0) {
        errors.push("Invalid empty path");
        continue;
      }

      let current: any = cloned;
      for (let i = 0; i < pathParts.length - 1; i++) {
        const part = pathParts[i];
        if (current[part] === undefined || current[part] === null) {
          if (op.op === "add") {
            current[part] = typeof pathParts[i + 1] === "number" ? [] : {};
          } else {
            throw new Error(`Path segment '${part}' not found in target.`);
          }
        }
        current = current[part];
      }

      const lastKey = pathParts[pathParts.length - 1];

      switch (op.op) {
        case "replace":
          current[lastKey] = op.value;
          appliedCount++;
          break;
        case "add":
          if (Array.isArray(current)) {
            if (typeof lastKey === "number") {
              current.splice(lastKey, 0, op.value);
            } else {
              current.push(op.value);
            }
          } else {
            current[lastKey] = op.value;
          }
          appliedCount++;
          break;
        case "remove":
          if (Array.isArray(current) && typeof lastKey === "number") {
            current.splice(lastKey, 1);
          } else {
            delete current[lastKey];
          }
          appliedCount++;
          break;
        default:
          errors.push(`Unsupported patch operation: ${(op as any).op}`);
      }
    } catch (err) {
      errors.push(`Failed to apply patch at ${op.path}: ${err instanceof Error ? err.message : "Error"}`);
    }
  }

  return {
    updated: cloned,
    appliedCount,
    errors,
  };
}
