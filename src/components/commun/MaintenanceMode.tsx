'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import '../../css/maintenance.css'
import GlitchText from '../effect/GlitchText'
import { useTranslations } from 'next-intl'
import { ArrowUpRight } from 'lucide-react'
import { Link } from '@/i18n/navigation'

type RandomText = { id: number; text: string; x: number; y: number };

export default function MaintenanceMode() {
    const t = useTranslations();
    const [randomTexts, setRandomTexts] = useState<RandomText[]>([]);


    // eslint-disable-next-line react-hooks/exhaustive-deps
    const phrases = [
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
    ];

    const currentTitle = useMemo(() =>
        Math.random() < 0.7 ?
            t('maintenance.title') :
            t('maintenance.alternative_title'),
        [t]
    );

    type LinkCypher = string;
    const [currentLinkCypher, setCurrentLinkCypher] = useState<LinkCypher>(
        Math.random() < 0.5 ? t('maintenance.cypher.link1') : t('maintenance.cypher.link2')
    );

    useEffect(() => {
        const switchLink = () => {
            setCurrentLinkCypher(
                Math.random() < 0.5 ? t('maintenance.cypher.link1') : t('maintenance.cypher.link2')
            );
        };
        const interval = setInterval(switchLink, Math.floor(Math.random() * 3000) + 4000);
        return () => clearInterval(interval);
    }, [t]);


    useEffect(() => {
        const showRandomPhrase = () => {
            const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
            const id = Date.now();
            const x = Math.random() * (window.innerWidth - 300);
            const y = Math.random() * (window.innerHeight - 50) + 50;

            const newText = { id, text: randomPhrase, x, y };
            setRandomTexts(prev => [...prev, newText]);

            setTimeout(() => {
                setRandomTexts(prev => prev.filter(text => text.id !== id));
            }, 3000);
        };

        const interval = setInterval(showRandomPhrase, 8000);
        return () => clearInterval(interval);
    }, [phrases]);

    return (
        <section className='ici bg-[var(--background)] overflow-hidden w-full h-screen relative'>
            {randomTexts.map((randomText) => (
                <div key={randomText.id} className='ici2 fixed pointer-events-none text-sm z-50 text-gray-500' style={{ left: `${randomText.x}px`, top: `${randomText.y}px`, }}>
                    <GlitchText primaryFont='Grotesk' glitchFont='Vex' glitchMode='font' text={randomText.text} />
                </div>
            ))}
            <section className='relative flex flex-col items-center justify-center min-h-screen gap-6 overflow-hidden'>
                <motion.div className='deco__1' initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, ease: "easeOut", delay: 2.2 }}>
                    <GlitchText text='PROTOCOL' primaryFont='Grotesk' glitchFont='Vex' glitchMode='font' glitchProbability={0.01} />
                </motion.div>
                <motion.div className='deco__2' initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, ease: "easeOut", delay: 2.2 }}>
                    <GlitchText text='27' glitchProbability={1} langage='vex' size={"3rem"} />
                </motion.div>
                <div className='absolute flex flex-col items-center justify-center top-0 left-0 w-full h-full z-2'>
                    <motion.div className='flex items-center justify-center relative w-50 md:w-200' initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, ease: "easeOut", delay: 1 }}>
                        <h1 className='leading-8 md:leading-26 custom-font font-semibold text-4xl text-center md:text-7xl lg:text-9xl uppercase text-transparent z-10' data-text={currentTitle}>{currentTitle}</h1>
                    </motion.div>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, ease: "easeOut", delay: 2.2 }}>
                        <GlitchText text='AN0M ARCHIVES' className='text-[#3D3D3D] text-2xl font-ibm' glitchProbability={0.005} />
                    </motion.div>
                </div>
                <motion.div className='smooth__glow absolute pointer-events-none' initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 2, ease: "easeOut" }} />
                <motion.div className='smooth__glow__2 absolute pointer-events-none' initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 2.5, ease: "easeOut", delay: 0.3 }} />
                <motion.div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 sm:scale-115' initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.5, ease: "easeOut" }}>
                    <Image src="/img/vector.webp" alt="Cat with gradient" width={1200} height={1300} quality={100} priority className='scale-210 brightness-110 relative -top-2 sm:scale-100 sm:brightness-102 sm:top-0' />
                </motion.div>
                <motion.div className='absolute bottom-25 sm:bottom-15 text-center text-sm text-gray-500 px-4 flex z-10' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: "easeOut", delay: 2 }}>
                    <Link href="/cipher" rel='noopener noreferrer' className='flex items-center gap-1 hover__underline'>
                        <GlitchText primaryFont='IBM' glitchFont='Vex' glitchMode='font' text={currentLinkCypher} glitchProbability={0.002} />
                        <ArrowUpRight size={16} />
                    </Link>
                </motion.div>
                <motion.div className='code__1'>
                    <GlitchText text='12' glitchProbability={0.01} langage='vex' size={"1.8em"} />
                </motion.div>

                <motion.div className='code__3'>
                    <GlitchText text='2025' glitchProbability={0.01} langage='vex' size={"1.8em"} />
                </motion.div>
            </section>
        </section>
    )
}