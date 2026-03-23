"use client";

import { RollingDigit } from "./RollingDigit";

const digitMax = { m1: 6, m2: 9, s1: 5, s2: 9 };

type AnimatedTimeProps = {
  minutes: string;
  seconds: string;
  fontWeight: number;
  isCountUp: boolean;
};

export function AnimatedTime({
  minutes,
  seconds,
  fontWeight,
  isCountUp,
}: AnimatedTimeProps) {
  const [m1, m2] = minutes;
  const [s1, s2] = seconds;

  return (
    <div
      className="flex items-center justify-center text-[36vw] md:text-[45vh] tracking-[-0.05em] transition-all duration-700 z-20 whitespace-nowrap scale-y-[1.2] md:scale-y-[1.3] origin-center"
      style={{
        fontFamily: "var(--font-syne), sans-serif",
        fontVariationSettings: `"wght" ${fontWeight}`,
      }}
    >
      <RollingDigit digit={m1} max={digitMax.m1} isCountUp={isCountUp} />
      <RollingDigit digit={m2} max={digitMax.m2} isCountUp={isCountUp} />
      <span
        className="inline-flex items-center justify-center mx-[1vw] text-[#444] translate-y-[-0.08em] h-[1em]"
        style={{ lineHeight: 0.8 }}
      >
        :
      </span>
      <RollingDigit digit={s1} max={digitMax.s1} isCountUp={isCountUp} />
      <RollingDigit digit={s2} max={digitMax.s2} isCountUp={isCountUp} />
    </div>
  );
}
