'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { useWindowsStore } from '@/store/useWindowsStore'

interface DesktopIconTaskbarProps {
    name?: string
    icon: string
    pinned?: boolean
    onClick?: () => void
    onDoubleClick?: () => void
    id?: string
    isActive?: boolean
    isMinimized?: boolean
}

export default function DesktopIconTaskbar({
    id,
    name,
    icon,
    onClick,
    onDoubleClick,
    pinned = false,
    isActive = false,
    isMinimized = false
}: DesktopIconTaskbarProps) {
    const [isHovered, setIsHovered] = useState(false)
    const { addPinnedApp, removePinnedApp } = useWindowsStore()

    const getIconSize = () => {
        if (isActive && !isMinimized) {
            return 28;
        } else if (isActive && isMinimized) {
            return 28;
        } else if (!isActive && !isMinimized) {
            return 34;
        } else {
            return 28;
        }
    }

    const handleClick = () => {
        onClick?.()
    }

    const handleDoubleClick = () => {
        onDoubleClick?.()
    }

    const togglePin = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (id) {
            if (pinned) {
                removePinnedApp(id)
            } else {
                addPinnedApp({
                    id,
                    name: name ?? "",
                    icon
                })
            }
        }
    }

    return (
        <div className={cn("flex flex-col items-center justify-between p-1 rounded h-11 w-10 transition-all cursor-pointer", isActive ? "bg-white/25" : isHovered ? "bg-white/15" : "")} onClick={handleClick} onDoubleClick={handleDoubleClick} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} onContextMenu={togglePin}>
            <Image src={icon} alt={name ?? ""} width={getIconSize()} height={getIconSize()} className={cn("pointer-events-none transition-all", isMinimized ? "opacity-80" : "")} />
            <div className={`h-[3px] rounded-full transition-all ${isActive ? 'bg-[var(--red_accent1)] w-2/3 ' : 'bg-gray-400 hidden'} ${isMinimized ? 'inline-block w-1/3' : ''}`} />
        </div>
    )
}
