import type { MotionIntensity } from './day-cycle';

export const cycleProgress = (seconds:number,duration:number,offset=0) => ((seconds+offset)%duration+duration)%duration/duration;

// Atmospheric marks need a readable screen size even in the whole-atlas view.
// Their world positions remain fixed; zoom never creates new rendering surfaces.
export function motionMetrics(scale:number,intensity:MotionIntensity){
  const strength=intensity==='subtle'?.72:1;
  return {
    strength,
    birdWidth:Math.max(20,Math.min(180,(intensity==='subtle'?13:16)/scale)),
    currentWidth:Math.max(1.5,Math.min(5,.8/scale)),
    currentLength:Math.max(12,Math.min(35,5/scale)),
    currentSpeed:intensity==='subtle'?20:29,
    smokeScale:Math.max(1,Math.min(2.5,.75/scale)),
  };
}
