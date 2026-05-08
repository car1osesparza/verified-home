"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Card, Col, Collapse, Row, Typography } from "antd";
import { SPORTS } from "../../lib/site-data";
import { getSelectedSport } from "../../lib/sport-preference";

const { Title, Paragraph } = Typography;

const FOOTBALL_TIERS = [
  {
    name: "Silver",
    prices: { "3-year": "$2,025/year", "1-year": "$3,190/year" },
    description: "Core access for identifying high school and early transfer talent.",
    includes: [
      "High School Database",
      "Camp Measurables",
      "Rising Senior Athletes",
      "Rising Senior AI Suggested Targets",
      "Enhanced Transfer Database, excluding Power 5",
    ],
  },
  {
    name: "Silver+",
    prices: { "3-year": "$3,500/year", "1-year": "$5,465/year" },
    description: "Adds deeper filtering, offer alerts, and score tracking.",
    includes: ["Everything in Silver", "Search by Income", "Non-D1 Offer Alerts", "Non-D1 Score Tracker"],
  },
  {
    name: "Gold",
    badge: "Most Popular",
    prices: { "3-year": "$4,175/year", "1-year": "$5,895/year" },
    description:
      "Full recruiting visibility across athlete databases, transfer activity, alerts, and AI tools.",
    includes: [
      "Everything in Silver+",
      "Full Athlete Database",
      "Full AI Suggested Targets",
      "Full Enhanced Transfer Database",
      "Offer Alerts",
      "Score Tracker",
      "AI Video Analysis",
      "Track Data",
      "Pre-Portal Predictions",
      "Daily ARMS Integration",
    ],
  },
  {
    name: "Platinum",
    prices: { "3-year": "$11,050/year", "1-year": "$7,375/year" },
    description: "Advanced recruiting operations tools for larger or more specialized programs.",
    includes: [
      "Everything in Gold",
      "CAP Manager",
      "Camp Testing Numbers and Video",
      "Road Planning Tool",
      "Custom Layouts",
    ],
  },
];

const ALL_SPORTS_TIERS = [
  {
    name: "Starter",
    prices: { "3-year": "$825/year", "1-year": "$1,300/year" },
    description: "Core transfer database access for college programs.",
    includes: ["D1 Transfers", "D2 Transfers", "D3 Transfers", "Excludes Power 4 players"],
  },
  {
    name: "Starter+",
    prices: { "3-year": "$1,425/year", "1-year": "$2,225/year" },
    description: "Expanded access with JUCO player data and team-level options.",
    includes: [
      "Everything in Starter",
      "JUCO Player Database",
      "Discounts available for 2-team and athletic department deals",
    ],
  },
  {
    name: "Elite",
    prices: { "3-year": "$1,700/year", "1-year": "$2,400/year" },
    description: "Full transfer access with Verified Ratings.",
    includes: ["All D1 Transfers", "All D2 Transfers", "All D3 Transfers", "Verified Ratings"],
  },
  {
    name: "Ultra",
    prices: { "3-year": "$4,500/year", "1-year": "$3,000/year" },
    description: "Advanced recruiting intelligence with expanded data and custom modeling.",
    includes: ["Everything in Elite", "Pre-Portal Database", "JUCO Players", "Custom Player Modeling"],
  },
];

const FAQ_ITEMS = [
  {
    key: "sport",
    label: "Why does pricing vary by sport?",
    children: (
      <p>
        Recruiting workflows, transfer dynamics, available data, and package access vary by sport. Select your
        sport to view the package structure that applies to your program.
      </p>
    ),
  },
  {
    key: "package",
    label: "Do I need to choose a package before booking a demo?",
    children: (
      <p>
        No. Choose your sport first so we can route you to the right specialist. The demo will help determine
        which package fits your program.
      </p>
    ),
  },
  {
    key: "signup",
    label: "Is there a self-serve signup?",
    children: (
      <p>
        No. Verified Athletics uses a demo-based process so each program can be matched with the right access,
        data, and package structure.
      </p>
    ),
  },
  {
    key: "athletes",
    label: "Are athletes charged to use Verified Athletics?",
    children: (
      <p>No. Athletes are not the paying customer. Athlete-facing resources are designed to support visibility and education.</p>
    ),
  },
  {
    key: "hs",
    label: "Is high school coach access paid?",
    children: (
      <p>High school football coaches can access free tools to claim their team and support athlete visibility.</p>
    ),
  },
];

export function PricingDynamicsAndFaqs({ sport }) {
  if (!sport) {
    return null;
  }

  return (
    <div className="pricing-page-tail marketing-page">
      <div className="pricing-faq pricing-faq-collapse">
        <Title level={3}>FAQs</Title>
        <Collapse bordered={false} expandIconPosition="end" items={FAQ_ITEMS} className="pricing-faq-accordion" />
      </div>
    </div>
  );
}

