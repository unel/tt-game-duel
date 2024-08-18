import DEFAULTS from "../defaults";
import MovableEntity from "./MovableEntity";

class Projectile extends MovableEntity {
    size: number;

    constructor({position = DEFAULTS.ENTITY.POSITION, size = DEFAULTS.PROJECTILE.SIZE, direction = DEFAULTS.ENTITY.DIRECTION, meta = {}, name = ''}) {
        super({position, meta, name});
        this.size = size;
        this.direction = direction;
    }

    type() {
        return 'projectile';
    }

    destroy() {
        super.destroy()
    }
}


export default Projectile;