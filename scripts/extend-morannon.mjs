import sharp from 'sharp';
import {pathToFileURL} from 'node:url';
import layout from '../lib/atlas/morannon-layout.json' with {type:'json'};

const clamp=n=>Math.max(0,Math.min(1,n));
const smooth=n=>{const t=clamp(n);return t*t*(3-2*t);};
export function morannonAlpha(x,y){
  // The southwest edge retreats from Nindalf and the Anduin's unfinished
  // southern outlet. New land must never close that existing river exit.
  const left=380*smooth((y-850)/180);
  return smooth((x-left)/100)*smooth(y/110)*smooth((layout.width-x)/110)*smooth((layout.height-y)/110);
}

export async function extendMorannon(){
  const {x,y,width,height,worldWidth,worldHeight}=layout;
  const base=await sharp('public/images/atlas-harmonized.webp').ensureAlpha().raw().toBuffer({resolveWithObject:true});
  let registered=await sharp('public/images/morannon-painted.webp').resize(width,height,{fit:'fill'}).png().toBuffer();
  // A separate habitat insert removes woody vegetation from the Dead
  // Marshes. It changes incidental reeds/pools, never the mountain pass,
  // the approach roads, or any part of the previously approved atlas.
  const habitat={left:330,top:210,width:850,height:680};
  const repaired=await sharp('public/images/repairs/marsh-habitat.webp').ensureAlpha().raw().toBuffer();
  for(let py=0;py<habitat.height;py++)for(let px=0;px<habitat.width;px++){
    const edge=Math.min(px,py,habitat.width-px,habitat.height-py);
    repaired[(py*habitat.width+px)*4+3]=Math.round(255*smooth(edge/30)*smooth((px*.55+py-190)/60));
  }
  const insert=await sharp(repaired,{raw:{width:habitat.width,height:habitat.height,channels:4}}).png().toBuffer();
  registered=await sharp(registered).composite([{input:insert,left:habitat.left,top:habitat.top}]).png().toBuffer();
  const tile=await sharp(registered).ensureAlpha().raw().toBuffer();
  const mask=new Uint8Array(width*height*4);
  for(let py=0;py<height;py++)for(let px=0;px<width;px++){
    const i=(py*width+px)*4,alpha=morannonAlpha(px,py);
    tile[i+3]=Math.round(tile[i+3]*alpha);
    const bx=x+px,by=y+py,oldAlpha=bx<base.info.width&&by<base.info.height?base.data[(by*base.info.width+bx)*4+3]/255:0;
    // Local mist belongs only to newly revealed terrain. Existing regional
    // atmosphere and its shared clock continue unchanged in the overlap.
    mask[i]=mask[i+1]=mask[i+2]=255;mask[i+3]=Math.round(255*alpha*(1-oldAlpha));
  }
  const patch=await sharp(tile,{raw:{width,height,channels:4}}).png().toBuffer();
  const original=await sharp(base.data,{raw:base.info}).png().toBuffer();
  // Paint underneath the approved atlas, preserving every opaque old pixel.
  // Only its existing paper feather reveals the matching new background.
  const painting=await sharp({create:{width:worldWidth,height:worldHeight,channels:4,background:'#00000000'}})
    .composite([{input:patch,left:x,top:y},{input:original,left:0,top:0}]).png().toBuffer();
  await sharp(painting).webp({quality:96,alphaQuality:100,effort:6}).toFile('public/images/atlas-morannon.webp');
  await sharp(mask,{raw:{width,height,channels:4}}).png().toFile('public/images/atlas-masks/morannon.png');
  // New marsh pools are still water. There are no invented current guides.
  // Extend the fixed two-world-unit grid without resampling any old coverage.
  await sharp({create:{width:worldWidth/2,height:worldHeight/2,channels:3,background:'#000'}})
    .composite([{input:'public/images/atlas-masks/expanded-water.png',left:0,top:0}])
    .greyscale().png().toFile('public/images/atlas-masks/morannon-water.png');
  console.log(`Extended the atlas east to the Dead Marshes, Dagorlad and Morannon (${worldWidth} × ${worldHeight}).`);
}

if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)await extendMorannon();
