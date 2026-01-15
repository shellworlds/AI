"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { startRedirectSignIn } from "@/lib/googleAuth";

function GithubMark({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.02c0 4.425 2.865 8.18 6.84 9.504.5.093.682-.217.682-.483 0-.237-.008-.866-.013-1.7-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.621.069-.609.069-.609 1.004.071 1.532 1.034 1.532 1.034.892 1.53 2.341 1.088 2.91.832.091-.647.35-1.089.636-1.339-2.22-.253-4.555-1.113-4.555-4.952 0-1.094.39-1.989 1.03-2.688-.103-.253-.446-1.27.098-2.647 0 0 .84-.27 2.75 1.026A9.52 9.52 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.026 2.747-1.026.546 1.377.203 2.394.1 2.647.64.699 1.028 1.594 1.028 2.688 0 3.848-2.339 4.696-4.566 4.945.359.31.679.923.679 1.86 0 1.343-.012 2.425-.012 2.755 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.02C22 6.484 17.523 2 12 2z" />
    </svg>
  );
}

function StarMark({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M12 2l3.1 6.9 7.5 1-5.5 5.2 1.4 7.4L12 19.8 5.5 22.5l1.4-7.4L1.4 9.9l7.5-1L12 2z" />
    </svg>
  );
}

function LinkedInMark({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M4.98 3.5C4.98 4.6 4.06 5.5 2.98 5.5 1.9 5.5 0.98 4.6 0.98 3.5 0.98 2.4 1.9 1.5 2.98 1.5 4.06 1.5 4.98 2.4 4.98 3.5zM0.5 8h4.96V24H0.5zM8 8h4.76v2.12h0.07c0.66-1.25 2.28-2.56 4.7-2.56 5.02 0 5.95 3.3 5.95 7.59V24H18.29v-7.86c0-1.88-0.03-4.3-2.62-4.3-2.63 0-3.03 2.05-3.03 4.16V24H8V8z" />
    </svg>
  );
}

