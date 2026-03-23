"use client";

import { useEffect, useRef } from "react";

// 背景に流れる静的な細線
type StaticLine = {
  x: number;      // 横位置
  y: number;      // 縦位置
  vy: number;     // 縦方向の速度（velocity y）
  len: number;    // 線の長さ
};

// 雨粒
type RainDrop = {
  x: number;               // 横位置
  y: number;               // 縦位置
  vy: number;              // 落下速度
  len: number;             // 線の長さ
  thick: number;           // 線の太さ（thickness）
  baseAlpha: number;       // 基本の透明度
  layer: "far" | "mid" | "near"; // 奥行きレイヤー（遠・中・近）
  maxRippleSize: number;   // 着地時の波紋の最大サイズ
  hue: number;             // 色相（0〜360）
  hueSpeed: number;        // 色相の変化速度
};

// 波紋
type Ripple = {
  x: number;              // 横位置
  y: number;              // 縦位置
  r: number;              // 現在の半径（radius）
  maxR: number;           // 最大半径
  alpha: number;          // 透明度
  seed: number;           // 波紋の形のブレに使うランダムシード値
  hue: number;            // 色相
  type: "bottom" | "cursor"; // 発生源（画面下端 or カーソル）
  lobes: number;          // 波紋のでこぼこの数
  wobbleSpeed: number;    // でこぼこの揺れる速さ
  wobbleAmp: number;      // でこぼこの振幅（amplitude）
  squish: number;         // 縦方向の潰れ具合
};

type CanvasBackgroundProps = {
  isRunning: boolean;
  progress: number;
}

