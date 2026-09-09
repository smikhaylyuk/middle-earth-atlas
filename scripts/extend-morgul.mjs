import sharp from 'sharp';
import {pathToFileURL} from 'node:url';
import layout from '../lib/atlas/morgul-layout.json' with {type:'json'};

const smooth=n=>{const t=Math.max(0,Math.min(1,n));return t*t*(3-2*t);};
const junction={x:4500,y:4180,width:920,height:900};
const approachLines=[
  [[4555,4180],[4590,4260],[4720,4330],[4840,4385],[4985,4480],[5048,4618]],
  [[5048,4618],[5020,4700],[4970,4760],[4890,4860],[4930,4960],[4990,5080]],
  [[5048,4618],[5030,4510],[5000,4430]],
];
function distanceToLine(x,y,points){
  let distance=Infinity;
  for(let i=1;i<points.length;i++){
    const [ax,ay]=points[i-1],[bx,by]=points[i],dx=bx-ax,dy=by-ay;
    const t=Math.max(0,Math.min(1,((x-ax)*dx+(y-ay)*dy)/(dx*dx+dy*dy)));
    distance=Math.min(distance,Math.hypot(x-ax-dx*t,y-ay-dy*t));
  }
  return distance;
}
export function junctionRepairAlpha(x,y){
  const px=x-junction.x,py=y-junction.y;
  const edge=smooth(px/30)*smooth(py/30)*smooth((junction.width-px)/30)*smooth((junction.height-py)/30);
  const protectedRuins=smooth((Math.hypot(x-4657,y-4616)-190)/40);
  const roads=smooth((90-Math.min(...approachLines.map(p=>distanceToLine(x,y,p))))/40);
  const statue=smooth((75-Math.hypot(x-4932,y-4581))/25);
  // The inset's lower half invented a second stream. It is never included:
  // retain only the northern approach, junction and real tributary crossing.
  return edge*protectedRuins*Math.max(roads,statue)*smooth((4790-y)/40);
}
export function riverDistance(x,y){
  let distance=Infinity;
  for(let i=1;i<layout.morgulduin.length;i++){
    const [ax,ay]=layout.morgulduin[i-1],[bx,by]=layout.morgulduin[i],dx=bx-ax,dy=by-ay;
    const t=Math.max(0,Math.min(1,((x-ax)*dx+(y-ay)*dy)/(dx*dx+dy*dy)));
    distance=Math.min(distance,Math.hypot(x-ax-dx*t,y-ay-dy*t));
  }
  return distance;
}
// A bounded amendment of the former eastern fade: the Cross-roads and the
// tributary valley join the new sheet here. Osgiliath, the Anduin and Emyn
// Arnen retain their registration. Everything outside this area stays fixed.
export function morgulRepairAlpha(x,y){
  const valley=smooth((x-4810)/65)*smooth((5500-x)/70)*smooth((y-4320)/85)*smooth((4985-y)/65);
  const tributary=smooth((70-riverDistance(x,y))/30)*smooth((x-4710)/35)*smooth((5460-x)/50);
  return Math.max(valley,tributary);
}
export const morgulEdgeAlpha=(x,y)=>smooth(x/70)*smooth(y/85)*smooth((layout.width-x)/85)*smooth((layout.height-y)/90);
// The overhanging crown hides a short part of the lower tributary. Its cool
// leaf shadows resemble slate water, so colour alone is not sufficient here.
export const morgulCanopy=(x,y)=>((x-4925)/29)**2+((y-4702)/25)**2<1;

export async function extendMorgul(){
  const {x,y,width,height,worldWidth,worldHeight}=layout;
  const base=await sharp('public/images/atlas-pelennor.webp').ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const tile=await sharp('public/images/morgul-painted.webp').resize(width,height,{fit:'fill'}).ensureAlpha().raw().toBuffer();
  const old=await sharp('public/images/atlas-masks/pelennor-water.png').greyscale().raw().toBuffer({resolveWithObject:true});
  const mask=new Uint8Array(width*height*4);
  for(let py=0;py<height;py++)for(let px=0;px<width;px++){
    const i=(py*width+px)*4,wx=x+px,wy=y+py,bi=(wy*worldWidth+wx)*4;
    const previous=base.data[bi+3]/255,water=old.data[Math.floor(wy/2)*old.info.width+Math.floor(wx/2)];
    const alpha=morgulEdgeAlpha(px,py)*Math.max(1-previous,water?0:morgulRepairAlpha(wx,wy));
    tile[i+3]=Math.round(255*alpha);
    mask[i]=mask[i+1]=mask[i+2]=255;mask[i+3]=tile[i+3];
  }
  const patch=await sharp(tile,{raw:{width,height,channels:4}}).png().toBuffer();
  let combined=await sharp(base.data,{raw:base.info}).composite([{input:patch,left:x,top:y}]).png().toBuffer();
  const roads=await sharp('public/images/repairs/ithilien-crossroads.webp').resize(junction.width,junction.height,{fit:'fill'}).ensureAlpha().raw().toBuffer();
  for(let py=0;py<junction.height;py++)for(let px=0;px<junction.width;px++){
    const wx=junction.x+px,wy=junction.y+py,water=old.data[Math.floor(wy/2)*old.info.width+Math.floor(wx/2)];
    roads[(py*junction.width+px)*4+3]=Math.round(255*(water?0:junctionRepairAlpha(wx,wy)));
  }
  combined=await sharp(combined).composite([{input:await sharp(roads,{raw:{width:junction.width,height:junction.height,channels:4}}).png().toBuffer(),left:junction.x,top:junction.y}]).png().toBuffer();
  await sharp(combined).webp({quality:96,alphaQuality:100,effort:6}).toFile('public/images/atlas-morgul.webp');
  await sharp(mask,{raw:{width,height,channels:4}}).png().toFile('public/images/atlas-masks/morgul.png');

  // Preserve every prior positive water sample. Only the inspected tributary
  // can add water, on the unchanged two-world-unit grid. White masonry and
  // flower meadows are deliberately excluded by the slate-water classifier.
  const gridWidth=worldWidth/2,gridHeight=worldHeight/2,coverage=Uint8Array.from(old.data);
  const paint=await sharp(combined).resize(gridWidth,gridHeight).ensureAlpha().raw().toBuffer();
  for(let gy=Math.floor(y/2);gy<Math.ceil((y+height)/2);gy++)for(let gx=Math.floor(x/2);gx<Math.ceil((x+width)/2);gx++){
    const i=gy*gridWidth+gx,wx=gx*2,wy=gy*2;
    if(coverage[i]||morgulCanopy(wx,wy)||riverDistance(wx,wy)>50)continue;
    const p=i*4,r=paint[p],g=paint[p+1],b=paint[p+2];
    if(paint[p+3]>180&&g>=r+2&&b>=r-8&&b>=g-16)coverage[i]=255;
  }
  await sharp(coverage,{raw:{width:gridWidth,height:gridHeight,channels:1}}).png().toFile('public/images/atlas-masks/morgul-water.png');
  console.log(`Joined Ithilien and Morgul Vale within the existing ${worldWidth} × ${worldHeight} atlas.`);
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)await extendMorgul();
