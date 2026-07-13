type BeepKind = 'move' | 'skill' | 'unlock' | 'inspect' | 'blocked';

type AudioWindow = Window & typeof globalThis & {
  webkitAudioContext?: typeof AudioContext;
};

let audioContext: AudioContext | null = null;
let musicTimer: number | null = null;
let musicStep = 0;

function getAudioContext() {
  if (typeof window === 'undefined') {
    return null;
  }

  if (!audioContext) {
    const AudioCtor = window.AudioContext || (window as AudioWindow).webkitAudioContext;
    if (!AudioCtor) {
      return null;
    }
    audioContext = new AudioCtor();
  }

  if (audioContext.state === 'suspended') {
    void audioContext.resume();
  }

  return audioContext;
}

function tone(frequency: number, start: number, duration: number, volume = 0.035, type: OscillatorType = 'square') {
  const ctx = getAudioContext();
  if (!ctx) {
    return;
  }

  const oscillator = new OscillatorNode(ctx, { frequency, type });
  const gain = new GainNode(ctx);
  const now = ctx.currentTime + start;

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(volume, now + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start(now);
  oscillator.stop(now + duration + 0.02);
}

function ropeWhip(start: number) {
  const ctx = getAudioContext();
  if (!ctx) {
    return;
  }

  const duration = 0.045;
  const sampleCount = Math.ceil(ctx.sampleRate * duration);
  const buffer = ctx.createBuffer(1, sampleCount, ctx.sampleRate);
  const samples = buffer.getChannelData(0);

  for (let index = 0; index < sampleCount; index += 1) {
    const decay = 1 - index / sampleCount;
    samples[index] = (Math.random() * 2 - 1) * decay;
  }

  const source = new AudioBufferSourceNode(ctx, { buffer });
  const filter = new BiquadFilterNode(ctx, { type: 'highpass', frequency: 2200, Q: 0.8 });
  const gain = new GainNode(ctx, { gain: 0.0001 });
  const now = ctx.currentTime + start;

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.055, now + 0.004);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  source.start(now);
  source.stop(now + duration);
}

export function playDoubleUnderSound() {
  [0, 0.09, 0.24, 0.33, 0.48, 0.57].forEach(ropeWhip);
  [0.18, 0.42, 0.66].forEach((start) => tone(115, start, 0.035, 0.018, 'triangle'));
}

export function playFootstep(alternate: boolean) {
  tone(alternate ? 118 : 94, 0, 0.05, 0.032, 'triangle');
  tone(alternate ? 58 : 66, 0.008, 0.035, 0.018, 'sine');
}

export function playVictorySound() {
  [523, 659, 784, 1047].forEach((frequency, index) => {
    tone(frequency, index * 0.12, index === 3 ? 0.32 : 0.1, 0.035, 'square');
  });
  tone(262, 0, 0.5, 0.018, 'triangle');
}

export function playBeep(kind: BeepKind) {
  if (kind === 'move') {
    tone(190, 0, 0.04, 0.018, 'triangle');
  }

  if (kind === 'skill') {
    tone(420, 0, 0.05);
    tone(620, 0.055, 0.06);
  }

  if (kind === 'unlock') {
    tone(523, 0, 0.06);
    tone(659, 0.07, 0.06);
    tone(784, 0.14, 0.1);
  }

  if (kind === 'inspect') {
    tone(880, 0, 0.05, 0.025, 'sine');
  }

  if (kind === 'blocked') {
    tone(140, 0, 0.08, 0.035, 'sawtooth');
    tone(95, 0.09, 0.11, 0.028, 'sawtooth');
  }
}

export function startBackgroundMusic() {
  const ctx = getAudioContext();
  if (!ctx || musicTimer !== null) {
    return;
  }

  const bass = [98, 98, 131, 147, 98, 196, 147, 131];
  const lead = [392, 0, 523, 0, 440, 0, 392, 330];

  musicTimer = window.setInterval(() => {
    const index = musicStep % bass.length;
    tone(bass[index], 0, 0.075, 0.012, 'triangle');
    if (lead[index] > 0) {
      tone(lead[index], 0.015, 0.055, 0.009, 'square');
    }
    musicStep += 1;
  }, 260);
}

export function stopBackgroundMusic() {
  if (musicTimer !== null) {
    window.clearInterval(musicTimer);
    musicTimer = null;
  }
}
