'use client'

import Container from '@/components/commun/container'
import HistoryTimeline from '@/components/protocol/history/HistoryTimeline'
import TimelineStats from '@/components/protocol/timeline/TimelineStats'
import ReconstructionWidget from '@/components/protocol/timeline/ReconstructionWidget'
import { useTranslations } from 'next-intl'
import React from 'react'
import { Card } from '@/components/ui/card'

export default function AgentTimelinesPage() {
    const t = useTranslations()

    return (
        <Container className='rounded-md gap-4' height='full' width='full' flexDirection='col' items='start' justify='start'>
            <div className='flex flex-col gap-4 w-full h-full'>

                {/* 1. TOP STATS - Fixed height for consistency */}
                <section className="w-full shrink-0">
                    <TimelineStats />
                </section>

                {/* 2. MAIN CONTENT GRID - Fills remaining height */}
                <section className='grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-0'>

                    {/* LEFT PANEL: TIMELINE LIST (8 cols) */}
                    <div className='lg:col-span-8 h-full min-h-[400px] flex flex-col'>
                        <HistoryTimeline className="flex-1 border-[var(--black-500)]" />
                    </div>

                    {/* RIGHT PANEL: WIDGETS (4 cols) */}
                    <div className='lg:col-span-4 h-full flex flex-col gap-4'>

                        {/* Upper Widget: Reconstruction Puzzle */}
                        <div className="flex-1 min-h-[300px]">
                            <ReconstructionWidget />
                        </div>

                        {/* Lower Widget: Placeholder/Future Content */}
                        <div className="flex-1 min-h-[200px] bg-[var(--black-600)] border-2 border-[var(--black-500)] rounded-md flex items-center justify-center relative overflow-hidden group">
                            {/* Subtle background branding */}
                            <div className="absolute inset-0 bg-[url('/img/grid.png')] opacity-5" />
                            <div className="opacity-10 transition-opacity group-hover:opacity-20 transform group-hover:scale-105 duration-500">
                                <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor" className="text-[var(--black-200)]">
                                    <path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z" />
                                </svg>
                            </div>
                        </div>

                    </div>

                </section>

            </div>
        </Container>
    )
}
