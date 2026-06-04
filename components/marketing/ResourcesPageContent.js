"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Card } from "antd";
import HomeMapDominanceBlock from "../HomeMapDominanceBlock";
import { MAP_DOMINANCE_HEADLINE_RESOURCES } from "../../lib/home-map-dominance-copy";
import AthletesHeroVideo from "./AthletesHeroVideo";
import TransferSurveyModal from "./TransferSurveyModal";
import { RECRUITING_ACADEMY_URL } from "../../lib/external-links";
import { isRecruitsPath } from "../../lib/recruits-path";

const LIVE = {
  recruitingAcademy: RECRUITING_ACADEMY_URL,
  collegeSelector: "https://app.verifiedathletics.com/college-selector",
  hsCoach: "https://app.verifiedathletics.com/hs-coach",
};

const DEFAULT_SECTION = "hs-football-coaches";

const TOC = [
  { id: "hs-football-coaches", label: "High School Football Coaches" },
  { id: "hs-athletes", label: "HS Athletes" },
  { id: "transfer-athletes", label: "Transfer Athletes" },
  { id: "recruiting-academy", label: "Recruiting Academy" },
];

const LEGACY_SECTION_HASH = {
  "athletes-transfers": "hs-athletes",
};

const SECTION_IDS = new Set(TOC.map((t) => t.id));

const homeProductHref = { pathname: "/", hash: "product" };
const homePricingHref = { pathname: "/", hash: "pricing" };

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

const HS_ATHLETES_HERO_BULLETS = [
  "Get matched with college football programs based on your athletic, academic, and college preferences",
  "Gain exposure to college coaches nationwide across all levels of college football",
  "View real evaluations and feedback from college coaches",
  "Learn about the recruiting process through the Verified Athletics Recruiting Academy",
];

function AthletesVideoHero() {
  return (
    <div className="resources-athletes-hero">
      <AthletesHeroVideo variant="background" />
      <div className="resources-athletes-hero-grad" aria-hidden="true" />
      <div className="resources-athletes-hero-inner">
        <h2 className="resources-athletes-hero-title">Take Control of your Recruiting Journey.</h2>
        <p className="resources-athletes-hero-lead">
          Verified helps athletes build exposure and prepare for every recruiting opportunity.
        </p>
      </div>
    </div>
  );
}

