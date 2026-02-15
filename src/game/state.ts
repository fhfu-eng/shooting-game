import type { GameState } from "./types";
import {
  CANVAS_WIDTH,
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  PLAYER_SPEED,
  PLAYER_START_Y,
  HI_SCORE_KEY,
} from "./constants";

export function createInitialState(): GameState {
  let hiScore = 0;
  if (typeof window !== "undefined") {
    hiScore = Number(localStorage.getItem(HI_SCORE_KEY)) || 0;
  }

  return {
    phase: "title",
    player: {
      pos: {
        x: CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2,
        y: PLAYER_START_Y,
      },
      size: { width: PLAYER_WIDTH, height: PLAYER_HEIGHT },
      speed: PLAYER_SPEED,
      cooldown: 0,
    },
    bullets: [],
    enemyBullets: [],
    enemies: [],
    boss: null,
    particles: [],
    score: 0,
    hiScore,
    frame: 0,
    spawnTimer: 0,
    bossesDefeated: 0,
    warningTimer: 0,
    warningText: "",
  };
}

export function resetForNewGame(state: GameState): void {
  state.phase = "playing";
  state.player.pos.x = CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2;
  state.player.pos.y = PLAYER_START_Y;
  state.player.cooldown = 0;
  state.bullets.length = 0;
  state.enemyBullets.length = 0;
  state.enemies.length = 0;
  state.boss = null;
  state.particles.length = 0;
  state.score = 0;
  state.frame = 0;
  state.spawnTimer = 0;
  state.bossesDefeated = 0;
  state.warningTimer = 0;
  state.warningText = "";
}
