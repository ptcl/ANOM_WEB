export interface IAgent {
    _id?: string;
    bungieId: string;
    bungieTokens?: {
        accessToken: string;
        refreshToken: string;
        expiresAt: Date;
    };
    destinyMemberships?: Array<{
        crossSaveOverride?: number;
        applicableMembershipTypes?: number[];
        isPublic?: boolean;
        membershipType: number;
        membershipId: string;
        displayName: string;
        bungieGlobalDisplayName?: string;
        bungieGlobalDisplayNameCode?: number;
    }>;
    bungieUser: {
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
    };
    protocol: {
        agentName: string;
        customName?: string;
        species: 'HUMAN' | 'EXO' | 'AWOKEN';
        role: 'AGENT' | 'SPECIALIST' | 'FOUNDER';
        clearanceLevel: 1 | 2 | 3;
        hasSeenRecruitment: boolean;
        protocolJoinedAt?: Date;
        group?: 'PROTOCOL' | 'AURORA' | 'ZENITH';
        settings: {
            notifications: boolean;
            publicProfile: boolean;
            protocolOSTheme?: 'DEFAULT' | 'DARKNESS';
            protocolSounds?: boolean;
        };
    };
    contracts?: Array<{
        contractMongoId?: string;
        contractId?: string;
    }>;
    challenges?: Array<{
        challengeMongoId?: string;
        challengeId?: string;
        title?: string;
        complete?: boolean;
        accessedAt?: Date;
        completedAt?: Date;
        partialCode?: string;
        unlockedFragments?: string[];
        progress?: unknown;
    }>;
    lastActivity?: Date;
    createdAt: Date;
    updatedAt: Date;
}