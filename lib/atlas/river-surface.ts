import type {MapSize,MapView} from './map-view';
import type {MotionIntensity} from './day-cycle';

export type RiverTrack={points:{x:number;y:number;alpha:number}[];length:number};
export type RiverPixel={x:number;y:number;vx:number;vy:number;along:number;across:number;depth:number;alpha:number;travel:number};
export type RiverField={pixels:RiverPixel[];step:number};
const STEP=2,TILE=128,PAD=16,TAU=Math.PI*2;
const clamp=(x:number)=>Math.max(0,Math.min(1,x));
const smooth=(x:number)=>{const t=clamp(x);return t*t*(3-2*t);};

// Register a surface across each existing painted channel, rather than
// putting moving marks on its centreline. A fixed world grid has no zoom LOD.
export function buildRiverField(tracks:RiverTrack[],water:(x:number,y:number)=>number):RiverField{
  const field=new Map<string,{pixel:RiverPixel;priority:number}>();
  for(const track of tracks)for(let i=1;i<track.points.length-1;i++){
    const p=track.points[i];if(p.alpha<.08||water(p.x,p.y)<.9)continue;
    const a=track.points[Math.max(0,i-2)],b=track.points[Math.min(track.points.length-1,i+2)];
    const distance=Math.hypot(b.x-a.x,b.y-a.y);if(distance<.01)continue;
    const vx=(b.x-a.x)/distance,vy=(b.y-a.y)/distance,nx=-vy,ny=vx;
    const bank=(direction:number)=>{let d=0;for(;d<128;d+=2)if(water(p.x+nx*d*direction,p.y+ny*d*direction)<.9)break;return Math.max(0,d-2);};
    const left=bank(-1),right=bank(1),width=left+right;if(width<6)continue;
    const extent=Math.max(left,right),rx=Math.abs(nx)*extent+Math.abs(vx)*4.5,ry=Math.abs(ny)*extent+Math.abs(vy)*4.5;
    for(let y=Math.floor((p.y-ry)/STEP)*STEP+1;y<p.y+ry;y+=STEP)for(let x=Math.floor((p.x-rx)/STEP)*STEP+1;x<p.x+rx;x+=STEP){
      const dx=x-p.x,dy=y-p.y,along=dx*vx+dy*vy,across=dx*nx+dy*ny;
      if(Math.abs(along)>4.5||across<-left||across>right)continue;
      const edge=Math.min(left+across,right-across),alpha=p.alpha*smooth(edge/6);if(alpha<.025)continue;
      // Include the entire bilinear footprint, so neither the animated
      // colour nor the final upsampling can spill onto a bank or island.
      let clear=true;for(let ox=-3;ox<=3;ox++)for(let oy=-3;oy<=3;oy++)if(water(x+ox,y+oy)<.9)clear=false;
      if(!clear)continue;
      const key=`${x},${y}`,depth=clamp(edge/Math.max(4,width*.45)),priority=alpha-Math.abs(along)*.002;
      if((field.get(key)?.priority??-1)>=priority)continue;
      field.set(key,{priority,pixel:{x,y,vx,vy,along:i/(track.points.length-1)*track.length+along+track.points[0].x*.27+track.points[0].y*.19,across,depth,alpha,travel:Math.min(10,3+width*.075)*(.25+.75*depth)}});
    }
  }
  const pixels=[...field.values()].map(p=>p.pixel);
  for(const p of pixels){
    // Establish a safe upstream sampling corridor once. This avoids a
    // per-frame snap back to the original pixel as a ripple nears a bank.
    let safe=0;
    for(let d=.5;d<=p.travel;d+=.5){
      let clear=true;for(let ox=-2;ox<=2;ox++)for(let oy=-2;oy<=2;oy++)if(water(p.x-p.vx*d+ox,p.y-p.vy*d+oy)<.9)clear=false;
      if(!clear)break;safe=d;
    }
    p.travel=safe;
  }
  return {pixels,step:STEP};
}

// Two overlapping, smoothly weighted advections carry the original brushwork
// downstream. Each reset is invisible because its weight and slope are zero.
export function riverPhase(time:number,offset:number,intensity:MotionIntensity){
  const phase=((time*(intensity==='lively'?1.28:1)/8.8+offset)%1+1)%1;
  return {first:phase,second:(phase+.5)%1,weight:(1-Math.cos(phase*TAU))*.5};
}
export function riverReflection(p:RiverPixel,time:number){
  const wave=Math.sin(p.along*.24-time*1.42+Math.sin(p.across*.17+p.along*.037)*1.7);
  const fine=Math.sin(p.along*.51-time*2.37+p.across*.12);
  // Broad soft glints, broken up by a second wave train. There are no points,
  // strokes or repeating dashes; the reflection covers the wetted surface.
  return (Math.max(0,wave*.7+fine*.3)**3*13-2.1)*(.4+.6*p.depth);
}

