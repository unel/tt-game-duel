import type { GameState } from "../types";

export interface IEngine {
    processTick: (gameState: GameState) => void;
    destroy: () => void;
}