'use client'

import { Switch } from '@/components/ui/switch'
import { useTranslations } from 'next-intl'
import { LucideIcon } from 'lucide-react'

interface SettingSwitchRowProps {
    icon: LucideIcon
    titleKey: string
    descriptionKey: string
    checked: boolean
    onCheckedChange: (checked: boolean) => void
    disabled?: boolean
    mounted?: boolean
}

export default function SettingSwitchRow({
    icon: Icon,
    titleKey,
    descriptionKey,
    checked,
    onCheckedChange,
    disabled = false,
    mounted = true
}: SettingSwitchRowProps) {
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
                {mounted && (
                    <span>{checked ? t('commun.text.enabled') : t('commun.text.disabled')}</span>
                )}
                <Switch
                    className='cursor-pointer'
                    checked={checked}
                    onCheckedChange={onCheckedChange}
                    disabled={disabled || !mounted}
                />
            </div>
        </div>
    )
}
