"use client";
import TaskBar from '@/components/desktop/TaskBar';
import { DragProvider } from '@/components/provider/DragProvider';
import { ResizeProvider } from '@/components/provider/ResizeProvider';
import { usePathname } from 'next/navigation'
import React from 'react'

import { ReactNode } from 'react';

export default function DesktopLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname()

    if (pathname === '/desktop/dashboard') {
        return children
    }
    return (
        <ResizeProvider>
            <DragProvider>
                <div className='desktop flex flex-col h-screen'>
                    {children}
                    <TaskBar />
                    <div className='background__os' />
                </div>
            </DragProvider>
        </ResizeProvider>
    )
}
