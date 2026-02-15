import type { GameAssets } from "./types";

function loadImage(src: string): HTMLImageElement {
  const img = new Image();
  img.src = src;
  return img;
}

export function loadAssets(): GameAssets {
  return {
    player: loadImage("/images/player.png"),
    enemy: loadImage("/images/enemy.png"),
    bullet: loadImage("/images/bullet.png"),
    background: loadImage("/images/background.png"),
    midBoss: loadImage("/images/mid-boss.png"),
    finalBoss: loadImage("/images/final-boss.png"),
    loaded: false,
  };
}
