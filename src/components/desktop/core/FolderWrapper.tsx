import { APP_REGISTRY } from '@/constants/appRegistry'
import FolderApplication from '@/components/desktop/applications/FolderApplication'

interface FolderWrapperProps {
    id: keyof typeof APP_REGISTRY
    position?: { x: number; y: number }
    selected?: boolean
    onRegister?: (id: string, el: HTMLElement, pos: { x: number; y: number }, size: { width: number; height: number }) => void
    onUnregister?: (id: string) => void
    hideDesktopIcon?: boolean
}

export default function FolderWrapper({
    id,
    position,
    selected = false,
    onRegister,
    onUnregister,
    hideDesktopIcon = false
}: FolderWrapperProps) {
    const config = APP_REGISTRY[id]
    
    if (!config || config.type !== 'folder') {
        return null
    }

    return (
        <FolderApplication
            id={config.id}
            name={config.name}
            icon={config.icon}
            position={position}
            selected={selected}
            onRegister={onRegister}
            onUnregister={onUnregister}
            hideDesktopIcon={hideDesktopIcon}
            requireAuth={config.requireAuth}
            roles={config.roles ? [...config.roles] : []}
        />
    )
}

// Export des composants spécifiques pour chaque dossier
export function Documents(props: Omit<FolderWrapperProps, 'id'>) {
    return <FolderWrapper {...props} id="documents" />
}

export function Classified(props: Omit<FolderWrapperProps, 'id'>) {
    return <FolderWrapper {...props} id="classified" />
}

export function VexData(props: Omit<FolderWrapperProps, 'id'>) {
    return <FolderWrapper {...props} id="vex_data" />
}