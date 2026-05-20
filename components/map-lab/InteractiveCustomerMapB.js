"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  CloseOutlined,
  LeftOutlined,
  MinusOutlined,
  PlusOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import { geoAlbersUsa, geoPath } from "d3-geo";
import { FIPS_TO_STATE } from "../../lib/map-lab/constants";
import { isValidStateFeature } from "../../lib/map-lab/geo";
import { getDivisionWeight } from "../../lib/map-lab/customer-data";
import LogoTile from "./LogoTile";
import useCustomerMapData, { useCustomerMapDerived } from "./useCustomerMapData";
import "./interactive-customer-map-b.css";

const MAP_WIDTH = 960;
const MAP_HEIGHT = 520;
const LOGOS_PER_PAGE = 80;
const LOGO_ROWS = 1;
const PIN_R_BASE = 4.5;
const PIN_R_BASE_ZOOMED = 5.5;
const PIN_LOGO_SIZE_MULT = 4;
const LOGO_SIZE = 64;
const LOGO_GAP = 6;
const MAP_VIEW_MIN_SCALE = 1;
const MAP_VIEW_MAX_SCALE = 8;
const MAP_ZOOM_STEP = 1.2;
const MAP_VIEW_CENTER = { x: MAP_WIDTH / 2, y: MAP_HEIGHT / 2 };

const DEFAULT_VIEW = { k: 1, x: 0, y: 0 };

/** Fit a projected bounding box into the map frame using the same pan/zoom transform as wheel zoom. */
function computeViewForBounds(bounds, pad) {
  const [[x0, y0], [x1, y1]] = bounds;
  const bw = x1 - x0;
  const bh = y1 - y0;
  if (bw <= 0 || bh <= 0) return DEFAULT_VIEW;

  const top = pad.top ?? pad;
  const right = pad.right ?? pad;
  const bottom = pad.bottom ?? pad;
  const left = pad.left ?? pad;
  const innerW = MAP_WIDTH - left - right;
  const innerH = MAP_HEIGHT - top - bottom;
  const k = Math.min(innerW / bw, innerH / bh, MAP_VIEW_MAX_SCALE);

  return {
    k,
    x: left + (innerW - bw * k) / 2 - x0 * k,
    y: top + (innerH - bh * k) / 2 - y0 * k,
  };
}

/** Normalize wheel deltas (line/page/pixel modes + trackpad pinch) into a zoom factor. */
function wheelEventToZoomFactor(e) {
  let dy = e.deltaY;
  if (e.deltaMode === 1) {
    dy *= 16;
  } else if (e.deltaMode === 2) {
    dy *= typeof window !== "undefined" ? window.innerHeight : 800;
  }
  const sensitivity = e.ctrlKey ? 0.0045 : 0.0025;
  return Math.exp(-dy * sensitivity);
}
const MAP_FIT_PAD = 10;
/** Horizontal/bottom padding when fitting a state inside the map frame. */
const STATE_VIEW_PAD = 44;
/** Extra top inset so the state boundary clears the floating close control. */
const STATE_VIEW_TOP_PAD = 44;

const STATE_VIEW_FIT_PAD = {
  top: STATE_VIEW_TOP_PAD,
  right: STATE_VIEW_PAD,
  bottom: STATE_VIEW_PAD,
  left: STATE_VIEW_PAD,
};

function hasLogo(school) {
  return Boolean(school?.logo && String(school.logo).trim());
}

function divisionClass(division) {
  if (division === "D1") return "d1";
  if (division === "D2") return "d2";
  if (division === "D3") return "d3";
  return "other";
}

function sortByDivision(schools) {
  return [...schools].sort((a, b) => {
    const divDiff = getDivisionWeight(b.topDivision) - getDivisionWeight(a.topDivision);
    if (divDiff !== 0) return divDiff;
    return a.schoolName.localeCompare(b.schoolName);
  });
}

function isD1LogoPin(school) {
  return school.topDivision === "D1" && hasLogo(school);
}

/** D1 logo markers render last so they stay on top. */
function pinLayerOrder(school) {
  return isD1LogoPin(school) ? 1 : 0;
}

