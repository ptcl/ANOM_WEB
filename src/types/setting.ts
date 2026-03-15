
export interface IRoleAssignment {
    bungieId: string;
    roleId: string;
    note?: string;
}

export interface ITheme {
    themeId: string;
    name: string;
    description?: string;
    primary: string;
    secondary: string;
    accent: string;
    isDefault?: boolean;
    isSystem?: boolean;
}

export interface IThemeWithActive {
    isActive: boolean;
}

export interface ISettings {
    roleOrder: string[];
    roleAssignments: IRoleAssignment[];
    themes: ITheme[];
    createdAt: Date;
    updatedAt: Date;
}
