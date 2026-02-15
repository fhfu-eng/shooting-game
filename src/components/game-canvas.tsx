"use client";

import { useRef } from "react";
import { useGame } from "@/hooks/use-game";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "@/game/constants";
import { TouchControls } from "./touch-controls";

export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useGame(canvasRef);

  return (
    <div className="relative select-none">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="border-2 border-gray-700 rounded-lg shadow-2xl max-w-full h-auto block"
        style={{ imageRendering: "pixelated" }}
      />
      <TouchControls inputRef={inputRef} />
    </div>
  );
}
