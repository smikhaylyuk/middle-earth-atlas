import sharp from 'sharp';

// Trace the connected sea coverage, never a hand-invented coastline. Small
// texture holes are smoothed before contouring; the live water mask still
// rejects every crest segment that touches painted land.
export async function bakeShoreline(waterMask,{width:worldWidth=3700,height:worldHeight=2800}={}){
  // The open-sea highlight mask deliberately rejects pale shallows, so its
  // edge sits offshore. Surf needs the full water coverage up to the bank.
  const {data:coverage,info:{width,height}}=await sharp(waterMask).resize(Math.round(worldWidth/4),Math.round(worldHeight/4)).removeAlpha().greyscale().blur(1.2).threshold(120).raw().toBuffer({resolveWithObject:true});
  const data=new Uint8Array(width*height),queue=new Int32Array(width*height);let head=0,tail=0;
  for(let y=40;y<height-25;y++){const i=y*width+45;if(coverage[i]>127){data[i]=255;queue[tail++]=i;}}
  while(head<tail){const i=queue[head++],x=i%width,y=Math.floor(i/width);for(const n of [x>0?i-1:-1,x<width-1?i+1:-1,y>0?i-width:-1,y<height-1?i+width:-1])if(n>=0&&!data[n]&&coverage[n]>127){data[n]=255;queue[tail++]=n;}}
  // Fill enclosed paint-texture holes. Only mainland boundaries connected to
  // the outside of the atlas seed surf; rocks keep their painted wave detail.
  const outside=new Uint8Array(width*height);head=0;tail=0;
  const seed=i=>{if(!data[i]&&!outside[i]){outside[i]=1;queue[tail++]=i;}};
  for(let x=0;x<width;x++){seed(x);seed((height-1)*width+x);}
  for(let y=0;y<height;y++){seed(y*width);seed(y*width+width-1);}
  while(head<tail){const i=queue[head++],x=i%width,y=Math.floor(i/width);for(const n of [x>0?i-1:-1,x<width-1?i+1:-1,y>0?i-width:-1,y<height-1?i+width:-1])if(n>=0)seed(n);}
  for(let i=0;i<data.length;i++)if(!outside[i])data[i]=255;
  const inside=(x,y)=>x>=0&&y>=0&&x<width&&y<height&&data[y*width+x]>127;
  const points=[];
  for(let y=40;y<=height-25;y++)for(let x=44;x<width-4;x++){
    if(!inside(x,y)||[[-1,0],[1,0],[0,-1],[0,1]].every(([dx,dy])=>inside(x+dx,y+dy)))continue;
    const nx=Number(inside(x+3,y))-Number(inside(x-3,y)),ny=Number(inside(x,y+3))-Number(inside(x,y-3)),length=Math.hypot(nx,ny);
    if(!length)continue;
    const dx=nx/length,dy=ny/length;
    if(![3,7,12].every(d=>inside(Math.round(x+dx*d),Math.round(y+dy*d))))continue;
    points.push([x*worldWidth/width,y*worldHeight/height,+dx.toFixed(4),+dy.toFixed(4)]);
  }
  return {width:worldWidth,height:worldHeight,tracks:[points]};
}

// Distance contours cannot fold or cross at concave bays, unlike displaced
// coastline normals. Bake only a narrow band; the renderer interpolates the
// contour within its cells as waves approach shore.
export function bakeShoreWaveField(shore){
  const step=4,width=Math.ceil(shore.width/step)+1,height=Math.ceil(shore.height/step)+1;
  const distances=new Float32Array(width*height).fill(80);
  for(const [sx,sy]of shore.tracks.flat()){
    const left=Math.max(0,Math.floor((sx-76)/step)),right=Math.min(width-1,Math.ceil((sx+76)/step));
    const top=Math.max(0,Math.floor((sy-76)/step)),bottom=Math.min(height-1,Math.ceil((sy+76)/step));
    for(let y=top;y<=bottom;y++)for(let x=left;x<=right;x++){
      const index=y*width+x,distance=Math.hypot(x*step-sx,y*step-sy);
      if(distance<distances[index])distances[index]=distance;
    }
  }
  const cells=[];
  for(let y=0;y<height-1;y++)for(let x=0;x<width-1;x++){
    const at=y*width+x,values=[distances[at],distances[at+1],distances[at+width+1],distances[at+width]];
    if(Math.min(...values)>68)continue;
    cells.push([x*step,y*step,...values.map(d=>+d.toFixed(2))]);
  }
  return {width:shore.width,height:shore.height,step,cells};
}
