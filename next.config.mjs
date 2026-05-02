/** @type {import('next').NextConfig} */
const isGithubPagesBuild = process.env.GITHUB_ACTIONS === "true";
const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";

/** e.g. `/my-repo` for GitHub Pages project sites — required at build time for chunk URLs. */
function normalizeBasePath(raw) {
  if (!raw || typeof raw !== "string") {
    return "";
  }
  let p = raw.trim();
  if (!p) {
    return "";
  }
  if (!p.startsWith("/")) {
    p = `/${p}`;
  }
  p = p.replace(/\/+$/, "");
  return p === "/" ? "" : p;
}

// For GitHub **project** Pages, set NEXT_PUBLIC_BASE_PATH=/<repo> at build time (see pages.yml).
// A local `NEXT_STATIC_EXPORT=true next build` without it emits `/_next/...` and styles 404 on /<repo>/.
const explicitBase = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH || "");
const basePath = explicitBase || (isGithubPagesBuild && repoName ? `/${repoName}` : "");

/**
 * Next.js setting: `output: 'export'` — official name **"static HTML export"**
 * (writes `out/` for GitHub Pages, S3, etc.). Off by default; enable with NEXT_STATIC_EXPORT=true.
 */
const staticExport = process.env.NEXT_STATIC_EXPORT === "true";

const nextConfig = {
  reactStrictMode: true,
  ...(staticExport ? { output: "export" } : {}),
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  /** Prevents flaky server vendor chunks like `vendor-chunks/@ant-design.js` (ENOENT at runtime). */
  transpilePackages: ["antd", "@ant-design/icons", "@ant-design/nextjs-registry", "@ant-design/cssinjs"],
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  basePath,
  assetPrefix: basePath || undefined,
};

export default nextConfig;
