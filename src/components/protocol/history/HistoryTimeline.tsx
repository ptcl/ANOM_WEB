'use client'

import React, { useEffect, useState, Fragment } from 'react'
import { ChevronRight, ChevronDown } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table'
import { useTimelineStore, ITimelineProgress, ITimelineEntry } from '@/store/timelineStore'
import { useTranslations } from 'next-intl'
import StatusBadge from '@/components/commun/StatusBadge'

function TimelineRow({ timeline }: { timeline: ITimelineProgress }) {
    const [isOpen, setIsOpen] = useState(false)
    const hasEntries = timeline.entries && timeline.entries.length > 0

    return (
        <Fragment>
            {/* Main timeline row */}
            <TableRow className="border-[var(--black-400)] bg-[var(--black-600)]">
                <TableCell className="w-[40px] max-w-[40px] overflow-hidden">
                    {hasEntries && (
                        <button onClick={() => setIsOpen(!isOpen)} className="p-1 rounded hover:bg-[var(--black-400)] cursor-pointer transition-colors">
                            {isOpen ? (
                                <ChevronDown className="h-4 w-4" />
                            ) : (
                                <ChevronRight className="h-4 w-4" />
                            )}
                        </button>
                    )}
                </TableCell>
                <TableCell className="w-[80px] max-w-[80px] overflow-hidden font-ibm text-sm text-[var(--black-50)] text-left">
                    <span className="block truncate font-ibm" title={timeline.accessCode || '????'}>
                        {timeline.accessCode || '????'}
                    </span>
                </TableCell>
                <TableCell className="w-[170px] max-w-[170px] overflow-hidden text-[var(--black-50)] text-left">
                    <span className="block truncate font-ibm" title={timeline.emblemName || '????'}>
                        {timeline.emblemName || '????'}
                    </span>
                </TableCell>
                <TableCell className="w-[100px] max-w-[100px] overflow-hidden font-ibm text-sm text-left">
                    <span className="">{timeline.fragments.found}</span>
                    <span className="">/</span>
                    <span className="">{timeline.fragments.total}</span>
                </TableCell>
                <TableCell className="w-[80px] max-w-[80px] overflow-hidden text-left">
                    <StatusBadge status={timeline.status} />
                </TableCell>
            </TableRow>

            {/* Expandable entry rows */}
            {isOpen && hasEntries && timeline.entries.map((entry: ITimelineEntry, index: number) => (
                <TableRow key={`${timeline.timelineId}-entry-${index}`} className="border-[var(--black-400)] bg-[var(--black-600)]">
                    <TableCell className="w-[40px] max-w-[40px]" />
                    <TableCell className="w-[80px] max-w-[80px] overflow-hidden font-ibm text-xs text-[var(--black-200)] text-left">
                        <span className="block truncate font-ibm" title={entry.accessCode || '????'}>
                            {entry.accessCode || '????'}
                        </span>
                    </TableCell>
                    <TableCell className="w-[170px] max-w-[170px] overflow-hidden text-[var(--black-200)] text-sm text-left">
                        <span className="block truncate font-ibm" title={(entry.name || '????').replace(/^Point d'Entrée\s*:\s*/i, '')}>
                            {(entry.name || '????').replace(/^Point d'Entrée\s*:\s*/i, '')}
                        </span>
                    </TableCell>
                    <TableCell className="w-[100px] max-w-[100px]" />
                    <TableCell className="w-[80px] max-w-[80px] overflow-hidden text-left">
                        <StatusBadge status={entry.status} />
                    </TableCell>
                </TableRow>
            ))}
        </Fragment>
    )
}

export default function HistoryTimeline({ className }: { className?: string }) {
    const t = useTranslations()
    const timelines = useTimelineStore((state) => state.timelines)
    const isLoading = useTimelineStore((state) => state.isLoading)
    const loadTimelines = useTimelineStore((state) => state.loadTimelines)

    useEffect(() => {
        loadTimelines()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (isLoading && timelines.length === 0) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="animate-pulse text-[var(--black-200)]">{t('historyTimeline.loading')}</div>
            </div>
        )
    }

    if (timelines.length === 0) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="text-[var(--black-200)]">{t('historyTimeline.noTimelines')}</div>
            </div>
        )
    }

    return (
        <div className={`h-full w-full flex flex-col bg-[var(--black-600)] border-2 border-[var(--black-500)] rounded-md shadow-xl overflow-hidden overflow-x-hidden ${className || ''}`}>
            <Table className="table-fixed">
                <TableHeader className='bg-[var(--black-500)]'>
                    <TableRow className="border-[var(--black-400)] hover:bg-transparent">
                        <TableHead className="w-[40px]" />
                        <TableHead className="w-[80px] text-[var(--black-200)] text-left">{t('historyTimeline.headers.access')}</TableHead>
                        <TableHead className="w-[170px] text-[var(--black-200)] text-left">{t('historyTimeline.headers.emblem')}</TableHead>
                        <TableHead className="w-[100px] text-[var(--black-200)] text-left">{t('historyTimeline.headers.fragments')}</TableHead>
                        <TableHead className="w-[80px] text-[var(--black-200)] text-left">{t('historyTimeline.headers.status')}</TableHead>
                    </TableRow>
                </TableHeader>
            </Table>
            <div className="flex-1 overflow-y-auto">
                <Table className="table-fixed">
                    <TableBody>
                        {timelines.map((timeline) => (
                            <TimelineRow key={timeline.timelineId} timeline={timeline} />
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

