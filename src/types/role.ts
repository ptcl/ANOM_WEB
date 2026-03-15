export type AgentRoleId = 'FOUNDER' | 'ARCHITECT' | 'EMISSARY' | 'ORACLE' | 'ECHO' | 'AGENT'

export interface IRole {
    roleId: string;
    name: string;
    description?: string;
    color?: string;
    permissions: string[];
    isSystem: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}