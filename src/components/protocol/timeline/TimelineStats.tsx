'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useTimelineStore, selectTimelineStats } from '@/store/timelineStore'
import { useTranslations } from 'next-intl'
import React from 'react'

export default function TimelineStats() {
    const t = useTranslations()
    const stats = useTimelineStore(selectTimelineStats)

    return (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full h-full">
            {/* Active Enigmas */}
            <Card className="w-full rounded bg-[var(--black-6)] border-none">
                <CardHeader className='text-start pb-2'>
                    <CardTitle className='text-base md:text-xl uppercase text-[var(--white-1)] tracking-wider'>
                        {t('protocol.timeline.stats.activeEnigmas')}
                    </CardTitle>
                    <CardDescription className='hidden xl:block md:text-sm text-[var(--black-200)]'>
                        {t('protocol.timeline.stats.activeEnigmasDesc')}
                    </CardDescription>
                </CardHeader>
                <CardContent className='text-start font-satoshi text-2xl font-bold text-[var(--white-1)]'>
                    {stats.total}
                </CardContent>
            </Card>

            {/* In Progress */}
            <Card className="w-full rounded bg-[var(--black-6)] border-none">
                <CardHeader className='text-start pb-2'>
                    <CardTitle className='text-base md:text-xl uppercase text-[var(--white-1)] tracking-wider'>
                        {t('protocol.timeline.stats.inProgress')}
                    </CardTitle>
                    <CardDescription className='hidden xl:block md:text-sm text-[var(--black-200)]'>
                        {t('protocol.timeline.stats.inProgressDesc')}
                    </CardDescription>
                </CardHeader>
                <CardContent className='text-start font-satoshi text-2xl font-bold text-[var(--white-1)]'>
                    {stats.pending} <span className="text-lg font-normal text-[var(--black-200)] ml-2">{t('protocol.timeline.stats.challenges')}</span>
                </CardContent>
            </Card>

            {/* Upcoming - Placeholder or derived if/when API supports it */}
            <Card className="w-full rounded bg-[var(--black-6)] border-none">
                <CardHeader className='text-start pb-2'>
                    <CardTitle className='text-base md:text-xl uppercase text-[var(--white-1)] tracking-wider'>
                        {t('protocol.timeline.stats.upcoming')}
                    </CardTitle>
                    <CardDescription className='hidden xl:block md:text-sm text-[var(--black-200)]'>
                        {t('protocol.timeline.stats.upcomingDesc')}
                    </CardDescription>
                </CardHeader>
                <CardContent className='text-start font-satoshi text-2xl font-bold text-[var(--white-1)]'>
                    0
                </CardContent>
            </Card>
        </section>
    )
}
