'use client'

import { useEffect, useState } from 'react'
import Container from '@/components/commun/container'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslations } from 'next-intl'
import { useAgent } from '@/hooks/use-agent'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

export default function EchoDashboardPage() {
    const t = useTranslations()
    const { agent, getAgentStats, isLoading } = useAgent()

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


    const completionPercentage = agent?.protocol.stats?.fragmentsCollected > 0
        ? ((agent.protocol.stats.fragmentsCollected / agent.protocol.stats.totalFragments) * 100).toFixed(1)
        : '0'

    return (
        <Container className='gap-4' height='full' width='full' flexDirection='col' items='start' justify='start'>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-rows-[auto_1fr] gap-4 w-full h-full">
                <h1>Echo Dashboard</h1>
            </div>
        </Container>
    )
}