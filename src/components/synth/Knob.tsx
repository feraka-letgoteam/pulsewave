import { useCallback, useEffect, useRef, type PointerEvent } from "react";
import { clamp } from "@/lib/synth/types";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (v: number) => void;
  size?: "sm" | "md";
  accent?: "amber" | "teal" | "magenta";
  format?: (v: number) => string;
  bipolar?: boolean;
};

export function Knob({
  label,
  value,
  min = 0,
  max = 1,
  step = 0.01,
  onChange,
  size = "md",
  accent = "amber",
  format,
  bipolar,
}: Props) {
  const start = useRef({ y: 0, v: 0 });
  const dragging = useRef(false);
  const norm = (v: number) => (v - min) / (max - min || 1);
  const n = clamp(norm(value), 0, 1);
  const deg = -135 + n * 270;
  const onPointerDown = useCallback(
    (e: PointerEvent) => {
      e.preventDefault();
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      dragging.current = true;
      start.current = { y: e.clientY, v: value };
    },
    [value],
  );
  const onPointerMove = useCallback(
    (e: PointerEvent) => {
      if (!dragging.current) return;
      const fine = e.shiftKey ? 0.15 : 1;
      const dy = (start.current.y - e.clientY) * fine;
      const span = max - min;
      const next = clamp(start.current.v + (dy / 110) * span, min, max);
      const snapped = Math.round(next / step) * step;
      onChange(Number(snapped.toFixed(4)));
    },
    [max, min, onChange, step],
  );
  const onPointerUp = useCallback(() => {
    dragging.current = false;
  }, []);
  useEffect(() => {
    const prevent = (e: TouchEvent) => {
      if (dragging.current) e.preventDefault();
    };
    document.addEventListener("touchmove", prevent, { passive: false });
    return () => document.removeEventListener("touchmove", prevent);
  }, []);
  const readout =
    format?.(value) ??
    (bipolar
      ? (value > 0 ? "+" : "") + value.toFixed(2)
      : max > 4
        ? String(Math.round(value))
        : value.toFixed(2).replace(/^0/, "0"));
  return (
    <div className={cn("knob-wrap", size === "sm" && "knob-sm")}>
      <button
        type="button"
        aria-label={label}
        className={cn("knob", `knob-${accent}`)}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onDoubleClick={() => onChange(bipolar ? 0 : min + (max - min) * 0.5)}
      >
        <span className="knob-notches" aria-hidden />
        <span className="knob-face" style={{ transform: `rotate(${deg}deg)` }}>
          <span className="knob-pointer" />
        </span>
      </button>
      <span className="knob-val">{readout}</span>
      <span className="knob-label">{label}</span>
    </div>
  );
}
