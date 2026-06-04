"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { Card, Col, Row, Typography } from "antd";
import { getPricingConfigForSport, isFootballSport } from "../../lib/pricing-data";
import { handleSportDropdownChange } from "../../lib/sport-dropdown";
import { openSportRequiredModal } from "../../lib/sport-preference";
import { recruitsSectionPath } from "../../lib/recruits-path";
import { useSportSelection } from "../SportSelectionProvider";
import SportDemoCtaBlock from "../SportDemoCtaBlock";

const { Title, Paragraph } = Typography;

function PricingPostGridNotes() {
  return (
    <div className="pricing-post-grid-notes">
      <Paragraph className="pricing-inline-note">
        Ask about discounts for adding multiple programs.
      </Paragraph>
      <Paragraph className="pricing-inline-note pricing-inline-note--fine">
        *3 Year pricing includes 5.5% increase in years 2 &amp; 3
      </Paragraph>
    </div>
  );
}

function PricingIntroCopy() {
  return (
    <div className="pricing-intro-stack">
      <Paragraph className="pricing-intro-para">
        Verified Athletics packages vary by sport because recruiting workflows, data needs, and transfer
        dynamics vary by sport.
      </Paragraph>
      <Paragraph className="pricing-intro-para">
        Select your sport to see relevant packages and pricing.
      </Paragraph>
      <Paragraph className="pricing-intro-para pricing-note">
        <strong>Free for Athletes and HS Coaches:</strong> Athlete and high school coach access remains free.{" "}
        <Link href={recruitsSectionPath("hs-athletes")} className="pricing-inline-cta-link">
          Go to Athlete/HS Coaches
        </Link>
        .
      </Paragraph>
    </div>
  );
}

function PricingTierCard({ tier, contractTerm }) {
  const price = tier.prices[contractTerm];
  return (
    <Card
      title={tier.name}
      extra={tier.badge ? <span className="tier-badge">{tier.badge}</span> : null}
      className="pricing-tier-card pricing-tier-card--revealed"
    >
      {tier.audienceLabel ? <p className="pricing-tier-audience">{tier.audienceLabel}</p> : null}
      {price ? <div className="tier-price">{price}</div> : null}
      {tier.description ? <p>{tier.description}</p> : null}
      <ul className="tier-list">
        {tier.includes.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </Card>
  );
}

function PricingTierGrid({ config, contractTerm }) {
  const { layout, tiers, categoryNote, genderSplitNote } = config;
  const colProps =
    layout === "football"
      ? { xs: 24, md: 12, lg: 8 }
      : layout === "elite-ultra"
        ? { xs: 24, md: 12, lg: 12 }
        : { xs: 24, md: 12, lg: 6 };

  const gridClass = [
    "pricing-options-grid",
    "pricing-options-grid--live",
    layout === "football" ? "pricing-options-grid--football" : "",
    layout === "elite-ultra" ? "pricing-options-grid--elite-ultra" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <Row gutter={[16, 16]} className={gridClass}>
        {tiers.map((tier) => (
          <Col {...colProps} key={tier.name}>
            <PricingTierCard tier={tier} contractTerm={contractTerm} />
          </Col>
        ))}
      </Row>
      {categoryNote ? (
        <Paragraph className="pricing-category-note">{categoryNote}</Paragraph>
      ) : null}
      {genderSplitNote ? (
        <Paragraph className="pricing-inline-note pricing-gender-split-note">{genderSplitNote}</Paragraph>
      ) : null}
    </>
  );
}

export default function PricingPageContent({ afterTierGridSlot = null, tightSectionBottom = false }) {
  const { sport, hasSport } = useSportSelection();
  const onSportDropdownChange = useCallback((value) => handleSportDropdownChange(value), []);
  const [contractTerm, setContractTerm] = useState("3-year");

  const pricingConfig = useMemo(() => getPricingConfigForSport(sport), [sport]);

  const pricingTitle = sport ? `${sport} Pricing and Packages` : "Pricing and Packages";

  return (
    <div
      className={`section marketing-page pricing-section-surface${
        tightSectionBottom ? " section-pricing-tight-bottom" : ""
      }`}
    >
      <div className="container pricing-page">
        <Title className="headline-match-pricing">{pricingTitle}</Title>
        <PricingIntroCopy />

        <SportDemoCtaBlock
          sport={sport ?? ""}
          onSportChange={onSportDropdownChange}
          surface="pricing"
          className="pricing-demo-cta-wrap"
        />

        {sport ? (
          <>
            {!isFootballSport(sport) ? (
              <Paragraph className="pricing-note pricing-dept-cta">
                Department &amp; multi-team options are available for non-football programs.{" "}
                <button
                  type="button"
                  className="pricing-inline-cta-link"
                  data-requires-sport="true"
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
            ) : null}

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

            {pricingConfig ? <PricingTierGrid config={pricingConfig} contractTerm={contractTerm} /> : null}

            <PricingPostGridNotes />

            {afterTierGridSlot}
          </>
        ) : null}
      </div>
    </div>
  );
}
