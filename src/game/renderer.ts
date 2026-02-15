import type { GameState, GameAssets, Boss, BossType } from "./types";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./constants";

function isImageReady(img: HTMLImageElement | null): img is HTMLImageElement {
  return img !== null && img.complete && img.naturalWidth > 0;
}

function getBossImage(assets: GameAssets, type: BossType): HTMLImageElement | null {
  const img = type === "final" ? assets.finalBoss : assets.midBoss;
  return isImageReady(img) ? img : null;
}

// ===== Fallback drawing (when images are not loaded) =====

function drawPlayer(ctx: CanvasRenderingContext2D, state: GameState, assets: GameAssets): void {
  const { pos, size } = state.player;
  if (assets.player?.complete && assets.player.naturalWidth > 0) {
    ctx.drawImage(assets.player, pos.x, pos.y, size.width, size.height);
  } else {
    ctx.fillStyle = "#00e5ff";
    ctx.beginPath();
    ctx.moveTo(pos.x + size.width / 2, pos.y);
    ctx.lineTo(pos.x, pos.y + size.height);
    ctx.lineTo(pos.x + size.width, pos.y + size.height);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(pos.x + size.width / 2, pos.y + size.height * 0.55, 6, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawBullets(ctx: CanvasRenderingContext2D, state: GameState, assets: GameAssets): void {
  for (const b of state.bullets) {
    if (assets.bullet?.complete && assets.bullet.naturalWidth > 0) {
      ctx.drawImage(assets.bullet, b.pos.x, b.pos.y, b.size.width, b.size.height);
    } else {
      ctx.fillStyle = "#ffeb3b";
      ctx.shadowColor = "#ffeb3b";
      ctx.shadowBlur = 6;
      ctx.fillRect(b.pos.x, b.pos.y, b.size.width, b.size.height);
      ctx.shadowBlur = 0;
    }
  }
}

function drawEnemyBullets(ctx: CanvasRenderingContext2D, state: GameState): void {
  for (const b of state.enemyBullets) {
    ctx.fillStyle = "#ff6090";
    ctx.shadowColor = "#ff6090";
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(
      b.pos.x + b.size.width / 2,
      b.pos.y + b.size.height / 2,
      b.size.width / 2,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

function drawEnemies(ctx: CanvasRenderingContext2D, state: GameState, assets: GameAssets): void {
  for (const e of state.enemies) {
    if (assets.enemy?.complete && assets.enemy.naturalWidth > 0) {
      ctx.drawImage(assets.enemy, e.pos.x, e.pos.y, e.size.width, e.size.height);
    } else {
      ctx.fillStyle = "#ff1744";
      ctx.beginPath();
      ctx.moveTo(e.pos.x + e.size.width / 2, e.pos.y);
      ctx.lineTo(e.pos.x + e.size.width, e.pos.y + e.size.height / 2);
      ctx.lineTo(e.pos.x + e.size.width / 2, e.pos.y + e.size.height);
      ctx.lineTo(e.pos.x, e.pos.y + e.size.height / 2);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(e.pos.x + e.size.width / 2, e.pos.y + e.size.height / 2, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

// ===== Boss Drawing =====

function drawBoss(ctx: CanvasRenderingContext2D, boss: Boss, frame: number, assets: GameAssets): void {
  const { pos, size } = boss;

  // Flash white when hit
  const isFlashing = boss.flashTimer > 0;
  // Blink during dying phase
  if (boss.phase === "dying" && Math.floor(boss.deathTimer / 3) % 2 === 0) {
    return; // skip drawing for blink effect
  }

  ctx.save();

  // Try image first
  const bossImg = getBossImage(assets, boss.type);
  if (bossImg) {
    if (isFlashing) {
      ctx.globalAlpha = 0.6;
      ctx.drawImage(bossImg, pos.x, pos.y, size.width, size.height);
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(pos.x, pos.y, size.width, size.height);
      ctx.globalAlpha = 1;
    } else {
      ctx.drawImage(bossImg, pos.x, pos.y, size.width, size.height);
    }
    ctx.restore();
    return;
  }

  // Fallback: canvas shapes
  if (boss.type === "mid") {
    // Mid-boss: hexagonal shape, purple
    const cx = pos.x + size.width / 2;
    const cy = pos.y + size.height / 2;
    const rx = size.width / 2;
    const ry = size.height / 2;

    ctx.fillStyle = isFlashing ? "#ffffff" : "#9c27b0";
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 6;
      const x = cx + Math.cos(angle) * rx;
      const y = cy + Math.sin(angle) * ry;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();

    // Inner glow
    ctx.fillStyle = isFlashing ? "#dddddd" : "#ce93d8";
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 6;
      const x = cx + Math.cos(angle) * rx * 0.5;
      const y = cy + Math.sin(angle) * ry * 0.5;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();

    // Eye
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(cx, cy, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#1a1a2e";
    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Final boss: large menacing shape
    const cx = pos.x + size.width / 2;
    const cy = pos.y + size.height / 2;

    // Main body - octagon
    ctx.fillStyle = isFlashing ? "#ffffff" : "#b71c1c";
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI / 4) * i - Math.PI / 8;
      const r = i % 2 === 0 ? size.width / 2 : size.width / 2.5;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * (size.height / 2) * (r / (size.width / 2));
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();

    // Inner core
    ctx.fillStyle = isFlashing ? "#dddddd" : "#ff5252";
    ctx.beginPath();
    ctx.arc(cx, cy, size.width * 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Pulsating ring
    const pulseR = size.width * 0.25 + Math.sin(frame * 0.08) * 5;
    ctx.strokeStyle = isFlashing ? "#ffffff" : "#ff8a80";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, pulseR, 0, Math.PI * 2);
    ctx.stroke();

    // Eyes
    const eyeOffsetX = 18;
    const eyeOffsetY = -5;
    for (const dir of [-1, 1]) {
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(cx + eyeOffsetX * dir, cy + eyeOffsetY, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffeb3b";
      ctx.beginPath();
      ctx.arc(cx + eyeOffsetX * dir, cy + eyeOffsetY, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Side cannons
    for (const dir of [-1, 1]) {
      ctx.fillStyle = isFlashing ? "#cccccc" : "#880e0e";
      ctx.fillRect(
        cx + dir * (size.width / 2 - 5) - 8,
        cy + 10,
        16,
        size.height / 3
      );
    }
  }

  ctx.restore();
}

function drawBossHPBar(ctx: CanvasRenderingContext2D, boss: Boss): void {
  const barWidth = 200;
  const barHeight = 12;
  const x = CANVAS_WIDTH / 2 - barWidth / 2;
  const y = 50;
  const hpRatio = Math.max(0, boss.hp / boss.maxHp);

  // Background
  ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
  ctx.fillRect(x - 2, y - 2, barWidth + 4, barHeight + 4);

  // HP bar
  const color = boss.type === "final" ? "#ff1744" : "#9c27b0";
  ctx.fillStyle = color;
  ctx.fillRect(x, y, barWidth * hpRatio, barHeight);

  // Border
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 1;
  ctx.strokeRect(x - 1, y - 1, barWidth + 2, barHeight + 2);

  // Label
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 12px 'Segoe UI', sans-serif";
  ctx.textAlign = "center";
  const label = boss.type === "final" ? "FINAL BOSS" : "MID BOSS";
  ctx.fillText(label, CANVAS_WIDTH / 2, y - 6);
  ctx.textAlign = "left";
}

// ===== Warning =====

function drawWarning(ctx: CanvasRenderingContext2D, state: GameState): void {
  if (state.warningTimer <= 0) return;

  const alpha = Math.abs(Math.sin(state.warningTimer * 0.1));
  ctx.save();
  ctx.globalAlpha = alpha;

  // Red overlay
  ctx.fillStyle = "rgba(255, 0, 0, 0.1)";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Warning text
  ctx.fillStyle = "#ff1744";
  ctx.font = "bold 36px 'Segoe UI', sans-serif";
  ctx.textAlign = "center";
  ctx.shadowColor = "#ff1744";
  ctx.shadowBlur = 20;
  ctx.fillText(state.warningText, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 10);
  ctx.shadowBlur = 0;

  // Horizontal lines
  ctx.strokeStyle = "#ff1744";
  ctx.lineWidth = 2;
  const lineY1 = CANVAS_HEIGHT / 2 - 50;
  const lineY2 = CANVAS_HEIGHT / 2 + 20;
  ctx.beginPath();
  ctx.moveTo(40, lineY1);
  ctx.lineTo(CANVAS_WIDTH - 40, lineY1);
  ctx.moveTo(40, lineY2);
  ctx.lineTo(CANVAS_WIDTH - 40, lineY2);
  ctx.stroke();

  ctx.textAlign = "left";
  ctx.restore();
}

// ===== Particles =====

function drawParticles(ctx: CanvasRenderingContext2D, state: GameState): void {
  for (const p of state.particles) {
    const alpha = p.life / p.maxLife;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.pos.x, p.pos.y, p.radius * alpha, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

// ===== Background =====

function drawBackground(ctx: CanvasRenderingContext2D, state: GameState, assets: GameAssets): void {
  if (assets.background?.complete && assets.background.naturalWidth > 0) {
    ctx.drawImage(assets.background, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  } else {
    ctx.fillStyle = "#0a0a1a";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.fillStyle = "#ffffff";
    const seed = 42;
    for (let i = 0; i < 60; i++) {
      const sx = ((i * 137 + seed) * 7) % CANVAS_WIDTH;
      const baseY = ((i * 251 + seed) * 13) % CANVAS_HEIGHT;
      const sy = (baseY + state.frame * (0.3 + (i % 3) * 0.3)) % CANVAS_HEIGHT;
      const size = 1 + (i % 3);
      ctx.globalAlpha = 0.3 + (i % 5) * 0.15;
      ctx.fillRect(sx, sy, size, size);
    }
    ctx.globalAlpha = 1;
  }
}

// ===== HUD =====

function drawHUD(ctx: CanvasRenderingContext2D, state: GameState): void {
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 20px 'Segoe UI', sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(`SCORE: ${state.score}`, 16, 32);
  ctx.textAlign = "right";
  ctx.fillText(`HI: ${state.hiScore}`, CANVAS_WIDTH - 16, 32);
  ctx.textAlign = "left";
}

// ===== Screens =====

function drawTitleScreen(ctx: CanvasRenderingContext2D, state: GameState): void {
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 48px 'Segoe UI', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("SPACE SHOOTER", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 40);

  ctx.font = "20px 'Segoe UI', sans-serif";
  ctx.fillStyle = "#aaaaaa";
  ctx.fillText(`HI-SCORE: ${state.hiScore}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 10);

  if (Math.floor(state.frame / 30) % 2 === 0) {
    ctx.fillStyle = "#00e5ff";
    ctx.font = "bold 22px 'Segoe UI', sans-serif";
    ctx.fillText("PRESS SPACE TO START", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 60);
  }

  ctx.font = "14px 'Segoe UI', sans-serif";
  ctx.fillStyle = "#666666";
  ctx.fillText("← → or A D : Move    SPACE : Shoot", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 110);
  ctx.textAlign = "left";
}

function drawGameOverScreen(ctx: CanvasRenderingContext2D, state: GameState): void {
  ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  ctx.fillStyle = "#ff1744";
  ctx.font = "bold 48px 'Segoe UI', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("GAME OVER", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 50);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 28px 'Segoe UI', sans-serif";
  ctx.fillText(`SCORE: ${state.score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 10);

  if (state.score >= state.hiScore && state.score > 0) {
    ctx.fillStyle = "#ffeb3b";
    ctx.font = "bold 20px 'Segoe UI', sans-serif";
    ctx.fillText("NEW HIGH SCORE!", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 45);
  }

  if (Math.floor(state.frame / 30) % 2 === 0) {
    ctx.fillStyle = "#00e5ff";
    ctx.font = "bold 20px 'Segoe UI', sans-serif";
    ctx.fillText("PRESS SPACE TO RETRY", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 90);
  }
  ctx.textAlign = "left";
}

function drawClearScreen(ctx: CanvasRenderingContext2D, state: GameState): void {
  ctx.fillStyle = "rgba(0, 0, 20, 0.7)";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Rainbow title
  const hue = (state.frame * 3) % 360;
  ctx.fillStyle = `hsl(${hue}, 100%, 70%)`;
  ctx.font = "bold 44px 'Segoe UI', sans-serif";
  ctx.textAlign = "center";
  ctx.shadowColor = `hsl(${hue}, 100%, 50%)`;
  ctx.shadowBlur = 20;
  ctx.fillText("CONGRATULATIONS!", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 70);
  ctx.shadowBlur = 0;

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 24px 'Segoe UI', sans-serif";
  ctx.fillText("ALL BOSSES DEFEATED!", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20);

  ctx.fillStyle = "#ffeb3b";
  ctx.font = "bold 32px 'Segoe UI', sans-serif";
  ctx.fillText(`FINAL SCORE: ${state.score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 30);

  if (state.score >= state.hiScore && state.score > 0) {
    ctx.fillStyle = "#ff9800";
    ctx.font = "bold 20px 'Segoe UI', sans-serif";
    ctx.fillText("NEW HIGH SCORE!", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 65);
  }

  if (Math.floor(state.frame / 30) % 2 === 0) {
    ctx.fillStyle = "#00e5ff";
    ctx.font = "bold 20px 'Segoe UI', sans-serif";
    ctx.fillText("PRESS SPACE TO PLAY AGAIN", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 110);
  }
  ctx.textAlign = "left";
}

// ===== Main render =====

export function render(
  ctx: CanvasRenderingContext2D,
  state: GameState,
  assets: GameAssets
): void {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  drawBackground(ctx, state, assets);

  if (state.phase === "title") {
    drawTitleScreen(ctx, state);
    return;
  }

  drawBullets(ctx, state, assets);
  drawEnemyBullets(ctx, state);
  drawEnemies(ctx, state, assets);

  // Draw boss
  if (state.boss) {
    drawBoss(ctx, state.boss, state.frame, assets);
    if (state.boss.phase !== "entering" || state.boss.pos.y > 0) {
      drawBossHPBar(ctx, state.boss);
    }
  }

  drawParticles(ctx, state);

  if (state.phase === "playing") {
    drawPlayer(ctx, state, assets);
  }

  drawHUD(ctx, state);

  // Warning overlay
  drawWarning(ctx, state);

  if (state.phase === "gameover") {
    drawGameOverScreen(ctx, state);
  }

  if (state.phase === "clear") {
    drawClearScreen(ctx, state);
  }
}
