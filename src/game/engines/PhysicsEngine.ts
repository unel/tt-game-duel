import { removeElementsByIndexes } from "../../utils/collections";
import { isCirclesOverlaps } from "../../utils/geo-utils";
import type { GameState, NormalGameState, Position } from "../types";

import MovableEntity from "../entities/MovableEntity";
import Projectile from "../entities/Projectile";
import Hero from "../entities/Hero";

import type { IEngine } from "./types";


class PhysicsEngine implements IEngine{
    #mouseCursorSize: number;
    constructor ({mouseCursorSize}: {mouseCursorSize: number}) {
        this.#mouseCursorSize = mouseCursorSize;
    }

    processTick(gameState: GameState) {
        if (gameState.status === 'destroyed') {
            return;
        }

        const timePassed = gameState.timePassedBetweenTicks;

        if (!timePassed) {
            return;
        }

        const projectiles: [number, Projectile][] = [];
        const heroes: [number, Hero][] = [];

        // moving
        for (const [key, entity] of Object.entries(gameState.entities)) {
            const idx = Number(key);

            if (entity instanceof MovableEntity) {
                entity.position.x += entity.direction.x * (timePassed / 1000);
                entity.position.y += entity.direction.y * (timePassed / 1000);
            }

            if (entity instanceof Projectile) {
                projectiles.push([idx, entity]);
            }

            if (entity instanceof Hero) {
                if (isCirclesOverlaps(entity.position, gameState.mousePosition, entity.size, this.#mouseCursorSize)) {
                    entity.direction.y *= -1;
                }

                heroes.push([idx, entity]);
            }
        }

        // collision checks
        const entitiesIndexesForRemove: number[] = [];

        for (const [pIdx, projectile] of projectiles) {
            for (const [, hero] of heroes) {
                if (isCirclesOverlaps(hero.position, projectile.position, hero.size, projectile.size)) {
                    entitiesIndexesForRemove.push(pIdx);
                    hero.takeDamage();
                    continue;
                }

                const isHeroHovered = gameState.mouseState === 'active' && isCirclesOverlaps(hero.position, gameState.mousePosition, hero.size, this.#mouseCursorSize);
                hero.updateMeta({'hovered': isHeroHovered});
            }

            if (
                projectile.position.x + projectile.size >= gameState.worldSize.width
                || projectile.position.x - projectile.size <= 0
                || projectile.position.y + projectile.size >= gameState.worldSize.height
                || projectile.position.y - projectile.size <= 0
            ) {
                entitiesIndexesForRemove.push(pIdx);
            }
        }

        for (const [,hero] of heroes) {
            if (hero.position.y - hero.size <= 0) {
                hero.direction.y *= -1
                hero.position.y = 0 + hero.size + 10;
            }

            if (hero.position.y + hero.size >= gameState.worldSize.height) {
                hero.direction.y *= -1;
                hero.position.y = gameState.worldSize.height - hero.size - 10;
            }

        }

        removeElementsByIndexes(gameState.entities, entitiesIndexesForRemove);
    }

    static heroesesUnderCursor(gameState: NormalGameState, cursorPosition: Position, cursorSize: number) {
        const heroeses = gameState.entities.filter(entity => entity instanceof Hero);
        const bySelection: Record<string, Hero[]> = {};

        for (const hero of heroeses) {
            const isOverlap = isCirclesOverlaps(hero.position, cursorPosition, hero.size, cursorSize);
            const key = isOverlap ? 'inside' : 'outside';
            bySelection[key] ||= [];
            bySelection[key].push(hero);
        };


        return bySelection;
    }

    destroy() {

    }
}

export default PhysicsEngine;