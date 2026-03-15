
/** @type {import('next').NextConfig} */
import createNextIntlPlugin from 'next-intl/plugin';
import type { Configuration as WebpackConfiguration } from 'webpack';

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['www.bungie.net', 'images.bungie.net', 'data.destinysets.com', 'cdn.jsdelivr.net', 'raw.githubusercontent.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net',
        pathname: '/gh/**',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        pathname: '/**',
      },
    ],
    formats: ['image/webp' as const, 'image/avif' as const],
    minimumCacheTTL: 31536000,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    globalNotFound: true,
    optimizeCss: true,
    optimizePackageImports: ['@radix-ui/react-accordion', '@radix-ui/react-avatar', '@radix-ui/react-dropdown-menu', '@radix-ui/react-slot', 'lucide-react'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  async headers() {
    const apiUrl = process.env.NEXT_PUBLIC_ENVIRONMENT === 'sandbox' ? process.env.NEXT_PUBLIC_API_SANDBOX_URL : process.env.NEXT_PUBLIC_API_URL
    const clarityApiUrl = process.env.NEXT_PUBLIC_CLARITY_API_URL || 'http://localhost:3001'
    const isProduction = process.env.NODE_ENV === 'production'

    const cspPolicy = isProduction ? [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://*.vercel.live https://*.vercel-scripts.com https://*.cloudflareinsights.com https://static.cloudflareinsights.com https://vercel.live https://va.vercel-scripts.com *.vercel.app",
      "style-src 'self' 'unsafe-inline' https:",
      "img-src 'self' data: https: https://images.bungie.net",
      "font-src 'self' data: https:",
      `connect-src 'self' https://www.bungie.net ${apiUrl} ${clarityApiUrl} https://vitals.vercel-insights.com https://cloudflareinsights.com https://*.vercel-analytics.com https://*.vercel-insights.com ws: wss:`,
      "frame-src 'self' https://www.bungie.net/7 https://www.bungie.net/7/fr/Destiny https://data.destinysets.com https://www.openstreetmap.org https://www.youtube.com/ https://vercel.live https://*.vercel.live",
      "object-src 'none'",
      "form-action 'self'",
      "base-uri 'self'"
    ] : [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https: https://images.bungie.net",
      "font-src 'self' data:",
      `connect-src 'self' https://www.bungie.net ${apiUrl} ${clarityApiUrl} ws: wss:`,
      "frame-src 'self' https://cdn.jsdelivr.net https://www.bungie.net/7 https://www.bungie.net/7/fr/Destiny https://data.destinysets.com https://www.openstreetmap.org https://www.youtube.com/ https://vercel.live https://*.vercel.live",
      "object-src 'none'",
      "form-action 'self'",
      "base-uri 'self'"
    ]

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
            value: cspPolicy.join('; ')
          }
        ]
      }
    ]
  },
  webpack(config: WebpackConfiguration) {
    const fileLoaderRule = config.module?.rules?.find((rule) => {
      if (typeof rule !== 'object' || rule === null) return false;
      const ruleWithTest = rule as { test?: RegExp };
      return ruleWithTest.test?.test?.('.svg');
    }) as {
      test?: RegExp;
      issuer?: string | RegExp | ((value: string) => boolean);
      resourceQuery?: { not?: (string | RegExp)[] };
      exclude?: RegExp;
    } | undefined;

    if (!fileLoaderRule) {
      return config;
    }

    config.module?.rules?.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/,
      },
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: {
          not: [...(fileLoaderRule.resourceQuery?.not || []), /url/]
        },
        use: ['@svgr/webpack'],
      }
    );

    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },

  // Proxy pour éviter les problèmes CORS
  async rewrites() {
    return [
      {
        source: '/api-proxy/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`
      }
    ]
  },
}
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);