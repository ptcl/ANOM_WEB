'use client'

import { useState, useRef, useEffect } from 'react'
import { SidebarContent, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar'
import { NavCollapsibleSection, NavItem, RoleCheckFunction } from '@/components/sidebar/NavCollapsibleSection'
import { NavUser } from '@/components/sidebar/nav-user'

interface RoleCheckItem {
    items: NavItem[]
    check: RoleCheckFunction
}

interface MobileSlidePanelProps {
    children: React.ReactNode
    navItems: NavItem[]
    showNavUser?: boolean
    roleChecks?: RoleCheckItem[]
    footerContent?: React.ReactNode
}

export default function MobileSlidePanel({
    children,
    navItems,
    showNavUser = true,
    roleChecks = [],
    footerContent
}: MobileSlidePanelProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const [translateX, setTranslateX] = useState(0)
    const touchStartX = useRef(0)
    const touchStartY = useRef(0)
    const touchStartTime = useRef(0)
    const hasDetectedDirection = useRef(false)
    const currentX = useRef(0)
    const panelRef = useRef<HTMLDivElement>(null)

    const SIDEBAR_WIDTH = 288
    const DIRECTION_THRESHOLD = 15

    const handleTouchStart = (e: TouchEvent) => {
        const touch = e.touches[0]
        touchStartX.current = touch.clientX
        touchStartY.current = touch.clientY
        touchStartTime.current = Date.now()
        hasDetectedDirection.current = false
        currentX.current = isOpen ? SIDEBAR_WIDTH : 0
    }

    const handleTouchMove = (e: TouchEvent) => {
        const touch = e.touches[0]
        const deltaX = touch.clientX - touchStartX.current
        const deltaY = touch.clientY - touchStartY.current

        if (!hasDetectedDirection.current && (Math.abs(deltaX) > DIRECTION_THRESHOLD || Math.abs(deltaY) > DIRECTION_THRESHOLD)) {
            hasDetectedDirection.current = true

            if (Math.abs(deltaY) > Math.abs(deltaX) * 1.2) {
                return
            }

            if (!isOpen) {
                if (deltaX < 0) {
                    return
                }
                if (deltaX > 0) {
                    setIsDragging(true)
                }
            }
            else {
                setIsDragging(true)
            }
        }

        if (isDragging) {
            e.preventDefault()

            let newX = currentX.current + deltaX
            newX = Math.max(0, Math.min(SIDEBAR_WIDTH, newX))

            setTranslateX(newX)
        }
    }

    const handleTouchEnd = (e: TouchEvent) => {
        if (!isDragging) {
            hasDetectedDirection.current = false
            return
        }

        const touch = e.changedTouches[0]
        const deltaX = touch.clientX - touchStartX.current
        const deltaTime = Date.now() - touchStartTime.current
        const velocity = Math.abs(deltaX) / deltaTime

        setIsDragging(false)
        hasDetectedDirection.current = false

        const threshold = SIDEBAR_WIDTH / 2

        if (deltaX > 50 && velocity > 0.5) {
            openPanel()
        } else if (deltaX < -50 && velocity > 0.5) {
            closePanel()
        }
        else if (translateX > threshold) {
            openPanel()
        } else {
            closePanel()
        }
    }

    const openPanel = () => {
        setTranslateX(SIDEBAR_WIDTH)
        setIsOpen(true)
    }

    const closePanel = () => {
        setTranslateX(0)
        setIsOpen(false)
    }

    useEffect(() => {
        const panel = panelRef.current
        if (!panel) return

        panel.addEventListener('touchstart', handleTouchStart)
        panel.addEventListener('touchmove', handleTouchMove, { passive: false })
        panel.addEventListener('touchend', handleTouchEnd)

        return () => {
            panel.removeEventListener('touchstart', handleTouchStart)
            panel.removeEventListener('touchmove', handleTouchMove)
            panel.removeEventListener('touchend', handleTouchEnd)
        }
    }, [isDragging, isOpen])

    return (
        <div className="fixed inset-0 overflow-hidden">
            <div className="fixed inset-y-0 left-0 w-72 bg-background border-r z-[6] overflow-y-auto flex flex-col">
                {showNavUser && (
                    <SidebarHeader>
                        <NavUser />
                    </SidebarHeader>
                )}
                <SidebarContent>
                    <NavCollapsibleSection items={navItems} />
                    {roleChecks.map((rc, index) => (
                        <NavCollapsibleSection
                            key={`role-${index}`}
                            items={rc.items}
                            roleCheck={rc.check}
                        />
                    ))}
                </SidebarContent>
                {footerContent && (
                    <SidebarFooter>
                        {footerContent}
                    </SidebarFooter>
                )}
            </div>

            <div
                ref={panelRef}
                className="fixed inset-0 z-10 bg-background shadow-2xl"
                style={{
                    transform: `translateX(${translateX}px)`,
                    transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
            >
                <div
                    className="relative w-full h-full overflow-auto"
                    style={{ pointerEvents: isOpen ? 'none' : 'auto' }}
                >
                    {children}
                </div>
            </div>
        </div>
    )
}
