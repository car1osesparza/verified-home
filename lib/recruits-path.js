/**
 * Recruits hub (formerly /resources).
 *
 * Use recruitsPath / recruitsSectionPath with Next.js `<Link>` and `router` — basePath
 * is applied automatically. Use *FromLocation helpers for `window.location` only.
 */

const RECRUITS_PATH = "/recruits/";

function basePrefix() {
  return (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/+$/, "");
}

function withBasePrefix(path) {
  const bp = basePrefix();
  return bp ? `${bp}${path}` : path;
}

/** Path for `<Link>` and `router` (do not include NEXT_PUBLIC_BASE_PATH). */
export function recruitsPath() {
  return RECRUITS_PATH;
}

/** Hash URL for `<Link>` and `router`. */
export function recruitsSectionPath(sectionId) {
  const id = String(sectionId).replace(/^#/, "");
  return `${RECRUITS_PATH}#${id}`;
}

/** Path for `window.location` on GitHub Pages / subpath deploys. */
export function recruitsPathFromLocation() {
  return withBasePrefix(RECRUITS_PATH);
}

/** Hash URL for `window.location` on GitHub Pages / subpath deploys. */
export function recruitsSectionPathFromLocation(sectionId) {
  const id = String(sectionId).replace(/^#/, "");
  return withBasePrefix(`${RECRUITS_PATH}#${id}`);
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
