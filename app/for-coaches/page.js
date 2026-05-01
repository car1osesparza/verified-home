"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Card, Col, Row, Typography } from "antd";
import { SPORTS } from "../../lib/site-data";
import { getSelectedSport, setSelectedSport } from "../../lib/sport-preference";

const { Title, Paragraph } = Typography;

const USE_CASES = [
  {
    title: "Build Recruiting Boards",
    description: "Identify and organize athletes that fit your program based on real data.",
  },
  {
    title: "Track the Transfer Portal",
    description: "Stay ahead of athlete movement and make faster decisions on emerging opportunities.",
  },
  {
    title: "Evaluate at Scale",
    description: "Compare large numbers of athletes without losing visibility or context.",
  },
  {
    title: "Reduce Manual Work",
    description: "Replace spreadsheets, email chains, and fragmented tools with a single system.",
  },
];

export default function ForCoachesPage() {
  const [sport, setSport] = useState();
  const hasSport = Boolean(sport);
  const isFootball = sport === "Football";

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

  const sportSection = useMemo(() => {
    if (!hasSport) {
      return {
        headline: "Designed for how your sport recruits",
        body: "Every sport has different recruiting timelines, data, and transfer dynamics. Select your sport to see how Verified Athletics adapts to your program.",
        points: [],
      };
    }

    if (isFootball) {
      return {
        headline: "Built for football recruiting at scale",
        body: "Football recruiting requires visibility across high school athletes, transfer activity, and performance data. Verified Athletics helps your staff track large volumes of athletes, identify targets early, and respond to transfer movement quickly.",
        points: [
          "High school + transfer database access",
          "AI-suggested targets for recruiting boards",
          "Measurables and performance tracking",
          "Alerts for athlete movement and offers",
          "Integration with existing recruiting workflows",
        ],
      };
    }

    return {
      headline: `Built for ${sport} recruiting workflows`,
      body: `Recruiting in ${sport} depends heavily on transfer tracking, athlete evaluation, and timely information. Verified Athletics gives your program the data and alerts needed to stay competitive.`,
      points: [
        "Transfer database access across divisions",
        "Verified ratings and athlete data",
        "Alerts for movement and updates",
        "JUCO data where relevant",
        "Faster evaluation and decision-making",
      ],
    };
  }, [hasSport, isFootball, sport]);

  const testimonial = isFootball
    ? "Verified Athletics gives us access to data we cannot get anywhere else. It is part of how we evaluate players every day."
    : "The transfer data alone has changed how we recruit. We are making faster, better decisions.";

  const handleSportChange = (value) => {
    setSport(value);
    setSelectedSport(value);
  };

  return (
    <div className="section marketing-page coaches-page">
      <div className="container">
        <section className="coaches-block coaches-surface-blue coaches-hero">
          <Title level={2}>Everything your staff needs to recruit faster and smarter</Title>
          <Paragraph className="coaches-body-copy">
            Verified Athletics fits the way coaching staffs actually work: recruiting boards, transfer
            tracking, athlete evaluation, and daily staff coordination in one operating rhythm.
          </Paragraph>
          <Paragraph className="coaches-body-copy">
            {hasSport
              ? `Configured for ${sport} workflows so your staff can identify targets, evaluate fit, and move quickly.`
              : "Select your sport for a tailored platform view and package recommendation."}
          </Paragraph>
          <div className="coaches-hero-actions">
            <select
              className={`hc-sel coaches-sel${hasSport ? " live" : ""}`}
              value={sport || ""}
              onChange={(event) => handleSportChange(event.target.value)}
            >
              <option value="">My sport</option>
              {SPORTS.map((label) => (
                <option key={label} value={label}>
                  {label}
                </option>
              ))}
            </select>
            <button className={`btn red${hasSport ? " sport-selected" : ""}`} data-requires-sport="true">
              Book a Demo
            </button>
          </div>
        </section>

        <section className="coaches-block coaches-surface-light">
          <Title level={3}>How programs use Verified Athletics</Title>
          <Row gutter={[16, 16]}>
            {USE_CASES.map((useCase) => (
              <Col xs={24} md={12} key={useCase.title}>
                <Card title={useCase.title}>
                  <p className="coaches-body-copy">{useCase.description}</p>
                </Card>
              </Col>
            ))}
          </Row>
        </section>

        <section className="coaches-block coaches-surface-blue coaches-sport-panel">
          <Title level={3}>{sportSection.headline}</Title>
          <Paragraph className="coaches-body-copy">{sportSection.body}</Paragraph>
          {sportSection.points.length > 0 && (
            <ul className="teamList">
              {sportSection.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          )}
        </section>

        <section className="coaches-block coaches-surface-light coaches-proof-panel">
          <Title level={3}>Trusted by college programs across multiple sports</Title>
          <Paragraph className="coaches-body-copy">
            Verified Athletics supports recruiting workflows across NCAA, NAIA, and JUCO programs,
            helping coaches access better data and move faster.
          </Paragraph>
          <div className="coaches-stats-row">
            <div className="coaches-stat-pill">1,700+ college programs</div>
            <div className="coaches-stat-pill">50,000+ transfer athletes tracked</div>
            <div className="coaches-stat-pill">Coverage across multiple sports</div>
          </div>
          <blockquote className="coaches-quote">{testimonial}</blockquote>
        </section>

        <section className="coaches-block coaches-surface-blue">
          <Title level={3}>Integrated visibility across levels</Title>
          <Paragraph className="coaches-body-copy">
            Verified Athletics includes data from multiple levels of competition, including JUCO programs.
            This allows college coaches to track athletes across the full recruiting landscape.
          </Paragraph>
          <Paragraph className="coaches-body-copy">
            JUCO access is integrated into the platform where relevant and does not require a separate
            product.
          </Paragraph>
        </section>

        <section className="coaches-block coaches-surface-red coaches-decision-panel">
          <Title level={3}>Not sure which package fits your program?</Title>
          <Paragraph className="coaches-body-copy">
            Packages vary by sport and recruiting needs. Book a demo and we will walk through your
            workflow, staffing, and priorities to recommend the right setup.
          </Paragraph>
          <div className="coaches-hero-actions">
            <button className={`btn red${hasSport ? " sport-selected" : ""}`} data-requires-sport="true">
              Book a Demo
            </button>
            <Link href="/pricing" className="btn light" data-requires-sport="true" data-redirect-url="/pricing">
              See Pricing
            </Link>
          </div>
        </section>

        <section className="coaches-footer-transition">
          <Title level={3}>Not a college coach?</Title>
          <Paragraph className="coaches-body-copy">
            Choose the experience built for your role.
          </Paragraph>
          <div className="coaches-footer-links">
            <Link href="/for-athletes">For Athletes</Link>
            <Link href="/hs-coaches">For HS Coaches</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
