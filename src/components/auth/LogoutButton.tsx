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
import { useAuthentication } from '@/hooks/useAuthentication'

interface LogoutButtonProps {
    variant?: 'default' | 'outline' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    children?: React.ReactNode
    className?: string
}

export const LogoutButton = ({ variant = 'outline', children, className }: LogoutButtonProps) => {
    // ✅ OPTIMISÉ: Hook dédié ultra-rapide pour la déconnexion
    const { logout } = useAuthentication()

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
    const { logout } = useAuthentication()
    
    const logoutWithConfirm = (redirectTo?: string) => {
        if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
            logout(redirectTo)
        }
    }

    const handleLogout = () => {
        // ✅ SIMPLE: Confirmation + déconnexion en une seule fonction
        logoutWithConfirm('/')
    }

    return (
        <Button onClick={handleLogout} variant={variant} className={className}>
            {children || 'Se déconnecter'}
        </Button>
    )
}