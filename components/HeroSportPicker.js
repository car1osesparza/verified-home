"use client";

import Link from "next/link";
import SportDemoCtaBlock from "./SportDemoCtaBlock";

/** Homepage hero: “I coach:” label beside sport picker; athlete/HS coach resources link below. */
export default function HeroSportPicker({ sport, onSportChange }) {
  return (
    <div className="b-hero-sport-tail">
      <div className="b-hero-sport-panel">
        <div className="b-hero-sport-row b-hero-sport-row--coach-select">
          <p className="b-hero-sport-callout">I coach:</p>
          <SportDemoCtaBlock
            sport={sport}
            onSportChange={onSportChange}
            surface="dark"
            showBookDemoButton={false}
            coachFlexLayout
            className="b-hero-sport-cta"
          />
        </div>
        <div className="b-hero-resources-pill">
          <Link href="/resources" className="b-hero-resources-pill-link">
            Are you an athlete or HS coach? Click here for your resources
          </Link>
        </div>
      </div>
    </div>
  );
}
