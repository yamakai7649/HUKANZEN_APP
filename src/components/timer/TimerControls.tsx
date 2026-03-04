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
        <div className="w-full flex">
            <div className="flex flex-1 aspect-square bg-pink-300 justify-center items-center">
                <button className="flex rounded-full bg-pink-200 w-2/3 h-2/3 justify-center items-center cursor-pointer" onClick={status === "pending" ? onStartTimer : onEndTimer}>{status === "pending" ? "START" : "END"}</button>
            </div>
            <div className="flex flex-1 aspect-square bg-pink-300 justify-center items-center">
                <button className="flex rounded-full bg-pink-200 w-2/3 h-2/3 justify-center items-center cursor-pointer" onClick={onToggleTimer} >
                    {
                        status === "running" || status === "overtime" ?
                            <Pause size={50} color="#d9597f" strokeWidth={3} />
                            :
                            <Play size={50} color="#d9597f" strokeWidth={3} />
                    }
                </button>
            </div>
            <div className="flex flex-1 aspect-square bg-black justify-center items-center">
                <button className="flex rounded-full bg-black w-2/3 h-2/3 justify-center items-center cursor-pointer" onClick={onResetTimer}>
                    <RotateCcw size={50} color="#ffffff" strokeWidth={3} />
                </button>
            </div>
            <div className="flex flex-1 aspect-square bg-pink-300 justify-center items-center">
                <button className="flex rounded-full bg-pink-200 w-2/3 h-2/3 justify-center items-center cursor-pointer" onClick={onSkipTimer}>
                    <SkipForward size={50} color="#d9597f" strokeWidth={3} />
                </button>
            </div>
        </div>
    );
};
