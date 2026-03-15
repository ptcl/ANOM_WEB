'use client'

import Container from "@/components/commun/container"
import { AppSidebar } from "@/components/dashboard/AppSidebar"
import MobileSlidePanel from "@/components/dashboard/MobileSlidePanel"
import { useMediaQuery } from "@/hooks/useMediaQuery"

export default function DashboardLayout({ children, }: { children: React.ReactNode }) {
    const isMobile = useMediaQuery('(max-width: 768px)')

    // Version mobile avec slide panel
    if (isMobile) {
        return (
            <MobileSlidePanel>
                <div className="h-full w-full p-4 overflow-auto">
                    <div className="bg-[var(--black-5)] rounded-md border-1 border-[var(--black-4)] p-4 min-h-full">
                        {children}
                    </div>
                </div>
            </MobileSlidePanel>
        )
    }

    return (
        <Container height="screen" width="full" justify="between" items="start" className="flex-col md:flex-row gap-5">
            <AppSidebar />
            <section className="flex-1 overflow-hidden w-full h-screen p-4 transition-all">
                <div className="p-4 bg-[var(--black-5)] rounded-md border-1 border-[var(--black-4)] gap-4 h-full overflow-auto">
                    {children}
                </div>
            </section>
        </Container>
    )
}
