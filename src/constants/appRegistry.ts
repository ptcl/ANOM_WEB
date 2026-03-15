import { DashboardApplication, DataDestinyApplication, FolderApplication, SettingsApplication } from '@/components/desktop/core/LazyApps'
import { getMarkdownContent } from '@/app/content/desktopData'
import { Settings } from 'lucide-react'
import React from 'react'
import type { AgentRoleId } from '@/types/role'

interface FileContent {
    id: string
    name: string
    type: 'file'
    extension: string
    content: string
}

interface FolderContent {
    id: string
    name: string
    type: 'folder'
    files: FileContent[]
}

interface BaseAppConfig {
    id: string
    name: string
    icon: string | React.ReactNode
    description: string
    desktopView?: boolean
    requireAuth?: boolean
    roles?: readonly AgentRoleId[]
    visibleWithoutRole?: boolean
    defaultPosition?: { x: number; y: number }
    pinned?: boolean
}

interface AppConfig extends BaseAppConfig {
    type: 'app'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    component: React.ComponentType<any>
}

interface FolderConfig extends BaseAppConfig {
    type: 'folder'
    component: typeof FolderApplication
    content: {
        files: FileContent[]
        folders: Record<string, FolderContent>
    }
}

type AppRegistryConfig = AppConfig | FolderConfig

export const APP_REGISTRY: Record<string, AppRegistryConfig> = {
    agentDashboard: {
        id: 'agentDashboard',
        name: 'Dashboard',
        icon: '/svg/dashboard_ico.svg',
        component: DashboardApplication,
        description: 'Tableau de bord principal du système Protocol',
        type: 'app',
        desktopView: true,
        requireAuth: false,
        roles: [],
        defaultPosition: { x: 110, y: 20 },
        pinned: true,
    },

    externalDataDestiny: {
        id: 'externalDataDestiny',
        name: 'Data Destiny',
        icon: '/svg/dataDestiny.svg',
        component: DataDestinyApplication,
        description: 'Analyseur de données Destiny 2',
        type: 'app',
        desktopView: true,
        requireAuth: false,
        roles: [],
        defaultPosition: { x: 880, y: 45 },
        pinned: true,
    },

    documents: {
        id: 'documents',
        name: 'Documents',
        icon: '/svg/folder.svg',
        component: FolderApplication,
        description: 'Dossier système contenant des fichiers',
        type: 'folder',
        desktopView: true,
        requireAuth: false,
        roles: [],
        defaultPosition: { x: 500, y: 320 },
        pinned: true,
        content: {
            files: [
                {
                    id: 'notes-txt',
                    name: 'Notes.txt',
                    type: 'file' as const,
                    extension: 'txt',
                    content: 'Bienvenue dans vos notes !\n\nVous pouvez écrire ici vos pensées, idées, et remarques importantes.\n\n- Idée 1\n- Idée 2\n- Idée 3'
                },
                {
                    id: 'ideas-md',
                    name: 'Ideas.md',
                    type: 'file' as const,
                    extension: 'md',
                    content: getMarkdownContent('ideas.md')
                }
            ],
            folders: {
                'Assets': {
                    id: 'assets-folder',
                    name: 'Assets',
                    type: 'folder' as const,
                    files: [
                        {
                            id: 'logo-png',
                            name: 'protocol-logo.png',
                            type: 'file' as const,
                            extension: 'png',
                            content: '/img/protocol_text_glitch.png'
                        },
                        {
                            id: 'wallpaper-png',
                            name: 'wallpaper.png',
                            type: 'file' as const,
                            extension: 'png',
                            content: '/img/wallpaper_desktop.png'
                        },
                        {
                            id: 'vector-webp',
                            name: 'vector.webp',
                            type: 'file' as const,
                            extension: 'webp',
                            content: '/img/vector.webp'
                        }
                    ]
                },
                'Projects': {
                    id: 'projects-folder',
                    name: 'Projects',
                    type: 'folder' as const,
                    files: [
                        {
                            id: 'config-json',
                            name: 'config.json',
                            type: 'file' as const,
                            extension: 'json',
                            content: JSON.stringify({
                                "project": {
                                    "name": "ANOM_WEB",
                                    "version": "0.3.0",
                                    "description": "Desktop OS simulation with file system"
                                },
                                "features": {
                                    "fileSystem": true,
                                    "windowManager": true,
                                    "zIndexManagement": true,
                                    "markdownSupport": true
                                }
                            }, null, 2)
                        },
                        {
                            id: 'readme-md',
                            name: 'README.md',
                            type: 'file' as const,
                            extension: 'md',
                            content: getMarkdownContent('project-readme.md')
                        }
                    ]
                }
            }
        }
    },

    settings: {
        id: 'settings',
        name: 'Settings',
        icon: React.createElement(Settings),
        component: SettingsApplication,
        description: 'System settings and configuration',
        type: 'app',
        desktopView: false,
        requireAuth: false,
        roles: [],
        defaultPosition: { x: 300, y: 400 },
        pinned: false,
    },
    zenith: {
        id: 'zenith',
        name: 'Zenith Network',
        icon: '/svg/folder/zenith.svg',
        component: FolderApplication,
        description: 'Zenith Network - Accès restreint',
        type: 'folder',
        desktopView: true,
        requireAuth: true,
        roles: ['FOUNDER'],
        visibleWithoutRole: true,
        defaultPosition: { x: 1600, y: 520 },
        pinned: false,
        content: {
            files: [
            ],
            folders: {}
        }
    },
} as const
