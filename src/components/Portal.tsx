import React from 'react';
import { PixelPortal } from './PixelAssets';

interface PortalProps {
  position: { x: number; y: number };
  direction: 'next' | 'previous';
}

const Portal: React.FC<PortalProps> = ({ position, direction }) => {
  return (
    <div className="portal-shell" style={{ left: `${position.x}px` }}>
      <PixelPortal direction={direction} />
    </div>
  );
};

export default Portal;
