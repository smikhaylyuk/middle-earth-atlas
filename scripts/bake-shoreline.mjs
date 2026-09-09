import sharp from 'sharp';

// Trace the connected sea coverage, never a hand-invented coastline. Small
// texture holes are smoothed before contouring; the live water mask still
// rejects every crest segment that touches painted land.
export async function bakeShoreline(seaMask){
  const {data,info:{width,height}}=await sharp(seaMask).removeAlpha().greyscale().blur(1.2).threshold(120).raw().toBuffer({resolveWithObject:true});
  const inside=(x,y)=>x>=0&&y>=0&&x<width&&y<height&&data[y*width+x]>127;
  const edges=new Map(),key=(x,y)=>y*(width+1)+x;
  const edge=(x,y,ex,ey)=>edges.set(key(x,y),key(ex,ey));
  for(let y=0;y<height;y++)for(let x=0;x<width;x++)if(inside(x,y)){
    if(!inside(x,y-1))edge(x,y,x+1,y);
    if(!inside(x+1,y))edge(x+1,y,x+1,y+1);
    if(!inside(x,y+1))edge(x+1,y+1,x,y+1);
    if(!inside(x-1,y))edge(x,y+1,x,y);
  }
  const tracks=[];
  while(edges.size){
    let at=edges.keys().next().value;const loop=[];
    while(edges.has(at)){
      loop.push([at%(width+1),Math.floor(at/(width+1))]);
      const next=edges.get(at);edges.delete(at);at=next;
    }
    if(loop.length<32)continue;
    const smooth=loop.map((_,i)=>{
      let x=0,y=0;for(let j=-4;j<=4;j++){const p=loop[(i+j+loop.length)%loop.length];x+=p[0];y+=p[1];}
      return [x/9,y/9];
    });
    let points=[];
    const flush=()=>{if(points.length>=6)tracks.push(points);points=[];};
    for(let i=0;i<smooth.length;i+=2){
      const [x,y]=smooth[i],a=smooth[(i+smooth.length-3)%smooth.length],b=smooth[(i+3)%smooth.length];
      const dx=b[0]-a[0],dy=b[1]-a[1],length=Math.hypot(dx,dy)||1,nx=-dy/length,ny=dx/length;
      // The clockwise boundary keeps water to the right. Reject the feathered
      // outer paper edge and narrow inland channels without offshore space.
      if(x<44||y<40||y>height-25||![3,7,12].every(d=>inside(Math.floor(x+nx*d),Math.floor(y+ny*d)))){flush();continue;}
      points.push([+(x*4).toFixed(2),+(y*4).toFixed(2),+nx.toFixed(4),+ny.toFixed(4)]);
    }
    flush();
  }
  return {width:3700,height:2800,tracks};
}
