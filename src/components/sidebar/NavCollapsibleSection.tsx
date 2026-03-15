"use client"

import { type LucideIcon } from "lucide-react"
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"
import { Link, usePathname } from "@/i18n/navigation"
import { useTranslations } from "next-intl"

export type NavItem = {
    title: string  // Can be a translation key (e.g., "navbar.dashboard") or plain text
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
        title: string
        url: string
        icon?: LucideIcon
    }[]
}

export type RoleCheckFunction = () => {
    isAuthorized: boolean
    isLoading: boolean
}

interface NavCollapsibleSectionProps {
    items: NavItem[]
    label?: string                // Custom label for the section
    roleCheck?: RoleCheckFunction // Permission check function
    showLabel?: boolean           // Show section label/header (default: false)
    useTranslation?: boolean      // Use translation for titles (default: true)
}

/**
 * Unified NavCollapsibleSection component
 * 
 * @param items - Navigation items to display
 * @param label - Section label (optional, uses items[0].title if not provided)
 * @param roleCheck - Permission check function
 * @param showLabel - Show section header with label and icon (default: false)
 * @param useTranslation - Translate title keys via next-intl (default: true)
 */
export function NavCollapsibleSection({
    items,
    label,
    roleCheck,
    showLabel = false,
    useTranslation = true
}: NavCollapsibleSectionProps) {
    const t = useTranslations()
    const pathname = usePathname()

    // Role/permission check
    const roleStatus = roleCheck?.()
    const { isAuthorized = true, isLoading = false } = roleStatus ?? {}

    // Don't render if loading, unauthorized, or no items
    if (isLoading || !isAuthorized || items.length === 0) {
        return null
    }

    // Helper to get translated or raw title
    const getTitle = (title: string): string => {
        if (!useTranslation) return title
        // Check if it looks like a translation key (contains a dot)
        if (title.includes('.')) {
            return t(title)
        }
        return title
    }

    // Section label and icon
    const sectionLabel = label || items[0]?.title || "Section"
    const SectionIcon = items[0]?.icon

    return (
        <SidebarGroup>
            {showLabel && (
                <SidebarGroupLabel>
                    {SectionIcon && <SectionIcon className="mr-2 h-4 w-4" />}
                    {getTitle(sectionLabel)}
                </SidebarGroupLabel>
            )}
            <SidebarMenu>
                {items.flatMap((item) =>
                    item.items?.map((subItem) => {
                        const isActive = pathname === subItem.url

                        return (
                            <SidebarMenuItem key={subItem.url}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={isActive}
                                    className={isActive ? "opacity-100" : "opacity-40 hover:opacity-100 transition-opacity"}
                                >
                                    <Link href={subItem.url}>
                                        {subItem.icon && <subItem.icon />}
                                        <span>{getTitle(subItem.title)}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )
                    }) ?? []
                )}
            </SidebarMenu>
        </SidebarGroup>
    )
}
