export type WaveType = "saw" | "square" | "pulse" | "tri" | "sine" | "fold";
export type FilterMode = "lp" | "hp" | "bp" | "notch";
export type FilterRoute = "serial" | "parallel" | "split";
export type EnvCurve = "exp" | "lin" | "log";
export type LfoWave = "sine" | "tri" | "saw" | "square" | "snh" | "noise";
export type ArpMode = "up" | "down" | "updown" | "random" | "order";
export type ArpDiv = "1/4" | "1/8" | "1/8t" | "1/16" | "1/16t" | "1/32";

export interface OscPatch {
  wave: WaveType;
  oct: number;
  freq: number;
  fine: number;
  shape: number;
  pwm: number;
  level: number;
  uni: 1 | 3 | 5 | 7;
  det: number;
  kbd: boolean;
}

export interface FilterPatch {
  mode: FilterMode;
  cut: number;
  res: number;
  env: number;
  kbd: number;
  vel: number;
  drive: number;
}

export interface EnvPatch {
  a: number;
  d: number;
  s: number;
  r: number;
  curve: EnvCurve;
  vel: number;
  amt: number;
}

export interface LfoPatch {
  rate: number;
  wave: LfoWave;
  slew: number;
  delay: number;
  fade: number;
  retrig: boolean;
  key: boolean;
  dest: ModDest;
  depth: number;
}

export type ModDest =
  | "none"
  | "cutoffA"
  | "cutoffB"
  | "pitchA"
  | "pitchB"
  | "pwmA"
  | "pwmB"
  | "levelA"
  | "levelB"
  | "resA"
  | "amp"
  | "pan"
  | "delay"
  | "fm";

export type ModSrc =
  | "lfo1"
  | "lfo2"
  | "lfo3"
  | "envF"
  | "envA"
  | "vel"
  | "mod"
  | "key"
  | "seq"
  | "random";

export interface ModSlot {
  src: ModSrc;
  dest: ModDest;
  amt: number;
  bipolar: boolean;
}

export interface MixerCh {
  level: number;
  pan: number;
  mute: boolean;
  solo: boolean;
}

export interface ArpPatch {
  on: boolean;
  mode: ArpMode;
  div: ArpDiv;
  oct: 1 | 2 | 3 | 4;
  gate: number;
  swing: number;
  hold: boolean;
}

export interface SeqStep {
  pitch: number;
  gate: boolean;
  vel: number;
  prob: number;
  slide: boolean;
}

export interface SeqPattern {
  steps: SeqStep[];
  length: number;
}

export interface FxPatch {
  drive: number;
  chorus: number;
  chorusRate: number;
  delayTime: number;
  delayFb: number;
  delayMix: number;
  delayPing: boolean;
  delaySync: boolean;
  reverb: number;
  width: number;
  master: number;
}

export interface Patch {
  id: string;
  name: string;
  color: "amber" | "teal" | "magenta";
  oscA: OscPatch;
  oscB: OscPatch;
  sync: boolean;
  ring: number;
  sub: number;
  noise: number;
  noiseColor: number;
  fm: number;
  cross: number;
  filterRoute: FilterRoute;
  filtA: FilterPatch;
  filtB: FilterPatch;
  ampEnv: EnvPatch;
  filtEnv: EnvPatch;
  lfo: [LfoPatch, LfoPatch, LfoPatch];
  matrix: ModSlot[];
  mixer: {
    oscA: MixerCh;
    oscB: MixerCh;
    sub: MixerCh;
    noise: MixerCh;
    ring: MixerCh;
    seq: MixerCh;
    tape: MixerCh;
    smpl: MixerCh;
  };
  fx: FxPatch;
  arp: ArpPatch;
  glide: number;
  velSense: number;
}

export const MIX_KEYS = [
  "oscA",
  "oscB",
  "sub",
  "noise",
  "ring",
  "seq",
  "tape",
  "smpl",
] as const;

export type MixKey = (typeof MIX_KEYS)[number];

export const WAVE_LABELS: Record<WaveType, string> = {
  saw: "SAW",
  square: "SQR",
  pulse: "PUL",
  tri: "TRI",
  sine: "SIN",
  fold: "FLD",
};

export const LFO_LABELS: Record<LfoWave, string> = {
  sine: "SIN",
  tri: "TRI",
  saw: "SAW",
  square: "SQR",
  snh: "S&H",
  noise: "NSE",
};

export const DEST_LABELS: Record<ModDest, string> = {
  none: "OFF",
  cutoffA: "CUT A",
  cutoffB: "CUT B",
  pitchA: "PIT A",
  pitchB: "PIT B",
  pwmA: "PWM A",
  pwmB: "PWM B",
  levelA: "LVL A",
  levelB: "LVL B",
  resA: "RES A",
  amp: "AMP",
  pan: "PAN",
  delay: "DLY",
  fm: "FM",
};

export const SRC_LABELS: Record<ModSrc, string> = {
  lfo1: "LFO 1",
  lfo2: "LFO 2",
  lfo3: "LFO 3",
  envF: "ENV F",
  envA: "ENV A",
  vel: "VEL",
  mod: "MOD",
  key: "KEY",
  seq: "SEQ",
  random: "RND",
};

export function midiToHz(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

export function noteName(midi: number): string {
  const names = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const n = ((Math.round(midi) % 12) + 12) % 12;
  const oct = Math.floor(Math.round(midi) / 12) - 1;
  return `${names[n]}${oct}`;
}

export function clamp(v: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, v));
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function dbToGain(db: number): number {
  return Math.pow(10, db / 20);
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function deepClone<T>(v: T): T {
  return structuredClone(v);
}
