import sharp from 'sharp';
import {pathToFileURL} from 'node:url';
import layout from '../lib/atlas/pelennor-layout.json' with {type:'json'};

const smooth=n=>{const t=Math.max(0,Math.min(1,n));return t*t*(3-2*t);};
export const pelennorAlpha=(x,y)=>smooth(x/110)*smooth(y/110)*smooth((layout.width-x)/110)*smooth((layout.height-y)/110);
function distanceToRiver(x,y){
  let distance=Infinity;
  for(let i=1;i<layout.anduin.length;i++){
    const [ax,ay]=layout.anduin[i-1],[bx,by]=layout.anduin[i],dx=bx-ax,dy=by-ay;
    const t=Math.max(0,Math.min(1,((x-ax)*dx+(y-ay)*dy)/(dx*dx+dy*dy)));
    distance=Math.min(distance,Math.hypot(x-ax-dx*t,y-ay-dy*t));
  }
  return distance;
}
export async function extendPelennor(){
  const {x,y,width,height,worldWidth,worldHeight}=layout;
  const base=await sharp('public/images/atlas-gondor.webp').ensureAlpha().raw().toBuffer({resolveWithObject:true});
  let registered=await sharp('public/images/pelennor-painted.webp').resize(width,height,{fit:'fill'}).png().toBuffer();
  const defences=await sharp('public/images/repairs/pelennor-defences.webp').ensureAlpha().raw().toBuffer();
  for(let py=0;py<750;py++)for(let px=0;px<760;px++)defences[(py*760+px)*4+3]=Math.round(255*smooth(Math.min(px,py,760-px,750-py)/28));
  registered=await sharp(registered).composite([{input:await sharp(defences,{raw:{width:760,height:750,channels:4}}).png().toBuffer(),left:340,top:350}]).png().toBuffer();
  const tile=await sharp(registered).ensureAlpha().raw().toBuffer();
  const mask=new Uint8Array(width*height*4);
  for(let py=0;py<height;py++)for(let px=0;px<width;px++){
    const i=(py*width+px)*4,alpha=pelennorAlpha(px,py),bx=x+px,by=y+py;
    const previous=bx<base.info.width&&by<base.info.height?base.data[(by*base.info.width+bx)*4+3]/255:0;
    tile[i+3]=Math.round(tile[i+3]*alpha);
    mask[i]=mask[i+1]=mask[i+2]=255;mask[i+3]=Math.round(255*alpha*(1-previous));
  }
  const patch=await sharp(tile,{raw:{width,height,channels:4}}).png().toBuffer();
  const original=await sharp(base.data,{raw:base.info}).png().toBuffer();
  const combined=await sharp({create:{width:worldWidth,height:worldHeight,channels:4,background:'#00000000'}})
    .composite([{input:patch,left:x,top:y},{input:original,left:0,top:0}]).png().toBuffer();
  await sharp(combined).webp({quality:96,alphaQuality:100,effort:6}).toFile('public/images/atlas-pelennor.webp');
  await sharp(mask,{raw:{width,height,channels:4}}).png().toFile('public/images/atlas-masks/pelennor.png');

  // Two world units per sample, identical to every earlier river grid.
  // Only new terrain may contribute water; preserve old channels and banks.
  const old=await sharp('public/images/atlas-masks/gondor-water.png').greyscale().raw().toBuffer({resolveWithObject:true});
  const gridWidth=worldWidth/2,gridHeight=worldHeight/2,coverage=new Uint8Array(gridWidth*gridHeight);
  const paint=await sharp(combined).resize(gridWidth,gridHeight).ensureAlpha().raw().toBuffer();
  for(let gy=0;gy<gridHeight;gy++)for(let gx=0;gx<gridWidth;gx++){
    const i=gy*gridWidth+gx,wx=gx*2,wy=gy*2,prior=gx<old.info.width&&gy<old.info.height?old.data[gy*old.info.width+gx]:0;
    coverage[i]=prior;
    const previous=wx<base.info.width&&wy<base.info.height?base.data[(wy*base.info.width+wx)*4+3]:0;
    if(prior||previous===255||wx<x||wy<y||wx>=x+width||wy>=y+height||distanceToRiver(wx,wy)>110)continue;
    const p=i*4,r=paint[p],g=paint[p+1],b=paint[p+2];
    if(paint[p+3]>100&&g>=r+2&&b>=r-12&&b>=g-20)coverage[i]=255;
  }
  await sharp(coverage,{raw:{width:gridWidth,height:gridHeight,channels:1}}).png().toFile('public/images/atlas-masks/pelennor-water.png');
  console.log(`Extended the Anduin through the Pelennor (${worldWidth} × ${worldHeight}).`);
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)await extendPelennor();
