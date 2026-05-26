import { COLLEGE_FOOTBALL } from "./site-data";

function sportMatchesTag(selectedSport, tag) {
  if (selectedSport === COLLEGE_FOOTBALL && tag === "Football") {
    return true;
  }
  return selectedSport === tag;
}

/** Default homepage slides when Supabase is unavailable or returns no rows. */
export const FALLBACK_TESTIMONIAL_SLIDES = [
  {
    id: "fallback-1",
    q: "Verified Athletics helped tremendously in organizing our portal efforts. The ability to filter to your specific needs and get instant updates puts Verified in a class of their own.",
    name: "Yolisha Jackson",
    role: "Head Coach, South Alabama WBB",
    sports: ["Women's Basketball"],
  },
  {
    id: "fallback-2",
    q: "Verified athletics is involved in our every day operations and recruiting efforts at the University of Maryland. Their forward-thinking and solution based actions, coupled with their easy-to-use platform have been a huge asset to our program.",
    name: "Jess Imhof",
    role: "Director of Scouting, Maryland WBB",
    sports: ["Women's Basketball"],
  },
  {
    id: "fallback-3",
    q: "Verified Athletics has been an amazing addition to our recruiting. Having the real time updates, player stats, and being able to sort by position has allowed us to organize our recruiting in ways we couldn't have done with just the portal itself. We are very thankful for Verified Athletics.",
    name: "Sarah Noble",
    role: "Head Coach, South Carolina WVOL",
    sports: ["Volleyball"],
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
