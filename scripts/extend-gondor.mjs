import sharp from 'sharp';
import {pathToFileURL} from 'node:url';
import layout from '../lib/atlas/gondor-layout.json' with {type:'json'};

const smooth=n=>{const t=Math.max(0,Math.min(1,n));return t*t*(3-2*t);};
export function gondorAlpha(x,y){
  return smooth(x/110)*smooth(y/110)*smooth((layout.width-x)/110)*smooth((layout.height-y)/110);
}
function distanceToRiver(x,y){
  let distance=Infinity;
  for(const points of layout.anduin)for(let i=1;i<points.length;i++){
    const [ax,ay]=points[i-1],[bx,by]=points[i],dx=bx-ax,dy=by-ay;
    const t=Math.max(0,Math.min(1,((x-ax)*dx+(y-ay)*dy)/(dx*dx+dy*dy)));
    distance=Math.min(distance,Math.hypot(x-ax-dx*t,y-ay-dy*t));
  }
  return distance;
}

export async function extendGondor(){
  const {x,y,width,height,worldWidth,worldHeight}=layout;
  const base=await sharp('public/images/atlas-mordor.webp').ensureAlpha().raw().toBuffer({resolveWithObject:true});
  let registered=await sharp('public/images/gondor-painted.webp').resize(width,height,{fit:'fill'}).png().toBuffer();
  // Keep the secret refuge on the visible western foothills of Ephel Dúath.
  // Only its woodland inset is used; the generated river is discarded.
  const refuge=await sharp('public/images/repairs/henneth-annun-refuge.webp').ensureAlpha().raw().toBuffer();
  for(let py=0;py<130;py++)for(let px=0;px<110;px++)refuge[(py*110+px)*4+3]=Math.round(255*smooth(Math.min(px,py,110-px,130-py)/16));
  registered=await sharp(registered).composite([{input:await sharp(refuge,{raw:{width:110,height:130,channels:4}}).png().toBuffer(),left:4305-x,top:3452-y}]).png().toBuffer();
  const tile=await sharp(registered).ensureAlpha().raw().toBuffer();
  const mask=new Uint8Array(width*height*4);
  for(let py=0;py<height;py++)for(let px=0;px<width;px++){
    const i=(py*width+px)*4,alpha=gondorAlpha(px,py),bx=x+px,by=y+py;
    tile[i+3]=Math.round(tile[i+3]*alpha);
    const oldAlpha=bx<base.info.width&&by<base.info.height?base.data[(by*base.info.width+bx)*4+3]/255:0;
    mask[i]=mask[i+1]=mask[i+2]=255;mask[i+3]=Math.round(255*alpha*(1-oldAlpha));
  }
  const patch=await sharp(tile,{raw:{width,height,channels:4}}).png().toBuffer();
  const original=await sharp(base.data,{raw:base.info}).png().toBuffer();
  let combined=await sharp({create:{width:worldWidth,height:worldHeight,channels:4,background:'#00000000'}})
    .composite([{input:patch,left:x,top:y},{input:original,left:0,top:0}]).png().toBuffer();
  // Resolve the doubled bank in the old paper fade. The earlier fully
  // opaque terrain remains untouched; only the joining band is repaired.
  const join=await sharp('public/images/repairs/gondor-anduin-join.webp').ensureAlpha().raw().toBuffer();
  for(let py=0;py<350;py++)for(let px=0;px<420;px++){
    const bx=3785+px,by=3110+py,oldAlpha=base.data[(by*base.info.width+bx)*4+3]/255;
    const edge=smooth(Math.min(px,py,420-px,350-py)/35);
    join[(py*420+px)*4+3]=Math.round(255*edge*Math.min(1,4*(1-oldAlpha)));
  }
  combined=await sharp(combined).composite([{input:await sharp(join,{raw:{width:420,height:350,channels:4}}).png().toBuffer(),left:3785,top:3110}]).png().toBuffer();
  await sharp(combined).webp({quality:96,alphaQuality:100,effort:6}).toFile('public/images/atlas-gondor.webp');
  await sharp(mask,{raw:{width,height,channels:4}}).png().toFile('public/images/atlas-masks/gondor.png');

  // Fixed two-world-unit sampling: copy all earlier water coverage exactly
  // where terrain was completed, adding the new channel only on new ground.
  const old=await sharp('public/images/atlas-masks/mordor-water.png').greyscale().raw().toBuffer({resolveWithObject:true});
  const gridWidth=worldWidth/2,gridHeight=worldHeight/2,coverage=new Uint8Array(gridWidth*gridHeight);
  const {data:paint}=await sharp(combined).resize(gridWidth,gridHeight).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  for(let gy=0;gy<gridHeight;gy++)for(let gx=0;gx<gridWidth;gx++){
    const i=gy*gridWidth+gx,wx=gx*2,wy=gy*2,prior=gx<old.info.width&&gy<old.info.height?old.data[gy*old.info.width+gx]:0;
    coverage[i]=prior;
    const oldAlpha=wx<base.info.width&&wy<base.info.height?base.data[(wy*base.info.width+wx)*4+3]:0;
    if(prior||oldAlpha===255||wx<x||wy<y||wx>=x+width||wy>=y+height||distanceToRiver(wx,wy)>110)continue;
    const p=i*4,r=paint[p],g=paint[p+1],b=paint[p+2];
    if(paint[p+3]>100&&g>=r+2&&b>=r-12&&b>=g-20)coverage[i]=255;
  }
  await sharp(coverage,{raw:{width:gridWidth,height:gridHeight,channels:1}}).png().toFile('public/images/atlas-masks/gondor-water.png');
  console.log(`Joined northern Gondor and extended the Anduin (${worldWidth} × ${worldHeight}).`);
}

if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)await extendGondor();
