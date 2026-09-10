import sharp from 'sharp';
import {pathToFileURL} from 'node:url';
import layout from '../lib/atlas/lamedon-layout.json' with {type:'json'};

const smooth=n=>{const t=Math.max(0,Math.min(1,n));return t*t*(3-2*t);};
export const lamedonEdgeAlpha=(x,y)=>smooth(x/85)*smooth(y/75)*smooth((layout.width-x)/85)*smooth((layout.height-y)/65);
export function lamedonRiverDistance(x,y){
  let distance=Infinity;
  for(const points of Object.values(layout.rivers))for(let i=1;i<points.length;i++){
    const [ax,ay]=points[i-1],[bx,by]=points[i],dx=bx-ax,dy=by-ay;
    const t=Math.max(0,Math.min(1,((x-ax)*dx+(y-ay)*dy)/(dx*dx+dy*dy)));
    distance=Math.min(distance,Math.hypot(x-ax-dx*t,y-ay-dy*t));
  }
  return distance;
}
export async function extendLamedon(){
  const {x,y,width,height,worldWidth,worldHeight}=layout;
  const base=await sharp('public/images/atlas-morgul.webp').ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const main=await sharp('public/images/lamedon-painted.webp').resize(width,height,{fit:'fill'}).ensureAlpha().raw().toBuffer();
  const insets=[];
  for(const inset of [
    {file:'lamedon-ciril-ford',x:640,y:1631,width:417,height:398},
    {file:'lamedon-watershed',x:290,y:140,width:650,height:550},
  ]){
    const pixels=await sharp(`public/images/repairs/${inset.file}.webp`).resize(inset.width,inset.height,{fit:'fill'}).ensureAlpha().raw().toBuffer();
    for(let py=0;py<inset.height;py++)for(let px=0;px<inset.width;px++)pixels[(py*inset.width+px)*4+3]=Math.round(255*smooth(px/30)*smooth(py/30)*smooth((inset.width-px)/30)*smooth((inset.height-py)/30));
    insets.push({input:await sharp(pixels,{raw:{width:inset.width,height:inset.height,channels:4}}).png().toBuffer(),left:inset.x,top:inset.y});
  }
  const tile=await sharp(main,{raw:{width,height,channels:4}}).composite(insets).raw().toBuffer();
  const old=await sharp('public/images/atlas-masks/morgul-water.png').greyscale().raw().toBuffer({resolveWithObject:true});
  const mask=new Uint8Array(width*height*4);
  for(let py=0;py<height;py++)for(let px=0;px<width;px++){
    const i=(py*width+px)*4,bi=((y+py)*worldWidth+x+px)*4;
    const edge=lamedonEdgeAlpha(px,py);
    tile[i+3]=Math.round(255*edge);
    mask[i]=mask[i+1]=mask[i+2]=255;mask[i+3]=Math.round(edge*(255-base.data[bi+3]));
  }
  const patch=await sharp(tile,{raw:{width,height,channels:4}}).png().toBuffer();
  // Paint UNDER the established atlas: opaque landmarks cannot move, while
  // its feathered mountain edges become solid terrain instead of pale seams.
  const combined=await sharp({create:{width:worldWidth,height:worldHeight,channels:4,background:'#00000000'}})
    .composite([{input:patch,left:x,top:y},{input:await sharp(base.data,{raw:base.info}).png().toBuffer(),left:0,top:0}]).png().toBuffer();
  await sharp(combined).webp({quality:96,alphaQuality:100,effort:6}).toFile('public/images/atlas-lamedon.webp');
  await sharp(mask,{raw:{width,height,channels:4}}).png().toFile('public/images/atlas-masks/lamedon.png');

  const gridWidth=worldWidth/2,gridHeight=worldHeight/2,coverage=Uint8Array.from(old.data);
  const paint=await sharp(combined).resize(gridWidth,gridHeight).ensureAlpha().raw().toBuffer();
  for(let gy=Math.floor(y/2);gy<gridHeight;gy++)for(let gx=Math.floor(x/2);gx<Math.ceil((x+width)/2);gx++){
    const i=gy*gridWidth+gx,wx=gx*2,wy=gy*2;
    if(coverage[i]||lamedonRiverDistance(wx,wy)>42)continue;
    const p=i*4,r=paint[p],g=paint[p+1],b=paint[p+2];
    // Restrict flow to inspected blue/slate channels. Pale road surfaces,
    // stone bridge decks, meadow shadows and former water remain untouched.
    if(paint[p+3]>230&&g>=r+3&&b>=r-4&&b>=g-14)coverage[i]=255;
  }
  await sharp(coverage,{raw:{width:gridWidth,height:gridHeight,channels:1}}).png().toFile('public/images/atlas-masks/lamedon-water.png');
  console.log(`Added the southern White Mountain valleys within the existing ${worldWidth} × ${worldHeight} atlas.`);
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)await extendLamedon();
