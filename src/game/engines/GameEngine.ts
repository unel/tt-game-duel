import type { GameState } from "../types";
import Hero from '../entities/Hero'
import type { IEngine } from "./types";

class GameEngine implements IEngine {
    processTick(gameState: GameState) {
        if (gameState.status === 'destroyed') {
            return;
        }

        const timePassed = gameState.timePassedBetweenTicks;
        if (!timePassed) {
            return;
        }

        for (const entity of gameState.entities) {
            if (entity instanceof Hero) {
                for (const ability of entity.abilities) {
                    if (ability.timer <= ability.cooldown) {
                        ability.timer += timePassed * (timePassed / 1000);
                    }

                    if (ability.canUse()) {
                        ability.use();
                    }
                }
            }
        }
    }

    destroy() {

    }
}

export default GameEngine;