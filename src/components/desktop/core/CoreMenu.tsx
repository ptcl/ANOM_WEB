'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Settings, User, Power, Layers, Search } from 'lucide-react'
import { Popover, PopoverTrigger, PopoverContent, } from '@/components/ui/popover'
import { motion, AnimatePresence } from 'framer-motion'
import { useWindowsStore } from '@/store/useWindowsStore'
import { useAuthentication } from '@/hooks/useAuthentication'
import { APP_REGISTRY } from '@/constants/appRegistry'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import SearchBarTest from '@/components/ui/FuzzySearchBar'

export default function CoreMenu() {
    const [open, setOpen] = useState(false)
    const { logout } = useAuthentication()
    const { addWindow, updateWindow, openWindows } = useWindowsStore()
    const isMobile = useMediaQuery('(max-width: 768px)')

    // Fonction pour ouvrir une app depuis APP_REGISTRY
    const openApp = (appId: string) => {
        const appConfig = APP_REGISTRY[appId as keyof typeof APP_REGISTRY]
        if (!appConfig) return

        const existingWindow = openWindows.find(w => w.id === appId)
        if (existingWindow) {
            // Fenêtre existe, la rouvrir/déminimiser
            updateWindow(appId, { isOpen: true, isMinimized: false })
        } else {
            // Créer une nouvelle fenêtre
            addWindow({
                id: appId,
                title: appConfig.name,
                icon: appConfig.icon,
                isOpen: true,
                isMinimized: false,
                position: { x: 200, y: 100 },
                size: { width: 800, height: 600 }
            })
        }
    }

    if (isMobile) {
        return (
            <>
                <button
                    className={cn(
                        'flex items-center justify-center rounded transition-all duration-200 cursor-pointer relative h-8 w-8',
                        open ? 'bg-white/20 scale-[1.04] backdrop-blur-sm' : 'hover:bg-white/10 active:scale-[0.95]'
                    )}
                    aria-label="Open Core Menu"
                    onClick={() => setOpen(!open)}
                >
                    <Image
                        src="/svg/anom/anom_gradient_blue.svg"
                        alt="Core Menu"
                        width={20}
                        height={20}
                        className=""
                    />
                </button>

                <AnimatePresence>
                    {open && (
                        <>
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} className="fixed inset-0 bottom-14 bg-black/50 backdrop-blur-sm z-30" />
                            <motion.div key="coremenu-mobile" initial={{ opacity: 0, y: '100%' }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: '100%' }} transition={{ duration: 0.2, ease: 'easeOut' }} className="fixed bottom-14 left-0 right-0 w-full bg-[var(--background)] border-t border-white/10 shadow-2xl backdrop-blur-lg overflow-hidden rounded-t-lg z-40 max-h-[70vh]">
                                <section className="flex flex-col space-y-1 p-3">
                                    <SearchBarTest />
                                </section>

                                <section className="flex flex-col space-y-1 p-3">
                                    <MenuItem icon={<Search size={14} />} label="Search Protocols" isMobile={true} onClick={() => setOpen(false)} />
                                    <MenuItem icon={<Layers size={14} />} label="Open Workspace" isMobile={true} onClick={() => setOpen(false)} />
                                    <MenuItem icon={<User size={14} />} label="Profile & Access" isMobile={true} onClick={() => setOpen(false)} />
                                </section>

                                <section className="border-t border-white/10" />

                                <section className="flex flex-col space-y-2 px-3 py-3 text-xs text-gray-400 uppercase tracking-wider font-medium bg-white/5 border-t border-white/10">
                                    <section className="text-center">Core System</section>
                                    <section className="flex gap-4 justify-center">
                                        <MenuItem cursorPointer icon={<Layers size={14} />} onClick={() => { useWindowsStore.getState().reorganizeIcons(), setOpen(false) }} isMobile={true} />
                                        <MenuItem cursorPointer icon={<Settings size={14} />} onClick={() => { openApp('settings'), setOpen(false) }} />
                                        <MenuItem cursorPointer icon={<Power size={14} />} danger onClick={() => { logout('/'), setOpen(false) }} isMobile={true} />
                                    </section>
                                </section>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </>
        )
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button className={cn('flex items-center justify-center h-10 w-10 rounded transition-all duration-200 cursor-pointer relative', open ? 'bg-white/20 scale-[1.04] backdrop-blur-sm' : 'hover:bg-white/10 active:scale-[0.95]')} aria-label="Open Core Menu">
                    <Image src="/svg/anom/anom_gradient_blue.svg" alt="Core Menu" width={28} height={28} className="" />
                </button>
            </PopoverTrigger>

            <AnimatePresence>
                {open && (
                    <PopoverContent side="top" sideOffset={15} className="border-none bg-transparent p-0" forceMount>
                        <motion.div key="coremenu-desktop" initial={{ opacity: 0, scale: 0.92, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} transition={{ duration: 0.15, ease: 'easeOut' }} className="rounded-sm bg-[var(--background)] border border-white/10 shadow-2xl backdrop-blur-lg overflow-hidden min-w-[420px] max-w-[600px]">
                            <section className="flex flex-col space-y-1 p-4">
                                <SearchBarTest />
                            </section>

                            <section className="flex flex-col space-y-1 p-4">
                                <MenuItem tooltip='Search Protocols' tooltipVisible={true} tooltipSide='right' icon={<Search size={16} />} label="Search Protocols" shortcut="Ctrl+K" isMobile={false} />
                                <MenuItem tooltip='Open Workspace' tooltipVisible={true} tooltipSide='right' icon={<Layers size={16} />} label="Open Workspace" isMobile={false} />
                                <MenuItem tooltip='Profile & Access' tooltipVisible={true} tooltipSide='right' icon={<User size={16} />} label="Profile & Access" isMobile={false} />
                            </section>

                            <section className="border-t border-white/10" />

                            <section className="flex flex-row justify-between items-center px-3 py-2 text-xs text-gray-400 uppercase tracking-wider font-medium bg-white/5 border-t border-white/10">
                                <section>Core System</section>
                                <section className="flex">
                                    <MenuItem cursorPointer tooltip='Reorganize Icons' tooltipVisible={true} icon={<Layers size={16} />} onClick={() => useWindowsStore.getState().reorganizeIcons()} isMobile={false} />
                                    <MenuItem cursorPointer tooltip='Settings' tooltipVisible={true} icon={<Settings size={16} />} isMobile={false} onClick={() => {
                                        openApp('settings')
                                    }} />
                                    <MenuItem cursorPointer tooltip='Logout' tooltipVisible={true} icon={<Power size={16} />} danger onClick={() => logout('/')} isMobile={false} />
                                </section>
                            </section>
                        </motion.div>
                    </PopoverContent>
                )}
            </AnimatePresence>
        </Popover>
    )
}

interface MenuItemProps {
    icon: React.ReactNode
    label?: string
    shortcut?: string
    danger?: boolean
    cursorPointer?: boolean
    tooltip?: string
    tooltipVisible?: boolean
    tooltipSide?: 'top' | 'right' | 'bottom' | 'left'
    onClick?: () => void
    isMobile?: boolean
}

function MenuItem({ icon, label, shortcut, danger = false, cursorPointer, tooltip, tooltipVisible, tooltipSide = 'top', onClick, isMobile = false }: MenuItemProps) {
    const buttonClasses = cn('flex items-center justify-between w-full rounded-md transition-colors duration-150', isMobile ? 'px-3 py-2 text-sm' : 'px-2 py-1.5 text-sm', 'text-gray-200 hover:bg-white/10 active:bg-white/20', danger && 'text-red-400 hover:bg-red-400/10 active:bg-red-400/20')

    const buttonContent = (
        <button className={buttonClasses} style={{ cursor: cursorPointer ? 'pointer' : 'default' }} onClick={onClick}>
            <span className={cn("flex items-center", isMobile ? "gap-3" : "gap-2")}>{icon}{label}</span>
            {shortcut && <span className="text-[11px] text-gray-500">{shortcut}</span>}
        </button>
    )

    return (
        tooltipVisible && tooltip ? (
            <Tooltip>
                <TooltipTrigger asChild>
                    {buttonContent}
                </TooltipTrigger>
                <TooltipContent side={tooltipSide}>
                    <p>{tooltip}</p>
                </TooltipContent>
            </Tooltip>
        ) : buttonContent
    )
}