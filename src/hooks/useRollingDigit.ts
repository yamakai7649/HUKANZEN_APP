import { useState,useMemo } from "react";

const generateDigitSequence = (maxDigit: number) => {
    const descendingDigits = Array.from({ length: maxDigit }, (_, index) => maxDigit - index);
    return [0, ...descendingDigits, 0];
};

export const useRollingDigit = (digit: string, max: number) => {
    const [isTransitioning, setIsTransitioning] = useState<boolean>(true);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [prevDigit, setPrevDigit] = useState<string>("");

    const digits = useMemo(() => generateDigitSequence(max), [max]);
    
    // requestAnimationFrameを使う方法もあるけどこっちの方が好きだから！
    if (prevDigit !== digit) {
        // 1. 初回レンダーで "0" の時は、ダミーではなく一番上の "0" に固定する
        if (digit === "0" && currentIndex === 0) {
            setCurrentIndex(0);
        }
        // 2. テレポート直後 ("0" -> "9"など) は、アニメーションをONにしてから動かす
        else if (prevDigit === "0" && currentIndex === 0) {
            setIsTransitioning(true);
            setCurrentIndex(max + 1 - Number(digit));
        }
        // 3. 通常のカウントダウン (1 -> 0 でダミーに向かう時も含む)
        else {
            setCurrentIndex(max + 1 - Number(digit));
        }
    
        setPrevDigit(digit);
    };
    
    const handleTransitionEnd = () => {
        if (currentIndex === max + 1) {
            setIsTransitioning(false);
            setCurrentIndex(0);
        };
    };

    return {
        digits,
        isTransitioning,
        currentIndex,
        handleTransitionEnd,
    };
};
