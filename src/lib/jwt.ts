
import { JWTPayload } from '@/types/utils'
import axios from 'axios'

export const decodeJWT = (token: string): JWTPayload | null => {
    try {
        const parts = token.split('.')
        if (parts.length !== 3) {
            throw new Error('Invalid JWT format')
        }

        const payload = parts[1]

        const decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))

        console.log("Decoded JWT Payload:", decodedPayload)
        return JSON.parse(decodedPayload)
    } catch (error) {
        console.error('Failed to decode JWT:', error)
        return null
    }
}

export const isJWTExpired = (token: string): boolean => {
    const payload = decodeJWT(token)
    if (!payload || !payload.exp) {
        return true
    }

    const currentTime = Math.floor(Date.now() / 1000)
    return payload.exp < currentTime
}

export const getJWTTimeRemaining = (token: string): number => {
    const payload = decodeJWT(token)
    if (!payload || !payload.exp) {
        return 0
    }

    const currentTime = Math.floor(Date.now() / 1000)
    const timeRemaining = (payload.exp - currentTime) * 1000

    return Math.max(0, timeRemaining)
}

export const isJWTExpiringSoon = (token: string, minutesThreshold: number = 5): boolean => {
    const timeRemaining = getJWTTimeRemaining(token)
    const thresholdMs = minutesThreshold * 60 * 1000

    return timeRemaining > 0 && timeRemaining <= thresholdMs
}

export const formatTimeRemaining = (milliseconds: number): string => {
    if (milliseconds <= 0) return 'Expiré'

    const seconds = Math.floor(milliseconds / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days}j ${hours % 24}h`
    if (hours > 0) return `${hours}h ${minutes % 60}m`
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`
    return `${seconds}s`
}

import { useEffect, useState, useCallback } from 'react'

// interface RefreshResponse {
//     success: boolean
//     data: {
//         token: string
//         player: {
//             id: string
//             bungieId: string
//             displayName: string
//             role: string
//             profilePicture?: string
//         }
//     }
//     message: string
// }
interface RefreshResponse {
    success: boolean
    data: {
        token: string
        player: {
            id: string
            bungieId: string
            displayName: string
            profilePicture?: string
            protocol: {
                agentName: string
                role: 'AGENT' | 'SPECIALIST' | 'FOUNDER'
            }
        }
    }
    message: string
}
export const useJWTMonitor = (
    token: string | null,
    onExpired?: () => void,
    onExpiringSoon?: () => void,
    onTokenRefreshed?: (newToken: string, player: {
        id: string
        bungieId: string
        displayName: string
        role: string
        profilePicture?: string
    }) => void
) => {
    const [isExpired, setIsExpired] = useState(false)
    const [isExpiringSoon, setIsExpiringSoon] = useState(false)
    const [timeRemaining, setTimeRemaining] = useState(0)
    const [isRefreshing, setIsRefreshing] = useState(false)

    const refreshToken = useCallback(async (currentToken: string): Promise<boolean> => {
        if (isRefreshing) return false

        try {
            setIsRefreshing(true)

            const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

            const response = await axios.post(
                `${API_BASE_URL}/api/identity/refresh`,
                { token: currentToken },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'ngrok-skip-browser-warning': 'true'
                    }
                }
            )

            const data: RefreshResponse = response.data

            if (data.success) {
                if (onTokenRefreshed) {
                    const player = data.data.player;
                    onTokenRefreshed(
                        data.data.token,
                        {
                            id: player.id,
                            bungieId: player.bungieId,
                            displayName: player.displayName,
                            role: player.protocol.role,
                            profilePicture: player.profilePicture
                        }
                    );
                }
                return true;
            } else {
                throw new Error('Failed to refresh token')
            }

        } catch (error) {
            console.error('❌ Token refresh failed:', error)
            return false
        } finally {
            setIsRefreshing(false)
        }
    }, [isRefreshing, onTokenRefreshed])

    useEffect(() => {
        if (!token) {
            setIsExpired(true)
            setIsExpiringSoon(false)
            setTimeRemaining(0)
            return
        }

        const checkExpiration = async () => {
            const expired = isJWTExpired(token)
            const expiringSoon = isJWTExpiringSoon(token, 5)
            const remaining = getJWTTimeRemaining(token)

            setIsExpired(expired)
            setIsExpiringSoon(expiringSoon && !expired)
            setTimeRemaining(remaining)

            if (expiringSoon && !expired && !isRefreshing) {
                console.log('⚠️ Token expiring soon, attempting refresh...')

                const refreshSuccess = await refreshToken(token)

                if (!refreshSuccess) {
                    console.log('❌ Refresh failed, token will expire')
                    if (onExpiringSoon) {
                        onExpiringSoon()
                    }
                }
            }

            if (expired && onExpired) {
                onExpired()
            }
        }

        checkExpiration()

        const interval = setInterval(checkExpiration, 120000)

        return () => clearInterval(interval)
    }, [token, onExpired, onExpiringSoon, refreshToken, isRefreshing])

    return {
        isExpired,
        isExpiringSoon,
        timeRemaining,
        formattedTimeRemaining: formatTimeRemaining(timeRemaining),
        isRefreshing
    }
}