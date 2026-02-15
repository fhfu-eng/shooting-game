import type { GameState, InputState, Bullet } from "./types";
import {
  CANVAS_WIDTH,
  BULLET_WIDTH,
  BULLET_HEIGHT,
  BULLET_SPEED,
  PLAYER_SHOOT_COOLDOWN,
} from "./constants";

export function updatePlayer(state: GameState, input: InputState): void {
  const { player } = state;
  const { keys } = input;

  // Movement
  if (keys.has("ArrowLeft") || keys.has("a")) {
    player.pos.x -= player.speed;
  }
  if (keys.has("ArrowRight") || keys.has("d")) {
    player.pos.x += player.speed;
  }

  // Clamp within canvas
  if (player.pos.x < 0) player.pos.x = 0;
  if (player.pos.x + player.size.width > CANVAS_WIDTH) {
    player.pos.x = CANVAS_WIDTH - player.size.width;
  }

  // Cooldown
  if (player.cooldown > 0) {
    player.cooldown--;
  }

  // Shoot
  if (keys.has(" ") && player.cooldown <= 0) {
    const bullet: Bullet = {
      pos: {
        x: player.pos.x + player.size.width / 2 - BULLET_WIDTH / 2,
        y: player.pos.y - BULLET_HEIGHT,
      },
      size: { width: BULLET_WIDTH, height: BULLET_HEIGHT },
      speed: BULLET_SPEED,
    };
    state.bullets.push(bullet);
    player.cooldown = PLAYER_SHOOT_COOLDOWN;
  }
}
