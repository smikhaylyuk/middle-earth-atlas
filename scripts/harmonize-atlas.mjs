import sharp from 'sharp';
import {rolldown} from 'rolldown';
import {pathToFileURL} from 'node:url';

export const styleArea={left:0,top:0,width:2500,height:1940};
const clamp=n=>Math.max(0,Math.min(1,n));
const smooth=n=>{const t=clamp(n);return t*t*(3-2*t);};
export const styleEnvelope=(x,y)=>1-smooth(Math.max((x-2150)/350,(y-1640)/300));
const original='public/images/atlas-expanded.webp';
const reference='public/images/repairs/eriador-style-reference.webp';

async function loadGeometry(){
  const bundle=await rolldown({input:'lib/atlas/world.ts'});
  const {output}=await bundle.generate({format:'esm'});await bundle.close();
  const {mapPlaces}=await import('data:text/javascript;base64,'+Buffer.from(output[0].code).toString('base64'));
  const roads=await rolldown({input:'lib/atlas/cartography.ts'});
  const generated=await roads.generate({format:'esm'});await roads.close();
  const {roadGuides}=await import('data:text/javascript;base64,'+Buffer.from(generated.output[0].code).toString('base64'));
  return {mapPlaces,roadGuides};
}

// Only a colour distribution is taken from the generated study. Never copy
// its pixels or spatial features: small riverbanks and hills were reinterpreted.
async function landQuantiles(input){
  const {data}=await sharp(input).resize(800).removeAlpha().raw().toBuffer({resolveWithObject:true});
  const channels=[[],[],[]];
  for(let i=0;i<data.length;i+=3){const [r,g,b]=data.subarray(i,i+3);
    if(r>g&&g>b+16&&r>65&&r<220)for(let c=0;c<3;c++)channels[c].push(data[i+c]);
  }
  return channels.map(a=>{a.sort((a,b)=>a-b);return [0,...[.02,.1,.25,.5,.75,.9,.98].map(p=>a[Math.floor(a.length*p)]),255];});
}
function colourTable(from,to){
  return from.map((channel,c)=>Float32Array.from({length:256},(_,v)=>{
    let k=0;while(k<channel.length-2&&channel[k+1]<v)k++;
    const t=clamp((v-channel[k])/Math.max(1,channel[k+1]-channel[k]));
    return to[c][k]+(to[c][k+1]-to[c][k])*t;
  }));
}

export async function styleProtection(){
  const width=styleArea.width/2,height=styleArea.height/2;
  const water=await sharp('public/images/atlas-masks/expanded-water.png').extract({left:0,top:0,width,height}).greyscale().raw().toBuffer();
  const {mapPlaces,roadGuides}=await loadGeometry();
  const svg=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width*2} ${height*2}">
    ${roadGuides.map(r=>`<path d="${r.path}" transform="translate(${r.x??0} ${r.y??0})" fill="none" stroke="white" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/>`).join('')}
    ${Object.values(mapPlaces).map(p=>`<circle cx="${p.x}" cy="${p.y}" r="48" fill="white"/>`).join('')}
  </svg>`);
  const landmarks=await sharp(svg).ensureAlpha().extractChannel(3).raw().toBuffer();
  const distance=new Float32Array(width*height);
  for(let i=0;i<distance.length;i++)distance[i]=water[i]>100||landmarks[i]>0?0:1e6;
  // A chamfer distance keeps an untouched bank/road band, followed by a broad
  // transition. It does not grow or move any visible geographic feature.
  for(let y=0;y<height;y++)for(let x=0;x<width;x++){
    const i=y*width+x;
    if(x)distance[i]=Math.min(distance[i],distance[i-1]+1);
    if(y)distance[i]=Math.min(distance[i],distance[i-width]+1);
    if(x&&y)distance[i]=Math.min(distance[i],distance[i-width-1]+Math.SQRT2);
    if(x<width-1&&y)distance[i]=Math.min(distance[i],distance[i-width+1]+Math.SQRT2);
  }
  for(let y=height-1;y>=0;y--)for(let x=width-1;x>=0;x--){
    const i=y*width+x;
    if(x<width-1)distance[i]=Math.min(distance[i],distance[i+1]+1);
    if(y<height-1)distance[i]=Math.min(distance[i],distance[i+width]+1);
    if(x<width-1&&y<height-1)distance[i]=Math.min(distance[i],distance[i+width+1]+Math.SQRT2);
    if(x&&y<height-1)distance[i]=Math.min(distance[i],distance[i+width-1]+Math.SQRT2);
  }
  return {width,height,distance};
}

export async function harmonizeAtlas(){
  const {data,info}=await sharp(original).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const crop=await sharp(original).extract(styleArea).png().toBuffer();
  const [from,to,soft,protection]=await Promise.all([
    landQuantiles(crop),landQuantiles(reference),
    sharp(crop).blur(1.1).ensureAlpha().raw().toBuffer(),styleProtection(),
  ]);
  const table=colourTable(from,to);
  for(let y=0;y<styleArea.height;y++)for(let x=0;x<styleArea.width;x++){
    const distance=protection.distance[Math.floor(y/2)*protection.width+Math.floor(x/2)];
    const amount=styleEnvelope(x,y)*smooth((distance-8)/18);
    if(!amount)continue;
    const i=(y*info.width+x)*4,j=(y*styleArea.width+x)*4;
    for(let c=0;c<3;c++){
      const value=data[i+c],toned=table[c][value];
      // Reduce only the finest etched grain; retain the original relief,
      // forests, field boundaries and all broad light/shadow structure.
      data[i+c]=Math.round(value+amount*(.78*(toned-value)+.38*(soft[j+c]-value)));
    }
  }
  await sharp(data,{raw:info}).webp({quality:96,alphaQuality:100,effort:6}).toFile('public/images/atlas-harmonized.webp');
  console.log('Harmonized Eriador land palette and fine grain; registered geography and original alpha retained.');
}

if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)await harmonizeAtlas();
