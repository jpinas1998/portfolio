import type { PixelAsset } from '../data/gameData';

interface PixelObjectProps {
  asset: PixelAsset;
  label: string;
  active?: boolean;
}

export function PixelPlayer({
  walking,
  direction,
  burpee,
  jumping,
  action,
}: {
  walking: boolean;
  direction: 'left' | 'right';
  burpee: boolean;
  jumping: boolean;
  action: 'idle' | 'jump' | 'burpee' | 'du' | 'snatch' | 'boxjump';
}) {
  return (
    <div
      className={`pixel-player ${walking ? 'is-walking' : ''} ${burpee ? 'is-burpee' : ''} ${jumping ? 'is-jumping' : ''} ${action === 'du' ? 'is-du' : ''} ${action === 'snatch' ? 'is-snatch' : ''} ${action === 'boxjump' ? 'is-boxjump' : ''}`}
      style={{ transform: direction === 'left' ? 'scaleX(-1)' : 'scaleX(1)' }}
      aria-hidden="true"
    >
      <span className="runner-head" />
      <span className="runner-torso" />
      <span className="runner-pack" />
      <span className="runner-arm runner-arm-a" />
      <span className="runner-arm runner-arm-b" />
      <span className="runner-leg runner-leg-a" />
      <span className="runner-leg runner-leg-b" />
      <span className="runner-shoe runner-shoe-a" />
      <span className="runner-shoe runner-shoe-b" />
      {action === 'snatch' && <span className="runner-snatch-bar" />}
    </div>
  );
}

export function PixelObject({ asset, label, active = false }: PixelObjectProps) {
  return (
    <div className={`pixel-object pixel-object-${asset} ${active ? 'is-active' : ''}`} aria-hidden="true">
      <div className="pixel-object-core">
        {asset === 'barbell' && <Barbell />}
        {asset === 'kettlebell' && <Kettlebell />}
        {asset === 'rack' && <Rack />}
        {asset === 'docker' && <Docker />}
        {asset === 'map' && <MapPin />}
        {asset === 'pdf' && <PdfDoc />}
        {asset === 'terminal' && <Terminal />}
        {asset === 'medal' && <Medal />}
        {asset === 'professor' && <Professor />}
      </div>
      <span className="object-label">{label}</span>
    </div>
  );
}

export function PixelPortal({ direction }: { direction: 'previous' | 'next' }) {
  return (
    <div className={`pixel-portal pixel-portal-${direction}`} aria-hidden="true">
      <span>{direction === 'next' ? '>>' : '<<'}</span>
    </div>
  );
}

function Barbell() {
  return (
    <div className="asset-barbell">
      <span className="barbell-bar" />
      <span className="plate plate-l1" />
      <span className="plate plate-l2" />
      <span className="plate plate-r1" />
      <span className="plate plate-r2" />
    </div>
  );
}

function Kettlebell() {
  return (
    <div className="asset-kettlebell">
      <span className="kb-handle" />
      <span className="kb-body" />
    </div>
  );
}

function Rack() {
  return (
    <div className="asset-rack">
      <span />
      <span />
      <span />
      <span />
    </div>
  );
}

function Docker() {
  return (
    <div className="asset-docker">
      <span className="box b1" />
      <span className="box b2" />
      <span className="box b3" />
      <span className="ship" />
    </div>
  );
}

function MapPin() {
  return (
    <div className="asset-map">
      <span className="grid" />
      <span className="pin" />
    </div>
  );
}

function PdfDoc() {
  return (
    <div className="asset-pdf">
      <span className="doc-fold" />
      <span className="doc-line a" />
      <span className="doc-line b" />
      <span className="doc-line c" />
    </div>
  );
}

function Terminal() {
  return (
    <div className="asset-terminal">
      <span className="term-top" />
      <span className="term-prompt" />
      <span className="term-line a" />
      <span className="term-line b" />
    </div>
  );
}

function Medal() {
  return (
    <div className="asset-medal">
      <span className="ribbon a" />
      <span className="ribbon b" />
      <span className="coin" />
    </div>
  );
}

function Professor() {
  return (
    <div className="asset-professor">
      <span className="board" />
      <span className="chalk a" />
      <span className="chalk b" />
      <span className="person" />
    </div>
  );
}
