'use client'

import { useState, useEffect } from 'react'
import Container from '@/components/commun/container'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { useAgent } from '@/hooks/use-agent'
import Image from 'next/image'
import osData from '@/app/content/desktopData/setting/OsData.json'
import { useTranslations } from 'next-intl'

export default function SettingsPage() {
    const { agent, isLoading, error } = useAgent()
    const t = useTranslations()

    return (
        <Container className='' height='full' width='full' flexDirection='col' items='start' justify='start'>
            <section className='flex gap-4'>
                <Image src="/img/anom_soon.webp" width={140} height={100} className='rounded-md max-w-[140px] max-h-[100px]' alt="Settings" />
                <div className='flex flex-col gap-1 text-left'>
                    <h2 className='text-2xl font-semibold'>{t("protocolOS.title")}</h2>
                    <p className='text-xl font-medium'>{t("protocolOS.version")}</p>
                    <p className='text-sm text-[var(--black-400)]'>{t("protocolOS.note")}</p>
                </div>
            </section>
            <section className='flex flex-col gap-4'>

            </section>
        </Container>
    )
}
