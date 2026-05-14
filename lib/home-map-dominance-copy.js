/**
 * Homepage “League-wide dominance” stats — shared by map column + red banner A/B layouts.
 * `SPORT_PROGRAM_COUNT_THRESHOLD`: sport-specific row only when count meets this bar (TBD by PM).
 */

export const MAP_DOMINANCE_STATS = {
  collegePrograms: 1701,
  d2D3NaiaJuco: 1012,
  ncaaDivisionI: 689,
  /** Example “specific sport” slice; swap when PM finalizes. */
  footballPrograms: 464,
};

export const SPORT_PROGRAM_COUNT_THRESHOLD = 400;

export const MAP_DOMINANCE_HEADLINE = "League-wide dominance, coast to coast.";

const n = (x) => x.toLocaleString("en-US");

/**
 * @returns {{ stat: string; label: string; key: string }[]}
 */
export function getMapDominanceListItems(stats = MAP_DOMINANCE_STATS) {
  const rows = [
    { key: "college", stat: n(stats.collegePrograms), label: "college programs" },
    { key: "other", stat: n(stats.d2D3NaiaJuco), label: "D2, D3, NAIA, JUCO & other" },
    { key: "d1", stat: n(stats.ncaaDivisionI), label: "NCAA Division I" },
  ];
  if (stats.footballPrograms >= SPORT_PROGRAM_COUNT_THRESHOLD) {
    rows.push({ key: "football", stat: n(stats.footballPrograms), label: "football programs" });
  }
  return rows;
}
