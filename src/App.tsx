import { useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import IntroTerminal from './components/IntroTerminal';
import Game from './components/Game';

function App() {
  const [gameStarted, setGameStarted] = useState(false);

  const startGame = () => {
    setGameStarted(true);
  };

  return (
    <>
      {gameStarted ? <Game /> : <IntroTerminal onStartGame={startGame} />}
      <div className="rotate-device-overlay" role="dialog" aria-modal="true" aria-labelledby="rotate-title">
        <div className="rotate-device-visual" aria-hidden="true">
          <span className="rotate-phone" />
          <span className="rotate-arrow">↻</span>
        </div>
        <strong id="rotate-title">Rotate your phone</strong>
        <p>This portfolio plays in landscape. Turn your phone sideways to continue.</p>
      </div>
      <Analytics />
      <SpeedInsights />
    </>
  );
}

export default App;
