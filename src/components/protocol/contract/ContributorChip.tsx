'use client'

import { X, User } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface ContributorChipProps {
    displayName: string
    bungieId: string
    isAnonymous?: boolean
    onRemove?: () => void
    isCurrentUser?: boolean
}

export default function ContributorChip({
    displayName,
    bungieId,
    isAnonymous = false,
    onRemove,
    isCurrentUser = false
}: ContributorChipProps) {
    const t = useTranslations()

    return (
        <div className={`
            inline-flex items-center gap-2 px-3 py-1.5 rounded-full
            ${isCurrentUser
                ? 'bg-[var(--theme-accent)]/20 border border-[var(--theme-accent)]'
                : 'bg-[var(--black-600)] border border-[var(--black-400)]'
            }
        `}>
            {/* Avatar */}
            <div className={`
                w-5 h-5 rounded-full flex items-center justify-center
                ${isCurrentUser ? 'bg-[var(--theme-accent)]' : 'bg-[var(--black-400)]'}
            `}>
                <User className="w-3 h-3 text-[var(--white-1)]" />
            </div>

            {/* Name */}
            <span className="text-sm font-grotesk text-[var(--white-1)]">
                {isAnonymous ? t('commun.anonymous') : displayName}
            </span>

            {/* Current user badge */}
            {isCurrentUser && (
                <span className="text-xs font-ibm text-[var(--theme-accent)]">
                    {t('protocol.contract.contributors.you')}
                </span>
            )}

            {/* Remove button */}
            {onRemove && !isCurrentUser && (
                <button
                    type="button"
                    onClick={onRemove}
                    className="ml-1 text-[var(--black-300)] hover:text-[var(--danger)] transition-colors cursor-pointer"
                >
                    <X className="w-3.5 h-3.5" />
                </button>
            )}
        </div>
    )
}
