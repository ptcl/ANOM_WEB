'use client'

import { useMemo } from 'react'
import * as LucideIcons from 'lucide-react'
import Image from 'next/image'

interface DynamicIconProps {
    icon: string | undefined | null
    alt?: string
    size?: number
    className?: string
    color?: string
}

/**
 * Composant qui affiche dynamiquement soit une icône Lucide (par nom) soit une image (par URL)
 * 
 * @param icon - Nom de l'icône Lucide (ex: "Shield") ou URL d'image (ex: "/img/icon.png" ou "https://...")
 * @param alt - Texte alternatif pour l'image
 * @param size - Taille de l'icône en pixels (défaut: 24)
 * @param className - Classes CSS additionnelles
 * @param color - Couleur de l'icône Lucide (défaut: currentColor)
 */
export function DynamicIcon({ icon, alt = 'icon', size = 24, className = '', color }: DynamicIconProps) {
    // Détermine si c'est une URL (image) ou un nom d'icône Lucide
    const isUrl = useMemo(() => {
        if (!icon) return false
        return icon.startsWith('/') || icon.startsWith('http://') || icon.startsWith('https://') || icon.includes('.')
    }, [icon])

    // Récupère le composant Lucide si c'est un nom d'icône
    const LucideIcon = useMemo(() => {
        if (!icon || isUrl) return null

        // Convertir le nom en PascalCase si nécessaire
        const iconName = icon.charAt(0).toUpperCase() + icon.slice(1)

        // Chercher l'icône dans lucide-react
        const icons = LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string; color?: string }>>
        const IconComponent = icons[iconName]

        return IconComponent || null
    }, [icon, isUrl])

    if (!icon) return null

    // Si c'est une URL, afficher une image
    if (isUrl) {
        return (
            <Image
                src={icon}
                alt={alt}
                width={size}
                height={size}
                className={className}
            />
        )
    }

    // Si c'est une icône Lucide valide
    if (LucideIcon) {
        return <LucideIcon size={size} className={className} color={color} />
    }

    // Fallback: aucune icône trouvée
    return null
}

export default DynamicIcon
