import { COLLEGE_FOOTBALL, HS_FOOTBALL } from "./site-data";

/**
 * Homepage map stats — guestimates until PM finalizes; sport row hidden below threshold.
 */

export const MAP_DOMINANCE_STATS = {
  collegePrograms: 1701,
  /** Guestimates — replace when PM confirms. */
  d1Programs: 689,
  d2D3Programs: 548,
  jucoNaiaPrograms: 464,
};

/** Sport-specific program counts (guestimates). */
export const SPORT_PROGRAM_COUNTS = {
  [COLLEGE_FOOTBALL]: 464,
  [HS_FOOTBALL]: 280,
  "Men's Basketball": 412,
  "Women's Basketball": 398,
  Baseball: 445,
  Softball: 372,
  "Men's Soccer": 318,
  "Women's Soccer": 305,
  Golf: 285,
  Tennis: 268,
  Lacrosse: 252,
  Volleyball: 341,
  "Swimming & Diving": 198,
  "Track & Field": 224,
  Wrestling: 186,
};

export const SPORT_PROGRAM_COUNT_THRESHOLD = 400;

export const MAP_DOMINANCE_HEADLINE = "Trusted by all. Used by Winners.";

const n = (x) => x.toLocaleString("en-US");

function formatSportProgramLabel(sport) {
  if (sport === COLLEGE_FOOTBALL) return "college football programs";
  if (sport === HS_FOOTBALL) return "high school football programs";
  return `${sport.toLowerCase()} programs`;
}

/**
 * @returns {{ stat: string; label: string; key: string }[]}
 */
export function getMapDominanceListItems(stats = MAP_DOMINANCE_STATS, selectedSport) {
  const rows = [
    { key: "college", stat: n(stats.collegePrograms), label: "college programs" },
    { key: "d1", stat: n(stats.d1Programs), label: "D1 programs" },
    { key: "d2d3", stat: n(stats.d2D3Programs), label: "D2/D3 programs" },
    { key: "juco", stat: n(stats.jucoNaiaPrograms), label: "JUCO/NAIA programs" },
  ];

  if (selectedSport && selectedSport !== "Other / Not sure") {
    const sportCount = SPORT_PROGRAM_COUNTS[selectedSport];
    if (typeof sportCount === "number" && sportCount >= SPORT_PROGRAM_COUNT_THRESHOLD) {
      rows.push({
        key: "sport",
        stat: n(sportCount),
        label: formatSportProgramLabel(selectedSport),
      });
    }
  }

  return rows;
}
