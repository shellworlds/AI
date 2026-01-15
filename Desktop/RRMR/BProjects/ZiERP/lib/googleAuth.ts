import {
  getRedirectResult,
  signInWithPopup,
  signInWithRedirect,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { getAccountIdForEmail, isAuthorizedEmail } from '@/lib/authConfig';
import { sessionTracker } from '@/lib/sessionTracker';

export interface SignInResult {
  success: boolean;
  error?: string;
  user?: any;
  redirecting?: boolean;
  skipped?: boolean;
}

const PENDING_REMEMBER_KEY = 'pendingRememberAccount';

function isPopupBlockedError(err: any): boolean {
  const code = err?.code as string | undefined;
  return (
    code === 'auth/popup-blocked' ||
    code === 'auth/popup-closed-by-user' ||
    code === 'auth/operation-not-supported-in-this-environment'
  );
}

async function authorizeAndPersistUser(user: any, rememberAccount: boolean): Promise<SignInResult> {
  try {
    if (!user || !user.email) {
      await firebaseSignOut(auth);
      return { success: false, error: 'No email returned from Google' };
    }

    // Authorization check
    if (!isAuthorizedEmail(user.email)) {
      await firebaseSignOut(auth);
      return {
        success: false,
        error: `Access denied: ${user.email} is not authorized for this console.`,
      };
    }

    const accountId = getAccountIdForEmail(user.email);

    // Persist based on remember flag
    if (rememberAccount) {
      localStorage.setItem('accountId', accountId);
      localStorage.setItem('iamUsername', user.email || '');
      localStorage.setItem('rememberAccount', 'true');
    } else {
      sessionStorage.setItem('currentAccountId', accountId);
      sessionStorage.setItem('currentIamUsername', user.email || '');
      localStorage.removeItem('accountId');
      localStorage.removeItem('iamUsername');
      localStorage.removeItem('rememberAccount');
    }

    // Store firebase user
    localStorage.setItem(
      'firebaseUser',
      JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      })
    );

    // Start session tracking
    try {
      sessionTracker.startSession(accountId, user.email || '');
    } catch (err) {
      // Non-fatal
      console.warn('session start failed', err);
    }

    return { success: true, user };
  } catch (err: any) {
    console.error('authorizeAndPersistUser error', err);
    if (err?.code) {
      return { success: false, error: err.code };
    }
    return { success: false, error: err?.message || 'Unknown error' };
  }
}

export async function signInAndAuthorize(rememberAccount = false): Promise<SignInResult> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return await authorizeAndPersistUser(result.user, rememberAccount);
  } catch (err: any) {
    // If popup is blocked, fall back to same-tab redirect.
    if (isPopupBlockedError(err)) {
      try {
        localStorage.setItem(PENDING_REMEMBER_KEY, rememberAccount ? 'true' : 'false');
      } catch {
        // ignore storage issues; sign-in can still proceed
      }
      await signInWithRedirect(auth, googleProvider);
      return { success: true, redirecting: true };
    }

    console.error('signInAndAuthorize error', err);
    if (err?.code) {
      return { success: false, error: err.code };
    }
    return { success: false, error: err?.message || 'Unknown error' };
  }
}

export async function completeRedirectSignIn(): Promise<SignInResult> {
  try {
    const result = await getRedirectResult(auth);
    if (!result || !result.user) return { success: true, skipped: true };

    let rememberAccount = false;
    try {
      const pending = localStorage.getItem(PENDING_REMEMBER_KEY);
      if (pending === 'true') rememberAccount = true;
      if (pending === 'false') rememberAccount = false;
      localStorage.removeItem(PENDING_REMEMBER_KEY);
    } catch {
      // ignore
    }

    return await authorizeAndPersistUser(result.user, rememberAccount);
  } catch (err: any) {
    console.error('completeRedirectSignIn error', err);
    if (err?.code) {
      return { success: false, error: err.code };
    }
    return { success: false, error: err?.message || 'Unknown error' };
  }
}

/**
 * Always uses same-tab redirect sign-in (no popups).
 * Useful for environments where popup auth is blocked by browser policy.
 */
export async function startRedirectSignIn(rememberAccount = false): Promise<SignInResult> {
  try {
    try {
      localStorage.setItem(PENDING_REMEMBER_KEY, rememberAccount ? 'true' : 'false');
    } catch {
      // ignore
    }
    await signInWithRedirect(auth, googleProvider);
    return { success: true, redirecting: true };
  } catch (err: any) {
    console.error('startRedirectSignIn error', err);
    if (err?.code) {
      return { success: false, error: err.code };
    }
    return { success: false, error: err?.message || 'Unknown error' };
  }
}
