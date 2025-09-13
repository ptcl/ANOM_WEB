import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axios from 'axios'
import { IAgent } from '@/types/agent'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

interface AgentState {
    isAuthenticated: boolean;
    agent: IAgent | null;
    isLoading: boolean; // ✅ Ajout du loading dans le store

    getProfile: () => Promise<IAgent | null>;
    verifyAuthentication: () => Promise<boolean>;
    refreshAuthentication: () => Promise<boolean>;
    initializeAuth: () => Promise<boolean>; // ✅ Nouvelle méthode unifiée
    logout: () => void;
    setAgent: (agent: IAgent | null) => void;
    updateAgent: (updates: Partial<IAgent>) => void;
    updateSettings: (updates: Partial<IAgent['protocol']['settings']>) => void;
    updateProtocolLocal: (updates: Partial<IAgent['protocol']>) => void;
    updateProtocol: (updates: Partial<IAgent['protocol']>) => Promise<{ success: boolean; error?: string }>;
    getAgentProgress: () => Promise<unknown | null>;
    getAvailableChallenges: () => Promise<unknown | null>;
    getAgentAllContracts: () => Promise<unknown[] | null>;
}

export const useUserStore = create<AgentState>()(
    persist(
        (set, get) => ({
            isAuthenticated: false,
            agent: null,
            isLoading: true, // ✅ État de chargement initial

            // ✅ MÉTHODE PRINCIPALE - À utiliser dans vos pages
            initializeAuth: async () => {
                try {
                    // console.log('🚀 Initialisation de l\'authentification...');
                    set({ isLoading: true });

                    const tempToken = sessionStorage.getItem('temp_auth_token');

                    if (!tempToken) {
                        // console.log('❌ Pas de token, utilisateur non connecté');
                        set({
                            isAuthenticated: false,
                            agent: null,
                            isLoading: false
                        });
                        return false;
                    }

                    console.log('🔑 Token trouvé, vérification...');
                    console.log(tempToken);
                    // Essai de récupération du profil complet
                    const agent = await get().getProfile();

                    if (agent) {
                        // console.log('✅ Profil récupéré avec succès:', agent.protocol?.agentName);
                        set({
                            isAuthenticated: true,
                            agent,
                            isLoading: false
                        });
                        return true;
                    } else {
                        // Fallback: vérification simple du token
                        console.log('⚠️ Échec récupération profil, vérification token...');
                        const isValid = await get().verifyAuthentication();
                        set({ isLoading: false });
                        return isValid;
                    }

                } catch (error) {
                    console.error('❌ Erreur initialisation auth:', error);
                    set({
                        isAuthenticated: false,
                        agent: null,
                        isLoading: false
                    });
                    return false;
                }
            },

            verifyAuthentication: async () => {
                try {
                    const tempToken = sessionStorage.getItem('temp_auth_token')

                    if (!tempToken) {
                        set({ isAuthenticated: false })
                        return false
                    }

                    console.log('🔍 Vérification du token...');

                    const response = await axios.post(`${API_BASE_URL}/api/identity/verify`,
                        { token: tempToken },
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                'ngrok-skip-browser-warning': 'true'
                            }
                        }
                    )

                    const { success, data } = response.data
                    if (success && data.valid) {
                        console.log('✅ Token valide');
                        set({
                            isAuthenticated: true,
                            agent: data.agent || get().agent // Garde l'agent existant si pas dans la réponse
                        })
                        return true
                    } else {
                        console.log('🔄 Token invalide, tentative de refresh...');
                        return await get().refreshAuthentication()
                    }
                } catch (error) {
                    console.error('❌ Erreur vérification token:', error)
                    set({ isAuthenticated: false })
                    return false
                }
            },

            refreshAuthentication: async () => {
                try {
                    const tempToken = sessionStorage.getItem('temp_auth_token')

                    if (!tempToken) {
                        set({ isAuthenticated: false })
                        return false
                    }

                    console.log('🔄 Refresh du token...');

                    const response = await axios.post(`${API_BASE_URL}/api/identity/refresh`,
                        { token: tempToken },
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                'ngrok-skip-browser-warning': 'true'
                            }
                        }
                    )

                    const { success, data } = response.data

                    if (success) {
                        console.log('✅ Token refreshé');
                        sessionStorage.setItem('temp_auth_token', data.token)

                        set({
                            isAuthenticated: true,
                            agent: data.agent || get().agent
                        })
                        return true
                    } else {
                        console.log('❌ Échec refresh token');
                        set({ isAuthenticated: false })
                        return false
                    }
                } catch (error) {
                    console.error('❌ Erreur refresh token:', error)
                    set({ isAuthenticated: false })
                    return false
                }
            },

            getProfile: async () => {
                try {
                    const tempToken = sessionStorage.getItem('temp_auth_token')
                    if (!tempToken) {
                        console.log('❌ getProfile: Pas de token');
                        return null;
                    }

                    console.log('📡 Récupération du profil...');

                    const response = await axios.get(`${API_BASE_URL}/api/protocol/agent/profile`, {
                        headers: {
                            'Authorization': `Bearer ${tempToken}`,
                            'Content-Type': 'application/json',
                            'ngrok-skip-browser-warning': 'true'
                        }
                    })

                    console.log('📥 Réponse getProfile:', response.status, response.data);

                    const { success, data } = response.data

                    if (success && data?.agent) {
                        console.log('✅ Profil récupéré:', data.agent.protocol?.agentName);
                        set({ agent: data.agent })
                        return data.agent
                    } else {
                        console.log('⚠️ Réponse sans agent valide:', { success, hasData: !!data, hasAgent: !!data?.agent });
                        return null
                    }
                } catch (error) {
                    console.error('❌ Erreur getProfile:', error)

                    if (axios.isAxiosError(error)) {
                        console.error('📊 Détails erreur API:', {
                            status: error.response?.status,
                            statusText: error.response?.statusText,
                            data: error.response?.data
                        });
                    }

                    return null
                }
            },

            logout: () => {
                console.log('👋 Déconnexion...');
                sessionStorage.removeItem('temp_auth_token')

                set({
                    isAuthenticated: false,
                    agent: null,
                    isLoading: false
                })
            },

            setAgent: (agent) => {
                console.log('📝 setAgent:', agent?.protocol?.agentName);
                set({ agent });
            },

            updateAgent: async (updates: Partial<IAgent['protocol']>) => {
                const currentAgent = get().agent;

                if (!currentAgent?.bungieUser || !currentAgent?.protocol) {
                    return { success: false, error: 'Structure agent invalide' };
                }

                try {
                    // 1. Update optimiste
                    get().updateProtocolLocal(updates);

                    // 2. Appel API pour sauvegarde seulement
                    const tempToken = sessionStorage.getItem('temp_auth_token');
                    const response = await axios.patch(
                        `${API_BASE_URL}/api/protocol/agent/profile`,
                        { protocol: updates },
                        {
                            headers: {
                                'Authorization': `Bearer ${tempToken}`,
                                'Content-Type': 'application/json',
                                'ngrok-skip-browser-warning': 'true'
                            }
                        }
                    );

                    if (!response.data.success) {
                        throw new Error(response.data.message || 'Échec API');
                    }

                    console.log('✅ Sauvegarde API réussie');

                    // 3. ✅ PAS de sync - l'update optimiste suffit
                    // L'API confirme juste que c'est sauvé en BDD

                    return { success: true };

                } catch (error) {
                    console.error('❌ Erreur API, rollback:', error);
                    set({ agent: currentAgent });
                    return { success: false, error: error instanceof Error ? error.message : String(error) };
                }
            },
            updateProtocolLocal: (updates) => set((state) => {
                console.log('🔄 updateProtocolLocal:', updates);

                if (!state.agent?.bungieUser || !state.agent?.protocol) {
                    console.error('❌ Structure agent invalide');
                    return state;
                }

                const result = {
                    agent: {
                        ...state.agent,
                        protocol: {
                            ...state.agent.protocol,
                            ...updates
                        }
                    }
                };

                console.log('✅ updateProtocolLocal terminé');
                return result;
            }),
            updateProtocol: async (updates) => {
                const currentAgent = get().agent;

                if (!currentAgent?.bungieUser || !currentAgent?.protocol) {
                    console.error('❌ updateProtocol: Structure agent invalide');
                    return { success: false, error: 'Structure agent invalide' };
                }

                console.log('🚀 updateProtocol avec API:', updates);

                try {
                    // 1. ✅ Mise à jour optimiste (UI immédiate)
                    console.log('⚡ Update optimiste...');
                    get().updateProtocolLocal(updates);

                    // 2. ✅ Appel API
                    const tempToken = sessionStorage.getItem('temp_auth_token');
                    if (!tempToken) {
                        throw new Error('Token d\'authentification manquant');
                    }

                    console.log('📡 Appel API...');
                    const response = await axios.patch(
                        `${API_BASE_URL}/api/protocol/agent/profile`,
                        {
                            protocol: updates
                        },
                        {
                            headers: {
                                'Authorization': `Bearer ${tempToken}`,
                                'Content-Type': 'application/json',
                                'ngrok-skip-browser-warning': 'true'
                            }
                        }
                    );

                    if (!response.data.success) {
                        throw new Error(response.data.message || 'Échec de la mise à jour côté serveur');
                    }

                    console.log('✅ API mise à jour avec succès');

                    // 3. ✅ Synchroniser avec la réponse serveur (optionnel)
                    if (response.data.data?.agent) {
                        console.log('🔄 Synchronisation avec la réponse serveur...');
                        set({ agent: response.data.data.agent });
                    }

                    return { success: true };

                } catch (error) {
                    console.error('❌ Erreur updateProtocol:', error);

                    // 4. ✅ Rollback automatique
                    console.log('↩️ Rollback en cours...');
                    set({ agent: currentAgent });

                    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
                    return { success: false, error: errorMessage };
                }
            },

            updateSettings: (updates) => set((state) => {
                if (!state.agent) return { agent: null };

                console.log('🔄 updateSettings:', updates);
                return {
                    agent: {
                        ...state.agent,
                        protocol: {
                            ...state.agent.protocol,
                            settings: {
                                ...state.agent.protocol.settings,
                                ...updates
                            }
                        }
                    }
                };
            }),


            getAgentProgress: async () => {
                try {
                    const tempToken = sessionStorage.getItem('temp_auth_token');
                    if (!tempToken) {
                        console.log('❌ getAgentProgress: Pas de token');
                        return null;
                    }

                    console.log('📡 Récupération de la progression des challenges...');

                    const response = await axios.get(`${API_BASE_URL}/api/protocol/agent/challenge/progress`, {
                        headers: {
                            'Authorization': `Bearer ${tempToken}`,
                            'Content-Type': 'application/json',
                            'ngrok-skip-browser-warning': 'true'
                        }
                    });

                    console.log('📥 Réponse getAgentProgress:', response.status, response.data);

                    const { success, data } = response.data;
                    console.log('📊 Données de progression:', data);

                    if (success) {
                        return data;
                    } else {
                        console.log('⚠️ Réponse sans data valide:', { success, data });
                        return null;
                    }
                } catch (error) {
                    console.error('❌ Erreur getAgentProgress:', error);

                    if (axios.isAxiosError(error)) {
                        console.error('📊 Détails erreur API:', {
                            status: error.response?.status,
                            statusText: error.response?.statusText,
                            data: error.response?.data
                        });
                    }

                    return null;
                }
            },

            getAvailableChallenges: async () => {
                try {
                    const tempToken = sessionStorage.getItem('temp_auth_token');
                    if (!tempToken) {
                        console.log('❌ getAvailableChallenges: Pas de token');
                        return null;
                    }
                    const response = await axios.get(`${API_BASE_URL}/api/protocol/challenges/available`, {
                        headers: {
                            'Authorization': `Bearer ${tempToken}`,
                            'Content-Type': 'application/json',
                            'ngrok-skip-browser-warning': 'true'
                        }
                    });
                    const { success, data } = response.data;

                    if (success) {
                        return response.data;
                    } else {
                        console.log('⚠️ Réponse sans data valide:', { success, data });
                        return null;
                    }
                } catch (error) {
                    console.error('❌ Erreur getAllChallenge:', error);

                    if (axios.isAxiosError(error)) {
                        console.error('📊 Détails erreur API:', {
                            status: error.response?.status,
                            statusText: error.response?.statusText,
                            data: error.response?.data
                        });
                    }

                    return null;
                }
            },

            getAgentAllContracts: async () => {
                try {
                    const tempToken = sessionStorage.getItem('temp_auth_token');
                    if (!tempToken) {
                        console.log('❌ getAgentAllContracts: Pas de token');
                        return null;
                    }
                    // Récupération de l'agentId depuis le store
                    const agentId = get().agent?.bungieId;
                    if (!agentId) {
                        console.log('❌ getAgentAllContracts: Pas d\'agentId');
                        return null;
                    }
                    const response = await axios.get(`${API_BASE_URL}/api/protocol/agent/contracts`, {
                        headers: {
                            'Authorization': `Bearer ${tempToken}`,
                            'Content-Type': 'application/json',
                            'ngrok-skip-browser-warning': 'true'
                        }
                    });
                    console.log('📥 Réponse getAgentAllContracts:', response.status, response.data);
                    if (Array.isArray(response.data)) {
                        return response.data;
                    } else {
                        console.log('⚠️ Réponse inattendue:', response.data);
                        return null;
                    }
                } catch (error) {
                    console.error('❌ Erreur getAgentAllContracts:', error);
                    if (axios.isAxiosError(error)) {
                        console.error('📊 Détails erreur API:', {
                            status: error.response?.status,
                            statusText: error.response?.statusText,
                            data: error.response?.data
                        });
                    }
                    return null;
                }
            },

        }),
        {
            name: 'anom-user-data',
            partialize: (state) => ({
                agent: state.agent,
                isAuthenticated: state.isAuthenticated
            })
        }
    )
)