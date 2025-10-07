"use client";

import Footer from "@/components/commun/Footer";
import ScrollEffectProvider from "@/components/provider/ScrollEffectProvider";
import { InversedThemeProvider } from "@/components/provider/inversedTheme";
import Navbar from "@/components/commun/Navbar";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";


export default function PublicLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {

  return (
    <>
      <Analytics />
      <SpeedInsights />
      <Navbar />
      <section className="relative">
        <Footer />
        <ScrollEffectProvider >
          <section id="page_wrapper" suppressHydrationWarning>
            {children}
          </section>
        </ScrollEffectProvider>
      </section>
    </>
  );
}