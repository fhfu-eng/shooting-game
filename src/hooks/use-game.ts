"use client";

import { useEffect, useRef, useCallback } from "react";
import type { GameState, InputState, GameAssets } from "@/game/types";
import { createInitialState } from "@/game/state";
import { loadAssets } from "@/game/assets";
import { tick } from "@/game/engine";

export function useGame(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const stateRef = useRef<GameState>(createInitialState());
  const inputRef = useRef<InputState>({ keys: new Set() });
  const assetsRef = useRef<GameAssets | null>(null);
  const rafRef = useRef<number>(0);

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const assets = assetsRef.current;
    if (!assets) return;

    tick(ctx, stateRef.current, inputRef.current, assets);
    rafRef.current = requestAnimationFrame(gameLoop);
  }, [canvasRef]);

  useEffect(() => {
    // Load assets
    assetsRef.current = loadAssets();

    // Keyboard handlers
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " "].includes(e.key)) {
        e.preventDefault();
      }
      inputRef.current.keys.add(e.key);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      inputRef.current.keys.delete(e.key);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Start game loop
    rafRef.current = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gameLoop]);

  return { inputRef, stateRef };
}
