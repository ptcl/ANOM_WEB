export function formatUptime(from: Date, options?: { showSeconds?: boolean }) {
    const now = new Date();
    let diffMs = Math.max(0, now.getTime() - from.getTime());

    const msInSecond = 1000;
    const msInMinute = msInSecond * 60;
    const msInHour = msInMinute * 60;
    const msInDay = msInHour * 24;

    const days = Math.floor(diffMs / msInDay);
    diffMs -= days * msInDay;

    const hours = Math.floor(diffMs / msInHour);
    diffMs -= hours * msInHour;

    const minutes = Math.floor(diffMs / msInMinute);
    diffMs -= minutes * msInMinute;

    const seconds = Math.floor(diffMs / msInSecond);

    const parts = [
        `${days} JOUR${days > 1 ? "S" : ""}`,
        `${hours} HEURE${hours > 1 ? "S" : ""}`,
        `${minutes} MINUTE${minutes > 1 ? "S" : ""}`,
    ];

    if (options?.showSeconds) parts.push(`${seconds} SECONDE${seconds > 1 ? "S" : ""}`);

    return parts.join(", ");
}