export const disableCSPInProduction = () => {
  if (process.env.NODE_ENV === 'production') {
    return []
  }
  
  return [
    {
      key: 'Content-Security-Policy',
      value: [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https:",
        "font-src 'self' data:",
        "connect-src 'self' ws: wss:",
        "frame-src 'self'",
        "object-src 'none'",
        "form-action 'self'",
        "base-uri 'self'"
      ].join('; ')
    }
  ]
}