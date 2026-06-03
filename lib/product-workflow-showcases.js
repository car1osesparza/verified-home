import { assetPath } from "./asset-path";
import { ATHLETIC_DEPARTMENT, COLLEGE_FOOTBALL } from "./site-data";

/**
 * Workflow cards under “Built for the full recruiting workflow”.
 * `sports` uses internal acronyms (not shown in UI). Set `media.src` when assets ship.
 *
 * @typedef {'gif' | 'still'} WorkflowMediaKind
 * @typedef {object} ProductWorkflowMedia
 * @typedef {object} ProductWorkflowDefinition
 * @property {string} id
 * @property {string[]} sports — FB, WBB, TAF, …
 * @property {number} order — display order (lower first)
 * @property {string} title
 * @property {string} description
 * @property {string[]} points
 * @property {ProductWorkflowMedia} media
 */

/** @type {Record<string, string>} */
export const WORKFLOW_SPORT_ACRONYMS = {
  FB: COLLEGE_FOOTBALL,
  WBB: "Women's Basketball",
  TAF: "Track & Field",
  WVOL: "Women's Volleyball",
  SB: "Softball",
  MSOC: "Men's Soccer",
  WSOC: "Women's Soccer",
  BSB: "Baseball",
  MBB: "Men's Basketball",
  GOLF: "Golf",
  TEN: "Tennis",
  SWM: "Swimming & Diving",
  WRE: "Men's Wrestling",
  LAX: "Lacrosse",
  AD: ATHLETIC_DEPARTMENT,
};

const A = {
  FB: "FB",
  WBB: "WBB",
  TAF: "TAF",
  WVOL: "WVOL",
  SB: "SB",
  MSOC: "MSOC",
  WSOC: "WSOC",
  BSB: "BSB",
  MBB: "MBB",
  GOLF: "GOLF",
  TEN: "TEN",
  SWM: "SWM",
  WRE: "WRE",
  LAX: "LAX",
};

/** Sports that receive the broad transfer / boards / roster stack. */
const TRANSFER_STACK = [
  A.WBB,
  A.FB,
  A.TAF,
  A.WVOL,
  A.SB,
  A.MSOC,
  A.WSOC,
  A.BSB,
  A.MBB,
  A.GOLF,
  A.TEN,
  A.SWM,
  A.WRE,
  A.LAX,
];

const JUCO_STACK = [A.WBB, A.FB, A.TAF, A.WVOL, A.MSOC, A.WSOC, A.BSB, A.MBB];

const PRE_PORTAL_IMPACT_SCORES = [A.WBB, A.FB, A.WVOL, A.SB, A.MSOC, A.WSOC, A.BSB, A.MBB];
const PRE_PORTAL_EVENT_RESULTS = [A.TAF];
const PRE_PORTAL_NO_EXTRA_BA = [A.GOLF, A.TEN, A.SWM, A.WRE, A.LAX];

const PRE_PORTAL_BASE_POINTS = [
  "Identify rising transfer targets before they enter the portal",
  "Track players year-round and organize recruiting priorities",
  "Get text alerts when tracked athletes enter the portal",
];

