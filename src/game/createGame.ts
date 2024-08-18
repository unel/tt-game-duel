import Game from ".";

import Hero from "./entities/Hero";
import Ability from "./Ability";
import Projectile from "./entities/Projectile";

export function createNewGame() {
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