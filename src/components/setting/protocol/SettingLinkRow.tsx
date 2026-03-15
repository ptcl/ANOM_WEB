'use client'

import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { LucideIcon, ChevronRight } from 'lucide-react'

interface SettingLinkRowProps {
    icon: LucideIcon
    titleKey: string
    descriptionKey: string
    href: string
}

export default function SettingLinkRow({
    icon: Icon,
    titleKey,
    descriptionKey,
    href
}: SettingLinkRowProps) {
    const t = useTranslations()

    return (
        <Link
            href={href}
            className='flex w-full justify-between items-center gap-3 cursor-pointer hover:bg-[var(--black-800)] transition-colors rounded p-2'
        >
            <div className='flex items-center gap-4'>
                <Icon />
                <div className='flex flex-col gap-1 text-left'>
                    <span className='text-sm font-medium'>{t(titleKey)}</span>
                    <p className='text-sm'>{t(descriptionKey)}</p>
                </div>
            </div>
            <ChevronRight />
        </Link>
    )
}
