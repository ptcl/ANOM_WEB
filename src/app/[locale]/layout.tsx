import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { ThemeProvider } from "next-themes";
import { WebSiteJsonLd, OrganizationJsonLd } from '@/components/seo/JsonLd';
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { ibmPlexMono, neueHaasDisplay, satoshi } from '@/lib/fonts'
import '@/css/optimizedFonts.css'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }>; }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale} suppressHydrationWarning className={`${ibmPlexMono.variable} ${neueHaasDisplay.variable} ${satoshi.variable}`}>
      <head>
        <WebSiteJsonLd />
        <OrganizationJsonLd />
      </head>
      <body>
        <NextIntlClientProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}