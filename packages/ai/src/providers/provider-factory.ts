import { AIProvider } from "./ai-provider.interface";
import { OpenAIProvider } from "./openai-provider";
import { MockAIProvider } from "./mock-ai-provider";

let cachedProvider: AIProvider | null = null;

export function getAIProvider(forceMock = false): AIProvider {
  if (forceMock || process.env.AI_PROVIDER === "mock" || process.env.NODE_ENV === "test") {
    return new MockAIProvider();
  }

  if (cachedProvider) {
    return cachedProvider;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey.trim() === "" || apiKey === "mock-key-for-testing") {
    return new MockAIProvider();
  }

  cachedProvider = new OpenAIProvider(apiKey);
  return cachedProvider;
}

export * from "./ai-provider.interface";
export * from "./openai-provider";
export * from "./mock-ai-provider";
