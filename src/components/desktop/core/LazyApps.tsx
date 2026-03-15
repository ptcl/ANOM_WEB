import dynamic from 'next/dynamic'
import Loader from '@/components/lottie/loader/loader'

// Loading component fallback using the existing Lottie loader
const AppLoading = () => (
    <div className="h-full w-full flex items-center justify-center">
        <Loader width={50} height={50} />
    </div>
)

// Dynamic imports
export const DashboardApplication = dynamic(() => import('@/components/desktop/applications/Dashboard'), {
    loading: () => <AppLoading />,
    ssr: false
})

export const DataDestinyApplication = dynamic(() => import('@/components/desktop/applications/DataDestiny'), {
    loading: () => <AppLoading />,
    ssr: false
})

export const FolderApplication = dynamic(() => import('@/components/desktop/applications/FolderApplication'), {
    loading: () => <AppLoading />,
    ssr: false
})

export const SettingsApplication = dynamic(() => import('@/components/desktop/applications/SettingsApplication'), {
    loading: () => <AppLoading />,
    ssr: false
})
