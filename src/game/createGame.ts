import Game from ".";

import Hero from "./entities/Hero";
import Ability from "./Ability";
import Projectile from "./entities/Projectile";

export function createNewGame({movingSpeed = 744, cooldown = 1.4, projectileSpeed = 2200} = {}) {
    const worldSize = {
        width: 600,
        height: 600,
    };

    const game = new Game({worldSize});

    const heroSize = 40;
    const projectileSize = 10;

    const hero1 = new Hero({
        position: {x: heroSize, y: worldSize.height / 2},
        name: 'Player 1 (blue)',
        color: 'blue',
        size: heroSize,
        direction: {x: 0, y: -movingSpeed},
    });

    
    hero1.subscribe('scores', (oldValue, value) => {
        game.updateState({'scores1': value});
    });

    const ability1 = new Ability({
        cooldown,
        name: 'fire/1',
        meta: {
            speed: projectileSpeed,
            sourceHeroId: hero1.id,
        },
        activator: () => {
            game.addEntity(new Projectile({
                position: {
                    y: hero1.position.y,
                    x: hero1.position.x + hero1.size + projectileSize + 2,
                },
                meta: {
                    sourceHeroId: ability1.meta.sourceHeroId,
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
        name: 'Player 2 (red)',
        direction: {x: 0, y: movingSpeed},
        size: heroSize,
        color: 'red',
    });

    const ability2 = new Ability({
        cooldown,
        name: 'fire/2',
        meta: {
            speed: projectileSpeed,
            sourceHeroId: hero2.id,
        },
        activator: () => {
            game.addEntity(new Projectile({
                position: {
                    y: hero2.position.y,
                    x: hero2.position.x - hero2.size - projectileSize - 2,
                },
                meta: {
                    sourceHeroId: ability2.meta.sourceHeroId,
                },
                size: projectileSize,
                direction: {x: -(ability2.meta.speed as number), y: 0},
            }))
        }
    });

    hero2.addAbility(ability2);

 
    hero2.subscribe('scores', (oldValue, value) => {
        game.updateState({'scores2': value});
    });
    game.addEntity(hero2);


    game.subscribe('scores1', (o, n) => {
        console.log(`scores1: ${o} -> ${n}`);
    });

    
    game.subscribe('scores2', (o, n) => {
        console.log(`scores2: ${o} -> ${n}`);
    });

    return game;
}