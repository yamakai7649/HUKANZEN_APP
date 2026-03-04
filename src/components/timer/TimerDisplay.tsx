import { RollingDigit } from "./RollingDigit";
import { Status } from "@/types/timer";

type TimerDisplayProps = {
    remainingTime: number;
    status: Status; 
};

const splitTimeToDigits = (seconds: number) => {
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

export const TimerDisplay = ({ remainingTime, status }: TimerDisplayProps) => {
    const isCountUp: boolean = status === "overtime";

    const m1 = splitTimeToDigits(remainingTime)[0];
    const m2 = splitTimeToDigits(remainingTime)[1];
    const s1 = splitTimeToDigits(remainingTime)[2];
    const s2 = splitTimeToDigits(remainingTime)[3];

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
