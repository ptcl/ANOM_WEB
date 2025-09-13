export interface IAnnouncement {
    title: string;
    content: string;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    expiresAt: Date;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    tags?: string[];
    readBy: Array<{
        agentId: string;
        readAt: Date;
    }>;
    visibility: 'ALL' | 'FOUNDERS' | 'SPECIALISTS' | 'GROUP';
    targetGroup?: 'PROTOCOL' | 'AURORA' | 'ZENITH';
}

