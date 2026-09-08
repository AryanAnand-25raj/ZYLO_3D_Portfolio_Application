export type IntegrationProviderType = "github" | "linkedin";

export type IntegrationStatusType =
  | "connected"
  | "expired"
  | "revoked"
  | "limited_permissions"
  | "error";

export interface Connection {
  id: string;
  userId: string;
  provider: IntegrationProviderType;
  status: IntegrationStatusType;
  externalAccountId: string;
  externalUsername?: string;
  scopes: string[];
  encryptedAccessToken: string;
  encryptedRefreshToken?: string;
  tokenExpiresAt?: string;
  lastSyncedAt?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface ExternalProfile {
  provider: IntegrationProviderType;
  externalAccountId: string;
  username?: string;
  fullName?: string;
  email?: string;
  avatarUrl?: string;
  bio?: string;
  location?: string;
  website?: string;
  publicRepoCount?: number;
  followers?: number;
  raw?: Record<string, any>;
  importedAt: string;
}

export interface IntegrationResult {
  success: boolean;
  provider: IntegrationProviderType;
  externalAccountId: string;
  externalUsername?: string;
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
  scopes: string[];
  profile?: ExternalProfile;
  error?: string;
  limitedPermissions?: boolean;
}

export interface DataSourceField<T = unknown> {
  value: T;
  source: "github" | "linkedin" | "resume" | "manual" | "ai";
  importedAt: string;
  verified?: boolean;
}

export interface ProfessionalProfileProvider {
  getAuthorizationUrl(state: string, redirectUri: string): Promise<string>;
  handleCallback(params: { code: string; state: string; redirectUri: string }): Promise<IntegrationResult>;
  fetchProfile(connection: Connection): Promise<ExternalProfile>;
  disconnect(connection: Connection): Promise<void>;
}
