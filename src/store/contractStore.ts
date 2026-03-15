import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { apiClient } from '@/lib/axios'
import { isCached } from '@/lib/utils'
import { CACHE_DURATION_DEFAULT } from '@/constants/desktop'


export type ContractStatus = 'pending' | 'validated' | 'cancelled' | 'revoked'
export type EmblemStatus = 'available' | 'redeemed' | 'revoked'

interface IContractStats {
    totalContracts: number
    totalContractsPending: number
    totalContractsValidated: number
    totalContractsCancelled: number
    totalContractsRevoked: number
    totalEmblems: number
    totalEmblemsAvailable: number
    totalEmblemsRedeemed: number
}

interface IEmblem {
    emblemId: string
    name: string
    code: string
    status: EmblemStatus
}

interface IContributor {
    bungieId: string
    displayName: string
    isAnonymous: boolean
}

interface IMedia {
    url: string
    legend?: string
}

interface IContract {
    _id: string
    contractId: string
    contributors: IContributor[] // API returns array
    contributor?: IContributor // Computed from contributors[0]
    emblems: IEmblem[]
    totalCodes: number
    availableCodes: number
    status: ContractStatus
    validationDeadline?: Date | string
    media?: IMedia[]
    isExpired: boolean
    isSigned: boolean
    contractDate: Date | string
    createdAt: Date | string
    updatedAt: Date | string
}

interface IContractUpdateData {
    status?: ContractStatus
    validationDeadline?: Date | string | null
    media?: IMedia[]
    isExpired?: boolean
    isSigned?: boolean
}

interface IApiResponse<T> {
    success: boolean
    data?: T
    message?: string
    error?: string
}

interface ICreateContractInput {
    emblems: { name: string; code: string }[]
    contributors: { bungieId: string; displayName: string; isAnonymous: boolean }[]
    validationPeriod?: 7 | 14
    media?: { url: string; legend?: string }[]
}

interface IContractsData {
    contracts: IContract[]
    stats: IContractStats
    count: number
}

interface IContractData {
    contract: IContract
}

interface IContractState {
    // Données
    contracts: IContract[]
    stats: IContractStats | null
    count: number
    // États
    isLoading: boolean
    error: string | null
    lastFetch: number | null

    // Actions
    loadContracts: (force?: boolean) => Promise<void>
    getContractById: (contractId: string) => Promise<IContract | null>
    createContract: (data: ICreateContractInput) => Promise<void>
    updateContract: (contractId: string, data: IContractUpdateData) => Promise<void>
    deleteContract: (contractId: string) => Promise<void>
    reset: () => void
}

const initialState = {
    contracts: [] as IContract[],
    stats: null as IContractStats | null,
    count: 0,
    isLoading: false,
    error: null as string | null,
    lastFetch: null as number | null,
}

