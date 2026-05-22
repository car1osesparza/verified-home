/**
 * Championship banner records (mock). Future: load from Supabase.
 *
 * Display convention (matches college gym banners & NFF/CFP usage):
 * - Logo identifies the school — do not repeat "Notre Dame Football" in type.
 * - Sport on its own line (FOOTBALL) — the activity.
 * - Qualifier is scope only (National, SEC, Big Ten, NCS DIV. I) — not "National Football".
 * - CHAMPION + year are fixed visual anchors.
 *
 * @typedef {Object} ChampionshipBanner
 * @property {string} id
 * @property {string} schoolName — for accessibility / data only (logo is primary)
 * @property {string} [sport] — e.g. "Football", "Women's Basketball"
 * @property {string} qualifier — scope only: "National", "SEC", "Big Ten", "NCS DIV. I"
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

/** @type {ChampionshipBanner[]} */
export const MOCK_CHAMPIONSHIP_BANNERS = [
  {
    id: "notre-dame-fb-1988",
    schoolName: "Notre Dame",
    sport: "Football",
    qualifier: "National",
    year: "1988",
    logoUrl:
      "https://ljmvmaidepqbiyjvxoyo.supabase.co/storage/v1/object/public/school-logo//87.png",
    accentColor: "#0c2340",
  },
  {
    id: "ohio-state-fb-2014",
    schoolName: "Ohio State",
    sport: "Football",
    qualifier: "Big Ten",
    year: "2014",
    logoUrl:
      "https://ljmvmaidepqbiyjvxoyo.supabase.co/storage/v1/object/public/school-logo//194.png",
    accentColor: "#bb0000",
  },
  {
    id: "clemson-fb-2018",
    schoolName: "Clemson",
    sport: "Football",
    qualifier: "ACC",
    year: "2018",
    logoUrl:
      "https://ljmvmaidepqbiyjvxoyo.supabase.co/storage/v1/object/public/school-logo//228.png",
    accentColor: "#f56600",
  },
  {
    id: "georgia-fb-2021",
    schoolName: "Georgia",
    sport: "Football",
    qualifier: "SEC",
    year: "2021",
    logoUrl:
      "https://ljmvmaidepqbiyjvxoyo.supabase.co/storage/v1/object/public/school-logo//61.png",
    accentColor: "#ba0c2f",
  },
  {
    id: "michigan-fb-2023",
    schoolName: "Michigan",
    sport: "Football",
    qualifier: "Big Ten",
    year: "2023",
    logoUrl:
      "https://ljmvmaidepqbiyjvxoyo.supabase.co/storage/v1/object/public/school-logo//130.png",
    accentColor: "#00274c",
  },
  {
    id: "alabama-fb-2020",
    schoolName: "Alabama",
    sport: "Football",
    qualifier: "SEC",
    year: "2020",
    logoUrl:
      "https://ljmvmaidepqbiyjvxoyo.supabase.co/storage/v1/object/public/school-logo//333.png",
    accentColor: "#9e1b32",
  },
  {
    id: "texas-fb-2005",
    schoolName: "Texas",
    sport: "Football",
    qualifier: "Big 12",
    year: "2005",
    logoUrl:
      "https://ljmvmaidepqbiyjvxoyo.supabase.co/storage/v1/object/public/school-logo//251.png",
    accentColor: "#bf5700",
  },
  {
    id: "penn-state-fb-1986",
    schoolName: "Penn State",
    sport: "Football",
    qualifier: "Big Ten",
    year: "1986",
    logoUrl:
      "https://ljmvmaidepqbiyjvxoyo.supabase.co/storage/v1/object/public/school-logo//213.png",
    accentColor: "#041e42",
  },
];

export async function fetchChampionshipBanners() {
  return MOCK_CHAMPIONSHIP_BANNERS;
}
