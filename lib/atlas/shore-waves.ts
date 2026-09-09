import { cycleProgress } from './motion';
import type { MapSize, MapView } from './map-view';
import type { MotionIntensity } from './day-cycle';

export type ShoreWaveField={width:number;height:number;step:number;cells:[x:number,y:number,topLeft:number,topRight:number,bottomRight:number,bottomLeft:number][]};
export const SHORE_WAVE_PERIOD=8.4;

export function shoreWaveAt(seconds:number,offset:number){
  const p=cycleProgress(seconds,SHORE_WAVE_PERIOD,offset);
  return {distance:50*(1-p)+2,opacity:Math.sin(Math.PI*p)**1.15*(.7+.3*p)};
}

export function shoreWaveMetrics(scale:number,intensity:MotionIntensity,night:number){
  const strength=(intensity==='subtle'?.88:1)*(1-night*.2);
  return {crestAlpha:.78*strength,foamAlpha:.25*strength,grainSize:Math.min(2.2,Math.max(1.1,.8/scale))};
}

type FoamSample={x:number;y:number;distance:number;phase:number;patch:number;grain:number;angle:number};
const sampleCache=new WeakMap<ShoreWaveField,{water:(x:number,y:number)=>number;samples:FoamSample[]}>();
const clamp=(n:number)=>Math.max(0,Math.min(1,n));
const smooth=(n:number)=>{const t=clamp(n);return t*t*(3-2*t);};
const noise=(x:number,y:number)=>{const n=Math.sin(x*127.1+y*311.7)*43758.5453;return n-Math.floor(n);};

function foamSamples(field:ShoreWaveField,water:(x:number,y:number)=>number){
  const cached=sampleCache.get(field);if(cached?.water===water)return cached.samples;
  const samples:FoamSample[]=[],s=field.step;
  for(const [x,y,a,b,c,d]of field.cells){
    const angle=Math.atan2((d+c-a-b)/2,(b+c-a-d)/2)+Math.PI/2;
    // Jittered, fixed world samples produce granular paint-like foam without
    // a visible grid or a new noise pattern flashing on every frame.
    for(let row=0;row<2;row++)for(let col=0;col<2;col++){
      const grain=noise(x+col,y+row),u=(col+.25+grain*.5)/2,v=(row+.25+noise(y+row,x+col)*.5)/2;
      const px=x+u*s,py=y+v*s,distance=a*(1-u)*(1-v)+b*u*(1-v)+c*u*v+d*(1-u)*v;
      if(distance>54||distance<2||water(px,py)<.9)continue;
      const patch=smooth((Math.sin(px*.028+py*.019+Math.sin(py*.013)*1.5)+.35)/1.2);
      if(patch<.015)continue;
      let clear=true;
      for(let oy=-3;oy<=3&&clear;oy++)for(let ox=-3;ox<=3;ox++)if(water(px+ox,py+oy)<.9){clear=false;break;}
      if(!clear)continue;
      samples.push({x:px,y:py,distance,phase:Math.sin(px*.008+py*.005)*1.2,patch,grain,angle});
    }
  }
  sampleCache.set(field,{water,samples});return samples;
}

export function drawShoreWaves(ctx:CanvasRenderingContext2D,shore:ShoreWaveField,time:number,view:MapView,size:MapSize,intensity:MotionIntensity,night:number,water:(x:number,y:number)=>number){
  const metrics=shoreWaveMetrics(view.scale,intensity,night),samples=foamSamples(shore,water);
  const left=(-view.x-8)/view.scale,right=(size.width-view.x+8)/view.scale,top=(-view.y-8)/view.scale,bottom=(size.height-view.y+8)/view.scale;
  let drawn=0;
  ctx.save();ctx.fillStyle=night>.5?'#c1d8df':'#edf0dc';
  for(const p of samples){
    if(p.x<left||p.x>right||p.y<top||p.y>bottom)continue;
    let foam=0;
    for(let wave=0;wave<3;wave++){
      const w=shoreWaveAt(time,p.phase+wave*SHORE_WAVE_PERIOD/3),delta=p.distance-w.distance;
      // The leading break is small and bright; the offshore wash lingers
      // behind it. Smooth spatial envelopes make each break a short patch.
      const crest=Math.exp(-delta*delta/5),wash=delta>0?Math.exp(-delta*delta/38):0;
      foam+=w.opacity*(crest*metrics.crestAlpha+wash*metrics.foamAlpha);
    }
    const alpha=foam*p.patch*(.35+p.grain*.65);
    if(alpha<.025)continue;
    ctx.globalAlpha=alpha;
    ctx.beginPath();ctx.ellipse(p.x,p.y,metrics.grainSize*(.8+p.grain*.55),metrics.grainSize*.65,p.angle,0,Math.PI*2);ctx.fill();drawn++;
  }
  ctx.restore();return drawn;
}
