'use client'
import React, { useEffect, useState } from 'react'
import ComponentSvg from '../svg/ComponentSvg';
import '../../css/navbar.css'
import { Link, usePathname } from '@/i18n/navigation';
import { useNavbarSearchEvents, SearchBarData } from '@/lib/navbar-search-events';
import SearchBar from '@/components/ui/search-bar';
import { useTranslations } from 'next-intl';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
    const t = useTranslations();
    const [scrolled, setScrolled] = React.useState(false);
    const [mounted, setMounted] = React.useState(false);
    const [searchBarData, setSearchBarData] = useState<SearchBarData | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [justOpened, setJustOpened] = useState(false);
    const pathname = usePathname();

    useNavbarSearchEvents(setSearchBarData);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    React.useEffect(() => {
        if (!pathname.includes('/faq') && !pathname.includes('/news')) {
            setSearchBarData(null);
        }
    }, [pathname]);

    const closeMobileMenu = () => {
        setIsClosing(true);
        setTimeout(() => {
            setMobileMenuOpen(false);
            setIsClosing(false);
        }, 200);
    };

    React.useEffect(() => {
        if (mobileMenuOpen) {
            closeMobileMenu();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    React.useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [mobileMenuOpen]);

    const shouldUseClassicGradient = scrolled || (mounted && ['/resources/'].includes(pathname));
    return (
        <nav className={`fixed z-50 top-0 left-0 right-0 mx-auto transition-all duration-500 ease-in-out ${scrolled || searchBarData ? 'mt-2 sm:mt-3 md:mt-4 w-[90%] sm:w-[80%] md:w-[65%] max-w-5xl rounded-sm bg-black/20 backdrop-blur-xl border border-white/20 shadow-2xl shadow-black/10' : 'mt-0 w-full rounded-none bg-transparent border-transparent shadow-none'}`} style={{ left: '0', right: '0', transform: scrolled || searchBarData ? 'translateY(0)' : 'translateY(0)', backdropFilter: scrolled || searchBarData ? 'blur(20px) saturate(180%)' : 'none' }}>
            <div className={`w-full transition-all duration-500 ease-in-out ${scrolled || searchBarData ? 'px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3' : 'px-4 sm:px-8 md:px-15 py-3 sm:py-3.5 md:py-4'}`}>
                <div className=' flex items-center justify-between gap-2 sm:gap-3 md:gap-4 w-full transition-all duration-500 ease-in-out'>
                    <Link href={"/"} className='flex items-center gap-1.5 sm:gap-2 flex-shrink-0'>
                        <ComponentSvg variant="catCompact" height={24} width={24} className="sm:h-7 sm:w-7 md:h-7 md:w-7" />
                        <h1 className={`Grotesk font-bold transition-all duration-300 ease-out ${scrolled ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl'} ${shouldUseClassicGradient ? 'gradient__text__classic' : 'gradient__text__right'}`}>
                            {t('commun.links.anom')}
                        </h1>
                    </Link>

                    <div className='hidden md:block flex-1 max-w-xs sm:max-w-sm md:max-w-md mx-2 sm:mx-3 md:mx-4'>
                        <div className={`transition-all duration-500 ease-out ${searchBarData ? 'opacity-100 transform scale-100 translate-y-0' : 'opacity-0 transform scale-95 -translate-y-2 pointer-events-none'}`}>
                            {searchBarData && (
                                <SearchBar placeholder={searchBarData.placeholder} value={searchBarData.searchQuery} onChange={searchBarData.onSearchChange} className="w-full text-sm sm:text-base" />
                            )}
                        </div>
                    </div>

                    <div className='hidden md:flex items-center gap-6 font-normal cursor-pointer flex-shrink-0'>
                        <Link href="/resources/news" className={`Grotesk text-base ${shouldUseClassicGradient ? 'gradient__text__classic' : 'gradient__text__left'} hover__underline__neutre`}>
                            {t('commun.links.news')}
                        </Link>
                        <Link href="/" className={`Grotesk text-base hover__underline__3`}>
                            {t('commun.links.home')}
                        </Link>
                    </div>

                    <button onClick={() => {
                        if (mobileMenuOpen) {
                            closeMobileMenu();
                        } else {
                            setMobileMenuOpen(true);
                            setJustOpened(true);
                            setTimeout(() => setJustOpened(false), 300);
                        }
                    }} className="md:hidden flex items-center justify-center p-2 rounded-md transition-colors duration-200 hover:bg-white/10" aria-label="Toggle mobile menu">
                        {mobileMenuOpen ? (
                            <X size={24} className="text-white" />
                        ) : (
                            <Menu size={24} className="text-white" />
                        )}
                    </button>
                </div>
                <div className={`md:hidden transition-all duration-500 ease-out ${searchBarData ? 'opacity-100 transform scale-100 translate-y-0 mt-3' : 'opacity-0 transform scale-95 -translate-y-2 pointer-events-none mt-0 max-h-0 overflow-hidden'}`}>
                    {searchBarData && (
                        <SearchBar placeholder={searchBarData.placeholder} value={searchBarData.searchQuery} onChange={searchBarData.onSearchChange} className="w-full text-sm" />
                    )}
                </div>
            </div>

            {mobileMenuOpen && (
                <div className={`md:hidden fixed inset-0 top-0 w-screen h-screen z-40 bg-[var(--background)] transition-opacity duration-200 ${isClosing ? 'opacity-0' : justOpened ? 'opacity-0' : 'opacity-100'}`}>
                    <div className="flex flex-col items-start justify-start h-full pt-20 px-8">
                        <button onClick={closeMobileMenu} className="absolute top-6 right-6 flex items-center justify-center p-2 rounded-md transition-colors duration-200 hover:bg-white/10" aria-label="Close mobile menu">
                            <X size={24} className="text-white" />
                        </button>

                        <div className={`flex items-center gap-2 mb-12 transition-all duration-500 ${justOpened ? 'opacity-0 translate-x-[-30px]' : 'opacity-100 translate-x-0'}`}>
                            <ComponentSvg variant="catCompact" height={32} width={32} />
                            <h1 className="font-ibm text-2xl font-bold gradient__text__classic">
                                {t('commun.links.anom')}
                            </h1>
                        </div>
                        <div className="flex flex-col items-start gap-8">
                            <Link href="/" className={`Grotesk text-3xl font-bold gradient__text__classic hover:scale-105 transition-all duration-500 ${justOpened ? 'opacity-0 translate-x-[-30px]' : 'opacity-100 translate-x-0'}`} style={{ transitionDelay: '100ms' }} onClick={closeMobileMenu}>
                                {t('commun.links.home')}
                            </Link>
                            <Link href="/resources/news" className={`Grotesk text-3xl font-bold gradient__text__classic hover:scale-105 transition-all duration-500 ${justOpened ? 'opacity-0 translate-x-[-30px]' : 'opacity-100 translate-x-0'}`} style={{ transitionDelay: '200ms' }} onClick={closeMobileMenu}>
                                {t('commun.links.news')}
                            </Link>
                            <Link href="/resources/faq" className={`Grotesk text-3xl font-bold gradient__text__classic hover:scale-105 transition-all duration-500 ${justOpened ? 'opacity-0 translate-x-[-30px]' : 'opacity-100 translate-x-0'}`} style={{ transitionDelay: '300ms' }} onClick={closeMobileMenu}>
                                {t('commun.links.faq')}
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}
