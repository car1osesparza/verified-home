"use client";

import {
  getMapDominanceListItems,
  MAP_DOMINANCE_HEADLINE,
} from "../lib/home-map-dominance-copy";
import { useSportSelection } from "./SportSelectionProvider";
import HomeMapCoverageCompactB from "./HomeMapCoverageCompactB";

function MapDominanceCopySplit({ headline = MAP_DOMINANCE_HEADLINE }) {
  const { sport } = useSportSelection();
  const items = getMapDominanceListItems(undefined, sport);
  return (
    <div className="map-dominance-block map-dominance-block--split">
      <h2 className="map-dominance-head headline-match-pricing">{headline}</h2>
      <ul className="map-dominance-list">
        {items.map((row) => (
          <li key={row.key} className="map-dominance-list-item">
            <span className="map-dominance-stat">{row.stat}</span>
            <span className="map-dominance-label">{row.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Shared map band: logos + stats + interactive map (homepage, resources hero, etc.).
 * @param {{ headline?: string; className?: string }} props
 */
export default function HomeMapDominanceBlock({
  headline = MAP_DOMINANCE_HEADLINE,
  className = "",
}) {
  const sectionClass = ["map-sec", "map-sec--interactive-b", className].filter(Boolean).join(" ");

  return (
    <section className={sectionClass}>
      <HomeMapCoverageCompactB
        homepageLayout
        statsSlot={<MapDominanceCopySplit headline={headline} />}
      />
    </section>
  );
}
