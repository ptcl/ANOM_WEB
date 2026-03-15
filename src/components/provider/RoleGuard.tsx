"use client";

import { useAgent } from "@/hooks/use-agent";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";
import type { AgentRoleId } from "@/types/role";
import ComponentSvg from "../svg/ComponentSvg";
import { useTranslations } from "next-intl";
import { useAuthentication } from "@/hooks/useAuthentication";

const ROLE_MAP = ["AGENT", "ECHO", "ORACLE", "ARCHITECT", "FOUNDER", "EMISSARY"] as const;

interface RoleGuardProps {
    roles?: string[];
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export function RoleGuard({ roles, children, fallback }: RoleGuardProps) {
    const { isAuthenticated, isLoading: isAuthLoading } = useAuthentication();
    const { agent, isLoading: isAgentLoading } = useAgent();
    const pathname = usePathname();
    const router = useRouter();
    const t = useTranslations();

    const requiredRole = useMemo(() => {
        if (roles?.length) return roles;
        const match = pathname.match(/\/desktop\/([a-z]+)/i);
        if (!match) return [];
        const role = match[1].toUpperCase();
        return ROLE_MAP.includes(role as typeof ROLE_MAP[number]) ? [role] : [];
    }, [pathname, roles]);

    const hasAccess = useMemo(() => {
        if (!agent || requiredRole.length === 0) return false;
        if (requiredRole.includes("AGENT")) return true;
        return requiredRole.some((r) => agent.protocol?.roles?.some(role => role.roleId === (r as AgentRoleId)));
    }, [agent, requiredRole]);

    const isLoading = isAuthLoading || isAgentLoading;
    if (isLoading) {
        return null
    }

    if (!hasAccess) {
        return (
            fallback ?? (
                <div className="flex flex-col items-center justify-center h-full text-center text-[var(--white-foreground)]">
                    <ComponentSvg color="var(--danger)" width={128} height={128} variant="anomOff" className="mb-4" />
                    <h1 className="text-2xl font-semibold mb-1 text-[var(--danger)] max-w-md">{t("protocol.restrictedTitle")}</h1>
                </div>
            )
        );
    }

    return <>{children}</>;
}
