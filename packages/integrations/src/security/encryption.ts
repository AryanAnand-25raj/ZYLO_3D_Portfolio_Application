import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

function getEncryptionKey(): Buffer {
  const secret =
    process.env.ENCRYPTION_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    "zylo_default_production_secure_token_encryption_master_key_32_bytes";
  return crypto.createHash("sha256").update(secret).digest();
}

/**
 * Enterprise-grade AES-256-GCM encryption for OAuth access & refresh tokens.
 * Guarantees confidentiality and tampering protection via authenticated tags.
 */
export class TokenEncryptionService {
  /**
   * Encrypts plaintext token into a formatted string: "iv:authTag:ciphertext" (hex encoded).
   */
  public static encrypt(plainText: string): string {
    if (!plainText) {
      throw new Error("Cannot encrypt empty token");
    }

    const iv = crypto.randomBytes(IV_LENGTH);
    const key = getEncryptionKey();
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    let encrypted = cipher.update(plainText, "utf8", "hex");
    encrypted += cipher.final("hex");

    const authTag = cipher.getAuthTag();

    return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;
  }

  /**
   * Decrypts ciphertext and strictly verifies the authentication tag.
   * Throws if tampered, corrupted, or forged.
   */
  public static decrypt(cipherPayload: string): string {
    if (!cipherPayload) {
      throw new Error("Cannot decrypt empty payload");
    }

    const parts = cipherPayload.split(":");
    if (parts.length !== 3) {
      throw new Error("Invalid encrypted token format. Expected iv:authTag:ciphertext.");
    }

    const [ivHex, authTagHex, encryptedHex] = parts;
    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");
    const key = getEncryptionKey();

    if (iv.length !== IV_LENGTH) {
      throw new Error("Invalid IV length in encrypted token");
    }
    if (authTag.length !== AUTH_TAG_LENGTH) {
      throw new Error("Invalid Auth Tag length in encrypted token");
    }

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedHex, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  }
}

interface StoredStateRecord {
  userId: string;
  provider: string;
  createdAt: number;
}

// In-memory state storage with automatic 15-minute expiration
const stateStore = new Map<string, StoredStateRecord>();
const STATE_TTL_MS = 15 * 60 * 1000;

/**
 * Cryptographic OAuth State & CSRF Protection Service.
 */
export class OAuthStateService {
  /**
   * Generates a cryptographically strong 32-byte random state token.
   */
  public static generateState(userId: string, provider: string): string {
    // Purge expired states
    const now = Date.now();
    for (const [key, val] of stateStore.entries()) {
      if (now - val.createdAt > STATE_TTL_MS) {
        stateStore.delete(key);
      }
    }

    const randomBytes = crypto.randomBytes(32).toString("hex");
    const state = `zylo_${provider}_${randomBytes}`;

    stateStore.set(state, {
      userId,
      provider,
      createdAt: now,
    });

    return state;
  }

  /**
   * Validates and immediately consumes the state token (single-use replay prevention).
   */
  public static validateAndConsumeState(
    state: string,
    expectedProvider?: string
  ): { valid: boolean; userId?: string; error?: string } {
    if (!state) {
      return { valid: false, error: "Missing OAuth state parameter" };
    }

    const record = stateStore.get(state);
    if (!record) {
      return { valid: false, error: "Invalid or expired OAuth state token. Possible CSRF attempt." };
    }

    // Single-use guarantee
    stateStore.delete(state);

    if (Date.now() - record.createdAt > STATE_TTL_MS) {
      return { valid: false, error: "OAuth state has expired. Please try connecting again." };
    }

    if (expectedProvider && record.provider !== expectedProvider) {
      return { valid: false, error: `OAuth state provider mismatch. Expected ${expectedProvider}.` };
    }

    return { valid: true, userId: record.userId };
  }
}
