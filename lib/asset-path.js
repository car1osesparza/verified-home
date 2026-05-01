export function assetPath(path) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  if (!path) return basePath || "";
  if (path.startsWith("/")) return `${basePath}${path}`;
  return `${basePath}/${path}`;
}
