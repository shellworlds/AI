"use client";

import React, { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";

import { auth } from "@/lib/firebase";
import { isAuthorizedEmail } from "@/lib/authConfig";
import { completeRedirectSignIn, startRedirectSignIn } from "@/lib/googleAuth";

import ConsoleLoginShell from "@/components/ConsoleWelcome/ConsoleLoginShell";

export default function GithubConsoleLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    completeRedirectSignIn()
      .then((res) => {
        if (!res.success && !res.skipped) setAuthError(prettyError(res.error || "Sign-in failed"));
      })
      .catch(() => {
        // non-fatal
      });

    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!loading && user?.email && isAuthorizedEmail(user.email)) {
      router.replace("/github-console");
    }
  }, [loading, user, router]);

  useEffect(() => {
    const auto = searchParams?.get("autologin");
    if (auto === "1" && !loading && !user) {
      startRedirectSignIn(true).catch(() => {
        // non-fatal
      });
    }
  }, [searchParams, loading, user]);

  const authStatus = useMemo(() => {
    if (authError) {
      return (
        <div className="mb-4 text-sm text-rose-700 bg-rose-50 border border-rose-200 p-3">
          {authError}
        </div>
      );
    }
    if (!loading && user?.email && !isAuthorizedEmail(user.email)) {
      return (
        <div className="mb-4 text-sm text-rose-700 bg-rose-50 border border-rose-200 p-3">
          Access denied: this Google account isn’t authorized for the console.
        </div>
      );
    }
    return null;
  }, [loading, user, authError]);

  return (
    <ConsoleLoginShell
      consoleKey="github"
      title="Algebraic Key Vault"
      subtitle="Secure, Google-authenticated access to your GitHub console and developer workflows."
      redirectTo="/github-console"
      authStatus={authStatus}
    />
  );
}

function prettyError(codeOrMessage: string): string {
  if (!codeOrMessage) return "Sign-in failed";
  if (codeOrMessage.includes("auth/unauthorized-domain")) {
    return `Login blocked: localhost is not an authorized domain in Firebase. Add "localhost" in Firebase → Authentication → Settings → Authorized domains.`;
  }
  if (codeOrMessage.includes("auth/operation-not-allowed")) {
    return `Google sign-in is disabled for this Firebase project. Enable Google provider in Firebase → Authentication → Sign-in method.`;
  }
  if (codeOrMessage.toLowerCase().includes("access denied")) {
    return `${codeOrMessage}\nFix: add this email to lib/authConfig.ts (ALLOWED_GOOGLE_ACCOUNTS).`;
  }
  return codeOrMessage;
}

