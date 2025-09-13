'use client'

import { useState, useCallback, useRef } from 'react'
import ProtectedRoute from '@/components/provider/ProtectedRoute'
import SelectionArea from '@/components/desktop/SelectionArea'
import Dashboard from '@/components/desktop/applications/Dashboard'
import DataDestiny from '@/components/desktop/applications/DataDestiny'

export default function DesktopPage() {
    const [selectedIcons, setSelectedIcons] = useState<string[]>([])
    const [selectionRect, setSelectionRect] = useState<{ x: number; y: number; width: number; height: number } | null>(null)

    const iconsRef = useRef<Map<string, { element: HTMLElement, position: { x: number, y: number }, size: { width: number, height: number } }>>(new Map())

    const handleSelectionChange = useCallback((rect: { x: number; y: number; width: number; height: number }) => {
        if (!selectionRect ||
            Math.abs(rect.x - selectionRect.x) > 1 ||
            Math.abs(rect.y - selectionRect.y) > 1 ||
            Math.abs(rect.width - selectionRect.width) > 1 ||
            Math.abs(rect.height - selectionRect.height) > 1) {

            setSelectionRect(rect)

            const newSelectedIcons: string[] = []

            iconsRef.current.forEach((icon, id) => {
                const iconRect = {
                    x: icon.position.x,
                    y: icon.position.y,
                    width: icon.size.width,
                    height: icon.size.height
                }

                if (
                    rect.x < iconRect.x + iconRect.width &&
                    rect.x + rect.width > iconRect.x &&
                    rect.y < iconRect.y + iconRect.height &&
                    rect.y + rect.height > iconRect.y
                ) {
                    newSelectedIcons.push(id)
                }
            })

            if (JSON.stringify(newSelectedIcons) !== JSON.stringify(selectedIcons)) {
                setSelectedIcons(newSelectedIcons)
            }
        }
    }, [selectionRect, selectedIcons])

    const registerIcon = useCallback((id: string, element: HTMLElement, position: { x: number, y: number }, size: { width: number, height: number }) => {
        iconsRef.current.set(id, { element, position, size })
    }, [])

    const unregisterIcon = useCallback((id: string) => {
        iconsRef.current.delete(id)
    }, [])

    const handleDesktopClick = useCallback((e: React.MouseEvent) => {
        if (!e.ctrlKey) {
            setSelectedIcons([])
        }
    }, [])

    return (
        <ProtectedRoute>
            <section className="desktop-page h-full flex flex-col">
                <div className="flex-1 p-4 relative overflow-hidden" onClick={handleDesktopClick}>

                    <SelectionArea onSelectionChange={handleSelectionChange} />

                    <div className="relative z-10 flex gap-32">
                        <div className="relative">
                            <Dashboard position={undefined} selected={selectedIcons.includes('dashboard')} onRegister={registerIcon} onUnregister={unregisterIcon} />
                        </div>
                        <div className="relative">
                            <DataDestiny position={undefined} selected={selectedIcons.includes('test')} onRegister={registerIcon} onUnregister={unregisterIcon} />
                        </div>
                    </div>
                </div>

            </section>
        </ProtectedRoute>
    )
}