export default function ConsoleLoginShell({
  consoleKey,
  title,
  subtitle,
  redirectTo,
  authStatus,
}: {
  consoleKey: "google" | "github";
  title: string;
  subtitle: string;
  redirectTo: string;
  authStatus?: React.ReactNode;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState<string | null>(null);
  const [subError, setSubError] = useState<string | null>(null);

  const googleLoginHref = "/google-console/login?autologin=1";
  const githubLoginHref = "/github-console/login?autologin=1";

  async function startLoginHere() {
    // Always use redirect flow (popup safe)
    await startRedirectSignIn(true);
  }

  async function handleIconLogin(target: "google" | "github") {
    // If already on the correct console login page, start auth immediately.
    if (target === consoleKey) {
      await startLoginHere();
      return;
    }
    // Otherwise switch to the other console login page and auto-login there.
    router.push(target === "google" ? googleLoginHref : githubLoginHref);
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="fixed top-0 left-0 right-0 z-[1000] bg-black/95 backdrop-blur border-b border-white/10">
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <span className="font-mono text-xs tracking-[0.15em] text-white/90">CFÖ</span>
            <ul className="hidden md:flex list-none gap-10 text-sm">
              <li>
                <a href="/google-console" className="text-white/60 hover:text-white transition-colors">
                  Overview
                </a>
              </li>
              <li>
                <a href="/github-console" className="text-white/60 hover:text-white transition-colors">
                  Console
                </a>
              </li>
            </ul>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://www.zi-us.com/contact"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 border border-white/40 text-white/90 hover:bg-white hover:text-black transition-colors font-mono text-xs tracking-[0.08em] uppercase"
              target="_blank"
              rel="noreferrer"
            >
              Contact
            </a>

            {/* Console button routes to Brand Strategy & Positioning page */}
            <a
              href="/brand-strategy-positioning"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 border border-white/40 text-white/90 hover:bg-white hover:text-black transition-colors font-mono text-xs tracking-[0.08em] uppercase"
            >
              Console
            </a>

            {/* Login directly by clicking icons */}
            <button
              type="button"
              onClick={() => handleIconLogin("google")}
              className="inline-flex items-center justify-center w-11 h-11 border border-white/40 hover:bg-white hover:text-black transition-colors"
              title="Login to Google Console"
              aria-label="Login to Google Console"
            >
              <img src="/google-color.svg" alt="Google" className="w-5 h-5 block" />
            </button>

            <button
              type="button"
              onClick={() => handleIconLogin("github")}
              className="inline-flex items-center justify-center w-11 h-11 border border-white/40 hover:bg-white hover:text-black transition-colors"
              title="Login to GitHub Console"
              aria-label="Login to GitHub Console"
            >
              <GithubMark className="w-5 h-5" />
            </button>

            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center w-11 h-11 border border-white/40 hover:bg-white hover:text-black transition-colors"
              title="LinkedIn"
              aria-label="LinkedIn"
            >
              <LinkedInMark className="w-5 h-5" />
            </a>
          </div>
        </div>
      </nav>

      <section className="pt-28 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-100 pointer-events-none heroGrid" />
        <div className="absolute inset-0 pointer-events-none heroFade" />
        <div className="absolute inset-0 pointer-events-none heroWord">QUANTUM BRAIN TRUST</div>

        <div className="relative z-[1] max-w-[1400px] mx-auto px-6">
          <div className="flex items-center gap-6 text-xs font-mono tracking-[0.3em] text-white/50">
            <span className="h-px w-16 bg-white/30" />
            <span>THE QUANTUM CONSOLE</span>
            <span className="h-px w-16 bg-white/30" />
          </div>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div>
              <h1 className="text-5xl md:text-7xl font-extralight tracking-[-0.05em] leading-[0.95]">
                <strong className="font-extrabold block">{title}</strong>
                Access Portal
              </h1>
              <p className="mt-8 text-lg md:text-xl text-white/60 max-w-[54ch] border-l-4 border-white/30 pl-6">
                {subtitle}
              </p>
            </div>

            <div>
              {authStatus}
              {/* Subscription-only card (login is via header icons) */}
              <div className="bg-white text-black border border-white/20 shadow-2xl p-8">
              <div className="text-xs font-mono tracking-[0.15em] text-black/70 uppercase">
                Newsletter
              </div>
              <div className="mt-2 text-2xl font-semibold">Subscribe for updates</div>
              <div className="mt-2 text-sm text-black/70">
                Product drops, security notes, and investor updates.
              </div>

              <form
                className="mt-6"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setSubError(null);
                  setSubscribed(null);
                  setSubmitting(true);
                  try {
                    const form = e.currentTarget;
                    const emailEl = form.elements.namedItem("email") as HTMLInputElement | null;
                    const email = (emailEl?.value || "").trim();
                    const res = await fetch("/api/contact", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        name: "Newsletter Subscriber",
                        email,
                        company: "",
                        phone: "",
                        service: "newsletter",
                        message: `Please subscribe ${email} to the newsletter.`,
                      }),
                    });
                    const data = await res.json();
                    if (!res.ok || !data?.success) {
                      throw new Error(data?.error || "Subscription failed");
                    }
                    setSubscribed(email);
                    if (emailEl) emailEl.value = "";
                  } catch (err: any) {
                    setSubError(err?.message || "Subscription failed");
                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                <label htmlFor="email" className="sr-only">
                  Email
                </label>
                <div className="flex items-center gap-3">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    className="flex-1 px-4 py-3 border border-black/10 rounded-none"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center justify-center w-12 h-12 bg-black text-white hover:bg-zinc-900 disabled:opacity-60 transition-colors"
                    title="Subscribe"
                    aria-label="Subscribe"
                  >
                    {submitting ? <span className="text-xs font-mono">…</span> : <StarMark className="w-5 h-5" />}
                  </button>
                </div>

                {subscribed && (
                  <div className="mt-4 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 p-3">
                    Subscribed: <span className="font-mono">{subscribed}</span>
                  </div>
                )}
                {subError && (
                  <div className="mt-4 text-sm text-rose-700 bg-rose-50 border border-rose-200 p-3">
                    {subError}
                  </div>
                )}
              </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .heroGrid {
          background:
            linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.92) 100%),
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 1px,
              rgba(255, 255, 255, 0.035) 1px,
              rgba(255, 255, 255, 0.035) 2px
            );
        }
        .heroFade {
          background: radial-gradient(circle at 20% 20%, rgba(0, 102, 255, 0.18), transparent 45%);
        }
        .heroWord {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18vw;
          font-weight: 900;
          letter-spacing: -0.05em;
          opacity: 0.05;
          white-space: nowrap;
          user-select: none;
        }
      `}</style>
    </div>
  );
}

