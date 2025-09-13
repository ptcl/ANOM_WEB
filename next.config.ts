/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['www.bungie.net', 'images.bungie.net', 'data.destinysets.com'],
  },
  async headers() {
    // Récupération des URLs depuis les variables d'environnement
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
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
              `connect-src 'self' https://www.bungie.net ${apiUrl} ${clarityApiUrl}`,
              "frame-src 'self' https://www.bungie.net/7 https://www.bungie.net/7/fr/Destiny https://data.destinysets.com https://www.openstreetmap.org https://www.youtube.com/",
              "object-src 'none'",
              "form-action 'self'",
              "base-uri 'self'"
            ].join('; ')
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig