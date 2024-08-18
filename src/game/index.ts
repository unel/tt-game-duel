import type { Position, Size } from "./types";
import type { GameState,  } from "./types";
import type { IEngine } from "./engines/types";
import RenderEngine from "./engines/RenderEngine";
import GameEngine from "./engines/GameEngine";
import PhysicsEngine from "./engines/PhysicsEngine";
import GameEntity from "./entities/GameEntity";
import type Hero from "./entities/Hero";


const MOUSE_CURSOR_SIZE = 10;

class Game {
    public state: GameState;
    #engines: IEngine[];
    #renderEngine: RenderEngine;
    #physicsEngine: PhysicsEngine;
    #lastTickTime?: number;
    #rafId?: number;

    constructor({ worldSize }: { worldSize: Size }) {
        this.state = {
            worldSize,
            status: 'created',
            totalTimePassed: 0,
            timePassedBetweenTicks: 0,
            entities: [],
            mousePosition: {x: 0, y: 0},
            mouseState: 'inactive',
        };

        this.#renderEngine = new RenderEngine({ mouseCursorSize: MOUSE_CURSOR_SIZE });
        this.#physicsEngine = new PhysicsEngine({ mouseCursorSize: MOUSE_CURSOR_SIZE }); 
        this.#engines = [
            new GameEngine(),
            this.#physicsEngine,
            this.#renderEngine,
        ];
    }

    registerMouseClick(position: Position) {
        if (this.state.status === 'destroyed') return;

        this.state.mousePosition = position;
        const bySelection = PhysicsEngine.heroesesUnderCursor(this.state, position, MOUSE_CURSOR_SIZE);
    
        const selected: Hero[] = [];
        for (const hero of (bySelection['inside'] ?? [])) {
            hero.updateMeta({
                selected: !hero.meta.selected
            });

            if (hero.meta.selected) {
                selected.push(hero);
            }
        }

        for (const hero of (bySelection['outside'] ?? [])) {
            hero.updateMeta({
                selected: false,
            });
        }

        return selected;
    }

    registerMousePosition(position: Position) {
        if (this.state.status === 'destroyed') return;

        this.state.mousePosition = position;
    }

    registerMouseEnter() {
        if (this.state.status === 'destroyed') return;

        this.state.mouseState = 'active';
    }

    registerMouseLeave() {
        if (this.state.status === 'destroyed') return;

        this.state.mouseState = 'inactive';
    }

    addEntity(entity: GameEntity) {
        if (this.state.status === 'destroyed') return;

        this.state.entities.push(entity);
    }

    linkToCanvas(canvas: HTMLCanvasElement) {
        if (this.state.status === 'destroyed') return;

        this.#renderEngine.linkToCanvas(canvas);
        this.#renderEngine.render(this.state);
    }

    start() {
        if (['working', 'destroyed'].includes(this.state.status)) {
            return;
        }
        this.#lastTickTime = Date.now();
        this.tick();
    }

    tick() {
        if (this.state.status === 'destroyed') return;
        if (this.state.status === 'stopped') return;
        
        const currentTime = Date.now();
        const timeDelta = this.#lastTickTime ? currentTime - this.#lastTickTime : 0;

        this.state.timePassedBetweenTicks = timeDelta;
        this.state.totalTimePassed += timeDelta;
        for (const engine of this.#engines) {
            engine.processTick(this.state);
        }
        this.#lastTickTime = currentTime;

        if ((this.state.totalTimePassed % 1000) === 0) {
            this.dumpState();
        }

        this.#rafId = requestAnimationFrame(() => {
            this.tick();
        });
    }

    dumpState() {
        console.log('game state', this.state);
    }

    stop() {
        if (['stopped', 'destroyed'].includes(this.state.status)) {
            return;
        }

        if (this.#rafId !== undefined) {
            cancelAnimationFrame(this.#rafId);
        }
    }

    destroy() {
        if (this.state.status === 'destroyed') {
            return;
        }

        this.stop();
        this.state = {
            status: 'destroyed',
        };
        
        for (const engine of this.#engines) {
            engine.destroy();
        }
    }
}


export default Game;