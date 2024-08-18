import { noop } from "../utils/fn-utils";
import DEFAULTS from "./defaults";

class Ability {
    cooldown: number;
    timer: number;
    name: string;
    description: string;
    meta: Record<string, unknown>;
    activator: () => void;

    constructor({cooldown = DEFAULTS.ABILITY.COOLDOWN, name = '', description = '', meta = {}, activator = noop}) {
        this.cooldown = cooldown;
        this.timer = cooldown;
        this.name = name;
        this.description = description;
        this.activator = activator;
        this.meta = meta;
    }

    canUse() {
        return this.timer >= this.cooldown;
    }

    use() {
        this.timer = 0;
        this.activator();
    }
}

export default Ability;