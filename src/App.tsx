import './App.css'

import Game from './game';
import Canvas from './components/Canvas'
import { useEffect, useRef } from 'react';

let game = Game.createNewGame();
function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startGame = () => {
    game.start();
  };

  const stopGame = () => {
    game.stop();
  };

  const newGame = () => {
    game.destroy();

    game = Game.createNewGame();
  };

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
        <Canvas ref={canvasRef} />
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
