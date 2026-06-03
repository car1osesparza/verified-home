import { COLLEGE_FOOTBALL } from "./site-data";

/**
 * Championship banner records (mock). Future: load from Supabase.
 *
 * Display convention (matches college gym banners):
 * - Logo identifies the school.
 * - Sport on its own line (FOOTBALL, WOMEN'S BASKETBALL, …).
 * - Division (FBS, D1, D2, D3, NAIA).
 * - Scope before CHAMPION: NATIONAL for national titles; NIT where noted.
 * - CHAMPION + year are fixed visual anchors.
 *
 * @typedef {Object} ChampionshipBanner
 * @property {string} id
 * @property {string} schoolName
 * @property {string} sport
 * @property {string} division — FBS, D1, D2, D3, NAIA
 * @property {"National" | "NIT"} [championshipScope] — default National
 * @property {string} year
 * @property {string} [logoUrl]
 * @property {string} [accentColor]
 */

/** @param {string | undefined} sport */
export function formatChampionshipSport(sport) {
  const trimmed = sport?.trim();
  return trimmed ? trimmed.toUpperCase() : "";
}

/** @param {string | undefined} division */
export function formatChampionshipDivision(division) {
  const trimmed = division?.trim();
  return trimmed ? trimmed.toUpperCase() : "";
}

/** @param {string | undefined} scope */
export function formatChampionshipScope(scope) {
  const trimmed = scope?.trim();
  return trimmed ? trimmed.toUpperCase() : "";
}

/** @deprecated Use formatChampionshipDivision */
export function formatChampionshipQualifier(qualifier) {
  return formatChampionshipDivision(qualifier);
}

export const CHAMPIONSHIP_BANNERS_HEADLINE = "Champions Choose Verified";

export const CHAMPIONSHIP_BANNERS_LEAD =
  "Programs that won it all with support from Verified Athletics";

/** Maps banner sport labels to homepage sport selector values. */
const BANNER_SPORT_TO_SELECTOR = {
  Football: [COLLEGE_FOOTBALL],
  "Women's Basketball": ["Women's Basketball"],
  "Women's Soccer": ["Women's Soccer"],
  "Women's Volleyball": ["Women's Volleyball", "Volleyball"],
  "Men's Soccer": ["Men's Soccer"],
  "Men's Basketball": ["Men's Basketball"],
  Baseball: ["Baseball"],
};

/**
 * When a sport is selected, that sport's banners move to the front (stable order within each group).
 * @param {ChampionshipBanner[]} banners
 * @param {string | undefined} selectedSport
 */
export function sortChampionshipBannersForSport(banners, selectedSport) {
  if (!selectedSport) {
    return banners;
  }
  const matching = [];
  const rest = [];
  for (const banner of banners) {
    const selectors = BANNER_SPORT_TO_SELECTOR[banner.sport] ?? [banner.sport];
    if (selectors.includes(selectedSport)) {
      matching.push(banner);
    } else {
      rest.push(banner);
    }
  }
  return [...matching, ...rest];
}

