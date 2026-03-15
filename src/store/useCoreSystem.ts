import { create } from 'zustand'

interface ICoreSystemState {
    isOpen: boolean
    openCoreSystem: () => void
    closeCoreSystem: () => void
    toggleCoreSystem: () => void
    reset: () => void
}

const initialState = {
    isOpen: false,
}

export const useCoreSystem = create<ICoreSystemState>((set) => ({
    ...initialState,
    openCoreSystem: () => set({ isOpen: true }),
    closeCoreSystem: () => set({ isOpen: false }),
    toggleCoreSystem: () => set((state) => ({ isOpen: !state.isOpen })),
    reset: () => set({ ...initialState }),
}))
