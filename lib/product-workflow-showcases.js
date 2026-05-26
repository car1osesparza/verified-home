import { assetPath } from "./asset-path";

/**
 * Workflow cards under “Built for the full recruiting workflow”.
 * Set `media.src` when the asset is ready (`null` = placeholder with `placeholderNote`).
 *
 * @typedef {'gif' | 'still'} WorkflowMediaKind
 *
 * @typedef {object} ProductWorkflowMedia
 * @property {WorkflowMediaKind} kind
 * @property {string | null} src — Public path via `assetPath()` when delivered
 * @property {string} placeholderNote — Brief for design / PM until asset ships
 * @property {string} [objectPosition] — CSS object-position for crop
 *
 * @typedef {object} ProductWorkflowShowcase
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string[]} points
 * @property {ProductWorkflowMedia} media
 */

/** @type {ProductWorkflowShowcase[]} */
export const PRODUCT_WORKFLOW_SHOWCASES = [
  {
    id: "transfer-technology-database",
    title: "Transfer Technology & Database",
    description: "Automate everything involved in transfer recruiting",
    points: [
      "Find and track players",
      "Organize evaluations and staff communication",
      "Move faster and save hours every week",
    ],
    media: {
      kind: "gif",
      src: null,
      placeholderNote: "20 second gif of search page and filtering",
      objectPosition: "50% 48%",
    },
  },
  {
    id: "recruiting-boards-depth-charts",
    title: "Recruiting Boards & Depth Charts",
    description: "Organize your entire recruiting process in one place",
    points: [
      "Keep your staff aligned on evaluations and priorities",
      "Track players through every stage of recruiting",
      "Manage roster needs, depth charts, and future planning with clarity",
    ],
    media: {
      kind: "gif",
      src: null,
      placeholderNote: "10 second gif of recruiting board",
      objectPosition: "46% 44%",
    },
  },
  {
    id: "pre-portal-tracking",
    title: "Pre-Portal Tracking System",
    description: "Know who’s next — before anyone else does",
    points: [
      "Identify rising transfer targets before they enter the portal",
      "Track players year-round and organize recruiting priorities",
      "Get instant alerts the moment tracked athletes enter the portal",
      "Stay prepared and recruiting-ready 365 days a year",
    ],
    media: {
      kind: "still",
      src: null,
      placeholderNote: "Screenshot — pre-portal tracking",
      objectPosition: "54% 52%",
    },
  },
  {
    id: "national-juco-database",
    title: "National JUCO Database",
    description: "Explore every avenue for roster building",
    points: [
      "Find and evaluate talent across the entire country",
      "Use Verified Ratings to quickly understand competition level and player value",
    ],
    media: {
      kind: "still",
      src: null,
      placeholderNote: "Snapshot of JUCO page",
      objectPosition: "48% 50%",
    },
  },
  {
    id: "roster-management-tools",
    title: "Roster Management Tools",
    description: "Manage your roster with more organization and clarity",
    points: [
      "Organize evaluations through customizable pipelines",
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
];

/**
 * Resolve showcase media `src` (e.g. `/workflow/transfer-search.gif`).
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
