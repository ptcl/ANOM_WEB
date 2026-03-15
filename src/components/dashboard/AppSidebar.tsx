"use client"

import * as React from "react"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"
import { NavCollapsibleSection } from "@/components/sidebar/NavCollapsibleSection"
import NavUtils from "./sidebar-component/nav-utils"
import { navArchitect, navEcho, navEmissary, navFounder, navMain, navOracle } from "@/types/sidebarInfo"
import { useAgent } from "@/hooks/use-agent"
import { NavUser } from "@/components/sidebar/nav-user"


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const agent = useAgent()

    return (
        <Sidebar collapsible="icon" {...props} variant="inset">
            <SidebarHeader>
                <NavUser />
            </SidebarHeader>
            <SidebarContent>
                <NavCollapsibleSection items={navMain} showLabel />
                <NavCollapsibleSection items={navFounder} showLabel roleCheck={() => ({ isAuthorized: agent.isFounder, isLoading: agent.isLoading })} />
                <NavCollapsibleSection items={navEmissary} showLabel roleCheck={() => ({ isAuthorized: agent.isEmissary, isLoading: agent.isLoading })} />
                <NavCollapsibleSection items={navArchitect} showLabel roleCheck={() => ({ isAuthorized: agent.isArchitect, isLoading: agent.isLoading })} />
                <NavCollapsibleSection items={navOracle} showLabel roleCheck={() => ({ isAuthorized: agent.isOracle, isLoading: agent.isLoading })} />
                <NavCollapsibleSection items={navEcho} showLabel roleCheck={() => ({ isAuthorized: agent.isEcho, isLoading: agent.isLoading })} />
            </SidebarContent>
            <SidebarFooter>
                <NavUtils />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
