'use client'

import React, { useMemo, useState, useEffect, useRef } from 'react'
import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import { routing } from '@/i18n/routing'

const getAvailableLanguages = () => {
    const languageNames: Record<string, string> = {
        'en': 'English',
        'fr': 'Français',
        'it': 'Italiano',
        'es': 'Español',
        'de': 'Deutsch',
        'pt': 'Português',
        'ru': 'Русский',
        'ja': '日本語',
        'ko': '한국어',
        'zh': '中文',
    }

    return routing.locales.map(code => ({
        code,
        name: languageNames[code] || code.toUpperCase()
    }))
}

interface SwitchLangProps {
    variant?: 'dropdown' | 'buttons'
    side?: 'top' | 'bottom' | 'left' | 'right'
    align?: 'start' | 'center' | 'end'
    className?: string
}

export default function SwitchLang({ variant = 'dropdown', side = 'bottom', align = 'end', className = '' }: SwitchLangProps) {
    const locale = useLocale()
    const pathname = usePathname()
    const router = useRouter()
    const dropdownRef = useRef<HTMLDivElement>(null)

    const languages = useMemo(() => getAvailableLanguages(), [])
    const currentLanguage = languages.find(lang => lang.code === locale)

    const [isOpen, setIsOpen] = useState(false)

    const handleLanguageChange = (newLocale: string) => {
        router.push(pathname, { locale: newLocale })
        setIsOpen(false)
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
            return () => document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen])

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Escape') {
            setIsOpen(false)
        } else if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            setIsOpen(!isOpen)
        }
    }

    const getDropdownClasses = () => {
        const baseClasses = 'absolute z-50 min-w-[8rem] bg-[var(--window)] border border-[var(--window-border)] rounded shadow-lg'

        let positionClasses = ''

        switch (side) {
            case 'top':
                positionClasses = 'bottom-full mb-2'
                break
            case 'bottom':
                positionClasses = 'top-full mt-2'
                break
            case 'left':
                positionClasses = 'right-full mr-2 top-0'
                break
            case 'right':
                positionClasses = 'left-full ml-2 top-0'
                break
        }

        switch (align) {
            case 'start':
                positionClasses += side === 'top' || side === 'bottom' ? ' left-0' : ' top-0'
                break
            case 'center':
                positionClasses += side === 'top' || side === 'bottom' ? ' left-1/2 transform -translate-x-1/2' : ' top-1/2 transform -translate-y-1/2'
                break
            case 'end':
                positionClasses += side === 'top' || side === 'bottom' ? ' right-0' : ' bottom-0'
                break
        }

        return `${baseClasses} ${positionClasses}`
    }

    if (variant === 'buttons') {
        return (
            <div className={`flex flex-wrap gap-2 ${className}`}>
                {languages.map((language) => (
                    <Button key={language.code} onClick={() => handleLanguageChange(language.code)} variant={locale === language.code ? 'default' : 'outline'} size="sm" className={`text-xs rounded ${locale === language.code ? 'bg-[var(--color-accent1)] text-[var(--foreground)] border-[var(--color-accent1)]' : 'bg-[var(--background)] text-[var(--foreground)] border-[var(--window-border)] hover:bg-[var(--window-inner)]'}`}>
                        {language.name}
                    </Button>
                ))}
            </div>
        )
    }

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <Button className="relative gap-2 text-[var(--foreground)] bg-[var(--background)] hover:bg-[var(--window-inner)] border border-[var(--window-border)] cursor-pointer transition-colors" onClick={() => setIsOpen(!isOpen)} onKeyDown={handleKeyDown} aria-haspopup="listbox" aria-expanded={isOpen} aria-label={`Changer la langue, actuellement ${currentLanguage?.name || locale}`}>
                <span>{currentLanguage?.name || locale.toUpperCase()}</span>
                <svg className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </Button>

            {isOpen && (
                <div className={getDropdownClasses()}>
                    <div className="py-1" role="listbox" aria-label="Sélection de langue">
                        {languages.map((language) => (
                            <button key={language.code} onClick={() => handleLanguageChange(language.code)} className={`w-full px-4 py-2 text-left text-sm text-[var(--foreground)] hover:bg-[var(--color-accent1)] cursor-pointer transition-colors focus:outline-none focus:bg-[var(--color-accent1)] ${locale === language.code ? 'bg-[var(--window-inner)] font-medium' : ''}`} role="option" aria-selected={locale === language.code} tabIndex={0}>
                                {language.name}
                                {locale === language.code && (
                                    <span className="ml-2 text-[var(--color-accent1)]" aria-hidden="true">✓</span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}