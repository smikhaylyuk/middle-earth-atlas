import sharp from 'sharp';
import {writeFile} from 'node:fs/promises';

// Register generated river textures to the reviewed geography. These are
// narrow raster cutouts, not replacements for the surrounding generated
// terrain. Source points follow the candidate; anchors relocate its material
// without accepting its misplaced settlements, banks or confluences.
export const tributaryRepairs=[
  {name:'shire-waterways',left:500,top:180,width:900,height:600,streams:[
    {name:'The Water',axis:'x',source:[[90,34],[120,57],[140,74],[160,84],[180,97],[190,118],[200,129],[220,138],[240,140],[260,143],[270,155],[281,167],[290,171],[303,167],[320,169],[335,181],[345,184],[360,188],[373,190],[410,202],[450,209],[483,215]],anchors:[[90,34,140,60],[240,140,265,196],[303,167,307,214],[373,190,345,224],[483,215,495,240]],taperStart:true},
    {name:'Withywindle',axis:'x',source:[[490,446],[510,439],[525,423],[550,413],[575,404],[594,397],[610,386],[631,379],[650,380],[672,370],[690,358],[712,347],[734,338],[752,335]],anchors:[[490,446,542,478],[610,386,654,416],[752,335,742,368]],taperEnd:true},
  ]},
  {name:'westfold-waterways',left:1150,top:1960,width:1350,height:740,streams:[
    {name:'Adorn',axis:'x',source:[[180,160],[196,182],[218,190],[241,202],[266,220],[294,234],[323,242],[354,262],[392,275],[418,287],[446,307],[489,321],[520,333],[549,364],[575,379],[602,391],[628,412],[652,429],[686,441],[716,446],[755,455]],anchors:[[180,160,165,166],[354,262,354,262],[755,455,755,455]],taperEnd:true},
    {name:'Deeping-stream (known local course)',axis:'y',source:[[1015,264],[1027,280],[1013,303],[1007,325],[1033,343],[1060,361],[1090,383],[1095,410],[1107,429]],anchors:[[1015,264,1024,538],[1007,325,1040,565],[1060,361,1062,589],[1107,429,1090,620]],taperStart:true},
  ]},
];
const lerp=(a,b,t)=>a+(b-a)*t;
function segment(points,value,axis){
  let i=0;while(i<points.length-2&&value>points[i+1][axis])i++;
  const a=points[i],b=points[i+1];return {a,b,t:Math.max(0,Math.min(1,(value-a[axis])/(b[axis]-a[axis])))};
}
export async function registeredTributary(r){
  const {data}=await sharp(`public/images/repairs/${r.name}-source.webp`).resize(r.width,r.height).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const result=Buffer.alloc(r.width*r.height*4),tracks=[];
  const color=(x,y,c)=>data[(Math.max(0,Math.min(r.height-1,y))*r.width+Math.max(0,Math.min(r.width-1,x)))*4+c];
  const sample=(x,y,c)=>{const ix=Math.floor(x),iy=Math.floor(y),dx=x-ix,dy=y-iy;return lerp(lerp(color(ix,iy,c),color(ix+1,iy,c),dx),lerp(color(ix,iy+1,c),color(ix+1,iy+1,c),dx),dy);};
  for(const stream of r.streams){
    const axis=stream.axis==='x'?0:1,other=1-axis;
    const first=stream.source[0][axis],last=stream.source.at(-1)[axis],centres=[];
    // Follow the continuous colored channel through the source crop, rather
    // than independently snapping columns to nearby tree shadows.
    const columns=[];let previous=[];
    for(let along=first;along<=last;along++){
      const e=segment(stream.source,along,axis),expected=lerp(e.a[other],e.b[other],e.t),column=[];
      for(let n=-14;n<=14;n++){
        const across=Math.round(expected)+n,x=axis===0?along:across,y=axis===0?across:along;
        const red=sample(x,y,0),green=sample(x,y,1),blue=sample(x,y,2);
        const local=(2.3-(green+blue)/Math.max(30,red))*15;let cost=Infinity,parent=0;
        if(!previous.length)cost=local+Math.abs(n)*.1;
        else previous.forEach((p,j)=>{const step=Math.abs(across-p.across),c=p.cost+local+step*.65+Math.abs(n)*.025;if(step<=9&&c<cost){cost=c;parent=j;}});
        column.push({across,cost,parent});
      }
      columns.push(column);previous=column;
    }
    let at=previous.reduce((best,p,i)=>p.cost<previous[best].cost?i:best,0);
    for(let i=columns.length-1;i>=0;i--){centres[i]=columns[i][at].across;at=columns[i][at].parent;}
    const paired=centres.map((_,i)=>{
      let sum=0,weight=0;for(let j=-2;j<=2;j++){const w=3-Math.abs(j);sum+=centres[Math.max(0,Math.min(centres.length-1,i+j))]*w;weight+=w;}
      const along=first+i,across=sum/weight,{a,b,t}=segment(stream.anchors,along,axis),targetAlong=lerp(a[axis+2],b[axis+2],t),targetAcross=across+lerp(a[other+2]-a[other],b[other+2]-b[other],t);
      return axis===0?{sx:along,sy:across,x:targetAlong,y:targetAcross}:{sx:across,sy:along,x:targetAcross,y:targetAlong};
    });
    const distances=new Float32Array(r.width*r.height);distances.fill(Infinity);
    const radius=stream.name==='Adorn'?7:5;
    for(let i=0;i<paired.length-1;i++){
      const a=paired[i],b=paired[i+1],dx=b.x-a.x,dy=b.y-a.y,length=Math.hypot(dx,dy);if(length<.01)continue;
      const srcA=paired[Math.max(0,i-2)],srcB=paired[Math.min(paired.length-1,i+3)],sdx=srcB.sx-srcA.sx,sdy=srcB.sy-srcA.sy,sl=Math.hypot(sdx,sdy)||1;
      for(let y=Math.max(0,Math.floor(Math.min(a.y,b.y)-radius));y<=Math.min(r.height-1,Math.ceil(Math.max(a.y,b.y)+radius));y++)for(let x=Math.max(0,Math.floor(Math.min(a.x,b.x)-radius));x<=Math.min(r.width-1,Math.ceil(Math.max(a.x,b.x)+radius));x++){
        const t=Math.max(0,Math.min(1,((x-a.x)*dx+(y-a.y)*dy)/(length*length))),px=lerp(a.x,b.x,t),py=lerp(a.y,b.y,t),d=Math.hypot(x-px,y-py),index=y*r.width+x;
        if(d>=radius||d>=distances[index])continue;distances[index]=d;
        const side=((x-px)*(-dy)+(y-py)*dx)/length*(r.name==='shire-waterways'?.72:1),sx=lerp(a.sx,b.sx,t)-sdy/sl*side,sy=lerp(a.sy,b.sy,t)+sdx/sl*side;
        const progress=i+t,taper=(stream.taperStart?Math.min(1,progress/12):1)*(stream.taperEnd?Math.min(1,(paired.length-1-progress)/12):1),alpha=Math.min(1,(radius-d)/2.5)*Math.max(0,taper);
        for(let c=0;c<3;c++)result[index*4+c]=Math.round(sample(sx,sy,c));result[index*4+3]=Math.round(alpha*255);
      }
    }
    const points=paired.filter((_,i)=>i%3===0||i===paired.length-1).map(p=>[+(p.x+r.left).toFixed(2),+(p.y+r.top).toFixed(2)]);
    if(stream.name!=='The Water')points.reverse();
    tracks.push({name:stream.name,points,confluence:stream.name==='The Water'||stream.name==='Withywindle'?'Baranduin':stream.name==='Adorn'?'Isen':null});
  }
  return {tracks,patch:await sharp(result,{raw:{width:r.width,height:r.height,channels:4}}).png().toBuffer()};
}

export async function repairTributaries(painting){
  let result=painting;const tracks=[];
  for(const r of tributaryRepairs){
    const registered=await registeredTributary(r),patch=registered.patch;tracks.push(...registered.tracks);
    await sharp(patch).webp({lossless:true}).toFile(`public/images/repairs/${r.name}.webp`);
    result=await sharp(result).composite([{input:patch,left:r.left,top:r.top}]).png().toBuffer();
  }
  await writeFile('public/images/atlas-masks/tributaries.json',JSON.stringify(tracks)+'\n');
  return result;
}
