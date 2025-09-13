'use client'

import { useEffect, useState } from 'react'
import DashboardWrapper from '@/components/dashboard/DashboardWrapper'
import { useUserStore } from '@/store/userStore'
import Loader from '@/components/lottie/loader/loader';


export default function DesktopDashboard() {
    const {
        initializeAuth,
        isLoading,
        isAuthenticated,
        agent
    } = useUserStore();

    const [hasInitialized, setHasInitialized] = useState(false);

    useEffect(() => {

        if (!hasInitialized) {
            initializeAuth().finally(() => {
                setHasInitialized(true);
            });
        }
    }, [hasInitialized, initializeAuth]);

    useEffect(() => {
    }, [isLoading, isAuthenticated, agent, hasInitialized]);

    if (isLoading || (!hasInitialized && isAuthenticated)) {
        return (
            <div className="h-screen flex items-center justify-center bg-[var(--black_accent1)]">
                <div className="text-center">
                    <Loader width={120} height={120} />
                    <p className="text-green-400 mt-4 font-mono">
                        {isLoading ? 'Chargement...' : 'Initialisation...'}
                    </p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-red-400">Non authentifié</div>
            </div>
        );
    }

    if (!agent) {
        return (
            <div className="h-screen flex items-center justify-center bg-[var(--black_accent1)]">
                <div className="text-center">
                    <Loader width={120} height={120} />
                    <p className="text-yellow-400 mt-4 font-mono">Chargement des données agent...</p>
                </div>
            </div>
        );
    }
    return (
        <div className="h-screen overflow-y-auto p-2 bg-[var(--background)]">
            <DashboardWrapper />
        </div>
    );
}