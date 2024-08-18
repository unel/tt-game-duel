import type { Position } from "../game/types";

export const distance = (p1: Position, p2: Position): number => {
    return Math.sqrt(
        (p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2
    );
};

export const isCirclesOverlaps = (p1: Position, p2: Position, r1: number, r2: number): boolean => {
    const d = distance(p1, p2);

    return (d < (r1 + r2));
};


