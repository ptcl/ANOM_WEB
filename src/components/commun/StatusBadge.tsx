'use client'

import { useTranslations } from 'next-intl'
import { CircleCheck, Timer, CircleX } from 'lucide-react'

export type StatusType = 'COMPLETE' | 'PENDING' | 'LOCKED' | string

interface StatusBadgeProps {
    status: StatusType
    className?: string
    iconOnly?: boolean
}

export default function StatusBadge({ status, className = '', iconOnly = false }: StatusBadgeProps) {
    const t = useTranslations()

    const getStatusConfig = () => {
        switch (status) {
            case 'COMPLETE':
                return {
                    label: t('commun.status.complete'),
                    classes: 'bg-green-500/20 text-green-400 border-green-500/30',
                    iconColor: 'text-green-400',
                    Icon: CircleCheck
                }
            case 'PENDING':
                return {
                    label: t('commun.status.pending'),
                    classes: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
                    iconColor: 'text-yellow-400',
                    Icon: Timer
                }
            case 'LOCKED':
                return {
                    label: t('commun.status.locked'),
                    classes: 'bg-neutral-500/20 text-neutral-400 border-neutral-500/30',
                    iconColor: 'text-neutral-400',
                    Icon: CircleX
                }
            default:
                return {
                    label: status,
                    classes: 'bg-neutral-500/20 text-neutral-400 border-neutral-500/30',
                    iconColor: 'text-neutral-400',
                    Icon: Timer
                }
        }
    }

    const { label, classes, iconColor, Icon } = getStatusConfig()

    if (iconOnly) {
        return <Icon className={`w-5 h-5 ${iconColor} ${className}`} />
    }

    return (
        <span className={`px-2 py-1 text-xs rounded border ${classes} ${className}`}>
            {label}
        </span>
    )
}


