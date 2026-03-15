'use client'

import React, { useMemo } from "react"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Link, usePathname } from "@/i18n/navigation"
import { navSettings } from "@/types/sidebarInfo"
import { useTranslations } from "next-intl"

export default function SettingBreadcrumb() {
    const pathname = usePathname()
    const t = useTranslations()

    // Générer les éléments du breadcrumb en fonction de l'URL actuelle
    const breadcrumbItems = useMemo(() => {
        const items: { title: string; url: string; isCurrentPage: boolean }[] = []

        // Récupérer tous les items de navigation
        const allItems = navSettings.flatMap(section => section.items || [])

        // D'abord vérifier si l'URL actuelle correspond exactement à une page connue
        const exactMatch = allItems.find(item => pathname === item.url)

        if (exactMatch) {
            // On est sur une page principale (Accueil, Protocol, redeem) → afficher juste le titre
            items.push({
                title: exactMatch.title,
                url: exactMatch.url,
                isCurrentPage: true
            })
        } else {
            // L'URL ne correspond pas exactement à une page connue
            // Chercher la section parente la plus spécifique (en excluant /desktop/settings de base)
            const parentItem = allItems
                .filter(item => item.url !== "/desktop/settings") // Exclure Accueil comme parent potentiel
                .find(item => pathname.startsWith(item.url + '/'))

            if (parentItem) {
                // On est sur une sous-page d'une section (ex: /protocol/autre-page)
                items.push({
                    title: parentItem.title,
                    url: parentItem.url,
                    isCurrentPage: false
                })

                // Extraire le nom de la sous-page depuis l'URL
                const subPagePath = pathname.replace(parentItem.url + '/', '')
                const subPageName = subPagePath.split('/')[0]
                // Capitaliser le nom
                const formattedName = subPageName.charAt(0).toUpperCase() + subPageName.slice(1)

                items.push({
                    title: formattedName,
                    url: pathname,
                    isCurrentPage: true
                })
            } else {
                // Page non trouvée, afficher Accueil par défaut
                items.push({
                    title: "Accueil",
                    url: "/desktop/settings",
                    isCurrentPage: true
                })
            }
        }

        return items
    }, [pathname])

    // Helper pour traduire les titres (si c'est une clé de traduction avec un point)
    const getTitle = (title: string): string => {
        if (title.includes('.')) {
            return t(title)
        }
        return title
    }

    return (
        <Breadcrumb className="sticky -top-5 py-2 z-10 bg-[var(--black-5)] mb-2 h-fit">
            <BreadcrumbList>
                {breadcrumbItems.map((item, index) => (
                    <React.Fragment key={item.url}>
                        {index > 0 && <BreadcrumbSeparator />}
                        <BreadcrumbItem>
                            {item.isCurrentPage ? (
                                <BreadcrumbPage className="flex items-center gap-1.5">
                                    <span className="text-[var(--theme-primary)] font-semibold text-2xl">
                                        {getTitle(item.title)}
                                    </span>
                                </BreadcrumbPage>
                            ) : (
                                <BreadcrumbLink asChild>
                                    <Link href={item.url} className="flex items-center gap-1.5">
                                        <span className="text-[var(--theme-primary)] font-semibold text-xl">
                                            {getTitle(item.title)}
                                        </span>
                                    </Link>
                                </BreadcrumbLink>
                            )}
                        </BreadcrumbItem>
                    </React.Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    )
}