type PixelSource={data:Uint8ClampedArray;width:number;height:number};
type TilePixel=RiverPixel & {index:number;sourceX:number;sourceY:number};
type RiverTile={x:number;y:number;canvas:HTMLCanvasElement;context:CanvasRenderingContext2D;frame:ImageData;source:PixelSource;pixels:TilePixel[];lastTime:number;lastIntensity:MotionIntensity|null};
export type RiverSurface={tiles:RiverTile[];pixelCount:number};

export function createRiverSurface(image:HTMLImageElement,field:RiverField):RiverSurface{
  const groups=new Map<string,{x:number;y:number;pixels:RiverPixel[]}>();
  for(const p of field.pixels){const x=Math.floor(p.x/(TILE*STEP))*TILE*STEP,y=Math.floor(p.y/(TILE*STEP))*TILE*STEP,key=`${x},${y}`;let group=groups.get(key);if(!group){group={x,y,pixels:[]};groups.set(key,group);}group.pixels.push(p);}
  const scratch=document.createElement('canvas');scratch.width=scratch.height=TILE*STEP+PAD*2;
  const read=scratch.getContext('2d',{willReadFrequently:true});if(!read)throw new Error('Canvas unavailable');
  const tiles=[...groups.values()].map(group=>{
    read.clearRect(0,0,scratch.width,scratch.height);read.drawImage(image,-group.x+PAD,-group.y+PAD);
    const source=read.getImageData(0,0,scratch.width,scratch.height);
    const canvas=document.createElement('canvas');canvas.width=canvas.height=TILE;
    const context=canvas.getContext('2d');if(!context)throw new Error('Canvas unavailable');
    const frame=context.createImageData(TILE,TILE);
    const pixels=group.pixels.map(p=>({...p,index:((p.y-group.y-1)/STEP*TILE+(p.x-group.x-1)/STEP)*4,sourceX:p.x-group.x+PAD,sourceY:p.y-group.y+PAD}));
    for(const p of pixels)frame.data[p.index+3]=Math.round(p.alpha*218);
    return {...group,canvas,context,frame,source,pixels,lastTime:NaN,lastIntensity:null};
  });
  scratch.width=scratch.height=1;
  return {tiles,pixelCount:field.pixels.length};
}

const bilinear=(source:PixelSource,x:number,y:number,c:number)=>{
  const ix=Math.floor(x),iy=Math.floor(y),u=x-ix,v=y-iy,i=(iy*source.width+ix)*4+c,row=source.width*4;
  return source.data[i]*(1-u)*(1-v)+source.data[i+4]*u*(1-v)+source.data[i+row]*(1-u)*v+source.data[i+row+4]*u*v;
};
export function shadeRiverPixel(p:RiverPixel,source:PixelSource,sx:number,sy:number,time:number,intensity:MotionIntensity,target:Uint8ClampedArray,index:number){
  const t=time*(intensity==='lively'?1.28:1),phase=riverPhase(time,p.x*.0017+p.y*.0023,intensity);
  const drift=Math.sin(t*.55+p.along*.055)*.65*p.depth;
  const sample=(progress:number)=>{
    const dx=-p.vx*progress*p.travel-p.vy*drift,dy=-p.vy*progress*p.travel+p.vx*drift;
    return [sx+dx,sy+dy];
  };
  const [ax,ay]=sample(phase.first),[bx,by]=sample(phase.second),glint=riverReflection(p,t);
  for(let c=0;c<3;c++)target[index+c]=bilinear(source,ax,ay,c)*phase.weight+bilinear(source,bx,by,c)*(1-phase.weight)+glint*(c===0?.86:1);
}

export function drawRiverSurface(ctx:CanvasRenderingContext2D,surface:RiverSurface,time:number,view:MapView,size:MapSize,intensity:MotionIntensity){
  let pixels=0;ctx.save();ctx.translate(view.x,view.y);ctx.scale(view.scale,view.scale);ctx.globalCompositeOperation='source-atop';ctx.globalAlpha=1;
  for(const tile of surface.tiles){
    if(tile.x*view.scale+view.x>size.width||(tile.x+TILE*STEP)*view.scale+view.x<0||tile.y*view.scale+view.y>size.height||(tile.y+TILE*STEP)*view.scale+view.y<0)continue;
    if(tile.lastTime!==time||tile.lastIntensity!==intensity){
      for(const p of tile.pixels)shadeRiverPixel(p,tile.source,p.sourceX,p.sourceY,time,intensity,tile.frame.data,p.index);
      tile.context.putImageData(tile.frame,0,0);tile.lastTime=time;tile.lastIntensity=intensity;
    }
    ctx.drawImage(tile.canvas,tile.x,tile.y,TILE*STEP,TILE*STEP);pixels+=tile.pixels.length;
  }
  ctx.restore();return pixels;
}
