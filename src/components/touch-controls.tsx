"use client";

import { useCallback, useEffect, useRef } from "react";
import type { InputState } from "@/game/types";

type Props = {
  inputRef: React.RefObject<InputState>;
};

/**
 * Virtual D-pad (left/right) + Fire button overlay.
 * Only visible on touch devices.
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
    // Prevent context menu on long-press
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
    "absolute flex items-center justify-center rounded-full bg-white/15 active:bg-white/30 backdrop-blur-sm border border-white/20 text-white font-bold select-none touch-none transition-colors pointer-events-auto";

  return (
    <div className="absolute inset-0 pointer-events-none touch-pad-container">
      {/* Left button */}
      <button
        ref={leftRef}
        className={`${btnBase} bottom-4 left-4 w-16 h-16 text-2xl`}
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

      {/* Right button */}
      <button
        ref={rightRef}
        className={`${btnBase} bottom-4 left-24 w-16 h-16 text-2xl`}
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

      {/* Fire button */}
      <button
        ref={fireRef}
        className={`${btnBase} bottom-4 right-4 w-20 h-20 text-sm tracking-wider bg-red-500/30 active:bg-red-500/50 border-red-400/40`}
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
  );
}
