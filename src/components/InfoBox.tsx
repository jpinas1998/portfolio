import React from 'react';
import type { Station } from '../data/gameData';

interface InfoBoxProps {
  data: Station;
  onClose: () => void;
}

const InfoBox: React.FC<InfoBoxProps> = ({ data, onClose }) => {
  return (
    <div className="info-overlay" role="dialog" aria-modal="true" aria-labelledby="station-title">
      <div className="info-panel">
        <button onClick={onClose} className="info-close" aria-label="Close station">
          x
        </button>
        <p className="info-kicker">Station unlocked</p>
        <h2 id="station-title">{data.name}</h2>
        <p className="info-description">{data.description}</p>

        {data.stats && (
          <div className="stat-row">
            {data.stats.map((stat) => (
              <span key={stat}>{stat}</span>
            ))}
          </div>
        )}

        <ul>
          {data.details.map((detail) => (
            <li key={detail}>{detail}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default InfoBox;
