type ModeSelectorProps = {
    onSwitchMode: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const ModeSelector = ({ onSwitchMode }: ModeSelectorProps) => {
    return (
        <div className="w-full flex">
            <button className="flex-1" onClick={onSwitchMode} value="pomodoro">pomodoro</button>
            <button className="flex-1" onClick={onSwitchMode} value="shortBreak">short break</button>
            <button className="flex-1" onClick={onSwitchMode} value="longBreak">long break</button>
        </div>
    );
};
