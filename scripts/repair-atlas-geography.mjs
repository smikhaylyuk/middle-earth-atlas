import sharp from 'sharp';

// Registered correction corridors, checked against Christopher Tolkien's
// published map. Context outside these masks never enters the painting.
const repairs=[
  {name:'limlight',left:2280,top:1550,width:1070,height:450,paths:[
    ['M365 299 C460 298 470 287 530 277 S641 239 700 257 S824 277 880 275 L940 289',62],
    ['M394 304 C449 320 481 347 531 345 L613 375',62],
  ]},
  {name:'glanduin',left:1350,top:1020,width:760,height:480,paths:[
    ['M149 164 C210 167 222 201 276 215 S371 286 416 283 S475 300 509 320',55],
    ['M137 301 C215 284 280 317 333 298 S399 275 432 295 L487 319',42],
  ]},
  {name:'greenway',left:1510,top:1670,width:650,height:600,paths:[
    ['M216 0 L241 40 L241 82 L223 109 L215 145 L231 197 L224 239 L238 268 L247 296 L240 318',36],
    ['M0 210 C50 257 137 264 162 324 L169 337',60],
  ]},
];

export async function repairAtlasGeography(painting){
  const alpha=await sharp(painting).extractChannel(3).toColourspace('b-w').raw().toBuffer();
  let output=painting;
  for(const r of repairs){
    const svg=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${r.width}" height="${r.height}">${r.paths.map(([d,w])=>`<path d="${d}" fill="none" stroke="white" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`).join('')}</svg>`);
    let mask=await sharp(svg).blur(6).png().toBuffer();
    if(r.name==='greenway'){
      // The candidate moved the ford's banks. Accept its road and dry ground
      // only; keep every original water pixel wherever it would add water.
      const {data}=await sharp(`public/images/repairs/${r.name}.webp`).ensureAlpha().raw().toBuffer({resolveWithObject:true});
      const matte=await sharp(mask).ensureAlpha().raw().toBuffer();
      for(let i=0;i<r.width*r.height;i++)if(data[i*4+1]-data[i*4]>4&&data[i*4+2]-data[i*4]>5)matte[i*4+3]=0;
      mask=await sharp(matte,{raw:{width:r.width,height:r.height,channels:4}}).png().toBuffer();
    }
    const patch=await sharp(`public/images/repairs/${r.name}.webp`).composite([{input:mask,blend:'dest-in'}]).png().toBuffer();
    output=await sharp(output).composite([{input:patch,left:r.left,top:r.top}]).png().toBuffer();
  }
  const {data,info}=await sharp(output).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  for(let i=0;i<alpha.length;i++)data[i*4+3]=alpha[i];
  return sharp(data,{raw:{width:info.width,height:info.height,channels:4}}).png().toBuffer();
}

// A small, connected open-sea coverage grid for the canvas wave highlights.
// Blue mountain shadows are excluded by the flood from the western ocean.
export async function makeSeaMask(painting){
  const width=925,height=700,{data}=await sharp(painting).resize(width,height).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const mask=new Uint8Array(width*height),queue=new Int32Array(width*height);let head=0,tail=0;
  const water=i=>data[i*4+3]>200&&data[i*4+1]-data[i*4]>4&&data[i*4+2]-data[i*4]>4;
  for(let y=35;y<height-25;y++){const i=y*width+45;if(water(i)){mask[i]=255;queue[tail++]=i;}}
  while(head<tail){const i=queue[head++],x=i%width,y=Math.floor(i/width);for(const n of [x>0?i-1:-1,x<width-1?i+1:-1,y>0?i-width:-1,y<height-1?i+width:-1])if(n>=0&&!mask[n]&&water(n)){mask[n]=255;queue[tail++]=n;}}
  // Sharp morphology treats dark pixels as foreground; dilate shrinks the white sea.
  return sharp(mask,{raw:{width,height,channels:1}}).dilate(2).png().toBuffer();
}

export async function makeWaterMask(painting){
  const width=1850,height=1400,{data}=await sharp(painting).resize(width,height).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const mask=new Uint8Array(width*height);
  for(let i=0;i<mask.length;i++){const p=i*4;if(data[p+3]>100&&data[p+1]>=data[p]+1&&data[p+2]>=data[p]-2)mask[i]=255;}
  return sharp(mask,{raw:{width,height,channels:1}}).png().toBuffer();
}
