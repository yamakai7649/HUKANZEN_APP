import { useRollingDigit } from "@/hooks/useRollingDigit";

type RollingDigitProps = {
    digit: string;
    max: number;
};

export const RollingDigit = ({ digit, max }: RollingDigitProps) => {
    const {
        digits,
        isTransitioning,
        currentIndex,
        handleTransitionEnd,
    } = useRollingDigit(digit, max);


    return (
        // ★スタイル追加1：はみ出しを隠す「窓枠」を作る（h-[1.2em] と overflow-hidden）
        <div className="h-[1.2em] w-[1ch] overflow-hidden inline-flex justify-center">
            <div
                style={{ transform: `translateY(-${currentIndex * 100}%)` }}
                className={`flex flex-col ${isTransitioning
                    ? "transition-transform duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)]"
                    : "transition-none"
                    }`}
                onTransitionEnd={handleTransitionEnd}
            >
                {
                    digits.map((num, i) => (
                        // ★スタイル追加2：数字1個ずつの高さを、窓枠の高さ(1.2em)と完全に一致させる
                        <span key={i} className="h-[1.2em] leading-[1.2em] text-center block">
                            {num}
                        </span>
                    ))
                }
            </div>
        </div>
    );
};
