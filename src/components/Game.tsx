import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { gameLevels, personal, profile } from '../data/gameData';
import { GATE_X, getStationX, LEVEL_WIDTH } from '../gameLayout';
import useEventListener from '../hooks/useEventListener';
import Level from './Level';
import ParallaxBackground from './ParallaxBackground';
import Player from './Player';
import { playBeep, playDoubleUnderSound, playFootstep, playVictorySound, startBackgroundMusic, stopBackgroundMusic } from '../utils/sound';

const SKILL_RANGE = 58;
const STATION_RANGE = 118;
const WORLD_START_X = -12 * 32;
const PLAYER_START_X = 0;
const FIRST_LEVEL_MIN_PLAYER_X = WORLD_START_X + 48;
type PlayerAction = 'idle' | 'jump' | 'burpee' | 'du' | 'snatch' | 'boxjump';
type Skill = 'du' | 'snatch' | 'burpee' | 'boxjump';
type SecretPhase = 'ready' | 'falling' | 'collectible' | 'collected';
type SecretEffect = 'giant' | 'tiny' | null;

const SECRET_STORAGE_KEY = 'jpinas-portfolio-secret-completed';
const SECRET_BLOCK_X = LEVEL_WIDTH - 250;
const SECRET_REWARD_X = SECRET_BLOCK_X + 115;

const requiredSkills: Skill[] = ['du', 'snatch', 'burpee', 'boxjump'];

const skillMeta: Record<Skill, { key: string; label: string; action: PlayerAction }> = {
  du: { key: 'D', label: 'Double-unders', action: 'du' },
  snatch: { key: 'S', label: 'Snatch', action: 'snatch' },
  burpee: { key: 'B', label: 'Burpees', action: 'burpee' },
  boxjump: { key: 'J', label: 'Box jump', action: 'boxjump' },
};

const stopPointerMovement = (setHeldDirection: React.Dispatch<React.SetStateAction<-1 | 0 | 1>>) => () => setHeldDirection(0);

