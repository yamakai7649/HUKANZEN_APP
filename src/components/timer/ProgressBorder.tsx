"use client";

import { memo } from "react";

type ProgressBorderProps = {
  progress: number;
}

export const ProgressBorder = memo(function ProgressBorder({ progress }: ProgressBorderProps) {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-50">
      <svg className="w-full h-full">
        <rect
          width="100%"
          height="100%"
          fill="none"
          stroke="rgba(255,255,255,0.85)"
          strokeWidth="4"
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset={1 - progress}
          className="transition-all duration-1000 ease-linear"
        />
      </svg>
    </div>
  );
});
