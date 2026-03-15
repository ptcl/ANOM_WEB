'use client'

import React, { useEffect, useState } from 'react'
import { useAgentStore } from '@/store/agentStore'
import { useAgent } from '@/hooks/use-agent'
import { useTranslations } from 'next-intl'
import Container from '@/components/commun/container'
import { Skeleton } from '@/components/ui/skeleton'
import { Check, Loader2 } from 'lucide-react'

export default function Theme() {
    const t = useTranslations()
    const { agentTheme, fetchAgentTheme } = useAgentStore()
    const { agent, updateAgent } = useAgent()
    const [isSaving, setIsSaving] = useState(false)
    const [savingThemeId, setSavingThemeId] = useState<string | null>(null)

    const activeThemeObj = agent?.protocol?.settings?.activeTheme as unknown as { themeId?: string } | undefined
    const activeThemeId = activeThemeObj?.themeId

    useEffect(() => {
        fetchAgentTheme()
    }, [fetchAgentTheme])

    const handleSelectTheme = async (themeId: string) => {
        if (themeId === activeThemeId || isSaving) {
            return
        }

        setIsSaving(true)
        setSavingThemeId(themeId)

        const result = await updateAgent({
            protocol: {
                settings: {
                    activeTheme: themeId
                }
            }
        })
        setIsSaving(false)
        setSavingThemeId(null)
    }

    return (
        <Container className='gap-6' height='fit' flexDirection='col' items='start' justify='start'>
            <h2 className='text-lg font-medium text-[var(--theme-primary)]'>
                {t('theme.title')}
            </h2>
            <p className='text-sm text-[var(--black-400)]'>
                {t('theme.description')}
            </p>

            {!agentTheme ? (
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full'>
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className='h-32 rounded' />
                    ))}
                </div>
            ) : (
                <div className='flex flex-wrap gap-4 w-full'>
                    {agentTheme.map((theme) => {
                        const isActive = activeThemeId === theme.themeId
                        const isLoading = savingThemeId === theme.themeId

                        return (
                            <div key={theme.themeId} onClick={() => handleSelectTheme(theme.themeId)} className={`relative flex h-[240px] w-[382px] flex-col gap-2 p-3 rounded cursor-pointer transition-all duration-200 ${isActive ? 'border-2 border-[var(--theme-accent)] bg-[var(--black-900)]' : 'border-2 border-transparent bg-[var(--black-900)] hover:border-[var(--theme-accent)] hover:bg-[var(--black-900)]'} ${isSaving && !isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                <div className='flex gap-1 h-full rounded overflow-hidden'>
                                    <div className='flex-1 rounded-l' style={{ backgroundColor: theme.primary }} title='Primary' />
                                    <div className='flex-1' style={{ backgroundColor: theme.secondary }} title='Secondary' />
                                    <div className='flex-1 rounded-r' style={{ backgroundColor: theme.accent }} title='Accent' />
                                </div>
                                <div className='flex flex-col items-start justify-between gap-2'>
                                    <div className='flex items-center justify-between w-full'>
                                        <span className={`text-xl font-medium ${isActive ? 'text-[var(--theme-primary)]' : ''}`}>{t(`${theme.name}`)}</span>
                                        {isLoading ? (
                                            <Loader2 className='w-4 h-4 animate-spin text-[var(--theme-accent)]' />
                                        ) : isActive ? (
                                            <Check className='w-4 h-4 text-[var(--theme-accent)]' />
                                        ) : null}
                                    </div>
                                    <p className='text-sm text-[var(--black-400)] line-clamp-2'>
                                        {t(`${theme.description}`)}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </Container>
    )
}