export default function ResourcesPageContent() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState(DEFAULT_SECTION);
  const [navOffsetPx, setNavOffsetPx] = useState(68);
  const [transferSurveyOpen, setTransferSurveyOpen] = useState(false);
  const tocRef = useRef(null);

  const scrollToSectionTop = useCallback(
    (id) => {
      if (typeof window === "undefined") {
        return;
      }

      const run = () => {
        const nav = document.querySelector(".dark-nav");
        const toc = tocRef.current;
        const navH = nav ? Math.ceil(nav.getBoundingClientRect().height) : navOffsetPx;
        const tocH = toc ? Math.ceil(toc.getBoundingClientRect().height) : 0;
        const offset = navH + tocH + 12;

        const anchor = document.getElementById(`resources-panel-${id}`);
        if (anchor) {
          const top = anchor.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top: Math.max(0, top), left: 0, behavior: "auto" });
          return;
        }

        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      };

      requestAnimationFrame(run);
    },
    [navOffsetPx],
  );

  const selectSection = useCallback(
    (id) => {
      if (!SECTION_IDS.has(id) || typeof window === "undefined") {
        return;
      }
      setActiveSection(id);
      const nextHash = `#${id}`;
      const nextUrl = `${window.location.pathname}${window.location.search}${nextHash}`;
      if (window.location.hash !== nextHash) {
        window.history.replaceState(null, "", nextUrl);
      }
    },
    [],
  );

  const applySectionFromHash = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }
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
  }, []);

  useLayoutEffect(() => {
    if (!isRecruitsPath(pathname)) {
      return;
    }
    applySectionFromHash();
  }, [pathname, applySectionFromHash]);

  useLayoutEffect(() => {
    if (!isRecruitsPath(pathname)) {
      return;
    }
    scrollToSectionTop(activeSection);
  }, [activeSection, pathname, scrollToSectionTop]);

  useEffect(() => {
    if (!isRecruitsPath(pathname)) {
      return undefined;
    }
    window.addEventListener("hashchange", applySectionFromHash);
    return () => window.removeEventListener("hashchange", applySectionFromHash);
  }, [pathname, applySectionFromHash]);

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
      const id = resolveSectionFromHash(url.hash);
      setActiveSection(id);
      const nextUrl = `${url.pathname}${url.search}${url.hash}`;
      if (window.location.hash !== url.hash) {
        window.history.replaceState(null, "", nextUrl);
      }
    };

    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.classList.add("recruits-page-active");
    return () => document.documentElement.classList.remove("recruits-page-active");
  }, []);

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
              <h1 className="resources-h1">Recruits</h1>
            </header>
          </div>

          <nav
            ref={tocRef}
            className="resources-toc resources-toc--tabs"
            aria-label="Recruits categories"
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
                <div id="resources-panel-hs-football-coaches" className="resources-panel-anchor" />
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

                  <section className="resources-funnel resources-funnel--inline" aria-labelledby="resources-funnel-heading">
                    <h2 id="resources-funnel-heading" className="resources-funnel-heading">
                      Are you a college coach?
                    </h2>
                    <div className="resources-funnel-actions">
                      <Link href={homeProductHref} className="btn light">
                        View product
                      </Link>
                      <Link href={homePricingHref} className="btn red">
                        View pricing
                      </Link>
                    </div>
                  </section>
                </section>
              </div>
            )}

            {activeSection === "hs-athletes" && (
              <section
                role="tabpanel"
                aria-labelledby="resources-tab-hs-athletes"
                className="resources-section resources-section--athletes resources-panel"
              >
                <div id="resources-panel-hs-athletes" className="resources-panel-anchor" />
                <AthletesVideoHero />
                <div className="container resources-section-body">
                  <Checklist items={HS_ATHLETES_HERO_BULLETS} />
                  <div className="resources-cta-row">
                    <a
                      className="btn red resources-ext-link"
                      href={LIVE.collegeSelector}
                      target="_blank"
                      rel="noreferrer"
                    >
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
                <div id="resources-panel-transfer-athletes" className="resources-panel-anchor" />
                <AthletesVideoHero />
                <div className="container resources-section-body">
                  <Card title="NCAA Transfer Athletes">
                    <p className="resources-prose">
                      The transfer portal is crowded and difficult for coaches to navigate. Verified
                      Athletics organizes key player information in one place so coaches can evaluate
                      athletes faster and more efficiently.
                    </p>
                    <p className="resources-prose">
                      By completing your profile, you make it easier for college programs to find,
                      understand, and contact you.
                    </p>
                    <button
                      type="button"
                      className="btn red resources-card-cta"
                      onClick={() => setTransferSurveyOpen(true)}
                    >
                      Request Transfer Survey
                    </button>
                  </Card>
                </div>
              </section>
            )}

            {activeSection === "recruiting-academy" && (
              <div className="container">
                <div id="resources-panel-recruiting-academy" className="resources-panel-anchor" />
                <section
                  role="tabpanel"
                  aria-labelledby="resources-tab-recruiting-academy"
                  className="resources-section resources-panel"
                >
                  <h2 className="resources-h2">
                    Learn how college recruiting actually works with the Football Recruiting Academy
                  </h2>
                  <p className="lead">
                    A complete guide to the recruiting process—from discovery through commitment.
                  </p>
                  <Card>
                    <p className="resources-prose resources-prose-strong">Topics include</p>
                    <Checklist
                      items={[
                        "What College Coaches Actually Look For First",
                        "Are You Really Being Recruited — Or Just Being Contacted?",
                        "Why Waiting Too Long Can Cost You a Scholarship",
                        "The Recruiting Timeline Most Athletes Get Wrong",
                        "Why Most Athletes End Up Playing at a Different Level Than Expected",
                      ]}
                    />
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
          </div>
        </div>
      </div>

      <TransferSurveyModal open={transferSurveyOpen} onClose={() => setTransferSurveyOpen(false)} />
    </div>
  );
}
