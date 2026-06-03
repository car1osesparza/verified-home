import { COLLEGE_FOOTBALL } from "./site-data";

function sportMatchesTag(selectedSport, tag) {
  if (selectedSport === COLLEGE_FOOTBALL && tag === "Football") {
    return true;
  }
  if (selectedSport === "Women's Volleyball" && tag === "Volleyball") {
    return true;
  }
  if (selectedSport === "Men's Wrestling" && tag === "Wrestling") {
    return true;
  }
  return selectedSport === tag;
}

import { testimonialCatalogItemsWithSortOrder } from "./testimonials-catalog-data.mjs";

/** Default homepage slides when Supabase and bundled JSON are unavailable. */
export const FALLBACK_TESTIMONIAL_SLIDES = testimonialCatalogItemsWithSortOrder().slice(0, 3);

/**
 * Higher sort key = earlier in the list.
 * Matched sport first, then sport-agnostic (empty tags), then other sports.
 */
export function sortTestimonialSlides(slides, selectedSport) {
  const sport = selectedSport?.trim() || "";
  const priority = (row) => {
    const tags = Array.isArray(row.sports) ? row.sports : [];
    if (!sport) {
      if (!tags.length) {
        return 1;
      }
      return 0;
    }
    if (tags.some((tag) => sportMatchesTag(sport, tag))) {
      return 2;
    }
    if (!tags.length) {
      return 1;
    }
    return 0;
  };

  return [...slides].sort((a, b) => {
    const pa = priority(a);
    const pb = priority(b);
    if (pb !== pa) {
      return pb - pa;
    }
    const oa = typeof a.sort_order === "number" ? a.sort_order : 0;
    const ob = typeof b.sort_order === "number" ? b.sort_order : 0;
    if (ob !== oa) {
      return ob - oa;
    }
    const ta = a.created_at || "";
    const tb = b.created_at || "";
    return String(tb).localeCompare(String(ta));
  });
}

export function normalizeDbRow(row) {
  let sports = [];
  if (Array.isArray(row.sports)) {
    sports = row.sports;
  } else if (row.sports != null && row.sports !== "") {
    sports = [String(row.sports)];
  }
  return {
    id: row.id,
    q: row.quote,
    name: row.name,
    role: row.role,
    img: row.image_url || "",
    sports,
    sort_order: typeof row.sort_order === "number" ? row.sort_order : 0,
    created_at: row.created_at || "",
  };
}
