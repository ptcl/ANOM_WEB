"use client"
import { SidebarMenuButton, useSidebar } from '@/components/ui/sidebar'
import { Link } from '@/i18n/navigation';
import { ArrowLeftToLine, LifeBuoyIcon, Megaphone, PanelLeftIcon, Send } from 'lucide-react'
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react'

export default function NavUtils() {
    const t = useTranslations();
    const { toggleSidebar } = useSidebar()
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }

        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])


    return (
        <>
            <SidebarMenuButton>
                <Megaphone />
                {t('protocol.announcements.title')}
            </SidebarMenuButton>
            <SidebarMenuButton>
                <LifeBuoyIcon />
                {t('commun.buttons.support')}
            </SidebarMenuButton>
            <SidebarMenuButton>
                <Send />
                {t('commun.buttons.feedback')}
            </SidebarMenuButton>
            <Link href={"/desktop"} className='flex items-center gap-2'>
                <SidebarMenuButton >
                    <ArrowLeftToLine />
                    <span className='inline'>
                        {t('commun.buttons.backToDesktop')}
                    </span>
                </SidebarMenuButton>
            </Link>
            {
                isMobile ? null :
                    <SidebarMenuButton onClick={toggleSidebar} >
                        <PanelLeftIcon />
                        <span className='inline'>
                            Toggle Sidebar
                        </span>
                    </SidebarMenuButton>
            }

        </>
    )
}