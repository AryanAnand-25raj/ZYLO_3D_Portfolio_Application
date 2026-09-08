import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { GitHubProvider, ProjectQualityScorer } from "@zylo/integrations";
import { IntegrationStorageManager } from "@/modules/integrations/storage";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id || "demo-user-1";

    const connection = await IntegrationStorageManager.getIntegration(userId, "github");
    if (!connection || connection.status !== "connected") {
      return NextResponse.json(
        { error: "GitHub is not connected. Please connect your GitHub account first." },
        { status: 400 }
      );
    }

    const provider = new GitHubProvider();

    // 1. Refresh profile
    let profile = connection.metadata?.profile;
    try {
      profile = await provider.fetchProfile(connection);
    } catch (e: any) {
      if (e.message?.includes("expired")) {
        connection.status = "expired";
        await IntegrationStorageManager.saveIntegration(connection);
        return NextResponse.json(
          { error: "GitHub access token has expired. Please reconnect." },
          { status: 401 }
        );
      }
    }

    // 2. Refresh repositories
    const repos = await provider.fetchRepositories(connection);
    const ranking = ProjectQualityScorer.rankProjects(repos);

    // 3. Update connection metadata
    await IntegrationStorageManager.updateSyncMetadata(userId, "github", {
      profile,
      repositories: ranking.evaluated,
      repoCount: ranking.evaluated.length,
      lastSyncError: null,
    });

    return NextResponse.json({
      success: true,
      syncedAt: new Date().toISOString(),
      repoCount: ranking.evaluated.length,
      repositories: ranking.evaluated,
      topRecommended: ranking.topRecommended,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to synchronize GitHub data" },
      { status: 500 }
    );
  }
}
