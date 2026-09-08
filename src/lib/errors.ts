/**
 * Production-Safe Error Sanitizer and Formatter
 * Replaces developer stack traces and database errors (e.g. PrismaClientKnownRequestError)
 * with actionable, friendly user-facing messages while securely logging internal errors.
 */

export interface UserFacingError {
  message: string;
  statusCode: number;
  errorId: string;
}

export function sanitizeError(err: unknown, fallbackMessage = "We couldn't complete your request. Please try again."): UserFacingError {
  const errorId = `err_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const errorString = String((err as any)?.message || err || "");

  // Internal Server Logging with generated correlation ID
  console.error(`[ErrorTracker] ID: ${errorId} | Original:`, err);

  // 1. Prisma & Database Specific Errors
  if (
    errorString.includes("PrismaClientKnownRequestError") ||
    errorString.includes("Unique constraint failed") ||
    (err as any)?.code === "P2002"
  ) {
    return {
      message: "An item with this identifier or name already exists. Please choose a different value.",
      statusCode: 409,
      errorId,
    };
  }

  if (
    errorString.includes("Record to update not found") ||
    (err as any)?.code === "P2025"
  ) {
    return {
      message: "The requested record was not found or may have been deleted.",
      statusCode: 404,
      errorId,
    };
  }

  if (
    errorString.includes("PrismaClientInitializationError") ||
    errorString.includes("Can't reach database server")
  ) {
    return {
      message: "Database connection temporarily unavailable. Our engineers have been alerted.",
      statusCode: 503,
      errorId,
    };
  }

  // 2. Authentication & Authorization Errors
  if (
    errorString.includes("Unauthorized") ||
    errorString.includes("jwt expired") ||
    errorString.includes("Authentication required")
  ) {
    return {
      message: "Your session has expired. Please sign in again to continue.",
      statusCode: 401,
      errorId,
    };
  }

  if (
    errorString.includes("Forbidden") ||
    errorString.includes("Insufficient permissions")
  ) {
    return {
      message: "You do not have permission to access or modify this resource.",
      statusCode: 403,
      errorId,
    };
  }

  // 3. Validation & Schema Errors
  if (
    errorString.includes("ZodError") ||
    errorString.includes("validation failed")
  ) {
    return {
      message: "Some submitted fields are invalid. Please check your inputs and try again.",
      statusCode: 400,
      errorId,
    };
  }

  // 4. Rate Limiting Errors
  if (
    errorString.includes("Rate limit exceeded") ||
    errorString.includes("Too Many Requests")
  ) {
    return {
      message: "You're doing that a bit too fast. Please wait a moment before trying again.",
      statusCode: 429,
      errorId,
    };
  }

  // 5. Payment & Billing Errors
  if (
    errorString.includes("card_declined") ||
    errorString.includes("payment_intent_unexpected_state")
  ) {
    return {
      message: "Your payment was not completed by the card issuer. Please try a different payment method.",
      statusCode: 402,
      errorId,
    };
  }

  // 6. Generic Safe Default
  return {
    message: fallbackMessage,
    statusCode: 500,
    errorId,
  };
}
