"use client";

import { getDemoSpecialistForSport } from "../lib/demo-specialist";
import { SPORTS } from "../lib/site-data";
import { getSelectedSport, openSportRequiredModal } from "../lib/sport-preference";
import SportSelectWithClear from "./SportSelectWithClear";

/**
 * surface:
 * - dark: navy role-path card (select + optional Book a Demo + note)
 * - pricing: blue pricing band — uses the same sport control as the top nav (`nav-sel` + compact nav variant)
 *
 * showBookDemoButton: set false on homepage sport-first test; pricing keeps default (true).
 */
export default function SportDemoCtaBlock({
  sport,
  onSportChange,
  surface = "dark",
  className = "",
  showBookDemoButton = true,
  /** When true with select-only dark surface: root uses `display: contents` so the parent can flex-align “I coach:” with the select and drop help text on the next full-width row. */
  coachFlexLayout = false,
}) {
  const hasSport = Boolean(sport);
  const isPricing = surface === "pricing";
  const showDemo = showBookDemoButton !== false;
  const demoSpecialist = isPricing && showDemo ? getDemoSpecialistForSport(sport || "") : null;
  const demoSpecialistFirst = demoSpecialist ? demoSpecialist.name.split(" ")[0] : "";

  const rowClass = [
    "sport-demo-cta-row",
    isPricing ? "sport-demo-cta-row--pricing" : "sport-demo-cta-row--dark",
    !isPricing && !showDemo ? "sport-demo-cta-row--selectOnly" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const selectClass = isPricing ? `nav-sel${hasSport ? " live" : ""}` : `hc-sel${hasSport ? " live" : ""}`;

  const noteClass = isPricing ? "pricing-demo-note" : "hero-note res-demo-hero-note";

  const useCoachFlex =
    coachFlexLayout && !isPricing && !showDemo && surface === "dark";

  const noteEl = (
    <div className={`${noteClass}${useCoachFlex ? " b-hero-sport-help-below" : ""}`}>
      {!showDemo && !isPricing ? (
        hasSport ? (
          `Product sections and pricing below reflect ${sport} workflows and package options—explore the page to see how Verified is tuned for your sport.`
        ) : (
          <span className="hero-note-highlight">
            Pick a sport to tailor what you see on this page; once you choose, product sections and pricing below
            update for that sport&apos;s workflows and packages.
          </span>
        )
      ) : hasSport ? (
        isPricing ? (
          `You'll connect with ${demoSpecialistFirst}—your ${sport} specialist.`
        ) : (
          `You'll be connected to a ${sport} specialist.`
        )
      ) : isPricing ? (
        <span className="pricing-demo-note-highlight">Select your sport for a tailored demo experience.</span>
      ) : (
        <span className="hero-note-highlight">Select your sport for a tailored demo experience.</span>
      )}
    </div>
  );

  return (
    <div className={className} style={useCoachFlex ? { display: "contents" } : undefined}>
      <div className={rowClass}>
        <SportSelectWithClear
          sports={SPORTS}
          value={sport}
          onValueChange={onSportChange}
          selectClassName={selectClass}
          emptyLabel="Choose sport"
          compact={isPricing}
          variant={isPricing ? "nav" : "dark"}
        />
        {showDemo &&
          (isPricing ? (
            <div className="sport-demo-pricing-cta">
              <img
                className="pricing-demo-specialist-avatar"
                src={demoSpecialist.image}
                alt=""
                width={52}
                height={52}
                decoding="async"
                title={`${demoSpecialist.name} — ${demoSpecialist.role}`}
              />
              <button
                type="button"
                className={`btn red${hasSport ? " sport-selected" : ""}`}
                data-requires-sport="true"
                title="Select your sport for a tailored demo experience."
                onClickCapture={(e) => {
                  if (getSelectedSport(SPORTS)) {
                    return;
                  }
                  e.preventDefault();
                  e.stopPropagation();
                  openSportRequiredModal();
                }}
              >
                Book a Demo
              </button>
            </div>
          ) : (
            <button
              type="button"
              className={`btn red${hasSport ? " sport-selected" : ""}`}
              data-requires-sport="true"
              title="Select your sport for a tailored demo experience."
              onClickCapture={(e) => {
                if (getSelectedSport(SPORTS)) {
                  return;
                }
                e.preventDefault();
                e.stopPropagation();
                openSportRequiredModal();
              }}
            >
              Book a Demo
            </button>
          ))}
      </div>
      {noteEl}
    </div>
  );
}