export function CanvasBackground({ isRunning, progress }: CanvasBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isRunningRef = useRef(isRunning);
  const targetProgressRef = useRef(1 - progress);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    isRunningRef.current = isRunning;
    targetProgressRef.current = 1 - progress;
  }, [isRunning, progress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);

    let fadeOpacity = 0;
    let smoothedProgress = targetProgressRef.current;

    // Static idle lines
    const createStaticLine = (): StaticLine => ({
      x: Math.random() * width,
      y: -60,
      vy: 0.3 + Math.random() * 0.5,
      len: 20 + Math.random() * 40,
    });
    const staticLines: StaticLine[] = Array.from({ length: 100 }, () => createStaticLine());

    const createDrop = (layer: "far" | "mid" | "near"): RainDrop => {
      let vy: number, len: number, thick: number, baseAlpha: number, maxRippleSize: number;
      if (layer === "far") {
        vy = 0.25 + Math.random() * 0.1;
        len = 2 + Math.random() * 4;
        thick = 0.3;
        baseAlpha = 0.07;
        maxRippleSize = 35;
      } else if (layer === "mid") {
        vy = 0.45 + Math.random() * 0.2;
        len = 4 + Math.random() * 12;
        thick = 0.6;
        baseAlpha = 0.15;
        maxRippleSize = 50;
      } else {
        vy = 0.7 + Math.random() * 0.3;
        len = 8 + Math.random() * 22;
        thick = 1.0;
        baseAlpha = 0.28;
        maxRippleSize = 65;
      }
      return {
        x: Math.random() * width,
        y: -len,
        vy,
        len,
        thick,
        baseAlpha,
        layer,
        maxRippleSize,
        hue: Math.random() * 360,
        hueSpeed: (Math.random() - 0.5) * 0.5,
      };
    };

    const rain: RainDrop[] = [];
    for (let i = 0; i < 50; i++) rain.push(createDrop("far"));
    for (let i = 0; i < 35; i++) rain.push(createDrop("mid"));
    for (let i = 0; i < 15; i++) rain.push(createDrop("near"));

    const ripples: Ripple[] = [];

    const lights = [
      { hue: 0, hueSpeed: 0.2, cx: 0.1 },
      { hue: 72, hueSpeed: 0.3, cx: 0.3 },
      { hue: 144, hueSpeed: 0.25, cx: 0.5 },
      { hue: 216, hueSpeed: 0.4, cx: 0.7 },
      { hue: 288, hueSpeed: 0.35, cx: 0.9 },
    ];

    const easeInOutCubic = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const render = (time: number) => {
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      // Static idle lines (always rendered)
      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.lineWidth = 1;
      staticLines.forEach((line, i) => {
        line.y += line.vy;
        if (line.y > height) {
          staticLines[i] = createStaticLine();
        }
        ctx.beginPath();
        ctx.moveTo(line.x, line.y);
        ctx.lineTo(line.x, line.y + line.len);
        ctx.stroke();
      });

      if (isRunningRef.current) {
        fadeOpacity = Math.min(1, fadeOpacity + 0.01);
      } else {
        fadeOpacity = Math.max(0, fadeOpacity - 0.01);
      }

      const targetP = targetProgressRef.current;
      smoothedProgress += (targetP - smoothedProgress) * 0.02;
      const easeProgress = easeInOutCubic(Math.max(0, Math.min(1, smoothedProgress)));

      if (fadeOpacity > 0) {
        ctx.globalCompositeOperation = "screen";
        const currentAlpha = Math.max(0, Math.min(0.18, 0.18 * easeProgress)) * fadeOpacity;
        const maxRadius = height * 1.5;
        const currentRadius = Math.max(0.1, maxRadius * easeProgress);

        if (currentAlpha > 0 && currentRadius > 0) {
          lights.forEach((light) => {
            light.hue = (light.hue + light.hueSpeed) % 360;
            const x = width * light.cx;
            const y = height;
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, currentRadius);
            gradient.addColorStop(0, `hsla(${light.hue}, 80%, 60%, ${currentAlpha})`);
            gradient.addColorStop(1, `hsla(${light.hue}, 80%, 60%, 0)`);
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(x, y, currentRadius, 0, Math.PI * 2);
            ctx.fill();
          });
        }
        ctx.globalCompositeOperation = "source-over";
      }

      const cursorR = 30;

      rain.forEach((drop, i) => {
        drop.hue = (drop.hue + drop.hueSpeed) % 360;
        drop.y += drop.vy;

        const dx = drop.x - mouseRef.current.x;
        const dy = drop.y - mouseRef.current.y;
        if (dx * dx + dy * dy <= cursorR * cursorR) {
          ripples.push({
            x: drop.x,
            y: drop.y,
            r: 0,
            maxR: drop.maxRippleSize * 0.4,
            alpha: drop.baseAlpha * 3,
            seed: Math.random() * 100,
            hue: drop.hue,
            type: "cursor",
            lobes: Math.floor(Math.random() * 4) + 3,
            wobbleSpeed: Math.random() * 0.008 + 0.002,
            wobbleAmp: Math.random() * 0.15 + 0.05,
            squish: 0.35 + (Math.random() * 0.2 - 0.1),
          });
          rain[i] = createDrop(drop.layer);
          return;
        }

        if (drop.y > height) {
          ripples.push({
            x: drop.x,
            y: height,
            r: 0,
            maxR: drop.maxRippleSize,
            alpha: drop.baseAlpha * 3,
            seed: Math.random() * 100,
            hue: drop.hue,
            type: "bottom",
            lobes: Math.floor(Math.random() * 5) + 3,
            wobbleSpeed: Math.random() * 0.008 + 0.002,
            wobbleAmp: Math.random() * 0.15 + 0.05,
            squish: 0.35 + (Math.random() * 0.2 - 0.1),
          });
          rain[i] = createDrop(drop.layer);
          return;
        }

        const saturation = 80 * easeProgress;
        const lightness = 100 - 30 * easeProgress;
        ctx.strokeStyle = `hsla(${drop.hue}, ${saturation}%, ${lightness}%, ${drop.baseAlpha})`;
        ctx.lineWidth = drop.thick;
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x, drop.y - drop.len);
        ctx.stroke();
      });

      for (let i = ripples.length - 1; i >= 0; i--) {
        const rpl = ripples[i];
        const speed = rpl.type === "cursor" ? 0.5 : 0.45;
        rpl.r += speed;
        rpl.alpha *= rpl.type === "cursor" ? 0.97 : 0.985;

        if (rpl.alpha < 0.01 || rpl.r > rpl.maxR) {
          ripples.splice(i, 1);
          continue;
        }

        const saturation = 80 * easeProgress;
        const lightness = 100 - 30 * easeProgress;
        ctx.strokeStyle = `hsla(${rpl.hue}, ${saturation}%, ${lightness}%, ${rpl.alpha})`;
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        for (let angle = 0; angle <= Math.PI * 2 + 0.1; angle += 0.2) {
          const noise =
            Math.sin(angle * rpl.lobes + time * rpl.wobbleSpeed + rpl.seed) *
            (rpl.r * rpl.wobbleAmp);
          const r = rpl.r + noise;
          const rx = rpl.x + Math.cos(angle) * r;
          const ry = rpl.y + Math.sin(angle) * r * rpl.squish;
          if (angle === 0) ctx.moveTo(rx, ry);
          else ctx.lineTo(rx, ry);
        }
        ctx.closePath();
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none"
    />
  );
}
