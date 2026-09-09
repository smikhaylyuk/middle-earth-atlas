import { cycleProgress } from './motion';
import type { MapSize, MapView } from './map-view';
import type { MotionIntensity } from './day-cycle';

export type ShorePoint=[x:number,y:number,seaX:number,seaY:number];
export type Shoreline={width:number;height:number;tracks:ShorePoint[][]};

// Each wave approaches the bank, brightens into foam, then dissolves before
// the next cycle. The clock is shared with every other atmospheric effect.
export function shoreWaveAt(seconds:number,offset:number){
  const p=cycleProgress(seconds,12,offset);
  return {distance:48*(1-p)+2,opacity:Math.sin(Math.PI*p)**1.3*(.35+.65*p)};
}

export function drawShoreWaves(ctx:CanvasRenderingContext2D,shore:Shoreline,time:number,view:MapView,size:MapSize,intensity:MotionIntensity,night:number,water:(x:number,y:number)=>number){
  const strength=intensity==='subtle'?.72:1;
  let drawn=0;
  ctx.save();ctx.lineCap='round';ctx.lineJoin='round';
  ctx.strokeStyle=night>.5?'#c0d7e0':'#f0eee0';
  const visible=(x:number,y:number)=>x*view.scale+view.x>-65&&x*view.scale+view.x<size.width+65&&y*view.scale+view.y>-65&&y*view.scale+view.y<size.height+65;
  shore.tracks.forEach((track,index)=>{
    for(let wave=0;wave<3;wave++){
      const {distance,opacity}=shoreWaveAt(time,wave*4+index*.73);
      if(opacity<.015)continue;
      ctx.globalAlpha=opacity*.26*strength*(1-night*.25);
      ctx.lineWidth=Math.max(1.1,Math.min(3.8,.65/view.scale))*(1+(.2*(1-distance/50)));
      ctx.beginPath();let previous:{x:number;y:number}|null=null;
      for(let i=0;i<track.length;i++){
        const [sx,sy,nx,ny]=track[i],ripple=Math.sin(i*.28+index)*1.1;
        const x=sx+nx*(distance+ripple),y=sy+ny*(distance+ripple);
        // Short, irregular breaks keep the surf from becoming a solid outline.
        if(!visible(x,y)||water(x,y)<.9||Math.sin(i*.19+index*2+wave)>.91){previous=null;continue;}
        if(previous&&Math.hypot(x-previous.x,y-previous.y)<22&&water((x+previous.x)/2,(y+previous.y)/2)>.9){
          ctx.moveTo(previous.x,previous.y);ctx.lineTo(x,y);drawn++;
        }
        previous={x,y};
      }
      ctx.stroke();
    }
  });
  ctx.restore();return drawn;
}
