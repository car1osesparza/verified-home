/**
 * Client-side path to the homepage with a hash fragment (respects NEXT_PUBLIC_BASE_PATH).
 * Use for redirects so /product and /pricing always land on the single-page home anchors.
 */
export function homeSectionHashPath(fragment) {
  const id = String(fragment).replace(/^#/, "");
  const bp = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/+$/, "");
  return bp ? `${bp}/#${id}` : `/#${id}`;
}
