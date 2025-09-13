'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAuth } from '../provider/AuthProvider'

interface LogoutButtonProps {
    variant?: 'default' | 'outline' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    children?: React.ReactNode
    className?: string
}

export const LogoutButton = ({ variant = 'outline', children, className }: LogoutButtonProps) => {
    const { logout } = useAuth()
    const router = useRouter()

    const handleLogout = () => {
        logout()
        router.push('/')
        // console.log('👋 User logged out successfully')
    }

    return (
        <Button
            onClick={handleLogout}
            variant={variant}
            className={className}
        >
            {children || 'Se déconnecter'}
        </Button>
    )
}

export const LogoutButtonWithConfirm = ({ variant = 'outline', children, className }: LogoutButtonProps) => {
    const { logout } = useAuth()
    const router = useRouter()

    const handleLogout = () => {
        const confirmed = window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')

        if (confirmed) {
            logout()
            router.push('/')
            // console.log('👋 User logged out successfully')
        }
    }

    return (
        <Button onClick={handleLogout} variant={variant} className={className}>
            {children || 'Se déconnecter'}
        </Button>
    )
}