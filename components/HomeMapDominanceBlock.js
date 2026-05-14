"use client";

import { getMapDominanceListItems, MAP_DOMINANCE_HEADLINE } from "../lib/home-map-dominance-copy";

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

function MapDominanceCopyBanner() {
  const items = getMapDominanceListItems();
  return (
    <div className="map-dominance-block map-dominance-block--banner">
      <h2 className="map-dominance-head headline-match-pricing">{MAP_DOMINANCE_HEADLINE}</h2>
      <p className="map-dominance-banner-run">
        {items.map((row, i) => (
          <span key={row.key} className="map-dominance-banner-seg-wrap">
            {i > 0 ? (
              <span className="map-dominance-banner-sep" aria-hidden="true">
                {" "}
                ·{" "}
              </span>
            ) : null}
            <span className="map-dominance-stat map-dominance-stat--banner">{row.stat}</span>{" "}
            <span className="map-dominance-banner-label">{row.label}</span>
          </span>
        ))}
      </p>
    </div>
  );
}

/**
 * @param {{ layout: "split" | "stack" | "hero"; mapUrl: string }} props
 */
export default function HomeMapDominanceBlock({ layout, mapUrl }) {
  if (layout === "hero") {
    return (
      <div className="ret-band ret-band--dominance">
        <div className="container ret-band-domination-inner">
          <MapDominanceCopyBanner />
        </div>
      </div>
    );
  }

  if (layout === "stack") {
    return (
      <>
        <section className="map-sec map-sec--map-only">
          <div className="map-inner map-inner--map-only">
            <img src={mapUrl} alt="Map of college programs" className="map-img" />
          </div>
        </section>
        <div className="ret-band ret-band--dominance">
          <div className="container ret-band-domination-inner">
            <MapDominanceCopyBanner />
          </div>
        </div>
      </>
    );
  }

  return (
    <section className="map-sec">
      <div className="map-inner">
        <div className="map-dominance-col">
          <MapDominanceCopySplit />
        </div>
        <img src={mapUrl} alt="Map of college programs" className="map-img" />
      </div>
    </section>
  );
}
