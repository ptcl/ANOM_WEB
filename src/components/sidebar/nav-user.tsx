"use client"

import { useState } from "react"
import { BadgeCheck, Bell, ChevronsUpDown, CreditCard, LogOut, Sparkles, } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage, } from "@/components/ui/avatar"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar, } from "@/components/ui/sidebar"
import { useLocale, useTranslations } from "next-intl"
import { useAgent } from "@/hooks/use-agent"
import Image from "next/image"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Skeleton } from "@/components/ui/skeleton"
import { DynamicIcon } from "@/components/ui/DynamicIcon"

function BadgeImage({ src, alt }: { src: string; alt: string }) {
    const [isLoading, setIsLoading] = useState(true)

    return (
        <div className="relative w-8 h-8">
            {isLoading && <Skeleton className="absolute inset-0 w-8 h-8 rounded" />}
            <Image src={src} alt={alt} fill sizes="64px" className={`object-contain transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`} onLoad={() => setIsLoading(false)} />
        </div>
    )
}


export function NavUser() {
    const t = useTranslations();
    const locale = useLocale();
    const { agent, isLoading } = useAgent()
    const bungieProfilePicture = agent?.bungieUser?.profilePicturePath
    const bungieImageUrl = bungieProfilePicture ? `https://www.bungie.net${bungieProfilePicture}` : undefined

    if (isLoading) {
        return (
            <div className="flex items-center gap-3 px-3 py-2">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <div className="flex flex-col gap-1">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-16" />
                </div>
            </div>
        )
    }

    if (!agent) return null

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <Dialog>
                    <DialogTrigger asChild className="cursor-pointer">
                        <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage src={bungieImageUrl} alt={agent?.bungieUser?.displayName} />
                                <AvatarFallback className="rounded-lg">{agent?.bungieUser?.displayName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">{agent?.bungieUser?.uniqueName}</span>
                                <span className="truncate text-xs">{t('protocol.profile.clearanceLevel')} {agent?.protocol.clearanceLevel}</span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DialogTrigger>
                    <DialogContent className="w-[430px] h-[500px] rounded flex flex-col " showCloseButton={false} ariaTitle="User Profile">
                        <DialogHeader className="">
                            <section className="flex gap-4 items-start bg-[var(--black-2)] border-[var(--black-4)] border-[1.5px] p-4 rounded mb-4">
                                <Avatar className="h-24 w-24 rounded-full">
                                    <AvatarImage src={bungieImageUrl} alt={agent?.bungieUser?.uniqueName} />
                                    <AvatarFallback>{agent?.bungieUser?.displayName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col gap-0 items-start">
                                    {agent?.protocol.customName ? (
                                        <div className="flex flex-col align-start justify-start">
                                            <div className="flex gap-4 items-center">
                                                <span className="truncate font-medium text-md md:text-2xl">{agent?.protocol.customName}</span>
                                                <div className="flex items-center justify-center text-sm p-1 px-2 rounded ">{agent?.protocol.division?.name}</div>

                                            </div>
                                            <span className="truncate text-xs md:text-lg">{agent?.bungieUser?.uniqueName}</span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col align-start justify-start">
                                            <div className="flex gap-4 items-center">
                                                <span className="truncate font-medium text-md md:text-2xl">{agent?.bungieUser?.uniqueName}</span>
                                                <div className="flex gap-2 items-center justify-center text-sm p-1 px-2 rounded " style={{ backgroundColor: agent?.protocol.division?.color }}>
                                                    {agent?.protocol.division?.icon && (
                                                        <DynamicIcon icon={agent?.protocol.division?.icon} alt={agent?.protocol.division?.name} size={16} />
                                                    )}
                                                    {agent?.protocol.division?.name}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {agent?.protocol.badges.map((b) => {
                                        const badge = b.badgeId
                                        if (!badge || !badge.icon) return null
                                        return (
                                            <Tooltip key={badge.badgeId}>
                                                <TooltipTrigger asChild>
                                                    <BadgeImage src={badge.icon} alt={badge.name} />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{t(badge.name)}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        )
                                    })}
                                </div>
                            </section>
                        </DialogHeader>
                        <section className="flex flex-col gap-4 text-sm font-satoshi h-full">
                            <div className="flex flex-col">
                                <span className="mb-2 uppercase font-medium">{t("protocol.roles.title")}</span>
                                <div className="flex flex-wrap gap-2">
                                    {agent?.protocol.roles.map((role) => {
                                        return (
                                            <span key={role.roleId} className="flex items-center gap-2 px-3 py-1 border-[1.7px] rounded text-xs font-medium transition-all duration-300" style={{ borderColor: role.color || '#6b7280', color: role.color || '#ffffff' }}>
                                                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: role.color || '#6b7280' }} />
                                                <span className="uppercase">{t(`protocol.roles.${role.roleId}`)}</span>
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="mb-2 uppercase font-medium">{t("protocol.bio.title")}</span>
                                <div className="flex flex-wrap gap-2">
                                    {agent?.protocol.bio}
                                </div>
                            </div>
                            <div className="flex flex-col items-start justify-end w-full h-full flex-1">
                                <span className="mb-2 uppercase font-medium">{t("protocol.date.joined")}</span>
                                <span>
                                    {agent?.protocol.protocolJoinedAt ? new Intl.DateTimeFormat(locale, { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(agent.protocol.protocolJoinedAt)) : 'N/A'}
                                </span>
                            </div>
                        </section>
                    </DialogContent>
                </Dialog>
            </SidebarMenuItem>
        </SidebarMenu >
    )
}
