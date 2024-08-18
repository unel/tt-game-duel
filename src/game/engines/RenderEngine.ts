import type { IEngine } from "./types";
import type { GameState, NormalGameState, Position } from "../types";

import Hero from "../entities/Hero";
import Projectile from "../entities/Projectile";

class RenderEngine implements IEngine {
    #canvas?: HTMLCanvasElement;
    #mouseCursorSize: number;
    #cursorColor: string;

    constructor({mouseCursorSize, cursorColor = 'yellow'}: {mouseCursorSize: number, cursorColor?: string}) {
        this.#mouseCursorSize = mouseCursorSize;
        this.#cursorColor = cursorColor;
    }

    processTick(gameState: GameState) {
        if (gameState.status === 'destroyed') return;

        this.render(gameState);
        
    }

    render(gameState: NormalGameState) {
        if (!this.#canvas) {
            return;
        }

        this.#canvas.width = gameState.worldSize.width;
        this.#canvas.height = gameState.worldSize.height;

        const ctx = this.#canvas.getContext("2d");
        if (!ctx) {
            return;
        }

        for (const entity of gameState.entities) {
            if (entity instanceof Hero) {
                this.renderHero(ctx, entity);
            }

            if (entity instanceof Projectile) {
                this.renderProjectile(ctx, entity);
            }
        }

        if (gameState.mouseState === 'active') {
            this.renderMouseCursor(ctx, gameState);
        }
    }

    renderMouseCursor(ctx: CanvasRenderingContext2D, gameState: NormalGameState) {
        this.renderCircle(ctx, {position: gameState.mousePosition, radius: this.#mouseCursorSize, fillColor: this.#cursorColor});
    }

    renderHero(ctx: CanvasRenderingContext2D, hero: Hero) {
        this.renderCircle(ctx, {
            position: hero.position, 
            radius: hero.size, 
            fillColor: hero.color,

            strokeWidth: 2,
            strokeColor: 
                hero.meta.selected 
                    ? 'black'
                    : hero.meta.hovered 
                        ? 'silver' 
                        : hero.color,
        });
        this.renderCircle(ctx, {position: hero.position, radius: 2, fillColor: 'black'});
    }

    renderProjectile(ctx: CanvasRenderingContext2D, projectile: Projectile) {
        this.renderCircle(ctx, {position: projectile.position, radius: projectile.size, fillColor: 'black'});
    }

    renderCircle(ctx: CanvasRenderingContext2D, {position, fillColor, strokeColor, strokeWidth = 0, radius}: {position: Position, fillColor: string, strokeColor?: string, strokeWidth?: number, radius: number}) {
        ctx.beginPath();
        ctx.fillStyle = fillColor;
        if (strokeColor !== undefined) {
            ctx.strokeStyle = strokeColor;
        }
        if (strokeWidth !== undefined) {
            ctx.lineWidth = strokeWidth;
        }
        ctx.arc(position.x, position.y, radius, 0, 2 * Math.PI);
        ctx.fill();

        if (strokeColor !== undefined && strokeWidth > 0) {
            ctx.stroke();
        }
      }

    linkToCanvas(canvas: HTMLCanvasElement) {
        this.#canvas = canvas;
    }

    destroy() {
        this.#canvas = undefined;
    }
}


export default RenderEngine;