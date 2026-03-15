'use client'
import WindowContainerStatic from '@/components/desktop/windows/WindowContainerStatic'
import { useAgentStore } from '@/store/agentStore'
import { IAgentHistory } from '@/types/agent'
import { useTranslations } from 'next-intl'
import React, { useEffect, useRef, useState } from 'react'

interface HistoryAgentProps {
    className?: string
}

// Fonction pour formater le message de log selon l'action (avec traductions)
const formatLogMessage = (item: IAgentHistory, t: ReturnType<typeof useTranslations>): string => {
    const { action, targetId = '', meta } = item

    switch (action) {
        case 'FRAGMENT_COLLECTED':
            return meta?.entryId
                ? t('logs.fragmentCollected', { targetId, entryId: meta.entryId })
                : t('logs.fragmentCollectedNoEntry', { targetId })

        case 'TIMELINE_STARTED':
            return t('logs.timelineStarted', { targetId })

        case 'TIMELINE_COMPLETED':
            return t('logs.timelineCompleted', { targetId })

        case 'ENTRY_RESOLVED':
            return t('logs.entryResolved', { targetId })

        case 'THEME_CHANGE':
            if (meta?.from && meta?.to) {
                return t('logs.themeChanged', { from: meta.from, to: meta.to })
            }
            return t('logs.themeChangedSimple', { targetId })

        case 'CHALLENGE_COMPLETED':
            return t('logs.challengeCompleted')

        case 'REWARD_REDEEMED':
            return t('logs.rewardRedeemed', { targetId })

        case 'PROFILE_UPDATE':
            if (meta?.field) {
                return t('logs.profileUpdated', { field: String(meta.field).toUpperCase() })
            }
            return t('logs.profileUpdatedSimple')

        case 'LOGIN':
            return t('logs.loginSuccess')

        case 'LOGOUT':
            return t('logs.logout')

        default:
            return targetId
                ? t('logs.default', { action: action.replace(/_/g, ' '), targetId })
                : t('logs.defaultNoTarget', { action: action.replace(/_/g, ' ') })
    }
}

// Formater le timestamp
const formatTimestamp = (timestamp: Date): string => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    })
}

export default function HistoryAgent({ className }: HistoryAgentProps) {
    const t = useTranslations()
    const { fetchHistory, getHistory } = useAgentStore()
    const history = getHistory()
    const scrollRef = useRef<HTMLDivElement>(null)
    const [prevHistoryLength, setPrevHistoryLength] = useState(0)

    useEffect(() => {
        fetchHistory()
    }, [fetchHistory])

    // Scroll automatique quand un nouveau log arrive
    useEffect(() => {
        if (history.length > prevHistoryLength && scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
        setPrevHistoryLength(history.length)
    }, [history.length, prevHistoryLength])

    const formatLogId = (index: number) => {
        return `[LOG_${String(index + 1).padStart(4, '0')}]`
    }

    return (
        <div className={`h-full ${className || ''}`}>
            <WindowContainerStatic title={'LOGS'} width={'100%'} height={'100%'} showControls={false} showIcon={false} animationType='scale' scanlines="/img/overlay_terminal_2.png">
                <div
                    ref={scrollRef}
                    className="flex flex-col gap-1 font-mono text-sm flex-1 min-h-0 overflow-y-auto overflow-x-hidden scrollbar-hide"
                >
                    {history.length === 0 ? (
                        <div className="text-gray-500 text-center py-4">{t('logs.noLogs')}</div>
                    ) : (
                        [...history].reverse().map((item: IAgentHistory, index: number, arr) => {
                            const isNew = index === arr.length - 1

                            return (
                                <div key={`${item.timestamp}-${index}`} className={`flex items-start gap-2 rounded px-1 -mx-1 ${isNew ? 'animate-log-new' : ''}`}>
                                    {/* Log ID - largeur fixe */}
                                    <span className="text-red-500 shrink-0 w-[84px] text-left">{formatLogId(index + 1)}</span>

                                    {/* Message - tout en gris avec word-wrap */}
                                    <span className="text-gray-400 flex-1 text-left break-words">{formatLogMessage(item, t)}</span>

                                    {/* Timestamp à la fin */}
                                    <span className="text-gray-600 shrink-0 text-right whitespace-nowrap">{formatTimestamp(item.timestamp)}</span>
                                </div>
                            )
                        })
                    )}
                </div>
            </WindowContainerStatic>
        </div>
    )
}

