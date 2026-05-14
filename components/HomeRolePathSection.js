"use client";

import Link from "next/link";
import HomeRolePathBookDemoCoachesCard from "./archive/HomeRolePathBookDemoCoachesCard";
import SportDemoCtaBlock from "./SportDemoCtaBlock";

/**
 * “The right path for your role” two-up (college coaches vs free athlete/HS resources).
 * Not rendered on the homepage right now — sport picker lives in the hero (`HeroSportPicker`).
 * - "sportExplore": sport-first coaches column + free card.
 * - "bookDemo": archived coaches column from ./archive/HomeRolePathBookDemoCoachesCard.js
 */
export const HOME_ROLE_PATH_COACHES_VARIANT = "sportExplore";

function SportExploreCoachesCard({ sport, hasSport, onSportChange }) {
  return (
    <div className="res-card dark">
      <div className="res-tag">For College Coaches</div>
      <div className="res-head">Tailored information for your sport</div>
      <div className="res-body">
        {hasSport
          ? `Learn how Verified supports ${sport} programs—transfer intelligence, depth charts, and recruiting workflows—then explore product detail and pricing below.`
          : "Choose your sport to highlight the tools, datasets, and examples that match how your staff recruits."}
      </div>
      <div className="sport-explore-select-band">
        <div className="res-head sport-explore-select-callout">{hasSport ? sport : "Select your sport"}</div>
        <div className="sport-explore-select-slot">
          <SportDemoCtaBlock
            sport={sport}
            onSportChange={onSportChange}
            surface="dark"
            showBookDemoButton={false}
          />
        </div>
      </div>
    </div>
  );
}

export default function HomeRolePathSection({ sport, onSportChange }) {
  const hasSport = Boolean(sport);
  return (
    <section className="sec home-role-path-sec">
      <div className="sec-inner">
        <div className="sec-head home-role-path-head headline-match-pricing">The right path for your role.</div>
        <div className="res-grid">
          {HOME_ROLE_PATH_COACHES_VARIANT === "bookDemo" ? (
            <HomeRolePathBookDemoCoachesCard sport={sport} onSportChange={onSportChange} />
          ) : (
            <SportExploreCoachesCard sport={sport} hasSport={hasSport} onSportChange={onSportChange} />
          )}
          <div className="res-card light">
            <div className="res-tag">Free - Athletes & HS Coaches</div>
            <div className="res-head">Free Tools for the Portal Journey</div>
            <div className="res-body">
              Recruiting Academy guides, HS football coach resources, and transfer portal explainers - no account
              required, always free.
            </div>
            <Link href="/resources" className="res-btn">
              Explore Free Resources
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
