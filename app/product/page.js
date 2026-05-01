"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Card, Col, Row, Typography } from "antd";
import { SPORTS } from "../../lib/site-data";
import { getSelectedSport } from "../../lib/sport-preference";
import { assetPath } from "../../lib/asset-path";

const { Title, Paragraph } = Typography;
const PRODUCT_HERO_IMAGE = assetPath("/legacy/Verified homepage_files/website_portal2.png");

const HOW_IT_WORKS = [
  {
    title: "Search",
    description: "Find athletes across high school and transfer databases.",
    points: [
      "Filter by position, location, and key attributes",
      "Access athlete profiles with relevant recruiting data",
      "Identify prospects without relying on third-party lists",
    ],
  },
  {
    title: "Evaluate",
    description: "Compare athletes using measurable, consistent data.",
    points: [
      "Review performance metrics and measurables",
      "Analyze video and available athlete information",
      "Use verified data to support recruiting decisions",
    ],
  },
  {
    title: "Track",
    description: "Monitor athlete movement and updates in real time.",
    points: [
      "Receive alerts when athletes enter or update status",
      "Track transfer portal activity",
      "Stay informed without manual monitoring",
    ],
  },
  {
    title: "Act",
    description: "Turn information into recruiting action.",
    points: ["Build recruiting boards", "Prioritize targets", "Coordinate decisions across your staff"],
  },
];

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

export default function ProductPage() {
  const [sport, setSport] = useState();
  const hasSport = Boolean(sport);
  const isFootball = sport === "Football";
  const [activeStep, setActiveStep] = useState(0);

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

  const sportContext = useMemo(() => {
    if (!hasSport) {
      return {
        headline: "Designed for how recruiting actually works",
        body: "Recruiting varies by sport-data availability, timelines, and transfer dynamics all differ. Verified Athletics adapts to those differences so your program can operate more efficiently.",
      };
    }
    if (isFootball) {
      return {
        headline: "Built for high-volume recruiting",
        body: "Football recruiting requires managing large numbers of athletes across high school and transfer pipelines. Verified Athletics provides the data, alerts, and tools needed to track and evaluate at scale.",
      };
    }
    return {
      headline: "Built for transfer-driven recruiting",
      body: "Many sports rely heavily on transfer activity and timely information. Verified Athletics provides the visibility and alerts needed to identify and evaluate athletes quickly.",
    };
  }, [hasSport, isFootball]);

  const currentStep = HOW_IT_WORKS[activeStep];
  const stepCountLabel = `${String(activeStep + 1).padStart(2, "0")}/${String(HOW_IT_WORKS.length).padStart(2, "0")}`;
  const goPrevStep = () => setActiveStep((prev) => (prev - 1 + HOW_IT_WORKS.length) % HOW_IT_WORKS.length);
  const goNextStep = () => setActiveStep((prev) => (prev + 1) % HOW_IT_WORKS.length);

  return (
    <div className="section marketing-page product-page">
      <div className="container">
        <section className="product-block product-hero-split">
          <div className="product-hero-left">
            <div className="eyebrow dark">Product</div>
            <Title>{hasSport ? `Recruiting intelligence for ${sport}` : "One platform for recruiting intelligence"}</Title>
            <Paragraph className="lead product-body-copy">
              {hasSport
                ? `Identify targets, track movement, and evaluate athletes with tools designed for how ${sport} recruiting actually works.`
                : "Search, evaluate, and track athletes across high school and transfer data-without relying on fragmented tools or outdated lists."}
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

        <section className="product-block product-surface-blue product-replace-hero">
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
          <Title level={3}>Everything your staff needs to recruit in one place</Title>
          <Paragraph className="lead product-body-copy">
            Verified Athletics brings together athlete data, transfer tracking, alerts, and evaluation
            tools into a single system. Instead of working across spreadsheets, emails, and disconnected
            platforms, your staff operates from one source of truth.
          </Paragraph>
        </section>

        <section className="product-block product-step-section">
          <Title level={3} className="product-step-heading">
            From discovery to decision
          </Title>
          <div className="product-step-carousel">
            <Card className="product-step-card" title={`${activeStep + 1}. ${currentStep.title}`}>
              <p className="product-body-copy">{currentStep.description}</p>
              <ul className="tier-list">
                {currentStep.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </Card>
            <div className="product-step-nav">
              <button className="product-step-arrow" aria-label="Previous step" onClick={goPrevStep}>
                ←
              </button>
              <span className="product-step-count">{stepCountLabel}</span>
              <button className="product-step-arrow" aria-label="Next step" onClick={goNextStep}>
                →
              </button>
            </div>
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

        <section className="product-block product-surface-red product-sport-context">
          <Title level={3}>{sportContext.headline}</Title>
          <Paragraph className="product-body-copy">{sportContext.body}</Paragraph>
        </section>

        <section className="product-block product-surface-blue product-cta-section">
          <Title level={3}>See the platform in action</Title>
          <Paragraph className="product-body-copy">
            Select your sport and schedule a demo to see how Verified Athletics fits your recruiting
            workflow.
          </Paragraph>
          <div className="product-hero-actions">
            <button className={`btn red${hasSport ? " sport-selected" : ""}`} data-requires-sport="true">
              Book a Demo
            </button>
            <Link href="/for-coaches" className="btn light">
              For Coaches
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
