'use client'

import { useTranslations } from 'next-intl'
import { LucideIcon } from 'lucide-react'
import SwitchLang from '@/components/commun/SwitchLang'

interface SettingLanguageRowProps {
    icon: LucideIcon
    titleKey: string
    descriptionKey: string
    onLanguageChange: (locale: string) => void
}

export default function SettingLanguageRow({
    icon: Icon,
    titleKey,
    descriptionKey,
    onLanguageChange
}: SettingLanguageRowProps) {
    const t = useTranslations()

    return (
        <div className='flex w-full justify-between items-center gap-3 p-2'>
            <div className='flex items-center gap-4'>
                <Icon />
                <div className='flex flex-col gap-1 text-left'>
                    <span className='text-sm font-medium'>{t(titleKey)}</span>
                    <p className='text-sm'>{t(descriptionKey)}</p>
                </div>
            </div>
            <div className='flex items-center gap-2'>
                <SwitchLang onLanguageChange={onLanguageChange} />
            </div>
        </div>
    )
}
