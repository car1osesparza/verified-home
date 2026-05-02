"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Card, Col, Row } from "antd";

const LIVE = {
  recruitingAcademy: "https://verifiedathletics.com/recruiting-academy",
  athletes: "https://verifiedathletics.com/athletes",
  allSportsCoaches: "https://verifiedathletics.com/all-sports-coaches",
};

const TOC = [
  { id: "hs-football-coaches", label: "High School Football Coaches" },
  { id: "recruiting-academy", label: "Recruiting Academy" },
  { id: "athletes-transfers", label: "Athletes & Transfers" },
  { id: "juco-more", label: "JUCO & College Coach Context" },
];

/** Clears sticky section nav so the section headline lands below it (HashScroll reads this). */
const ANCHOR_OFFSET_PX = 72;

function Checklist({ items }) {
  return (
    <ul className="resources-checklist">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export default function ResourcesPageContent() {
  const [activeSection, setActiveSection] = useState("");

  const goToSection = useCallback((id) => {
    window.location.hash = id;
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash.length > 1) {
      setActiveSection(decodeURIComponent(window.location.hash.slice(1)));
    }
  }, []);

  useEffect(() => {
    const nodes = TOC.map((t) => document.getElementById(t.id)).filter(Boolean);
    if (!nodes.length) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting && e.target.id)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) {
          setActiveSection(visible[0].target.id);
        }
      },
      { root: null, rootMargin: "-48px 0px -55% 0px", threshold: [0, 0.1, 0.25] },
    );

    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="section marketing-page resources-page">
      <div className="container">
        <header className="resources-hero">
          <h1 className="resources-h1">Free resources for coaches, athletes, and families</h1>
          <p className="resources-hero-sub">
            Get your information in front of college programs, understand how recruiting works, and take
            the right next step—without paying athlete fees.
          </p>
        </header>

        <nav className="resources-toc resources-toc--tabs" aria-label="On this page">
          {TOC.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className={activeSection === id ? "is-active" : undefined}
              onClick={(e) => {
                e.preventDefault();
                goToSection(id);
              }}
            >
              {label}
            </a>
          ))}
        </nav>

        <section
          id="hs-football-coaches"
          className="resources-section resources-anchor"
          data-anchor-offset={ANCHOR_OFFSET_PX}
        >
          <h2 className="resources-h2">Free tools for high school football programs</h2>
          <p className="lead">
            Manage your roster, share structured athlete profiles with college staffs, and understand who
            is engaging with your program—all in one place.
          </p>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Card title="Claim Your Team">
                <p className="resources-prose">
                  Add your team and athlete information so college coaches can find, evaluate, and contact
                  your players.
                </p>
                <p className="resources-prose resources-prose-strong">What you get</p>
                <Checklist
                  items={[
                    "Structured profiles for every athlete",
                    "Shareable prospect sheets for recruiters",
                    "Visibility across a nationwide coach network",
                    "Access to coach interest and evaluations",
                  ]}
                />
                <a className="btn red resources-card-cta" href={LIVE.athletes} target="_blank" rel="noreferrer">
                  Claim Your Team
                </a>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title="Why It Matters">
                <p className="resources-prose">
                  College programs use Verified to evaluate prospects at scale. When your athletes are in
                  the same system coaches already trust, they get seen faster—and stay visible as recruiting
                  activity accelerates.
                </p>
                <a className="btn light resources-card-cta" href={LIVE.athletes} target="_blank" rel="noreferrer">
                  Learn More About Visibility
                </a>
              </Card>
            </Col>
          </Row>
        </section>

        <section
          id="recruiting-academy"
          className="resources-section resources-anchor"
          data-anchor-offset={ANCHOR_OFFSET_PX}
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
              Use the Academy to understand the process, avoid common mistakes, and prepare for what coaches
              are actually looking for.
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

        <section
          id="athletes-transfers"
          className="resources-section resources-anchor"
          data-anchor-offset={ANCHOR_OFFSET_PX}
        >
          <h2 className="resources-h2">Get seen. Stay organized. Move faster.</h2>
          <p className="lead">
            Verified helps athletes increase exposure and simplify communication with college programs—
            without charging athlete fees.
          </p>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Card title="NCAA Transfer Athletes">
                <p className="resources-prose">
                  If you&apos;re in the transfer portal, Verified helps coaches find and evaluate you.
                </p>
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
            </Col>
            <Col xs={24} md={12}>
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
            </Col>
          </Row>
          <div className="resources-cta-row">
            <a className="btn light resources-ext-link" href={LIVE.athletes} target="_blank" rel="noreferrer">
              Go to Athlete Hub
            </a>
            <a className="btn red resources-ext-link" href={LIVE.athletes} target="_blank" rel="noreferrer">
              Get Started
            </a>
          </div>
        </section>

        <section
          id="juco-more"
          className="resources-section resources-anchor"
          data-anchor-offset={ANCHOR_OFFSET_PX}
        >
          <h2 className="resources-h2">Full visibility across transfer and JUCO recruiting</h2>
          <p className="lead">
            Verified brings together transfer portal data and junior college athletes into one system, so
            four-year programs can evaluate the full recruiting landscape.
          </p>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Card title="Four-Year College Coaches">
                <p className="resources-prose">
                  Evaluate JUCO athletes alongside transfer portal movement using a unified dataset.
                </p>
                <p className="resources-prose resources-prose-strong">What you get</p>
                <Checklist
                  items={[
                    "NJCAA, CCCAA, and NWAC athlete data",
                    "Integrated evaluation alongside transfer activity",
                    "Better visibility into emerging opportunities",
                  ]}
                />
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title="JUCO Coaches">
                <p className="resources-prose">Promote your athletes to four-year programs at no cost.</p>
                <p className="resources-prose resources-prose-strong">What you can do</p>
                <Checklist
                  items={[
                    "Upload transcripts, GPAs, and evaluations",
                    "Share contact and recruiting information",
                    "Increase visibility for your roster",
                  ]}
                />
                <a className="btn red resources-card-cta" href={LIVE.athletes} target="_blank" rel="noreferrer">
                  Claim Your Team
                </a>
              </Card>
            </Col>
          </Row>
          <p className="resources-support-cta-label">Looking for transfer-specific tools?</p>
          <a className="btn light resources-ext-link" href={LIVE.allSportsCoaches} target="_blank" rel="noreferrer">
            View Transfer Management Page
          </a>
        </section>

        <section className="resources-funnel" aria-labelledby="resources-funnel-heading">
          <h2 id="resources-funnel-heading" className="resources-funnel-heading">
            Are you a college coach?
          </h2>
          <div className="resources-funnel-actions">
            <Link href={{ pathname: "/", hash: "product" }} className="btn light">
              View product
            </Link>
            <Link href={{ pathname: "/", hash: "pricing" }} className="btn red">
              View pricing
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
