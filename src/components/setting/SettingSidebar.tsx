"use client"

import * as React from "react"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"
import { navSettings } from "@/types/sidebarInfo"
import { NavUser } from "@/components/sidebar/nav-user"
import { NavCollapsibleSection } from "@/components/sidebar/NavCollapsibleSection"



export function SettingSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

    return (
        <Sidebar collapsible="icon" {...props} variant="inset">
            <SidebarHeader>
                <NavUser />
            </SidebarHeader>
            <SidebarContent>
                <NavCollapsibleSection items={navSettings} />
            </SidebarContent>
            <SidebarFooter>
                {/* <NavUtils /> */}
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
