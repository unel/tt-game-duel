import type { Position } from "../types";
import DEFAULTS from "../defaults";
import { genRandomId } from "../../utils/gen-utils";


type MetaListener = (oldValue: unknown, newValue: unknown) => void;
type Destroyer = () => void;

class GameEntity {
    position: Position;
    meta: Record<string, unknown>;
    id: string;
    name: string;
    #subscribers: Record<string, Array<undefined | MetaListener>>;
    #destroyers: Array<Destroyer | undefined>;

    constructor({position = DEFAULTS.ENTITY.POSITION, meta = {}, name = ''}) {
        this.position = position;
        this.meta = meta;
        this.name = name;
        this.id = genRandomId(`${this.type()}-`);
        this.#subscribers = {};
        this.#destroyers = [];
    }

    type() {
        return 'entity';
    }
    
    updateMeta(updates: Record<string, unknown>) {
        // Object.assign(this.meta, updates);

        for (const [key, value] of Object.entries(updates)) {
            const currentValue = this.meta[key];

            this.meta[key] = value;

            if (currentValue !== value && this.#subscribers[key]?.length) {
                this.notify(key, currentValue, value);
            }
        }
    }

    subscribe(metaKey: string, listener: MetaListener) {
        this.#subscribers[metaKey] ||= [];

        this.#subscribers[metaKey].push(listener);
        const subIdx = this.#subscribers[metaKey].length - 1;
        const desIdx = this.#destroyers.length;

        const destroyer = () => {
            try {
                this.#subscribers[metaKey][subIdx] = undefined;
                this.#destroyers[desIdx] = undefined;
            } catch(e) {
                // pass
            }
        };

        return destroyer;
    }

    notify(key: string, oldValue: unknown, newValue: unknown) {
        for (const listener of this.#subscribers[key] || []) {
            try {
                listener?.(oldValue, newValue);
            } catch (e) {
                console.warn('Error in listener', e);
            }
        }
    }

    destroy() {
        for (const destroyer of this.#destroyers) {
            if (destroyer) {
                destroyer();
            }
        }

        this.#destroyers = [];
        this.#subscribers = {};
    }
}

export default GameEntity;