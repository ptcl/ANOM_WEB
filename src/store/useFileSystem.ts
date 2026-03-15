// src/store/useFileSystem.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type FileType = 'file' | 'folder' | 'app'

interface BaseNode {
    id: string
    name: string
    type: FileType
    parentId?: string | null
    icon?: string
    metadata?: Record<string, string>
    createdAt: string
    updatedAt: string
}

// 📁 Folder
export interface FolderNode extends BaseNode {
    type: 'folder'
}

// 📄 File
export interface FileNodeFile extends BaseNode {
    type: 'file'
    extension: string
    content?: string | object
}

// ⚙️ App alias (raccourci vers une app du registre)
export interface FileNodeApp extends BaseNode {
    type: 'app'
    componentId: string
}

export type FileNode = FolderNode | FileNodeFile | FileNodeApp

// ---------- Payloads de création (pas de createdAt/updatedAt ici)
export type NewFolder = Omit<FolderNode, 'createdAt' | 'updatedAt'>
export type NewFile = Omit<FileNodeFile, 'createdAt' | 'updatedAt'>
export type NewApp = Omit<FileNodeApp, 'createdAt' | 'updatedAt'>
export type NewNode = NewFolder | NewFile | NewApp

interface FileSystemState {
    files: Record<string, FileNode>;

    // CRUD générique
    createFile: (file: NewNode) => void;
    updateFile: (id: string, data: Partial<FileNode>) => void;
    deleteFile: (id: string) => void;
    moveFile: (id: string, newParentId: string | null) => void;
    renameFile: (id: string, newName: string) => void;

    // Getters
    getChildren: (parentId?: string | null) => FileNode[];
    getFileById: (id: string) => FileNode | undefined;

    // ✅ Helpers haut-niveau Files + Folders
    createFolder: (name: string, parentId?: string | null) => void;
    createTextFile: (name: string, parentId?: string | null, content?: string) => void;
    createAppShortcut: (name: string, componentId: string, parentId?: string | null) => void;

    // ✅ Nouveau CRUD dossier complet :
    renameFolder: (id: string, newName: string) => void;
    moveFolder: (id: string, newParentId: string | null) => void;
    deleteFolderRecursive: (id: string) => void;
}

function uid() {
    // évite les soucis SSR si crypto n’est pas dispo
    try {
        return crypto.randomUUID()
    } catch {
        return 'id_' + Math.random().toString(36).slice(2, 10)
    }
}

export const useFileSystem = create<FileSystemState>()(
    persist(
        (set, get) => ({
            // ✅ root strictement un dossier (pas de champs spécifiques file/app)
            files: {
                root: {
                    id: 'root',
                    name: 'Desktop',
                    type: 'folder',
                    parentId: null,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                },
            },

            createFile: (file) =>
                set((state) => {
                    const now = new Date().toISOString()
                    const id = file.id ?? uid()

                    if (file.type === 'file' && !file.extension) {
                        throw new Error(`createFile: file must include 'extension'`)
                    }
                    if (file.type === 'app' && !file.componentId) {
                        throw new Error(`createFile: app must include 'componentId'`)
                    }

                    const newFile: FileNode = {
                        ...file,
                        id,
                        createdAt: now,
                        updatedAt: now,
                    } as FileNode

                    return { files: { ...state.files, [id]: newFile } }
                }),

            updateFile: (id, data) =>
                set((state) => {
                    const curr = state.files[id]
                    if (!curr) return state
                    // merge “bête”, tu sais ce que tu fais côté appelant
                    const updated: FileNode = (() => {
                        if (curr.type === 'app') {
                            return {
                                ...curr,
                                ...data,
                                type: 'app',
                                componentId: curr.componentId,
                                updatedAt: new Date().toISOString(),
                            } as FileNodeApp
                        } else if (curr.type === 'file') {
                            return {
                                ...curr,
                                ...data,
                                type: 'file',
                                extension: (curr as FileNodeFile).extension,
                                updatedAt: new Date().toISOString(),
                            } as FileNodeFile
                        } else {
                            return {
                                ...curr,
                                ...data,
                                type: 'folder',
                                updatedAt: new Date().toISOString(),
                            } as FolderNode
                        }
                    })()
                    return { files: { ...state.files, [id]: updated } }
                }),

            renameFile: (id, newName) =>
                set((state) => {
                    const curr = state.files[id]
                    if (!curr) return state
                    return {
                        files: {
                            ...state.files,
                            [id]: { ...curr, name: newName, updatedAt: new Date().toISOString() },
                        },
                    }
                }),

            deleteFile: (id) =>
                set((state) => {
                    // Option simple: on supprime juste ce nœud
                    const next = { ...state.files }
                    delete next[id]
                    return { files: next }
                }),
            renameFolder: (id, newName) =>
                set((state) => {
                    const folder = state.files[id];
                    if (!folder || folder.type !== 'folder') return state;
                    return {
                        files: {
                            ...state.files,
                            [id]: {
                                ...folder,
                                name: newName,
                                updatedAt: new Date().toISOString(),
                            },
                        },
                    };
                }),

            moveFolder: (id, newParentId) =>
                set((state) => {
                    const folder = state.files[id];
                    if (!folder || folder.type !== 'folder') return state;
                    if (id === 'root') return state; // Sécurité
                    return {
                        files: {
                            ...state.files,
                            [id]: {
                                ...folder,
                                parentId: newParentId,
                                updatedAt: new Date().toISOString(),
                            },
                        },
                    };
                }),

            deleteFolderRecursive: (id) =>
                set((state) => {
                    if (id === 'root') return state; // Sécurité

                    const recursiveDelete = (files: Record<string, FileNode>, targetId: string) => {
                        for (const f of Object.values(files)) {
                            if (f.parentId === targetId) {
                                files = recursiveDelete(files, f.id);
                            }
                        }
                        delete files[targetId];
                        return files;
                    };

                    return {
                        files: recursiveDelete({ ...state.files }, id),
                    };
                }),
            moveFile: (id, newParentId) =>
                set((state) => {
                    const curr = state.files[id]
                    if (!curr) return state
                    return {
                        files: {
                            ...state.files,
                            [id]: { ...curr, parentId: newParentId, updatedAt: new Date().toISOString() },
                        },
                    }
                }),

            getChildren: (parentId = null) => {
                return Object.values(get().files).filter((f) => (f.parentId ?? null) === parentId)
            },

            getFileById: (id) => get().files[id],

            // Helpers
            createFolder: (name, parentId = 'root') => {
                get().createFile({
                    id: uid(),
                    name,
                    type: 'folder',
                    parentId,
                    icon: '/svg/folder.svg',
                })
            },

            createTextFile: (name, parentId = 'root', content = '') => {
                get().createFile({
                    id: uid(),
                    name,
                    type: 'file',
                    extension: 'txt',
                    content,
                    parentId,
                    icon: '/svg/file_txt.svg',
                })
            },

            createAppShortcut: (name, componentId, parentId = 'root') => {
                get().createFile({
                    id: uid(),
                    name,
                    type: 'app',
                    componentId,
                    parentId,
                    icon: '/svg/app_shortcut.svg',
                })
            },
        }),
        {
            name: 'protocol-filesystem',
        }
    )
)
