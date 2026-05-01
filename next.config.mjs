/** @type {import('next').NextConfig} */
const isGithubPagesBuild = process.env.GITHUB_ACTIONS === "true";
const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
const basePath = isGithubPagesBuild && repoName ? `/${repoName}` : "";

const nextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  basePath,
  assetPrefix: basePath || undefined,
};

export default nextConfig;
