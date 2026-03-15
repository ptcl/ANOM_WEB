'use client'

import { useEffect } from 'react'
import { useAgentStore } from '@/store/agentStore'
import { useAuthentication } from './useAuthentication'

export function useAgent() {
    const { isAuthenticated } = useAuthentication()

    const agent = useAgentStore(state => state.agent)
    const isLoading = useAgentStore(state => state.isLoading)
    const error = useAgentStore(state => state.error)
    const fetchAgent = useAgentStore(state => state.fetchAgent)
    const updateAgent = useAgentStore(state => state.updateAgent)
    const redeemCode = useAgentStore(state => state.redeemCode)

    const getRoles = useAgentStore(state => state.getRoles)
    const isFounderFn = useAgentStore(state => state.isFounder)
    const isEmissaryFn = useAgentStore(state => state.isEmissary)
    const isArchitectFn = useAgentStore(state => state.isArchitect)
    const isOracleFn = useAgentStore(state => state.isOracle)
    const isEchoFn = useAgentStore(state => state.isEcho)

    const getAgentName = useAgentStore(state => state.getAgentName)
    const getClearanceLevel = useAgentStore(state => state.getClearanceLevel)

    const roles = getRoles()
    const isFounder = typeof isFounderFn === 'function' ? isFounderFn() : false
    const isEmissary = typeof isEmissaryFn === 'function' ? isEmissaryFn() : false
    const isArchitect = typeof isArchitectFn === 'function' ? isArchitectFn() : false
    const isOracle = typeof isOracleFn === 'function' ? isOracleFn() : false
    const isEcho = typeof isEchoFn === 'function' ? isEchoFn() : false
    const agentName = getAgentName()
    const clearanceLevel = getClearanceLevel()

    useEffect(() => {
        if (isAuthenticated && !agent && !isLoading) {
            fetchAgent()
        }
    }, [isAuthenticated, agent, isLoading, fetchAgent])

    return {
        agent,
        isLoading,
        error,
        refetch: () => fetchAgent(true),
        updateAgent,
        redeemCode,

        isFounder,
        roles,
        agentName,
        clearanceLevel,
        isEmissary,
        isArchitect,
        isOracle,
        isEcho
    }
}
