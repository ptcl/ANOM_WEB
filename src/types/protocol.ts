import { Player } from "./player";

export interface Protocol {
    agentName: string
    customName?: string;
    bungieId: Player | null
    species: 'HUMAN' | 'EXO' | 'AWOKEN'
    clearanceLevel: 1 | 2 | 3
    role?: 'agent' | 'specialist' | 'founder'
    hasSeenRecruitment: boolean
    protocolJoinedAt?: string
    group?: 'PROTOCOL' | 'AURORA' | 'ZENITH' | 'EXODUS' | 'GUARDIAN' | 'INDEPENDENT'
    projectAccess?: {
        ANOM: boolean
        AURORA: boolean
        ZENITH: boolean
    }

}

export interface UserSettings {
    notifications: boolean
    publicProfile: boolean
    protocolOSTheme?: 'default' | 'classic'
    protocolSounds?: boolean
}

export interface UserState {
    isAuthenticated: boolean
    displayName: string | null
    protocol: Protocol | null
    settings: UserSettings | null
    verifyAuthentication: () => Promise<boolean>
    refreshAuthentication: () => Promise<boolean>
    logout: () => void
    setDisplayName: (name: string | null) => void
    setProtocol: (protocol: Protocol | null) => void
    updateProtocol: (updates: Partial<Protocol>) => void
    setSettings: (settings: UserSettings | null) => void
    updateSettings: (updates: Partial<UserSettings>) => void
}