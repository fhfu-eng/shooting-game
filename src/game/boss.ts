import type { GameState, Boss, EnemyBullet, BossAttackPattern } from "./types";
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  MID_BOSS_WIDTH,
  MID_BOSS_HEIGHT,
  MID_BOSS_HP,
  MID_BOSS_SPEED,
  MID_BOSS_SCORE,
  MID_BOSS_SHOOT_INTERVAL,
  MID_BOSS_INTERVAL,
  FINAL_BOSS_WIDTH,
  FINAL_BOSS_HEIGHT,
  FINAL_BOSS_HP,
  FINAL_BOSS_SPEED,
  FINAL_BOSS_SCORE,
  FINAL_BOSS_SHOOT_INTERVAL,
  FINAL_BOSS_THRESHOLD,
  BOSS_ENTRY_SPEED,
  BOSS_TARGET_Y,
  BOSS_PATTERN_DURATION,
  BOSS_DEATH_DURATION,
  ENEMY_BULLET_SIZE,
  WARNING_DURATION,
} from "./constants";

// ===== Boss Factory =====

function createMidBoss(): Boss {
  return {
    type: "mid",
    pos: { x: CANVAS_WIDTH / 2 - MID_BOSS_WIDTH / 2, y: -MID_BOSS_HEIGHT },
    size: { width: MID_BOSS_WIDTH, height: MID_BOSS_HEIGHT },
    hp: MID_BOSS_HP,
    maxHp: MID_BOSS_HP,
    speed: MID_BOSS_SPEED,
    phase: "entering",
    targetY: BOSS_TARGET_Y,
    moveTimer: 0,
    moveDir: 1,
    shootTimer: 0,
    attackIndex: 0,
    patterns: ["spread", "aimed"],
    patternTimer: BOSS_PATTERN_DURATION,
    deathTimer: 0,
    scoreValue: MID_BOSS_SCORE,
    flashTimer: 0,
  };
}

function createFinalBoss(): Boss {
  return {
    type: "final",
    pos: { x: CANVAS_WIDTH / 2 - FINAL_BOSS_WIDTH / 2, y: -FINAL_BOSS_HEIGHT },
    size: { width: FINAL_BOSS_WIDTH, height: FINAL_BOSS_HEIGHT },
    hp: FINAL_BOSS_HP,
    maxHp: FINAL_BOSS_HP,
    speed: FINAL_BOSS_SPEED,
    phase: "entering",
    targetY: BOSS_TARGET_Y,
    moveTimer: 0,
    moveDir: 1,
    shootTimer: 0,
    attackIndex: 0,
    patterns: ["spread", "aimed", "spiral", "barrage"],
    patternTimer: BOSS_PATTERN_DURATION,
    deathTimer: 0,
    scoreValue: FINAL_BOSS_SCORE,
    flashTimer: 0,
  };
}

// ===== Boss Spawn Check =====

export function checkBossSpawn(state: GameState): void {
  if (state.boss) return;

  // Final boss check
  if (state.score >= FINAL_BOSS_THRESHOLD && state.bossesDefeated < 99) {
    // Only spawn final boss once — use bossesDefeated=99 as sentinel
    const midBossCount = Math.floor(FINAL_BOSS_THRESHOLD / MID_BOSS_INTERVAL);
    if (state.bossesDefeated >= midBossCount) {
      state.boss = createFinalBoss();
      state.enemies.length = 0;
      state.enemyBullets.length = 0;
      state.warningText = "WARNING - FINAL BOSS";
      state.warningTimer = WARNING_DURATION;
      return;
    }
  }

  // Mid-boss check: spawn at 3000, 6000, 9000
  const nextMidBossAt = (state.bossesDefeated + 1) * MID_BOSS_INTERVAL;
  if (state.score >= nextMidBossAt && nextMidBossAt < FINAL_BOSS_THRESHOLD) {
    state.boss = createMidBoss();
    state.enemies.length = 0;
    state.enemyBullets.length = 0;
    state.warningText = "WARNING - BOSS APPROACHING";
    state.warningTimer = WARNING_DURATION;
  }
}

// ===== Attack Patterns =====

function getShootInterval(boss: Boss): number {
  return boss.type === "final" ? FINAL_BOSS_SHOOT_INTERVAL : MID_BOSS_SHOOT_INTERVAL;
}

function fireBullet(
  bullets: EnemyBullet[],
  x: number,
  y: number,
  vx: number,
  vy: number
): void {
  bullets.push({
    pos: { x: x - ENEMY_BULLET_SIZE / 2, y },
    size: { width: ENEMY_BULLET_SIZE, height: ENEMY_BULLET_SIZE },
    vel: { x: vx, y: vy },
  });
}

function attackSpread(boss: Boss, bullets: EnemyBullet[]): void {
  const cx = boss.pos.x + boss.size.width / 2;
  const by = boss.pos.y + boss.size.height;
  const count = boss.type === "final" ? 7 : 5;
  const arcSpan = boss.type === "final" ? Math.PI * 0.7 : Math.PI * 0.5;
  const speed = 4;
  for (let i = 0; i < count; i++) {
    const angle = -Math.PI / 2 - arcSpan / 2 + (arcSpan / (count - 1)) * i + Math.PI;
    fireBullet(bullets, cx, by, Math.cos(angle) * speed, Math.sin(angle) * speed);
  }
}

