const isGitHubPages = process.env.GITHUB_PAGES === "true";
const basePath = isGitHubPages ? (process.env.NEXT_PUBLIC_BASE_PATH || "") : "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  agentRules: false,
  serverExternalPackages: ["openai"],
  ...(isGitHubPages ? {
    output: "export",
    basePath,
    assetPrefix: basePath || undefined,
    trailingSlash: true,
    images: { unoptimized: true }
  } : {})
};

export default nextConfig;
