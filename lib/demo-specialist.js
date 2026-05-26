import { COLLEGE_FOOTBALL, PATTY_SALES_SPORTS } from "./site-data";

/** Headshots + roles for “Book a demo” specialist preview (aligned with About page). */

const ANDREW = {
  name: "Andrew Gruesser",
  image:
    "https://images.squarespace-cdn.com/content/v1/65c100ca4db1c50c3f74bd6d/40cd50fa-1a2b-4cb5-961b-2008a9eab174/AndrewG_fix.png",
  role: "Director of Sales and Customer Success, All Sports",
};

const SHANE = {
  name: "Shane Fogarty",
  image:
    "https://images.squarespace-cdn.com/content/v1/65c100ca4db1c50c3f74bd6d/330f748b-eeed-4a70-bf63-5349c2f2cf5d/shane_fix.png",
  role: "Director of Sales and Customer Success, Football",
};

const PATTY = {
  name: "Patty Maye Ohanian",
  image:
    "https://images.squarespace-cdn.com/content/v1/65c100ca4db1c50c3f74bd6d/8aabe0cb-8d17-4c4b-bd57-bc08c3b49335/Patty_fix.png",
  role: "Director of Sales, Customer Success & Company Community",
};

const pattySportSet = new Set(PATTY_SALES_SPORTS);

export function getDemoSpecialistForSport(sport) {
  if (sport === COLLEGE_FOOTBALL || sport === "Football") {
    return SHANE;
  }
  if (pattySportSet.has(sport)) {
    return PATTY;
  }
  return ANDREW;
}
