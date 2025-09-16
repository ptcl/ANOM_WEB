/**
 * 🚀 Hook de déconnexion optimisé
 * 
 * Optimisations:
 * - Nettoyage complet et immédiat des tokens
 * - Redirection directe sans router Next.js (plus rapide)
 * - Invalidation des caches si nécessaire
 * - Gestion des erreurs locale
 */
'use client'

export function useLogout() {
    const logout = (redirectTo: string = '/') => {
        try {
            console.log('🚪 Début de la déconnexion...')

            // 1. ✅ Nettoyer TOUS les tokens et données
            sessionStorage.removeItem('temp_auth_token')
            localStorage.removeItem('simple-user-data')
            localStorage.removeItem('bungie_auth_state') // State OAuth si présent
            
            // 2. ✅ Nettoyer d'autres données potentielles (si vous en avez)
            // localStorage.removeItem('user-preferences')
            // sessionStorage.clear() // Si vous voulez tout nettoyer

            console.log('✅ Tokens nettoyés')

            // 3. ✅ Redirection IMMÉDIATE (plus rapide que router.push)
            window.location.href = redirectTo
            
            console.log('✅ Redirection vers:', redirectTo)

        } catch (error) {
            console.error('❌ Erreur lors de la déconnexion:', error)
            
            // 4. ✅ Fallback: Forcer la redirection même en cas d'erreur
            window.location.href = redirectTo
        }
    }

    const logoutWithConfirm = (message: string = 'Êtes-vous sûr de vouloir vous déconnecter ?', redirectTo: string = '/') => {
        const confirmed = window.confirm(message)
        
        if (confirmed) {
            logout(redirectTo)
            return true
        }
        
        return false
    }

    return {
        logout,
        logoutWithConfirm,
        // Utilitaires bonus
        clearTokensOnly: () => {
            sessionStorage.removeItem('temp_auth_token')
            localStorage.removeItem('simple-user-data')
        },
        isLoggedIn: () => !!sessionStorage.getItem('temp_auth_token')
    }
}