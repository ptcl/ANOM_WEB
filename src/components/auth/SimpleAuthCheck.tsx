'use client'

import { useMinimalAuth } from '@/hooks/useOptimizedData'

export default function SimpleAuthCheck() {
    // ✅ OPTIMISÉ: Récupère seulement le statut d'authentification (pas toutes les données agent)
    const { authData, isLoading, error } = useMinimalAuth()

    if (isLoading) return <div>Vérification auth...</div>
    if (error) return <div>Erreur auth: {error}</div>
    if (!authData?.isAuthenticated) return <div>Non connecté</div>

    return (
        <div style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h4>🔐 Statut d&apos;authentification</h4>
            <p>✅ Connecté</p>
            <p>📋 Permissions: {authData.permissions.length}</p>
            <p>👁️ Recrutement vu: {authData.hasSeenRecruitment ? 'Oui' : 'Non'}</p>
            
            <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
                💡 Ce composant utilise <code>useMinimalAuth()</code> - seulement 1 requête légère !
            </div>
        </div>
    )
}