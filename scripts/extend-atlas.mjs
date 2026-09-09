import sharp from 'sharp';
import {readFile,writeFile} from 'node:fs/promises';
import layout from '../lib/atlas/rauros-layout.json' with {type:'json'};
import {harmonizeAtlas} from './harmonize-atlas.mjs';
import {extendMorannon} from './extend-morannon.mjs';

const clamp=n=>Math.max(0,Math.min(1,n));
const smooth=n=>{const t=clamp(n);return t*t*(3-2*t);};
export function expansionAlpha(x,y){
  // Keep the approved Argonath and upstream channel. Fade through their
  // downstream water, then into the adjoining lake and hill country.
  const north=250-140*smooth((x-670)/280);
  return smooth(x/100)*smooth((y-north)/85)*smooth((layout.width-x)/100)*smooth((layout.height-y)/95);
}

export async function extendAtlas(){
  const {x,y,width,height,worldWidth,worldHeight}=layout;
  const legacy=await readFile('public/images/atlas-cartographic.webp');
  const tile=await sharp('public/images/rauros-painted.webp').resize(width,height,{fit:'fill'}).ensureAlpha().raw().toBuffer();
  const mask=new Uint8Array(width*height*4);
  for(let py=0;py<height;py++)for(let px=0;px<width;px++){
    const i=(py*width+px)*4,a=Math.round(expansionAlpha(px,py)*255);
    tile[i+3]=Math.round(tile[i+3]*a/255);mask[i]=mask[i+1]=mask[i+2]=255;mask[i+3]=a;
  }
  const patch=await sharp(tile,{raw:{width,height,channels:4}}).png().toBuffer();
  const regionMask=await sharp(mask,{raw:{width,height,channels:4}}).png().toBuffer();
  await writeFile('public/images/atlas-masks/rauros.png',regionMask);
  const composite=await sharp({create:{width:worldWidth,height:worldHeight,channels:4,background:'#00000000'}}).composite([{input:legacy,left:0,top:0},{input:patch,left:x,top:y}]).png().toBuffer();
  await sharp(composite).webp({quality:94,alphaQuality:100,effort:6}).toFile('public/images/atlas-expanded.webp');
  // Rohan's atmosphere stops where this painting takes ownership. The
  // global day wash and clock still apply to the single combined image.
  const oldMask=await sharp('public/images/atlas-masks/rohan.png').ensureAlpha().raw().toBuffer({resolveWithObject:true});
  for(let py=0;py<oldMask.info.height;py++)for(let px=0;px<oldMask.info.width;px++){
    const lx=px-x,ly=py+1800-y;if(lx<0||ly<0||lx>=width||ly>=height)continue;
    const i=(py*oldMask.info.width+px)*4+3;oldMask.data[i]=Math.round(oldMask.data[i]*(1-expansionAlpha(lx,ly)));
  }
  await sharp(oldMask.data,{raw:oldMask.info}).png().toFile('public/images/atlas-masks/rohan-expanded.png');
  // The base water grid remains unchanged in its original coordinate plane.
  // Extend coverage at the same two-world-units-per-pixel resolution.
  const gridWidth=worldWidth/2,gridHeight=worldHeight/2;
  const {data}=await sharp(composite).resize(gridWidth,gridHeight).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const coverage=new Uint8Array(gridWidth*gridHeight);
  for(let i=0;i<coverage.length;i++){const p=i*4;if(data[p+3]>100&&data[p+1]>=data[p]+1&&data[p+2]>=data[p]-16&&data[p+2]>=data[p+1]-22)coverage[i]=255;}
  await sharp(coverage,{raw:{width:gridWidth,height:gridHeight,channels:1}}).png().toFile('public/images/atlas-masks/expanded-water.png');
  console.log(`Extended the atlas to ${worldWidth} × ${worldHeight}; one joined painting and shared water coverage.`);
  await harmonizeAtlas();
  await extendMorannon();
}
