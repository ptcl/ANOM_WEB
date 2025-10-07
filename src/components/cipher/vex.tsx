'use client';

import vexOff from '../../../public/svg/vex/vex_off.svg'
import '../../css/cipherLangage.css'
import WindowContainerStatic from '../desktop/WindowContainerStatic';
import vex from '../../../public/svg/vex/vex.svg'
import React, { useState, useEffect } from 'react';
import { Copy, Clock } from 'lucide-react';
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl';

const CHAR_MAP = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ';

const CIPHER_MAP = '◇◈◉◎○●△▲▽▼◁▷⬟⬠⬢⬣⟡⟢⟣⟤⟥⟦⟧⟨⟩⟪⟫◐◑◒◓◔◕◖◗▣⬡⬢⬣⟊⟐⟞⟠⌬ ';

const VEX_DISPLAY_MAP = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghij ';

export default function VexCustomFont() {
    const t = useTranslations();
    const [input, setInput] = useState('');
    const [output, setOutput] = useState({ display: '', cipher: '' });
    const [timeKey, setTimeKey] = useState(1);
    const [mode, setMode] = useState('encrypt');
    const [copied, setCopied] = useState(false);
    const [timeFlux, setTimeFlux] = useState(0);
    const [fontLoaded, setFontLoaded] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeFlux(prev => (prev + 1) % 360);
        }, 100);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const checkFont = () => {
            if (document.fonts && document.fonts.check) {
                const loaded = document.fonts.check('1em Vex') || document.fonts.check('1em VexFont');
                setFontLoaded(loaded);
            } else {
                setFontLoaded(true);
            }
        };

        checkFont();

        const timer = setTimeout(checkFont, 1000);
        return () => clearTimeout(timer);
    }, []);

    const vexEncrypt = (text: string) => {
        const upperText = text.toUpperCase();
        if (!upperText) return { display: '', cipher: '' };

        let displayResult = '';
        let cipherResult = '';

        upperText.split('').forEach((char, position) => {
            const charIndex = CHAR_MAP.indexOf(char);
            if (charIndex === -1) return;

            const temporalShift = timeKey * (position + 1);
            const positionWeight = Math.floor(Math.sin(position * 0.7) * 3) + 3;
            const finalIndex = (charIndex + temporalShift + positionWeight) % CHAR_MAP.length;

            displayResult += VEX_DISPLAY_MAP[finalIndex];
            cipherResult += CIPHER_MAP[finalIndex];
        });

        return { display: displayResult, cipher: cipherResult };
    };

    const vexDecrypt = (encryptedText: string) => {
        if (!encryptedText) return '';

        return encryptedText.split('').map((char, position) => {
            const cipherIndex = CIPHER_MAP.indexOf(char);
            if (cipherIndex === -1) return '';

            const temporalShift = timeKey * (position + 1);
            const positionWeight = Math.floor(Math.sin(position * 0.7) * 3) + 3;

            let originalIndex = cipherIndex - temporalShift - positionWeight;
            while (originalIndex < 0) {
                originalIndex += CHAR_MAP.length;
            }
            originalIndex = originalIndex % CHAR_MAP.length;

            return CHAR_MAP[originalIndex];
        }).join('');
    };

    const handleProcess = () => {
        if (mode === 'encrypt') {
            setOutput(vexEncrypt(input));
        } else {
            const decrypted = vexDecrypt(input);
            setOutput({ display: decrypted, cipher: decrypted });
        }
    };

    const copyResult = () => {
        navigator.clipboard.writeText(output.cipher);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const clearAll = () => {
        setInput('');
        setOutput({ display: '', cipher: '' });
    };

    const generateReferencePad = () => {
        return CHAR_MAP.split('').map((char, index) => ({
            normal: char === ' ' ? '␣' : char,
            vex: VEX_DISPLAY_MAP[index] === ' ' ? '␣' : VEX_DISPLAY_MAP[index],
            cipher: CIPHER_MAP[index] === ' ' ? '␣' : CIPHER_MAP[index]
        }));
    };

    return (
        <section className='bg-[var(--background)] overflow-hidden w-full h-fit relative'>
            <div className="min-h-screen flex flex-col items-center justify-center p-4 relative z-10 overflow-hidden ">
                <motion.div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 sm:scale-130 -z-1' initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.5, ease: "easeOut" }}>
                    <Image src="/img/head_g_vex.webp" alt="Cat with gradient" width={1200} height={1300} quality={100} className='scale-210 brightness-110 relative -top-2 sm:scale-100 sm:brightness-102 sm:top-0' />
                </motion.div>
                <WindowContainerStatic title={'Cypher Vex'} icon={'/img/head_vex.webp'} fitContentHeight enableAnimation animationType={'scaleAndFade'} animationDelay={1.5} >
                    <div className=" max-w-4xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 flex flex-col gap-8">
                                <div className="flex gap-2 p-1 bg-black/20 rounded-lg">
                                    <button onClick={() => setMode('encrypt')} className={`flex-1 py-2 px-4 rounded font-medium transition-all flex items-center justify-center gap-2 ${mode === 'encrypt' ? 'bg-[var(--vex-3)] text-white' : 'text-[var(--vex-2)] hover:bg-[var(--vex-2)]/30'} hover:cursor-pointer`}>
                                        <Image src={vex} alt="Cat with gradient" width={24} height={24} quality={100} className='w-5 h-5 sm:w-6 sm:h-6 brightness-110 transition-all' />
                                        {t('cypher.assimilate')}
                                    </button>

                                    <button onClick={() => setMode('decrypt')} className={`flex-1 py-2 px-4 rounded font-medium transition-all flex items-center justify-center gap-2 ${mode === 'decrypt' ? 'bg-[var(--vex-3)] text-white' : 'text-[var(--vex-2)] hover:bg-[var(--vex-2)]/30'} hover:cursor-pointer`}>
                                        <Image src={vexOff} alt="Cat with gradient" width={24} height={24} quality={100} className='w-5 h-5  transition-all' />
                                        {t('cypher.extract')}
                                    </button>
                                </div>

                                <div className="space-y-5">
                                    <label className="text-[var(--vex-2)] font-medium flex items-center gap-2">
                                        <Clock size={16} />
                                        {t('cypher.temporal')}: <span>{timeKey}</span>
                                    </label>
                                    <input type="range" value={timeKey} onChange={(e) => setTimeKey(parseInt(e.target.value))} className="w-full h-2 bg-black/50 rounded appearance-none cursor-pointer slider" min="1" max="100" />
                                    <div className="flex justify-between text-xs text-[var(--vex-2)]">
                                        <span className='text-base'> {t('cypher.temporalKey.past')}</span>
                                        <span className='text-base'> {t('cypher.temporalKey.present')}</span>
                                        <span className='text-base'> {t('cypher.temporalKey.future')}</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[var(--vex-2)] font-medium">
                                        {mode === 'encrypt' ? `${t('cypher.messageEncrypt')}:` : 'Texte Vex à déchiffrer:'}
                                    </label>
                                    <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={mode === 'encrypt' ? ` ${t('cypher.text.placeholder')}` : ` ${t('cypher.text.placeholderVex')}`} className="rounded w-full h-24 p-4 bg-[var(--vex-2)]/2 border border-[var(--vex-2)]/50 text-white resize-none font-grotesk focus:outline-none transition-colors" />
                                </div>

                                <div className="flex gap-3">
                                    <button onClick={handleProcess} className="flex-1 bg-[var(--vex-3)] text-white py-3 rounded font-medium transition-all transform hover:bg-[var(--vex-4)] hover:cursor-pointer active:scale-95">
                                        {mode === 'encrypt' ? `${t('cypher.button.encode')}` : `${t('cypher.button.uncode')}`}
                                    </button>
                                    <button onClick={clearAll} className="px-6 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded font-medium transition-colors hover:cursor-pointer">
                                        {t('cypher.button.clear')}
                                    </button>
                                </div>

                                {output.display && (
                                    <div className="space-y-2 animate-fadeIn ">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[var(--vex-2)] font-medium">{t('cypher.result')}:</span>
                                            <button onClick={copyResult} className={`flex items-center gap-2 px-3 py-1 rounded transition-all ${copied ? 'bg-green-600 text-white' : 'text-[var(--vex-2)] hover:bg-[var(--vex-2)]/30'}`}>
                                                <Copy size={16} />
                                                <span>{t('commun.copy')}</span>
                                            </button>
                                        </div>
                                        <div className="p-3.5 bg-[var(--vex-2)]/2 border border-[var(--vex-2)]/50 rounded">
                                            <div className={`text-xl break-all text-white leading-relaxed tracking-wider ${mode === 'decrypt' ? 'classic-font' : 'vex-font'}`}>
                                                {output.display}
                                            </div>
                                        </div>

                                        {mode === 'encrypt' && (
                                            <div className="p-3 bg-[var(--black-1)]/50 border border-[var(--black-3)]/30">
                                                <p className="text-[var(--foreground)] text-sm mb-2">{t('cypher.resultCopy')}:</p>
                                                <div className="text-sm text-white p-2 rounded break-all">
                                                    {output.cipher}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="bg-gradient-to-b from-[var(--vex-2)]/20 to-[var(--vex-3)]/20 border border-[var(--vex-2)]/30 p-4 backdrop-blur-sm rounded">
                                <h3 className="text-[var(--vex-2)] font-bold mb-3 flex items-center gap-2">
                                    {t('cypher.table.title')}
                                </h3>
                                <div className="space-y-1 max-h-120 overflow-y-auto">
                                    {generateReferencePad().map((item, index) => (
                                        <div key={index} className="grid grid-cols-3 gap-2 items-center p-2 bg-black/30 text-xs rounded">
                                            <div className="text-center">
                                                <div className="text-gray-400 mb-1">{t('cypher.table.normal')}</div>
                                                <span className="font-mono text-white">{item.normal}</span>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-gray-400 mb-1">{t('cypher.table.vex')}</div>
                                                <span className="text-[var(--vex-1)] text-2xl vex-font">{item.vex}</span>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-gray-400 mb-1">{t('cypher.table.export')}</div>
                                                <span className="">{item.cipher}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 p-3 bg-[var(--vex-2)]/20 border border-[var(--vex-2)]/30 rounded">
                                    <div className="text-[var(--vex-1)] text-xs flex flex-col gap-2">
                                        <div>
                                            <strong>{t('cypher.table.normal')}</strong> : {t('cypher.table.textNormal')} <br />
                                        </div>
                                        <div>
                                            <strong>{t('cypher.table.vex')}</strong> : {t('cypher.table.textVex')}<br />
                                        </div>
                                        <div>
                                            <strong>{t('cypher.table.export')}</strong> : {t('cypher.table.textExport')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </WindowContainerStatic>
                <motion.div className='w-full flex justify-center mt-8 text-base text-white/25 mb-2 z-50 pointer-events-none select-none' initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: "easeOut" }}>
                    {t('cypher.subtitle')}
                </motion.div>

            </div>
        </section>
    );
};