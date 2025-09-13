// Types pour les énumérations
export type ContractStatus = "pending" | "validated" | "cancelled" | "revoked";
export type EmblemStatus = "available" | "redeemed" | "revoked";
export type RevocationRequestStatus = "pending" | "processed" | "cancelled";

// Interface pour le contributeur
export interface IContributor {
    bungieId: string;
    displayName: string;
    isAnonymous: boolean;
}

// Interface pour un emblème
export interface IEmblem {
    emblemId: string;
    name?: string;
    code?: string;
    status: EmblemStatus;
    redeemedBy?: string;
    redeemedDate?: string;
}

// Interface pour une demande de révocation
export interface IRevocationRequest {
    requestDate: string;
    effectiveDate?: string;
    emblemCodes: string[];
    isPartial: boolean;
    status: RevocationRequestStatus;
}

// Interface pour les médias
export interface IMedia {
    url?: string;
    legend?: string;
}

// Interface principale du contrat
export interface IContract {
    _id: string;
    contractId: string;
    contractDate: string;
    status: ContractStatus;
    validationDeadline?: string;
    isExpired: boolean;
    contributor: IContributor;
    emblems: IEmblem[];
    totalCodes: number;
    availableCodes: number;
    revocationRequests: IRevocationRequest[];
    media: IMedia[];
    signedDocumentPath?: string;
    isSigned: boolean;
    createdAt: string;
    updatedAt: string;
}

// Type pour la création d'un nouveau contrat
export interface ICreateContract {
    contractId: string;
    contractDate?: string;
    status?: ContractStatus;
    validationDeadline?: string;
    isExpired?: boolean;
    contributor: {
        bungieId: string;
        displayName: string;
        isAnonymous?: boolean;
    };
    emblems?: Partial<IEmblem>[];
    totalCodes?: number;
    availableCodes?: number;
    revocationRequests?: Partial<IRevocationRequest>[];
    media?: IMedia[];
    signedDocumentPath?: string;
    isSigned?: boolean;
}

// Type pour la mise à jour d'un contrat
export interface IUpdateContract {
    contractId?: string;
    contractDate?: string;
    status?: ContractStatus;
    validationDeadline?: string;
    isExpired?: boolean;
    contributor?: Partial<IContributor>;
    emblems?: Partial<IEmblem>[];
    totalCodes?: number;
    availableCodes?: number;
    revocationRequests?: Partial<IRevocationRequest>[];
    media?: IMedia[];
    signedDocumentPath?: string;
    isSigned?: boolean;
}

// Types utilitaires pour les responses API
export interface IContractResponse {
    success: boolean;
    data?: IContract;
    message?: string;
}

export interface IContractsListResponse {
    success: boolean;
    data?: IContract[];
    total?: number;
    page?: number;
    limit?: number;
    message?: string;
}