"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Card, Col, Row, Typography } from "antd";
import { openSportRequiredModal } from "../../lib/sport-preference";
import { useSportSelection } from "../SportSelectionProvider";
import SportDemoCtaBlock from "../SportDemoCtaBlock";

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
    includes: ["Everything in Starter", "JUCO Player Database"],
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

const SPECIAL_ACCESS_SPORTS = ["Golf", "Tennis", "Lacrosse"];

/** Elite-tier feature set at Starter pricing (Golf, Tennis, Lacrosse). */
const SPECIAL_ELITE_BUNDLE = {
  name: "Elite",
  prices: ALL_SPORTS_TIERS.find((tier) => tier.name === "Starter").prices,
  columns: [
    {
      items: ["Full transfer access", "Verified Ratings", "JUCO Player Database"],
    },
    {
      items: ["All D1 Transfers", "All D2 Transfers", "All D3 Transfers"],
    },
  ],
};

function PricingTierSkeletonCard() {
  return (
    <Card className="pricing-tier-skeleton-card">
      <div className="pricing-skeleton-bar pricing-skeleton-bar--title" />
      <div className="pricing-skeleton-bar pricing-skeleton-bar--price" />
      <div className="pricing-skeleton-bar" />
      <div className="pricing-skeleton-bar" />
      <div className="pricing-skeleton-bar pricing-skeleton-bar--short" />
      <div className="pricing-skeleton-block pricing-skeleton-block--lg" />
      <div className="pricing-skeleton-block" />
      <div className="pricing-skeleton-block" />
    </Card>
  );
}

export default function PricingPageContent({ afterTierGridSlot = null, tightSectionBottom = false }) {
  const { sport, hasSport, applySport } = useSportSelection();
  const [contractTerm, setContractTerm] = useState("3-year");

  const tiers = useMemo(() => {
    if (!sport) {
      return [];
    }
    return sport === "Football" ? FOOTBALL_TIERS : ALL_SPORTS_TIERS;
  }, [sport]);

  const isFootball = sport === "Football";
  const isOtherNotSure = sport === "Other / Not sure";
  const showSpecialSportPricing = sport && SPECIAL_ACCESS_SPORTS.includes(sport);

  return (
    <div
      className={`section marketing-page pricing-section-surface${
        tightSectionBottom ? " section-pricing-tight-bottom" : ""
      }`}
    >
      <div className="container pricing-page">
        {!sport ? (
          <>
            <Title>Recruiting intelligence packages</Title>
            <Paragraph className="lead">
              Verified Athletics packages vary by sport because recruiting workflows, data needs, and transfer
              dynamics vary by sport.
            </Paragraph>
            <Paragraph className="pricing-prompt">Select your sport to see relevant packages and pricing.</Paragraph>

            <SportDemoCtaBlock sport="" onSportChange={applySport} surface="pricing" className="pricing-demo-cta-wrap" />

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

            <Row gutter={[16, 16]} className="pricing-options-grid pricing-options-grid--skeleton">
              {[0, 1, 2, 3].map((i) => (
                <Col xs={24} md={12} lg={6} key={i}>
                  <PricingTierSkeletonCard />
                </Col>
              ))}
            </Row>
          </>
        ) : (
          <>
            <Title className="headline-match-pricing">
              {isFootball
                ? "Football recruiting intelligence packages"
                : isOtherNotSure
                  ? "Pricing for college programs"
                  : `Pricing for college ${sport} programs`}
            </Title>
            <Paragraph className="lead pricing-intro-lead">
              {isFootball
                ? "Sport-specific pricing for college football programs using transfer intelligence and recruiting workflow tools."
                : "Sport-specific pricing for college programs using transfer intelligence and recruiting workflow tools."}
            </Paragraph>
            {!isFootball && (
              <Paragraph className="pricing-note pricing-intro-follow pricing-dept-cta">
                Department &amp; multi-team options are available for non-football programs.{" "}
                <button
                  type="button"
                  className="pricing-inline-cta-link"
                  data-requires-sport="true"
                  title="Select your sport for a tailored demo experience."
                  onClickCapture={(e) => {
                    if (hasSport) {
                      return;
                    }
                    e.preventDefault();
                    e.stopPropagation();
                    openSportRequiredModal();
                  }}
                >
                  Book a demo for a custom quote.
                </button>
              </Paragraph>
            )}
            <Paragraph className="pricing-note">
              <strong>Free for Athletes and HS Coaches:</strong> Athlete and high school coach access remains free.{" "}
              <Link href="/resources" className="pricing-inline-cta-link">
                Go to Athlete/HS resources
              </Link>
              .
            </Paragraph>
            {isFootball && (
              <Paragraph className="pricing-note">
                Football package tiers are extrapolated from all-sports package ratios and should be treated as
                planning estimates pending PM confirmation.
              </Paragraph>
            )}

            <SportDemoCtaBlock
              sport={sport}
              onSportChange={applySport}
              surface="pricing"
              className="pricing-demo-cta-wrap"
            />

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

            {showSpecialSportPricing ? (
              <div className="pricing-options-grid pricing-options-grid--live pricing-options-grid--special-elite">
                <Card
                  title={SPECIAL_ELITE_BUNDLE.name}
                  className="pricing-tier-card pricing-tier-card--revealed pricing-elite-bundle-card"
                >
                  <p className="pricing-elite-bundle-access-note">
                    <strong>Special Access Note:</strong> {sport} programs receive Elite access at Starter pricing.
                  </p>
                  <div className="tier-price">{SPECIAL_ELITE_BUNDLE.prices[contractTerm]}</div>
                  <div className="pricing-elite-bundle-cols">
                    {SPECIAL_ELITE_BUNDLE.columns.map((column, colIndex) => (
                      <div className="pricing-elite-bundle-col" key={colIndex}>
                        <ul className="tier-list">
                          {column.items.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            ) : (
              <Row gutter={[16, 16]} className="pricing-options-grid pricing-options-grid--live">
                {tiers.map((tier) => (
                  <Col xs={24} md={12} lg={6} key={tier.name}>
                    <Card
                      title={tier.name}
                      extra={tier.badge ? <span className="tier-badge">{tier.badge}</span> : null}
                      className="pricing-tier-card pricing-tier-card--revealed"
                    >
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
            )}

            {afterTierGridSlot}
          </>
        )}
      </div>
    </div>
  );
}
