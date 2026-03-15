import { Frame, Handshake, PieChart, SquareTerminal, Home, FileText, Settings, Map, Key, User } from "lucide-react";

export const navMain = [
    {
        title: "navbar.agent",
        url: "/desktop/agent/dashboard",
        icon: SquareTerminal,
        isActive: true,
        items: [
            {
                title: "navbar.dashboard",
                url: "/desktop/agent/dashboard",
                icon: Home,
            },
            {
                title: "navbar.contract",
                url: "/desktop/agent/contract",
                icon: FileText,
            },
            {
                title: "navbar.timeline",
                url: "/desktop/agent/timelines",
                icon: FileText,
            },
        ],
    },

]

export const navFounder = [
    {
        title: "navbar.founder",
        url: "#",
        icon: Handshake,
        items: [
            {
                title: "navbar.dashboard",
                url: "/desktop/founder/dashboard",
                icon: Home,
            },
        ],
    },
]
export const navEcho = [
    {
        title: "navbar.echo",
        url: "#",
        icon: Handshake,
        items: [
            {
                title: "navbar.dashboard",
                url: "/desktop/echo/dashboard",
                icon: Home,
            },
        ],
    },
]
export const navOracle = [
    {
        title: "navbar.oracle",
        url: "#",
        icon: Handshake,
        items: [
            {
                title: "navbar.dashboard",
                url: "/desktop/oracle/dashboard",
                icon: Home,
            },
        ],
    },
]
export const navArchitect = [
    {
        title: "navbar.architect",
        url: "#",
        icon: Handshake,
        items: [
            {
                title: "navbar.dashboard",
                url: "/desktop/architect/dashboard",
                icon: Home,
            },
        ],
    },
]
export const navEmissary = [
    {
        title: "navbar.emissary",
        url: "#",
        icon: Handshake,
        items: [
            {
                title: "navbar.dashboard",
                url: "/desktop/emissary/dashboard",
                icon: Home,
            },
        ],
    },
]

export const navSettings = [
    {
        title: "navbar.settings",
        url: "#",
        icon: Handshake,
        items: [
            {
                title: "navbar.welcome",
                url: "/desktop/settings",
                icon: Home,
            },
            {
                title: "navbar.account",
                url: "/desktop/settings/account",
                icon: User,
            },
            {
                title: "navbar.protocol",
                url: "/desktop/settings/protocol",
                icon: Handshake,
            },
            {
                title: "navbar.redeem",
                url: "/desktop/settings/redeem",
                icon: Key,
            },
        ],
    },
]


export const projects = [
    {
        name: "Soon",
        url: "#",
        icon: Frame,
    },
    {
        name: "Sales & Marketing",
        url: "#",
        icon: PieChart,
    },
    {
        name: "Travel",
        url: "#",
        icon: Map,
    },
]