const Game: React.FC = () => {
  const isTouchDevice = useMemo(() => (
    typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
  ), []);
  const sectionStartX = isTouchDevice ? 24 : 72;
  const [playerPosition, setPlayerPosition] = useState({ x: PLAYER_START_X, y: 0 });
  const playerXRef = useRef(PLAYER_START_X);
  const playerYRef = useRef(0);
  const lastFootstepRef = useRef(0);
  const alternateFootstepRef = useRef(false);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [heldDirection, setHeldDirection] = useState<-1 | 0 | 1>(0);
  const [playerAction, setPlayerAction] = useState<PlayerAction>('idle');
  const [unlockedGates, setUnlockedGates] = useState<Record<number, boolean>>({});
  const [splash, setSplash] = useState<string | null>(null);
  const [gateShake, setGateShake] = useState(0);
  const [finishOpen, setFinishOpen] = useState(false);
  const [finishDismissed, setFinishDismissed] = useState(false);
  const [musicMuted, setMusicMuted] = useState(false);
  const secretWasCompleted = typeof window !== 'undefined' && window.localStorage.getItem(SECRET_STORAGE_KEY) === 'true';
  const [secretPhase, setSecretPhase] = useState<SecretPhase>(secretWasCompleted ? 'collected' : 'ready');
  const [secretStage, setSecretStage] = useState(secretWasCompleted ? 3 : 0);
  const [secretEffect, setSecretEffect] = useState<SecretEffect>(null);
  const secretDropTimerRef = useRef<number | null>(null);
  const secretEffectTimerRef = useRef<number | null>(null);
  const secretClimbTimerRef = useRef<number | null>(null);
  const lastGateTapRef = useRef<number | null>(null);

  const currentLevelData = gameLevels[currentLevelIndex];
  const levelWidth = LEVEL_WIDTH;
  const gateX = GATE_X;
  const requiredSkill = currentLevelIndex < gameLevels.length - 1 ? requiredSkills[currentLevelIndex] : null;
  const gateUnlocked = requiredSkill === null || unlockedGates[currentLevelIndex];
  const activeStation = useMemo(() => currentLevelData.stations.find((_, index) => {
    const stationX = getStationX(index, currentLevelData.stations.length);
    return Math.abs(playerPosition.x - stationX) < STATION_RANGE;
  }) ?? null, [currentLevelData.stations, playerPosition.x]);
  const isNearGate = Math.abs(playerPosition.x - gateX) <= SKILL_RANGE;
  const movementStep = secretEffect === 'tiny' ? 34 : secretEffect === 'giant' ? 8 : 18;
  const movementInterval = secretEffect === 'tiny' ? 24 : secretEffect === 'giant' ? 105 : 45;
  const footstepInterval = secretEffect === 'tiny' ? 105 : secretEffect === 'giant' ? 390 : 210;

  const showSplash = useCallback((text: string) => {
    setSplash(text);
    window.setTimeout(() => setSplash(null), 780);
  }, []);

  const bumpGate = useCallback(() => {
    setGateShake((value) => value + 1);
    showSplash(isTouchDevice ? 'Double tap the striped pole' : `${requiredSkill ? skillMeta[requiredSkill].key : ''} required`);
    playBeep('blocked');
  }, [isTouchDevice, requiredSkill, showSplash]);

  const collectSecretReward = useCallback(() => {
    if (secretPhase !== 'collectible') {
      return;
    }

    const effect: Exclude<SecretEffect, null> = Math.random() < 0.5 ? 'giant' : 'tiny';
    setSecretPhase('collected');
    window.localStorage.setItem(SECRET_STORAGE_KEY, 'true');
    setSecretEffect(effect);
    showSplash(effect === 'giant' ? 'Mystery PR: heavyweight mode' : 'Mystery PR: flyweight mode');
    playBeep('unlock');

    if (secretEffectTimerRef.current !== null) {
      window.clearTimeout(secretEffectTimerRef.current);
    }
    secretEffectTimerRef.current = window.setTimeout(() => {
      setSecretEffect(null);
      showSplash('Mystery PR expired');
    }, 5000);
  }, [secretPhase, showSplash]);

  const move = useCallback((direction: -1 | 1) => {
    if (!musicMuted) {
      startBackgroundMusic();
    }
    const previousX = playerXRef.current;
    const willHitGate = direction === 1 && !gateUnlocked && previousX >= gateX - movementStep;
    const minimumPlayerX = currentLevelIndex === 0 ? FIRST_LEVEL_MIN_PLAYER_X : 0;
    const nextX = Math.min(
      Math.max(previousX + direction * movementStep, minimumPlayerX),
      gateUnlocked ? levelWidth - 60 : gateX,
    );
    let nextY = playerYRef.current;
    if (nextY > 0 && Math.abs(nextX - SECRET_BLOCK_X) > 46) {
      nextY = 0;
      playerYRef.current = 0;
    }
    playerXRef.current = nextX;
    setPlayerPosition({ x: nextX, y: nextY });

    if (currentLevelIndex === gameLevels.length - 1 && secretPhase === 'collectible' && Math.abs(nextX - SECRET_REWARD_X) <= 42) {
      collectSecretReward();
    }

    const now = performance.now();
    if (nextX !== previousX && now - lastFootstepRef.current > footstepInterval) {
      playFootstep(alternateFootstepRef.current);
      alternateFootstepRef.current = !alternateFootstepRef.current;
      lastFootstepRef.current = now;
    }

    const isFinishZone = currentLevelIndex === gameLevels.length - 1 && nextX > levelWidth - 90;
    if (isFinishZone && !finishOpen && !finishDismissed) {
      setFinishOpen(true);
      showSplash('Portfolio completed');
      playVictorySound();
    }
    if (willHitGate) {
      bumpGate();
    }
  }, [bumpGate, collectSecretReward, currentLevelIndex, finishDismissed, finishOpen, footstepInterval, gateUnlocked, gateX, levelWidth, movementStep, musicMuted, secretPhase, showSplash]);

  const hitSecretBlock = useCallback(() => {
    if (currentLevelIndex !== gameLevels.length - 1 || !finishDismissed || Math.abs(playerXRef.current - SECRET_BLOCK_X) > 48) {
      return false;
    }

    if (secretStage < 3) {
      const nextStage = secretStage + 1;
      setSecretStage(nextStage);
      showSplash(nextStage === 1 ? 'Hidden 24 inch box found' : `Box ${nextStage}/3`);
      playBeep('unlock');
      if (secretClimbTimerRef.current !== null) {
        window.clearTimeout(secretClimbTimerRef.current);
      }
      secretClimbTimerRef.current = window.setTimeout(() => {
        if (Math.abs(playerXRef.current - SECRET_BLOCK_X) <= 48) {
          const nextY = nextStage * 52;
          playerYRef.current = nextY;
          setPlayerPosition((position) => ({ ...position, y: nextY }));
        }
      }, 210);
      return true;
    }

    if (playerYRef.current < 140) {
      playerYRef.current = 156;
      setPlayerPosition((position) => ({ ...position, y: 156 }));
      showSplash('Climb the 24 inch stack');
      return true;
    }

    if (secretPhase !== 'ready') {
      return false;
    }

    setSecretPhase('falling');
    showSplash('Mystery PR released');
    playBeep('unlock');
    secretDropTimerRef.current = window.setTimeout(() => setSecretPhase('collectible'), 620);
    return true;
  }, [currentLevelIndex, finishDismissed, secretPhase, secretStage, showSplash]);

  useEffect(() => () => {
    if (secretDropTimerRef.current !== null) {
      window.clearTimeout(secretDropTimerRef.current);
    }
    if (secretEffectTimerRef.current !== null) {
      window.clearTimeout(secretEffectTimerRef.current);
    }
    if (secretClimbTimerRef.current !== null) {
      window.clearTimeout(secretClimbTimerRef.current);
    }
  }, []);

  useEffect(() => {
    playerXRef.current = playerPosition.x;
  }, [playerPosition.x]);

  const triggerAction = useCallback((action: PlayerAction) => {
    const isGateOnlyAction = action === 'du' || action === 'snatch' || action === 'boxjump';
    const isCorrectGateSkill = requiredSkill ? skillMeta[requiredSkill].action === action : false;
    const isInSkillZone = Math.abs(playerPosition.x - gateX) <= SKILL_RANGE;

    if (isGateOnlyAction && (!isCorrectGateSkill || !isInSkillZone)) {
      bumpGate();
      showSplash(isCorrectGateSkill ? 'Get closer' : 'Wrong station');
      return;
    }

    if (action === 'jump') {
      hitSecretBlock();
    }

    setPlayerAction(action);
    if (!musicMuted) {
      startBackgroundMusic();
    }
    if (action === 'du') {
      playDoubleUnderSound();
    } else {
      playBeep(action === 'jump' ? 'move' : 'skill');
    }

    if (requiredSkill && skillMeta[requiredSkill].action === action && isInSkillZone) {
      setUnlockedGates((gates) => ({ ...gates, [currentLevelIndex]: true }));
      showSplash(`${skillMeta[requiredSkill].label} cleared`);
      playBeep('unlock');
    } else if (action !== 'jump') {
      const label = action === 'du' ? 'Double-under' : action === 'snatch' ? 'Snatch' : action === 'boxjump' ? 'Box jump' : 'Burpee';
      showSplash(label);
    }

    const jumpDuration = secretEffect === 'tiny' ? 560 : secretEffect === 'giant' ? 500 : 420;
    window.setTimeout(() => setPlayerAction('idle'), action === 'burpee' ? 1050 : action === 'du' ? 760 : action === 'snatch' ? 1050 : action === 'boxjump' ? 680 : jumpDuration);
  }, [bumpGate, currentLevelIndex, gateX, hitSecretBlock, musicMuted, playerPosition.x, requiredSkill, secretEffect, showSplash]);

  const toggleMusic = useCallback(() => {
    setMusicMuted((muted) => {
      if (!muted) {
        stopBackgroundMusic();
        return true;
      }

      startBackgroundMusic();
      return false;
    });
  }, []);

  const handleGateTap = useCallback((action: Skill) => {
    const now = performance.now();
    if (lastGateTapRef.current !== null && now - lastGateTapRef.current <= 360) {
      lastGateTapRef.current = null;
      triggerAction(action);
      return;
    }

    lastGateTapRef.current = now;
    showSplash('Tap the pole again');
  }, [showSplash, triggerAction]);

  useEffect(() => {
    if (heldDirection === 0) {
      return;
    }

    const interval = window.setInterval(() => move(heldDirection), movementInterval);
    return () => window.clearInterval(interval);
  }, [heldDirection, move, movementInterval]);

  useEventListener('keydown', (event) => {
    if (event.repeat && ['Space', 'KeyB', 'KeyD', 'KeyS', 'KeyJ'].includes(event.code)) {
      return;
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      setHeldDirection(-1);
      move(-1);
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      setHeldDirection(1);
      move(1);
    }
    if (event.key === 'Escape') {
      if (finishOpen) {
        setFinishDismissed(true);
      }
      setFinishOpen(false);
    }
    if (event.code === 'Space') {
      event.preventDefault();
      triggerAction('jump');
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      triggerAction('jump');
    }
    if (event.key === 'b' || event.key === 'B') {
      event.preventDefault();
      triggerAction('burpee');
    }
    if (event.key === 'd' || event.key === 'D') {
      event.preventDefault();
      triggerAction('du');
    }
    if (event.key === 's' || event.key === 'S') {
      event.preventDefault();
      triggerAction('snatch');
    }
    if (event.key === 'j' || event.key === 'J') {
      event.preventDefault();
      triggerAction('boxjump');
    }
  });

  useEventListener('keyup', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      setHeldDirection(0);
    }
  });

  const goToNextLevel = useCallback(() => {
    setCurrentLevelIndex((index) => Math.min(index + 1, gameLevels.length - 1));
    playerXRef.current = sectionStartX;
    playerYRef.current = 0;
    setPlayerPosition({ x: sectionStartX, y: 0 });
    setFinishDismissed(false);
    showSplash('Next lane');
  }, [sectionStartX, showSplash]);

  const goToPreviousLevel = useCallback(() => {
    const nextIndex = Math.max(currentLevelIndex - 1, 0);
    setCurrentLevelIndex(nextIndex);
    playerXRef.current = LEVEL_WIDTH - 140;
    playerYRef.current = 0;
    setPlayerPosition({ x: LEVEL_WIDTH - 140, y: 0 });
    setFinishDismissed(false);
    showSplash('Previous lane');
  }, [currentLevelIndex, showSplash]);

  const viewportWidth = typeof window === 'undefined' ? 1280 : window.innerWidth;
  const cameraX = Math.min(
    Math.max(WORLD_START_X, playerPosition.x - viewportWidth / 2),
    Math.max(0, levelWidth - viewportWidth),
  );
  const localProgress = Math.max(0, Math.round((playerPosition.x / Math.max(levelWidth - 60, 1)) * 100));
  const levelProgress = Math.min(100, Math.round(((currentLevelIndex + localProgress / 100) / gameLevels.length) * 100));
  const showGeneralBrief = !activeStation && playerPosition.x <= 160;
  const showBriefPanel = Boolean(activeStation) || showGeneralBrief;

  return (
    <main className="game-shell">
      <ParallaxBackground
        cameraX={cameraX}
      />

      <header className="hud">
        <div>
          <p className="hud-name">
            <img src="/assets/cuba-pixelflag.png" alt="Cuba" />
            {personal.name}
          </p>
          <h1>{currentLevelData.company}</h1>
        </div>
        <div className="hud-meta">
          <span>{currentLevelData.role}</span>
          <strong>{currentLevelIndex + 1}/{gameLevels.length}</strong>
        </div>
      </header>

      <div className="progress-panel" aria-label="Portfolio progress">
        <div>
          <span>Career progress</span>
          <strong>{levelProgress}%</strong>
        </div>
        <div className="progress-track">
          <span style={{ width: `${levelProgress}%` }} />
        </div>
        <div>
          <span>Current lane</span>
          <strong>{localProgress}%</strong>
        </div>
        <ol className="level-map">
          {gameLevels.map((level, index) => (
            <li key={level.id} className={index === currentLevelIndex ? 'is-current' : index < currentLevelIndex ? 'is-done' : ''}>
              <span>{index + 1}</span>
              {level.company}
            </li>
          ))}
        </ol>
      </div>

      {requiredSkill && isNearGate && (
        <div className={`mobile-gate-prompt ${gateUnlocked ? 'is-cleared' : ''}`} role="status" aria-live="polite">
          <span>{gateUnlocked ? 'Cleared' : 'Required move'}</span>
          <strong>{skillMeta[requiredSkill].label}</strong>
          <em>{gateUnlocked ? 'Portal open' : 'Double tap the striped pole'}</em>
        </div>
      )}

      {showBriefPanel && <aside className={`brief-panel ${activeStation ? 'has-station' : 'is-general'}`} aria-live="polite">
        <strong className="brief-level">{currentLevelData.company}</strong>
        <div className="brief-grid">
          <section className="brief-summary">
            <p className="brief-label">{currentLevelData.period} / {currentLevelData.role}</p>
            <h2>{activeStation ? activeStation.name : currentLevelData.wod}</h2>
            <p>{activeStation ? activeStation.description : currentLevelIndex === 0 ? profile : currentLevelData.theme}</p>
            {activeStation?.stats && (
              <div className="brief-stats">
                {activeStation.stats.map((stat) => <strong key={stat}>{stat}</strong>)}
              </div>
            )}
          </section>

          {activeStation && (
            <section className="brief-evidence" aria-label="Experience highlights">
              <span className="brief-section-label">What I delivered</span>
              <ul className="brief-details">
                {activeStation.details.map((detail) => <li key={detail}>{detail}</li>)}
              </ul>
            </section>
          )}
        </div>
        {requiredSkill && (
          <p className={`next-action ${gateUnlocked ? 'is-cleared' : ''}`}>
            {gateUnlocked
              ? 'Gate cleared. Walk through the glowing portal.'
              : isNearGate
                ? isTouchDevice
                  ? `At the gate: double tap the striped pole for ${skillMeta[requiredSkill].label}.`
                  : `At the gate: press ${skillMeta[requiredSkill].key} for ${skillMeta[requiredSkill].label}.`
                : isTouchDevice
                  ? 'Next: walk right to the gate, then double tap the striped pole.'
                  : `Next: walk right to the gate and press ${skillMeta[requiredSkill].key}.`}
          </p>
        )}
      </aside>}

      <details className="help-dock">
        <summary aria-label="Open controls and movement guide" title="Controls and movement guide">?</summary>
        <div className="help-dock-panel">
          <strong>Controls</strong>
          <div className="controls" aria-label="Keyboard controls">
            <span><kbd>←</kbd><kbd>→</kbd> move</span>
            <span><kbd>↑</kbd><kbd>SPACE</kbd> jump</span>
            <span><kbd>B</kbd> burpee</span>
            <span><kbd>D</kbd> double-unders</span>
            <span><kbd>S</kbd> snatch</span>
            <span><kbd>J</kbd> box jump</span>
          </div>
          <div className="movement-guide">
            <strong>CrossFit guide</strong>
            <dl>
              <div><dt>WOD</dt><dd>Workout of the Day. Each WOD is one career chapter.</dd></div>
              <div><dt>Gate</dt><dd>Complete its required movement beside the door to continue.</dd></div>
              <div><dt>Burpee</dt><dd>Squat, plank, squat, then jump with both hands overhead.</dd></div>
              <div><dt>Double-under</dt><dd>The rope passes under the feet twice during one jump.</dd></div>
              <div><dt>Snatch</dt><dd>Lift the bar from the floor to overhead in one movement.</dd></div>
              <div><dt>Box jump</dt><dd>Jump and land with both feet on top of the box.</dd></div>
            </dl>
          </div>
        </div>
      </details>

      {splash && <div className="rep-splash">{splash}</div>}

      <button
        type="button"
        onClick={toggleMusic}
        className="mute-button"
        aria-label={musicMuted ? 'Turn music on' : 'Mute music'}
        title={musicMuted ? 'Turn music on' : 'Mute music'}
        aria-pressed={musicMuted}
      >
        <span className={musicMuted ? 'music-glyph is-muted' : 'music-glyph'} aria-hidden="true">♪</span>
      </button>

      <div className="world" style={{ transform: `translateX(${-cameraX}px)` }}>
        <Level
          levelData={currentLevelData}
          playerPosition={playerPosition}
          goToNextLevel={goToNextLevel}
          goToPreviousLevel={goToPreviousLevel}
          isFirstLevel={currentLevelIndex === 0}
          isLastLevel={currentLevelIndex === gameLevels.length - 1}
          gateX={gateX}
          requiredSkill={requiredSkill}
          gateUnlocked={gateUnlocked}
          requiredSkillLabel={requiredSkill ? skillMeta[requiredSkill].label : null}
          requiredSkillKey={requiredSkill ? skillMeta[requiredSkill].key : null}
          gateShake={gateShake}
          activeAction={playerAction}
          onGateTap={handleGateTap}
          showSecret={currentLevelIndex === gameLevels.length - 1 && (finishDismissed || secretStage > 0 || secretPhase === 'collected')}
          secretPhase={secretPhase}
          secretStage={secretStage}
          secretBlockX={SECRET_BLOCK_X}
          secretRewardX={SECRET_REWARD_X}
        />
      </div>
      <div className="player-world" style={{ transform: `translateX(${-cameraX}px)` }}>
        <Player position={playerPosition} action={playerAction} sizeEffect={secretEffect} />
      </div>

      <nav className="touch-controls" aria-label="Touch game controls">
        <button
          type="button"
          aria-label="Move left"
          onPointerDown={() => { setHeldDirection(-1); move(-1); }}
          onPointerUp={stopPointerMovement(setHeldDirection)}
          onPointerCancel={stopPointerMovement(setHeldDirection)}
          onPointerLeave={stopPointerMovement(setHeldDirection)}
        >←</button>
        <button type="button" aria-label="Jump" onClick={() => triggerAction('jump')}>↑</button>
        <button
          type="button"
          aria-label="Move right"
          onPointerDown={() => { setHeldDirection(1); move(1); }}
          onPointerUp={stopPointerMovement(setHeldDirection)}
          onPointerCancel={stopPointerMovement(setHeldDirection)}
          onPointerLeave={stopPointerMovement(setHeldDirection)}
        >→</button>
      </nav>

      {finishOpen && (
        <div className="finish-overlay" role="dialog" aria-modal="true" aria-labelledby="finish-title">
          <div className="finish-panel">
            <p>Workout complete</p>
            <h2 id="finish-title">Backend WOD cleared</h2>
            <div>
              <a href={`mailto:${personal.email}`}>Email</a>
              <a href={`tel:${personal.phone.replaceAll(' ', '')}`}>Call</a>
              <a href={`https://${personal.linkedin}`} target="_blank" rel="noreferrer">LinkedIn</a>
              <a href={`https://${personal.github}`} target="_blank" rel="noreferrer">GitHub</a>
            </div>
            <button onClick={() => { setFinishDismissed(true); setFinishOpen(false); }}>Keep exploring</button>
          </div>
        </div>
      )}
    </main>
  );
};

export default Game;
