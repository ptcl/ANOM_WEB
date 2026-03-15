'use client'

import React from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import { routing } from '@/i18n/routing'
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from 'lucide-react'

interface SwitchLangProps {
    variant?: 'dropdown' | 'buttons'
    side?: 'top' | 'bottom' | 'left' | 'right'
    align?: 'start' | 'center' | 'end'
    className?: string
    onLanguageChange?: (newLocale: string) => void
}

export default function SwitchLang({ variant = 'dropdown', side = 'bottom', align = 'end', className = '', onLanguageChange }: SwitchLangProps) {
    const locale = useLocale()
    const pathname = usePathname()
    const router = useRouter()
    const t = useTranslations('commun')

    const languages = routing.locales.map(code => ({
        code,
        name: t(`languages.${code}`)
    }))
    const currentLanguage = languages.find(lang => lang.code === locale)

    const handleLanguageChange = (newLocale: string) => {
        router.push(pathname, { locale: newLocale })
        onLanguageChange?.(newLocale)
    }

    if (variant === 'buttons') {
        return (
            <div className={`flex flex-wrap gap-2 ${className}`}>
                {languages.map((language) => (
                    <Button
                        key={language.code}
                        onClick={() => handleLanguageChange(language.code)}
                        variant={locale === language.code ? 'default' : 'outline'}
                        size="sm"
                        className={`text-xs rounded ${locale === language.code ? 'bg-[var(--color-accent1)] text-[var(--foreground)] border-[var(--color-accent1)]' : 'bg-[var(--background)] text-[var(--foreground)] border-[var(--black-900)] hover:bg-[var(--black-950)]'}`}
                    >
                        {language.name}
                    </Button>
                ))}
            </div>
        )
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    className={`gap-2 text-[var(--foreground)] bg-[var(--background)] hover:bg-[var(--black-950)] border border-[var(--black-900)] cursor-pointer transition-colors ${className}`}
                >
                    <span>{currentLanguage?.name || locale.toUpperCase()}</span>
                    <ChevronDown className="w-4 h-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side={side} align={align} className="bg-[var(--black-950)] border-[var(--black-900)]">
                {languages.map((language) => (
                    <DropdownMenuCheckboxItem
                        key={language.code}
                        checked={locale === language.code}
                        onCheckedChange={() => handleLanguageChange(language.code)}
                        className="cursor-pointer"
                    >
                        {language.name}
                    </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
