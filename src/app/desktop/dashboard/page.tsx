'use client'

import { useState, useEffect } from 'react'
import { useDashboard } from '@/hooks/useDashboard'

export default function DashboardPage() {
    const { profile, isLoading, error, reload } = useDashboard()
    const [lastRefresh, setLastRefresh] = useState<Date | null>(null)
    const [isHydrated, setIsHydrated] = useState(false)
    const [token, setToken] = useState<string | null>(null)

    // Gestion de l'hydratation pour éviter les erreurs SSR/Client
    useEffect(() => {
        setIsHydrated(true)
        setToken(sessionStorage.getItem('temp_auth_token'))
    }, [])

    const handleRefresh = async () => {
        setLastRefresh(new Date())
        await reload()
    }

    // Attendre l'hydratation avant de vérifier le token
    if (!isHydrated) {
        return <div style={{ padding: '20px' }}>⚡ Initialisation...</div>
    }
    
    if (!token) {
        return (
            <div style={{ padding: '20px', border: '2px solid red', margin: '20px' }}>
                <h2>🚨 PAS DE TOKEN</h2>
                                <p>Vous devez vous connecter d&apos;abord</p>
                <button onClick={() => window.location.href = '/identity/bungie'}>
                    Se connecter
                </button>
            </div>
        )
    }

    if (isLoading) {
        return <div style={{ padding: '20px' }}>🔄 Chargement du profil agent...</div>
    }

    if (error) {
        return (
            <div style={{ padding: '20px', border: '2px solid red', margin: '20px' }}>
                <h2>❌ ERREUR</h2>
                <p><strong>Erreur:</strong> {error}</p>
                <button onClick={handleRefresh}>🔄 Réessayer</button>
            </div>
        )
    }

    // Debug limité pour éviter les logs multiples
    if (profile && !profile._id) {
        console.log('🔍 Profil incomplet détecté')
    }

    if (!profile) {
        return (
            <div style={{ padding: '20px', border: '2px solid orange', margin: '20px' }}>
                <h2>❓ PAS DE PROFIL</h2>
                <p>Aucun profil trouvé</p>
                <p><strong>Debug:</strong> profile = {JSON.stringify(profile)}</p>
                <button onClick={handleRefresh}>🔄 Recharger</button>
                <button onClick={() => console.log('🐛 Profile complet:', profile)}>
                    🔍 Debug console
                </button>
            </div>
        )
    }

    // 🎉 SUCCESS - Affichage du dashboard
    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>✅ Dashboard Agent</h1>
            
            <div style={{ marginBottom: '20px', padding: '15px', borderRadius: '8px' }}>
                <h2>👤 Profil Agent</h2>
                <p><strong>Nom d&apos;agent:</strong> {profile.protocol?.agentName || 'Non défini'}</p>
                <p><strong>Nom personnalisé:</strong> {profile.protocol?.customName || 'Non défini'}</p>
                <p><strong>Espèce:</strong> {profile.protocol?.species || 'Non définie'}</p>
                <p><strong>Rôle:</strong> {profile.protocol?.role || 'Non défini'}</p>
                <p><strong>Niveau d&apos;autorisation:</strong> {profile.protocol?.clearanceLevel || 'Non défini'}</p>
                <p><strong>Groupe:</strong> {profile.protocol?.group || 'Non défini'}</p>
                <p><strong>Recrutement vu:</strong> {profile.protocol?.hasSeenRecruitment ? '✅ Oui' : '❌ Non'}</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <button 
                    onClick={handleRefresh}
                    style={{ 
                        padding: '10px 20px', 
                        backgroundColor: '#007acc', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px', 
                        cursor: 'pointer',
                        marginRight: '10px'
                    }}
                >
                    🔄 Recharger
                </button>
                <span style={{ fontSize: '12px' }}>
                    Dernière mise à jour: {lastRefresh ? lastRefresh.toLocaleTimeString() : 'Jamais'}
                </span>
            </div>

            <div style={{ marginTop: '20px', padding: '10px', borderRadius: '4px' }}>
                <h3>🐛 Debug</h3>
                <p style={{ fontSize: '12px', fontFamily: 'monospace' }}>
                    Token: {token ? `${token.substring(0, 20)}...` : 'Absent'}
                </p>
                <button 
                    onClick={() => console.log('🔍 Debug profil:', profile)}
                    style={{ padding: '5px 10px', fontSize: '12px' }}
                >
                    📊 Voir profil dans console
                </button>
            </div>
        </div>
    )
}