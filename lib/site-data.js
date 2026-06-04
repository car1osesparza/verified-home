export const COLLEGE_FOOTBALL = "College Football";
export const ATHLETIC_DEPARTMENT = "Athletic Department";
/** Dropdown-only: navigates to Recruits (HS Football Coaches), not a college sport selection. */
export const HS_FOOTBALL = "HS Football";

/** Sports routed to Patty Maye Ohanian (demo CTA + About highlight). Labels match internal `SPORTS` values. */
export const PATTY_SALES_SPORTS = [
  "Women's Basketball",
  "Softball",
  "Golf",
  "Lacrosse",
  "Women's Volleyball",
  "Track & Field",
];

/** College sports used for pricing, workflows, and persisted sport preference. */
export const SPORTS = [
  COLLEGE_FOOTBALL,
  ATHLETIC_DEPARTMENT,
  "Baseball",
  "Men's Basketball",
  "Women's Basketball",
  "Men's Soccer",
  "Women's Soccer",
  "Softball",
  "Track & Field",
  "Women's Volleyball",
  "Golf",
  "Lacrosse",
  "Tennis",
  "Swimming & Diving",
  "Men's Wrestling",
];

/**
 * Sport picker order + display labels (includes HS Football → Recruits).
 * @type {{ value: string, label: string, recruitsSection?: string }[]}
 */
export const SPORT_DROPDOWN_OPTIONS = [
  { value: COLLEGE_FOOTBALL, label: "College Football" },
  { value: HS_FOOTBALL, label: "HS Football", recruitsSection: "hs-football-coaches" },
  { value: ATHLETIC_DEPARTMENT, label: "Athletic Department" },
  { value: "Baseball", label: "Baseball" },
  { value: "Men's Basketball", label: "Basketball (M)" },
  { value: "Women's Basketball", label: "Basketball (W)" },
  { value: "Men's Soccer", label: "Soccer (M)" },
  { value: "Women's Soccer", label: "Soccer (W)" },
  { value: "Softball", label: "Softball" },
  { value: "Track & Field", label: "Track & Field / CC" },
  { value: "Women's Volleyball", label: "Volleyball (W)" },
  { value: "Golf", label: "Golf" },
  { value: "Lacrosse", label: "Lacrosse" },
  { value: "Tennis", label: "Tennis" },
  { value: "Swimming & Diving", label: "Swimming & Diving" },
  { value: "Men's Wrestling", label: "Wrestling (M)" },
];

export const STATS = [
  { value: "1,701", label: "College programs" },
  { value: "464", label: "Football programs" },
  { value: "689", label: "NCAA Division I" },
  { value: "92%", label: "Customer retention" },
];

export const CAPABILITIES = [
  {
    title: "Data",
    description: "Verified transfer profiles with role, fit, and contact context.",
  },
  {
    title: "Alerts",
    description: "Real-time notifications when portal movement matches your needs.",
  },
  {
    title: "Speed",
    description: "Recruit faster with search workflows made for coaching staffs.",
  },
  {
    title: "Inside Info",
    description: "Sport-specific intelligence aligned to each recruiting calendar.",
  },
  {
    title: "AI Targets",
    description: "Suggested targets mapped to depth chart and roster gaps.",
  },
];

export const TESTIMONIALS = [
  "Verified has the most complete information in the industry and serves as the foundation for our prospect database.",
  "Verified helps us find players with speed and efficiency. We offered 5 transfers and signed all 5.",
  "The amount and quality of contact data is better than any recruiting tool we have used.",
];

export const FOUNDERS = [
  {
    name: "Nathan Slutzky",
    role: "Chief Executive Officer (CEO), Co-Founder",
    bio: "Former college football coach (Rutgers, Colorado, Fordham, Albright) with deep analytics and AI experience. Previously worked at Bridgewater Associates and brings technical + football domain expertise to recruiting workflows.",
  },
  {
    name: "Damir Makic",
    role: "Chief Operating Officer (COO), Co-Founder",
    bio: "Former investment banking VP with 15+ years in financial analysis, M&A, and technology-focused advisory work. Leads operational and strategic growth for Verified Athletics.",
  },
];

export const TEAM = [
  "Andrew Gruesser - Director of Sales and Customer Success, All Sports",
  "Shane Fogarty - Director of Sales and Customer Success, Football",
  "Patty Maye Ohanian - Director of Sales, Customer Success & Company Community",
  "Danny Marx - Head of Technology",
  "Erikka Makic - Head of Data Management",
  "Robert Quinn - Head of Database Operations",
  "Sam Boyer - Senior Data Analyst",
  "Katie Nepil - Data Analyst",
];
