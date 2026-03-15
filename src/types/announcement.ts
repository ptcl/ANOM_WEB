export interface IAnnouncement {
    _id?: string;
    announcementId?: string;
    title: string;
    content: string;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    expiresAt: Date;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    tags?: string[];
    readBy: Array<{ agentId: string; readAt: Date; }>;
    visibility: 'ALL' | "AGENT" | "ECHO" | "ORACLE" | "ARCHITECT" | "FOUNDER" | "EMISSARY" | 'GROUP';
    targetGroup?: string;
}
