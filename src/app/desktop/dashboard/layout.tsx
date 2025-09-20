'use client'

import Navbar from "@/components/dashboard/Navbar"

export default function DashboardLayout({ children, }: { children: React.ReactNode }) {

    return (
        <div className="h-full w-full flex p-2">
            <Navbar />
            <section>
                {children}
            </section>
        </div>
    )
}
