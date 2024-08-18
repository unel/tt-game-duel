import type { Position } from "../types";
import DEFAULTS from "../defaults";
import { genRandomId } from "../../utils/gen-utils";

class GameEntity {
    position: Position;
    meta: Record<string, unknown>;
    id: string;

    constructor({position = DEFAULTS.ENTITY.POSITION}) {
        this.position = position;
        this.meta = {};
        this.id = genRandomId(`${this.type()}-`);
    }

    type() {
        return 'entity';
    }
    
    updateMeta(updates: Record<string, unknown>) {
        Object.assign(this.meta, updates);
    }
}

export default GameEntity;