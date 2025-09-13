'use client'

import AgentDashboard from './AgentDashboard'
import SpecialistDashboard from './SpecialistDashboard'
import FounderDashboard from './FounderDashboard'
import { useUserStore } from '@/store/userStore'
import { useRouter } from 'next/navigation'

export default function DashboardWrapper() {
  const { isAuthenticated, agent } = useUserStore();
  const router = useRouter();

  if (!agent) {
    if (!isAuthenticated) {
      router.push('/');
      return null;
    }
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Chargement des données agent...</div>
      </div>
    );
  }

  const role = agent.protocol?.role?.toUpperCase() || 'AGENT';

  switch (role) {
    case 'FOUNDER':
      return <FounderDashboard agent={agent} />

    case 'SPECIALIST':
      return <SpecialistDashboard agent={agent} />

    case 'AGENT':
    default:
      return <AgentDashboard />
  }
}