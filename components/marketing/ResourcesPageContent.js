"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Card } from "antd";
import HomeMapDominanceBlock from "../HomeMapDominanceBlock";
import { MAP_DOMINANCE_HEADLINE_RESOURCES } from "../../lib/home-map-dominance-copy";
import AthletesHeroVideo from "./AthletesHeroVideo";
import { isRecruitsPath } from "../../lib/recruits-path";

const LIVE = {
  recruitingAcademy: "https://verifiedathletics.com/recruiting-academy",
  athletes: "https://verifiedathletics.com/athletes",
  allSportsCoaches: "https://verifiedathletics.com/all-sports-coaches",
  hsCoach: "https://app.verifiedathletics.com/hs-coach",
};

const DEFAULT_SECTION = "hs-football-coaches";

const TOC = [
  { id: "hs-football-coaches", label: "High School Football Coaches" },
  { id: "hs-athletes", label: "HS Athletes" },
  { id: "transfer-athletes", label: "Transfer Athletes" },
  { id: "recruiting-academy", label: "Recruiting Academy" },
];

/** Deep links that pointed at the old combined athletes section. */
const LEGACY_SECTION_HASH = {
  "athletes-transfers": "hs-athletes",
};

const SECTION_IDS = new Set(TOC.map((t) => t.id));

function resolveSectionFromHash(hash) {
  if (!hash || hash.length < 2) {
    return DEFAULT_SECTION;
  }
  const raw = decodeURIComponent(hash.slice(1));
  const id = LEGACY_SECTION_HASH[raw] ?? raw;
  return SECTION_IDS.has(id) ? id : DEFAULT_SECTION;
}

