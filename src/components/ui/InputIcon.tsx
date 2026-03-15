'use client'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface InputIconProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: React.ReactNode
    position?: 'left' | 'right'
}

export function InputIcon({ icon = <Search size={16} />, position = 'left', className, ...props }: InputIconProps) {
    return (
        <div className={cn('relative flex items-center', className)}>
            {position === 'left' && (
                <span className="absolute left-3 text-gray-400 pointer-events-none">
                    {icon}
                </span>
            )}

            <Input
                {...props}
                className={cn(
                    'w-full',
                    position === 'left' ? 'pl-9 pr-3' : 'pl-3 pr-9' // padding ajusté selon la position
                )}
            />

            {position === 'right' && (
                <span className="absolute right-3 text-gray-400 pointer-events-none">
                    {icon}
                </span>
            )}
        </div>
    )
}
