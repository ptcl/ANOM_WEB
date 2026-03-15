export const HISTORY_ACTIONS = {
    // Profile
    PROFILE_UPDATE: 'PROFILE_UPDATE',
    THEME_CHANGE: 'THEME_CHANGE',
    SETTINGS_UPDATE: 'SETTINGS_UPDATE',
    SYNC_STATS: 'SYNC_STATS',
    // Badges
    BADGE_EARNED: 'BADGE_EARNED',
    BADGE_REMOVED: 'BADGE_REMOVED',
    // Lore
    LORE_UNLOCKED: 'LORE_UNLOCKED',
    LORE_READ: 'LORE_READ',
    // Timeline
    TIMELINE_STARTED: 'TIMELINE_STARTED',
    TIMELINE_COMPLETED: 'TIMELINE_COMPLETED',
    FRAGMENT_COLLECTED: 'FRAGMENT_COLLECTED',
    // Contracts
    CONTRACT_CREATED: 'CONTRACT_CREATED',
    CONTRACT_VALIDATED: 'CONTRACT_VALIDATED',
    CONTRACT_CANCELLED: 'CONTRACT_CANCELLED',
    // Divisions
    DIVISION_JOINED: 'DIVISION_JOINED',
    DIVISION_LEFT: 'DIVISION_LEFT',
    DIVISION_PROMOTED: 'DIVISION_PROMOTED',
    // Admin (founder only visibility)
    ROLE_ADDED: 'ROLE_ADDED',
    ROLE_REMOVED: 'ROLE_REMOVED',
    ACCOUNT_DEACTIVATED: 'ACCOUNT_DEACTIVATED',
    ACCOUNT_REACTIVATED: 'ACCOUNT_REACTIVATED'
} as const;

export type HistoryAction = typeof HISTORY_ACTIONS[keyof typeof HISTORY_ACTIONS];

// Colors by category
export const HISTORY_COLORS: Record<HistoryAction, { bg: string; text: string; border: string }> = {
    // Profile - Blue
    PROFILE_UPDATE: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/50' },
    THEME_CHANGE: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/50' },
    SETTINGS_UPDATE: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/50' },
    SYNC_STATS: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/50' },

    // Badges - Yellow/Gold
    BADGE_EARNED: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/50' },
    BADGE_REMOVED: { bg: 'bg-yellow-500/20', text: 'text-yellow-600', border: 'border-yellow-600/50' },

    // Lore - Purple
    LORE_UNLOCKED: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/50' },
    LORE_READ: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/50' },

    // Timeline - Green
    TIMELINE_STARTED: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/50' },
    TIMELINE_COMPLETED: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/50' },
    FRAGMENT_COLLECTED: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/50' },

    // Contracts - Cyan
    CONTRACT_CREATED: { bg: 'bg-cyan-500/20', text: 'text-cyan-400', border: 'border-cyan-500/50' },
    CONTRACT_VALIDATED: { bg: 'bg-cyan-500/20', text: 'text-cyan-400', border: 'border-cyan-500/50' },
    CONTRACT_CANCELLED: { bg: 'bg-cyan-500/20', text: 'text-cyan-600', border: 'border-cyan-600/50' },

    // Divisions - Orange
    DIVISION_JOINED: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/50' },
    DIVISION_LEFT: { bg: 'bg-orange-500/20', text: 'text-orange-600', border: 'border-orange-600/50' },
    DIVISION_PROMOTED: { bg: 'bg-orange-500/20', text: 'text-orange-300', border: 'border-orange-300/50' },

    // Admin - Red
    ROLE_ADDED: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/50' },
    ROLE_REMOVED: { bg: 'bg-red-500/20', text: 'text-red-600', border: 'border-red-600/50' },
    ACCOUNT_DEACTIVATED: { bg: 'bg-red-500/20', text: 'text-red-500', border: 'border-red-500/50' },
    ACCOUNT_REACTIVATED: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-400/50' },
};

// Get color config for an action (with fallback)
export const getHistoryColor = (action: string) => {
    return HISTORY_COLORS[action as HistoryAction] || {
        bg: 'bg-gray-500/20',
        text: 'text-gray-400',
        border: 'border-gray-500/50'
    };
};
