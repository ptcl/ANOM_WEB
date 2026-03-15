'use client'
import React, { useState } from 'react'
import Container from '@/components/commun/container'
import { useTranslations } from 'next-intl'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAgent } from '@/hooks/use-agent'

export default function Redeem() {
    const t = useTranslations()
    const { redeemCode } = useAgent()
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setMessage(null)
        setIsLoading(true)

        const form = e.currentTarget
        const formData = new FormData(form)
        const code = formData.get('code') as string

        if (!code || code.trim() === '') {
            setMessage({ type: 'error', text: `${t('commun.information.code.empty')}` })
            setIsLoading(false)
            return
        }

        const result = await redeemCode(code.trim())
        setIsLoading(false)

        if (result.success) {
            setMessage({ type: 'success', text: `${t('commun.information.code.success')}` })
            form.reset()
        } else {
            setMessage({ type: 'error', text: `${t('commun.information.code.error')}` })
        }
    }

    return (
        <Container className='gap-4' height='fit' flexDirection='col' items='start' justify='start'>
            <section className='w-full flex flex-col gap-4 text-left bg-[var(--black-800)] p-2 rounded'>
                <div className='flex flex-col gap-2'>
                    <h1 className='text-lg font-medium text-[var(--theme-primary)]'>{t('redeem.title')}</h1>
                    <p className='text-sm text-[var(--black-400)]'>{t('redeem.description')}</p>
                </div>
                <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                    <Input
                        placeholder={t('placeholder.redeem')}
                        type='text'
                        className='rounded max-w-[300px]'
                        name='code'
                        disabled={isLoading}
                    />
                    {message && (
                        <p className={`text-sm ${message.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                            {message.text}
                        </p>
                    )}
                    <Button
                        type='submit'
                        className='w-fit button__style__bungie rounded-none text-[var(--theme-primary)]'
                        disabled={isLoading}
                    >
                        {isLoading ? t('commun.loading') : t('commun.buttons.execute')}
                    </Button>
                </form>
            </section>
            <section className='w-full flex flex-col gap-6 text-left bg-[var(--black-800)] p-2 rounded'>
                <h1 className='text-xl font-medium text-[var(--theme-primary)]'>{t('redeem.fonction.title')}</h1>
                <div className='flex flex-col gap-2'>
                    <h2 className='text-lg font-medium text-[var(--theme-primary)]'>{t('redeem.fonction.module.title')}</h2>
                    <p className='text-sm text-[var(--black-400)]'>{t('redeem.fonction.module.description')}</p>
                </div>
                <div className='flex flex-col gap-2'>
                    <h2 className='text-lg font-medium text-[var(--theme-primary)]'>{t('redeem.fonction.uplink.title')}</h2>
                    <p className='text-sm text-[var(--black-400)]'>{t('redeem.fonction.uplink.description')}</p>
                </div>
                <div className='flex flex-col gap-2'>
                    <h2 className='text-lg font-medium text-[var(--theme-primary)]'>{t('redeem.fonction.marker.title')}</h2>
                    <p className='text-sm text-[var(--black-400)]'>{t('redeem.fonction.marker.description')}</p>
                </div>
                <div className='flex flex-col gap-2'>
                    <h2 className='text-lg font-medium text-[var(--theme-primary)]'>{t('redeem.fonction.UPDATE.title')}</h2>
                    <p className='text-sm text-[var(--black-400)]'>{t('redeem.fonction.UPDATE.description')}</p>
                </div>
            </section>
        </Container>
    )
}

