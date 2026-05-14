import { assetPath } from "./asset-path";

/** Default homepage slides when Supabase is unavailable or returns no rows. */
export const FALLBACK_TESTIMONIAL_SLIDES = [
  {
    id: "fallback-1",
    q: "Verified has been a great asset to our recruiting efforts for several years. They have the most complete information in the industry and serve as the foundation for our prospect database.",
    name: "Andy Frank",
    role: "General Manager, Virginia Tech Football",
    img: assetPath("/legacy/Verified homepage_files/andy_vt.jpg"),
    sports: ["Football"],
  },
  {
    id: "fallback-2",
    q: "Verified helps us find players who fit our program with speed and efficiency. With help from Verified, we offered 5 transfers and signed all 5.",
    name: "John Lorenzo",
    role: "Associate Head Coach, Wright State Women's Basketball",
    img: assetPath("/legacy/Verified homepage_files/john_l.jpg"),
    sports: ["Women's Basketball"],
  },
  {
    id: "fallback-3",
    q: "Amount and quality of contact information and data is everything. Verified has provided this more accurately than any other recruiting tool we have used.",
    name: "Brad Spencer",
    role: "Head Coach, North Central College Football (D3)",
    img: assetPath("/legacy/Verified homepage_files/rick_spencer.png"),
    sports: ["Football"],
  },
];

/**
 * Higher sort key = earlier in the list.
 * Matched sport first, then sport-agnostic (empty tags), then other sports.
 */
export function sortTestimonialSlides(slides, selectedSport) {
  const sport = selectedSport?.trim() || "";
  const ambiguous = sport === "Other / Not sure";

  const priority = (row) => {
    const tags = Array.isArray(row.sports) ? row.sports : [];
    if (ambiguous || !sport) {
      if (!tags.length) {
        return 1;
      }
      return 0;
    }
    if (tags.includes(sport)) {
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
