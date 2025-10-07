// next.config.ts
/** @type {import('next').NextConfig} */
import createNextIntlPlugin from 'next-intl/plugin';
import type { Configuration as WebpackConfiguration } from 'webpack';

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['www.bungie.net', 'images.bungie.net', 'data.destinysets.com'],
  },
  async headers() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || ''
    const clarityApiUrl = process.env.NEXT_PUBLIC_CLARITY_API_URL || 'http://localhost:3001'
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https: https://images.bungie.net",
              "font-src 'self' data:",
              `connect-src 'self' https://www.bungie.net ${apiUrl} ${clarityApiUrl} ws: wss:`,
              "frame-src 'self' https://www.bungie.net/7 https://www.bungie.net/7/fr/Destiny https://data.destinysets.com https://www.openstreetmap.org https://www.youtube.com/",
              "object-src 'none'",
              "form-action 'self'",
              "base-uri 'self'"
            ].join('; ')
          }
        ]
      }
    ]
  },
  webpack(config: WebpackConfiguration) {
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module?.rules?.find((rule) => {
      if (typeof rule !== 'object' || rule === null) return false;
      const ruleWithTest = rule as { test?: RegExp };
      return ruleWithTest.test?.test?.('.svg');
    }) as {
      test?: RegExp;
      issuer?: unknown;
      resourceQuery?: { not?: unknown[] };
      exclude?: RegExp;
    } | undefined;

    if (!fileLoaderRule) {
      return config;
    }

    config.module?.rules?.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: {
          not: [...(fileLoaderRule.resourceQuery?.not || []), /url/]
        }, // exclude if *.svg?url
        use: ['@svgr/webpack'],
      }
    );

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
}
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);