'use client'

import { useAuthentication } from '@/hooks/useAuthentication'

export default function SimpleAuthCheck() {
    // ✅ SIMPLIFIÉ: Vérification auth basique avec nouveau hook
    const { isAuthenticated, isLoading, token } = useAuthentication()

    if (isLoading) return <div>Vérification auth...</div>
    if (!isAuthenticated) return <div>Non connecté</div>

    return (
        <div style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h4>🔐 Statut d&apos;authentification</h4>
            <p>✅ Connecté</p>
            <p>� Token: {token ? 'Présent' : 'Absent'}</p>
            
            <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
                💡 Ce composant utilise <code>useMinimalAuth()</code> - seulement 1 requête légère !
            </div>
        </div>
    )
}