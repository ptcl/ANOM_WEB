'use client'

import { useEffect, useState } from 'react'
import Container from '@/components/commun/container'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslations } from 'next-intl'
import { useAgent } from '@/hooks/use-agent'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import HistoryAgent from '@/components/protocol/history/HistoryAgent'
import HistoryTimeline from '@/components/protocol/history/HistoryTimeline'

export default function AgentDashboardPage() {
    const t = useTranslations()
    const { agent, isLoading } = useAgent()

    useEffect(() => {
        const listener = (event: MessageEvent) => {
            if (event.origin !== window.location.origin) return
            if (event.data?.type === 'AUTH_TOKEN' && event.data.token) {
                localStorage.setItem('protocol_token', event.data.token)
            }
        }
        window.addEventListener('message', listener)
        return () => window.removeEventListener('message', listener)
    }, [])

    if (isLoading || !agent) {
        return (
            <Container className='gap-4' height='full' width='full' flexDirection='col' items='start' justify='start'>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-rows-[auto_1fr] gap-4 w-full h-full">
                    {[...Array(3)].map((_, i) => (
                        <Card key={i} className="w-full gap-2 rounded bg-[var(--black-6)] p-6">
                            <Skeleton className="h-6 w-32 mb-2 bg-[var(--grey-accent1)]" />
                            <Skeleton className="h-4 w-48 mb-4 bg-[var(--grey-accent1)]" />
                            <Skeleton className="h-8 w-16 bg-[var(--grey-accent1)]" />
                        </Card>
                    ))}

                    <div className='col-span-1 lg:col-span-1 h-full flex flex-col gap-4'>
                        <Skeleton className='h-full w-full rounded bg-[var(--black-6)]' />
                        <Skeleton className='h-full w-full rounded bg-[var(--black-6)]' />
                    </div>

                    <div className='col-span-1 lg:col-span-2 h-full'>
                        <Skeleton className='h-full w-full rounded bg-[var(--black-6)]' />
                    </div>
                </div>
            </Container>
        );
    }


    // const completionPercentage = agent?.protocol.stats?.fragmentsCollected > 0
    //     ? ((agent.protocol.stats.fragmentsCollected / agent.protocol.stats.fragmentsCollected) * 100).toFixed(1)
    //     : '0'

    return (
        <Container className='gap-4' height='full' width='full' flexDirection='col' items='start' justify='start'>
            <div className="grid grid-cols-1 lg:grid-cols-3 grid-rows-[auto_1fr] gap-4 w-full h-full">
                <Card className="w-full rounded bg-[var(--black-6)]">
                    <CardHeader className='text-start'>
                        <CardTitle className='text-base md:text-xl uppercase'>
                            {t('protocol.timeline.fragment.title')}
                        </CardTitle>
                        <CardDescription className='hidden xl:block md:text-sm'>
                            {t('protocol.timeline.fragment.description')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className='text-start font-satoshi text-2xl font-bold'>
                        {isLoading ? '...' : agent.protocol.stats.fragmentsCollected}
                    </CardContent>
                </Card>

                <Card className="w-full rounded bg-[var(--black-6)]">
                    <CardHeader className='text-start'>
                        <CardTitle className='text-base md:text-xl uppercase'>
                            {t('protocol.timeline.completed.title')}
                        </CardTitle>
                        <CardDescription className='hidden xl:block md:text-sm'>
                            {t('protocol.timeline.completed.description')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className='text-start font-satoshi text-2xl font-bold'>
                        {isLoading ? '...' : `${agent.protocol.stats.completedTimelines}`}
                    </CardContent>
                </Card>
                <Skeleton className="h-full w-full bg-[var(--grey-accent1)]" />


                <section className='col-span-1 lg:col-span-1 h-full min-h-0 flex flex-col gap-4 overflow-hidden'>
                    <HistoryTimeline className='flex-1 min-h-0' />
                    <HistoryAgent className="flex-1 min-h-0" />
                </section>

                <section className='col-span-1 lg:col-span-2 min-h-[300px]'>
                    <Skeleton className="h-full w-full bg-[var(--grey-accent1)]" />
                </section>
            </div>
        </Container>
    )
}