import { assetPath } from "./asset-path";

/** Role phrases → customer_list schoolName (same data as coverage map). */
const ROLE_SCHOOL_ALIASES = [
  ["south carolina women's", "University of South Carolina"],
  ["south carolina", "University of South Carolina"],
  ["virginia tech", "Virginia Tech"],
  ["old dominion", "Old Dominion University"],
  ["south alabama", "University of South Alabama"],
  ["wright state", "Wright State University"],
  ["stetson university", "Stetson University"],
  ["stetson", "Stetson University"],
  ["indiana university", "Indiana University Bloomington"],
  ["university of maryland", "University of Maryland"],
  ["maryland women's", "University of Maryland"],
  ["unc greensboro", "University of North Carolina at Greensboro"],
  ["uncg", "University of North Carolina at Greensboro"],
  ["uconn", "University of Connecticut"],
  ["miami university", "Miami University (OH)"],
  ["university of miami", "University of Miami (FL)"],
  ["tcu", "TCU"],
  ["drexel", "Drexel University"],
  ["williams college", "Williams College"],
];

let schoolsCache = null;
let schoolsLoadPromise = null;

/** @returns {Promise<{ schoolName: string, logo?: string }[]>} */
export async function loadCustomerSchoolsForTestimonials() {
  if (schoolsCache) {
    return schoolsCache;
  }
  if (!schoolsLoadPromise) {
    schoolsLoadPromise = fetch(assetPath("/data/customer_list_w_logo.json"))
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load school logos");
        }
        return res.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) {
          return [];
        }
        schoolsCache = data.filter((s) => s?.schoolName && s?.logo);
        return schoolsCache;
      })
      .catch(() => {
        schoolsLoadPromise = null;
        return [];
      });
  }
  return schoolsLoadPromise;
}

/**
 * Match a testimonial role line to a map customer logo URL.
 * @param {string | undefined} role
 * @param {{ schoolName: string, logo?: string }[]} schools
 * @returns {string | null}
 */
export function resolveSchoolLogoFromRole(role, schools) {
  if (!role?.trim() || !schools?.length) {
    return null;
  }

  const hay = role.toLowerCase();

  for (const [needle, schoolName] of ROLE_SCHOOL_ALIASES) {
    if (hay.includes(needle)) {
      const hit = schools.find((s) => s.schoolName === schoolName);
      if (hit?.logo) {
        return hit.logo;
      }
    }
  }

  const byLength = [...schools].sort((a, b) => b.schoolName.length - a.schoolName.length);
  for (const school of byLength) {
    const name = school.schoolName.toLowerCase();
    if (name.length >= 4 && hay.includes(name)) {
      return school.logo || null;
    }
  }

  return null;
}
