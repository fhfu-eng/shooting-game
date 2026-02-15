"use client";

import { useRef, useCallback } from "react";
import { useGame } from "@/hooks/use-game";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "@/game/constants";
import { TouchControls } from "./touch-controls";

export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { inputRef, stateRef } = useGame(canvasRef);

  const handleCanvasTap = useCallback(
    (e: React.TouchEvent) => {
      const phase = stateRef.current.phase;
      if (phase === "title" || phase === "gameover" || phase === "clear") {
        e.preventDefault();
        inputRef.current.keys.add(" ");
        requestAnimationFrame(() => {
          inputRef.current.keys.delete(" ");
        });
      }
    },
    [inputRef, stateRef]
  );

  return (
    <div className="flex flex-col items-center select-none w-full max-w-[480px]">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="border-2 border-gray-700 rounded-lg shadow-2xl w-full h-auto block"
        style={{ imageRendering: "pixelated" }}
        onTouchStart={handleCanvasTap}
      />
      <TouchControls inputRef={inputRef} />
    </div>
  );
}
