// ===== Entity Types =====

export type Vector2 = {
  x: number;
  y: number;
};

export type Size = {
  width: number;
  height: number;
};

export type Player = {
  pos: Vector2;
  size: Size;
  speed: number;
  /** Cooldown frames remaining before next shot */
  cooldown: number;
};

export type Bullet = {
  pos: Vector2;
  size: Size;
  speed: number;
};

export type EnemyBullet = {
  pos: Vector2;
  size: Size;
  vel: Vector2;
};

export type Enemy = {
  pos: Vector2;
  size: Size;
  speed: number;
};

export type BossType = "mid" | "final";

export type BossAttackPattern = "spread" | "aimed" | "spiral" | "barrage";

export type Boss = {
  type: BossType;
  pos: Vector2;
  size: Size;
  hp: number;
  maxHp: number;
  speed: number;
  /** Current phase of entry/fight */
  phase: "entering" | "fighting" | "dying";
  /** Target Y position when entering */
  targetY: number;
  /** Frame counter for movement pattern */
  moveTimer: number;
  /** Direction of horizontal movement: 1 = right, -1 = left */
  moveDir: number;
  /** Frame counter for shooting pattern */
  shootTimer: number;
  /** Current attack pattern index */
  attackIndex: number;
  /** Available attack patterns */
  patterns: BossAttackPattern[];
  /** Frames remaining in current pattern before switching */
  patternTimer: number;
  /** Death animation timer */
  deathTimer: number;
  /** Score awarded on defeat */
  scoreValue: number;
  /** Flash timer for hit feedback */
  flashTimer: number;
};

export type Particle = {
  pos: Vector2;
  vel: Vector2;
  life: number;
  maxLife: number;
  color: string;
  radius: number;
};

// ===== Game State =====

export type GamePhase = "title" | "playing" | "gameover" | "clear";

export type GameState = {
  phase: GamePhase;
  player: Player;
  bullets: Bullet[];
  enemyBullets: EnemyBullet[];
  enemies: Enemy[];
  boss: Boss | null;
  particles: Particle[];
  score: number;
  hiScore: number;
  frame: number;
  spawnTimer: number;
  /** Tracks which boss thresholds have been triggered */
  bossesDefeated: number;
  /** Warning text display timer */
  warningTimer: number;
  warningText: string;
};

// ===== Assets =====

export type GameAssets = {
  player: HTMLImageElement | null;
  enemy: HTMLImageElement | null;
  bullet: HTMLImageElement | null;
  background: HTMLImageElement | null;
  midBoss: HTMLImageElement | null;
  finalBoss: HTMLImageElement | null;
  loaded: boolean;
};

// ===== Input =====

export type InputState = {
  keys: Set<string>;
};
