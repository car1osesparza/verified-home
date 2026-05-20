import { feature } from "topojson-client";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point } from "@turf/helpers";
import { FIPS_TO_STATE, US_STATES_GEO_URL } from "./constants";

function isValidCoord(pt) {
  return Array.isArray(pt) && pt.length >= 2 && Number.isFinite(pt[0]) && Number.isFinite(pt[1]);
}

function isValidRing(ring) {
  return Array.isArray(ring) && ring.length >= 4 && ring.every(isValidCoord);
}

export function isValidStateFeature(geo) {
  const { geometry } = geo || {};
  if (!geometry?.coordinates) return false;
  if (geometry.type === "Polygon") {
    return geometry.coordinates.some(isValidRing);
  }
  if (geometry.type === "MultiPolygon") {
    return geometry.coordinates.some((poly) => poly.some(isValidRing));
  }
  return false;
}

/**
 * Light decimation for performance — only on very dense rings so shapes stay recognizable.
 */
function simplifyRing(ring) {
  if (!Array.isArray(ring) || ring.length < 4) return ring;
  const clean = ring.filter(isValidCoord);
  if (clean.length < 100) return clean;

  const step = clean.length > 400 ? 3 : 2;
  const out = [clean[0]];
  for (let i = step; i < clean.length - 1; i += step) {
    out.push(clean[i]);
  }
  const last = clean[clean.length - 1];
  const tail = out[out.length - 1];
  if (tail[0] !== last[0] || tail[1] !== last[1]) out.push(last);
  return out.length >= 4 ? out : clean;
}

function simplifyGeometry(geometry) {
  if (!geometry) return geometry;
  if (geometry.type === "Polygon") {
    return {
      ...geometry,
      coordinates: geometry.coordinates
        .map((ring) => simplifyRing(ring))
        .filter(isValidRing),
    };
  }
  if (geometry.type === "MultiPolygon") {
    return {
      ...geometry,
      coordinates: geometry.coordinates
        .map((poly) => poly.map((ring) => simplifyRing(ring)).filter(isValidRing))
        .filter((poly) => poly.length > 0),
    };
  }
  return geometry;
}

export function simplifyStateFeatures(features) {
  return features
    .map((geo) => ({
      ...geo,
      geometry: simplifyGeometry(geo.geometry),
    }))
    .filter(isValidStateFeature);
}

export async function loadUsStatesGeo({ simplified = false } = {}) {
  const res = await fetch(US_STATES_GEO_URL);
  if (!res.ok) throw new Error("Failed to load US states geography");
  const topology = await res.json();
  let features = feature(topology, topology.objects.states).features;
  if (simplified) features = simplifyStateFeatures(features);
  return features;
}

export function buildStateLookup(statesGeo) {
  const byAbbr = {};
  statesGeo.forEach((geo) => {
    const abbr = FIPS_TO_STATE[String(geo.id).padStart(2, "0")];
    if (abbr) byAbbr[abbr] = geo;
  });
  return byAbbr;
}

export function assignSchoolStates(schools, statesGeo) {
  const map = new Map();
  schools.forEach((school) => {
    if (!Number.isFinite(school.lat) || !Number.isFinite(school.lng)) return;
    const pt = point([school.lng, school.lat]);
    const match = statesGeo.find((geo) => booleanPointInPolygon(pt, geo));
    if (match) {
      const abbr = FIPS_TO_STATE[String(match.id).padStart(2, "0")];
      if (abbr) map.set(school.id, abbr);
    }
  });
  return map;
}

export function getStateCentroid(geo, projection) {
  if (!geo || !projection) return null;
  const coords = [];
  const walk = (ring) => {
    ring.forEach(([lng, lat]) => coords.push(projection([lng, lat])));
  };

  if (geo.geometry.type === "Polygon") {
    geo.geometry.coordinates.forEach(walk);
  } else {
    geo.geometry.coordinates.forEach((poly) => poly.forEach(walk));
  }

  if (!coords.length) return null;
  const sum = coords.reduce(
    (acc, [x, y]) => {
      acc[0] += x;
      acc[1] += y;
      return acc;
    },
    [0, 0]
  );
  return [sum[0] / coords.length, sum[1] / coords.length];
}
