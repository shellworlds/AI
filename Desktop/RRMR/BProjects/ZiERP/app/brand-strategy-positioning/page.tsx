import React from "react";

export const metadata = {
  title: "Brand Strategy & Positioning | ZiERP Console",
  description:
    "A practical Brand Strategy & Positioning playbook: narrative, ICP, messaging, and go-to-market alignment.",
};

export default function BrandStrategyPositioningPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-xs font-mono tracking-[0.2em] uppercase text-slate-500">
          Marketing • Strategy
        </div>
        <h1 className="mt-3 text-4xl md:text-5xl font-semibold tracking-tight text-slate-900">
          Brand Strategy &amp; Positioning
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-slate-700">
          Brand strategy is not “design.” It is the operating system for how your company is perceived,
          remembered, and chosen—especially when features converge and competitors copy. Positioning is the
          disciplined decision of where you play, who you serve, and what promise you will repeatedly deliver.
          When done well, it compresses sales cycles, improves retention, and turns marketing into a measurable
          revenue engine.
        </p>

        <p className="mt-6 text-lg leading-relaxed text-slate-700">
          Our approach starts with the customer’s reality: the job they are trying to get done, the pain they
          feel today, and the alternatives they would choose if you didn’t exist. We map the market into clear
          segments, define an Ideal Customer Profile (ICP), and identify the category narrative that frames you
          as the obvious solution. From there we craft messaging that is simple enough to repeat and specific
          enough to prove—across website, product, sales, and support.
        </p>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-900">What we deliver</h2>
            <ul className="mt-4 space-y-2 text-slate-700">
              <li>• Category narrative &amp; competitive map</li>
              <li>• ICP definition + “who we are not” guardrails</li>
              <li>• Positioning statement + proof points</li>
              <li>• Messaging hierarchy (tagline → pillars → claims)</li>
              <li>• Sales enablement: talk tracks, objection handling, one-pagers</li>
            </ul>
          </div>
          <div className="border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-900">How success is measured</h2>
            <ul className="mt-4 space-y-2 text-slate-700">
              <li>• Higher win rates in target segments</li>
              <li>• Lower CAC via clearer targeting and conversion</li>
              <li>• Faster time-to-value messaging in product onboarding</li>
              <li>• Stronger retention with aligned expectations</li>
              <li>• Brand consistency across teams and channels</li>
            </ul>
          </div>
        </div>

        <p className="mt-10 text-lg leading-relaxed text-slate-700">
          If you want a brand that compounds—one that customers recommend, partners trust, and investors
          understand—start with positioning and bake it into every touchpoint. Great brands are built by
          repetition of a truth, not reinvention of a slogan.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href="/google-console/login"
            className="px-5 py-3 bg-slate-900 text-white hover:bg-slate-800 transition-colors"
          >
            Back to Console Login
          </a>
          <a
            href="/services"
            className="px-5 py-3 border border-slate-300 text-slate-800 hover:bg-slate-50 transition-colors"
          >
            View Services
          </a>
        </div>
      </div>
    </main>
  );
}

