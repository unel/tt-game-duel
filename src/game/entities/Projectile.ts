import DEFAULTS from "../defaults";
import MovableEntity from "./MovableEntity";

class Projectile extends MovableEntity {
    size: number;

    constructor({position = DEFAULTS.ENTITY.POSITION, size = DEFAULTS.PROJECTILE.SIZE, direction = DEFAULTS.ENTITY.DIRECTION, meta = {}}) {
        super({position, meta});
        this.size = size;
        this.direction = direction;
    }

    type() {
        return 'projectile';
    }
}


export default Projectile;