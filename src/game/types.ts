import type GameEntity from "./entities/GameEntity";

export type Position = {
    x: number;
    y: number;
};

export type Direction = {
    x: number;
    y: number;
};

export type Size = {
    width: number;
    height: number;
};


export type NormalGameState = {
    status: 'created' | 'working' | 'stopped';
    worldSize: Size;
    mousePosition: Position;
    mouseState: 'active' | 'inactive'
    timePassedBetweenTicks: number;
    totalTimePassed: number;
    entities: GameEntity[];
};

export type DestroyedGameState = {
    status: 'destroyed';
};

export type GameState = NormalGameState | DestroyedGameState;