/** @type {ProductWorkflowDefinition[]} */
const WORKFLOW_DEFINITIONS = [
  {
    id: "national-database",
    sports: [A.FB],
    order: 10,
    title: "National Database",
    description: "Built for modern college football recruiting",
    points: [
      "Nation's most updated coach and player database",
      "Verified contacts for thousands of programs",
      "Projections, testing, offers, camps, and film",
      "Advanced search filters with ARMS integration",
    ],
    media: {
      kind: "still",
      src: null,
      placeholderNote: "National database — screenshot",
      objectPosition: "50% 48%",
    },
  },
  {
    id: "transfer-technology-database",
    sports: TRANSFER_STACK,
    order: 20,
    title: "Transfer Technology & Database",
    description: "Automate transfer athlete discovery",
    points: [
      "Search, sort, and filter portal players",
      "Get notifications when athletes meet your criteria",
      "Detailed player profiles",
      "Organize evaluations and staff communication",
    ],
    media: {
      kind: "gif",
      src: null,
      placeholderNote: "5–10 second GIF of search page and filtering",
      objectPosition: "50% 48%",
    },
  },
  {
    id: "recruiting-boards-depth-charts",
    sports: TRANSFER_STACK,
    order: 30,
    title: "Recruiting Boards & Depth Charts",
    description: "Organize your entire recruiting process in one place",
    points: [
      "Keep your staff aligned on evaluations",
      "Track players through every stage of recruiting",
      "Manage roster needs, depth charts, and future planning with clarity",
    ],
    media: {
      kind: "gif",
      src: null,
      placeholderNote: "10 second GIF of recruiting board",
      objectPosition: "46% 44%",
    },
  },
  {
    id: "pre-portal-tracking-impact",
    sports: PRE_PORTAL_IMPACT_SCORES,
    order: 40,
    title: "Pre-Portal Tracking System",
    description: "Know who's next — before anyone else does",
    points: [
      ...PRE_PORTAL_BASE_POINTS,
      'Find the "best available" with Verified impact scores',
    ],
    media: {
      kind: "still",
      src: null,
      placeholderNote: "Screenshot — pre-portal tracking",
      objectPosition: "54% 52%",
    },
  },
  {
    id: "pre-portal-tracking-track",
    sports: PRE_PORTAL_EVENT_RESULTS,
    order: 40,
    title: "Pre-Portal Tracking System",
    description: "Know who's next — before anyone else does",
    points: [
      ...PRE_PORTAL_BASE_POINTS,
      'Find the "best available" with sorting by event results',
    ],
    media: {
      kind: "still",
      src: null,
      placeholderNote: "Screenshot — pre-portal tracking",
      objectPosition: "54% 52%",
    },
  },
  {
    id: "pre-portal-tracking-standard",
    sports: PRE_PORTAL_NO_EXTRA_BA,
    order: 40,
    title: "Pre-Portal Tracking System",
    description: "Know who's next — before anyone else does",
    points: [...PRE_PORTAL_BASE_POINTS],
    media: {
      kind: "still",
      src: null,
      placeholderNote: "Screenshot — pre-portal tracking",
      objectPosition: "54% 52%",
    },
  },
  {
    id: "recruiting-activity-insights",
    sports: [A.FB],
    order: 50,
    title: "Recruiting Activity Insights",
    description: "Stay ahead of every recruiting move",
    points: [
      "Daily customized offer alerts",
      "Search camps, visits, offers, and commits",
      "Complete recruiting history and timelines",
      "Data collected from X, On3, 247 and more",
    ],
    media: {
      kind: "still",
      src: null,
      placeholderNote: "Recruiting activity insights — screenshot",
      objectPosition: "50% 50%",
    },
  },
  {
    id: "on-the-road-recruiting",
    sports: [A.FB],
    order: 60,
    title: "On-the-Road Recruiting Tools",
    description: "Turn travel time into recruiting time",
    points: [
      "Plan and organize recruiting trips",
      "Optimize routes and daily schedules",
      "Print daily road plans with school and athlete info",
      "Record notes, evaluations, and updates",
    ],
    media: {
      kind: "still",
      src: null,
      placeholderNote: "On-the-road recruiting tools — screenshot",
      objectPosition: "48% 50%",
    },
  },
  {
    id: "national-juco-database-stats",
    sports: JUCO_STACK.filter((s) => s !== A.TAF),
    order: 70,
    title: "National JUCO Database",
    description: "Explore every avenue for roster building",
    points: [
      "Sort by stats and evaluate talent across the entire country",
      "Use Verified impact scores to quickly understand competition level and player value",
    ],
    media: {
      kind: "still",
      src: null,
      placeholderNote: "Snapshot of JUCO page",
      objectPosition: "48% 50%",
    },
  },
  {
    id: "national-juco-database-track",
    sports: [A.TAF],
    order: 70,
    title: "National JUCO Database",
    description: "Explore every avenue for roster building",
    points: ["Sort by results and evaluate talent across the entire country"],
    media: {
      kind: "still",
      src: null,
      placeholderNote: "Snapshot of JUCO page",
      objectPosition: "48% 50%",
    },
  },
  {
    id: "roster-management-tools",
    sports: TRANSFER_STACK,
    order: 80,
    title: "Roster Management Tools",
    description: "Manage your roster with greater clarity",
    points: [
      "Organize evaluations with custom pipelines",
      "Track budgets, scholarships, and roster needs",
      "Compare players and make smarter roster decisions",
    ],
    media: {
      kind: "still",
      src: null,
      placeholderNote: "Snapshot of CAP Manager",
      objectPosition: "52% 46%",
    },
  },
  {
    id: "score-tracker",
    sports: [A.FB],
    order: 90,
    title: "Score Tracker",
    description: "Eliminate stress and added work",
    points: [
      "Overnight HS/JUCO scores and game summaries",
      "Player stats and performance summaries",
      "Track recruits throughout the season",
    ],
    media: {
      kind: "still",
      src: null,
      placeholderNote: "Score tracker — screenshot",
      objectPosition: "50% 48%",
    },
  },
  {
    id: "camp-data",
    sports: [A.FB],
    order: 100,
    title: "Camp Data",
    description: "Comprehensive camp information in one place",
    points: [
      "Access college hosted and Adidas sponsored camp data",
      "60,000 campers, 400,000 measurements and counting",
      "Watch video organized by event and camp",
    ],
    media: {
      kind: "still",
      src: null,
      placeholderNote: "Camp data — screenshot",
      objectPosition: "50% 48%",
    },
  },
];

/** @type {Record<string, string>} */
const SPORT_LABEL_TO_ACRONYM = Object.fromEntries(
  Object.entries(WORKFLOW_SPORT_ACRONYMS).map(([acro, label]) => [label, acro]),
);

const NO_SPORT_PREVIEW_IDS = [
  "transfer-technology-database",
  "recruiting-boards-depth-charts",
  "pre-portal-tracking-impact",
  "roster-management-tools",
];

function sportToAcronym(selectedSport) {
  if (!selectedSport) {
    return undefined;
  }
  if (selectedSport === ATHLETIC_DEPARTMENT) {
    return A.WBB;
  }
  return SPORT_LABEL_TO_ACRONYM[selectedSport];
}

/**
 * @param {string | undefined} selectedSport — site sport label from nav picker
 * @returns {ProductWorkflowDefinition[]}
 */
export function getProductWorkflowShowcasesForSport(selectedSport) {
  const acro = sportToAcronym(selectedSport);

  if (!acro) {
    return WORKFLOW_DEFINITIONS.filter((d) => NO_SPORT_PREVIEW_IDS.includes(d.id)).sort(
      (a, b) => a.order - b.order,
    );
  }

  return WORKFLOW_DEFINITIONS.filter((d) => d.sports.includes(acro)).sort((a, b) => a.order - b.order);
}

/** @deprecated Use getProductWorkflowShowcasesForSport */
export const PRODUCT_WORKFLOW_SHOWCASES = getProductWorkflowShowcasesForSport(COLLEGE_FOOTBALL);

/**
 * @param {ProductWorkflowMedia} media
 */
export function resolveWorkflowMediaSrc(media) {
  if (!media?.src) return null;
  if (media.src.startsWith("http://") || media.src.startsWith("https://")) {
    return media.src;
  }
  const path = media.src.startsWith("/") ? media.src : `/${media.src}`;
  return assetPath(path);
}
