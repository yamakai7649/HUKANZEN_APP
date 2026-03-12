type ModeSelectorProps = {
    onSwitchMode: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const ModeSelector = ({ onSwitchMode }: ModeSelectorProps) => {
    return (
        <div className="w-full flex bg-zinc-950 border-t border-zinc-800 p-3 gap-2">
            <button className="flex-1 py-2.5 px-4 text-xs font-semibold text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors tracking-wider uppercase cursor-pointer" onClick={onSwitchMode} value="pomodoro">pomodoro</button>
            <button className="flex-1 py-2.5 px-4 text-xs font-semibold text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors tracking-wider uppercase cursor-pointer" onClick={onSwitchMode} value="shortBreak">short break</button>
            <button className="flex-1 py-2.5 px-4 text-xs font-semibold text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors tracking-wider uppercase cursor-pointer" onClick={onSwitchMode} value="longBreak">long break</button>
        </div>
    );
};
