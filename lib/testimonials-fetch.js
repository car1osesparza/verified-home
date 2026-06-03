import { assetPath } from "./asset-path";
import { testimonialCatalogItemsWithSortOrder } from "./testimonials-catalog-data.mjs";
import { normalizeDbRow, sortTestimonialSlides } from "./testimonials";

/** Static GitHub Pages: bundled JSON under public/. Local `next dev` uses the same file. */
export function getTestimonialsCatalogUrl() {
  return assetPath("/data/testimonials-catalog.json");
}

/** Future: load from Supabase `testimonials` table (same row shape as catalog items). */
export async function fetchTestimonialsFromSupabase() {
  return null;
}

function getLocalCatalogItems() {
  return testimonialCatalogItemsWithSortOrder();
}

export async function fetchTestimonialsForSport(sport) {
  const remote = await fetchTestimonialsFromSupabase();
  if (Array.isArray(remote) && remote.length > 0) {
    return sortTestimonialSlides(remote.map(normalizeDbRow), sport);
  }

  try {
    const res = await fetch(getTestimonialsCatalogUrl());
    if (res.ok) {
      const body = await res.json();
      const catalog = Array.isArray(body.items) ? body.items : [];
      if (catalog.length > 0) {
        return sortTestimonialSlides(catalog, sport);
      }
    }
  } catch {
    /* use in-repo catalog */
  }

  return sortTestimonialSlides(getLocalCatalogItems(), sport);
}
