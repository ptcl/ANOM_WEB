import { useWindowsStore } from '@/store/useWindowsStore'
import { ChevronUp, Volume2, Wifi } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import DesktopIconTaskbar from './DesktopIconTaskbar'
import { ModeToggle } from '../ModeToggle'
import AccentSwitcher from '../AccentSwitcher'
import { LogoutButton } from '../auth/LogoutButton'

export default function TaskBar() {
    const [currentTime, setCurrentTime] = useState('')
    const { openWindows, minimizeWindow, pinnedApps, isPinned, updateWindow } = useWindowsStore()

    useEffect(() => {
    }, [pinnedApps])

    useEffect(() => {
        const updateTime = () => {
            const now = new Date()
            const timeString = now.toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit'
            })
            setCurrentTime(timeString)
        }

        updateTime()

        const timer = setInterval(updateTime, 1000)

        return () => clearInterval(timer)
    }, [])

    function handleOpenApp(id: string) {
        const appWindow = openWindows.find(w => w.id === id && w.isOpen);

        if (appWindow) {
            if (appWindow.isMinimized) {
                minimizeWindow(id, false);
            } else {
                minimizeWindow(id, true);
            }
        } else {
            const app = pinnedApps.find(app => app.id === id);

            if (app) {
                updateWindow(id, {
                    isOpen: true,
                    isMinimized: false,
                    title: app.name || id,
                    icon: app.icon
                });
            }
        }
    }

    function handleMinimizeWindow(id: string) {
        const window = openWindows.find(w => w.id === id);
        if (window) {
            if (window.isMinimized) {
                minimizeWindow(id, false);
            } else {
                minimizeWindow(id, true);
            }
        }
    }

    return (
        <>
            <section className='w-full h-14 bg-[#737373]/30 border-t-2 border-white/20 backdrop-blur-xs flex items-center justify-between px-4'>
                <section className='task__void justify-start w-[250px]'></section>
                <section className='task__container'>
                    <div className="flex-1 mx-4 flex items-center space-x-1">
                        {pinnedApps.map((app) => {
                            const openWindow = openWindows.find(w => w.id === app.id && w.isOpen);
                            const isActive = !!openWindow && !openWindow.isMinimized;
                            const isMinimized = !!openWindow && openWindow.isMinimized;

                            return (
                                <DesktopIconTaskbar key={app.id} id={app.id} name={app.name} icon={app.icon} pinned={true} isActive={isActive} isMinimized={isMinimized} onClick={() => handleOpenApp(app.id)} />
                            );
                        })}

                        {openWindows.filter(window => window.isOpen && !isPinned(window.id)).map((window) => (
                            <DesktopIconTaskbar key={window.id} id={window.id} name={window.title} icon={window.icon} isActive={!window.isMinimized} isMinimized={window.isMinimized} onClick={() => handleMinimizeWindow(window.id)} />
                        ))}
                    </div>
                </section>
                <section className='task__controls flex items-center justify-end gap-4 w-[250px]'>
                    <section className='task__controls__left flex items-center gap-2'>
                        {/* <ChevronUp size={18} /> */}
                       <LogoutButton/>
                        <AccentSwitcher />
                        <ModeToggle />
                        {/* <Volume2 size={18} /> */}
                        {/* <Wifi size={18} /> */}
                    </section>
                    <section className='task__clock flex flex-col items-center justify-center  select-none'>
                        <div className='task__clock__time flex gap-2 text-sm'>
                            <p>{currentTime}</p>
                        </div>
                        <div className='task__clock__date text-xs'>
                            <p>{new Date().toLocaleDateString('fr-FR')}</p>
                        </div>
                    </section>
                </section>
            </section>
        </>
    )
}