function Checklist({ items }) {
  return (
    <ul className="resources-checklist">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function AthletesResourcesHero() {
  return (
    <div className="resources-athletes-hero">
      <AthletesHeroVideo variant="background" />
      <div className="resources-athletes-hero-grad" aria-hidden="true" />
      <div className="resources-athletes-hero-inner">
        <h2 className="resources-athletes-hero-title">Get seen. Stay organized. Move faster.</h2>
        <p className="resources-athletes-hero-lead">
          Verified helps athletes increase exposure and simplify communication with college programs—without
          charging athlete fees.
        </p>
      </div>
    </div>
  );
}

export default function ResourcesPageContent() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState(DEFAULT_SECTION);
  const [navOffsetPx, setNavOffsetPx] = useState(68);
  const tocRef = useRef(null);

  const selectSection = useCallback((id) => {
    if (!SECTION_IDS.has(id) || typeof window === "undefined") {
      return;
    }
    const scrollY = window.scrollY;
    setActiveSection(id);
    const nextHash = `#${id}`;
    const nextUrl = `${window.location.pathname}${window.location.search}${nextHash}`;
    if (window.location.hash !== nextHash) {
      window.history.replaceState(null, "", nextUrl);
    }
    requestAnimationFrame(() => window.scrollTo(0, scrollY));
  }, []);

  const applySectionFromHash = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }
    const scrollY = window.scrollY;
    const id = resolveSectionFromHash(window.location.hash);
    setActiveSection(id);
    const nextHash = `#${id}`;
    if (window.location.hash !== nextHash) {
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${window.location.search}${nextHash}`,
      );
    }
    requestAnimationFrame(() => window.scrollTo(0, scrollY));
  }, []);

  useLayoutEffect(() => {
    if (!isRecruitsPath(pathname)) {
      return;
    }
    applySectionFromHash();
  }, [pathname, applySectionFromHash]);

  useEffect(() => {
    if (!isRecruitsPath(pathname)) {
      return undefined;
    }
    window.addEventListener("hashchange", applySectionFromHash);
    return () => window.removeEventListener("hashchange", applySectionFromHash);
  }, [pathname, applySectionFromHash]);

  /** Next.js client links to #section on /resources may not fire hashchange. */
  useEffect(() => {
    if (!isRecruitsPath(pathname)) {
      return undefined;
    }

    const onDocClick = (event) => {
      const anchor = event.target.closest?.('a[href*="#"]');
      if (!anchor) {
        return;
      }
      let url;
      try {
        url = new URL(anchor.href, window.location.origin);
      } catch {
        return;
      }
      if (!isRecruitsPath(url.pathname) || url.pathname !== window.location.pathname) {
        return;
      }
      if (!url.hash || url.hash.length < 2) {
        return;
      }
      event.preventDefault();
      const scrollY = window.scrollY;
      const id = resolveSectionFromHash(url.hash);
      setActiveSection(id);
      const nextUrl = `${url.pathname}${url.search}${url.hash}`;
      if (window.location.hash !== url.hash) {
        window.history.replaceState(null, "", nextUrl);
      }
      requestAnimationFrame(() => window.scrollTo(0, scrollY));
    };

    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [pathname]);

  useEffect(() => {
    const measureChrome = () => {
      const nav = document.querySelector(".dark-nav");
      const navH = nav ? Math.ceil(nav.getBoundingClientRect().height) : 68;
      setNavOffsetPx(navH);
    };

    const rafId = requestAnimationFrame(measureChrome);
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measureChrome) : null;
    const nav = document.querySelector(".dark-nav");
    if (ro && nav) ro.observe(nav);
    if (ro && tocRef.current) ro.observe(tocRef.current);
    window.addEventListener("resize", measureChrome);
    return () => {
      cancelAnimationFrame(rafId);
      ro?.disconnect();
      window.removeEventListener("resize", measureChrome);
    };
  }, []);

  return (
    <div className="resources-page-root">
      <HomeMapDominanceBlock
        headline={MAP_DOMINANCE_HEADLINE_RESOURCES}
        className="map-sec--resources-hero"
      />

      <div
        className="section marketing-page resources-page"
        style={{ "--resources-nav-offset": `${navOffsetPx}px` }}
      >
        <div className="resources-page-content">
          <div className="container">
            <header className="resources-hero">
              <h1 className="resources-h1">
                Free resources for high school coaches, athletes, and families
              </h1>
            </header>
          </div>

          <nav
            ref={tocRef}
            className="resources-toc resources-toc--tabs"
            aria-label="Resource categories"
          >
            <div className="container resources-toc-inner" role="tablist">
              {TOC.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  id={`resources-tab-${id}`}
                  aria-selected={activeSection === id}
                  aria-controls={`resources-panel-${id}`}
                  className={activeSection === id ? "is-active" : undefined}
                  onClick={() => selectSection(id)}
                >
                  {label}
                </button>
              ))}
            </div>
          </nav>

          <div className="resources-panels">
            {activeSection === "hs-football-coaches" && (
              <div className="container">
                <section
                  role="tabpanel"
                  aria-labelledby="resources-tab-hs-football-coaches"
                  className="resources-section resources-panel"
                >
                  <h2 className="resources-h2">Free tools for high school football programs</h2>
                  <p className="lead">
                    Help your players get recruited with a modern platform built for high school coaches.
                    Manage your roster, create organized athlete profiles for college staffs, and see which
                    college programs are engaging with your team — all in one place.
                  </p>
                  <a
                    className="btn red resources-card-cta"
                    href={LIVE.hsCoach}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Claim Your Team
                  </a>
                </section>
              </div>
            )}

            {activeSection === "hs-athletes" && (
              <section
                role="tabpanel"
                aria-labelledby="resources-tab-hs-athletes"
                className="resources-section resources-section--athletes resources-panel"
              >
                <AthletesResourcesHero />

                <div className="container resources-section-body">
                  <Card title="High School & JUCO Football Athletes">
                    <p className="resources-prose">
                      Create a structured profile that can be shared across college programs nationwide.
                    </p>
                    <p className="resources-prose resources-prose-strong">What you get</p>
                    <Checklist
                      items={[
                        "AI-assisted school matching",
                        "Profile distribution across coach networks",
                        "Coach evaluations and feedback visibility",
                      ]}
                    />
                    <p className="resources-prose">
                      Use the Recruiting Academy to understand how to position yourself and move through the
                      process.
                    </p>
                  </Card>
                  <div className="resources-cta-row">
                    <a className="btn light resources-ext-link" href={LIVE.athletes} target="_blank" rel="noreferrer">
                      Go to Athlete Hub
                    </a>
                    <a className="btn red resources-ext-link" href={LIVE.athletes} target="_blank" rel="noreferrer">
                      Get Started
                    </a>
                  </div>
                </div>
              </section>
            )}

            {activeSection === "transfer-athletes" && (
              <section
                role="tabpanel"
                aria-labelledby="resources-tab-transfer-athletes"
                className="resources-section resources-section--athletes resources-panel"
              >
                <AthletesResourcesHero />

                <div className="container resources-section-body">
                  <h2 className="resources-h2">Resources for NCAA transfer athletes</h2>
                  <p className="lead">
                    If you&apos;re in the transfer portal, Verified helps college coaches find and evaluate you.
                  </p>
                  <Card title="NCAA Transfer Athletes">
                    <p className="resources-prose resources-prose-strong">How it works</p>
                    <Checklist
                      items={[
                        "Complete your transfer survey",
                        "Get added to the database coaches already use",
                        "Stay visible as programs evaluate transfer options",
                      ]}
                    />
                    <a className="btn red resources-card-cta" href={LIVE.athletes} target="_blank" rel="noreferrer">
                      Request Transfer Survey
                    </a>
                  </Card>
                </div>
              </section>
            )}

            {activeSection === "recruiting-academy" && (
              <div className="container">
                <section
                  role="tabpanel"
                  aria-labelledby="resources-tab-recruiting-academy"
                  className="resources-section resources-panel"
                >
                  <h2 className="resources-h2">Learn how college recruiting actually works</h2>
                  <p className="lead">
                    A complete guide to the recruiting process—from discovery through commitment.
                  </p>
                  <Card>
                    <p className="resources-prose resources-prose-strong">Topics include</p>
                    <Checklist
                      items={[
                        "What college coaches evaluate on and off the field",
                        "Division options and pathways",
                        "Recruiting timelines by level",
                        "How coaches build and manage recruiting boards",
                        "How contacts, offers, and commitments happen",
                      ]}
                    />
                    <p className="resources-prose">
                      Use the Academy to understand the process, avoid common mistakes, and prepare for what
                      coaches are actually looking for.
                    </p>
                    <a
                      className="btn red resources-card-cta"
                      href={LIVE.recruitingAcademy}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open Recruiting Academy
                    </a>
                  </Card>
                </section>
              </div>
            )}

            <div className="container">
              <section className="resources-funnel" aria-labelledby="resources-funnel-heading">
                <h2 id="resources-funnel-heading" className="resources-funnel-heading">
                  Are you a college coach?
                </h2>
                <div className="resources-funnel-actions">
                  <Link href="/#product" className="btn light">
                    View product
                  </Link>
                  <Link href="/#pricing" className="btn red">
                    View pricing
                  </Link>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
