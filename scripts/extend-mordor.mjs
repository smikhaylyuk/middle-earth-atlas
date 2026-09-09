import sharp from 'sharp';
import {pathToFileURL} from 'node:url';
import layout from '../lib/atlas/mordor-layout.json' with {type:'json'};

const smooth=n=>{const t=Math.max(0,Math.min(1,n));return t*t*(3-2*t);};
export function mordorAlpha(x,y){
  // This sheet stays east of the unfinished Anduin/Ithilien corridor.
  // The previous Gate and Udûn painting remain above it in the composite.
  return smooth(x/100)*smooth(y/100)*smooth((layout.width-x)/110)*smooth((layout.height-y)/110);
}

export async function extendMordor(){
  const {x,y,width,height,worldWidth,worldHeight}=layout;
  const base=await sharp('public/images/atlas-morannon.webp').ensureAlpha().raw().toBuffer({resolveWithObject:true});
  let registered=await sharp('public/images/mordor-painted.webp').resize(width,height,{fit:'fill'}).png().toBuffer();
  const inserts=[
    {name:'barad-dur-spur',left:1236,top:470,width:364,height:673},
    {name:'isenmouthe-earthwork',left:531,top:655,width:253,height:179},
  ];
  for(const insert of inserts){
    const data=await sharp(`public/images/repairs/${insert.name}.webp`).resize(insert.width,insert.height,{fit:'fill'}).ensureAlpha().raw().toBuffer();
    for(let py=0;py<insert.height;py++)for(let px=0;px<insert.width;px++){
      const edge=Math.min(px,py,insert.width-px,insert.height-py);
      data[(py*insert.width+px)*4+3]=Math.round(255*smooth(edge/20));
    }
    const patch=await sharp(data,{raw:{width:insert.width,height:insert.height,channels:4}}).png().toBuffer();
    registered=await sharp(registered).composite([{input:patch,left:insert.left,top:insert.top}]).png().toBuffer();
  }
  const tile=await sharp(registered).ensureAlpha().raw().toBuffer();
  const mask=new Uint8Array(width*height*4);
  for(let py=0;py<height;py++)for(let px=0;px<width;px++){
    const i=(py*width+px)*4,alpha=mordorAlpha(px,py),bx=x+px,by=y+py;
    tile[i+3]=Math.round(tile[i+3]*alpha);
    const oldAlpha=bx<base.info.width&&by<base.info.height?base.data[(by*base.info.width+bx)*4+3]/255:0;
    mask[i]=mask[i+1]=mask[i+2]=255;mask[i+3]=Math.round(255*alpha*(1-oldAlpha));
  }
  const patch=await sharp(tile,{raw:{width,height,channels:4}}).png().toBuffer();
  const original=await sharp(base.data,{raw:base.info}).png().toBuffer();
  await sharp({create:{width:worldWidth,height:worldHeight,channels:4,background:'#00000000'}})
    .composite([{input:patch,left:x,top:y},{input:original,left:0,top:0}])
    .webp({quality:96,alphaQuality:100,effort:6}).toFile('public/images/atlas-mordor.webp');
  await sharp(mask,{raw:{width,height,channels:4}}).png().toFile('public/images/atlas-masks/mordor.png');
  // Gorgoroth contributes no invented water. Keep the original fixed grid
  // byte-for-byte and extend only its empty eastern/southern bounds.
  await sharp({create:{width:worldWidth/2,height:worldHeight/2,channels:3,background:'#000'}})
    .composite([{input:'public/images/atlas-masks/morannon-water.png',left:0,top:0}])
    .greyscale().png().toFile('public/images/atlas-masks/mordor-water.png');
  console.log(`Extended northern Mordor (${worldWidth} × ${worldHeight}), preserving the earlier atlas and water coordinates.`);
}

if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)await extendMordor();
