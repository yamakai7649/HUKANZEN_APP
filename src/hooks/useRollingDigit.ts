import { useState,useMemo } from "react";

const generateDigitSequence = (maxDigit: number) => {
    const ascendingDigits = Array.from({ length: maxDigit + 1 }, (_, index) => index );
    return [...ascendingDigits, 0];
};

export const useRollingDigit = (digit: string, max: number, isCountUp: boolean) => {
    const [isTransitioning, setIsTransitioning] = useState<boolean>(true);
    const [currentIndex, setCurrentIndex] = useState<number>(max + 1);
    const [prevDigit, setPrevDigit] = useState<string>("");
    const [prevIsCountUp, setPrevIsCountUp] = useState(isCountUp);

    const digits = useMemo(() => generateDigitSequence(max), [max]);
    
    // requestAnimationFrameを使う方法もあるけどこっちの方が好きだから！
    if (prevDigit !== digit) {
        const currentNum = Number(digit);

        if (!isCountUp) {
            // 1. 初回レンダーで "0" の時は、ダミーではなく一番下の "0" に固定する
            if (digit === "0" && currentIndex === max + 1) {
                setCurrentIndex(max + 1);
            }
            // 2. テレポート直後 ("0" -> "9"など) は、アニメーションをONにしてから動かす
            else if (prevDigit === "0" && currentIndex === max + 1) {
                setIsTransitioning(true);
                setCurrentIndex(currentNum);
            }
            // 3. 通常のカウントダウン (1 -> 0 でダミーに向かう時も含む)
            else {
                setCurrentIndex(currentNum);
            }
        } else {
            // 1. テレポート直後 ("0" -> "9"など) は、アニメーションをONにしてから動かす
            if (prevDigit === "0" && currentIndex === 0) {
                setIsTransitioning(true);
                setCurrentIndex(currentNum);
            }
            // 2.  ("9" -> "0"など) のカウントアップ
            else if (prevDigit === max.toString() && currentIndex === max) {
                setCurrentIndex(max + 1);
            }
            // 3. 通常のカウントアップ
            else {
                setCurrentIndex(currentNum);
            }
        }
    
        setPrevDigit(digit);
    };

    // 1. 方向が変わった瞬間（1回だけ）の処理
    if (prevIsCountUp !== isCountUp) {
        // ダウンからアップ（true）に切り替わった時
        if (isCountUp) {
            // 現在地が一番下の「ダミーの0」なら
            if (currentIndex === max + 1) {
                setIsTransitioning(false); // アニメーションOFF
                setCurrentIndex(0);        // 一番上の「0」にテレポート
            }
        }
        // 前回の方向を更新
        setPrevIsCountUp(isCountUp);
    }

    
    const handleTransitionEnd = () => {
        if (!isCountUp) {
            if (currentIndex === 0) {
                setIsTransitioning(false);
                setCurrentIndex(max + 1);
            }
        } else {
            if (currentIndex === max + 1) {
                setIsTransitioning(false);
                setCurrentIndex(0);
            }
        }
    };

    return {
        digits,
        isTransitioning,
        currentIndex,
        handleTransitionEnd,
    };
};
