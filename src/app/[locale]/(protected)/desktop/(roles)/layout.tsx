'use client'

import Container from "@/components/commun/container"
import { AppSidebar } from "@/components/dashboard/AppSidebar"
import MobileSlidePanel from "@/components/sidebar/MobileSlidePanel"
import { RoleGuard } from "@/components/provider/RoleGuard"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import { useAgent } from "@/hooks/use-agent"
import { navMain, navFounder, navEmissary, navArchitect, navOracle, navEcho } from "@/types/sidebarInfo"
import NavUtils from "@/components/dashboard/sidebar-component/nav-utils"

export default function RolesLayout({ children }: { children: React.ReactNode }) {
    const isMobile = useMediaQuery('(max-width: 768px)')
    const { isFounder, isLoading } = useAgent()

    // Récupérer les fonctions de check des rôles
    const agent = useAgent()

    return (
        <RoleGuard>
            {isMobile ? (
                <MobileSlidePanel
                    navItems={navMain}
                    roleChecks={[
                        { items: navFounder, check: () => ({ isAuthorized: agent.isFounder, isLoading: agent.isLoading }) },
                        { items: navEmissary, check: () => ({ isAuthorized: agent.roles.includes('EMISSARY'), isLoading: agent.isLoading }) },
                        { items: navArchitect, check: () => ({ isAuthorized: agent.roles.includes('ARCHITECT'), isLoading: agent.isLoading }) },
                        { items: navOracle, check: () => ({ isAuthorized: agent.roles.includes('ORACLE'), isLoading: agent.isLoading }) },
                        { items: navEcho, check: () => ({ isAuthorized: agent.roles.includes('ECHO'), isLoading: agent.isLoading }) },
                    ]}
                    footerContent={<NavUtils />}
                >
                    <div className="h-full w-full p-4 overflow-auto">
                        <div className="bg-[var(--black-5)] rounded-md border-1 border-[var(--black-4)] p-4 min-h-full">
                            {children}
                        </div>
                    </div>
                </MobileSlidePanel>
            ) : (
                <Container height="screen" width="full" justify="between" items="start" className="flex-col md:flex-row gap-5">
                    <AppSidebar />
                    <section className="flex-1 overflow-hidden w-full h-screen p-4 transition-all">
                        <div className="p-4 bg-[var(--black-5)] rounded-md border-1 border-[var(--black-4)] gap-4 h-full overflow-auto">
                            {children}
                        </div>
                    </section>
                </Container>
            )}
        </RoleGuard>
    )
}

