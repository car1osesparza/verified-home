"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { geoAlbersUsa, geoPath } from "d3-geo";
import { FIPS_TO_STATE, REGIONS, DIVISION_OPTIONS } from "../../lib/map-lab/constants";
import {
  divisionMatchesFilter,
  getDivisionWeight,
  groupSchoolsByRegion,
  indexSchoolsByState,
  summarizeCoverage,
} from "../../lib/map-lab/customer-data";
import {
  assignSchoolStates,
  buildStateLookup,
  getStateCentroid,
  loadUsStatesGeo,
} from "../../lib/map-lab/geo";
import { assetPath } from "../../lib/asset-path";
import "./interactive-customer-map.css";

const MAP_WIDTH = 960;
const MAP_HEIGHT = 560;
const EXTRUDE = 6;

function fitFeature(projection, feature, width, height, pad = 24) {
  const path = geoPath(projection);
  const [[x0, y0], [x1, y1]] = path.bounds(feature);
  const dx = x1 - x0;
  const dy = y1 - y0;
  const x = (x0 + x1) / 2;
  const y = (y0 + y1) / 2;
  const scale = (Math.min(width, height) / Math.max(dx, dy)) * (1 - pad / Math.min(width, height));
  const translate = [width / 2 - scale * x, height / 2 - scale * y];
  projection.scale(scale).translate(translate);
}

function divisionClass(division) {
  if (division === "D1") return "d1";
  if (division === "D2") return "d2";
  if (division === "D3") return "d3";
  return "other";
}

function LogoTile({ school, active, dimmed, onSelect }) {
  const initials = school.schoolName
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <button
      type="button"
      className={`icm-logo-tile icm-logo-tile--${divisionClass(school.topDivision)}${active ? " is-active" : ""}${
        dimmed ? " is-dimmed" : ""
      }`}
      title={`${school.schoolName} · ${school.topDivision || "Unclassified"}`}
      onClick={() => onSelect(school)}
    >
      {school.logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={school.logo} alt="" loading="lazy" />
      ) : (
        <span className="icm-logo-fallback">{initials}</span>
      )}
    </button>
  );
}

