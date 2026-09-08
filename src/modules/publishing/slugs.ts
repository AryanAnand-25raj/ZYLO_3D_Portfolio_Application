export const RESERVED_SLUGS = new Set([
  "_next",
  "admin",
  "administrator",
  "api",
  "dashboard",
  "login",
  "signin",
  "signup",
  "register",
  "builder",
  "settings",
  "support",
  "help",
  "docs",
  "connect",
  "templates",
  "preview",
  "publish",
  "billing",
  "subscription",
  "about",
  "contact",
  "privacy",
  "terms",
  "legal",
  "auth",
  "app",
  "www",
  "mail",
  "cdn",
  "static",
  "assets",
  "favicon",
  "robots",
  "sitemap",
]);

export interface SlugValidationResult {
  valid: boolean;
  slug: string;
  error?: string;
}

export class SlugService {
  /**
   * Normalizes an arbitrary text string into a clean URL-safe slug.
   */
  public static normalizeSlug(input: string): string {
    return input
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
      .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with dashes
      .replace(/^-+|-+$/g, ""); // Strip leading/trailing dashes
  }

  /**
   * Validates whether a slug is permissible.
   * Checks format, length, and blocks reserved route keywords.
   */
  public static validateSlug(slug: string): SlugValidationResult {
    const clean = this.normalizeSlug(slug);

    if (RESERVED_SLUGS.has(slug.toLowerCase()) || RESERVED_SLUGS.has(clean)) {
      return {
        valid: false,
        slug: clean,
        error: `"${slug}" is a reserved system route and cannot be used as a portfolio slug.`,
      };
    }

    // Strict format check on input: reject uppercase, underscores, or spaces in raw slug
    if (/[A-Z_\s]/.test(slug)) {
      return {
        valid: false,
        slug: clean,
        error: "Slug may only contain lowercase letters, numbers, and hyphens.",
      };
    }

    if (!clean || clean.length < 3) {
      return {
        valid: false,
        slug: clean,
        error: "Slug must be at least 3 characters long.",
      };
    }

    if (clean.length > 40) {
      return {
        valid: false,
        slug: clean,
        error: "Slug must not exceed 40 characters.",
      };
    }

    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(clean)) {
      return {
        valid: false,
        slug: clean,
        error: "Slug may only contain lowercase letters, numbers, and hyphens.",
      };
    }

    if (RESERVED_SLUGS.has(clean) || RESERVED_SLUGS.has(slug.toLowerCase())) {
      return {
        valid: false,
        slug: clean,
        error: `"${clean}" is a reserved system route and cannot be used as a portfolio slug.`,
      };
    }

    return {
      valid: true,
      slug: clean,
    };
  }

  /**
   * Generates a collision-resistant unique slug if the requested slug is already in use.
   */
  public static resolveSlugCollision(
    desiredSlug: string,
    existingSlugs: Set<string>
  ): string {
    const base = this.normalizeSlug(desiredSlug);
    if (!existingSlugs.has(base) && !RESERVED_SLUGS.has(base)) {
      return base;
    }

    let counter = 1;
    let candidate = `${base}-${counter}`;
    while (existingSlugs.has(candidate) || RESERVED_SLUGS.has(candidate)) {
      counter++;
      candidate = `${base}-${counter}`;
    }

    return candidate;
  }

  /**
   * Alias for resolveSlugCollision
   */
  public static resolveCollision(
    desiredSlug: string,
    existingSlugs: Set<string>
  ): string {
    return this.resolveSlugCollision(desiredSlug, existingSlugs);
  }
}

