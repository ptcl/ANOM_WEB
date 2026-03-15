'use client'

import BaseApplication from '@/components/desktop/core/BaseApplication'
import { RoleGuard } from '@/components/provider/RoleGuard'
import { APP_REGISTRY } from '@/constants/appRegistry'

interface DataDestinyApplicationProps {
    appId?: string
}

export default function DataDestinyApplication({ appId = 'externalDataDestiny' }: DataDestinyApplicationProps) {
    const appConfig = APP_REGISTRY[appId]

    return (
        <BaseApplication appId={appId}>
            <RoleGuard roles={[...(appConfig.roles || [])]}>
                <div className="h-full flex flex-col">
                    <div className="flex-1 overflow-auto">
                        <iframe
                            src="https://data.destinysets.com/"
                            className="w-full h-full border-0"
                            title={`${appConfig.name} Application`}
                            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                            loading="lazy"
                        />
                    </div>
                </div>
            </RoleGuard>
        </BaseApplication>
    )
}