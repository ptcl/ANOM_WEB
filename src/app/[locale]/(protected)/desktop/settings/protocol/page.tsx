'use client'
import Container from '@/components/commun/container'
import { useAgent } from '@/hooks/use-agent'
import React, { useState, useEffect } from 'react'
import { AudioLines, Bell, Languages, SwatchBookIcon, User } from 'lucide-react'
import SettingSwitchRow from '@/components/setting/protocol/SettingSwitchRow'
import SettingLinkRow from '@/components/setting/protocol/SettingLinkRow'
import SettingLanguageRow from '@/components/setting/protocol/SettingLanguageRow'

export default function Protocol() {
    const { agent, updateAgent, isLoading } = useAgent()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const handleNotificationsChange = async (checked: boolean) => {
        await updateAgent({
            protocol: { settings: { notifications: checked } }
        })
    }

    const handlePublicProfileChange = async (checked: boolean) => {
        await updateAgent({
            protocol: { settings: { publicProfile: checked } }
        })
    }

    const handleProtocolSoundsChange = async (checked: boolean) => {
        await updateAgent({
            protocol: { settings: { protocolSounds: checked } }
        })
    }

    const handleLanguageChange = async (newLocale: string) => {
        await updateAgent({
            protocol: { settings: { language: newLocale } }
        })
    }

    return (
        <Container className='gap-8' height='full' flexDirection='col' items='start' justify='start'>
            <SettingSwitchRow
                icon={Bell}
                titleKey='protocol.setting.notifications.title'
                descriptionKey='protocol.setting.notifications.description'
                checked={mounted ? agent?.protocol.settings.notifications ?? false : false}
                onCheckedChange={handleNotificationsChange}
                disabled={isLoading}
                mounted={mounted}
            />

            <SettingSwitchRow
                icon={User}
                titleKey='protocol.setting.publicProfile.title'
                descriptionKey='protocol.setting.publicProfile.description'
                checked={mounted ? agent?.protocol.settings.publicProfile ?? false : false}
                onCheckedChange={handlePublicProfileChange}
                disabled={isLoading}
                mounted={mounted}
            />

            <SettingLinkRow
                icon={SwatchBookIcon}
                titleKey='protocol.setting.protocolOSTheme.title'
                descriptionKey='protocol.setting.protocolOSTheme.description'
                href='/desktop/settings/protocol/theme'
            />

            <SettingSwitchRow
                icon={AudioLines}
                titleKey='protocol.setting.protocolSounds.title'
                descriptionKey='protocol.setting.protocolSounds.description'
                checked={mounted ? agent?.protocol.settings.protocolSounds ?? false : false}
                onCheckedChange={handleProtocolSoundsChange}
                disabled={isLoading}
                mounted={mounted}
            />

            <SettingLanguageRow
                icon={Languages}
                titleKey='protocol.setting.language.title'
                descriptionKey='protocol.setting.language.description'
                onLanguageChange={handleLanguageChange}
            />
        </Container>
    )
}

