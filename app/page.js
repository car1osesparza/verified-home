"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SPORTS } from "../lib/site-data";
import { getSelectedSport, setSelectedSport } from "../lib/sport-preference";

const SPORT_GRID_SPORTS = [
  "Football",
  "Men's Basketball",
  "Women's Basketball",
  "Baseball",
  "Softball",
  "Men's Soccer",
  "Lacrosse",
  "Swimming & Diving",
  "Track & Field",
  "Wrestling",
];

const SPORT_COUNTS = {
  Football: 11240,
  "Men's Basketball": 4820,
  "Women's Basketball": 4310,
  Baseball: 6780,
  Softball: 3940,
  "Men's Soccer": 5230,
  Lacrosse: 2180,
  "Swimming & Diving": 1670,
  "Track & Field": 3440,
  Wrestling: 1280,
};

const CAPS = [
  {
    title: "Data",
    desc: "Transfer portal entries, commitments, and program activity in one searchable place.",
    icon: <path d="M2 4h12M2 8h12M2 12h12" />,
  },
  {
    title: "Alerts",
    desc: "Real-time notifications the moment targets enter or exit the portal.",
    icon: (
      <>
        <circle cx="8" cy="8" r="3.5" />
        <path d="M8 2v2M8 12v2M2 8h2M12 8h2" />
      </>
    ),
  },
  {
    title: "Speed",
    desc: "First-mover advantage - Verified delivers portal events faster than any other service.",
    icon: <path d="M3 8h10M10 5l3 3-3 3" />,
  },
  {
    title: "Inside Info",
    desc: "Depth chart analysis and roster intelligence by school so you know who's actually available.",
    icon: (
      <>
        <circle cx="8" cy="5" r="3" />
        <path d="M3 14c0-2.76 2.24-5 5-5s5 2.24 5 5" />
      </>
    ),
  },
  {
    title: "AI Targets",
    desc: "Sport-specific recommendations matched to your roster needs and recruiting priorities.",
    icon: <path d="M2 10l4-4 3 3 5-6" />,
  },
];

const QUOTES = [
  {
    q: "Verified has been a great asset to our recruiting efforts for several years. They have the most complete information in the industry and serve as the foundation for our prospect database.",
    name: "Andy Frank",
    role: "General Manager, Virginia Tech Football",
    img: "/legacy/Verified homepage_files/andy_vt.jpg",
  },
  {
    q: "Verified helps us find players who fit our program with speed and efficiency. With help from Verified, we offered 5 transfers and signed all 5.",
    name: "John Lorenzo",
    role: "Associate Head Coach, Wright State Women's Basketball",
    img: "/legacy/Verified homepage_files/john_l.jpg",
  },
  {
    q: "Amount and quality of contact information and data is everything. Verified has provided this more accurately than any other recruiting tool we have used.",
    name: "Brad Spencer",
    role: "Head Coach, North Central College Football (D3)",
    img: "/legacy/Verified homepage_files/rick_spencer.png",
  },
];

const MAP_URL = "/legacy/Verified homepage_files/usa_map_4+6+26.png";
const PORTAL_URL = "/legacy/Verified homepage_files/website_portal2.png";

