import { noop } from "../utils/fn-utils";
import DEFAULTS from "./defaults";

class Ability {
    cooldown: number;
    timer: number;
    name: string;
    description: string;
    activator: () => void;

    constructor({cooldown = DEFAULTS.ABILITY.COOLDOWN, name = '', description = '', activator = noop}) {
        this.cooldown = cooldown;
        this.timer = cooldown;
        this.name = name;
        this.description = description;
        this.activator = activator;
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