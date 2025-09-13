import { IAgent } from "./agent"
import { IChallenge } from "./challenge";

export interface IChallengeResponse {
    success: boolean;
    challenges: IChallenge[];
    count: number;
}


export interface AppInfo {
    id: string
    name: string
    icon: string
    position?: { x: number, y: number }
}

export type WindowInfo = {
    id: string
    title: string
    icon: string
    isOpen: boolean
    isMinimized: boolean
    position?: { x: number, y: number }
    size?: { width: number, height: number }
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