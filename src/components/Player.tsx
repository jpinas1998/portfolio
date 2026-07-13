import React, { useState } from 'react';
import useEventListener from '../hooks/useEventListener';
import { PixelPlayer } from './PixelAssets';

interface PlayerProps {
  position: { x: number; y: number };
  action: 'idle' | 'jump' | 'burpee' | 'du' | 'snatch' | 'boxjump';
  sizeEffect: 'giant' | 'tiny' | null;
}

const Player: React.FC<PlayerProps> = ({ position, action, sizeEffect }) => {
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [isWalking, setIsWalking] = useState(false);

  useEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      setDirection('left');
      setIsWalking(true);
    }
    if (event.key === 'ArrowRight') {
      setDirection('right');
      setIsWalking(true);
    }
  });

  useEventListener('keyup', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      setIsWalking(false);
    }
  });

  return (
    <div
      className={`player-shell ${action === 'jump' ? 'is-jumping' : ''} ${action === 'boxjump' ? 'is-boxjumping' : ''} ${sizeEffect ? `effect-${sizeEffect}` : ''}`}
      style={{ left: `${position.x}px`, bottom: `${96 + position.y}px` }}
    >
      <div className={`player-scale ${sizeEffect ? `is-${sizeEffect}` : ''}`}>
        <PixelPlayer walking={isWalking} direction={direction} burpee={action === 'burpee'} jumping={action === 'jump'} action={action} />
      </div>
    </div>
  );
};

export default Player;
