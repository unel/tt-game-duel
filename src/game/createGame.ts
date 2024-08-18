import Game from ".";

import Hero from "./entities/Hero";
import Ability from "./Ability";
import Projectile from "./entities/Projectile";

export function createNewGame({movingSpeed = 1010, cooldown = 3.3, projectileSpeed = 2200} = {}) {
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
        direction: {x: 0, y: -movingSpeed},
    });

    const ability1 = new Ability({
        cooldown,
        name: 'fire/1',
        meta: {
            speed: projectileSpeed,
        },
        activator: () => {
            game.addEntity(new Projectile({
                position: {
                    y: hero1.position.y,
                    x: hero1.position.x + hero1.size + projectileSize + 2,
                },
                size: projectileSize,
                direction: {x: ability1.meta.speed as number, y: 0},
            }))
        }
    });

    hero1.addAbility(ability1);
    game.addEntity(hero1);

    const hero2 = new Hero({
        position: {x: worldSize.width - heroSize, y: worldSize.height / 2},
        direction: {x: 0, y: movingSpeed},
        size: heroSize,
        color: 'red',
    });

    const ability2 = new Ability({
        cooldown,
        name: 'fire/2',
        meta: {
            speed: projectileSpeed,
        },
        activator: () => {
            game.addEntity(new Projectile({
                position: {
                    y: hero2.position.y,
                    x: hero2.position.x - hero2.size - projectileSize - 2,
                },
                size: projectileSize,
                direction: {x: -(ability2.meta.speed as number), y: 0},
            }))
        }
    });

    hero2.addAbility(ability2);
    game.addEntity(hero2);

    return game;
}