import { formatUptime } from "@/anom/date";
import React, { useEffect, useState } from "react";

type Props = {
    startedAt: string | Date; // timestamp ISO ou Date
    refreshIntervalMs?: number; // par défaut 1000ms
};

export default function TerminalUptime({ startedAt, refreshIntervalMs = 1000 }: Props) {
    const startDate = typeof startedAt === "string" ? new Date(startedAt) : startedAt;
    const [uptime, setUptime] = useState(() => formatUptime(startDate));

    useEffect(() => {
        const id = setInterval(() => {
            setUptime(formatUptime(startDate));
        }, refreshIntervalMs);

        return () => clearInterval(id);
    }, [startDate, refreshIntervalMs]);

    return (
        <div className="terminal-line">
            <span className="static">{uptime}</span>
        </div>
    );
}
