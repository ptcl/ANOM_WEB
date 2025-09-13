'use client'

import { ReactNode } from 'react'
import { useAuth } from './AuthProvider'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
    const { isLoading, isAuthenticated } = useAuth()

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return null
    }

    return <>{children}</>
}