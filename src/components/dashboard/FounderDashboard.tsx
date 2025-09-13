'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import SpecialistDashboard from './SpecialistDashboard'
import { IAgent } from '@/types/agent'

interface FounderDashboardProps {
    agent: IAgent | null;
}

export default function FounderDashboard({ agent }: FounderDashboardProps) {

    const [systemStatus, setSystemStatus] = useState({
        users: 'Opérationnel',
        database: 'Opérationnel',
        api: 'Opérationnel'
    })

    const updateSystemStatus = (system: 'users' | 'database' | 'api', status: string) => {
        setSystemStatus(prev => ({
            ...prev,
            [system]: status
        }))
    }


    return (
        <>
            <SpecialistDashboard agent={agent} />

            <Card className="bg-gray-800/60 border-gray-700">
                <CardHeader className="pb-2">
                    <CardTitle className="text-white flex items-center gap-2">
                        <span>⚙️</span>
                        <span>Administration</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-300">
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-sm font-semibold mb-2">État du système</h3>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="flex items-center">
                                    <span className="font-medium text-sm">Utilisateurs:</span>
                                    <Badge variant="outline" className="ml-2 bg-green-900/40 text-green-300 border-green-700 text-xs">
                                        {systemStatus.users}
                                    </Badge>
                                </div>
                                <div className="flex items-center">
                                    <span className="font-medium text-sm">Base de données:</span>
                                    <Badge variant="outline" className="ml-2 bg-green-900/40 text-green-300 border-green-700 text-xs">
                                        {systemStatus.database}
                                    </Badge>
                                </div>
                                <div className="flex items-center">
                                    <span className="font-medium text-sm">API:</span>
                                    <Badge variant="outline" className={`ml-2 ${systemStatus.api === 'Opérationnel' ? 'bg-green-900/40 text-green-300 border-green-700' : 'bg-amber-900/40 text-amber-300 border-amber-700'} text-xs`}>
                                        {systemStatus.api}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold mb-2">Actions administratives</h3>
                            <div className="flex flex-wrap gap-2">
                                <button className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 rounded-md text-sm">
                                    Gestion des utilisateurs
                                </button>
                                <button className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 rounded-md text-sm">
                                    Logs système
                                </button>
                                <button className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 rounded-md text-sm">
                                    Configuration
                                </button>
                                <button
                                    className="px-3 py-1 bg-amber-600 hover:bg-amber-700 rounded-md text-sm"
                                    onClick={() => updateSystemStatus('api', systemStatus.api === 'Opérationnel' ? 'Maintenance' : 'Opérationnel')}
                                >
                                    {systemStatus.api === 'Opérationnel' ? 'Maintenance API' : 'API opérationnelle'}
                                </button>
                            </div>
                        </div>

                        <div className="border-t border-gray-700 pt-3">
                            <h3 className="text-sm font-semibold mb-2">Gestion des rôles</h3>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Rôle actuel:</span>
                                    <Badge variant="outline" className="bg-purple-900/40 text-purple-300 border-purple-700">
                                        {agent?.protocol.role || 'agent'} (Niveau {agent?.protocol.clearanceLevel})
                                    </Badge>
                                </div>
                                <div className="grid grid-cols-3 gap-2 mt-2">
                                    <button className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs">
                                        Promouvoir en spécialiste
                                    </button>
                                    <button className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs">
                                        Promouvoir en fondateur
                                    </button>
                                    <button className="px-2 py-1 bg-red-900/60 hover:bg-red-900/80 rounded text-xs">
                                        Rétrograder
                                    </button>
                                </div>

                                <h3 className="text-sm font-semibold mb-1 mt-3">Niveau d&apos;accréditation</h3>
                                <div className="flex justify-between gap-2">
                                    <button className="flex-1 px-2 py-1 bg-teal-900/60 hover:bg-teal-900/80 rounded text-xs" disabled={agent?.protocol?.clearanceLevel === 3}>
                                        Augmenter niveau ({agent?.protocol?.clearanceLevel || 1} → {agent && agent.protocol.clearanceLevel < 3 ? agent.protocol.clearanceLevel + 1 : 'Max'})
                                    </button>
                                    <button className="flex-1 px-2 py-1 bg-amber-900/60 hover:bg-amber-900/80 rounded text-xs" disabled={agent?.protocol?.clearanceLevel === 1}>
                                        Diminuer niveau ({agent?.protocol?.clearanceLevel || 1} → {agent && agent.protocol.clearanceLevel > 1 ? agent.protocol.clearanceLevel - 1 : 'Min'})
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-700 pt-3">
                            <div className="flex items-center">
                                <span className="font-medium">Statut administrateur:</span>
                                <Badge variant="outline" className="ml-2 bg-red-900/40 text-red-300 border-red-700">
                                    Fondateur
                                </Badge>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}
