import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      { source: "/:path*", headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        // Restricts embedding and document capabilities without changing script,
        // worker, WASM or asset loading required by Next.js and Spline.
        { key: "Content-Security-Policy", value: "object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'" },
      ] },
      { source: "/api/:path*", headers: [
        { key: "Cache-Control", value: "private, no-store, max-age=0" },
      ] },
    ];
  },
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
