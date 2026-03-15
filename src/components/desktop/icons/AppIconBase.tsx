'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'
import { useState, useMemo } from 'react'

interface AppIconBaseProps {
    id: string
    name?: string
    icon?: string | React.ReactNode
    isActive?: boolean
    isMinimized?: boolean
    showLabel?: boolean
    size?: number
    onClick?: () => void
    onDoubleClick?: () => void
    className?: string
    variant?: 'desktop' | 'taskbar'
}

export default function AppIconBase({
    name,
    icon,
    isActive = false,
    isMinimized = false,
    showLabel = true,
    onClick,
    onDoubleClick,
    className,
    variant = 'desktop'
}: AppIconBaseProps) {
    const [hovered, setHovered] = useState(false)

    // Détermine si l'icône est une string (chemin) ou un ReactNode (composant)
    const isStringIcon = typeof icon === 'string'

    const safeSrc = useMemo(() => {
        if (!isStringIcon) return '/svg/file_default.svg'
        if (!icon || (icon as string).trim() === '') return '/svg/file_default.svg'
        return icon as string
    }, [icon, isStringIcon])

    // Composant d'icône réutilisable
    const IconElement = ({ size = 32, extraClassName = '' }: { size?: number; extraClassName?: string }) => {
        if (isStringIcon) {
            return (
                <Image
                    src={safeSrc}
                    alt={name ?? 'File'}
                    width={size}
                    height={size}
                    draggable={false}
                    className={cn('pointer-events-none transition-all', extraClassName)}
                />
            )
        }
        // C'est un ReactNode (composant Lucide ou autre)
        return (
            <div className={cn('flex items-center justify-center', extraClassName)} style={{ width: size, height: size }}>
                {icon}
            </div>
        )
    }

    // Taskbar mode styling
    if (variant === 'taskbar') {
        const iconScale = isActive && !isMinimized ? 'scale-110' : hovered ? 'scale-105' : 'scale-100'

        return (
            <div
                onClick={onClick}
                onDoubleClick={onDoubleClick}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                className={cn(
                    'relative flex flex-col items-center justify-center cursor-pointer select-none',
                    'h-12 w-11 rounded transition-all duration-200 ease-in-out',
                    hovered ? 'bg-white/10' : isActive ? 'bg-white/15' : 'bg-transparent',
                    className
                )}
            >
                <div className="relative flex items-center justify-center h-[24px] w-[24px]">
                    <IconElement
                        size={24}
                        extraClassName={cn(
                            'transition-transform duration-200',
                            iconScale,
                            isMinimized && 'opacity-60 grayscale-[30%]'
                        )}
                    />
                </div>

                <div className={cn(
                    'absolute bottom-[5px] rounded-full transition-all duration-300 ease-out',
                    isActive ? 'bg-white/60 w-[24px] h-[2.3px]' :
                        isMinimized ? 'bg-white/40 w-[8px] h-[2.5px]' :
                            'w-0 opacity-0'
                )} />
            </div>
        )
    }

    // Desktop mode styling (original)
    return (
        <div
            onClick={onClick}
            onDoubleClick={onDoubleClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className={cn(
                'flex flex-col items-center justify-center select-none transition-all cursor-pointer rounded-md p-1 relative',
                hovered && 'bg-white/10',
                className
            )}
        >
            <IconElement size={32} extraClassName={isMinimized ? 'opacity-70' : ''} />
            {showLabel && name && (
                <p className="text-center text-xs mt-1 w-full max-w-[6rem] break-words">{name}</p>
            )}
            <div className={cn(
                'h-[3px] rounded-full transition-all absolute bottom-0',
                isActive ? 'bg-[var(--red_accent1)] w-2/3' :
                    isMinimized ? 'bg-[var(--red_accent1)] w-1/3' :
                        'hidden'
            )} />
        </div>
    )
}

