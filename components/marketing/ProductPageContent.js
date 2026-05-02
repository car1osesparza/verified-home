"use client";

import { useEffect, useState } from "react";
import { Card, Col, Row, Typography } from "antd";
import { SPORTS } from "../../lib/site-data";
import { getSelectedSport } from "../../lib/sport-preference";
import { assetPath } from "../../lib/asset-path";

const { Title, Paragraph } = Typography;
const PRODUCT_HERO_IMAGE = assetPath("/legacy/Verified homepage_files/website_portal2.png");

const PLATFORM_MODULES = [
  {
    title: "Athlete Database",
    description: "Access a centralized database of high school and transfer athletes.",
    points: [
      "Position and location data",
      "Athlete profiles and contact information",
      "Ongoing updates as athletes move through recruiting cycles",
    ],
  },
  {
    title: "Transfer Database",
    description: "Stay ahead of athlete movement.",
    points: [
      "Track transfer activity across divisions",
      "Monitor updates as athletes enter or change status",
      "Identify opportunities earlier",
    ],
  },
  {
    title: "Alerts and Notifications",
    description: "Get notified when it matters.",
    points: ["Athlete status changes", "Offer activity", "New opportunities in your recruiting pipeline"],
  },
  {
    title: "AI Suggested Targets",
    description: "Surface athletes that fit your program.",
    points: [
      "Identify potential recruits based on available data",
      "Support recruiting board development",
      "Reduce time spent searching manually",
    ],
  },
  {
    title: "Measurables and Performance Data",
    description: "Evaluate athletes with consistent data points.",
    points: [
      "Physical measurables",
      "Performance metrics where available",
      "Structured data for comparison",
    ],
  },
  {
    title: "Verified Ratings",
    description: "Add context to evaluation.",
    points: ["Standardized ratings where available", "Additional signals to support decision-making"],
  },
  {
    title: "Pre-Portal and Emerging Data",
    description: "Identify athletes before they fully enter the recruiting cycle.",
    points: ["Early signals and emerging opportunities", "Additional context for transfer movement"],
  },
  {
    title: "Workflow Integrations",
    description: "Work within your existing systems.",
    points: [
      "Integration with recruiting workflows where applicable",
      "Support for tools used by college programs",
    ],
  },
];

const PLATFORM_BENEFITS = [
  {
    title: "Find what matters faster",
    body: "Locate the right athletes quickly without hunting across scattered lists and disconnected tools.",
    icon: "⌕",
  },
  {
    title: "Organize recruiting work",
    body: "Keep discovery, evaluation, and tracking in one structured workflow your full staff can use.",
    icon: "▦",
  },
  {
    title: "Share context instantly",
    body: "Coordinate decisions with shared visibility into updates, targets, and recruiting priorities.",
    icon: "⇆",
  },
  {
    title: "Protect staff time",
    body: "Reduce manual monitoring and administrative overhead so coaches can focus on recruiting.",
    icon: "⛨",
  },
];

export default function ProductPageContent() {
  const [sport, setSport] = useState();
  const hasSport = Boolean(sport);

  useEffect(() => {
    const stored = getSelectedSport(SPORTS);
    if (stored) {
      setSport(stored);
    }
  }, []);

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

  return (
    <div className="section marketing-page product-page">
      <div className="container">
        <section className="product-block product-hero-split">
          <div className="product-hero-left">
            <Title>One platform for recruiting intelligence</Title>
            <Paragraph className="lead product-body-copy">
              Search, evaluate, and track athletes across high school and transfer data—without relying on
              fragmented tools or outdated lists.
            </Paragraph>
            <div className="product-hero-actions">
              <button className={`btn red${hasSport ? " sport-selected" : ""}`} data-requires-sport="true">
                Book a Demo
              </button>
            </div>
          </div>
          <div className="product-hero-right">
            <img src={PRODUCT_HERO_IMAGE} alt="Verified Athletics product interface" className="product-hero-image" />
          </div>
        </section>

        <section
          id="product-replace"
          className="product-block product-surface-blue product-replace-hero"
        >
          <Title level={2}>Replace fragmented workflows</Title>
          <div className="product-benefits-grid">
            {PLATFORM_BENEFITS.map((item) => (
              <article className="product-benefit-item" key={item.title}>
                <div className="product-benefit-icon" aria-hidden="true">
                  {item.icon}
                </div>
                <h4>{item.title}</h4>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="product-block">
          <Title level={3}>Built for the full recruiting workflow</Title>
          <Row gutter={[16, 16]}>
            {PLATFORM_MODULES.map((module) => (
              <Col xs={24} md={12} lg={8} key={module.title}>
                <Card title={module.title}>
                  <p className="product-body-copy">{module.description}</p>
                  <ul className="tier-list">
                    {module.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </Card>
              </Col>
            ))}
          </Row>
        </section>
      </div>
    </div>
  );
}
