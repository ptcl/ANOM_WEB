// lib/api/protocol.ts
import axios, { AxiosResponse } from 'axios';

// Types
interface UpdateProtocolData {
    protocol?: {
        hasSeenRecruitment?: boolean;
        customName?: string;
        species?: 'HUMAN' | 'EXO' | 'AWOKEN';
        settings?: {
            notifications?: boolean;
            publicProfile?: boolean;
            protocolOSTheme?: 'DEFAULT' | 'DARKNESS';
            protocolSounds?: boolean;
        };
    };
}

interface AgentProfile {
    _id: string;
    protocol: {
        agentName: string;
        customName?: string;
        species: string;
        hasSeenRecruitment: boolean;
        settings: {
            notifications: boolean;
            publicProfile: boolean;
            protocolOSTheme: string;
            protocolSounds: boolean;
        };
    };
    updatedAt: string;
}

interface APIResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

// Configuration API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Instance Axios configurée
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
    }
});

// Intercepteur pour ajouter le token automatiquement
apiClient.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('temp_auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Intercepteur pour gérer les erreurs
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('❌ Erreur API:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: error.message,
            url: error.config?.url,
            method: error.config?.method
        });
        return Promise.reject(error);
    }
);

// Service Protocol API
export const protocolAPI = {
    /**
     * Récupère le profil de l'agent
     */
    async getProfile(): Promise<APIResponse<{ agent: AgentProfile }>> {
        try {
            const response: AxiosResponse<APIResponse<{ agent: AgentProfile }>> =
                await apiClient.get('/api/protocol/agent/profile');
            return response.data;
        } catch (error) {
            throw new Error(`Échec de récupération du profil: ${error}`);
        }
    },

    /**
     * Met à jour le profil de l'agent
     */
    async updateProfile(data: UpdateProtocolData): Promise<APIResponse<{ agent: AgentProfile }>> {
        try {
            console.log('📤 Envoi des données:', JSON.stringify(data, null, 2));

            const response: AxiosResponse<APIResponse<{ agent: AgentProfile }>> =
                await apiClient.patch('/api/protocol/agent/profile', data);

            console.log('📥 Réponse reçue:', response.status, response.data);
            return response.data;
        } catch (error) {
            throw new Error(`Échec de mise à jour du profil: ${error}`);
        }
    },

    /**
     * Vérifie si l'utilisateur a vu le recrutement
     */
    async hasSeenRecruitment(): Promise<boolean> {
        try {
            const profile = await this.getProfile();
            return profile.data?.agent?.protocol?.hasSeenRecruitment || false;
        } catch (error) {
            console.error('❌ Erreur lors de la vérification du recrutement:', error);
            return false;
        }
    },

    /**
     * Marque le recrutement comme vu
     */
    async markRecruitmentAsSeen(): Promise<APIResponse<{ agent: AgentProfile }>> {
        return this.updateProfile({
            protocol: {
                hasSeenRecruitment: true
            }
        });
    }
};

// Hook personnalisé pour les opérations Protocol (optionnel)
export const useProtocolAPI = () => {
    const updateRecruitmentStatus = async (): Promise<boolean> => {
        try {
            await protocolAPI.markRecruitmentAsSeen();
            return true;
        } catch (error) {
            console.error('❌ Échec de mise à jour du statut de recrutement:', error);
            return false;
        }
    };

    const checkRecruitmentStatus = async (): Promise<boolean> => {
        try {
            return await protocolAPI.hasSeenRecruitment();
        } catch (error) {
            console.error('❌ Échec de vérification du statut de recrutement:', error);
            return false;
        }
    };

    return {
        updateRecruitmentStatus,
        checkRecruitmentStatus,
        protocolAPI
    };
};