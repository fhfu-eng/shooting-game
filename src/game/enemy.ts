import type { GameState, Enemy } from "./types";
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  ENEMY_WIDTH,
  ENEMY_HEIGHT,
  ENEMY_SPEED_MIN,
  ENEMY_SPEED_MAX,
  ENEMY_SPAWN_INTERVAL_INITIAL,
  ENEMY_SPAWN_INTERVAL_MIN,
  ENEMY_SPAWN_SPEEDUP,
} from "./constants";

function getSpawnInterval(score: number): number {
  const reduction = Math.floor(score / 500) * ENEMY_SPAWN_SPEEDUP;
  return Math.max(ENEMY_SPAWN_INTERVAL_MIN, ENEMY_SPAWN_INTERVAL_INITIAL - reduction);
}

function spawnEnemy(): Enemy {
  const speed =
    ENEMY_SPEED_MIN + Math.random() * (ENEMY_SPEED_MAX - ENEMY_SPEED_MIN);
  return {
    pos: {
      x: Math.random() * (CANVAS_WIDTH - ENEMY_WIDTH),
      y: -ENEMY_HEIGHT,
    },
    size: { width: ENEMY_WIDTH, height: ENEMY_HEIGHT },
    speed,
  };
}

export function updateEnemies(state: GameState): void {
  // Don't spawn normal enemies while a boss is active
  if (!state.boss) {
    state.spawnTimer++;
    const interval = getSpawnInterval(state.score);
    if (state.spawnTimer >= interval) {
      state.enemies.push(spawnEnemy());
      state.spawnTimer = 0;
    }
  }

  // Move & remove off-screen
  for (let i = state.enemies.length - 1; i >= 0; i--) {
    state.enemies[i].pos.y += state.enemies[i].speed;
    if (state.enemies[i].pos.y > CANVAS_HEIGHT) {
      state.enemies.splice(i, 1);
    }
  }
}
