'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import AgentDashboard from './AgentDashboard'
import { IAgent } from '@/types/agent'

interface SpecialistDashboardProps {
  agent: IAgent | null;
}

export default function SpecialistDashboard({ agent }: SpecialistDashboardProps) {
  return (
    <>
      {/* Inclure le dashboard de niveau agent */}
      <AgentDashboard/>

      {/* Contenu spécifique au niveau spécialiste */}
      <Card className="bg-gray-800/60 border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-white flex items-center gap-2">
            <span>🔍</span>
            <span>Outils de Spécialiste</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-gray-300">
          <div className="space-y-3">
            <div className="flex items-center">
              <span className="font-medium">Rapport de mission:</span>
              <Badge variant="outline" className="ml-2 bg-teal-900/40 text-teal-300 border-teal-700">
                Disponible
              </Badge>
            </div>

            <div className="flex items-center">
              <span className="font-medium">Date d&apos;inscription:</span>
              <span className="ml-2">{agent?.protocol?.protocolJoinedAt ? new Date(agent.protocol.protocolJoinedAt).toLocaleDateString() : 'Non disponible'}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
