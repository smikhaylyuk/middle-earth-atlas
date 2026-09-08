export type DayPhase = 'morning' | 'day' | 'evening' | 'night';
export type MotionIntensity = 'subtle' | 'lively';
export const phaseHours: Record<DayPhase, number> = { morning: 7, day: 13, evening: 18.5, night: 23 };
export const wrapHour = (hour: number) => ((hour % 24) + 24) % 24;
export const advanceHour = (hour: number, seconds: number, duration: number) => wrapHour(hour + seconds * 24 / duration);
export function dayPhase(hour: number): DayPhase {
  const h = wrapHour(hour);
  return h < 5.5 || h >= 20 ? 'night' : h < 10 ? 'morning' : h < 17 ? 'day' : 'evening';
}
export function clockLabel(hour: number) {
  const total = Math.floor(wrapHour(hour) * 60);
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}
const stops = [
  {h:0, brightness:.56, saturation:.48, night:1, warmth:0, mist:.5, birds:0},
  {h:4.5, brightness:.56, saturation:.48, night:1, warmth:0, mist:.6, birds:0},
  {h:6, brightness:.84, saturation:.69, night:.2, warmth:.42, mist:1, birds:.35},
  {h:8, brightness:1.08, saturation:.78, night:0, warmth:.1, mist:.8, birds:1},
  {h:12, brightness:1.1, saturation:.86, night:0, warmth:0, mist:.24, birds:1},
  {h:16, brightness:1.01, saturation:.83, night:0, warmth:.12, mist:.28, birds:.9},
  {h:18.5, brightness:.84, saturation:.81, night:.15, warmth:.7, mist:.42, birds:.65},
  {h:20.5, brightness:.62, saturation:.57, night:.85, warmth:.12, mist:.55, birds:0},
  {h:24, brightness:.56, saturation:.48, night:1, warmth:0, mist:.5, birds:0},
];
export function atmosphereAt(hour: number) {
  const h = wrapHour(hour);
  const i = stops.findIndex((stop, index) => index > 0 && h <= stop.h);
  const a = stops[i - 1], b = stops[i];
  const t = (h - a.h) / (b.h - a.h), blend = t * t * (3 - 2 * t);
  const mix = (key: Exclude<keyof typeof a, 'h'>) => a[key] + (b[key] - a[key]) * blend;
  return {brightness:mix('brightness'), saturation:mix('saturation'), night:mix('night'), warmth:mix('warmth'), mist:mix('mist'), birds:mix('birds'), sunX: 50 + 50 * Math.cos((h - 6) / 12 * Math.PI)};
}
