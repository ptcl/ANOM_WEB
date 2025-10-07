'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { Search, X } from 'lucide-react'
import { InputGroup, InputGroupAddon, InputGroupInput } from './input-group'

interface SearchBarProps {
    placeholder?: string
    value?: string
    onChange?: (value: string) => void
    onSearch?: (value: string) => void
    onKeyDown?: (e: React.KeyboardEvent) => void
    className?: string
    showClearButton?: boolean
    disabled?: boolean
}

export default function SearchBar({
    placeholder = "Rechercher...",
    value = "",
    onChange,
    onSearch,
    onKeyDown,
    className,
    showClearButton = true,
    disabled = false
}: SearchBarProps) {
    const [internalValue, setInternalValue] = useState(value)

    const currentValue = onChange ? value : internalValue
    const handleChange = (newValue: string) => {
        if (onChange) {
            onChange(newValue)
        } else {
            setInternalValue(newValue)
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (onSearch) {
            onSearch(currentValue)
        }
    }

    const handleClear = () => {
        handleChange("")
        if (onSearch) {
            onSearch("")
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        // Appeler d'abord la fonction onKeyDown personnalisée si elle existe
        if (onKeyDown) {
            onKeyDown(e)
        }
        
        // Puis gérer le comportement par défaut si pas empêché
        if (e.key === 'Enter' && !e.defaultPrevented) {
            handleSubmit(e)
        }
    }

    return (
        <form onSubmit={handleSubmit} className={cn("w-full", className)}>
            <InputGroup>
                <InputGroupAddon>
                    <Search className="w-4 h-4" />
                </InputGroupAddon>
                <InputGroupInput type="text" value={currentValue} onChange={(e) => handleChange(e.target.value)} onKeyDown={handleKeyDown} placeholder={placeholder} disabled={disabled} />
                {showClearButton && currentValue && (
                    <InputGroupAddon>
                        <button type="button" onClick={handleClear} className="text-muted-foreground hover:text-foreground transition-colors p-0 border-0 bg-transparent" disabled={disabled}>
                            <X className="w-4 h-4" />
                        </button>
                    </InputGroupAddon>
                )}
            </InputGroup>
        </form>
    )
}