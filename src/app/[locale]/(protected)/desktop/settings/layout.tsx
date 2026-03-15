'use client'

import Container from "@/components/commun/container"
import SettingBreadcrumb from "@/components/setting/SettingBreadcrumb"
import MobileSlidePanel from "@/components/sidebar/MobileSlidePanel"
import { SettingSidebar } from "@/components/setting/SettingSidebar"
import { navSettings } from "@/types/sidebarInfo"
import { useEffect, useState } from "react"

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }

        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    useEffect(() => {
        const listener = (event: MessageEvent) => {
            if (event.origin !== window.location.origin) return
            if (event.data?.type === 'AUTH_TOKEN' && event.data.token) {
                localStorage.setItem('protocol_token', event.data.token)
            }
        }
        window.addEventListener('message', listener)
        return () => window.removeEventListener('message', listener)
    }, [])

    return (
        <Container height="screen" width="full" justify="between" items="start" className="flex-col md:flex-row gap-5">
            {isMobile ? (
                <MobileSlidePanel navItems={navSettings}>
                    <div className="h-full w-full p-4 overflow-auto">
                        <div className="bg-[var(--black-5)] rounded-md border-1 border-[var(--black-4)] p-4 min-h-full">
                            <SettingBreadcrumb />
                            {children}
                        </div>
                    </div>
                </MobileSlidePanel>
            ) : (
                <Container height="screen" width="full" justify="between" items="start" className="flex-col md:flex-row gap-5">
                    <SettingSidebar />
                    <section className="flex-1 overflow-hidden w-full h-screen p-4 transition-all">
                        <div className="p-4 bg-[var(--black-5)] rounded-md border-1 border-[var(--black-4)] gap-4 h-full overflow-auto">
                            <SettingBreadcrumb />
                            {children}
                        </div>
                    </section>
                </Container>
            )}
        </Container>
    )
}
