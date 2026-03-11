import { RollingDigit } from "./RollingDigit";
import { Status } from "@/types/timer";
import { useTimer } from "@/hooks/useTimer";

type TimerDisplayProps = {
    status: Status; 
    startTime: number | null;
    snapshotTime: number;
    onTimeUp: () => void;
};

const splitTimeToDigits = (milliSeconds: number) => {
    let seconds = Math.ceil(milliSeconds / 1000);

    if (seconds < 0) {
        seconds = seconds * -1;
    }

    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");

    const m1 = m[0];
    const m2 = m[1];
    const s1 = s[0];
    const s2 = s[1];
    
    return [m1, m2, s1, s2];
};

export const TimerDisplay = ({ status, startTime, snapshotTime, onTimeUp }: TimerDisplayProps) => {
    const remainingTime = useTimer(status, startTime, snapshotTime, onTimeUp);
    
    const isCountUp: boolean = status === "overtime";

    const [m1, m2, s1, s2] = splitTimeToDigits(remainingTime);

    return (
        <div className="flex flex-auto items-center justify-center bg-[#d9c584]">
            <div className="flex items-center text-8xl font-bold font-mono text-[#333]">
                <RollingDigit digit={m1} max={6} isCountUp={isCountUp}/>
                <RollingDigit digit={m2} max={9} isCountUp={isCountUp}/>
                
                <span className="mx-2 pb-4">:</span>
                
                <RollingDigit digit={s1} max={5} isCountUp={isCountUp}/>
                <RollingDigit digit={s2} max={9} isCountUp={isCountUp}/>
            </div>
        </div>
    );
};
