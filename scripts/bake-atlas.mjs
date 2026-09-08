// Precompose the paintings and reviewed local geography corrections.
import sharp from 'sharp';
import { readFile, mkdir } from 'node:fs/promises';
import { repairAtlasJoins } from './repair-atlas-joins.mjs';
import { repairAtlasGeography, makeSeaMask, makeWaterMask } from './repair-atlas-geography.mjs';
const width=3700,height=2800;
const svg=(w,h,body)=>Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">${body}</svg>`);
const gradient=(id,x1,y1,x2,y2,stops)=>`<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops.map(([offset,opacity])=>`<stop offset="${offset}" stop-color="white" stop-opacity="${opacity}"/>`).join('')}</linearGradient>`;
const fade=(w,h,axis,stops)=>svg(w,h,`<defs>${gradient('g',0,0,axis==='x'?w:0,axis==='y'?h:0,stops)}</defs><rect width="100%" height="100%" fill="url(#g)"/>`);
const transparent=(w,h)=>sharp({create:{width:w,height:h,channels:4,background:'#00000000'}});
const intersect=async (a,b)=>sharp(a).composite([{input:b,blend:'dest-in'}]).png().toBuffer();
const masks={
  rohan:await sharp(svg(3700,1000,`<defs><filter id="f" filterUnits="userSpaceOnUse" x="-100" y="-100" width="3900" height="1200"><feGaussianBlur stdDeviation="14"/></filter></defs><path fill="white" filter="url(#f)" d="M-100 -100H3800V780H3510L3130 900L3020 1100H-100Z"/>`)).png().toBuffer(),
  anduin:await sharp(fade(1500,1940,'y',[[0,1],[1800/1940,1],[1,0]])).png().toBuffer(),
  // Use the full existing 140-unit overlap with Rohan. Neither painting moves,
  // and the fade still ends at the approved geographic crop at y=1940.
  south:await intersect(fade(2500,1140,'x',[[0,1],[.9,1],[.952,0],[1,0]]),fade(2500,1140,'y',[[0,1],[1000/1140,1],[1,0]])),
  east:await intersect(fade(1500,1000,'x',[[0,1],[.88,1],[1,0]]),fade(1500,1000,'y',[[0,1],[.86,1],[1,0]])),
  west:await intersect(svg(1500,1000,`<defs><filter id="f" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="12"/></filter></defs><path fill="white" filter="url(#f)" d="M-100 -100H1150L1170 450L1190 520L1310 660L1445 900L1490 1100H-100Z"/>`),fade(1500,1000,'y',[[0,1],[.86,1],[1,0]])),
};
const whole=await intersect(fade(width,height,'x',[[0,0],[.04,1],[.96,1],[1,0]]),fade(width,height,'y',[[0,0],[.05,1],[.98,1],[1,0]]));
const resized=async (file,w,h)=>sharp(await readFile(`public/images/${file}`)).resize(w,h,{fit:'fill'}).ensureAlpha().png().toBuffer();
const rohan=await resized('rohan-painted.jpg',3420,1300);
const sea=await sharp(rohan).extract({left:0,top:0,width:330,height:1000}).png().toBuffer();
const rohanMain=await intersect(await sharp(rohan).extract({left:0,top:0,width:3420,height:1000}).png().toBuffer(),fade(3420,1000,'x',[[0,0],[35/3420,1],[1,1]]));
const rohanPaint=await transparent(3700,1000).composite([{input:sea,left:0,top:0},{input:rohanMain,left:280,top:0}]).png().toBuffer();
let east=await resized('eriador-painted.jpg',1500,1000);
const correction=await resized('eriador-ford-correction.jpg',1500,1000);
for(const p of [{x:1001,y:573,w:80,h:69},{x:1097,y:504,w:47,h:48}]){
  const left=Math.round(p.x*1500/1536),top=Math.round(p.y*1000/1024),w=Math.round(p.w*1500/1536),h=Math.round(p.h*1000/1024);
  const patch=await sharp(correction).extract({left,top,width:w,height:h}).png().toBuffer();
  const edge=await intersect(fade(w,h,'x',[[0,0],[4/w,1],[1-4/w,1],[1,0]]),fade(w,h,'y',[[0,0],[4/h,1],[1-4/h,1],[1,0]]));
  east=await sharp(east).composite([{input:await intersect(patch,edge),left,top}]).png().toBuffer();
}
const sheets=[
  {id:'rohan',x:0,y:1800,w:3700,h:1000,paint:rohanPaint},
  {id:'anduin',x:2200,y:0,w:1500,h:1940,paint:await sharp(await resized('anduin-painted.jpg',1500,2350)).extract({left:0,top:0,width:1500,height:1940}).png().toBuffer()},
  {id:'south',x:0,y:800,w:2500,h:1140,paint:await sharp(await resized('eriador-south.jpg',2500,1300)).extract({left:0,top:0,width:2500,height:1140}).png().toBuffer()},
  {id:'east',x:1000,y:0,w:1500,h:1000,paint:east},
  {id:'west',x:0,y:0,w:1500,h:1000,paint:await resized('eriador-west.jpg',1500,1000)},
];
let painting=await transparent(width,height).png().toBuffer();
for(const s of sheets)painting=await sharp(painting).composite([{input:await intersect(s.paint,masks[s.id]),left:s.x,top:s.y}]).png().toBuffer();
await mkdir('public/images/atlas-masks',{recursive:true});
await sharp(await repairAtlasJoins(await intersect(painting,whole))).webp({quality:94,alphaQuality:100,effort:6}).toFile('public/images/atlas-continuous.webp');
const cartography=await repairAtlasGeography(await readFile('public/images/atlas-continuous.webp'));
await sharp(cartography).webp({quality:94,alphaQuality:100,effort:6}).toFile('public/images/atlas-cartographic.webp');
await sharp(await makeSeaMask(cartography)).png().toFile('public/images/atlas-masks/sea.png');
await sharp(await makeWaterMask(cartography)).png().toFile('public/images/atlas-masks/water.png');
// Each atmosphere layer gets only the portion visible above later paintings.
let cover=await transparent(width,height).png().toBuffer();
for(const s of [...sheets].reverse()){
  const mask=await transparent(width,height).composite([{input:masks[s.id],left:s.x,top:s.y}]).png().toBuffer();
  const uncovered=await sharp(mask).composite([{input:cover,blend:'dest-out'}]).png().toBuffer();
  await sharp(await intersect(uncovered,whole)).extract({left:s.x,top:s.y,width:s.w,height:s.h}).png().toFile(`public/images/atlas-masks/${s.id}.png`);
  cover=await sharp(cover).composite([{input:mask}]).png().toBuffer();
}
console.log('Baked 3700 × 2800 atlas and five atmosphere masks from the existing paintings.');
