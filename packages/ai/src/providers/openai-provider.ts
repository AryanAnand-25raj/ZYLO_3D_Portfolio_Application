import { AIProvider, AIRequest, AIResponse, TokenUsage } from "./ai-provider.interface";
import { MockAIProvider } from "./mock-ai-provider";

export class OpenAIProvider implements AIProvider {
  public readonly name = "openai";
  private apiKey: string | null = null;
  private defaultModel: string;
  private mockFallback: MockAIProvider;

  constructor(apiKey?: string, model?: string) {
    this.apiKey = apiKey || process.env.OPENAI_API_KEY || null;
    this.defaultModel = model || process.env.OPENAI_MODEL || "gpt-4o-mini";
    this.mockFallback = new MockAIProvider();
  }

  public async generateStructuredOutput<T>(request: AIRequest): Promise<AIResponse<T>> {
    // If no real OpenAI API key is present or in test environment, use mock fallback
    if (!this.apiKey || this.apiKey.trim() === "" || this.apiKey.startsWith("mock-")) {
      return this.mockFallback.generateStructuredOutput<T>(request);
    }

    const startTime = Date.now();
    const model = this.defaultModel;
    const maxRetries = 3;
    let attempt = 0;
    let lastError: Error | null = null;
    let lastRawText = "";
    let totalPromptTokens = 0;
    let totalCompletionTokens = 0;

    const messages = [
      {
        role: "system",
        content: `${request.systemPrompt}\n\nIMPORTANT: Respond ONLY with valid, minified or indented JSON conforming to the requested schema. Do NOT include markdown code fences or conversational text.`,
      },
      {
        role: "user",
        content: request.inputData
          ? `${request.userPrompt}\n\nInput Context:\n${JSON.stringify(request.inputData, null, 2)}`
          : request.userPrompt,
      },
    ];

    while (attempt < maxRetries) {
      attempt++;
      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            model,
            messages,
            temperature: request.temperature ?? 0.2,
            max_tokens: request.maxTokens ?? 3500,
            response_format: { type: "json_object" },
          }),
        });

        if (!response.ok) {
          const errBody = await response.text();
          throw new Error(`OpenAI API HTTP ${response.status}: ${errBody}`);
        }

        const json = await response.json();
        const rawContent = json.choices?.[0]?.message?.content || "{}";
        lastRawText = rawContent;

        if (json.usage) {
          totalPromptTokens += json.usage.prompt_tokens || 0;
          totalCompletionTokens += json.usage.completion_tokens || 0;
        }

        // Clean markdown fences
        const cleanedJson = rawContent
          .replace(/^```(?:json)?\s*/i, "")
          .replace(/\s*```$/i, "")
          .trim();

        const parsedJson = JSON.parse(cleanedJson);

        // Validate with Zod schema if provided
        let finalData = parsedJson;
        if (request.schema) {
          const zodValidation = request.schema.safeParse(parsedJson);
          if (!zodValidation.success) {
            throw new Error(`Schema validation failed: ${zodValidation.error.message}`);
          }
          finalData = zodValidation.data;
        }

        const latencyMs = Date.now() - startTime;
        const usage: TokenUsage = {
          promptTokens: totalPromptTokens,
          completionTokens: totalCompletionTokens,
          totalTokens: totalPromptTokens + totalCompletionTokens,
          estimatedCostUsd: this.estimateCost(totalPromptTokens, totalCompletionTokens, model),
        };

        return {
          success: true,
          data: finalData as T,
          rawText: lastRawText,
          usage,
          model,
          provider: this.name,
          latencyMs,
        };
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        console.warn(`[OpenAIProvider] Attempt ${attempt}/${maxRetries} failed:`, lastError.message);

        if (attempt < maxRetries) {
          messages.push({
            role: "assistant",
            content: lastRawText || "{}",
          });
          messages.push({
            role: "user",
            content: `The previous output produced this error: "${lastError.message}". Please repair the JSON to strictly conform to the schema. Output JSON only.`,
          });
        }
      }
    }

    console.error(`[OpenAIProvider] Live OpenAI failed, falling back to mock provider. Error:`, lastError?.message);
    const fallback = await this.mockFallback.generateStructuredOutput<T>(request);
    return {
      ...fallback,
      error: lastError?.message,
    };
  }

  public estimateCost(promptTokens: number, completionTokens: number, model = "gpt-4o-mini"): number {
    if (model.includes("gpt-4o-mini")) {
      return (promptTokens * 0.00015 + completionTokens * 0.0006) / 1000;
    }
    return (promptTokens * 0.0025 + completionTokens * 0.01) / 1000;
  }
}
