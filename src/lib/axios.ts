import axios from 'axios'


const API_BASE_URL = process.env.NEXT_PUBLIC_ENVIRONMENT === 'sandbox' ? process.env.NEXT_PUBLIC_API_SANDBOX_URL : process.env.NEXT_PUBLIC_API_URL


let isRefreshing = false
let refreshSubscribers: ((token: string) => void)[] = []

const onTokenRefreshed = (newToken: string) => {
    refreshSubscribers.forEach(cb => cb(newToken))
    refreshSubscribers = []
}

const addRefreshSubscriber = (cb: (token: string) => void) => {
    refreshSubscribers.push(cb)
}

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
    }
})

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('protocol_token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        // Si non autorisé (401) et pas déjà en train de refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            // Si on est déjà en refresh → on attend
            if (isRefreshing) {
                return new Promise((resolve) => {
                    addRefreshSubscriber((newToken) => {
                        originalRequest.headers.Authorization = `Bearer ${newToken}`
                        resolve(apiClient(originalRequest))
                    })
                })
            }

            // Lance un refresh
            isRefreshing = true
            try {
                const response = await axios.post(`${API_BASE_URL}/api/identity/refresh-token`, {}, {
                    headers: { 'Content-Type': 'application/json' }
                })

                const newToken = response.data?.data?.token

                if (!newToken) throw new Error('No token in refresh response')

                // Sauvegarde + notifie les requêtes en attente
                localStorage.setItem('protocol_token', newToken)
                apiClient.defaults.headers.Authorization = `Bearer ${newToken}`
                onTokenRefreshed(newToken)
                isRefreshing = false

                // Relance la requête initiale
                originalRequest.headers.Authorization = `Bearer ${newToken}`
                return apiClient(originalRequest)

            } catch (refreshError) {
                localStorage.removeItem('protocol_token')
                isRefreshing = false
                window.location.href = '/' // ou '/login'
                return Promise.reject(refreshError)
            }
        }

        return Promise.reject(error)
    }
)

// ✅ API routes centralisées
export const api = {
    // Auth
    verifyToken: (token: string) => apiClient.post('/api/identity/verify-token', { token }),
    refreshToken: () => apiClient.post('/api/identity/refresh-token'),
    logout: () => apiClient.post('/api/identity/auth/logout'),

    // Agent
    getAgentProfile: (p0: { headers: { Authorization: string } }) => apiClient.get('/api/protocol/agent/profile'),
    updateAgent: (data: Record<string, unknown>) => apiClient.patch('/api/protocol/agent/profile', data),
    getAgentTheme: (p0: { headers: { Authorization: string } }) => apiClient.get('/api/protocol/themes'),
    getAgentHistory: () => apiClient.get('/api/protocol/agent/history'),

    //CodeReward
    postCodeReward: (data: Record<string, unknown>) => apiClient.post('/api/protocol/agent/reward-code/redeem', data),

    // Timeline
    getAgentTimelines: () => apiClient.get('/api/protocol/agent/timelines'),
    getAgentTimelineDetail: (timelineId: string) => apiClient.get(`/api/protocol/agent/timeline/${timelineId}`),

}

export default apiClient
