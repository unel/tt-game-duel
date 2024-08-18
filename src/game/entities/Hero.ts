import DEFAULTS from "../defaults";
import Ability from "../Ability";
import MovableEntity from "./MovableEntity";

class Hero extends MovableEntity {
    color: string;
    size: number;
    attackSpeed: number;
    abilities: Ability[];

    constructor({
        position = DEFAULTS.HERO.POSITION, 
        color = DEFAULTS.HERO.COLOR, 
        size = DEFAULTS.HERO.SIZE, 
        attackSpeed = DEFAULTS.HERO.ATTACK_SPEED, 
        direction = DEFAULTS.ENTITY.DIRECTION,
        abilities = [],
        meta = {},
    } = {}) {
        super({position, meta});

        this.direction = direction;
        this.color = color;
        this.size = size;
        this.attackSpeed = attackSpeed;
        this.abilities = abilities;
    }

    static createDefaultHero() {
        return new Hero();
    }

    type() {
        return 'hero';
    }

    addAbility(ability: Ability) {
        this.abilities.push(ability);
    }
}

export default Hero;