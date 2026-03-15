'use client'

import { useAgent } from "@/hooks/use-agent"
import { useTranslations } from "next-intl"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import Container from "@/components/commun/container"

export default function Account() {
    const t = useTranslations()
    const { agent, updateAgent, isLoading } = useAgent()

    const [customName, setCustomName] = useState('')
    const [bio, setBio] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

    useEffect(() => {
        if (agent?.protocol?.customName) {
            setCustomName(agent.protocol.customName)
        }
        if (agent?.protocol?.bio) {
            setBio(agent.protocol.bio)
        }
    }, [agent?.protocol?.customName, agent?.protocol?.bio])

    const handleSave = async () => {
        setMessage(null)
        setIsSaving(true)

        const success = await updateAgent({
            protocol: {
                customName: customName.trim() || null,
                bio: bio.trim() || null
            }
        })

        setIsSaving(false)

        if (success) {
            setMessage({ type: 'success', text: t('commun.information.success') })
        } else {
            setMessage({ type: 'error', text: t('commun.information.error') })
        }
    }

    const hasChanges =
        customName.trim() !== (agent?.protocol?.customName || '') ||
        bio.trim() !== (agent?.protocol?.bio || '')

    return (
        <Container className='gap-6' height='fit' flexDirection='col' items='start' justify='start'>
            <section className='w-full flex flex-col gap-4 text-left bg-[var(--black-800)] p-4 rounded'>
                <h2 className='text-lg font-medium text-[var(--theme-primary)]'>
                    {t('account.profile.title')}
                </h2>

                <div className='flex flex-col gap-2'>
                    <label htmlFor='bungieUsername' className='text-sm text-[var(--black-400)]'>
                        {t('account.profile.bungieUsername')}
                    </label>
                    <Input id='bungieUsername' type='text' value={agent?.bungieUser?.uniqueName || ''} disabled className='rounded max-w-[400px] opacity-50' />
                </div>

                <div className='flex flex-col gap-2'>
                    <label htmlFor='customName' className='text-sm text-[var(--black-400)]'>
                        {t('account.profile.customName')}
                    </label>
                    <Input id='customName' type='text' value={customName} onChange={(e) => setCustomName(e.target.value)} placeholder={t('account.profile.customNamePlaceholder')} className='rounded max-w-[400px]' disabled={isLoading || isSaving} maxLength={50} />
                    <span className='text-xs text-[var(--black-500)]'>
                        {customName.length}/50
                    </span>
                </div>
            </section>

            <section className='w-full flex flex-col gap-4 text-left bg-[var(--black-800)] p-4 rounded'>
                <h2 className='text-lg font-medium text-[var(--theme-primary)]'>
                    {t('account.profile.bio')}
                </h2>

                <div className='flex flex-col gap-2'>
                    <Textarea id='bio' value={bio} onChange={(e) => setBio(e.target.value)} placeholder={t('account.profile.bioPlaceholder')} className='rounded max-w-[400px] min-h-[100px] resize-none' disabled={isLoading || isSaving} maxLength={500} />
                    <span className='text-xs text-[var(--black-500)]'>
                        {bio.length}/500
                    </span>
                </div>
            </section>

            {
                message && (
                    <p className={`text-sm ${message.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                        {message.text}
                    </p>
                )
            }

            <Button onClick={handleSave} disabled={isLoading || isSaving || !hasChanges} className='w-fit button__style__bungie rounded-none text-[var(--theme-primary)]'>
                {isSaving ? t('commun.loading') : t('commun.buttons.save')}
            </Button>
        </Container >
    )
}