function getPinRadius(school, inStateView, emphasize) {
  const base = inStateView ? PIN_R_BASE_ZOOMED : PIN_R_BASE;
  const logoMult = inStateView ? PIN_LOGO_SIZE_MULT * 2 : PIN_LOGO_SIZE_MULT;
  const r = isD1LogoPin(school) ? base * logoMult : base;
  return emphasize ? r + 2 : r;
}

export default function InteractiveCustomerMapB({
  embed = false,
  homepageLayout = false,
  statsSlot = null,
  initialState = null,
}) {
  const { schools, statesGeo, loading, error } = useCustomerMapData({ simplifiedStates: false });
  const [selectedState, setSelectedState] = useState(null);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [hoverState, setHoverState] = useState(null);
  const [hoveredSchool, setHoveredSchool] = useState(null);
  const [logoPage, setLogoPage] = useState(0);
  const [logoSlideDir, setLogoSlideDir] = useState(1);
  const [viewTransform, setViewTransform] = useState(DEFAULT_VIEW);
  const [isPanning, setIsPanning] = useState(false);
  const viewportRef = useRef(null);
  const svgRef = useRef(null);
  const panSessionRef = useRef(null);
  const suppressMapClickRef = useRef(false);
  const wheelFrameRef = useRef(null);
  const wheelAccumRef = useRef({ factor: 1, x: MAP_VIEW_CENTER.x, y: MAP_VIEW_CENTER.y });
  const savedViewRef = useRef(null);
  const viewTransformRef = useRef(DEFAULT_VIEW);

  const { stateBySchoolId, stateLookup, visibleSchools } = useCustomerMapDerived(
    schools,
    statesGeo,
    "all"
  );

  const schoolsWithLogos = useMemo(() => visibleSchools.filter(hasLogo), [visibleSchools]);

  const schoolsByStateAll = useMemo(() => {
    const byState = {};
    visibleSchools.forEach((school) => {
      const st = stateBySchoolId.get(school.id);
      if (!st) return;
      if (!byState[st]) byState[st] = [];
      byState[st].push(school);
    });
    return byState;
  }, [visibleSchools, stateBySchoolId]);

  const allLogos = useMemo(() => sortByDivision(schoolsWithLogos), [schoolsWithLogos]);

  const inStateView = Boolean(selectedState);

  const logosForBand = useMemo(() => {
    if (!selectedState) return allLogos;
    return allLogos.filter((s) => stateBySchoolId.get(s.id) === selectedState);
  }, [allLogos, selectedState, stateBySchoolId]);

  const logoDisplaySize = inStateView ? LOGO_SIZE * 2 : LOGO_SIZE;
  const logosPerPage = inStateView ? Math.max(16, Math.floor(LOGOS_PER_PAGE / 2)) : LOGOS_PER_PAGE;

  const logoPageCount = Math.max(1, Math.ceil(logosForBand.length / logosPerPage));
  const pageLogos = logosForBand.slice(
    logoPage * logosPerPage,
    logoPage * logosPerPage + logosPerPage
  );
  const logoCols = Math.max(1, Math.ceil(pageLogos.length / LOGO_ROWS));

  useEffect(() => {
    setLogoPage((p) => Math.min(p, logoPageCount - 1));
  }, [logoPageCount, selectedState]);

  const projection = useMemo(() => {
    const p = geoAlbersUsa();
    const pad = MAP_FIT_PAD;
    const extent = [
      [pad, pad],
      [MAP_WIDTH - pad, MAP_HEIGHT - pad],
    ];
    const validFeatures = statesGeo.filter(isValidStateFeature);

    try {
      if (validFeatures.length) {
        p.fitExtent(extent, { type: "FeatureCollection", features: validFeatures });
      }
    } catch {
      if (validFeatures.length) {
        p.fitSize([MAP_WIDTH, MAP_HEIGHT], { type: "FeatureCollection", features: validFeatures });
      }
    }
    return p;
  }, [statesGeo]);

  const pathGen = useMemo(() => geoPath(projection), [projection]);

  useEffect(() => {
    viewTransformRef.current = viewTransform;
  }, [viewTransform]);

  /** State drill-down uses pan/zoom (not a separate projection) so wheel/+/- behave like country view. */
  useEffect(() => {
    if (!selectedState || loading) return;
    const geo = stateLookup[selectedState];
    if (!geo || !isValidStateFeature(geo)) return;
    const bounds = pathGen.bounds(geo);
    setViewTransform(computeViewForBounds(bounds, STATE_VIEW_FIT_PAD));
  }, [selectedState, stateLookup, pathGen, loading]);

  const statePaths = useMemo(() => {
    const gen = pathGen;
    return statesGeo
      .filter(isValidStateFeature)
      .map((geo) => {
        const abbr = FIPS_TO_STATE[String(geo.id).padStart(2, "0")];
        const d = gen(geo);
        if (!d || !abbr) return null;
        return { id: geo.id, abbr, d };
      })
      .filter(Boolean);
  }, [statesGeo, pathGen]);

  const pinCounterScale = 1 / viewTransform.k;

  const hoverPinLabel = useMemo(() => {
    if (!inStateView || !hoveredSchool) return null;
    if (!Number.isFinite(hoveredSchool.lat) || !Number.isFinite(hoveredSchool.lng)) return null;
    const xy = projection([hoveredSchool.lng, hoveredSchool.lat]);
    if (!xy) return null;
    const k = viewTransform.k;
    return {
      school: hoveredSchool,
      x: xy[0] * k + viewTransform.x,
      y: xy[1] * k + viewTransform.y,
      hasLogo: hasLogo(hoveredSchool),
    };
  }, [inStateView, hoveredSchool, projection, viewTransform]);

  const { dotPins, logoPins } = useMemo(() => {
    const dots = [];
    const logos = [];
    visibleSchools.forEach((school) => {
      if (!Number.isFinite(school.lat) || !Number.isFinite(school.lng)) return;
      const st = stateBySchoolId.get(school.id);
      if (selectedState && st !== selectedState) return;
      const xy = projection([school.lng, school.lat]);
      if (!xy) return;
      const entry = { school, x: xy[0], y: xy[1] };
      if (isD1LogoPin(school)) logos.push(entry);
      else dots.push(entry);
    });
    logos.sort((a, b) => pinLayerOrder(a.school) - pinLayerOrder(b.school));
    return { dotPins: dots, logoPins: logos };
  }, [visibleSchools, stateBySchoolId, selectedState, projection]);

  const clientToSvg = useCallback((clientX, clientY) => {
    const svg = svgRef.current;
    if (!svg) return MAP_VIEW_CENTER;
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const matrix = svg.getScreenCTM();
    if (!matrix) return MAP_VIEW_CENTER;
    const mapped = pt.matrixTransform(matrix.inverse());
    return { x: mapped.x, y: mapped.y };
  }, []);

  /** ViewBox point under the center of the visible map viewport (accounts for letterboxing). */
  const getViewportCenterInViewBox = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return MAP_VIEW_CENTER;
    const rect = viewport.getBoundingClientRect();
    return clientToSvg(rect.left + rect.width / 2, rect.top + rect.height / 2);
  }, [clientToSvg]);

  const screenDeltaToSvg = useCallback((dx, dy) => {
    const svg = svgRef.current;
    if (!svg) return { dx, dy };
    const rect = svg.getBoundingClientRect();
    return {
      dx: (dx * MAP_WIDTH) / rect.width,
      dy: (dy * MAP_HEIGHT) / rect.height,
    };
  }, []);

  /** Zoom while keeping the given viewBox point fixed on screen. */
  const zoomAtViewBoxPoint = useCallback((factor, viewBoxX, viewBoxY) => {
    setViewTransform((prev) => {
      const nextK = Math.min(MAP_VIEW_MAX_SCALE, Math.max(MAP_VIEW_MIN_SCALE, prev.k * factor));
      if (nextK === prev.k) return prev;
      const ratio = nextK / prev.k;
      return {
        k: nextK,
        x: viewBoxX - (viewBoxX - prev.x) * ratio,
        y: viewBoxY - (viewBoxY - prev.y) * ratio,
      };
    });
  }, []);

  const resetMapView = useCallback(() => {
    setViewTransform(DEFAULT_VIEW);
  }, []);

  const zoomStep = useCallback(
    (direction) => {
      const factor = direction > 0 ? MAP_ZOOM_STEP : 1 / MAP_ZOOM_STEP;
      const focal = getViewportCenterInViewBox();
      zoomAtViewBoxPoint(factor, focal.x, focal.y);
    },
    [getViewportCenterInViewBox, zoomAtViewBoxPoint]
  );

  useEffect(() => {
    if (loading || error) return undefined;

    const viewport = viewportRef.current;
    if (!viewport) return undefined;

    const onWheel = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const focal = clientToSvg(e.clientX, e.clientY);
      const step = wheelEventToZoomFactor(e);
      if (step === 1) return;

      wheelAccumRef.current.factor *= step;
      wheelAccumRef.current.x = focal.x;
      wheelAccumRef.current.y = focal.y;

      if (wheelFrameRef.current) return;

      wheelFrameRef.current = window.requestAnimationFrame(() => {
        wheelFrameRef.current = null;
        const { factor, x, y } = wheelAccumRef.current;
        wheelAccumRef.current = { factor: 1, x: MAP_VIEW_CENTER.x, y: MAP_VIEW_CENTER.y };
        if (factor !== 1) zoomAtViewBoxPoint(factor, x, y);
      });
    };

    viewport.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      viewport.removeEventListener("wheel", onWheel);
      if (wheelFrameRef.current) {
        window.cancelAnimationFrame(wheelFrameRef.current);
        wheelFrameRef.current = null;
      }
    };
  }, [loading, error, clientToSvg, zoomAtViewBoxPoint]);

  const focusState = useCallback((abbr, { saveReturnView = false } = {}) => {
    if (saveReturnView && savedViewRef.current == null) {
      savedViewRef.current = viewTransformRef.current;
    }
    setSelectedState(abbr);
    setSelectedSchool(null);
    setHoveredSchool(null);
    setHoverState(null);
    setLogoPage(0);
  }, []);

  useEffect(() => {
    if (!initialState || loading) return;
    const abbr = String(initialState).toUpperCase();
    if (stateLookup[abbr]) focusState(abbr);
  }, [initialState, loading, stateLookup, focusState]);

  function clearStateZoom() {
    if (savedViewRef.current) {
      setViewTransform(savedViewRef.current);
      savedViewRef.current = null;
    }
    setSelectedSchool(null);
    setHoveredSchool(null);
    setHoverState(null);
    setSelectedState(null);
  }

  function handleStateClick(abbr) {
    if (suppressMapClickRef.current) return;
    if (selectedState && selectedState !== abbr) return;
    if (selectedState === abbr) {
      clearStateZoom();
      return;
    }
    focusState(abbr, { saveReturnView: true });
  }

  function handleViewportPointerDown(e) {
    if (e.button !== 0 || viewTransform.k <= 1) return;
    if (inStateView && e.target.closest?.(".icmb-state") && !e.target.closest?.(".icmb-state.is-active")) {
      return;
    }
    panSessionRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      originPan: viewTransform,
      moved: false,
    };
    setIsPanning(true);
  }

  function handleViewportPointerMove(e) {
    const session = panSessionRef.current;
    if (!session) return;
    const dx = e.clientX - session.startX;
    const dy = e.clientY - session.startY;
    if (!session.moved && (Math.abs(dx) > 4 || Math.abs(dy) > 4)) {
      session.moved = true;
    }
    if (session.moved) {
      const svgDelta = screenDeltaToSvg(dx, dy);
      setViewTransform({
        k: session.originPan.k,
        x: session.originPan.x + svgDelta.dx,
        y: session.originPan.y + svgDelta.dy,
      });
    }
  }

  function handleViewportPointerUp() {
    if (panSessionRef.current?.moved) {
      suppressMapClickRef.current = true;
      window.setTimeout(() => {
        suppressMapClickRef.current = false;
      }, 0);
    }
    panSessionRef.current = null;
    setIsPanning(false);
  }

  function handleSchoolSelect(school) {
    setSelectedSchool(school);
    if (selectedState) return;
    const st = stateBySchoolId.get(school.id);
    if (st) {
      focusState(st, { saveReturnView: savedViewRef.current == null });
    }
  }

  function goLogoPage(delta) {
    if (!delta) return;
    setLogoSlideDir(delta > 0 ? 1 : -1);
    setLogoPage((p) => Math.max(0, Math.min(logoPageCount - 1, p + delta)));
  }

  const shellClass = `icmb-shell${embed ? " icmb-shell--embed" : ""}${homepageLayout ? " icmb-shell--homepage" : ""}`;

  if (loading) {
    return (
      <div className={shellClass}>
        <div className="icmb-loading">Loading coverage map…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={shellClass}>
        <div className="icmb-error">{error}</div>
      </div>
    );
  }

  const logoSection = (
    <div
      className={`icmb-logo-section${inStateView ? " icmb-logo-section--state" : ""}`}
      style={{
        "--icmb-logo-rows": LOGO_ROWS,
        "--icmb-logo-cols": logoCols,
        "--icmb-logo-size": `${logoDisplaySize}px`,
        "--icmb-logo-gap": `${LOGO_GAP}px`,
      }}
    >
      <div className="icmb-logo-band">
        <Button
          type="default"
          shape="circle"
          className="icmb-logo-nav"
          icon={<LeftOutlined />}
          aria-label="Previous programs"
          disabled={logoPage === 0}
          onClick={() => goLogoPage(-1)}
        />
        <div className="icmb-logo-scroll">
          <div
            key={logoPage}
            className={`icmb-logo-wall icmb-logo-wall--slide-${logoSlideDir > 0 ? "next" : "prev"}`}
          >
            {pageLogos.map((school) => (
              <LogoTile
                key={school.id}
                school={school}
                className="icmb-logo-tile"
                active={selectedSchool?.id === school.id}
                dimmed={false}
                hideTitle
                onSelect={handleSchoolSelect}
              />
            ))}
          </div>
        </div>
        <Button
          type="default"
          shape="circle"
          className="icmb-logo-nav"
          icon={<RightOutlined />}
          aria-label="Next programs"
          disabled={logoPage >= logoPageCount - 1}
          onClick={() => goLogoPage(1)}
        />
      </div>
      {logoPageCount > 1 ? (
        <div className="icmb-logo-pagination" role="tablist" aria-label="Logo pages">
          {Array.from({ length: logoPageCount }, (_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={logoPage === i}
              aria-label={`Page ${i + 1} of ${logoPageCount}`}
              className={`icmb-logo-page-dot${logoPage === i ? " is-active" : ""}`}
              onClick={() => {
                setLogoSlideDir(i > logoPage ? 1 : -1);
                setLogoPage(i);
              }}
            />
          ))}
        </div>
      ) : null}
    </div>
  );

  const mapSection = (
    <div className="icmb-map-wrap icmb-map-frame">
          {inStateView ? (
            <Button
              type="text"
              className="icmb-state-close"
              icon={<CloseOutlined />}
              aria-label={`Close ${selectedState} state view`}
              onClick={clearStateZoom}
            />
          ) : null}
          <div
            ref={viewportRef}
            className={`icmb-map-viewport${isPanning ? " is-panning" : ""}${viewTransform.k > 1 ? " is-zoomed-in" : ""}${inStateView ? " icmb-map-viewport--state" : ""}`}
            onPointerDown={handleViewportPointerDown}
            onPointerMove={handleViewportPointerMove}
            onPointerUp={handleViewportPointerUp}
            onPointerLeave={handleViewportPointerUp}
            onPointerCancel={handleViewportPointerUp}
          >
            <svg
              ref={svgRef}
              viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
              className="icmb-map-svg"
              role="img"
              aria-label="United States map"
            >
              <g
                className="icmb-map-zoom-layer"
                transform={`translate(${viewTransform.x} ${viewTransform.y}) scale(${viewTransform.k})`}
              >
            <g className="icmb-map-surface">
              {statePaths.map(({ id, abbr, d }) => {
                const active = selectedState === abbr;
                const hovered = hoverState === abbr;
                const dimmed = selectedState && !active;
                const count = (schoolsByStateAll[abbr] || []).length;
                const stateInteractive = !inStateView || active;
                return (
                  <path
                    key={id}
                    d={d}
                    className={`icmb-state${active ? " is-active" : ""}${hovered ? " is-hover" : ""}${
                      dimmed ? " is-dimmed" : ""
                    }${count ? " has-teams" : ""}${!stateInteractive ? " icmb-state--locked" : ""}`}
                    onMouseEnter={stateInteractive ? () => setHoverState(abbr) : undefined}
                    onMouseLeave={stateInteractive ? () => setHoverState(null) : undefined}
                    onClick={stateInteractive ? () => handleStateClick(abbr) : undefined}
                  />
                );
              })}
            </g>
            <g className="icmb-map-pins">
              {dotPins.map(({ school, x, y }) => {
                const r = getPinRadius(school, inStateView, false);
                return (
                  <g
                    key={`pin-${school.id}`}
                    className={`icmb-pin-dot${inStateView ? " icmb-pin-dot--interactive" : ""}`}
                    transform={`translate(${x}, ${y}) scale(${pinCounterScale})`}
                    aria-label={school.schoolName}
                    onMouseEnter={inStateView ? () => setHoveredSchool(school) : undefined}
                    onMouseLeave={inStateView ? () => setHoveredSchool(null) : undefined}
                  >
                    <circle cx={0} cy={0} r={r} className="icmb-pin icmb-pin--green" />
                  </g>
                );
              })}
              {logoPins.map(({ school, x, y }) => {
                const active = selectedSchool?.id === school.id;
                const isHovered = hoveredSchool?.id === school.id;
                const emphasize = active || isHovered;
                const r = getPinRadius(school, inStateView, emphasize);
                const size = r * 2;

                return (
                  <g
                    key={`pin-${school.id}`}
                    className={`icmb-pin-marker icmb-pin-marker--d1${emphasize ? " is-active" : ""}`}
                    transform={`translate(${x}, ${y}) scale(${pinCounterScale})`}
                    aria-label={school.schoolName}
                    onMouseEnter={inStateView ? () => setHoveredSchool(school) : undefined}
                    onMouseLeave={inStateView ? () => setHoveredSchool(null) : undefined}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSchoolSelect(school);
                    }}
                  >
                    <foreignObject
                      x={-r}
                      y={-r}
                      width={size}
                      height={size}
                      className="icmb-pin-logo-fo"
                    >
                      <div xmlns="http://www.w3.org/1999/xhtml" className="icmb-pin-logo-disc">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={school.logo} alt="" loading="lazy" />
                      </div>
                    </foreignObject>
                  </g>
                );
              })}
            </g>
              </g>
              {hoverPinLabel ? (
                <g
                  className="icmb-pin-hover-label"
                  transform={`translate(${hoverPinLabel.x}, ${hoverPinLabel.y}) scale(${pinCounterScale})`}
                  pointerEvents="none"
                >
                  {hoverPinLabel.hasLogo ? (
                    <foreignObject x={-28} y={-56} width={56} height={56}>
                      <div xmlns="http://www.w3.org/1999/xhtml" className="icmb-pin-hover-logo">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={hoverPinLabel.school.logo} alt="" />
                      </div>
                    </foreignObject>
                  ) : (
                    <foreignObject x={-80} y={-36} width={160} height={32}>
                      <div xmlns="http://www.w3.org/1999/xhtml" className="icmb-pin-hover-name">
                        {hoverPinLabel.school.schoolName}
                      </div>
                    </foreignObject>
                  )}
                </g>
              ) : null}
            </svg>
            <div className="icmb-map-zoom-stack" role="group" aria-label="Map zoom">
              <Button
                type="default"
                className="icmb-map-zoom-btn"
                icon={<PlusOutlined />}
                aria-label="Zoom in"
                disabled={viewTransform.k >= MAP_VIEW_MAX_SCALE}
                onClick={() => zoomStep(1)}
              />
              <Button
                type="default"
                className="icmb-map-zoom-btn"
                icon={<MinusOutlined />}
                aria-label="Zoom out"
                disabled={viewTransform.k <= MAP_VIEW_MIN_SCALE}
                onClick={() => zoomStep(-1)}
              />
            </div>
          </div>
        </div>
  );

  if (homepageLayout) {
    return (
      <div className={shellClass}>
        <div className="icmb-home-logos-full">{logoSection}</div>
        <div className="map-inner icmb-home-split">
          <div className="map-dominance-col">{statsSlot}</div>
          <div className="icmb-home-map-col">{mapSection}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={shellClass}>
      <div className="icmb-stage">
        {logoSection}
        {mapSection}
      </div>
    </div>
  );
}
