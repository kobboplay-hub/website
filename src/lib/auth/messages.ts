/**
 * Maps Shopify/auth API errors to user-friendly copy.
 * Edit messages here for consistent login/register UX.
 */
export function mapAuthErrorMessage(
  message: string,
  code?: string,
): string {
  const lower = message.toLowerCase();

  if (
    code === "UNIDENTIFIED_CUSTOMER" ||
    lower.includes("unidentified customer") ||
    lower.includes("incorrect email or password")
  ) {
    return "We couldn't sign you in. Please check your email and password.";
  }

  if (
    lower.includes("customer disabled") ||
    lower.includes("not activated") ||
    lower.includes("account is disabled")
  ) {
    return "Your account isn't active yet. Please check your email or contact customer care.";
  }

  if (
    lower.includes("customer not found") ||
    lower.includes("no account found")
  ) {
    return "We couldn't find an account with that email. Try signing up or check the spelling.";
  }

  if (
    lower.includes("password") &&
    (lower.includes("incorrect") || lower.includes("invalid"))
  ) {
    return "That password doesn't look right. Please try again or reset your password.";
  }

  if (
    lower.includes("network") ||
    lower.includes("fetch") ||
    lower.includes("failed to fetch") ||
    lower.includes("shopify api error")
  ) {
    return "We're having trouble connecting. Please check your internet and try again.";
  }

  if (lower.includes("email has already been taken")) {
    return "An account with this email already exists. Try signing in instead.";
  }

  if (lower.includes("email is invalid")) {
    return "Please enter a valid email address.";
  }

  if (lower.includes("token") && lower.includes("invalid")) {
    return "This link has expired. Please request a new password reset email.";
  }

  if (lower.includes("not authenticated") || lower.includes("session expired")) {
    return "Your session has expired. Please sign in again.";
  }

  // Avoid exposing raw technical Shopify messages
  if (
    lower.includes("graphql") ||
    lower.includes("shopify") ||
    lower.includes("api error")
  ) {
    return "Something went wrong on our end. Please try again in a moment.";
  }

  return message;
}
