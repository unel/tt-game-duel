import { useEffect, useState } from "react";
import type Game from "../../game";

import './style.css'
type Props = {
    game: Game
};

function ScorePane({game, scoreKey, label}: Props & {scoreKey: string, label: string}) {
    const [scores, setScores] = useState<number>(0);

    useEffect(() => {
        setScores(0);
        return game.subscribe(scoreKey, (oldValue, newValue) => {
            setScores(Number(newValue));
        });
    }, [game, scoreKey]);

    return (
        <div className="score-pane">
            <label className="score-label">{label}</label>
            
            <span className="score-value">{scores}</span>
        </div>
    );
}

function ScoresBoard({game}: Props) {
    return (
        <div className="score-board">
            <ScorePane game={game} label="Player 1 scores:" scoreKey="scores1" />
            <ScorePane game={game} label="Player 2 scores:" scoreKey="scores2" />
        </div>
    )
}

export default ScoresBoard;