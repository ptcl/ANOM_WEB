"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"

export function ModeToggle() {
    const { setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false)

    // Éviter le mismatch d'hydratation
    React.useEffect(() => {
        setMounted(true)
    }, [])

    // Afficher un placeholder pendant l'hydratation
    if (!mounted) {
        return (
            <div className="flex items-center border-1 border-transparent gap-2 cursor-pointer py-1 px-1 hover:bg-muted hover:border-1 hover:border-white/15 h-full transition-all rounded">
                <div className="w-[18px] h-[18px]" />
            </div>
        )
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild title="Toggle theme">
                <div className="flex items-center border-1 border-transparent gap-2 cursor-pointer py-1 px-1 hover:bg-muted hover:border-1 hover:border-white/15 h-full transition-all rounded">
                    {resolvedTheme === "dark" ? (
                        <Sun size={18} className="transition-all" />
                    ) : (
                        <Moon size={18} className="transition-all" />
                    )}
                </div>

            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer">
                    Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer">
                    Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")} className="cursor-pointer">
                    System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
