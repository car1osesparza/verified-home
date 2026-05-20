import { geoPath } from "d3-geo";

function normalizePadding(padding) {
  if (typeof padding === "number") {
    return { top: padding, right: padding, bottom: padding, left: padding };
  }
  const fallback = padding?.top ?? padding?.right ?? padding?.bottom ?? padding?.left ?? 24;
  return {
    top: padding?.top ?? fallback,
    right: padding?.right ?? fallback,
    bottom: padding?.bottom ?? fallback,
    left: padding?.left ?? fallback,
  };
}

/** Fit a single GeoJSON feature into the map viewport with optional asymmetric padding. */
export function fitFeature(projection, feature, width, height, padding = 24) {
  const pad = normalizePadding(padding);
  const path = geoPath(projection);
  const [[x0, y0], [x1, y1]] = path.bounds(feature);
  const dx = x1 - x0;
  const dy = y1 - y0;
  if (dx <= 0 || dy <= 0) return;
  const x = (x0 + x1) / 2;
  const y = (y0 + y1) / 2;
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const scale = Math.min(innerW / dx, innerH / dy);
  projection.scale(scale).translate([
    pad.left + innerW / 2 - scale * x,
    pad.top + innerH / 2 - scale * y,
  ]);
}
