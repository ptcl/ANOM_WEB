'use client'

import { useUserStore } from '@/store/userStore'
import { useAuth } from '@/lib/useAuth'
import { useEffect, useRef } from 'react'

export default function DashboardLayout({ children, }: { children: React.ReactNode }) {
    const { isAuthenticated } = useUserStore()
    const { refreshAuth } = useAuth()
    const hasRefreshed = useRef(false)

    useEffect(() => {
        if (!hasRefreshed.current) {
            hasRefreshed.current = true
            refreshAuth()
        }
    }, [refreshAuth])

    if (!isAuthenticated) {
        return (
            <>
                {/* <div className="h-full flex items-center justify-center flex-col gap-4 bg-gray-900 text-white p-6">
                    <h2 className="text-xl font-bold">Authentification requise</h2>
                    <p>Vous devez être connecté pour accéder au tableau de bord.</p>
                    <div className="bg-orange-800/30 border border-orange-700/50 p-4 rounded-md text-sm">
                        Si vous êtes déjà connecté sur la page principale, essayez de rafraîchir cette fenêtre.
                    </div>
                </div> */}
            </>
        )
    }

    return (
        <div className="h-full w-full bg-gray-900">
            {children}
        </div>
    )
}
