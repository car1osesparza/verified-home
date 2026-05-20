import { DIVISION_RANK } from "./constants";

export function divisionMatchesFilter(topDivision, filter) {
  if (filter === "all") return true;
  if (filter === "other") return !topDivision || topDivision === "-" || topDivision === "null";
  return topDivision === filter;
}

export function getDivisionWeight(topDivision) {
  return 6 - (DIVISION_RANK[topDivision] ?? 5);
}

export function indexSchoolsByState(schools, stateBySchoolId) {
  const byState = {};
  schools.forEach((school) => {
    const state = stateBySchoolId.get(school.id);
    if (!state) return;
    if (!byState[state]) byState[state] = [];
    byState[state].push(school);
  });
  return byState;
}

export function groupSchoolsByRegion(schools, stateBySchoolId) {
  const grouped = {};
  schools.forEach((school) => {
    const state = stateBySchoolId.get(school.id);
    if (!state) return;
    const regionId = STATE_TO_REGION_LOOKUP[state];
    if (!regionId) return;
    if (!grouped[regionId]) grouped[regionId] = [];
    grouped[regionId].push(school);
  });

  Object.values(grouped).forEach((list) => {
    list.sort((a, b) => {
      const divDiff = getDivisionWeight(b.topDivision) - getDivisionWeight(a.topDivision);
      if (divDiff !== 0) return divDiff;
      return a.schoolName.localeCompare(b.schoolName);
    });
  });

  return grouped;
}

const STATE_TO_REGION_LOOKUP = {
  ME: "northeast",
  NH: "northeast",
  VT: "northeast",
  MA: "northeast",
  RI: "northeast",
  CT: "northeast",
  NY: "northeast",
  NJ: "northeast",
  PA: "northeast",
  DE: "southeast",
  MD: "southeast",
  DC: "southeast",
  VA: "southeast",
  WV: "southeast",
  NC: "southeast",
  SC: "southeast",
  GA: "southeast",
  FL: "southeast",
  KY: "southeast",
  TN: "southeast",
  AL: "southeast",
  MS: "southeast",
  LA: "southeast",
  AR: "southeast",
  OH: "midwest",
  MI: "midwest",
  IN: "midwest",
  IL: "midwest",
  WI: "midwest",
  MN: "midwest",
  IA: "midwest",
  MO: "midwest",
  ND: "midwest",
  SD: "midwest",
  NE: "midwest",
  KS: "midwest",
  TX: "southwest",
  OK: "southwest",
  NM: "southwest",
  AZ: "southwest",
  CO: "west",
  WY: "west",
  MT: "west",
  ID: "west",
  WA: "west",
  OR: "west",
  NV: "west",
  UT: "west",
  CA: "west",
  AK: "west",
  HI: "west",
};

export function summarizeCoverage(schools, stateBySchoolId, divisionFilter) {
  const visible = schools.filter((s) => divisionMatchesFilter(s.topDivision, divisionFilter));
  const states = new Set();
  visible.forEach((s) => {
    const st = stateBySchoolId.get(s.id);
    if (st) states.add(st);
  });
  return {
    schoolCount: visible.length,
    stateCount: states.size,
  };
}
