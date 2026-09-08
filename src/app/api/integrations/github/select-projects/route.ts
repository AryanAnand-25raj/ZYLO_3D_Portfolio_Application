import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { IntegrationStorageManager } from "@/modules/integrations/storage";
import { IntegrationNormalizer, GitHubProject } from "@zylo/integrations";
import { BuilderStorageManager } from "@/modules/builder/builder-store";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id || "demo-user-1";
    const body = await req.json();

    const selectedIds = new Set<string>(body.selectedProjectIds || []);
    if (selectedIds.size === 0) {
      return NextResponse.json(
        { error: "No project IDs provided for import." },
        { status: 400 }
      );
    }

    const connection = await IntegrationStorageManager.getIntegration(userId, "github");
    const rawRepos = connection?.metadata?.repositories || [];

    // Extract selected GitHub project objects
    const selectedProjects: GitHubProject[] = rawRepos
      .map((item: any) => (item.project ? item.project : item))
      .filter((p: any) => selectedIds.has(String(p.id)));

    // Map into canonical portfolio project models
    const canonicalProjects = IntegrationNormalizer.mapGitHubToCanonicalProjects(selectedProjects);

    // If active demo/draft portfolio exists, merge selected projects without overwriting existing manual entries
    const demo = BuilderStorageManager.getPortfolio("port-demo-1");
    if (demo) {
      const cloned = JSON.parse(JSON.stringify(demo.portfolio));
      const existingTitles = new Set(cloned.content.projects.map((p: any) => p.title.toLowerCase()));

      for (const proj of canonicalProjects) {
        if (!existingTitles.has(proj.title.toLowerCase())) {
          cloned.content.projects.push(proj);
        }
      }

      BuilderStorageManager.savePortfolio("port-demo-1", cloned, userId);
      BuilderStorageManager.addVersion(
        "port-demo-1",
        `Imported ${canonicalProjects.length} GitHub Projects`,
        "Imported selected repositories from GitHub integration",
        cloned
      );
    }

    return NextResponse.json({
      success: true,
      importedCount: canonicalProjects.length,
      projects: canonicalProjects,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to import selected projects" },
      { status: 500 }
    );
  }
}
