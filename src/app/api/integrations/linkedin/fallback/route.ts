import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { LinkedInFallbackParser } from "@zylo/integrations";
import { IntegrationStorageManager } from "@/modules/integrations/storage";
import { BuilderStorageManager } from "@/modules/builder/builder-store";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id || "demo-user-1";
    const body = await req.json();

    const input = body.input || body.text || body.url;
    if (!input || typeof input !== "string") {
      return NextResponse.json(
        { error: "Please provide a valid LinkedIn URL, pasted profile text, or JSON export." },
        { status: 400 }
      );
    }

    // 1. Parse via anti-scraping fallback parser
    const parsed = LinkedInFallbackParser.parse(input);

    // 2. Optionally record connection or metadata
    const existingConn = await IntegrationStorageManager.getIntegration(userId, "linkedin");
    if (existingConn) {
      await IntegrationStorageManager.updateSyncMetadata(userId, "linkedin", {
        fallbackData: parsed,
        lastFallbackImportAt: new Date().toISOString(),
      });
    }

    // 3. If experiences or skills are extracted, merge into active draft/portfolio if requested
    if (body.applyToPortfolio) {
      const demo = BuilderStorageManager.getPortfolio("port-demo-1");
      if (demo) {
        const cloned = JSON.parse(JSON.stringify(demo.portfolio));

        if (parsed.headline) {
          cloned.content.profile.headline = parsed.headline;
        }
        if (parsed.bio) {
          cloned.content.profile.bio = parsed.bio;
        }
        if (parsed.skills.length > 0) {
          // Merge skills
          const existingSkills = new Set(
            cloned.content.skillCategories.flatMap((c: any) => c.skills.map((s: any) => s.name.toLowerCase()))
          );
          const newSkills = parsed.skills
            .filter((s) => !existingSkills.has(s.toLowerCase()))
            .map((s) => ({ name: s, proficiency: 85 }));

          if (newSkills.length > 0) {
            cloned.content.skillCategories.push({
              id: `cat-li-${Date.now()}`,
              category: "Imported Professional Skills",
              skills: newSkills,
            });
          }
        }

        BuilderStorageManager.savePortfolio("port-demo-1", cloned, userId);
        BuilderStorageManager.addVersion(
          "port-demo-1",
          "Imported LinkedIn Profile Data",
          "Merged career fields from LinkedIn manual fallback import",
          cloned
        );
      }
    }

    return NextResponse.json({
      success: true,
      parsed,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to process LinkedIn profile data" },
      { status: 500 }
    );
  }
}
