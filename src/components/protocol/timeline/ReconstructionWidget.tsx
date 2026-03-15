'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useTimelineStore } from '@/store/timelineStore'

export default function ReconstructionWidget() {
    const t = useTranslations()
    const timelines = useTimelineStore((state) => state.timelines)

    // Filter timelines that have at least one fragment found
    const activeReconstructions = timelines.filter(tl => tl.fragments && tl.fragments.found > 0)

    // Pagination state
    const [currentIndex, setCurrentIndex] = useState(0)
    const [displayCode, setDisplayCode] = useState<string | null>(null)
    const [loadingCode, setLoadingCode] = useState(false)

    // Current timeline derived from pagination
    const currentTimeline = activeReconstructions.length > 0 ? activeReconstructions[currentIndex] : null

    // Fetch details when current timeline changes
    useEffect(() => {
        let isMounted = true
        if (!currentTimeline) {
            setDisplayCode(null)
            return
        }

        const fetchDetail = async () => {
            setLoadingCode(true)
            try {
                const { api } = await import('@/lib/axios')
                const res = await api.getAgentTimelineDetail(currentTimeline.timelineId)
                if (isMounted && res.data.success && res.data.emblemProgress) {
                    setDisplayCode(res.data.emblemProgress.displayCode)
                }
            } catch (err) {
                console.error("Failed to load timeline detail", err)
            } finally {
                if (isMounted) setLoadingCode(false)
            }
        }
        fetchDetail()

        return () => { isMounted = false }
    }, [currentTimeline?.timelineId])

    const handleNext = () => {
        if (currentIndex < activeReconstructions.length - 1) setCurrentIndex(currentIndex + 1)
    }

    const handlePrev = () => {
        if (currentIndex > 0) setCurrentIndex(currentIndex - 1)
    }

    // Helper to render the code inputs
    const renderCodeGroup = (groupString: string) => {
        return (
            <div className="flex gap-1 sm:gap-1.5">
                {groupString.split('').map((char, index) => {
                    const isRevealed = char !== '?'

                    return (
                        <div
                            key={index}
                            className={`w-8 h-10 sm:w-9 sm:h-11 md:w-10 md:h-12 border rounded flex items-center justify-center text-base sm:text-lg md:text-xl font-mono transition-all duration-300 ${isRevealed
                                ? 'bg-[var(--black-500)] border-[var(--theme-accent)] text-[var(--theme-accent)] shadow-[0_0_10px_var(--theme-accent-600)]'
                                : 'bg-[var(--black-600)] border-[var(--black-500)] text-[var(--black-400)] opacity-50'
                                }`}
                        >
                            {char}
                        </div>
                    )
                })}
            </div>
        )
    }

    // If no active reconstructions, show placeholder
    if (!currentTimeline) {
        return (
            <Card className="w-full h-full bg-[var(--black-600)] border-[var(--black-500)] flex flex-col items-center justify-center relative overflow-hidden min-h-[300px]">
                <div className="absolute inset-0 bg-[url('/img/grid.png')] opacity-5 pointer-events-none" />
                <CardHeader className="z-10 text-center pb-2">
                    <CardTitle className="text-xl font-grotesk tracking-widest text-[var(--white-1)] uppercase">
                        {t('protocol.timeline.reconstruction.title')}
                    </CardTitle>
                    <div className="text-xs text-[var(--black-200)] font-mono mt-1">
                        [ANOM_CORE//REBUILD_SEQUENCE]
                    </div>
                </CardHeader>
                <div className="text-[var(--black-200)] font-mono text-sm text-center px-6 mt-4">
                    [NO_ACTIVE_RECONSTRUCTION_DATA]
                    <br />
                    <span className="text-xs opacity-70">Collect fragments to begin decoding.</span>
                </div>
            </Card>
        )
    }

    // Parsing Logic:
    // Backend sends "A-?-? | ?-B-? | ?-?-C"
    // 1. Split by " | " -> ["A-?-?", "?-B-?", "?-?-C"]
    // 2. Remove dashes from each group -> ["A??", "?B?", "??C"]

    const safeDisplayCode = displayCode || ""
    const rawGroups = safeDisplayCode.includes('|')
        ? safeDisplayCode.split(' | ')
        : safeDisplayCode.split('-').length > 3 ? [safeDisplayCode] : safeDisplayCode.split('-') // Fallback if no pipes

    // Clean groups: Remove dashes to treat them as separators, not chars
    // This fixes the issue where dashes appear as boxes
    const groups = rawGroups.map(g => g.replace(/-/g, ''))

    // Ensure 3 groups for display if possible, or pad with ???
    // If backend returns empty or null, we default to ???
    const part1 = groups[0] || '???'
    const part2 = groups[1] || '???'
    const part3 = groups[2] || '???'

    const totalFragments = currentTimeline.fragments.total || 9
    const foundFragments = currentTimeline.fragments.found || 0

    return (
        <Card className="w-full h-full bg-[var(--black-600)] border-[var(--black-500)] flex flex-col items-center justify-center relative overflow-hidden min-h-[300px]">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-[url('/img/grid.png')] opacity-5 pointer-events-none" />

            <CardHeader className="z-10 text-center pb-4 w-full">
                <CardTitle className="text-xl font-grotesk tracking-widest text-[var(--white-1)] uppercase">
                    {t('protocol.timeline.reconstruction.title')}
                </CardTitle>
                <div className="text-xs text-[var(--black-200)] font-mono mt-1">
                    [ANOM_CORE//REBUILD_SEQUENCE]
                </div>
            </CardHeader>

            <CardContent className="z-10 flex flex-col items-center w-full gap-6">

                {/* Emblem Status */}
                <div className="text-center space-y-2">
                    <h3 className="text-lg md:text-xl font-ibm text-[var(--white-1)] tracking-wide font-bold uppercase truncate max-w-[300px]">
                        {currentTimeline.emblemName}
                    </h3>
                    <div className="inline-flex items-center justify-center rounded font-ibm font-medium whitespace-nowrap px-3 py-1 text-xs bg-[var(--theme-secondary)] border border-[var(--theme-accent)] text-[var(--theme-accent)]">
                        <p>
                            FRAGMENT // {foundFragments}/{totalFragments}
                        </p>
                    </div>
                </div>

                {/* Puzzle Display - stacks vertically on small screens */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-2 md:gap-4 transition-opacity duration-300" style={{ opacity: loadingCode ? 0.5 : 1 }}>
                    {renderCodeGroup(part1)}

                    <div className="text-[var(--black-400)] font-mono text-lg md:text-xl shrink-0 hidden sm:block">-</div>

                    {renderCodeGroup(part2)}

                    <div className="text-[var(--black-400)] font-mono text-lg md:text-xl shrink-0 hidden sm:block">-</div>
                    {renderCodeGroup(part3)}
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center justify-between w-full max-w-[200px] mt-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handlePrev}
                        disabled={currentIndex === 0}
                        className="text-[var(--black-200)] hover:text-[var(--white-1)] hover:bg-[var(--black-500)]"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Button>

                    <span className="text-xs font-mono text-[var(--black-200)]">
                        {currentIndex + 1} / {activeReconstructions.length}
                    </span>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleNext}
                        disabled={currentIndex === activeReconstructions.length - 1}
                        className="text-[var(--black-200)] hover:text-[var(--white-1)] hover:bg-[var(--black-500)]"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </Button>
                </div>

            </CardContent>
        </Card>
    )
}
