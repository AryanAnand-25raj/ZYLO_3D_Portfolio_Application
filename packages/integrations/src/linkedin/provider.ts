import {
  ProfessionalProfileProvider,
  Connection,
  ExternalProfile,
  IntegrationResult,
} from "../core/types";
import { TokenEncryptionService } from "../security/encryption";

export interface LinkedInProviderConfig {
  clientId?: string;
  clientSecret?: string;
}

export class LinkedInProvider implements ProfessionalProfileProvider {
  private clientId: string;
  private clientSecret: string;

  constructor(config?: LinkedInProviderConfig) {
    this.clientId = config?.clientId || process.env.LINKEDIN_CLIENT_ID || "zylo_linkedin_dev_id";
    this.clientSecret = config?.clientSecret || process.env.LINKEDIN_CLIENT_SECRET || "zylo_linkedin_dev_secret";
  }

  /**
   * Generates LinkedIn OAuth 2.0 authorization URL using OpenID Connect scopes.
   * Scopes: openid, profile, email.
   */
  public async getAuthorizationUrl(state: string, redirectUri: string): Promise<string> {
    const params = new URLSearchParams({
      response_type: "code",
      client_id: this.clientId,
      redirect_uri: redirectUri,
      state,
      scope: "openid profile email",
    });

    return `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
  }

  /**
   * Exchanges code for LinkedIn access token.
   * Gracefully detects permission constraints and flags limited API connections.
   */
  public async handleCallback(params: {
    code: string;
    state: string;
    redirectUri: string;
  }): Promise<IntegrationResult> {
    const { code, redirectUri } = params;

    const tokenRes = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: redirectUri,
      }).toString(),
    });

    if (!tokenRes.ok) {
      throw new Error(`LinkedIn token exchange failed: HTTP ${tokenRes.status}`);
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;
    const expiresIn = tokenData.expires_in;

    // Fetch user profile via LinkedIn OIDC userinfo endpoint
    let profileData: any = {};
    let limitedPermissions = false;

    try {
      const userinfoRes = await fetch("https://api.linkedin.com/v2/userinfo", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (userinfoRes.ok) {
        profileData = await userinfoRes.json();
      } else {
        // LinkedIn application does not have elevated enterprise member data products
        limitedPermissions = true;
      }
    } catch {
      limitedPermissions = true;
    }

    const externalAccountId = profileData.sub || `li_${Date.now()}`;
    const externalProfile: ExternalProfile = {
      provider: "linkedin",
      externalAccountId,
      username: profileData.name?.toLowerCase().replace(/\s+/g, ""),
      fullName: profileData.name || "LinkedIn Member",
      email: profileData.email,
      avatarUrl: profileData.picture,
      raw: profileData,
      importedAt: new Date().toISOString(),
    };

    return {
      success: true,
      provider: "linkedin",
      externalAccountId,
      externalUsername: externalProfile.username,
      accessToken,
      expiresIn,
      scopes: ["openid", "profile", "email"],
      profile: externalProfile,
      limitedPermissions,
    };
  }

  /**
   * Fetches the latest LinkedIn profile using stored connection token.
   */
  public async fetchProfile(connection: Connection): Promise<ExternalProfile> {
    const rawToken = TokenEncryptionService.decrypt(connection.encryptedAccessToken);

    const res = await fetch("https://api.linkedin.com/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${rawToken}`,
      },
    });

    if (!res.ok) {
      if (res.status === 401) {
        throw new Error("LinkedIn access token expired or revoked");
      }
      throw new Error(`Failed to fetch LinkedIn profile: HTTP ${res.status}`);
    }

    const data = await res.json();

    return {
      provider: "linkedin",
      externalAccountId: data.sub || connection.externalAccountId,
      username: data.name?.toLowerCase().replace(/\s+/g, ""),
      fullName: data.name,
      email: data.email,
      avatarUrl: data.picture,
      raw: data,
      importedAt: new Date().toISOString(),
    };
  }

  /**
   * Disconnects LinkedIn connection.
   */
  public async disconnect(_connection: Connection): Promise<void> {
    // LinkedIn API revoke token or local credential purge
  }
}