function attackAimed(boss: Boss, bullets: EnemyBullet[], state: GameState): void {
  const cx = boss.pos.x + boss.size.width / 2;
  const by = boss.pos.y + boss.size.height;
  const px = state.player.pos.x + state.player.size.width / 2;
  const py = state.player.pos.y + state.player.size.height / 2;
  const dx = px - cx;
  const dy = py - by;
  const dist = Math.sqrt(dx * dx + dy * dy) || 1;
  const speed = 5;
  const count = boss.type === "final" ? 3 : 1;
  for (let i = 0; i < count; i++) {
    const spread = (i - (count - 1) / 2) * 0.15;
    const angle = Math.atan2(dy, dx) + spread;
    fireBullet(bullets, cx, by, Math.cos(angle) * speed, Math.sin(angle) * speed);
  }
}

function attackSpiral(boss: Boss, bullets: EnemyBullet[]): void {
  const cx = boss.pos.x + boss.size.width / 2;
  const cy = boss.pos.y + boss.size.height / 2;
  const speed = 3;
  const angle = (boss.shootTimer * 0.3);
  fireBullet(bullets, cx, cy, Math.cos(angle) * speed, Math.sin(angle) * speed);
  fireBullet(bullets, cx, cy, Math.cos(angle + Math.PI) * speed, Math.sin(angle + Math.PI) * speed);
}

function attackBarrage(boss: Boss, bullets: EnemyBullet[]): void {
  const by = boss.pos.y + boss.size.height;
  const count = 3;
  for (let i = 0; i < count; i++) {
    const x = boss.pos.x + (boss.size.width / (count + 1)) * (i + 1);
    fireBullet(bullets, x, by, (Math.random() - 0.5) * 2, 3 + Math.random() * 2);
  }
}

// ===== Boss Update =====

export function updateBoss(state: GameState): void {
  const { boss } = state;
  if (!boss) return;

  // Warning timer
  if (state.warningTimer > 0) {
    state.warningTimer--;
  }

  // Flash timer
  if (boss.flashTimer > 0) boss.flashTimer--;

  switch (boss.phase) {
    case "entering": {
      boss.pos.y += BOSS_ENTRY_SPEED;
      if (boss.pos.y >= boss.targetY) {
        boss.pos.y = boss.targetY;
        boss.phase = "fighting";
      }
      break;
    }

    case "fighting": {
      // Horizontal movement
      boss.moveTimer++;
      boss.pos.x += boss.speed * boss.moveDir;
      if (boss.pos.x <= 10) boss.moveDir = 1;
      if (boss.pos.x + boss.size.width >= CANVAS_WIDTH - 10) boss.moveDir = -1;

      // Sinusoidal vertical bob
      boss.pos.y = boss.targetY + Math.sin(boss.moveTimer * 0.03) * 20;

      // Pattern rotation
      boss.patternTimer--;
      if (boss.patternTimer <= 0) {
        boss.attackIndex = (boss.attackIndex + 1) % boss.patterns.length;
        boss.patternTimer = BOSS_PATTERN_DURATION;
      }

      // Shooting
      boss.shootTimer++;
      const interval = getShootInterval(boss);
      if (boss.shootTimer >= interval) {
        const pattern = boss.patterns[boss.attackIndex];
        switch (pattern) {
          case "spread":
            attackSpread(boss, state.enemyBullets);
            break;
          case "aimed":
            attackAimed(boss, state.enemyBullets, state);
            break;
          case "spiral":
            attackSpiral(boss, state.enemyBullets);
            break;
          case "barrage":
            attackBarrage(boss, state.enemyBullets);
            break;
        }
        boss.shootTimer = 0;
      }
      break;
    }

    case "dying": {
      boss.deathTimer++;
      // Spawn explosions during death
      if (boss.deathTimer % 6 === 0) {
        const rx = boss.pos.x + Math.random() * boss.size.width;
        const ry = boss.pos.y + Math.random() * boss.size.height;
        spawnBossExplosion(rx, ry, state);
      }
      if (boss.deathTimer >= BOSS_DEATH_DURATION) {
        // Big final explosion
        const cx = boss.pos.x + boss.size.width / 2;
        const cy = boss.pos.y + boss.size.height / 2;
        for (let i = 0; i < 5; i++) {
          spawnBossExplosion(
            cx + (Math.random() - 0.5) * 60,
            cy + (Math.random() - 0.5) * 60,
            state
          );
        }
        state.score += boss.scoreValue;
        const wasFinalBoss = boss.type === "final";
        state.boss = null;
        state.enemyBullets.length = 0;
        if (wasFinalBoss) {
          state.bossesDefeated = 99; // sentinel
          state.phase = "clear";
          if (state.score > state.hiScore) {
            state.hiScore = state.score;
            localStorage.setItem("shooting-game-hi-score", String(state.hiScore));
          }
        } else {
          state.bossesDefeated++;
        }
      }
      break;
    }
  }
}

function spawnBossExplosion(x: number, y: number, state: GameState): void {
  for (let i = 0; i < 8; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1 + Math.random() * 4;
    state.particles.push({
      pos: { x, y },
      vel: { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed },
      life: 25,
      maxLife: 25,
      color: `hsl(${Math.random() * 60}, 100%, ${50 + Math.random() * 40}%)`,
      radius: 3 + Math.random() * 5,
    });
  }
}

// ===== Enemy Bullets Update =====

export function updateEnemyBullets(state: GameState): void {
  for (let i = state.enemyBullets.length - 1; i >= 0; i--) {
    const b = state.enemyBullets[i];
    b.pos.x += b.vel.x;
    b.pos.y += b.vel.y;
    if (
      b.pos.x < -20 ||
      b.pos.x > CANVAS_WIDTH + 20 ||
      b.pos.y < -20 ||
      b.pos.y > CANVAS_HEIGHT + 20
    ) {
      state.enemyBullets.splice(i, 1);
    }
  }
}
