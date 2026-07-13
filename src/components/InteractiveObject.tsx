import React from 'react';
import type { Station } from '../data/gameData';
import { PixelObject } from './PixelAssets';

interface InteractiveObjectProps {
  station: Station;
  position: { x: number; y: number };
  active: boolean;
}

const InteractiveObject: React.FC<InteractiveObjectProps> = ({ station, position, active }) => {
  return (
    <div className={`station ${active ? 'station-active' : ''}`} style={{ left: `${position.x}px` }}>
      <PixelObject asset={station.asset} label={station.label} active={active} />
      <div className="station-name">{station.name}</div>
    </div>
  );
};

export default InteractiveObject;
