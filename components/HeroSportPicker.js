"use client";

import Link from "next/link";
import SportDemoCtaBlock from "./SportDemoCtaBlock";
import { recruitsSectionPath } from "../lib/recruits-path";

/** Homepage hero: sport prompt, “I coach:” + picker, athlete/HS resources link. */
export default function HeroSportPicker({ sport, onSportChange }) {
  return (
    <div className="b-hero-sport-tail">
      <div className="b-hero-sport-panel">
        {!sport ? (
          <p className="hero-p b-hero-sport-prompt">Pick a sport to tailor what you see on this page</p>
        ) : null}
        <div className="b-hero-sport-row b-hero-sport-row--coach-select">
          <p className="b-hero-sport-callout">I coach:</p>
          <SportDemoCtaBlock
            sport={sport}
            onSportChange={onSportChange}
            surface="dark"
            showBookDemoButton={false}
            suppressCoachNote
            coachFlexLayout
            className="b-hero-sport-cta"
          />
        </div>
        <div className="b-hero-resources-pill">
          <Link href={recruitsSectionPath("hs-football-coaches")} className="b-hero-resources-pill-link">
            Are you an athlete or HS coach? Click here
          </Link>
        </div>
      </div>
    </div>
  );
}
