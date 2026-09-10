import sharp from 'sharp';
import {readFile,writeFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import layout from '../lib/atlas/anfalas-layout.json' with {type:'json'};
import {bakeShoreline,bakeShoreWaveField} from './bake-shoreline.mjs';

const smooth=n=>{const t=Math.max(0,Math.min(1,n));return t*t*(3-2*t);};
export const anfalasEdgeAlpha=(x,y)=>smooth(x/75)*smooth(y/70)*smooth((layout.width-x)/100)*smooth((layout.height-y)/70);

export async function extendAnfalas(){
  const {x,y,width,height,worldWidth,worldHeight}=layout;
  const base=await sharp('public/images/atlas-lamedon.webp').ensureAlpha().raw().toBuffer({resolveWithObject:true});
  // The former southern edge contains parchment mixed into translucent
  // ocean pixels. Retire that fade as new sea replaces it; retaining it as
  // an upper layer would leave a pale horizontal stripe across the water.
  for(let py=2740;py<2800;py++)for(let px=0;px<1950;px++){
    const i=(py*worldWidth+px)*4+3,a=base.data[i];
    const strength=smooth(px/140)*smooth((1950-px)/200);
    if(a<255)base.data[i]=Math.round(255*(a/255)**(1+7*strength));
  }
  const tile=await sharp('public/images/anfalas-painted.webp').resize(width,height,{fit:'fill'}).ensureAlpha().raw().toBuffer();
  const mask=new Uint8Array(width*height*4);
  for(let py=0;py<height;py++)for(let px=0;px<width;px++){
    const i=(py*width+px)*4,bi=((y+py)*worldWidth+x+px)*4,edge=anfalasEdgeAlpha(px,py);
    tile[i+3]=Math.round(255*edge);
    mask[i]=mask[i+1]=mask[i+2]=255;mask[i+3]=Math.round(edge*(255-base.data[bi+3]));
  }
  const patch=await sharp(tile,{raw:{width,height,channels:4}}).png().toBuffer();
  // Existing opaque painting is the upper layer, so generation cannot move
  // established rivers, settlements or mountains at the joining edges.
  const combined=await sharp({create:{width:worldWidth,height:worldHeight,channels:4,background:'#00000000'}})
    .composite([{input:patch,left:x,top:y},{input:await sharp(base.data,{raw:base.info}).png().toBuffer(),left:0,top:0}]).png().toBuffer();
  await sharp(combined).webp({quality:96,alphaQuality:100,effort:6}).toFile('public/images/atlas-anfalas.webp');
  await sharp(mask,{raw:{width,height,channels:4}}).png().toFile('public/images/atlas-masks/anfalas.png');

  const gridWidth=worldWidth/2,gridHeight=worldHeight/2;
  const old=await sharp('public/images/atlas-masks/lamedon-water.png').greyscale().raw().toBuffer();
  const coverage=Uint8Array.from(old);
  const paint=await sharp(combined).resize(gridWidth,gridHeight).ensureAlpha().raw().toBuffer();
  for(let gy=y/2;gy<gridHeight;gy++)for(let gx=x/2;gx<(x+width)/2;gx++){
    const i=gy*gridWidth+gx,p=i*4,r=paint[p],g=paint[p+1],b=paint[p+2];
    // Blue/slate water only. Preserve the previous coverage byte-for-byte;
    // neither new atmosphere nor surf may spill into dry ochre terrain.
    if(!coverage[i]&&paint[p+3]>230&&g>=r+2&&b>=r-5&&b>=g-14)coverage[i]=255;
  }
  await sharp(coverage,{raw:{width:gridWidth,height:gridHeight,channels:1}}).png().toFile('public/images/atlas-masks/anfalas-water.png');

  // Copy the original sea grid into the same world coordinates. Only the
  // southwestern extension is classified for the added open-water glints.
  const sea=new Uint8Array(gridWidth*gridHeight);
  const oldSea=await sharp('public/images/atlas-masks/sea.png').resize(1850,1400,{kernel:'nearest'}).greyscale().raw().toBuffer();
  for(let row=0;row<1400;row++)sea.set(oldSea.subarray(row*1850,(row+1)*1850),row*gridWidth);
  for(let gy=1400;gy<gridHeight;gy++)for(let gx=0;gx<width/2;gx++){
    const i=gy*gridWidth+gx,p=i*4;
    if(coverage[i]&&paint[p+1]>paint[p]+4&&paint[p+2]>paint[p]+4)sea[i]=255;
  }
  await sharp(sea,{raw:{width:gridWidth,height:gridHeight,channels:1}}).png().toFile('public/images/atlas-masks/anfalas-sea.png');

  const localWater=await sharp(coverage,{raw:{width:gridWidth,height:gridHeight,channels:1}})
    .extract({left:x/2,top:y/2,width:width/2,height:height/2}).png().toBuffer();
  const localShore=await bakeShoreline(localWater,{width,height});
  const oldShore=JSON.parse(await readFile('public/images/atlas-masks/shoreline.json','utf8'));
  const newPoints=localShore.tracks.flat().map(([px,py,nx,ny])=>[px+x,py+y,nx,ny]).filter(([,py])=>py>=2680);
  const shore={width:worldWidth,height:worldHeight,tracks:[oldShore.tracks.flat(),newPoints]};
  // Retain the northern field exactly. The new field begins in its trailing
  // coast overlap, with duplicate cells removed instead of doubled foam.
  const oldField=JSON.parse(await readFile('public/images/atlas-masks/shore-wave-field.json','utf8'));
  const newField=bakeShoreWaveField({width:worldWidth,height:worldHeight,tracks:[newPoints]});
  const cells=new Map(oldField.cells.map(c=>[`${c[0]},${c[1]}`,c]));
  for(const c of newField.cells)if(!cells.has(`${c[0]},${c[1]}`))cells.set(`${c[0]},${c[1]}`,c);
  await writeFile('public/images/atlas-masks/anfalas-shoreline.json',JSON.stringify(shore));
  await writeFile('public/images/atlas-masks/anfalas-shore-wave-field.json',JSON.stringify({width:worldWidth,height:worldHeight,step:oldField.step,cells:[...cells.values()]}));
  console.log(`Added the western Gondor coast within ${worldWidth} × ${worldHeight}; ${newPoints.length} new shoreline samples.`);
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)await extendAnfalas();
