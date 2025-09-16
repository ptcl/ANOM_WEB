/**
 * 🚀 OPTIMISÉ: LogoutButton ultra-rapide
 * 
 * Optimisations appliquées:
 * - ❌ Pas de useAuth() lourd (économie de ressources)
 * - ❌ Pas de router.push() + setTimeout (plus de race conditions)
 * - ✅ Redirection directe window.location.href (plus rapide)
 * - ✅ Nettoyage immédiat et complet des tokens
 * - ✅ Hook dédié useLogout() optimisé
 * 
 * Résultat: Déconnexion instantanée, 0 délai, plus fiable
 */
'use client'

import { Button } from '@/components/ui/button'
import { useLogout } from '@/hooks/useLogout'

interface LogoutButtonProps {
    variant?: 'default' | 'outline' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    children?: React.ReactNode
    className?: string
}

export const LogoutButton = ({ variant = 'outline', children, className }: LogoutButtonProps) => {
    // ✅ OPTIMISÉ: Hook dédié ultra-rapide pour la déconnexion
    const { logout } = useLogout()

    const handleLogout = () => {
        // ✅ IMMÉDIAT: Nettoyage + redirection instantanée (plus de setTimeout!)
        logout('/')
    }

    return (
        <Button
            onClick={handleLogout}
            variant={variant}
            className={className}
        >
            {children || 'Se déconnecter'}
        </Button>
    )
}

export const LogoutButtonWithConfirm = ({ variant = 'outline', children, className }: LogoutButtonProps) => {
    // ✅ OPTIMISÉ: Hook dédié avec confirmation intégrée
    const { logoutWithConfirm } = useLogout()

    const handleLogout = () => {
        // ✅ SIMPLE: Confirmation + déconnexion en une seule fonction
        logoutWithConfirm('Êtes-vous sûr de vouloir vous déconnecter ?', '/')
    }

    return (
        <Button onClick={handleLogout} variant={variant} className={className}>
            {children || 'Se déconnecter'}
        </Button>
    )
}