/** @type {ChampionshipBanner[]} — national champions in display order */
export const MOCK_CHAMPIONSHIP_BANNERS = [
  {
    id: "indiana-fb-2025-fbs",
    schoolName: "Indiana University Bloomington",
    sport: "Football",
    division: "FBS",
    championshipScope: "National",
    year: "2025",
    logoUrl:
      "https://ljmvmaidepqbiyjvxoyo.supabase.co/storage/v1/object/public/school-logo//84.png",
    accentColor: "#990000",
  },
  {
    id: "uconn-wbb-2025-d1",
    schoolName: "University of Connecticut",
    sport: "Women's Basketball",
    division: "D1",
    championshipScope: "National",
    year: "2025",
    logoUrl:
      "https://ljmvmaidepqbiyjvxoyo.supabase.co/storage/v1/object/public/school-logo//41.png",
  },
  {
    id: "florida-state-wsoc-2025-d1",
    schoolName: "Florida State University",
    sport: "Women's Soccer",
    division: "D1",
    championshipScope: "National",
    year: "2025",
    logoUrl:
      "https://ljmvmaidepqbiyjvxoyo.supabase.co/storage/v1/object/public/school-logo//52.png",
  },
  {
    id: "ferris-state-fb-2025-d2",
    schoolName: "Ferris State University",
    sport: "Football",
    division: "D2",
    championshipScope: "National",
    year: "2025",
    logoUrl:
      "https://ljmvmaidepqbiyjvxoyo.supabase.co/storage/v1/object/public/school-logo/ferris-st.svg",
  },
  {
    id: "uwrf-fb-2025-d3",
    schoolName: "University of Wisconsin River Falls",
    sport: "Football",
    division: "D3",
    championshipScope: "National",
    year: "2025",
    logoUrl:
      "https://ljmvmaidepqbiyjvxoyo.supabase.co/storage/v1/object/public/school-logo/wis-river-falls.svg",
  },
  {
    id: "indiana-wesleyan-wvol-2025-naia",
    schoolName: "Indiana Wesleyan University",
    sport: "Women's Volleyball",
    division: "NAIA",
    championshipScope: "National",
    year: "2025",
  },
  {
    id: "keiser-wsoc-2025-naia",
    schoolName: "Keiser University",
    sport: "Women's Soccer",
    division: "NAIA",
    championshipScope: "National",
    year: "2025",
  },
  {
    id: "buffalo-wbb-2025-nit",
    schoolName: "University at Buffalo",
    sport: "Women's Basketball",
    division: "D1",
    championshipScope: "NIT",
    year: "2025",
    logoUrl:
      "https://ljmvmaidepqbiyjvxoyo.supabase.co/storage/v1/object/public/school-logo//2084.png",
  },
  {
    id: "vermont-msoc-2024-d1",
    schoolName: "University of Vermont",
    sport: "Men's Soccer",
    division: "D1",
    championshipScope: "National",
    year: "2024",
    logoUrl:
      "https://ljmvmaidepqbiyjvxoyo.supabase.co/storage/v1/object/public/school-logo//261.png",
  },
  {
    id: "ferris-state-fb-2024-d2",
    schoolName: "Ferris State University",
    sport: "Football",
    division: "D2",
    championshipScope: "National",
    year: "2024",
    logoUrl:
      "https://ljmvmaidepqbiyjvxoyo.supabase.co/storage/v1/object/public/school-logo/ferris-st.svg",
  },
  {
    id: "minnesota-state-mbb-2024-d2",
    schoolName: "Minnesota State University Mankato",
    sport: "Men's Basketball",
    division: "D2",
    championshipScope: "National",
    year: "2024",
    logoUrl:
      "https://ljmvmaidepqbiyjvxoyo.supabase.co/storage/v1/object/public/school-logo/minn-st-mankato.svg",
  },
  {
    id: "lynn-msoc-2024-d2",
    schoolName: "Lynn University",
    sport: "Men's Soccer",
    division: "D2",
    championshipScope: "National",
    year: "2024",
    logoUrl:
      "https://ljmvmaidepqbiyjvxoyo.supabase.co/storage/v1/object/public/school-logo/lynn.svg",
  },
  {
    id: "north-central-fb-2024-d3",
    schoolName: "North Central College",
    sport: "Football",
    division: "D3",
    championshipScope: "National",
    year: "2024",
    logoUrl:
      "https://ljmvmaidepqbiyjvxoyo.supabase.co/storage/v1/object/public/school-logo/north-central-il.svg",
  },
  {
    id: "indiana-wesleyan-wvol-2024-naia",
    schoolName: "Indiana Wesleyan University",
    sport: "Women's Volleyball",
    division: "NAIA",
    championshipScope: "National",
    year: "2024",
  },
  {
    id: "clemson-msoc-2023-d1",
    schoolName: "Clemson University",
    sport: "Men's Soccer",
    division: "D1",
    championshipScope: "National",
    year: "2023",
    logoUrl:
      "https://ljmvmaidepqbiyjvxoyo.supabase.co/storage/v1/object/public/school-logo//228.png",
  },
  {
    id: "angelo-state-bsb-2023-d2",
    schoolName: "Angelo State University",
    sport: "Baseball",
    division: "D2",
    championshipScope: "National",
    year: "2023",
    logoUrl:
      "https://ljmvmaidepqbiyjvxoyo.supabase.co/storage/v1/object/public/school-logo/angelo-st.svg",
  },
  {
    id: "franklin-pierce-msoc-2023-d2",
    schoolName: "Franklin Pierce University",
    sport: "Men's Soccer",
    division: "D2",
    championshipScope: "National",
    year: "2023",
    logoUrl:
      "https://ljmvmaidepqbiyjvxoyo.supabase.co/storage/v1/object/public/school-logo/franklin-pierce.svg",
  },
  {
    id: "cortland-fb-2023-d3",
    schoolName: "SUNY Cortland",
    sport: "Football",
    division: "D3",
    championshipScope: "National",
    year: "2023",
    logoUrl:
      "https://ljmvmaidepqbiyjvxoyo.supabase.co/storage/v1/object/public/school-logo/suny-cortland.svg",
  },
  {
    id: "indiana-wesleyan-wvol-2023-naia",
    schoolName: "Indiana Wesleyan University",
    sport: "Women's Volleyball",
    division: "NAIA",
    championshipScope: "National",
    year: "2023",
  },
];

export async function fetchChampionshipBanners() {
  return MOCK_CHAMPIONSHIP_BANNERS;
}
