import { Play, Pause, RotateCcw, SkipForward } from "lucide-react";
import { Status } from "@/types/timer";

type TimerControlsProps = {
    status: Status; 
    onStartTimer: () => void;
    onEndTimer: () => void;
    onToggleTimer: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onResetTimer: () => void;
    onSkipTimer: () => void;
};

export const TimerControls = ({ status, onStartTimer, onEndTimer, onToggleTimer, onResetTimer, onSkipTimer }: TimerControlsProps) => {
    return (
        <div className="w-full flex border-b border-zinc-800">
            <div className="flex flex-1 aspect-square bg-zinc-950 justify-center items-center border-r border-zinc-800 hover:bg-zinc-900 transition-colors">
                <button className="flex rounded-full bg-rose-500 hover:bg-rose-400 active:bg-rose-600 w-2/3 h-2/3 justify-center items-center cursor-pointer font-semibold text-white text-sm tracking-widest uppercase transition-colors shadow-lg shadow-rose-500/20" onClick={status === "pending" ? onStartTimer : onEndTimer}>{status === "pending" ? "START" : "END"}</button>
            </div>
            <div className="flex flex-1 aspect-square bg-zinc-950 justify-center items-center border-r border-zinc-800 hover:bg-zinc-900 transition-colors">
                <button className="flex rounded-full bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 w-2/3 h-2/3 justify-center items-center cursor-pointer transition-colors shadow-md" onClick={onToggleTimer} >
                    {
                        status === "running" || status === "overtime" ?
                            <Pause size={44} color="#f43f5e" strokeWidth={2} />
                            :
                            <Play size={44} color="#f43f5e" strokeWidth={2} />
                    }
                </button>
            </div>
            <div className="flex flex-1 aspect-square bg-zinc-950 justify-center items-center border-r border-zinc-800 hover:bg-zinc-900 transition-colors">
                <button className="flex rounded-full bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 w-2/3 h-2/3 justify-center items-center cursor-pointer transition-colors shadow-md" onClick={onResetTimer}>
                    <RotateCcw size={44} color="#71717a" strokeWidth={2} />
                </button>
            </div>
            <div className="flex flex-1 aspect-square bg-zinc-950 justify-center items-center hover:bg-zinc-900 transition-colors">
                <button className="flex rounded-full bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 w-2/3 h-2/3 justify-center items-center cursor-pointer transition-colors shadow-md" onClick={onSkipTimer}>
                    <SkipForward size={44} color="#f43f5e" strokeWidth={2} />
                </button>
            </div>
        </div>
    );
};
