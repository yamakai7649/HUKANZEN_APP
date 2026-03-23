import { memo } from "react";
import { useRollingDigit } from "@/hooks/useRollingDigit";

type RollingDigitProps = {
  digit: string;
  max: number;
  isCountUp: boolean;
};

export const RollingDigit = memo(function RollingDigit({ digit, max, isCountUp }: RollingDigitProps) {
  const {
    digits,
    isTransitioning,
    currentIndex,
    handleTransitionEnd,
  } = useRollingDigit(digit, max, isCountUp);

  return (
    <div className="h-[1.2em] w-[1ch] overflow-hidden inline-flex justify-center">
      <div
        style={{ transform: `translateY(-${currentIndex * 100}%)` }}
        className={`flex flex-col ${isTransitioning
          ? "transition-transform duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)]"
          : "transition-none"
        }`}
        onTransitionEnd={handleTransitionEnd}
      >
        {digits.map((num, i) => (
          <span key={i} className="h-[1.2em] leading-[1.2em] text-center block">
            {num}
          </span>
        ))}
      </div>
    </div>
  );
});
