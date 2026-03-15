import { IBadge } from "./badge";
import { IRole } from "./role";
import { IDivision } from "./division";

export interface IBungieToken {
    accessToken: string;
    refreshToken: string;
    expiresAt: Date;
}

export interface IDestinyMembership {
    crossSaveOverride?: number | null;
    applicableMembershipTypes?: number[];
    isPublic?: boolean | null;
    membershipType: number;
    membershipId: string;
    displayName?: string | null;
    bungieGlobalDisplayName?: string | null;
    bungieGlobalDisplayNameCode?: number | null;
}

export interface IBungieUser {
    membershipId: number;
    uniqueName: string;
    displayName: string;
    profilePicture: number;
    about: string;
    firstAccess: Date;
    lastAccess: Date;
    psnDisplayName?: string;
    showActivity: boolean;
    locale: string;
    localeInheritDefault: boolean;
    profilePicturePath?: string;
    profileThemeName: string;
    steamDisplayName?: string;
    twitchDisplayName?: string;
    cachedBungieGlobalDisplayName?: string;
    cachedBungieGlobalDisplayNameCode?: number;
}

export interface IProtocolThemes {
    protocol: boolean;
    clovisBray: boolean;
    vanguard: boolean;
    blackArmory: boolean;
    opulence: boolean;
}

export interface IAgentSettings {
    notifications: boolean;
    publicProfile: boolean;
    themes?: IProtocolThemes;
    soundEffects?: boolean;
    language?: string;
    activeTheme?: string;
}

export interface IAgentBadge {
    badgeId: IBadge;
    obtainedAt: Date;
}

export interface IAgentStats {
    completedTimelines: number;
    fragmentsCollected: number;
    lastFragmentUnlockedAt?: Date;
    lastSyncAt?: Date;
}

export interface IAgentHistory {
    action: string;
    targetId?: string;
    timestamp: Date;
    success?: boolean;
    meta?: Record<string, any>;
}

export interface IAgentTimelineLocalization {
    currentTimelineId?: string | null;
    currentTimelineEntryId?: string | null;
    lastSyncedAt?: Date;
}

export type AgentSpecies = "HUMAN" | "EXO" | "AWOKEN";

export interface IProtocolProfile {
    agentName: string;
    customName?: string;
    bio?: string;
    badges: IAgentBadge[];
    species: AgentSpecies;
    roles: IRole[];
    clearanceLevel: number;
    hasSeenRecruitment: boolean;
    protocolJoinedAt?: Date;
    division: IDivision;
    settings: IAgentSettings;
    stats: IAgentStats;
    timelineLocalization?: IAgentTimelineLocalization;
    history: IAgentHistory[];
}

export interface IAgentContractLink {
    contractMongoId: string;
    contractId: string;
    createdAs: "DONOR";
    linkedAt: Date;
    statusSnapshot: "PENDING" | "VALIDATED" | "CANCELLED" | "REVOKED";
    lastSyncedAt: Date;
}

export interface IAgentTimelineLink {
    timelineMongoId: string;
    timelineId: string;
    title?: string;
    accessedAt: Date;
    lastUpdatedAt: Date;
    currentEntryId?: string;
    fragmentsFound: string[];
    fragmentsCollected: number;
    keysFound: string[];
    entriesResolved: string[];
    completed: boolean;
    completedAt?: Date;
}

export interface IAgent {
    _id?: string;
    bungieId: string;
    bungieTokens?: IBungieToken;
    destinyMemberships?: IDestinyMembership[];
    bungieUser: IBungieUser;
    protocol: IProtocolProfile;

    contracts?: IAgentContractLink[];
    timelines?: IAgentTimelineLink[];

    lastActivity?: Date;

    isActive?: boolean;
    deactivatedAt?: Date;
    deactivatedBy?: string;
    deactivationReason?: string;
    reactivatedAt?: Date;
    reactivatedBy?: string;

    createdAt?: Date;
    updatedAt?: Date;
}
