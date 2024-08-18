import { useEffect, useRef, useState } from 'react';

import type Hero from './game/entities/Hero';
import { createNewGame } from './game/createGame';
import Game from './game';
import './App.css'

let game = createNewGame();
function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const selectedHero = useState<Hero | null>(null);

  const startGame = () => {
    game.start();
  };

  const stopGame = () => {
    game.stop();
  };

  const newGame = () => {
    game.destroy();

    game = createNewGame();
    if (canvasRef.current) {
      game.linkToCanvas(canvasRef.current);
    }
  };

  const registerMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
    
    game.registerMousePosition({x: e.clientX - rect.left, y: e.clientY - rect.top});
  };

  const registerMouseClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();

    const heroes = game.registerMouseClick({x: e.clientX - rect.left, y: e.clientY - rect.top});

    console.log('he', heroes);
  }

  const registerMouseEnter = () => {
    game.registerMouseEnter();
  }

  const registerMouseLeave = () => {
    game.registerMouseLeave();
  }

  const dumpState = () => {
    game.dumpState();
  };

  useEffect(() => {
    if (canvasRef.current) {
      game.linkToCanvas(canvasRef.current);
    }
  }, [canvasRef.current])


  return (
    <main>
      <section>
        <canvas 
          className="canvas"

          ref={canvasRef}

          onClick={registerMouseClick}
          onMouseMove={registerMouseMove}   
          onMouseEnter={registerMouseEnter}
          onMouseLeave={registerMouseLeave}
        />
      </section>

      <section>
        <button onClick={startGame}>start</button>
        <button onClick={stopGame}>stop</button>
        <button onClick={dumpState}>dump</button>

        <button onClick={newGame}>new</button>
      </section>
    </main>
  )
}

export default App
