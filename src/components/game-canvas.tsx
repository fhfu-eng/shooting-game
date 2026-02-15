"use client";

import { useRef } from "react";
import { useGame } from "@/hooks/use-game";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "@/game/constants";

export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useGame(canvasRef);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      className="border-2 border-gray-700 rounded-lg shadow-2xl max-w-full h-auto"
      style={{ imageRendering: "pixelated" }}
    />
  );
}
