import type { GameState } from "./types";

export function updateBullets(state: GameState): void {
  for (let i = state.bullets.length - 1; i >= 0; i--) {
    state.bullets[i].pos.y -= state.bullets[i].speed;
    // Remove bullets that go off-screen
    if (state.bullets[i].pos.y + state.bullets[i].size.height < 0) {
      state.bullets.splice(i, 1);
    }
  }
}
