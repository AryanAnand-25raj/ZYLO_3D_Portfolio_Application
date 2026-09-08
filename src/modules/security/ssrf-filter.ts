export class SSRFFilter {
  private static PRIVATE_IP_PATTERNS = [
    /^127\.\d+\.\d+\.\d+$/, // Loopback
    /^10\.\d+\.\d+\.\d+$/, // Class A private
    /^172\.(1[6-9]|2\d|3[01])\.\d+\.\d+$/, // Class B private
    /^192\.168\.\d+\.\d+$/, // Class C private
    /^169\.254\.\d+\.\d+$/, // Link-local / Cloud Metadata (AWS, GCP, Azure)
    /^0\.0\.0\.0$/,
    /^::1$/, // IPv6 loopback
    /^fc00:/i, // IPv6 Unique Local
    /^fe80:/i, // IPv6 Link-Local
  ];

  private static BLOCKED_HOSTNAMES = new Set([
    "localhost",
    "metadata.google.internal",
    "169.254.169.254",
    "instance-data",
  ]);

  /**
   * Validates whether a domain or target URL is safe from SSRF exploits.
   */
  public static isSafeUrl(rawUrl: string): { safe: boolean; reason?: string } {
    if (!rawUrl || typeof rawUrl !== "string") {
      return { safe: false, reason: "Empty or invalid URL." };
    }

    try {
      // Add scheme if missing for parsing domain-only strings
      const urlString = rawUrl.includes("://") ? rawUrl : `https://${rawUrl}`;
      const parsed = new URL(urlString);

      // 1. Protocol check
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        return {
          safe: false,
          reason: `Protocol '${parsed.protocol}' is forbidden. Only HTTP/HTTPS are allowed.`,
        };
      }

      const hostname = parsed.hostname.toLowerCase();

      // 2. Blocked hostnames check
      if (this.BLOCKED_HOSTNAMES.has(hostname) || hostname.endsWith(".internal") || hostname.endsWith(".local")) {
        return {
          safe: false,
          reason: `Target hostname '${hostname}' is an internal or restricted destination.`,
        };
      }

      // 3. Private and link-local IP check
      for (const pattern of this.PRIVATE_IP_PATTERNS) {
        if (pattern.test(hostname)) {
          return {
            safe: false,
            reason: `Target IP address '${hostname}' is within a prohibited private or link-local range.`,
          };
        }
      }

      return { safe: true };
    } catch {
      return { safe: false, reason: "Malformed URL or domain format." };
    }
  }

  /**
   * Specifically validates custom domain strings (e.g. "alex.dev", "portfolio.com").
   */
  public static isSafeCustomDomain(domain: string): { safe: boolean; reason?: string } {
    if (!domain || typeof domain !== "string") {
      return { safe: false, reason: "Domain cannot be empty." };
    }

    const clean = domain.trim().toLowerCase();

    if (clean.includes("/") || clean.includes(":") || clean.includes("@")) {
      return { safe: false, reason: "Domain should not contain paths, ports, or userinfo." };
    }

    return this.isSafeUrl(`https://${clean}`);
  }
}
