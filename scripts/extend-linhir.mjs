import sharp from 'sharp';
import {readFile,writeFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import layout from '../lib/atlas/linhir-layout.json' with {type:'json'};
import {bakeShoreline,bakeShoreWaveField} from './bake-shoreline.mjs';

const smooth=n=>{const t=Math.max(0,Math.min(1,n));return t*t*(3-2*t);};
export const linhirEdgeAlpha=(x,y)=>smooth(x/75)*smooth(y/65)*smooth((layout.width-x)/90)*smooth((layout.height-y)/70);

export async function extendLinhir(){
  const {x,y,width,height,worldWidth,worldHeight}=layout;
  const previous=await sharp('public/images/atlas-belfalas.webp').ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const base=await sharp(previous.data,{raw:previous.info}).png().toBuffer();
  const tile=await sharp('public/images/linhir-painted.webp').resize(width,height,{fit:'fill'}).ensureAlpha().raw().toBuffer();
  const mask=new Uint8Array(width*height*4);
  for(let py=0;py<height;py++)for(let px=0;px<width;px++){
    const i=(py*width+px)*4,oldAlpha=y+py<previous.info.height?previous.data[((y+py)*worldWidth+x+px)*4+3]:0;
    const edge=linhirEdgeAlpha(px,py);tile[i+3]=Math.round(255*edge);
    mask[i]=mask[i+1]=mask[i+2]=255;mask[i+3]=Math.round(edge*(255-oldAlpha));
  }
  const patch=await sharp(tile,{raw:{width,height,channels:4}}).png().toBuffer();
  const combined=await sharp({create:{width:worldWidth,height:worldHeight,channels:4,background:'#00000000'}})
    .composite([{input:patch,left:x,top:y},{input:base,left:0,top:0}]).png().toBuffer();
  await sharp(combined).webp({quality:96,alphaQuality:100,effort:6}).toFile('public/images/atlas-linhir.webp');
  await sharp(mask,{raw:{width,height,channels:4}}).png().toFile('public/images/atlas-masks/linhir.png');

  // Retain the existing world grid. Fill only the new eastern sheet.
  const gridWidth=worldWidth/2,gridHeight=worldHeight/2;
  const oldWater=await sharp('public/images/atlas-masks/belfalas-water.png').greyscale().raw().toBuffer();
  const oldSea=await sharp('public/images/atlas-masks/belfalas-sea.png').greyscale().raw().toBuffer();
  const coverage=new Uint8Array(gridWidth*gridHeight),sea=new Uint8Array(coverage.length);
  coverage.set(oldWater);sea.set(oldSea);
  const paint=await sharp(combined).resize(gridWidth,gridHeight).ensureAlpha().raw().toBuffer();
  for(let gy=y/2;gy<(y+height)/2;gy++)for(let gx=x/2;gx<(x+width)/2;gx++){
    const i=gy*gridWidth+gx,p=i*4;
    if(coverage[i])continue;
    const oldAlpha=gy*2<previous.info.height?previous.data[(gy*2*worldWidth+gx*2)*4+3]:0;
    if(oldAlpha===255)continue;
    const r=paint[p],g=paint[p+1],b=paint[p+2];
    if(paint[p+3]>230&&g>=r+2&&b>=r-5&&b>=g-14)coverage[i]=255;
  }
  // Open-sea glints need room around them; narrow river reaches use the
  // registered flow field instead. Earlier sea coverage stays unchanged.
  for(let gy=y/2+24;gy<(y+height)/2-24;gy++)for(let gx=x/2+24;gx<(x+width)/2-24;gx++){
    const i=gy*gridWidth+gx,p=i*4;
    if(!sea[i]&&coverage[i]&&paint[p+1]>paint[p]+4&&paint[p+2]>paint[p]+4&&[-24,24,-24*gridWidth,24*gridWidth].every(d=>coverage[i+d]))sea[i]=255;
  }
  await sharp(coverage,{raw:{width:gridWidth,height:gridHeight,channels:1}}).png().toFile('public/images/atlas-masks/linhir-water.png');
  await sharp(sea,{raw:{width:gridWidth,height:gridHeight,channels:1}}).png().toFile('public/images/atlas-masks/linhir-sea.png');
  const localWater=await sharp(coverage,{raw:{width:gridWidth,height:gridHeight,channels:1}}).extract({left:x/2,top:y/2,width:width/2,height:height/2}).png().toBuffer();
  const localShore=await bakeShoreline(localWater,{width,height});
  const points=localShore.tracks.flat().map(([px,py,nx,ny])=>[px+x,py+y,nx,ny]).filter(([px,py])=>px>4100&&py>6500);
  const oldShore=JSON.parse(await readFile('public/images/atlas-masks/belfalas-shoreline.json','utf8'));
  const shore={width:worldWidth,height:worldHeight,tracks:[oldShore.tracks.flat(),points]};
  const oldField=JSON.parse(await readFile('public/images/atlas-masks/belfalas-shore-wave-field.json','utf8'));
  const newField=bakeShoreWaveField({width:worldWidth,height:worldHeight,tracks:[points]});
  const cells=new Map(oldField.cells.map(c=>[`${c[0]},${c[1]}`,c]));
  for(const c of newField.cells)if(!cells.has(`${c[0]},${c[1]}`))cells.set(`${c[0]},${c[1]}`,c);
  await writeFile('public/images/atlas-masks/linhir-shoreline.json',JSON.stringify(shore));
  await writeFile('public/images/atlas-masks/linhir-shore-wave-field.json',JSON.stringify({...newField,cells:[...cells.values()]}));
  console.log(`Extended Linhir to ${worldWidth} × ${worldHeight}, adding ${points.length} shore samples.`);
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)await extendLinhir();
