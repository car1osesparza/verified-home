import { COLLEGE_FOOTBALL } from "./site-data";

/** @typedef {"3-year" | "1-year"} ContractTerm */
/** @typedef {"four-tier" | "football" | "elite-ultra"} PricingLayout */

/**
 * @typedef {Object} PricingTier
 * @property {string} name
 * @property {{ "3-year"?: string; "1-year"?: string }} prices
 * @property {string} [description]
 * @property {string[]} includes
 * @property {string} [badge]
 * @property {string} [audienceLabel] — e.g. football tier audience
 */

/**
 * @typedef {Object} SportPricingConfig
 * @property {PricingLayout} layout
 * @property {PricingTier[]} tiers
 * @property {string} [categoryNote] — shown under tier grid (e.g. Track & Field)
 * @property {string} [genderSplitNote] — men's/women's-only pricing ask
 */

export const PRICING_STARTER_INCLUDES = [
  "D1, D2, D3 Transfers (No P4)",
  "Email Alerts",
  "Recruiting Boards",
  "Verified Rankings",
];

export const PRICING_STARTER_PLUS_INCLUDES = [
  "D1, D2, D3 Transfers (No P4)",
  "Email Alerts",
  "Recruiting Boards",
  "Verified Rankings",
  "JUCO Database",
];

export const PRICING_ELITE_INCLUDES = [
  "D1, D2, D3 Transfers",
  "Email Alerts",
  "Recruiting Boards",
  "Verified Rankings",
];

export const PRICING_ULTRA_INCLUDES = [
  "All D1, D2, D3 Transfers",
  "Email Alerts",
  "Recruiting Boards",
  "Verified Rankings",
  "JUCO Database",
  "Pre-Portal Tracking",
  "CAP Manager",
];

const GENDER_SPLIT_NOTE = "Ask about pricing for just men's or women's teams.";

const TRACK_CATEGORY_NOTE = "Includes Men's & Women's teams";

/** Elite / Ultra feature set for golf & tennis. */
const ELITE_ULTRA_GOLF_TENNIS_ELITE_INCLUDES = [
  "D1, D2, D3 Transfers (No P4)",
  "Email Alerts",
  "Recruiting Boards",
  "Includes Men's & Women's teams",
];

/** Elite / Ultra feature set for lacrosse, swimming, wrestling. */
const ELITE_ULTRA_COMPACT_ELITE_INCLUDES = [
  "D1, D2, D3 Transfers (No P4)",
  "Email Alerts",
  "Recruiting Boards",
];

const ELITE_ULTRA_ULTRA_INCLUDES = [
  "Everything in Elite",
  "Pre-Portal Database",
  "CAP Manager",
];

/** Default transfer pricing (3-year + 1-year). */
export const DEFAULT_TRANSFER_TIERS = [
  {
    name: "Starter",
    prices: { "3-year": "$4,300/year", "1-year": "$6,700/year" },
    includes: PRICING_STARTER_INCLUDES,
  },
  {
    name: "Starter+",
    prices: { "3-year": "$6,825/year", "1-year": "$9,550/year" },
    includes: PRICING_STARTER_PLUS_INCLUDES,
  },
  {
    name: "Elite",
    prices: { "3-year": "$7,300/year", "1-year": "$10,000/year" },
    includes: PRICING_ELITE_INCLUDES,
  },
  {
    name: "Ultra",
    prices: { "3-year": "$13,000/year", "1-year": "$17,000/year" },
    includes: PRICING_ULTRA_INCLUDES,
  },
];

/** MBB, WBB, BSB, SB, MSOC, WSOC, WVOL — four-tier 3-year list prices. */
export const STANDARD_SPORT_TIERS = [
  {
    name: "Starter",
    prices: { "3-year": "$825/year", "1-year": "$1,300/year" },
    includes: PRICING_STARTER_INCLUDES,
  },
  {
    name: "Starter+",
    prices: { "3-year": "$1,425/year", "1-year": "$2,225/year" },
    includes: PRICING_STARTER_PLUS_INCLUDES,
  },
  {
    name: "Elite",
    prices: { "3-year": "$1,700/year", "1-year": "$2,400/year" },
    includes: PRICING_ELITE_INCLUDES,
  },
  {
    name: "Ultra",
    prices: { "3-year": "$3,000/year", "1-year": "$4,500/year" },
    includes: PRICING_ULTRA_INCLUDES,
  },
];

export const STANDARD_ONE_YEAR_SPORTS = [
  "Men's Basketball",
  "Women's Basketball",
  "Baseball",
  "Softball",
  "Men's Soccer",
  "Women's Soccer",
  "Women's Volleyball",
];

export const TRACK_AND_FIELD_TIERS = [
  {
    name: "Starter",
    prices: { "3-year": "$1,500/year", "1-year": "$2,525/year" },
    includes: PRICING_STARTER_INCLUDES,
  },
  {
    name: "Starter+",
    prices: { "3-year": "$2,650/year", "1-year": "$4,350/year" },
    includes: PRICING_STARTER_PLUS_INCLUDES,
  },
  {
    name: "Elite",
    prices: { "3-year": "$3,100/year", "1-year": "$4,650/year" },
    includes: PRICING_ELITE_INCLUDES,
  },
  {
    name: "Ultra",
    prices: { "3-year": "$5,600/year", "1-year": "$8,800/year" },
    includes: PRICING_ULTRA_INCLUDES,
  },
];

