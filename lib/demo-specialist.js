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

export function getDemoSpecialistForSport(sport) {
  if (sport === "Football") {
    return SHANE;
  }
  return ANDREW;
}
