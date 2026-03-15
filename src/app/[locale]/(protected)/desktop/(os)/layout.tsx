"use client";
import TaskBar from '@/components/desktop/ui/TaskBar';
import React, { useEffect, useState } from 'react'
import Image from 'next/image'

import { ReactNode } from 'react';
import Container from '@/components/commun/container';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

export default function DesktopLayout({ children }: { children: ReactNode }) {
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
        <Container height='screen' width='full' className='relative' overflow >
            <div className='relative z-10 w-full h-full'>
                {children}
            </div>
            <Image src="/img/wallpaper_desktop.png" alt="Anom Icon" width={1920} height={1080} quality={100} className='absolute w-full h-full user-event-none object-cover ' />
            <TaskBar />
        </Container>

    )
}
