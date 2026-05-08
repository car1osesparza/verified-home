"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ProductPageContent from "../components/marketing/ProductPageContent";
import PricingPageContent, { PricingDynamicsAndFaqs } from "../components/marketing/PricingPageContent";
import { SPORTS } from "../lib/site-data";
import { getSelectedSport, setSelectedSport } from "../lib/sport-preference";
import { assetPath } from "../lib/asset-path";

const QUOTES = [
  {
    q: "Verified has been a great asset to our recruiting efforts for several years. They have the most complete information in the industry and serve as the foundation for our prospect database.",
    name: "Andy Frank",
    role: "General Manager, Virginia Tech Football",
    img: assetPath("/legacy/Verified homepage_files/andy_vt.jpg"),
  },
  {
    q: "Verified helps us find players who fit our program with speed and efficiency. With help from Verified, we offered 5 transfers and signed all 5.",
    name: "John Lorenzo",
    role: "Associate Head Coach, Wright State Women's Basketball",
    img: assetPath("/legacy/Verified homepage_files/john_l.jpg"),
  },
  {
    q: "Amount and quality of contact information and data is everything. Verified has provided this more accurately than any other recruiting tool we have used.",
    name: "Brad Spencer",
    role: "Head Coach, North Central College Football (D3)",
    img: assetPath("/legacy/Verified homepage_files/rick_spencer.png"),
  },
];

const MAP_URL = assetPath("/legacy/Verified homepage_files/usa_map_4+6+26.png");

export default function HomePage() {
  const [sport, setSport] = useState("");
  const hasSport = Boolean(sport);

  useEffect(() => {
    const stored = getSelectedSport(SPORTS);
    if (stored) {
      setSport(stored);
    }
  }, []);

  useEffect(() => {
    const onSportUpdated = (event) => {
      const nextSport = event.detail?.sport;
      if (nextSport && SPORTS.includes(nextSport)) {
        setSport(nextSport);
      }
    };

    window.addEventListener("va:selected-sport", onSportUpdated);
    return () => window.removeEventListener("va:selected-sport", onSportUpdated);
  }, []);

  const onSportChange = (event) => {
    const value = event.target.value;
    setSport(value);
    setSelectedSport(value);
  };

  return (
    <div className="artboard">
      <section className="b-hero">
        <div className="b-hero-grad" />
        <div className="b-hero-inner">
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
            Real-time transfer portal intelligence, depth chart analysis, and AI-powered targets. Built
            for college coaches and calibrated by sport.
          </p>
          <div className="hero-cta-row">
            <select className={`hc-sel${hasSport ? " live" : ""}`} value={sport} onChange={onSportChange}>
              <option value="">My sport</option>
              {SPORTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <button
              className={`btn red${hasSport ? " sport-selected" : ""}`}
              data-requires-sport="true"
              title="Select your sport for a tailored demo experience."
            >
              Book a Demo
            </button>
          </div>
          <div className="hero-note">
            {hasSport
              ? `You'll be connected to a ${sport} specialist.`
              : <span className="hero-note-highlight">Select your sport for a tailored demo experience.</span>}
          </div>
        </div>
      </section>

      <section className="map-sec">
        <div className="map-inner">
          <div>
            <div className="map-kicker headline-match-pricing">League-wide dominance, coast to coast.</div>
            {[
              ["464", "Football programs"],
              ["689", "NCAA Division I"],
              ["1,012", "D2, D3, NAIA, JUCO & other"],
            ].map(([n, l]) => (
              <div key={l} className="map-stat-row">
                <span className="map-stat-num">{n}</span>
                <span className="map-stat-lbl">{l}</span>
              </div>
            ))}
            <div className="map-note">
              This recruiting/scouting service has been approved in accordance with NCAA bylaws, policies,
              and procedures. NCAA Division I football and/or basketball coaches are permitted to subscribe
              to this recruiting/scouting service.
            </div>
          </div>
          <img src={MAP_URL} alt="Map of college programs" className="map-img" />
        </div>
      </section>

      <div className="ret-band">
        <div className="ret-text">
          92% customer retention - <span>464 Football - 689 NCAA DI - 1,012 D2 - D3 - NAIA - JUCO</span>
        </div>
      </div>

      <section className="sec home-role-path-sec">
        <div className="sec-inner">
          <div className="sec-head home-role-path-head headline-match-pricing">The right path for your role.</div>
          <div className="res-grid">
            <div className="res-card dark">
              <div className="res-tag">For College Coaches</div>
              <div className="res-head">
                {hasSport ? `${sport} Recruiting Intelligence` : "Sport-Specific Recruiting Intelligence"}
              </div>
              <div className="res-body">
                Real-time portal data, depth chart analysis, and AI-powered targeting built for the way
                your sport's portal actually works.
              </div>
              <button
                className={`res-btn${hasSport ? " sport-selected" : ""}`}
                data-requires-sport="true"
                title="Select your sport for a tailored demo experience."
              >
                Book a Demo
              </button>
            </div>
            <div className="res-card light">
              <div className="res-tag">Free - Athletes & HS Coaches</div>
              <div className="res-head">Free Tools for the Portal Journey</div>
              <div className="res-body">
                Recruiting Academy guides, HS football coach resources, and transfer portal explainers
                - no account required, always free.
              </div>
              <Link href="/resources" className="res-btn">
                Explore Free Resources
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div>
        <ProductPageContent />
      </div>

      <div id="pricing" className="home-marketing-anchor home-pricing-stack">
        <PricingPageContent deferContextAndFaq tightSectionBottom />
      </div>

      <section className="sec sec-after-coaches-home" style={{ background: "#fff" }}>
        <div className="sec-inner">
          <div className="eyebrow">Trusted By Programs</div>
          <div className="sec-head headline-match-pricing" style={{ marginBottom: 4 }}>
            Trusted by All. Used by Winners.
          </div>
          <div className="t-grid">
            {QUOTES.map((q) => (
              <div className="t-card" key={q.name}>
                <div className="t-quote">&quot;{q.q}&quot;</div>
                <div className="t-foot">
                  <div className="t-avatar">
                    <img src={q.img} alt={q.name} />
                  </div>
                  <div>
                    <div className="t-name">{q.name}</div>
                    <div className="t-role">{q.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="sec home-pricing-faq-tail pricing-page"
        style={{ background: hasSport ? "var(--off-white)" : "#f0f4fa" }}
      >
        <div className="sec-inner home-faq-prefooter">
          {hasSport ? <PricingDynamicsAndFaqs sport={sport} /> : null}
        </div>
      </section>

    </div>
  );
}
