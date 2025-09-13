'use client'
import '@/css/AgentDashboard.css'
import Placeholder from '../protocol/Placeholder'
import Link from 'next/link'
import { ChevronLeftIcon, RefreshCw, Wifi, WifiOff } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useDashboardData } from '@/hook/useDashboardData'
import CardAgent from '../protocol/dashboard/agent/CardAgent'
import CardAnnouncement from '../protocol/dashboard/agent/CardAnnouncement'
import CardFragmentCount from '../protocol/dashboard/agent/CardFragmentCount'
import CardChallengeActif from '../protocol/dashboard/agent/CardChallengeActif'
import CardChallengeAvailable from '../protocol/dashboard/agent/CardChallengeAvailable'
import CardChallengeComplete from '../protocol/dashboard/agent/CardChallengeComplete'
import CardContractTotal from '../protocol/dashboard/agent/CardContractTotal'
import CardEmblemObtenu from '../protocol/dashboard/agent/CardEmblemObtenu'
import { Button } from '../ui/button'

export default function AgentDashboard() {
    const { challengeData, agentProgress, agentData, contractData, isLoading, error, refetch, hasCache } = useDashboardData()

    const [isOnline, setIsOnline] = useState(true)

    useEffect(() => {
        const handleOnline = () => setIsOnline(true)
        const handleOffline = () => setIsOnline(false)

        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [])

    // Indicateur de fraîcheur des données
    const hasFreshData = hasCache('challenges') && hasCache('agentProgress')

    return (
        <section className='Dashboard__Agent h-screen sm:h-full flex flex-col gap-2'>
            <div className='flex flex-col'>
                <div className="flex items-center justify-between">
                    <Link href="/desktop" className='text-sm text-gray-500 hidden min-[1918px]:block'>
                        <div className='flex items-center gap-0 text-gray-500 hover:text-gray-400 transition'>
                            <ChevronLeftIcon size={18} />
                            <span>Retour au bureau</span>
                        </div>
                    </Link>

                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-xs">
                            {isOnline ? (
                                <Wifi size={12} className="text-green-400" />
                            ) : (
                                <WifiOff size={12} className="text-red-400" />
                            )}
                            <span className={isOnline ? 'text-green-400' : 'text-red-400'}>
                                {isOnline ? 'En ligne' : 'Hors ligne'}
                            </span>
                        </div>

                        {!hasFreshData && !isLoading && (
                            <span className="text-xs text-yellow-400">Données anciennes</span>
                        )}

                        <Button onClick={refetch} disabled={isLoading} className="p-2 text-gray-500 hover:text-gray-300 transition disabled:opacity-50" title="Actualiser les données">
                            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Gestion d'erreur améliorée */}
            {error && (
                <div className="bg-red-900/20 border border-red-700/50 p-3 rounded-md text-red-300 text-sm">
                    <div className="flex items-center justify-between">
                        <span>⚠️ {error}</span>
                        <button
                            onClick={refetch}
                            className="px-3 py-1 bg-red-700/30 rounded text-xs hover:bg-red-700/50 transition"
                        >
                            Réessayer
                        </button>
                    </div>
                </div>
            )}

            <section className='group__top w-full h-screen sm:h-full max-h-[400px] flex flex-col sm:flex-row gap-2'>
                <section className='top__right w-full h-full flex gap-2 justify-between'>
                    <CardAgent agentData={agentData} isLoading={isLoading} error={null} />
                    <CardAnnouncement />
                </section>

                <section className='top__left w-full h-full overflow-hidden flex gap-2'>
                    <section className='w-full h-full flex flex-col gap-2'>
                        <CardFragmentCount agentProgress={agentProgress} isLoading={isLoading} error={null} />
                        <Placeholder />
                    </section>

                    <section className='w-full h-full flex flex-col gap-2'>
                        <CardChallengeAvailable challengeData={challengeData} isLoading={isLoading} error={null} />
                        <CardChallengeActif challengeData={challengeData} isLoading={isLoading} error={null} />
                        <CardChallengeComplete agentProgress={agentProgress} isLoading={isLoading} error={null} />
                    </section>

                    <section className='w-full h-full flex flex-col gap-2 overflow-hidden'>
                        <CardContractTotal contractData={contractData} isLoading={isLoading} error={null} />
                        <CardEmblemObtenu challengeData={challengeData} isLoading={isLoading} error={null} />
                    </section>
                </section>
            </section>

            <section className='group__bottom w-full h-screen sm:h-full flex flex-col sm:flex-row gap-2'>
                <section className='bottom__right w-full h-full overflow-hidden'>
                    <Placeholder />
                </section>
                <section className='bottom__left w-full h-full overflow-hidden'>
                    <Placeholder />
                </section>
            </section>
        </section>
    )
}