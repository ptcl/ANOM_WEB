'use client'

import BaseApplication from '@/components/desktop/core/BaseApplication'

interface DashboardApplicationProps {
    appId?: string
}

export default function DashboardApplication({ appId = 'agentDashboard' }: DashboardApplicationProps) {
    return (
        <BaseApplication appId={appId}>
            <div className="h-full flex flex-col">
                <div className="flex-1 overflow-auto">
                    <iframe
                        src="/desktop/agent/dashboard"
                        className="w-full h-full border-0"
                        title="Dashboard Application"
                        onLoad={(e) => {
                            const iframe = e.currentTarget as HTMLIFrameElement
                            const token = localStorage.getItem('protocol_token')
                            if (iframe?.contentWindow && token) {
                                iframe.contentWindow.postMessage({ type: 'AUTH_TOKEN', token }, window.location.origin)
                            }
                        }}
                    />
                </div>
            </div>
        </BaseApplication>
    )
}

