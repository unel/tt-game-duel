const DEFAULTS = {
    ENTITY: {
        POSITION: {x: 0, y: 0},
        DIRECTION: {x: 0, y: 0},
    },

    PROJECTILE: {
        SIZE: 1,
        MOVING_SPEED: 2200,
    },

    HERO: {
        POSITION: {x: 0, y: 0},
        COLOR: 'black',
        SIZE: 10,
        MOVING_SPEED: 1,
        ATTACK_SPEED: 2200,
    },

    ABILITY: {
        COOLDOWN: 3.3,
    }
};

export default DEFAULTS;