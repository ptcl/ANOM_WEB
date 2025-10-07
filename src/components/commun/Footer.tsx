"use client";

import Link from "next/link";
import ComponentSvg from "../svg/ComponentSvg";
import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import SwitchLang from "./SwitchLang";
import { useState, useRef, useEffect } from "react";

export default function Footer() {
    const t = useTranslations();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    return (
        <footer className="h-screen flex flex-col p-4 sm:p-6 md:p-8 justify-end bg-[var(--white-1)]">
            <section className="relative bottom-20 sm:bottom-32 md:bottom-40 px-4 sm:px-8 md:px-18 w-full flex flex-col md:flex-row justify-center md:justify-around items-start md:items-start gap-8 md:gap-0 z-10">
                <section className="flex flex-col items-start md:items-start gap-2 w-full md:w-auto max-w-xs md:max-w-none">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                            <ComponentSvg variant="catCompact" height={48} width={48} color="var(--black-1)" className="md:h-14 md:w-14" />
                            <h1 className="font-ibm text-[var(--black-1)] text-2xl sm:text-3xl md:text-4xl font-bold">{t('anom.title')}</h1>
                        </div>
                    </Link>
                    <p className="Grotesk text-[var(--light-dark-3)] text-xs sm:text-sm font-medium max-w-[300px] sm:max-w-[350px] md:max-w-[370px] text-left md:text-left">{t('anom.description')}</p>
                    <div className="flex items-center gap-4 mt-2">
                        <Link href="https://discord.gg/pTnqbQtgKn" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
                            <ComponentSvg variant="discord" height={24} width={24} color="var(--light-dark-3)" className="sm:h-7 sm:w-7" />
                        </Link>
                        <Link href="https://x.com/AnomArchives" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
                            <ComponentSvg variant="X" height={24} width={24} color="var(--light-dark-3)" className="sm:h-7 sm:w-7" />
                        </Link>
                    </div>
                    <p className="Grotesk text-[var(--light-dark-3)] text-xs sm:text-sm font-medium text-left md:text-left">{t('anom.copyright')}</p>
                    <p className="Grotesk text-[var(--light-dark-3)] text-xs sm:text-sm font-normal text-left md:text-left">{t('anom.tag.1')}</p>
                    <div className="mt-2">
                        <SwitchLang />
                    </div>
                </section>
                <section className="flex flex-col items-start md:items-start gap-2 w-full md:w-auto">
                    <Link href="/resources" className="flex hover__underline__2_1">
                        <h1 className="Grotesk text-[var(--black-1)] text-lg sm:text-xl md:text-2xl font-bold">{t('resources.title')}</h1>
                        <ArrowUpRight size={14} strokeWidth={2.5} className="sm:w-4 sm:h-4" />
                    </Link>
                    <Link href="/" className="w-full md:w-auto">
                        <p className="Grotesk text-[var(--light-dark-3)] text-xs sm:text-sm font-medium hover__underline__2 text-left md:text-left">{t('commun.links.home')}</p>
                    </Link>
                    <Link href="/resources/faq" className="w-full md:w-auto">
                        <p className="Grotesk text-[var(--light-dark-3)] text-xs sm:text-sm font-medium hover__underline__2 text-left md:text-left">{t('commun.links.faq')}</p>
                    </Link>
                    <Link href="/resources/news" className="w-full md:w-auto">
                        <p className="Grotesk text-[var(--light-dark-3)] text-xs sm:text-sm font-medium hover__underline__2 text-left md:text-left">{t('commun.links.news')}</p>
                    </Link>
                </section>
                <section className="flex flex-col items-start md:items-start gap-2 w-full md:w-auto">
                    <div className="flex items-center gap-2">
                        <h1 className="Grotesk text-[var(--black-1)] text-lg sm:text-xl md:text-2xl font-bold">{t('community.title')}</h1>
                    </div>
                    <Link href="https://x.com/AnomArchives" target="_blank" rel="noopener noreferrer" className="w-full md:w-auto">
                        <p className="Grotesk text-[var(--light-dark-3)] text-xs sm:text-sm font-medium hover__underline__2 text-left md:text-left">{t('community.twitter.title')}</p>
                    </Link>
                    <Link href="https://discord.gg/pTnqbQtgKn" target="_blank" rel="noopener noreferrer" className="w-full md:w-auto">
                        <p className="Grotesk text-[var(--light-dark-3)] text-xs sm:text-sm font-medium hover__underline__2 text-left md:text-left">{t('community.discord.title')}</p>
                    </Link>
                </section>
                <section className="flex flex-col items-start md:items-start gap-2 w-full md:w-auto">
                    <div className="flex items-center gap-2">
                        <Link href="/legal" className="flex hover__underline__2_1">
                            <h1 className="Grotesk text-[var(--black-1)] text-lg sm:text-xl md:text-2xl font-bold">{t('legal.title')}</h1>
                            <ArrowUpRight size={14} strokeWidth={2.5} className="sm:w-4 sm:h-4" />
                        </Link>
                    </div>
                    <Link href={"/legal/legal-notice"} className="w-full md:w-auto">
                        <p className="Grotesk text-[var(--light-dark-3)] text-xs sm:text-sm font-medium hover__underline__2 text-left md:text-left">{t('legal.cards.legalNotice.title')}</p>
                    </Link>
                    <Link href={"/legal/privacy"} className="w-full md:w-auto">
                        <p className="Grotesk text-[var(--light-dark-3)] text-xs sm:text-sm font-medium hover__underline__2 text-left md:text-left">{t('legal.cards.privacy.title')}</p>
                    </Link>
                    <Link href={"/legal/terms"} className="w-full md:w-auto">
                        <p className="Grotesk text-[var(--light-dark-3)] text-xs sm:text-sm font-medium hover__underline__2 text-left md:text-left">{t('legal.cards.terms.title')}</p>
                    </Link>
                </section>
            </section>
        </footer>
    )
}