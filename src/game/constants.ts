// ===== Canvas =====
export const CANVAS_WIDTH = 480;
export const CANVAS_HEIGHT = 720;

// ===== Player =====
export const PLAYER_WIDTH = 48;
export const PLAYER_HEIGHT = 48;
export const PLAYER_SPEED = 6;
export const PLAYER_SHOOT_COOLDOWN = 8; // frames between shots
export const PLAYER_START_Y = CANVAS_HEIGHT - 80;

// ===== Bullet =====
export const BULLET_WIDTH = 8;
export const BULLET_HEIGHT = 20;
export const BULLET_SPEED = 10;

// ===== Enemy Bullet =====
export const ENEMY_BULLET_SIZE = 10;

// ===== Enemy =====
export const ENEMY_WIDTH = 40;
export const ENEMY_HEIGHT = 40;
export const ENEMY_SPEED_MIN = 2;
export const ENEMY_SPEED_MAX = 5;
export const ENEMY_SPAWN_INTERVAL_INITIAL = 50; // frames
export const ENEMY_SPAWN_INTERVAL_MIN = 15;
/** Spawn interval decreases by this every 500 points */
export const ENEMY_SPAWN_SPEEDUP = 5;

// ===== Mid-Boss =====
export const MID_BOSS_WIDTH = 80;
export const MID_BOSS_HEIGHT = 64;
export const MID_BOSS_HP = 40;
export const MID_BOSS_SPEED = 2;
export const MID_BOSS_SCORE = 2000;
export const MID_BOSS_SHOOT_INTERVAL = 40;
/** Mid-boss appears every N points */
export const MID_BOSS_INTERVAL = 3000;

// ===== Final Boss =====
export const FINAL_BOSS_WIDTH = 120;
export const FINAL_BOSS_HEIGHT = 96;
export const FINAL_BOSS_HP = 120;
export const FINAL_BOSS_SPEED = 1.5;
export const FINAL_BOSS_SCORE = 10000;
export const FINAL_BOSS_SHOOT_INTERVAL = 25;
/** Final boss appears at this score */
export const FINAL_BOSS_THRESHOLD = 10000;

// ===== Boss Common =====
export const BOSS_ENTRY_SPEED = 1.5;
export const BOSS_TARGET_Y = 60;
export const BOSS_PATTERN_DURATION = 180; // frames per attack pattern
export const BOSS_DEATH_DURATION = 90;

// ===== Warning =====
export const WARNING_DURATION = 120;

// ===== Particles =====
export const PARTICLE_COUNT = 12;
export const PARTICLE_LIFE = 20;

// ===== Scoring =====
export const SCORE_PER_KILL = 100;

// ===== Storage =====
export const HI_SCORE_KEY = "shooting-game-hi-score";
