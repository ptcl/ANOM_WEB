import { useAccentColor } from "./provider/AccentColorProvider";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"

export default function AccentSwitcher() {
    const { accent, setAccent } = useAccentColor();
    const accentLabel = {
        protocol: "🟦",
        bray: "🟧",
        red: "🟥"
    }[accent];
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild title="Toggle theme">
                <div className="flex items-center border-1 border-transparent gap-2 cursor-pointer py-1 px-1 hover:bg-muted hover:border-1 hover:border-white/15 h-full transition-all rounded">
                    {accentLabel}
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => setAccent("protocol")} className="cursor-pointer">
                    🟦 Protocol
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setAccent("bray")} className="cursor-pointer">
                    🟧 Bray
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setAccent("red")} className="cursor-pointer">
                    🟥 Red
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

        //        <div className="flex gap-2">
        //     <button onClick={() => setAccent("bray")}>Bray</button>
        //     <button onClick={() => setAccent("protocol")}>Protocol</button>
        //     <button onClick={() => setAccent("red")}>Red</button>
        // </div>

    );
}
