"use client"

import MaintenanceMode from '@/components/commun/MaintenanceMode';
import Container from '@/components/commun/container';
import ImageLueur from '@/components/commun/ImageLueur';
import Navbar from "@/components/commun/Navbar";
import Footer from "@/components/commun/Footer";
import ScrollEffectProvider from "@/components/provider/ScrollEffectProvider";
import GradientTitle from '@/components/commun/GradientTitle';
import { useTranslations } from 'next-intl';
import { BungieLoginButton } from '@/components/auth/BungieLoginButton';
import GlitchText from '@/components/effect/GlitchText';
import { motion } from 'framer-motion';
import { useMemo } from 'react';

export default function HomePage() {
  const t = useTranslations();
  const MAINTENANCE_MODE = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';
  console.log('NEXT_PUBLIC_ENVIRONMENT:', process.env.NEXT_PUBLIC_ENVIRONMENT);

  const delayedFadeTransition = useMemo(() => ({
    duration: 0.8,
    ease: "easeOut" as const,
    delay: 2.2
  }), []);

  if (MAINTENANCE_MODE) {
    return (
      <>
        <section className="relative">
          <Footer />
          <ScrollEffectProvider >
            <section id="page_wrapper" suppressHydrationWarning>
              <MaintenanceMode />
            </section>
          </ScrollEffectProvider>
        </section>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <section className="relative">
        <Footer />
        <ScrollEffectProvider >
          <section id="page_wrapper" suppressHydrationWarning>
            <Container className="flex flex-col items-center justify-center min-h-screen gap-6">
              <motion.div className='decoration__container__right absolute top-20 left-2 md:top-20 md:left-10 ' initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={delayedFadeTransition} style={{ willChange: 'opacity' }}>
                <GlitchText text='PROTOCOL' primaryFont='Grotesk' glitchFont='Vex' glitchMode='font' glitchProbability={0.01} />
              </motion.div>
              <motion.div className='decoration__container__left absolute bottom-15 right-10 ' initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={delayedFadeTransition} style={{ willChange: 'opacity' }}>
                <GlitchText text='27' glitchProbability={1} langage='vex' size={"3rem"} />
              </motion.div>
              <ImageLueur />
              <GradientTitle title={t('anom.titleClassic')} subtitle={t('anom.description2')} className='text-gray-300' />
              <BungieLoginButton />
            </Container>
          </section>
        </ScrollEffectProvider>
      </section>
    </>
  );
}
