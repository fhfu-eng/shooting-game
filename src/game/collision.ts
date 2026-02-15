import type { GameState, Particle, Vector2, Size } from "./types";
import {
  SCORE_PER_KILL,
  PARTICLE_COUNT,
  PARTICLE_LIFE,
  HI_SCORE_KEY,
} from "./constants";

function isOverlapping(
  a: { pos: Vector2; size: Size },
  b: { pos: Vector2; size: Size }
): boolean {
  return (
    a.pos.x < b.pos.x + b.size.width &&
    a.pos.x + a.size.width > b.pos.x &&
    a.pos.y < b.pos.y + b.size.height &&
    a.pos.y + a.size.height > b.pos.y
  );
}

function spawnParticles(x: number, y: number, particles: Particle[]): void {
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1 + Math.random() * 3;
    particles.push({
      pos: { x, y },
      vel: { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed },
      life: PARTICLE_LIFE,
      maxLife: PARTICLE_LIFE,
      color: `hsl(${20 + Math.random() * 30}, 100%, ${50 + Math.random() * 30}%)`,
      radius: 2 + Math.random() * 3,
    });
  }
}

function triggerGameOver(state: GameState): void {
  state.phase = "gameover";
  if (state.score > state.hiScore) {
    state.hiScore = state.score;
    localStorage.setItem(HI_SCORE_KEY, String(state.hiScore));
  }
  const cx = state.player.pos.x + state.player.size.width / 2;
  const cy = state.player.pos.y + state.player.size.height / 2;
  spawnParticles(cx, cy, state.particles);
  spawnParticles(cx, cy, state.particles);
}

export function checkCollisions(state: GameState): void {
  const { player, bullets, enemies, particles, boss } = state;

  // Bullet vs Enemy
  for (let ei = enemies.length - 1; ei >= 0; ei--) {
    const enemy = enemies[ei];
    for (let bi = bullets.length - 1; bi >= 0; bi--) {
      const bullet = bullets[bi];
      if (isOverlapping(bullet, enemy)) {
        const cx = enemy.pos.x + enemy.size.width / 2;
        const cy = enemy.pos.y + enemy.size.height / 2;
        spawnParticles(cx, cy, particles);
        enemies.splice(ei, 1);
        bullets.splice(bi, 1);
        state.score += SCORE_PER_KILL;
        break;
      }
    }
  }

  // Bullet vs Boss
  if (boss && boss.phase === "fighting") {
    for (let bi = bullets.length - 1; bi >= 0; bi--) {
      const bullet = bullets[bi];
      if (isOverlapping(bullet, boss)) {
        bullets.splice(bi, 1);
        boss.hp--;
        boss.flashTimer = 4;
        if (boss.hp <= 0) {
          boss.phase = "dying";
          boss.deathTimer = 0;
          // Clear enemy bullets on boss death start
          state.enemyBullets.length = 0;
        }
      }
    }
  }

  // Player vs Enemy
  if (state.phase === "playing") {
    for (const enemy of enemies) {
      if (isOverlapping(player, enemy)) {
        triggerGameOver(state);
        return;
      }
    }
  }

  // Player vs Enemy Bullets
  if (state.phase === "playing") {
    for (const eb of state.enemyBullets) {
      if (isOverlapping(player, eb)) {
        triggerGameOver(state);
        return;
      }
    }
  }

  // Player vs Boss body
  if (state.phase === "playing" && boss && boss.phase !== "dying") {
    if (isOverlapping(player, boss)) {
      triggerGameOver(state);
    }
  }
}

export function updateParticles(state: GameState): void {
  for (let i = state.particles.length - 1; i >= 0; i--) {
    const p = state.particles[i];
    p.pos.x += p.vel.x;
    p.pos.y += p.vel.y;
    p.life--;
    if (p.life <= 0) {
      state.particles.splice(i, 1);
    }
  }
}
