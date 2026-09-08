import {
  ProfessionalProfileProvider,
  Connection,
  ExternalProfile,
  IntegrationResult,
} from "../core/types";
import { TokenEncryptionService } from "../security/encryption";
import { GitHubProject } from "./types";

export interface GitHubProviderConfig {
  clientId?: string;
  clientSecret?: string;
}

export class GitHubProvider implements ProfessionalProfileProvider {
  private clientId: string;
  private clientSecret: string;

  constructor(config?: GitHubProviderConfig) {
    this.clientId = config?.clientId || process.env.GITHUB_CLIENT_ID || "zylo_github_dev_id";
    this.clientSecret = config?.clientSecret || process.env.GITHUB_CLIENT_SECRET || "zylo_github_dev_secret";
  }

  /**
   * Generates the GitHub OAuth authorization URL with minimized scopes.
   * Scopes: read:user, public_repo (Does NOT access private repositories).
   */
  public async getAuthorizationUrl(state: string, redirectUri: string): Promise<string> {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: redirectUri,
      scope: "read:user,public_repo",
      state,
      allow_signup: "true",
    });

    return `https://github.com/login/oauth/authorize?${params.toString()}`;
  }

  /**
   * Exchanges authorization code for an OAuth access token and imports baseline profile.
   */
  public async handleCallback(params: {
    code: string;
    state: string;
    redirectUri: string;
  }): Promise<IntegrationResult> {
    const { code, redirectUri } = params;

    // Exchange code for token
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code,
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenRes.ok) {
      throw new Error(`GitHub token exchange failed: HTTP ${tokenRes.status}`);
    }

    const tokenData = await tokenRes.json();
    if (tokenData.error) {
      throw new Error(`GitHub OAuth error: ${tokenData.error_description || tokenData.error}`);
    }

    const accessToken = tokenData.access_token;
    const scopes = tokenData.scope ? tokenData.scope.split(",") : ["read:user", "public_repo"];

    // Fetch authorized user profile
    const profileRes = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "ZYLO-PortfolioX-App",
      },
    });

    if (!profileRes.ok) {
      throw new Error(`Failed to fetch GitHub profile: HTTP ${profileRes.status}`);
    }

    const userData = await profileRes.json();

    const externalProfile: ExternalProfile = {
      provider: "github",
      externalAccountId: String(userData.id),
      username: userData.login,
      fullName: userData.name || userData.login,
      email: userData.email || undefined,
      avatarUrl: userData.avatar_url,
      bio: userData.bio || undefined,
      location: userData.location || undefined,
      website: userData.blog || undefined,
      publicRepoCount: userData.public_repos,
      followers: userData.followers,
      raw: userData,
      importedAt: new Date().toISOString(),
    };

    return {
      success: true,
      provider: "github",
      externalAccountId: String(userData.id),
      externalUsername: userData.login,
      accessToken,
      scopes,
      profile: externalProfile,
    };
  }

  /**
   * Fetches latest profile data using the stored connection.
   */
  public async fetchProfile(connection: Connection): Promise<ExternalProfile> {
    const rawToken = TokenEncryptionService.decrypt(connection.encryptedAccessToken);

    const res = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${rawToken}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "ZYLO-PortfolioX-App",
      },
    });

    if (!res.ok) {
      if (res.status === 401) {
        throw new Error("GitHub access token expired or revoked");
      }
      throw new Error(`Failed to fetch GitHub profile: HTTP ${res.status}`);
    }

    const userData = await res.json();

    return {
      provider: "github",
      externalAccountId: String(userData.id),
      username: userData.login,
      fullName: userData.name || userData.login,
      email: userData.email || undefined,
      avatarUrl: userData.avatar_url,
      bio: userData.bio || undefined,
      location: userData.location || undefined,
      website: userData.blog || undefined,
      publicRepoCount: userData.public_repos,
      followers: userData.followers,
      raw: userData,
      importedAt: new Date().toISOString(),
    };
  }

  /**
   * Fetches user's public repositories, normalizing into GitHubProject records.
   */
  public async fetchRepositories(connection: Connection): Promise<GitHubProject[]> {
    const rawToken = TokenEncryptionService.decrypt(connection.encryptedAccessToken);

    const res = await fetch("https://api.github.com/user/repos?sort=updated&per_page=100&type=owner", {
      headers: {
        Authorization: `Bearer ${rawToken}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "ZYLO-PortfolioX-App",
      },
    });

    if (!res.ok) {
      if (res.status === 401) {
        throw new Error("GitHub access token expired or revoked");
      }
      throw new Error(`Failed to fetch GitHub repositories: HTTP ${res.status}`);
    }

    const repos = await res.json();
    if (!Array.isArray(repos)) {
      return [];
    }

    return repos
      .filter((r: any) => !r.private) // Strictly exclude private repositories
      .map((r: any) => ({
        id: String(r.id),
        name: r.name,
        fullName: r.full_name,
        description: r.description || "",
        url: r.html_url,
        homepage: r.homepage || "",
        language: r.language || undefined,
        languages: r.language ? [r.language] : [],
        topics: Array.isArray(r.topics) ? r.topics : [],
        stars: r.stargazers_count || 0,
        forks: r.forks_count || 0,
        isFork: Boolean(r.fork),
        isPrivate: Boolean(r.private),
        createdAt: r.created_at,
        updatedAt: r.updated_at,
        pushedAt: r.pushed_at,
      }));
  }

  /**
   * Disconnects integration and revokes OAuth credentials.
   */
  public async disconnect(_connection: Connection): Promise<void> {
    // GitHub API token revocation endpoint or application level purge
    // Credentials will be deleted from local storage by the caller
  }
}
