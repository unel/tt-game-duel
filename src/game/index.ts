type GameState = {
    status: 'created' | 'working' | 'stopped' | 'destroyed';
    worldSize: {
        width: number;
        height: number;
    };
    timePassedBetweenTicks: number;
    totalTimePassed: number;
    entities: GameEntity[];
};

const noop = () => {};
const distance = (p1: GameEntity['position'], p2: GameEntity['position']): number => {
    return Math.sqrt(
        (p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2
    );
};

const removeElementsByIndexes = (arr: unknown[], indexes: number[]) => {
    indexes.sort((a, b) => b - a);
    
    // Удаляем элементы, начиная с конца массива
    for (const index of indexes) {
      arr.splice(index, 1);
    }
  }


const DEFAULTS = {
    ENTITY: {
        POSITION: {x: 0, y: 0},
        DIRECTION: {x: 0, y: 0},
    },

    PROJECTILE: {
        SIZE: 1,
        MOVING_SPEED: 2,
    },

    HERO: {
        POSITION: {x: 0, y: 0},
        COLOR: 'black',
        SIZE: 10,
        MOVING_SPEED: 1,
        ATTACK_SPEED: 0.5,
    },

    ABILITY: {
        COOLDOWN: 10,
    }
};

class GameEntity {
    position: { x: number; y: number; };

    constructor({position = DEFAULTS.ENTITY.POSITION}) {
        this.position = position;
    }
}

class MovableEntity extends GameEntity {
    direction: { x: number, y: number };

    constructor({position = DEFAULTS.ENTITY.POSITION, direction = DEFAULTS.ENTITY.DIRECTION}) {
        super({position});

        this.direction = direction;
    }
}

class Projectile extends MovableEntity {
    size: number;

    constructor({position = DEFAULTS.ENTITY.POSITION, size = DEFAULTS.PROJECTILE.SIZE, direction = DEFAULTS.ENTITY.DIRECTION}) {
        super({position});
        this.size = size;
        this.direction = direction;
    }
}

class Hero extends MovableEntity {
    color: string;
    size: number;
    attackSpeed: number;
    abilities: Ability[];
    damage: number;

    constructor({
        position = DEFAULTS.HERO.POSITION, 
        color = DEFAULTS.HERO.COLOR, 
        size = DEFAULTS.HERO.SIZE, 
        attackSpeed = DEFAULTS.HERO.ATTACK_SPEED, 
        direction = DEFAULTS.ENTITY.DIRECTION,
        abilities = [],
    } = {}) {
        super({position});

        this.direction = direction;
        this.color = color;
        this.size = size;
        this.attackSpeed = attackSpeed;
        this.abilities = abilities;
        this.damage = 0;
    }

    static createDefaultHero() {
        return new Hero();
    }

    addAbility(ability: Ability) {
        this.abilities.push(ability);
    }

    takeDamage(n = 1) {
        this.damage += n;
    }
}

class Ability {
    cooldown: number;
    timer: number;
    name: string;
    description: string;
    activator: () => void;

    constructor({cooldown = DEFAULTS.ABILITY.COOLDOWN, name = '', description = '', activator = noop}) {
        this.cooldown = cooldown;
        this.timer = cooldown;
        this.name = name;
        this.description = description;
        this.activator = activator;
    }

    canUse() {
        return this.timer >= this.cooldown;
    }

    use() {
        this.timer = 0;
        this.activator();
        console.log(`ability "${this.name}" activated!`);
    }
}


interface IEngine {
    processTick: (gameState: GameState) => void;
    destroy: () => void;
}

class GameEngine implements IEngine {
    processTick(gameState: GameState) {
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

class PhysicsEngine implements IEngine{
    processTick(gameState: GameState) {
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
                heroes.push([idx, entity]);
            }
        }

        // collision checks
        const entitiesIndexesForRemove: number[] = [];

        for (const [pIdx, projectile] of projectiles) {
            for (const [, hero] of heroes) {
                const d = distance(hero.position, projectile.position);

                if (d < (hero.size + projectile.size)) {
                    entitiesIndexesForRemove.push(pIdx);
                    hero.takeDamage();
                    continue;
                }
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
            if (
                hero.position.y - hero.size <= 0
                || hero.position.y + hero.size >= gameState.worldSize.height

            ) {
                hero.direction.y *= -1;
            }

        }

        removeElementsByIndexes(gameState.entities, entitiesIndexesForRemove);
    }

    destroy() {

    }
}

class RenderEngine implements IEngine {
    #canvas?: HTMLCanvasElement;

    processTick(gameState: GameState) {
        this.render(gameState);
        
    }

    render(gameState: GameState) {
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
    }

    renderHero(ctx: CanvasRenderingContext2D, hero: Hero) {
        this.renderCircle(ctx, hero.position, hero.size, hero.color);
        this.renderCircle(ctx, hero.position, 2, 'black');

        // const projectileSize = 10;
        // this.renderCircle(ctx, {
        //     y: hero.position.y,
        //     x: hero.position.x + (hero.size) + projectileSize + 2,
        // }, projectileSize, 'black');
    }

    renderProjectile(ctx: CanvasRenderingContext2D, projectile: Projectile) {
        this.renderCircle(ctx, projectile.position, projectile.size, 'black');
    }

    renderCircle(ctx: CanvasRenderingContext2D, position: GameEntity['position'], radius: number, color: string) {
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(position.x, position.y, radius, 0, 2 * Math.PI);
        ctx.fill();
      }

    linkToCanvas(canvas: HTMLCanvasElement) {
        this.#canvas = canvas;
    }

    destroy() {
        this.#canvas = undefined;
    }
}

class Game {
    public state: GameState;
    #engines: IEngine[];
    #renderEngine: RenderEngine;
    #lastTickTime?: number;
    #rafId?: number;

    constructor({ worldSize }: { worldSize: GameState['worldSize'] }) {
        this.state = {
            worldSize,
            status: 'created',
            totalTimePassed: 0,
            timePassedBetweenTicks: 0,
            entities: [],
        };

        this.#renderEngine = new RenderEngine();
        this.#engines = [
            new GameEngine(),
            new PhysicsEngine(),
            this.#renderEngine,
        ];
    }

    addEntity(entity: GameEntity) {
        this.state.entities.push(entity);
    }

    linkToCanvas(canvas: HTMLCanvasElement) {
        this.#renderEngine.linkToCanvas(canvas);
        this.#renderEngine.render(this.state);
    }

    start() {
        if (['working', 'destroyed'].includes(this.state.status)) {
            return;
        }
        this.tick();
    }

    tick() {
        if (['stopped', 'destroyed'].includes(this.state.status)) {
            return;
        }
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
            entities: [],
            timePassedBetweenTicks: 0,
            totalTimePassed: 0,
            worldSize: {width: 0, height: 0},
        };
        
        for (const engine of this.#engines) {
            engine.destroy();
        }
    }


    static createNewGame() {
        const worldSize = {
            width: 600,
            height: 600,
        };

        const game = new Game({worldSize});

        const heroSize = 40;
        const projectileSize = 10;

        const hero1 = new Hero({
            position: {x: heroSize, y: worldSize.height / 2},
            color: 'blue',
            size: heroSize,
            direction: {x: 0, y: -20},
        });

        hero1.addAbility(new Ability({
            cooldown: 5,
            name: 'fire/1',
            activator: () => {
                game.addEntity(new Projectile({
                    position: {
                        y: hero1.position.y,
                        x: hero1.position.x + hero1.size + projectileSize + 2,
                    },
                    size: projectileSize,
                    direction: {x: 10, y: 0},
                }))
            }
        }));
        game.addEntity(hero1);

        const hero2 = new Hero({
            position: {x: worldSize.width - heroSize, y: worldSize.height / 2},
            direction: {x: 0, y: 20},
            size: heroSize,
            color: 'red',
        });

        hero2.addAbility(new Ability({
            cooldown: 5,
            name: 'fire/2',
            activator: () => {
                game.addEntity(new Projectile({
                    position: {
                        y: hero2.position.y,
                        x: hero2.position.x - hero2.size - projectileSize - 2,
                    },
                    size: projectileSize,
                    direction: {x: -10, y: 0},
                }))
            }
        }))
        game.addEntity(hero2);

        return game;
    }
}


export default Game;