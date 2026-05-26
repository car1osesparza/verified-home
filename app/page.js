"use client";

import ProductPageContent from "../components/marketing/ProductPageContent";
import PricingPageContent from "../components/marketing/PricingPageContent";
import HeroSportPicker from "../components/HeroSportPicker";
import HomeMapDominanceBlock from "../components/HomeMapDominanceBlock";
import { useSportSelection } from "../components/SportSelectionProvider";
import ChampionshipBannersSection from "../components/ChampionshipBannersSection";
import TestimonialsClientOnly from "../components/TestimonialsClientOnly";

export default function HomePage() {
  const { sport, applySport } = useSportSelection();

  return (
    <div className="artboard">
      <section className="b-hero">
        <div className="b-hero-grad" />
        <div className="b-hero-inner">
          <div className="hero-big-stat">1,701</div>
          <div className="hero-big-sub">College programs trust Verified Athletics</div>
          <h1 className="hero-h1">
            Your program&apos;s next starter
            <br />
            is on Verified.
          </h1>
          <p className="hero-p">
            Built for coaches who need better players, faster answers, and less recruiting chaos.
          </p>
          <HeroSportPicker sport={sport ?? ""} onSportChange={applySport} />
        </div>
      </section>

      <HomeMapDominanceBlock />

      <div>
        <ProductPageContent />
      </div>

      <div id="pricing" className="home-marketing-anchor home-pricing-stack">
        <PricingPageContent tightSectionBottom />
      </div>

      <ChampionshipBannersSection />

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
