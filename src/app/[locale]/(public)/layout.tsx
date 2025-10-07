"use client";

import Footer from "@/components/commun/Footer";
import ScrollEffectProvider from "@/components/provider/ScrollEffectProvider";
import { InversedThemeProvider } from "@/components/provider/inversedTheme";
import Navbar from "@/components/commun/Navbar";


export default function PublicLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {

  return (
    <>
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