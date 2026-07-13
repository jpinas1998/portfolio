import React, { useEffect, useMemo } from 'react';
import type { LevelData, Station } from '../data/gameData';
import { GATE_X, getStationX, LEVEL_WIDTH } from '../gameLayout';
import InteractiveObject from './InteractiveObject';
import Portal from './Portal';

const INTERACTION_RANGE = 118;

interface LevelProps {
  levelData: LevelData;
  playerPosition: { x: number; y: number };
  goToNextLevel: () => void;
  goToPreviousLevel: () => void;
  isFirstLevel: boolean;
  isLastLevel: boolean;
  gateX: number;
  requiredSkill: 'du' | 'snatch' | 'burpee' | 'boxjump' | null;
  gateUnlocked: boolean;
  requiredSkillLabel: string | null;
  requiredSkillKey: string | null;
  gateShake: number;
  activeAction: 'idle' | 'jump' | 'burpee' | 'du' | 'snatch' | 'boxjump';
  onGateTap: (action: 'du' | 'snatch' | 'burpee' | 'boxjump') => void;
  showSecret: boolean;
  secretPhase: 'ready' | 'falling' | 'collectible' | 'collected';
  secretStage: number;
  secretBlockX: number;
  secretRewardX: number;
}

const Level: React.FC<LevelProps> = ({
  levelData,
  playerPosition,
  goToNextLevel,
  goToPreviousLevel,
  isFirstLevel,
  isLastLevel,
  gateX,
  requiredSkill,
  gateUnlocked,
  requiredSkillLabel,
  requiredSkillKey,
  gateShake,
  activeAction,
  onGateTap,
  showSecret,
  secretPhase,
  secretStage,
  secretBlockX,
  secretRewardX,
}) => {
  const levelWidth = LEVEL_WIDTH;
  const activeStation = useMemo<Station | null>(() => levelData.stations.find((_, index) => {
    const stationX = getStationX(index, levelData.stations.length);
    return Math.abs(playerPosition.x - stationX) < INTERACTION_RANGE;
  }) ?? null, [levelData.stations, playerPosition.x]);
  const lastStationIndex = levelData.stations.length - 1;
  const wodBoardX = lastStationIndex > 0
    ? (getStationX(lastStationIndex - 1, levelData.stations.length) + getStationX(lastStationIndex, levelData.stations.length)) / 2
    : getStationX(0, levelData.stations.length);

  useEffect(() => {
    if (!isLastLevel && gateUnlocked && playerPosition.x > levelWidth - 120) {
      goToNextLevel();
    }

    if (!isFirstLevel && playerPosition.x < 12) {
      goToPreviousLevel();
    }
  }, [gateUnlocked, goToNextLevel, goToPreviousLevel, isFirstLevel, isLastLevel, levelWidth, playerPosition.x]);

  return (
    <div className="level" style={{ width: `${levelWidth}px` }}>
      <div className="level-sign">
        <span>{levelData.company}</span>
        <strong>{levelData.wod}</strong>
      </div>

      <div className="wod-board level-wod-board" style={{ left: `${wodBoardX}px` }}>
        <strong>WOD</strong>
        <span>{levelData.wod}</span>
        <span>Gate: {requiredSkillLabel ?? 'Final PR'}</span>
        <span>Key: {requiredSkillKey ?? 'DONE'}</span>
      </div>

      <div className="box-timer world-timer" style={{ left: '980px' }}>13:37</div>
      <div className="wall-kettlebells" style={{ left: '430px' }} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <div className="rig rig-left" />

      {showSecret && (
        <>
          <div className="secret-platform-stack" style={{ left: `${secretBlockX}px` }} aria-label={`${secretStage} hidden boxes discovered`}>
            {Array.from({ length: secretStage }).map((_, index) => (
              <span key={index} style={{ bottom: `${index * 52}px` }}>24&quot;</span>
            ))}
          </div>
          <div
            className={`mystery-block is-${secretPhase}`}
            style={{ left: `${secretBlockX}px` }}
            role="img"
            aria-label={secretPhase === 'ready' ? 'Mystery 24 inch box. Jump underneath it.' : 'Used mystery box'}
          >
            <strong>{secretPhase === 'ready' ? '?' : '✓'}</strong>
            <small>24&quot;</small>
          </div>
          {(secretPhase === 'falling' || secretPhase === 'collectible') && (
            <div
              className={`secret-reward is-${secretPhase}`}
              style={{ left: `${secretRewardX}px` }}
              aria-label="Mystery PR reward"
            >PR</div>
          )}
        </>
      )}

      {requiredSkill && (
        <div
          className={`skill-gate skill-gate-${requiredSkill} ${gateUnlocked ? 'skill-gate-cleared' : ''} ${!gateUnlocked && gateShake ? 'skill-gate-shake' : ''} ${
            (requiredSkill === 'boxjump' ? activeAction === 'boxjump' : activeAction === requiredSkill) ? 'skill-gate-active' : ''
          }`}
          style={{ left: `${gateX}px` }}
          key={gateShake}
        >
          <div className="gate-callout" role="status" aria-live="polite">
            <span>{gateUnlocked ? 'Cleared' : 'Required move'}</span>
            <strong>{requiredSkillLabel}</strong>
            <em className="desktop-instruction">{gateUnlocked ? 'Portal open' : `Press ${requiredSkillKey} here`}</em>
            <em className="touch-instruction">{gateUnlocked ? 'Portal open' : 'Double tap the striped pole'}</em>
          </div>
          {!gateUnlocked && (
            <button
              type="button"
              className="gate-tap-target"
              aria-label={`Double tap the striped pole to perform ${requiredSkillLabel}`}
              onClick={() => onGateTap(requiredSkill)}
            />
          )}
          <span className="gate-tape" />
          <span className="gate-equipment" />
          <strong>{requiredSkill === 'du' ? 'DU' : requiredSkill === 'snatch' ? 'SNATCH' : requiredSkill === 'boxjump' ? 'BOX' : 'BURPEE'}</strong>
        </div>
      )}

      {!isFirstLevel && <Portal position={{ x: 24, y: 0 }} direction="previous" />}

      {levelData.stations.map((station, index) => (
        <InteractiveObject
          key={station.name}
          station={station}
          active={activeStation?.name === station.name}
          position={{ x: getStationX(index, levelData.stations.length), y: 0 }}
        />
      ))}

      {!isLastLevel && gateUnlocked && <Portal position={{ x: GATE_X + 124, y: 0 }} direction="next" />}

    </div>
  );
};

export default Level;
