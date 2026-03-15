
export interface IRewardCodeReward {
    roles: string[];
    badgeIds: string[];
}

export interface IRewardCodeUsage {
    agentId: string;
    agentName?: string;
    usedAt: Date;
}

export interface IRewardCode {
    _id?: string;
    codeId: string;
    code: string;
    word?: string;

    rewards: IRewardCodeReward;
    isUnique: boolean;
    maxUses?: number;
    currentUses: number;
    description?: string;
    createdBy: string;
    createdAt?: Date;
    expiresAt?: Date;
    usedBy: IRewardCodeUsage[];
    updatedAt?: Date;
}


export interface IGenerateRewardCodesInput {
    count: number;
    word?: string;
    rewards: IRewardCodeReward;
    isUnique?: boolean;
    maxUses?: number;
    description?: string;
    expiresAt?: string | Date;
}

export interface IRedeemCodeInput {
    code: string;
}
