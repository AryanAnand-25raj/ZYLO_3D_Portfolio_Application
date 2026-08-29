import { normalizeMultiSourceProfile, NormalizationInputs, NormalizationResult } from "../normalizers/profile-normalizer";
import { generatePortfolioContent, GenerateContentOptions } from "../content/content-engine";
import { evaluateProfileCompleteness } from "../completeness/completeness-engine";
import { CanonicalProfile } from "../schemas/canonical-profile.schema";
import { PortfolioContent, ContentStylePreset } from "../schemas/portfolio-content.schema";
import { CompletenessReport } from "../schemas/completeness.schema";
import { AIJobType, AIJobStatus } from "../schemas/ai-job.schema";
import { prisma } from "../../../../src/lib/db";
import { recordAIUsage } from "../usage/usage-tracker";
import { getAIProvider, AIProvider } from "../providers/provider-factory";

export interface PipelineExecutionOptions {
  userId: string;
  portfolioId?: string;
  inputs: NormalizationInputs;
  stylePreset?: ContentStylePreset;
  stylePrompt?: string;
  answeredQuestions?: Array<{ question: string; answer: string }>;
  provider?: AIProvider;
}

export interface CompletePipelineResult {
  canonicalProfile: CanonicalProfile;
  conflicts: NormalizationResult["conflicts"];
  portfolioContent: PortfolioContent;
  completeness: CompletenessReport;
}

export class AIOrchestrator {
  private provider: AIProvider;

  constructor(provider?: AIProvider) {
    this.provider = provider || getAIProvider();
  }

  /**
   * Runs the complete end-to-end AI normalization & content synthesis pipeline
   */
  public async runCompletePipeline(
    options: PipelineExecutionOptions
  ): Promise<CompletePipelineResult> {
    // 1. Normalize Multi-Source Inputs
    const normResult = normalizeMultiSourceProfile(options.inputs);

    // 2. Evaluate Profile Completeness
    const completeness = evaluateProfileCompleteness(normResult.canonicalProfile);

    // 3. Generate Structured Portfolio Copy
    const portfolioContent = await generatePortfolioContent({
      profile: normResult.canonicalProfile,
      style: options.stylePreset || "Professional",
      stylePrompt: options.stylePrompt,
      answeredQuestions: options.answeredQuestions,
      provider: this.provider,
    });

    // 4. Record Usage
    await recordAIUsage({
      userId: options.userId,
      portfolioId: options.portfolioId,
      model: "gpt-4o-mini",
      task: "COMPLETE_PIPELINE",
      inputTokens: 350,
      outputTokens: 600,
      estimatedCost: 0.002,
    });

    return {
      canonicalProfile: normResult.canonicalProfile,
      conflicts: normResult.conflicts,
      portfolioContent,
      completeness,
    };
  }

  /**
   * Normalizes profile inputs with source priority & conflict detection
   */
  public normalizeProfile(inputs: NormalizationInputs): NormalizationResult {
    return normalizeMultiSourceProfile(inputs);
  }

  /**
   * Evaluates profile readiness score and missing gaps
   */
  public analyzeCompleteness(profile: CanonicalProfile, enabledSections?: string[]): CompletenessReport {
    return evaluateProfileCompleteness(profile, enabledSections);
  }

  /**
   * Generates portfolio copy matching chosen style preset
   */
  public async generateContent(options: GenerateContentOptions): Promise<PortfolioContent> {
    return generatePortfolioContent({
      ...options,
      provider: this.provider,
    });
  }

  /**
   * Creates or updates an asynchronous AI Job
   */
  public async createJob(userId: string, type: AIJobType, input: any, portfolioId?: string): Promise<string> {
    const jobId = `job-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    try {
      if (prisma && typeof (prisma as any).aIJob?.create === "function") {
        const created = await (prisma as any).aIJob.create({
          data: {
            id: jobId,
            userId,
            portfolioId,
            type,
            status: "PROCESSING",
            progress: 20,
            input,
          },
        });
        return created.id;
      }
    } catch (e) {
      console.warn("[AIOrchestrator] Job creation DB fallback:", e);
    }
    return jobId;
  }
}

export const globalAIOrchestrator = new AIOrchestrator();
