'use client'

import React, { useState, useEffect, useMemo, useCallback, memo } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import '../../css/maintenance.css'
import GlitchText from '../effect/GlitchText'
import { useTranslations } from 'next-intl'
import { ArrowUpRight } from 'lucide-react'
import { Link } from '@/i18n/navigation'

type RandomText = { id: number; text: string; x: number; y: number };

const RandomTextItem = memo(({ randomText }: { randomText: RandomText }) => (
    <div className='fixed pointer-events-none text-sm z-50 text-gray-500' style={{ left: `${randomText.x}px`, top: `${randomText.y}px`, willChange: 'transform, opacity', transform: 'translate3d(0,0,0)' }}>
        <GlitchText primaryFont='Grotesk' glitchFont='Vex' glitchMode='font' text={randomText.text} />
    </div>
));
RandomTextItem.displayName = 'RandomTextItem';

export default function MaintenanceMode() {
    const t = useTranslations();
    const [randomTexts, setRandomTexts] = useState<RandomText[]>([]);

    const phrases = useMemo(() => [
        t('maintenance.hint.line1'),
        t('maintenance.hint.line2'),
        t('maintenance.hint.line3'),
        t('maintenance.hint.line4'),
        t('maintenance.hint.line5'),
        t('maintenance.hint.line6'),
        t('maintenance.hint.line7'),
        t('maintenance.hint.line8'),
        t('maintenance.hint.line9'),
        t('maintenance.hint.line10'),
        t('maintenance.hint.line11'),
        t('maintenance.hint.line12'),
    ], [t]);

    const currentTitle = useMemo(() =>
        Math.random() < 0.7 ?
            t('maintenance.title') :
            t('maintenance.alternative_title'),
        [t]
    );

    const [currentLinkCypher, setCurrentLinkCypher] = useState<string>(() =>
        Math.random() < 0.5 ? t('maintenance.cypher.link1') : t('maintenance.cypher.link2')
    );

    const switchLink = useCallback(() => {
        setCurrentLinkCypher(
            Math.random() < 0.5 ? t('maintenance.cypher.link1') : t('maintenance.cypher.link2')
        );
    }, [t]);

    const addRandomText = useCallback(() => {
        setRandomTexts(prev => {
            if (prev.length >= 5) return prev;

            const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
            const id = Date.now() + Math.random();
            const x = Math.random() * (Math.max(window.innerWidth - 300, 100));
            const y = Math.random() * (Math.max(window.innerHeight - 100, 100)) + 50;

            const newText = { id, text: randomPhrase, x, y };
            return [...prev, newText];
        });
    }, [phrases]);

    const removeExpiredTexts = useCallback(() => {
        setRandomTexts(prev => prev.slice(-1));
    }, []);

    useEffect(() => {
        const interval = setInterval(switchLink, 5000 + Math.random() * 2000);
        return () => clearInterval(interval);
    }, [switchLink]);

    useEffect(() => {
        const showInterval = setInterval(addRandomText, 8000);
        const cleanupInterval = setInterval(removeExpiredTexts, 3000);

        return () => {
            clearInterval(showInterval);
            clearInterval(cleanupInterval);
        };
    }, [addRandomText, removeExpiredTexts]);

    const delayedFadeTransition = useMemo(() => ({
        duration: 0.8,
        ease: "easeOut" as const,
        delay: 2.2
    }), []);

    const titleTransition = useMemo(() => ({
        duration: 1,
        ease: "easeOut" as const,
        delay: 1
    }), []);

    const scaleTransition = useMemo(() => ({
        duration: 1.5,
        ease: "easeOut" as const
    }), []);

    const glowTransition = useMemo(() => ({
        duration: 2,
        ease: "easeOut" as const
    }), []);

    const linkTransition = useMemo(() => ({
        duration: 1,
        ease: "easeOut" as const,
        delay: 2
    }), []); return (
        <section className='ici bg-[var(--background)] overflow-hidden w-full h-screen relative' style={{ willChange: 'auto', backfaceVisibility: 'hidden' }}>
            <div className='fixed inset-0 pointer-events-none z-50' style={{ willChange: 'contents' }}>
                {randomTexts.map((randomText) => (
                    <RandomTextItem key={randomText.id} randomText={randomText} />
                ))}
            </div>

            <section className='relative flex flex-col items-center justify-center min-h-screen gap-6 overflow-hidden'>
                <motion.div className='deco__1' initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={delayedFadeTransition} style={{ willChange: 'opacity' }}>
                    <GlitchText text='PROTOCOL' primaryFont='Grotesk' glitchFont='Vex' glitchMode='font' glitchProbability={0.01} />
                </motion.div>

                <motion.div className='deco__2' initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={delayedFadeTransition} style={{ willChange: 'opacity' }}>
                    <GlitchText text='27' glitchProbability={1} langage='vex' size={"3rem"} />
                </motion.div>

                <div className='absolute flex flex-col items-center justify-center top-0 left-0 w-full h-full z-2' style={{ transform: 'translate3d(0,0,0)' }}>
                    <motion.div className='flex items-center justify-center relative w-50 md:w-200' initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={titleTransition} style={{ willChange: 'opacity' }}>
                        <h1 className='leading-8 md:leading-26 custom-font font-semibold text-4xl text-center md:text-7xl lg:text-9xl uppercase text-transparent z-10' data-text={currentTitle} style={{ willChange: 'auto', transform: 'translate3d(0,0,0)' }}>
                            {currentTitle}
                        </h1>
                    </motion.div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={delayedFadeTransition} style={{ willChange: 'opacity' }}>
                        <GlitchText text='AN0M ARCHIVES' className='text-[#3D3D3D] text-2xl font-ibm' glitchProbability={0.005} />
                    </motion.div>
                </div>

                <motion.div className='smooth__glow absolute pointer-events-none' initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={glowTransition} style={{ willChange: 'transform, opacity', transform: 'translate3d(0,0,0)' }} />

                <motion.div className='smooth__glow__2 absolute pointer-events-none' initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ ...glowTransition, delay: 0.3 }} style={{ willChange: 'transform, opacity', transform: 'translate3d(0,0,0)' }} />

                <motion.div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 sm:scale-115' initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={scaleTransition} style={{ willChange: 'transform, opacity' }}>
                    <Image src="/img/vector.webp" alt="Cat with gradient" width={1200} height={1300} quality={70} priority className='scale-210 brightness-110 relative -top-2 sm:scale-100 sm:brightness-102 sm:top-0' style={{ willChange: 'auto', transform: 'translate3d(0,0,0)' }} />
                </motion.div>

                <motion.div className='absolute bottom-25 sm:bottom-15 text-center text-sm text-gray-500 px-4 flex z-10' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={linkTransition} style={{ willChange: 'transform, opacity', transform: 'translate3d(0,0,0)' }}>
                    <Link href="/cipher" rel='noopener noreferrer' className='flex items-center gap-1 hover__underline'>
                        <GlitchText primaryFont='IBM' glitchFont='Vex' glitchMode='font' text={currentLinkCypher} glitchProbability={0.002} />
                        <ArrowUpRight size={16} />
                    </Link>
                </motion.div>

                <div className='code__1' style={{ willChange: 'auto', opacity: 1 }}>
                    <GlitchText text='12' glitchProbability={0.01} langage='vex' size={"1.8em"} />
                </div>

                <div className='code__3' style={{ willChange: 'auto', opacity: 1 }}>
                    <GlitchText text='2025' glitchProbability={0.01} langage='vex' size={"1.8em"} />
                </div>
            </section>
        </section>
    )
}