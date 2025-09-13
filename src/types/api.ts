import { IChallenge } from "./challenge";

export interface IChallengeApiResponse {
    success: boolean;
    challenges: IChallenge[];
    count: number;
}

export interface IAgentProgressApiResponse {
    success: boolean;
    data: IAgentProgress[];
}

export interface IAgentProgress {
    test: string
}