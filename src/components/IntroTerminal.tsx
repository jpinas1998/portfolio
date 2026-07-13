import React, { useEffect, useState } from 'react';
import { personal, profile } from '../data/gameData';

interface IntroTerminalProps {
  onStartGame: () => void;
}

type TerminalLine =
  | { type: 'command'; text: string }
  | { type: 'output'; text: string; strong?: boolean }
  | { type: 'links' };

const terminalGroups: Array<{ id: string; start: number; lines: TerminalLine[] }> = [
  {
    id: 'identity',
    start: 0,
    lines: [
      { type: 'command', text: '$ whoami' },
      { type: 'output', text: personal.name, strong: true },
      { type: 'output', text: personal.title },
    ],
  },
  {
    id: 'mission',
    start: 3,
    lines: [
      { type: 'command', text: '$ cat mission.txt' },
      { type: 'output', text: profile },
    ],
  },
  {
    id: 'launch',
    start: 5,
    lines: [
      { type: 'command', text: '$ start wod --mode portfolio' },
      { type: 'output', text: 'Loadout ready: Team lead, Python, Django REST Framework, PostgreSQL, MongoDB, ClickHouse, AWS, GCP, Docker and CI/CD.' },
      { type: 'links' },
    ],
  },
];

const scriptLength = terminalGroups.reduce((total, group) => total + group.lines.length, 0);

const IntroTerminal: React.FC<IntroTerminalProps> = ({ onStartGame }) => {
  const [visibleCount, setVisibleCount] = useState(0);
  const [startPressed, setStartPressed] = useState(false);

  useEffect(() => {
    if (visibleCount >= scriptLength) {
      return;
    }

    const timer = window.setTimeout(() => {
      setVisibleCount((count) => count + 1);
    }, visibleCount === 0 ? 90 : 135);

    return () => window.clearTimeout(timer);
  }, [visibleCount]);

  const isComplete = visibleCount >= scriptLength;

  useEffect(() => {
    const pressEnter = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        setStartPressed(true);
      }
    };

    const releaseEnter = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        setStartPressed(false);
        onStartGame();
      }
    };

    window.addEventListener('keydown', pressEnter);
    window.addEventListener('keyup', releaseEnter);
    return () => {
      window.removeEventListener('keydown', pressEnter);
      window.removeEventListener('keyup', releaseEnter);
    };
  }, [onStartGame]);

  return (
    <main className="intro-screen">
      <section className="terminal-window" aria-label="Portfolio boot terminal">
        <div className="terminal-bar">
          <div className="terminal-window-controls" aria-hidden="true">
            <span title="Minimize">−</span>
            <span title="Close">×</span>
            <span title="Maximize">□</span>
          </div>
          <strong>joaquin@crossfit-dev</strong>
        </div>
        <div className="terminal-body">
          <div className="terminal-groups">
            {terminalGroups.map((group) => (
              <section className={`terminal-group terminal-group-${group.id}`} key={group.id}>
                {group.lines.slice(0, Math.max(0, visibleCount - group.start)).map((line, index) => {
                  if (line.type === 'links') {
                    return (
                      <div className="terminal-links" key="links">
                        <a href={`mailto:${personal.email}`}>Email</a>
                        <a href={`tel:${personal.phone.replaceAll(' ', '')}`}>Call</a>
                        <a href={`sms:${personal.phone.replaceAll(' ', '')}`}>SMS</a>
                        <a href={`https://${personal.linkedin}`} target="_blank" rel="noreferrer">LinkedIn</a>
                        <a href={`https://${personal.github}`} target="_blank" rel="noreferrer">GitHub</a>
                      </div>
                    );
                  }

                  return (
                    <p className={`terminal-line ${line.type === 'command' ? 'terminal-command' : ''} ${line.type === 'output' && line.strong ? 'terminal-strong' : ''}`} key={`${line.text}-${index}`}>
                      {line.type === 'command' && <span>joaquin:~/resume </span>}
                      {line.text}
                    </p>
                  );
                })}
                {group.id === 'launch' && isComplete && (
                  <button
                    onClick={onStartGame}
                    onPointerDown={() => setStartPressed(true)}
                    onPointerUp={() => setStartPressed(false)}
                    onPointerCancel={() => setStartPressed(false)}
                    onPointerLeave={() => setStartPressed(false)}
                    className={`start-button ${startPressed ? 'is-pressed' : ''}`}
                  >
                    Start WOD
                    <kbd className="desktop-start-hint">Enter</kbd>
                    <kbd className="touch-start-hint">Tap</kbd>
                  </button>
                )}
              </section>
            ))}
          </div>
          {!isComplete && <span className="terminal-cursor" />}
        </div>
      </section>
    </main>
  );
};

export default IntroTerminal;
