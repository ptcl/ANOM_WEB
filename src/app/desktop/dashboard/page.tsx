'use client'

import { useEffect, useState } from 'react'
import { useCompleteDashboard, useCompleteAuth } from '@/hooks/useOptimizedData'

export default function DashboardPage() {
    // ✅ UTILISATION DU HOOK OPTIMISÉ - Récupère seulement les données nécessaires au dashboard
    const { profile, authData, isLoading, error, refetch } = useCompleteDashboard()
    
    // ✅ DIAGNOSTIC AUTH - Vérification complète de l'authentification
    const { 
        isAuthenticated, 
        hasToken, 
        isFullyAuthenticated, 
        verifyToken,
        tokenVerification 
    } = useCompleteAuth()
    
    const [mounted, setMounted] = useState(false)
    const [lastRefresh, setLastRefresh] = useState<Date | null>(null)
    const [authDebug, setAuthDebug] = useState<{
        token: string
        tokenLength: number
        hasToken: boolean
        isAuthenticated: boolean
        isFullyAuthenticated: boolean
        authDataExists: boolean
        authDataAuthenticated: boolean
        tokenVerificationData: unknown
    } | null>(null)


    // Montage du composant
    useEffect(() => {
        setMounted(true)
    }, [])

    // ✅ DIAGNOSTIC AUTH - Collecter les informations d'authentification (sans verifyToken dans les deps)
    useEffect(() => {
        if (mounted) {
            const token = typeof window !== 'undefined' ? sessionStorage.getItem('temp_auth_token') : null
            setAuthDebug({
                token: token ? `${token.substring(0, 20)}...` : 'ABSENT',
                tokenLength: token?.length || 0,
                hasToken,
                isAuthenticated,
                isFullyAuthenticated,
                authDataExists: !!authData,
                authDataAuthenticated: authData?.isAuthenticated,
                tokenVerificationData: tokenVerification.verificationData
            })
        }
    }, [mounted, hasToken, isAuthenticated, isFullyAuthenticated, authData, tokenVerification.verificationData])

    // ✅ Pas d'auto-vérification pour éviter les boucles infinies
    // L'utilisateur peut cliquer sur "Vérifier le token" manuellement

    // Fonction pour forcer le rafraîchissement
    const handleRefresh = async () => {
        setLastRefresh(new Date())
        await refetch()
    }

    // ✅ DIAGNOSTIC VISIBLE - Afficher les informations de debug
    if (!mounted) return <div>Chargement...</div>
    
    if (!hasToken) {
        return (
            <div style={{ padding: '20px', border: '2px solid red', margin: '20px' }}>
                <h2>🚨 PROBLÈME D&apos;AUTHENTIFICATION</h2>
                <p><strong>Token absent :</strong> Aucun token trouvé dans sessionStorage</p>
                <button onClick={() => window.location.href = '/identity/bungie'}>
                    Se connecter
                </button>
                <pre style={{ background: '#', padding: '10px', marginTop: '10px' }}>
                    {JSON.stringify(authDebug, null, 2)}
                </pre>
            </div>
        )
    }
    
    if (isLoading) return <div>Récupération des données...</div>
    if (error) return <div>Erreur: {error}</div>
    
    if (!isAuthenticated || !authData?.isAuthenticated) {
        return (
            <div style={{ padding: '20px', border: '2px solid orange', margin: '20px' }}>
                <h2>⚠️ TOKEN PRÉSENT MAIS INVALIDE</h2>
                <p><strong>Problème :</strong> Token détecté mais authentification échouée</p>
                <button onClick={verifyToken}>Vérifier le token</button>
                <button onClick={() => {
                    sessionStorage.removeItem('temp_auth_token')
                    window.location.reload()
                }}>
                    Supprimer le token et recommencer
                </button>
                <pre style={{ background: '', padding: '10px', marginTop: '10px' }}>
                    {JSON.stringify(authDebug, null, 2)}
                </pre>
            </div>
        )
    }
    
    if (!profile) return <div>Pas de profil agent</div>

    // Dashboard
    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Dashboard Agent</h1>
            
            {/* Bouton de test pour vérifier la synchronisation du store */}
            <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '', borderRadius: '8px' }}>
                <h3>🔄 Test de synchronisation du store</h3>
                <button 
                    onClick={handleRefresh}
                    style={{ 
                        padding: '8px 16px', 
                        backgroundColor: '#007acc', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px', 
                        cursor: 'pointer',
                        marginRight: '10px'
                    }}
                >
                    Rafraîchir les données
                </button>
                <span>Dernière mise à jour: {lastRefresh ? lastRefresh.toLocaleTimeString() : 'Jamais'}</span>
                <p style={{ fontSize: '12px', margin: '5px 0 0 0' }}>
                    Ce bouton teste si le store Zustand fonctionne correctement dans l&apos;iframe
                </p>
                <div style={{ fontSize: '12px', marginTop: '10px' }}>
                    <p><strong>État des données optimisées:</strong></p>
                    <p>✅ Authentifié (local): {authData?.isAuthenticated ? 'Oui' : 'Non'}</p>
                    <p>✅ Authentifié (complet): {isFullyAuthenticated ? 'Oui' : 'Non'}</p>
                    <p>� Chargement: {isLoading ? 'Oui' : 'Non'}</p>
                    <p>👤 Profil présent: {profile ? 'Oui' : 'Non'}</p>
                    <p>🔑 Token présent: {hasToken ? 'Oui' : 'Non'}</p>
                    <p>� Vérification token: {tokenVerification.verificationData?.isValid ? '✅ Valide' : '❌ Invalide'}</p>
                </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <h2>Informations Agent</h2>
                <p><strong>Nom d&apos;agent:</strong> {profile?.agentName || 'Non défini'}</p>
                <p><strong>Nom personnalisé:</strong> {profile?.customName || 'Non défini'}</p>
                <p><strong>Espèce:</strong> {profile?.species || 'Non définie'}</p>
                <p><strong>Rôle:</strong> {profile?.role || 'Non défini'}</p>
                <p><strong>Niveau d&apos;autorisation:</strong> {profile?.clearanceLevel || 'Non défini'}</p>
                <p><strong>Groupe:</strong> {profile?.group || 'Non défini'}</p>
                <p><strong>Recrutement vu:</strong> {authData?.hasSeenRecruitment ? '✅ Oui' : '❌ Non'}</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <h2>🔍 Diagnostic d&apos;Authentification</h2>
                <div style={{ backgroundColor: '#f0f8ff', padding: '15px', borderRadius: '8px', border: '1px solid #add8e6' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div>
                            <p><strong>Token présent:</strong> {hasToken ? '✅ Oui' : '❌ Non'}</p>
                            <p><strong>Auth locale:</strong> {isAuthenticated ? '✅ Oui' : '❌ Non'}</p>
                            <p><strong>Auth complète:</strong> {isFullyAuthenticated ? '✅ Oui' : '❌ Non'}</p>
                            <p><strong>Vérification token:</strong> {tokenVerification.verificationData?.isValid ? '✅ Valide' : '❌ Invalide/Non vérifié'}</p>
                        </div>
                        <div>
                            <p><strong>Profile chargé:</strong> {profile ? '✅ Oui' : '❌ Non'}</p>
                            <p><strong>Auth data:</strong> {authData ? '✅ Présent' : '❌ Absent'}</p>
                            <button 
                                onClick={verifyToken}
                                style={{ padding: '5px 10px', marginTop: '10px' }}
                            >
                                🔄 Vérifier le token
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <h2>📊 Données Disponibles (Dashboard Optimisé)</h2>
                <div style={{ backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '8px' }}>
                    <p><strong>✅ Profil agent:</strong> {profile ? 'Chargé' : 'Non chargé'}</p>
                    <p><strong>✅ Authentification:</strong> {authData?.isAuthenticated ? 'Validée' : 'Non validée'}</p>
                    <p><strong>❌ Données Bungie:</strong> Supprimées du dashboard optimisé</p>
                    <p><strong>❌ Destiny Memberships:</strong> Supprimés du dashboard optimisé</p>
                    <p><em>Note: Pour accéder aux données Bungie/Destiny, utilisez useAuth() complet</em></p>
                </div>
            </div>

            {/* Note: Les paramètres Protocol nécessitent des données étendues non disponibles avec le système optimisé */}
            {/* Pour accéder aux paramètres, utilisez useUserStore().agent si nécessaire */}

            <div style={{ marginBottom: '20px' }}>
                <h2>🔑 Debug Complet</h2>
                <div style={{ backgroundColor: '#f8f8f8', padding: '15px', borderRadius: '8px', border: '1px solid #ddd' }}>
                    <pre style={{ fontSize: '11px', overflow: 'auto', maxHeight: '200px' }}>
                        {JSON.stringify(authDebug, null, 2)}
                    </pre>
                </div>
            </div>

            <div>
                <h2>🎮 Actions</h2>
                <button
                    onClick={handleRefresh}
                    style={{ marginRight: '10px', padding: '8px 16px' }}
                >
                    Recharger
                </button>
                <button
                    onClick={() => {
                        const token = sessionStorage.getItem('temp_auth_token')
                        if (token) {
                            navigator.clipboard.writeText(token)
                            alert('Token copié dans le presse-papier !')
                        } else {
                            alert('Aucun token trouvé')
                        }
                    }}
                    style={{ marginRight: '10px', padding: '8px 16px', backgroundColor: '#4CAF50', color: 'white' }}
                >
                    📋 Copier Token
                </button>
                <button
                    onClick={() => {
                        const token = sessionStorage.getItem('temp_auth_token')
                        console.log('🔑 TOKEN POUR API:', token)
                        console.log('📡 URL API:', process.env.NEXT_PUBLIC_API_URL)
                        console.log('🧪 Exemple curl:')
                        console.log(`curl -H "Authorization: Bearer ${token}" -H "ngrok-skip-browser-warning: true" ${process.env.NEXT_PUBLIC_API_URL}/api/protocol/agent/profile`)
                    }}
                    style={{ marginRight: '10px', padding: '8px 16px', backgroundColor: '#2196F3', color: 'white' }}
                >
                    🔍 Afficher Token (Console)
                </button>
                <button
                    onClick={() => {
                        // ✅ Redirection immédiate + nettoyage session
                        sessionStorage.removeItem('temp_auth_token')
                        localStorage.removeItem('simple-user-data')
                        window.location.href = '/'
                    }}
                    style={{ padding: '8px 16px', backgroundColor: '#f44336', color: 'white' }}
                >
                    🚪 Déconnexion
                </button>
            </div>

            {/* Note: Avec le système optimisé, les contrats, défis et autres données étendues */}
            {/* nécessitent des hooks spécifiques ou l'ancien système useUserStore si nécessaire */}
            
            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0f8ff', borderRadius: '8px' }}>
                <h3>💡 Dashboard Optimisé</h3>
                <p>Ce dashboard utilise maintenant des requêtes optimisées :</p>
                <ul>
                    <li>✅ <strong>Profil agent</strong> : Informations de base seulement</li>
                    <li>✅ <strong>Données Bungie</strong> : Toutes les informations utilisateur</li>
                    <li>✅ <strong>Destiny Memberships</strong> : Comptes liés</li>
                    <li>✅ <strong>Authentification</strong> : Status et permissions</li>
                </ul>
                <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
                    Pour des données étendues (contrats, défis, tokens), utilisez des hooks spécifiques ou l&apos;ancien système si nécessaire.
                </p>
            </div>
        </div>
    )
}