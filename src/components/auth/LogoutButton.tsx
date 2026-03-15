'use client'

import { useState } from 'react'
import { useAuthentication } from '@/hooks/useAuthentication'
import { LogOut, AlertTriangle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { motion } from "motion/react"
interface LogoutDropdownItemProps {
    className?: string
    withConfirmation?: boolean
}

export const LogoutConfirm = ({ className, withConfirmation = true }: LogoutDropdownItemProps) => {
    const t = useTranslations();
    const { logout } = useAuthentication()
    const [isConfirming, setIsConfirming] = useState(false)

    const handleClick = (e: React.MouseEvent) => {
        if (!withConfirmation) {
            logout('/')
            return
        }

        if (!isConfirming) {
            e.preventDefault()
            setIsConfirming(true)

            setTimeout(() => setIsConfirming(false), 2000)
        } else {
            logout('/')
        }
    }

    return (
        <motion.div onClick={handleClick} className={`${className} relative cursor-pointer select-none flex items-center justify-center px-3 py-2 overflow-hidden rounded-md transition-all duration-300 bg-transparent hover:bg-[var(--black-3)] w-[180px]`} initial={false}>
            <motion.div className="flex w-full" animate={{ x: isConfirming ? "-100%" : "0%" }} transition={{ duration: 0.3, ease: "easeInOut" }}>
                <div className="flex items-center justify-center min-w-full">
                    <LogOut className="mr-2 h-4 w-4" />
                    {t('commun.buttons.logout')}
                </div>
                <div className="flex items-center justify-center min-w-full text-[var(--danger)]">
                    <AlertTriangle className="mr-2 h-4 w-4 animate-pulse" />
                    {t('commun.buttons.areYouSure')}
                </div>
            </motion.div>
        </motion.div>
    )
}

export const LogoutSimple = ({ className }: { className?: string }) => {
    const { logout } = useAuthentication()
    const t = useTranslations();

    return (
        <div onClick={() => logout('/')} className={className + ' cursor-pointer'}>
            <LogOut className="mr-2 h-4 w-4" />
            {t('commun.buttons.logout')}
        </div>
    )
}