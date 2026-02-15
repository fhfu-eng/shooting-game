import type { GameState, InputState, GameAssets } from "./types";
import { updatePlayer } from "./player";
import { updateBullets } from "./bullet";
import { updateEnemies } from "./enemy";
import { checkBossSpawn, updateBoss, updateEnemyBullets } from "./boss";
import { checkCollisions, updateParticles } from "./collision";
import { render } from "./renderer";
import { resetForNewGame } from "./state";

export function tick(
  ctx: CanvasRenderingContext2D,
  state: GameState,
  input: InputState,
  assets: GameAssets
): void {
  state.frame++;

  switch (state.phase) {
    case "title":
      if (input.keys.has(" ")) {
        resetForNewGame(state);
        input.keys.delete(" ");
      }
      break;

    case "playing":
      updatePlayer(state, input);
      updateBullets(state);
      updateEnemies(state);
      checkBossSpawn(state);
      updateBoss(state);
      updateEnemyBullets(state);
      checkCollisions(state);
      updateParticles(state);
      break;

    case "gameover":
      updateParticles(state);
      if (input.keys.has(" ")) {
        resetForNewGame(state);
        input.keys.delete(" ");
      }
      break;

    case "clear":
      updateParticles(state);
      if (input.keys.has(" ")) {
        resetForNewGame(state);
        input.keys.delete(" ");
      }
      break;
  }

  render(ctx, state, assets);
}
