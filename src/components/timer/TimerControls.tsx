import { Play, Pause, RotateCcw, SkipForward } from "lucide-react";
import { Status } from "@/types/timer";

type TimerControlsProps = {
    status: Status;
    onStartEnd: () => void;
    onToggleTimer: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onReset: () => void;
    onSkip: () => void;
};

export const TimerControls = ({ status, onStartEnd, onToggleTimer, onReset, onSkip }: TimerControlsProps) => {
    return (
        <div className="w-full flex">
            <div className="flex flex-1 aspect-square bg-pink-300 justify-center items-center">
                <button className="flex rounded-full bg-pink-200 w-2/3 h-2/3 justify-center items-center cursor-pointer" onClick={onStartEnd} value={status === "pending" ? "running" : "pending"}>{status === "pending" ? "START" : "END"}</button>
            </div>
            <div className="flex flex-1 aspect-square bg-pink-300 justify-center items-center">
                <button className="flex rounded-full bg-pink-200 w-2/3 h-2/3 justify-center items-center cursor-pointer" onClick={onToggleTimer} value={status === "running" ? "paused" : "running"}>
                    {
                        status === "running" ?
                            <Pause size={50} color="#d9597f" strokeWidth={3} />
                            :
                            <Play size={50} color="#d9597f" strokeWidth={3} />
                    }
                </button>
            </div>
            <div className="flex flex-1 aspect-square bg-black justify-center items-center">
                <button className="flex rounded-full bg-black w-2/3 h-2/3 justify-center items-center cursor-pointer" onClick={onReset}>
                    <RotateCcw size={50} color="#ffffff" strokeWidth={3} />
                </button>
            </div>
            <div className="flex flex-1 aspect-square bg-pink-300 justify-center items-center">
                <button className="flex rounded-full bg-pink-200 w-2/3 h-2/3 justify-center items-center cursor-pointer" onClick={onSkip}>
                    <SkipForward size={50} color="#d9597f" strokeWidth={3} />
                </button>
            </div>
        </div>
    );
};