export const GOLF_TENNIS_TIERS = [
  {
    name: "Elite",
    prices: { "3-year": "$825/year", "1-year": "$1,300/year" },
    includes: ELITE_ULTRA_GOLF_TENNIS_ELITE_INCLUDES,
  },
  {
    name: "Ultra",
    prices: { "3-year": "$1,700/year", "1-year": "$2,400/year" },
    includes: ELITE_ULTRA_ULTRA_INCLUDES,
  },
];

export const LACROSSE_WRESTLING_TIERS = [
  {
    name: "Elite",
    prices: { "3-year": "$825/year", "1-year": "$1,300/year" },
    includes: ELITE_ULTRA_COMPACT_ELITE_INCLUDES,
  },
  {
    name: "Ultra",
    prices: { "3-year": "$1,700/year", "1-year": "$2,400/year" },
    includes: ELITE_ULTRA_ULTRA_INCLUDES,
  },
];

export const SWIMMING_TIERS = [
  {
    name: "Elite",
    prices: { "3-year": "$1,500/year", "1-year": "$2,525/year" },
    includes: ELITE_ULTRA_COMPACT_ELITE_INCLUDES,
  },
  {
    name: "Ultra",
    prices: { "3-year": "$3,100/year", "1-year": "$4,650/year" },
    includes: ELITE_ULTRA_ULTRA_INCLUDES,
  },
];

export const FOOTBALL_TIERS = [
  {
    name: "Silver+",
    prices: { "3-year": "$2,975/year", "1-year": "$4,350/year" },
    audienceLabel: "For Non-D1 Teams",
    includes: [
      "High School and JUCO Database",
      "Enhanced Transfer Database",
      "AI Suggested Targets",
      "Non-D1 Offer Alerts",
      "Non-D1 Score Tracker",
      "Opt in Camp Data",
      "ARMS Integration",
      "Recruiting Boards and Eval Pipeline",
    ],
  },
  {
    name: "Gold",
    prices: { "3-year": "$7,300/year", "1-year": "$10,500/year" },
    audienceLabel: "For FCS and some G5 Teams",
    includes: [
      "Everything in Silver+",
      "Full Athlete Database",
      "Full Enhanced Transfer Database",
      "Offer Alerts",
      "Score Tracker",
      "Track Data",
      "Pre-Portal Predictions",
      "Daily ARMS Integration",
    ],
  },
  {
    name: "Platinum",
    prices: { "3-year": "$17,970/year", "1-year": "$22,800/year" },
    audienceLabel: "For P4 and top G5 Teams",
    includes: [
      "Everything in Gold",
      "CAP Manager",
      "Camp Video and Testing",
      "Road Planning Tool",
      "Custom Layouts",
      "ID Pool",
    ],
  },
];

/** @type {Record<string, SportPricingConfig>} */
const SPORT_PRICING = {
  [COLLEGE_FOOTBALL]: { layout: "football", tiers: FOOTBALL_TIERS },
  "Athletic Department": {
    layout: "four-tier",
    tiers: DEFAULT_TRANSFER_TIERS,
    genderSplitNote: GENDER_SPLIT_NOTE,
  },
  "Track & Field": {
    layout: "four-tier",
    tiers: TRACK_AND_FIELD_TIERS,
    categoryNote: TRACK_CATEGORY_NOTE,
    genderSplitNote: GENDER_SPLIT_NOTE,
  },
  Golf: { layout: "elite-ultra", tiers: GOLF_TENNIS_TIERS, genderSplitNote: GENDER_SPLIT_NOTE },
  Tennis: { layout: "elite-ultra", tiers: GOLF_TENNIS_TIERS, genderSplitNote: GENDER_SPLIT_NOTE },
  Lacrosse: {
    layout: "elite-ultra",
    tiers: LACROSSE_WRESTLING_TIERS,
    genderSplitNote: GENDER_SPLIT_NOTE,
  },
  "Swimming & Diving": {
    layout: "elite-ultra",
    tiers: SWIMMING_TIERS,
    genderSplitNote: GENDER_SPLIT_NOTE,
  },
  "Men's Wrestling": {
    layout: "elite-ultra",
    tiers: LACROSSE_WRESTLING_TIERS,
    genderSplitNote: GENDER_SPLIT_NOTE,
  },
};

STANDARD_ONE_YEAR_SPORTS.forEach((sport) => {
  SPORT_PRICING[sport] = {
    layout: "four-tier",
    tiers: STANDARD_SPORT_TIERS,
    genderSplitNote: GENDER_SPLIT_NOTE,
  };
});

/** @param {string | undefined} sport */
export function getPricingConfigForSport(sport) {
  if (!sport) {
    return null;
  }
  if (SPORT_PRICING[sport]) {
    return SPORT_PRICING[sport];
  }
  return {
    layout: "four-tier",
    tiers: DEFAULT_TRANSFER_TIERS,
    genderSplitNote: GENDER_SPLIT_NOTE,
  };
}

export function isFootballSport(sport) {
  return sport === COLLEGE_FOOTBALL;
}
