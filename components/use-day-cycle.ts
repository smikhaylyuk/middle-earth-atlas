'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { advanceHour, atmosphereAt, dayPhase, wrapHour } from '@/lib/atlas/day-cycle';

export function useDayCycle(enabled: boolean, visible: boolean) {
  const root = useRef<HTMLElement>(null);
  const hour = useRef(8), playing = useRef(true), seconds = useRef(120);
  const [displayHour, setDisplayHour] = useState(8);
  const [cycleEnabled, setCycleEnabled] = useState(true);
  const [cycleDuration, setCycleDuration] = useState(120);
  const apply = useCallback((value: number) => {
    hour.current = wrapHour(value);
    const element = root.current;
    if (!element) return;
    const a = atmosphereAt(hour.current);
    Object.entries(a).forEach(([key, amount]) => element.style.setProperty(`--day-${key}`, amount.toFixed(4)));
    element.dataset.phase = dayPhase(hour.current);
  }, []);
  const setTime = useCallback((value: number) => {apply(value);setDisplayHour(hour.current);}, [apply]);
  const setCycle = useCallback((value: boolean) => {playing.current=value;setCycleEnabled(value);}, []);
  const setDuration = useCallback((value: number) => {seconds.current=value;setCycleDuration(value);}, []);
  useEffect(() => {
    apply(hour.current);
    if (!enabled || !visible || !cycleEnabled) return;
    let last = performance.now(), lastPaint = last, lastDisplay = last, frame = 0;
    function tick(now: number) {
      const elapsed = Math.min((now - last) / 1000, .25);last = now;
      if (playing.current) {
        hour.current = advanceHour(hour.current, elapsed, seconds.current);
        if (now - lastPaint >= 50) {apply(hour.current);lastPaint=now;}
        if (now - lastDisplay >= 200) {setDisplayHour(hour.current);lastDisplay=now;}
      }
      frame=requestAnimationFrame(tick);
    }
    frame=requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [apply, enabled, visible, cycleEnabled]);
  return {root, hour, displayHour, cycleEnabled, cycleDuration, setTime, setCycle, setDuration};
}
