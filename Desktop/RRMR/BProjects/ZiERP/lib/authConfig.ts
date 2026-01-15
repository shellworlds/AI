/**
 * Authentication Configuration
 * Centralized list of authorized Google accounts that can access the console
 * 
 * To add a new user:
 * 1. Add their email to ALLOWED_GOOGLE_ACCOUNTS
 * 2. Add their email and Account ID to EMAIL_ACCOUNT_MAP
 * 3. Configure their folder mappings in the respective API routes
 * 
 * Last updated: 2026-01-11
 */

// List of authorized Google account emails (case-insensitive)
export const ALLOWED_GOOGLE_ACCOUNTS: readonly string[] = [
  'rr@q-bit.space',
  'muskan.s@data-t.space',
  'vipul.j@zi-us.com',
  'crm@borelsigma.in',
  'mike.s@a-eq.com',
  'corporate@borelsigma.com' // Admin account with access to all users' data
] as const;

// Email to Account ID mapping (reverse lookup for single sign-on)
export const EMAIL_ACCOUNT_MAP: Record<string, string> = {
  'rr@q-bit.space': 'BS-11041984-13-R10',
  'muskan.s@data-t.space': 'BS-11041984-13-M10',
  'vipul.j@zi-us.com': 'BS-11041984-13-V10',
  'crm@borelsigma.in': 'BS-11041997-13-M10',
  'mike.s@a-eq.com': 'BS-11041997-13-K10',
  'corporate@borelsigma.com': 'BS-11041984-13-R10' // Admin account
};

// Admin accounts with special privileges (access to all users' data)
export const ADMIN_ACCOUNTS: readonly string[] = [
  'corporate@borelsigma.com',
  'rr@q-bit.space'
] as const;

/**
 * Check if an email belongs to an admin account
 * @param email - User email to check
 * @returns true if email is an admin account, false otherwise
 */
export function isAdminAccount(email: string | null | undefined): boolean {
  if (!email) return false;
  const normalizedEmail = email.toLowerCase();
  return ADMIN_ACCOUNTS.includes(normalizedEmail as any);
}

/**
 * Check if an email is authorized to access the console
 * @param email - User email to check
 * @returns true if email is in the allowed list, false otherwise
 */
export function isAuthorizedEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const normalizedEmail = email.toLowerCase();

  // Dev convenience: allow any Google account in local/dev so testing multiple accounts is painless.
  // Keep production restricted to the allowlist unless explicitly overridden.
  const allowAll =
    process.env.NODE_ENV !== 'production' ||
    process.env.NEXT_PUBLIC_ALLOW_ALL_GOOGLE_ACCOUNTS === 'true';
  if (allowAll) return true;

  return ALLOWED_GOOGLE_ACCOUNTS.includes(normalizedEmail as any);
}

/**
 * Get account ID for a given email
 * @param email - User email
 * @returns Account ID if found, default account ID otherwise
 */
export function getAccountIdForEmail(email: string | null | undefined): string {
  if (!email) return 'BS-11041984-13-R10';
  const normalizedEmail = email.toLowerCase();
  return EMAIL_ACCOUNT_MAP[normalizedEmail] || 'BS-11041984-13-R10';
}

