import DEFAULTS from "../defaults";
import type { Direction } from "../types";
import GameEntity from "./GameEntity";

class MovableEntity extends GameEntity {
    direction: Direction;

    constructor({position = DEFAULTS.ENTITY.POSITION, direction = DEFAULTS.ENTITY.DIRECTION, meta = {}}) {
        super({position, meta});

        this.direction = direction;
    }
}

export default MovableEntity;
