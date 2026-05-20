"use client";

import { getMapDominanceListItems, MAP_DOMINANCE_HEADLINE } from "../lib/home-map-dominance-copy";
import HomeMapCoverageCompactB from "./HomeMapCoverageCompactB";

function MapDominanceCopySplit() {
  const items = getMapDominanceListItems();
  return (
    <div className="map-dominance-block map-dominance-block--split">
      <h2 className="map-dominance-head headline-match-pricing">{MAP_DOMINANCE_HEADLINE}</h2>
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

/** Homepage map band: full-width logos, stats + interactive map (layout B). */
export default function HomeMapDominanceBlock() {
  return (
    <section className="map-sec map-sec--interactive-b">
      <HomeMapCoverageCompactB homepageLayout statsSlot={<MapDominanceCopySplit />} />
    </section>
  );
}
