"use client";

import SportDemoCtaBlock from "../SportDemoCtaBlock";

/**
 * Archived homepage coaches column: “Book a Demo” + sport specialist note.
 * Not wired by default — swap `HOME_ROLE_PATH_COACHES_VARIANT` in
 * `HomeRolePathSection.js` to `"bookDemo"` to restore this experience.
 */
export default function HomeRolePathBookDemoCoachesCard({ sport, onSportChange }) {
  const hasSport = Boolean(sport);
  return (
    <div className="res-card dark">
      <div className="res-tag">For College Coaches</div>
      <div className="res-head">
        {hasSport ? `${sport} Recruiting Intelligence` : "Sport-Specific Recruiting Intelligence"}
      </div>
      <div className="res-body">
        {
          "Real-time portal data, depth chart analysis, and AI-powered targeting built for the way your sport's portal actually works."
        }
      </div>
      <SportDemoCtaBlock sport={sport} onSportChange={onSportChange} surface="dark" />
    </div>
  );
}