export const useContractStore = create<IContractState>()(
    devtools(
        persist(
            (set, get) => ({
                ...initialState,

                loadContracts: async (force = false) => {
                    const { lastFetch } = get()

                    if (!force && isCached(lastFetch, CACHE_DURATION_DEFAULT)) return

                    set({ isLoading: true, error: null })

                    try {
                        const response = await apiClient.get<IApiResponse<IContractsData>>(
                            '/api/protocol/agent/contracts'
                        )

                        const { contracts = [], stats = null, count = 0 } = response.data.data || {}

                        contracts.forEach((c: IContract) => {
                            c.contributor = c.contributors?.[0]
                        })

                        set({
                            contracts,
                            stats,
                            count,
                            isLoading: false,
                            lastFetch: Date.now()
                        })

                    } catch {
                        set({
                            error: 'Erreur lors du chargement des contrats',
                            isLoading: false
                        })
                    }
                },

                getContractById: async (contractId: string): Promise<IContract | null> => {
                    if (!contractId) {
                        throw new Error('Contract ID requis')
                    }

                    try {
                        const response = await apiClient.get<IApiResponse<IContractData>>(
                            `/api/protocol/contracts/${contractId}`
                        )

                        return response.data.data?.contract || null
                    } catch {
                        throw new Error('Erreur lors de la récupération du contrat')
                    }
                },

                updateContract: async (contractId: string, data: IContractUpdateData): Promise<void> => {
                    if (!contractId) {
                        throw new Error('Contract ID requis')
                    }

                    if (!data || Object.keys(data).length === 0) {
                        throw new Error('Données de mise à jour requises')
                    }

                    try {
                        await apiClient.put<IApiResponse<IContractData>>(
                            `/api/protocol/contracts/${contractId}`,
                            data
                        )

                        await get().loadContracts(true)
                    } catch {
                        throw new Error('Erreur lors de la mise à jour du contrat')
                    }
                },

                deleteContract: async (contractId: string): Promise<void> => {
                    if (!contractId) {
                        throw new Error('Contract ID requis')
                    }

                    try {
                        await apiClient.delete<IApiResponse<void>>(
                            `/api/protocol/agent/contract/${contractId}`
                        )

                        const { contracts, count, stats } = get()
                        const deletedContract = contracts.find(c => c.contractId === contractId)
                        const filteredContracts = contracts.filter(c => c.contractId !== contractId)

                        let newStats = stats
                        if (stats && deletedContract) {
                            const statusKey = `totalContracts${deletedContract.status.charAt(0).toUpperCase() + deletedContract.status.slice(1)}` as keyof IContractStats
                            newStats = {
                                ...stats,
                                totalContracts: stats.totalContracts - 1,
                                [statusKey]: (stats[statusKey] as number) - 1,
                                totalEmblems: stats.totalEmblems - (deletedContract.totalCodes || 0),
                                totalEmblemsAvailable: stats.totalEmblemsAvailable - (deletedContract.availableCodes || 0)
                            }
                        }

                        set({
                            contracts: filteredContracts,
                            count: count - 1,
                            stats: newStats
                        })

                    } catch {
                        throw new Error('Erreur lors de la suppression du contrat')
                    }
                },

                createContract: async (data: ICreateContractInput): Promise<void> => {
                    set({ isLoading: true, error: null })

                    try {
                        await apiClient.post<IApiResponse<IContractData>>(
                            '/api/protocol/agent/contract',
                            data
                        )

                        await get().loadContracts(true)
                    } catch (error: unknown) {
                        const axiosErr = error as { response?: { data?: { error?: string } } }
                        const errorMessage = axiosErr.response?.data?.error || 'Erreur lors de la création du contrat'

                        set({ isLoading: false, error: errorMessage })
                        throw new Error(errorMessage)
                    }
                },

                reset: () => set({ ...initialState }),
            }),
            {
                name: 'contract-storage',
                partialize: (state) => ({
                    contracts: state.contracts,
                    stats: state.stats,
                    count: state.count,
                    lastFetch: state.lastFetch
                })
            }
        ),
        { name: 'ContractStore' }
    )
)

export const selectContracts = (state: IContractState) => ({
    contracts: state.contracts,
    count: state.count,
    isLoading: state.isLoading,
    error: state.error
})

export const selectContractStats = (state: IContractState): IContractStats | null =>
    state.stats

export const selectContractsByStatus = (status: ContractStatus) =>
    (state: IContractState): IContract[] =>
        state.contracts.filter(c => c.status === status)

export const selectPendingContracts = (state: IContractState): IContract[] =>
    state.contracts.filter(c => c.status === 'pending')

export const selectValidatedContracts = (state: IContractState): IContract[] =>
    state.contracts.filter(c => c.status === 'validated')

export const selectCancelledContracts = (state: IContractState): IContract[] =>
    state.contracts.filter(c => c.status === 'cancelled')

export const selectRevokedContracts = (state: IContractState): IContract[] =>
    state.contracts.filter(c => c.status === 'revoked')

export const selectContractById = (contractId: string) =>
    (state: IContractState): IContract | undefined =>
        state.contracts.find(c => c.contractId === contractId)

export const selectExpiredContracts = (state: IContractState): IContract[] =>
    state.contracts.filter(c => c.isExpired)

export const selectSignedContracts = (state: IContractState): IContract[] =>
    state.contracts.filter(c => c.isSigned)

export type {
    IContractState,
    IContract,
    IContractStats,
    IContractUpdateData,
    IEmblem,
    IContributor,
    IMedia
}