export default function PricingPageContent({
  afterTierGridSlot = null,
  deferContextAndFaq = false,
  tightSectionBottom = false,
}) {
  const [sport, setSport] = useState();
  const [contractTerm, setContractTerm] = useState("3-year");

  useEffect(() => {
    const stored = getSelectedSport(SPORTS);
    if (stored) {
      setSport(stored);
    }
  }, []);

  const tiers = useMemo(() => {
    if (!sport) {
      return [];
    }
    return sport === "Football" ? FOOTBALL_TIERS : ALL_SPORTS_TIERS;
  }, [sport]);

  useEffect(() => {
    const onSportUpdated = (event) => {
      const nextSport = event.detail?.sport;
      if (nextSport && SPORTS.includes(nextSport)) {
        setSport(nextSport);
      }
    };

    window.addEventListener("va:selected-sport", onSportUpdated);
    return () => window.removeEventListener("va:selected-sport", onSportUpdated);
  }, []);

  const isFootball = sport === "Football";
  const showSpecialNote = ["Golf", "Tennis", "Lacrosse"].includes(sport);
  const openSportModal = (event) => {
    event.preventDefault();
    window.dispatchEvent(new CustomEvent("va:open-sport-modal"));
  };

  const showInlineContextAndFaq = Boolean(sport) && !deferContextAndFaq;

  return (
    <div
      className={`section marketing-page pricing-section-surface${
        tightSectionBottom ? " section-pricing-tight-bottom" : ""
      }`}
    >
      <div className="container pricing-page">
        {!sport ? (
          <>
            <Title>Packages by sport</Title>
            <Paragraph className="lead">
              Verified Athletics packages vary by sport because recruiting workflows, data needs, and transfer
              dynamics vary by sport.
            </Paragraph>
            <Paragraph className="pricing-prompt">Select your sport to see relevant packages and pricing.</Paragraph>
            <div className="pricing-cta-row">
              <button type="button" className="btn red" data-open-sport-modal="true" onClick={openSportModal}>
                Select Your Sport
              </button>
              <button
                type="button"
                className="btn light"
                data-requires-sport="true"
                title="Select your sport for a tailored demo experience."
              >
                Book a Demo
              </button>
            </div>
            <Card className="pricing-note-card">
              <strong>Free for Athletes and HS Coaches:</strong> If you are not a college program, use our free
              tools and guides.
              {" "}
              <Link href="/resources">Go to Athlete/HS resources</Link>.
            </Card>

            <div className="simplePanel pricing-context">
              <Title level={3}>One platform, sport-specific access</Title>
              <Paragraph>
                Verified Athletics gives college programs recruiting intelligence across athlete databases, transfer
                activity, alerts, and evaluation tools. Select your sport to see the package structure that applies
                to your program.
              </Paragraph>
            </div>

            <Card className="pricing-empty-card">
              <Title level={4}>Choose a sport to view pricing.</Title>
              <Paragraph>
                We'll show the packages, contract options, and demo path that match your recruiting needs.
              </Paragraph>
            </Card>
          </>
        ) : (
          <>
            <Title className="headline-match-pricing">
              {isFootball ? "Football recruiting intelligence packages" : `Pricing for college ${sport} programs`}
            </Title>
            <Paragraph className="lead">
              {isFootball
                ? "Sport-specific packages for football staffs that need transfer intelligence, measurables, AI-suggested targets, and recruiting workflow tools."
                : (
                  <>
                    Sport-specific pricing for college programs using transfer intelligence and recruiting workflow
                    tools. Department &amp; multi-team options are available for non-football programs.
                    {" "}
                    <button
                      type="button"
                      className="pricing-inline-cta-link"
                      data-requires-sport="true"
                      title="Select your sport for a tailored demo experience."
                      onClick={openSportModal}
                    >
                      Book a demo for a custom quote.
                    </button>
                  </>
                )}
            </Paragraph>
            <Paragraph className="pricing-note">
              {isFootball
                ? "Football packages start at $2,025/year. Select a contract length to compare options."
                : (
                  <>
                    <strong>Free for Athletes and HS Coaches:</strong> Athlete and high school coach access
                    remains free.
                    {" "}
                    <Link href="/resources">Go to Athlete/HS resources</Link>.
                  </>
                )}
            </Paragraph>
            {isFootball && (
              <Paragraph className="pricing-note">
                Football package tiers are extrapolated from all-sports package ratios and should be treated as
                planning estimates pending PM confirmation.
              </Paragraph>
            )}

            <div className="pricing-cta-row">
              <button
                type="button"
                className="btn red sport-selected"
                data-requires-sport="true"
                title="Select your sport for a tailored demo experience."
              >
                Book a Demo
              </button>
              <button
                type="button"
                className="btn light sport-selected"
                data-open-sport-modal="true"
                onClick={openSportModal}
              >
                Sport: {sport}
              </button>
            </div>

            <div className="pricing-contract-toggle" role="group" aria-label="Contract term">
              <button
                type="button"
                className={`pricing-term-btn${contractTerm === "3-year" ? " active" : ""}`}
                onClick={() => setContractTerm("3-year")}
              >
                3-Year Term
              </button>
              <button
                type="button"
                className={`pricing-term-btn${contractTerm === "1-year" ? " active" : ""}`}
                onClick={() => setContractTerm("1-year")}
              >
                1-Year Term
              </button>
            </div>

            {showSpecialNote && (
              <Card className="pricing-note-card">
                <strong>Special Access Note:</strong> Golf, Tennis, and Lacrosse programs receive Elite access at
                Starter pricing.
              </Card>
            )}
            <Row gutter={[16, 16]} className="pricing-options-grid">
              {tiers.map((tier) => (
                <Col xs={24} md={12} lg={6} key={tier.name}>
                  <Card title={tier.name} extra={tier.badge ? <span className="tier-badge">{tier.badge}</span> : null}>
                    {tier.prices && <div className="tier-price">{tier.prices[contractTerm]}</div>}
                    <p>{tier.description}</p>
                    <ul className="tier-list">
                      {tier.includes.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </Card>
                </Col>
              ))}
            </Row>

            {afterTierGridSlot}

            {showInlineContextAndFaq && <PricingDynamicsAndFaqs sport={sport} />}
          </>
        )}
      </div>
    </div>
  );
}
