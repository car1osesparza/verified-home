/**
 * Recruits hub (formerly /resources). Paths respect NEXT_PUBLIC_BASE_PATH.
 */

export function recruitsPath() {
  const bp = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/+$/, "");
  return bp ? `${bp}/recruits/` : "/recruits/";
}

/** Section hash on the recruits page (respects base path + trailing slash). */
export function recruitsSectionPath(sectionId) {
  const id = String(sectionId).replace(/^#/, "");
  const bp = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/+$/, "");
  return bp ? `${bp}/recruits/#${id}` : `/recruits/#${id}`;
}

/** @param {string | null | undefined} pathname */
export function isRecruitsPath(pathname) {
  if (!pathname) {
    return false;
  }
  const normalized = pathname.replace(/\/$/, "");
  return normalized === "/recruits" || normalized.endsWith("/recruits");
}

/** Legacy /resources URLs (redirect to /recruits). */
export function isLegacyResourcesPath(pathname) {
  if (!pathname) {
    return false;
  }
  const normalized = pathname.replace(/\/$/, "");
  return normalized === "/resources" || normalized.endsWith("/resources");
}

export function isRecruitsOrLegacyResourcesPath(pathname) {
  return isRecruitsPath(pathname) || isLegacyResourcesPath(pathname);
}
