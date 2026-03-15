import type { IAgent } from "./agent"
import { ReactNode } from "react";

export interface AppInfo {
    id: string
    name: string
    icon: string | ReactNode
    position?: { x: number, y: number }
}

export type WindowInfo = {
    id: string
    title: string
    icon: string | ReactNode
    isOpen: boolean
    isMinimized: boolean
    position?: { x: number, y: number }
    size?: { width: number, height: number }
    zIndex?: number
}

export interface JWTPayload {
    agentId: string;
    bungieId: string;
    protocol: {
        agentName: string;
        role: 'AGENT' | 'SPECIALIST' | 'FOUNDER';
    };
    iat: number;
    exp: number;
}

export interface AuthState {
    isAuthenticated: boolean
    agent: IAgent | null
    isLoading: boolean
    token: string | null
}