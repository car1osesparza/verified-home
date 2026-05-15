import { assetPath } from "./asset-path";
import { sortTestimonialSlides } from "./testimonials";

/** Static GitHub Pages: bundled JSON under public/. Local `next dev` can still use the same file. */
export function getTestimonialsCatalogUrl() {
  return assetPath("/data/testimonials-catalog.json");
}

export async function fetchTestimonialsForSport(sport) {
  const res = await fetch(getTestimonialsCatalogUrl());
  if (!res.ok) {
    throw new Error(`Request failed (${res.status})`);
  }
  const body = await res.json();
  const catalog = Array.isArray(body.items) ? body.items : [];
  return sortTestimonialSlides(catalog, sport);
}
