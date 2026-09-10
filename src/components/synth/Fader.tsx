import { useCallback, useRef } from "react";
import { clamp } from "@/lib/synth/types";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  value: number;
  onChange: (v: number) => void;
  meter?: number;
};

export function Fader({ label, value, onChange, meter = 0 }: Props) {
  const track = useRef<HTMLDivElement>(null);
  const setFromY = useCallback(
    (clientY: number) => {
      const el = track.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const n = clamp(1 - (clientY - r.top) / r.height, 0, 1);
      onChange(Number(n.toFixed(3)));
    },
    [onChange],
  );
  return (
    <div className="fader-wrap">
      <div className="led-meter" aria-hidden>
        {Array.from({ length: 8 }, (_, i) => {
          const lit = meter > (7 - i) / 8;
          return (
            <span
              key={i}
              className={cn(
                "led-seg",
                lit && (i < 2 ? "led-red" : i < 4 ? "led-amber" : "led-green"),
              )}
            />
          );
        })}
      </div>
      <div
        ref={track}
        className="fader-track"
        onPointerDown={(e) => {
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
          setFromY(e.clientY);
        }}
        onPointerMove={(e) => {
          if (e.buttons) setFromY(e.clientY);
        }}
      >
        <div className="fader-fill" style={{ height: `${value * 100}%` }} />
        <div className="fader-cap" style={{ bottom: `${value * 100}%` }} />
      </div>
      <span className="fader-label">{label}</span>
    </div>
  );
}
