"use client";

import { useCallback, useEffect, useRef } from "react";
import type { InputState } from "@/game/types";

type Props = {
  inputRef: React.RefObject<InputState>;
};

/**
 * Touch controls rendered BELOW the canvas.
 * Left/Right on the left side, FIRE on the right side.
 * Hidden on desktop via CSS media query.
 */
export function TouchControls({ inputRef }: Props) {
  const leftRef = useRef<HTMLButtonElement>(null);
  const rightRef = useRef<HTMLButtonElement>(null);
  const fireRef = useRef<HTMLButtonElement>(null);

  const press = useCallback(
    (key: string) => {
      inputRef.current.keys.add(key);
    },
    [inputRef]
  );

  const release = useCallback(
    (key: string) => {
      inputRef.current.keys.delete(key);
    },
    [inputRef]
  );

  useEffect(() => {
    const prevent = (e: Event) => e.preventDefault();
    const els = [leftRef.current, rightRef.current, fireRef.current];
    for (const el of els) {
      el?.addEventListener("contextmenu", prevent);
    }
    return () => {
      for (const el of els) {
        el?.removeEventListener("contextmenu", prevent);
      }
    };
  }, []);

  const btnBase =
    "flex items-center justify-center rounded-2xl bg-white/10 active:bg-white/25 border border-white/20 text-white font-bold select-none touch-none transition-colors";

  return (
    <div className="touch-pad-container w-full mt-3 px-2">
      <div className="flex items-center justify-between gap-4">
        {/* D-pad: left / right */}
        <div className="flex gap-3">
          <button
            ref={leftRef}
            className={`${btnBase} w-20 h-20 text-3xl`}
            onTouchStart={(e) => {
              e.preventDefault();
              press("ArrowLeft");
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              release("ArrowLeft");
            }}
            onTouchCancel={() => release("ArrowLeft")}
          >
            ◀
          </button>
          <button
            ref={rightRef}
            className={`${btnBase} w-20 h-20 text-3xl`}
            onTouchStart={(e) => {
              e.preventDefault();
              press("ArrowRight");
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              release("ArrowRight");
            }}
            onTouchCancel={() => release("ArrowRight")}
          >
            ▶
          </button>
        </div>

        {/* Fire button */}
        <button
          ref={fireRef}
          className={`${btnBase} w-24 h-24 text-base tracking-widest bg-red-600/30 active:bg-red-500/50 border-red-400/40`}
          onTouchStart={(e) => {
            e.preventDefault();
            press(" ");
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            release(" ");
          }}
          onTouchCancel={() => release(" ")}
        >
          FIRE
        </button>
      </div>
    </div>
  );
}
