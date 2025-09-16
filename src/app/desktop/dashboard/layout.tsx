'use client'

export default function DashboardLayout({ children, }: { children: React.ReactNode }) {

    return (
        <div className="h-full w-full bg-gray-900">
            {children}
        </div>
    )
}
