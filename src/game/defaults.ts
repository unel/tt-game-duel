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

export default DEFAULTS;