export default function InteractiveCustomerMap() {
  const [schools, setSchools] = useState([]);
  const [statesGeo, setStatesGeo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [divisionFilter, setDivisionFilter] = useState("all");
  const [selectedState, setSelectedState] = useState(null);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [hoverState, setHoverState] = useState(null);
  const [connectors, setConnectors] = useState([]);
  const mapWrapRef = useRef(null);
  const mapStageRef = useRef(null);
  const regionRowRefs = useRef({});

  useEffect(() => {
    let cancelled = false;
    async function boot() {
      try {
        const [schoolRes, geo] = await Promise.all([
          fetch(assetPath("/data/customer_list_w_logo.json")),
          loadUsStatesGeo(),
        ]);
        if (!schoolRes.ok) throw new Error("Failed to load customer data");
        const schoolData = await schoolRes.json();
        if (cancelled) return;
        setSchools(schoolData);
        setStatesGeo(geo);
      } catch (err) {
        if (!cancelled) setError(err.message || "Unable to load map data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    boot();
    return () => {
      cancelled = true;
    };
  }, []);

  const stateBySchoolId = useMemo(() => {
    if (!schools.length || !statesGeo.length) return new Map();
    return assignSchoolStates(schools, statesGeo);
  }, [schools, statesGeo]);

  const stateLookup = useMemo(() => buildStateLookup(statesGeo), [statesGeo]);

  const visibleSchools = useMemo(
    () => schools.filter((s) => divisionMatchesFilter(s.topDivision, divisionFilter)),
    [schools, divisionFilter]
  );

  const schoolsByState = useMemo(
    () => indexSchoolsByState(visibleSchools, stateBySchoolId),
    [visibleSchools, stateBySchoolId]
  );

  const schoolsByRegion = useMemo(
    () => groupSchoolsByRegion(visibleSchools, stateBySchoolId),
    [visibleSchools, stateBySchoolId]
  );

  const coverage = useMemo(
    () => summarizeCoverage(schools, stateBySchoolId, divisionFilter),
    [schools, stateBySchoolId, divisionFilter]
  );

  const projection = useMemo(() => {
    const p = geoAlbersUsa().translate([MAP_WIDTH / 2, MAP_HEIGHT / 2]).scale(1280);
    if (selectedState && stateLookup[selectedState]) {
      fitFeature(p, stateLookup[selectedState], MAP_WIDTH, MAP_HEIGHT, 48);
    } else {
      p.fitSize([MAP_WIDTH, MAP_HEIGHT], { type: "FeatureCollection", features: statesGeo });
    }
    return p;
  }, [selectedState, stateLookup, statesGeo]);

  const pathGen = useMemo(() => geoPath(projection), [projection]);

  const regionAnchors = useMemo(() => {
    const anchors = {};
    REGIONS.forEach((region) => {
      const regionStates = region.states
        .map((abbr) => stateLookup[abbr])
        .filter(Boolean);
      if (!regionStates.length) return;
      const coords = regionStates
        .map((geo) => getStateCentroid(geo, projection))
        .filter(Boolean);
      if (!coords.length) return;
      anchors[region.id] = [
        coords.reduce((sum, c) => sum + c[0], 0) / coords.length,
        coords.reduce((sum, c) => sum + c[1], 0) / coords.length,
      ];
    });
    return anchors;
  }, [projection, stateLookup]);

  const selectedStateSchools = selectedState ? schoolsByState[selectedState] || [] : [];

  useEffect(() => {
    function updateConnectors() {
      const wrap = mapWrapRef.current;
      const mapStage = mapStageRef.current;
      if (!wrap || !mapStage) return;
      const wrapRect = wrap.getBoundingClientRect();
      const mapRect = mapStage.getBoundingClientRect();
      const next = REGIONS.map((region) => {
        const row = regionRowRefs.current[region.id];
        const anchor = regionAnchors[region.id];
        if (!row || !anchor) return null;
        const rowRect = row.getBoundingClientRect();
        return {
          id: region.id,
          x1: rowRect.left + rowRect.width * 0.18 - wrapRect.left,
          y1: rowRect.bottom - wrapRect.top,
          x2: mapRect.left + (anchor[0] / MAP_WIDTH) * mapRect.width - wrapRect.left,
          y2: mapRect.top + (anchor[1] / MAP_HEIGHT) * mapRect.height - wrapRect.top,
        };
      }).filter(Boolean);
      setConnectors(next);
    }

    updateConnectors();
    window.addEventListener("resize", updateConnectors);
    return () => window.removeEventListener("resize", updateConnectors);
  }, [regionAnchors, visibleSchools.length, selectedState, divisionFilter]);

  function handleStateClick(abbr) {
    setSelectedSchool(null);
    setSelectedState((prev) => (prev === abbr ? null : abbr));
  }

  function handleSchoolSelect(school) {
    setSelectedSchool(school);
    const st = stateBySchoolId.get(school.id);
    if (st) setSelectedState(st);
  }

  function stateFill(abbr) {
    const count = (schoolsByState[abbr] || []).length;
    if (!count) return "#2a3544";
    const d1 = (schoolsByState[abbr] || []).filter((s) => s.topDivision === "D1").length;
    const intensity = Math.min(1, 0.35 + count / 40 + d1 / 20);
    return `rgba(106, 255, 171, ${0.15 + intensity * 0.55})`;
  }

  if (loading) {
    return (
      <div className="icm-shell">
        <div className="icm-loading">Loading programs map…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="icm-shell">
        <div className="icm-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="icm-shell">
      <header className="icm-header">
        <div>
          <p className="icm-kicker">Map Lab · Review prototype</p>
          <h1 className="icm-title">Verified Athletics coverage map</h1>
          <p className="icm-sub">
            Explore {coverage.schoolCount.toLocaleString()} programs across {coverage.stateCount} states. Click a state
            to zoom in, or browse logos by region above the map.
          </p>
        </div>
        <div className="icm-controls">
          <label className="icm-filter-label">
            Division
            <select
              className="icm-select"
              value={divisionFilter}
              onChange={(e) => {
                setDivisionFilter(e.target.value);
                setSelectedSchool(null);
              }}
            >
              {DIVISION_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
          {selectedState ? (
            <button type="button" className="icm-reset" onClick={() => setSelectedState(null)}>
              Reset map
            </button>
          ) : null}
        </div>
      </header>

      <section className="icm-visual-stack" ref={mapWrapRef}>
        <div className="icm-grid-section">
          <div className="icm-grid-head">
            <h2>Programs by region</h2>
            <p>Periodic-table style rows — higher divisions stay brightest.</p>
          </div>
          <div className="icm-region-stack">
            {REGIONS.map((region) => {
              const list = (schoolsByRegion[region.id] || []).filter((school) =>
                selectedState ? stateBySchoolId.get(school.id) === selectedState : true
              );
              if (!list.length) return null;
              return (
                <div
                  key={region.id}
                  className="icm-region-row"
                  data-region={region.id}
                  ref={(node) => {
                    regionRowRefs.current[region.id] = node;
                  }}
                >
                  <div className="icm-region-label">
                    <span>{region.label}</span>
                    <strong>{list.length}</strong>
                  </div>
                  <div className="icm-logo-grid">
                    {list.map((school) => (
                      <LogoTile
                        key={school.id}
                        school={school}
                        active={selectedSchool?.id === school.id}
                        dimmed={selectedState ? stateBySchoolId.get(school.id) !== selectedState : false}
                        onSelect={handleSchoolSelect}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <svg className="icm-connector-layer" aria-hidden="true">
          {connectors.map((line) => (
            <line
              key={line.id}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              className="icm-connector-line"
            />
          ))}
        </svg>

        <div className="icm-map-section">
          <div className="icm-map-layout">
            <div className="icm-map-stage-wrap">
              <div className="icm-map-stage" ref={mapStageRef}>
              <svg viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} className="icm-map-svg" role="img" aria-label="United States map">
                <defs>
                  <filter id="icm-map-shadow" x="-20%" y="-20%" width="140%" height="160%">
                    <feDropShadow dx="0" dy="18" stdDeviation="16" floodColor="#000000" floodOpacity="0.45" />
                  </filter>
                </defs>
                <g className="icm-map-shadow-silhouette" filter="url(#icm-map-shadow)">
                  {statesGeo.map((geo) => {
                    const abbr = String(geo.id).padStart(2, "0");
                    const path = pathGen(geo);
                    if (!path) return null;
                    return <path key={`shadow-${geo.id}`} d={path} />;
                  })}
                </g>
                <g className="icm-map-extrude">
                  {statesGeo.map((geo) => {
                    const abbrCode = String(geo.id).padStart(2, "0");
                    const path = pathGen(geo);
                    if (!path) return null;
                    return (
                      <path
                        key={`extrude-${geo.id}`}
                        d={path}
                        transform={`translate(0, ${EXTRUDE})`}
                        className="icm-state-extrude"
                      />
                    );
                  })}
                </g>
                <g className="icm-map-surface">
                  {statesGeo.map((geo) => {
                    const abbr = FIPS_TO_STATE[String(geo.id).padStart(2, "0")];
                    const path = pathGen(geo);
                    if (!path || !abbr) return null;
                    const active = selectedState === abbr;
                    const hovered = hoverState === abbr;
                    const count = (schoolsByState[abbr] || []).length;
                    return (
                      <path
                        key={geo.id}
                        d={path}
                        className={`icm-state${active ? " is-active" : ""}${hovered ? " is-hover" : ""}${
                          count ? " has-teams" : ""
                        }`}
                        fill={stateFill(abbr)}
                        onMouseEnter={() => setHoverState(abbr)}
                        onMouseLeave={() => setHoverState(null)}
                        onClick={() => handleStateClick(abbr)}
                      >
                        <title>
                          {abbr}: {count} program{count === 1 ? "" : "s"}
                        </title>
                      </path>
                    );
                  })}
                </g>
                {visibleSchools.map((school) => {
                  if (!Number.isFinite(school.lat) || !Number.isFinite(school.lng)) return null;
                  const st = stateBySchoolId.get(school.id);
                  if (selectedState && st !== selectedState) return null;
                  const xy = projection([school.lng, school.lat]);
                  if (!xy) return null;
                  const active = selectedSchool?.id === school.id;
                  const weight = getDivisionWeight(school.topDivision);
                  if (weight < 3 && !selectedState) return null;
                  return (
                    <circle
                      key={`pin-${school.id}`}
                      cx={xy[0]}
                      cy={xy[1]}
                      r={active ? 5 : weight >= 5 ? 3.5 : 2.5}
                      className={`icm-pin icm-pin--${divisionClass(school.topDivision)}${active ? " is-active" : ""}`}
                      onClick={() => handleSchoolSelect(school)}
                    >
                      <title>{school.schoolName}</title>
                    </circle>
                  );
                })}
              </svg>
            </div>
          </div>

          <aside className="icm-side-panel">
            {selectedState ? (
              <>
                <p className="icm-panel-kicker">Selected state</p>
                <h3>{selectedState}</h3>
                <p className="icm-panel-meta">
                  {selectedStateSchools.length} program{selectedStateSchools.length === 1 ? "" : "s"}
                </p>
                <ul className="icm-panel-list">
                  {selectedStateSchools.map((school) => (
                    <li key={school.id}>
                      <button
                        type="button"
                        className={`icm-panel-item${selectedSchool?.id === school.id ? " is-active" : ""}`}
                        onClick={() => setSelectedSchool(school)}
                      >
                        <span className="icm-panel-item-name">{school.schoolName}</span>
                        <span className="icm-panel-item-div">{school.topDivision || "—"}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <>
                <p className="icm-panel-kicker">How to use</p>
                <h3>Select a state</h3>
                <p className="icm-panel-copy">
                  Click any highlighted state to zoom in and browse programs. Use the division filter to prioritize D1,
                  D2, or D3 visibility. Logo rows above mirror five regional chapters.
                </p>
                <dl className="icm-stats">
                  <div>
                    <dt>Total schools</dt>
                    <dd>{coverage.schoolCount.toLocaleString()}</dd>
                  </div>
                  <div>
                    <dt>States covered</dt>
                    <dd>{coverage.stateCount}</dd>
                  </div>
                </dl>
              </>
            )}

            {selectedSchool ? (
              <div className="icm-school-card">
                <p className="icm-panel-kicker">Program detail</p>
                {selectedSchool.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={selectedSchool.logo} alt="" className="icm-school-card-logo" />
                ) : null}
                <h4>{selectedSchool.schoolName}</h4>
                <p>{selectedSchool.topDivision || "Unclassified"}</p>
                <p className="icm-school-sports">{selectedSchool.sports.slice(0, 6).join(" · ")}</p>
              </div>
            ) : null}
          </aside>
        </div>
        </div>
      </section>
    </div>
  );
}
