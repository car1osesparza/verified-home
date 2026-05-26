/**
 * Championship banner records (mock). Future: load from Supabase.
 *
 * Display convention (matches college gym banners & NFF/CFP usage):
 * - Logo identifies the school — do not repeat "Notre Dame Football" in type.
 * - Sport on its own line (FOOTBALL) — the activity.
 * - Qualifier is scope only (National, FBS, D2, D3, SEC, etc.) — not "National Football".
 * - CHAMPION + year are fixed visual anchors.
 *
 * @typedef {Object} ChampionshipBanner
 * @property {string} id
 * @property {string} schoolName — for accessibility / data only (logo is primary)
 * @property {string} [sport] — e.g. "Football", "Women's Basketball"
 * @property {string} qualifier — scope only: "National", "FBS", "D2", "D3", "SEC", etc.
 * @property {string} year — season or title year, e.g. "1988"
 * @property {string} [logoUrl]
 * @property {string} [accentColor]
 */

/** @param {string | undefined} sport */
export function formatChampionshipSport(sport) {
  const trimmed = sport?.trim();
  return trimmed ? trimmed.toUpperCase() : "";
}

/** @param {string | undefined} qualifier */
export function formatChampionshipQualifier(qualifier) {
  const trimmed = qualifier?.trim();
  return trimmed ? trimmed.toUpperCase() : "";
}

export const CHAMPIONSHIP_BANNERS_HEADLINE = "Champions Choose Verified";

export const CHAMPIONSHIP_BANNERS_LEAD =
  "Programs that won it all with support from Verified Athletics";

/** @type {ChampionshipBanner[]} — starter list; future: load from Supabase */
export const MOCK_CHAMPIONSHIP_BANNERS = [
  {
    id: "uwrf-fb-2025-d3",
    schoolName: "University of Wisconsin River Falls",
    sport: "Football",
    qualifier: "D3",
    year: "2025",
    logoUrl:
      "https://ljmvmaidepqbiyjvxoyo.supabase.co/storage/v1/object/public/school-logo/wis-river-falls.svg",
  },
  {
    id: "north-central-fb-2024-d3",
    schoolName: "North Central College",
    sport: "Football",
    qualifier: "D3",
    year: "2024",
    logoUrl:
      "https://ljmvmaidepqbiyjvxoyo.supabase.co/storage/v1/object/public/school-logo/north-central-il.svg",
  },
  {
    id: "cortland-fb-2023-d3",
    schoolName: "SUNY Cortland",
    sport: "Football",
    qualifier: "D3",
    year: "2023",
    logoUrl:
      "https://ljmvmaidepqbiyjvxoyo.supabase.co/storage/v1/object/public/school-logo/suny-cortland.svg",
  },
  {
    id: "ferris-state-fb-2025-d2",
    schoolName: "Ferris State University",
    sport: "Football",
    qualifier: "D2",
    year: "2025",
    logoUrl:
      "https://ljmvmaidepqbiyjvxoyo.supabase.co/storage/v1/object/public/school-logo/ferris-st.svg",
  },
  {
    id: "ferris-state-fb-2024-d2",
    schoolName: "Ferris State University",
    sport: "Football",
    qualifier: "D2",
    year: "2024",
    logoUrl:
      "https://ljmvmaidepqbiyjvxoyo.supabase.co/storage/v1/object/public/school-logo/ferris-st.svg",
  },
  {
    id: "indiana-fb-2025-fbs",
    schoolName: "Indiana University Bloomington",
    sport: "Football",
    qualifier: "FBS",
    year: "2025",
    logoUrl:
      "https://ljmvmaidepqbiyjvxoyo.supabase.co/storage/v1/object/public/school-logo//84.png",
    accentColor: "#990000",
  },
];

export async function fetchChampionshipBanners() {
  return MOCK_CHAMPIONSHIP_BANNERS;
}
