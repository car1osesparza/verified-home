"use client";

import { useLayoutEffect, useState } from "react";
import ProductPageContent from "../components/marketing/ProductPageContent";
import PricingPageContent from "../components/marketing/PricingPageContent";
import HeroSportPicker from "../components/HeroSportPicker";
import HomeMapDominanceBlock from "../components/HomeMapDominanceBlock";
import PmAlternateViewDock, { readStoredMapLayout } from "../components/PmAlternateViewDock";
import { useSportSelection } from "../components/SportSelectionProvider";
import { assetPath } from "../lib/asset-path";
import TestimonialsClientOnly from "../components/TestimonialsClientOnly";

const MAP_URL = assetPath("/legacy/Verified homepage_files/usa_map_4+6+26.png");

export default function HomePage() {
  const { sport, applySport } = useSportSelection();
  const [mapLayout, setMapLayout] = useState("split");

  useLayoutEffect(() => {
    setMapLayout(readStoredMapLayout());
  }, []);

  const heroInline = mapLayout === "hero";

  const heroBody = (
    <>
      <div className="eyebrow pale" style={{ marginBottom: 16 }}>
        Recruiting Reimagined
      </div>
      <div className="hero-big-stat">1,701</div>
      <div className="hero-big-sub">College programs trust Verified Athletics</div>
      <h1 className="hero-h1">
        Your program's next starter
        <br />
        is on Verified.
      </h1>
      <p className="hero-p">
        Real-time transfer portal intelligence, depth chart analysis, and AI-powered targets. Built for college coaches
        and calibrated by sport.
      </p>
      <HeroSportPicker sport={sport ?? ""} onSportChange={applySport} />
    </>
  );

  return (
    <div className="artboard">
      <section className={heroInline ? "b-hero b-hero--map-inline" : "b-hero"}>
        <div className="b-hero-grad" />
        {heroInline ? (
          <div className="b-hero-inline-shell">
            <div className="b-hero-inner">{heroBody}</div>
            <div className="b-hero-map-col">
              <img src={MAP_URL} alt="Map of college programs" className="b-hero-map-img" />
            </div>
          </div>
        ) : (
          <div className="b-hero-inner">{heroBody}</div>
        )}
      </section>

      {heroInline ? (
        <section className="map-sec map-sec--hero-map-fallback">
          <div className="map-inner map-inner--map-only">
            <img src={MAP_URL} alt="Map of college programs" className="map-img" decoding="async" />
          </div>
        </section>
      ) : null}

      <HomeMapDominanceBlock layout={mapLayout} mapUrl={MAP_URL} />

      <PmAlternateViewDock layout={mapLayout} onLayoutChange={setMapLayout} />

      <div>
        <ProductPageContent />
      </div>

      <div id="pricing" className="home-marketing-anchor home-pricing-stack">
        <PricingPageContent tightSectionBottom />
      </div>

      <section className="sec sec-after-coaches-home" style={{ background: "#fff" }}>
        <div className="sec-inner">
          <div className="eyebrow">Trusted By Programs</div>
          <div className="sec-head headline-match-pricing" style={{ marginBottom: 4 }}>
            Trusted by All. Used by Winners.
          </div>
          <TestimonialsClientOnly selectedSport={sport || ""} />
        </div>
      </section>

    </div>
  );
}