export default function HomePage() {
  const [sport, setSport] = useState("");
  const hasSport = Boolean(sport);

  useEffect(() => {
    const stored = getSelectedSport(SPORTS);
    if (stored) {
      setSport(stored);
    }
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
            Colleges' #1 Choice
          </div>
          <div className="hero-big-stat">1,701</div>
          <div className="hero-big-sub">College programs trust Verified Athletics</div>
          <h1 className="hero-h1">
            Your program's next starter
            <br />
            is already in the portal.
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
            <button className={`btn red${hasSport ? " sport-selected" : ""}`} data-requires-sport="true">
              Book a Demo
            </button>
          </div>
          <div className="hero-note">
            {hasSport
              ? `You'll be connected to a ${sport} specialist.`
              : "Select your sport for a tailored demo experience."}
          </div>
        </div>
      </section>

      <div className="ret-band">
        <div className="ret-text">
          92% customer retention - <span>464 Football - 689 NCAA DI - 1,012 D2 - D3 - NAIA - JUCO</span>
        </div>
      </div>

      <section className="sec" style={{ background: "#fff" }}>
        <div className="sec-inner">
          <div className="eyebrow dark">The Platform</div>
          <div className="sec-head">Five capabilities. One platform.</div>
          <div className="sec-sub">
            Data, Alerts, Speed, Inside Info, and AI Targets - calibrated to your sport's portal dynamics.
          </div>
          <div className="cap-grid">
            {CAPS.map((c) => (
              <div className="cap-card" key={c.title}>
                <div className="cap-icon">
                  <svg viewBox="0 0 16 16">{c.icon}</svg>
                </div>
                <div className="cap-title">{c.title}</div>
                <div className="cap-desc">{c.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec" style={{ backgroundColor: "rgba(2, 62, 114, 1)" }}>
        <div className="sec-inner portal-split">
          <img src={PORTAL_URL} alt="Portal" className="portal-img" />
          <div>
            <div className="eyebrow pale">Transfer Portal</div>
            <div className="sec-head white">Fast. More information. Searchable.</div>
            <p className="sec-sub pale">
              A unified portal view with depth chart context, measurables, and direct contact data. Your
              staff spends time recruiting, not searching.
            </p>
            <button className={`btn red${hasSport ? " sport-selected" : ""}`} data-requires-sport="true">
              Book a Demo
            </button>
          </div>
        </div>
      </section>

      <section className="map-sec">
        <div className="map-inner">
          <div>
            <div className="eyebrow pale">Colleges' #1 Choice</div>
            <div className="map-head">1,701 programs trust Verified.</div>
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
              NCAA-approved recruiting/scouting service in accordance with NCAA bylaws.
            </div>
          </div>
          <img src={MAP_URL} alt="Map of college programs" className="map-img" />
        </div>
      </section>

      <section className="sec" style={{ background: "var(--off-white)" }}>
        <div className="sec-inner">
          <div className="eyebrow">Sport Coverage</div>
          <div className="sec-head">
            Recruiting isn't the same across sports.
            <br />
            Your tools shouldn't be either.
          </div>
          <div className="sec-sub">
            Football, basketball, baseball&mdash;each has different timelines, data, and transfer dynamics.
            Verified Athletics adapts to that.
          </div>
          <div className="sport-grid">
            {SPORT_GRID_SPORTS.map((s) => (
              <div
                key={s}
                className={`sport-card${sport === s ? " active" : ""}`}
                onClick={() => {
                  setSport(s);
                  setSelectedSport(s);
                }}
              >
                <div className="sport-pip" />
                <div className="sport-name">{s}</div>
                <div className="sport-count">{SPORT_COUNTS[s].toLocaleString()} transfers</div>
              </div>
            ))}
          </div>
          <div className="sport-coverage-cta-row">
            <button className={`btn red${hasSport ? " sport-selected" : ""}`} data-requires-sport="true">
              Book a Demo
            </button>
            <Link
              href="/pricing"
              className={`btn light${hasSport ? " sport-selected" : ""}`}
              data-requires-sport="true"
              data-redirect-url="/pricing"
            >
              See Pricing for {hasSport ? sport : "Sport"}
            </Link>
          </div>
        </div>
      </section>

      <section className="sec" style={{ background: "#fff" }}>
        <div className="sec-inner">
          <div className="eyebrow">Trusted By Programs</div>
          <div className="sec-head" style={{ marginBottom: 4 }}>
            What coaches say.
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

      <section className="sec" style={{ background: "#fff" }}>
        <div className="sec-inner">
          <div className="eyebrow">Who It's For</div>
          <div className="sec-head">The right path for your role.</div>
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
              <button className={`res-btn${hasSport ? " sport-selected" : ""}`} data-requires-sport="true">
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

      <section className="cta-band">
        <div className="cta-inner">
          <div className="cta-head">1,701 programs can't be wrong.</div>
          <div className="cta-sub">Select your sport and book a personalized demo.</div>
          <div className="cta-row">
            <button className={`btn red${hasSport ? " sport-selected" : ""}`} data-requires-sport="true">
              Book a Demo
            </button>
            <Link href="/resources" className="btn ghost">
              Explore Free Resources
            </Link>
          </div>
          <div className="cta-note">
            {hasSport
              ? `${sport} selected. We'll route your demo request accordingly.`
              : "Select your sport to help route your demo correctly."}
          </div>
        </div>
      </section>

    </div>
  );
}
