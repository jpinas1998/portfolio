import React from 'react';

interface ParallaxBackgroundProps {
  cameraX: number;
}

const ParallaxBackground: React.FC<ParallaxBackgroundProps> = ({ cameraX }) => {
  return (
    <div className="parallax" aria-hidden="true">
      <div className="sky-grid" style={{ transform: `translateX(${-cameraX * 0.08}px)` }} />
      <div className="cloud-band" style={{ transform: `translateX(${-cameraX * 0.16}px)` }}>
        <span className="cloud c1" />
        <span className="cloud c2" />
        <span className="cloud c3" />
      </div>
      <div className="city-band" style={{ transform: `translateX(${-cameraX * 0.32}px)` }}>
        {Array.from({ length: 18 }).map((_, index) => (
          <span key={index} style={{ height: `${54 + (index % 5) * 18}px` }} />
        ))}
      </div>
      <div className="box-wall" style={{ transform: `translateX(${-cameraX * 0.48}px)` }}>
        <div className="rings rings-a"><span /><span /></div>
        <div className="climbing-rope" />
        <div className="plate-stack"><span /><span /><span /></div>
        <div className="chalk-bucket"><span /></div>
        <div className="plyo-box">24"</div>
      </div>
      <div className="floor-pattern" />
      <div className="lane-markers">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
};

export default ParallaxBackground;
