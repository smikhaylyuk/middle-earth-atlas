import assert from 'node:assert/strict';
import {test} from 'node:test';
import sharp from 'sharp';
import {styleArea,styleEnvelope,styleProtection} from '../scripts/harmonize-atlas.mjs';

const before=await sharp('public/images/atlas-expanded.webp').ensureAlpha().raw().toBuffer({resolveWithObject:true});
const after=await sharp('public/images/atlas-harmonized.webp').ensureAlpha().raw().toBuffer({resolveWithObject:true});
const protection=await styleProtection();
const difference=(x,y,c)=>after.data[(y*after.info.width+x)*4+c]-before.data[(y*before.info.width+x)*4+c];

await test('the displayed painting retains its world registration and exact coverage',()=>{
  assert.equal(after.info.width,before.info.width);assert.equal(after.info.height,before.info.height);
  for(let i=3;i<before.data.length;i+=4)assert.equal(after.data[i],before.data[i],'The atlas outline and region joins must not move');
});

await test('water, banks, road corridors and landmark anchors retain the registered painting',()=>{
  let error=0,n=0,large=0;
  for(let y=0;y<styleArea.height;y+=2)for(let x=0;x<styleArea.width;x+=2){
    const d=protection.distance[(y/2)*protection.width+x/2];
    if(d>5)continue;
    for(let c=0;c<3;c++){const e=Math.abs(difference(x,y,c));error+=e;n++;if(e>8)large++;}
  }
  assert.ok(n>500000,'Exercise the full protected network, not isolated samples');
  assert.ok(error/n<2,'Only WebP re-encoding error is allowed inside protected features');
  assert.ok(large/n<.002,'No broad repaint may leak into water, roads or towns');
});

await test('newer regions are preserved and the style change fades before their boundaries',()=>{
  let error=0,n=0;
  for(let y=0;y<after.info.height;y+=3)for(let x=0;x<after.info.width;x+=3){
    if(x<styleArea.width&&y<styleArea.height)continue;
    const i=(y*after.info.width+x)*4;if(before.data[i+3]<250)continue;
    for(let c=0;c<3;c++){error+=Math.abs(difference(x,y,c));n++;}
  }
  assert.ok(error/n<2,'Do not recolour Rohan, Lórien, the Brown Lands or Rauros');
  assert.equal(styleEnvelope(2500,1000),0);assert.equal(styleEnvelope(1000,1940),0);
  assert.ok(styleEnvelope(2490,1000)<.003&&styleEnvelope(1000,1930)<.004,'No rectangular edge at a former sheet boundary');
});

await test('safe Eriador land gets a restrained palette lift without losing its relief',async()=>{
  const softBefore=await sharp(before.data,{raw:before.info}).blur(1.1).raw().toBuffer();
  const softAfter=await sharp(after.data,{raw:after.info}).blur(1.1).raw().toBuffer();
  let n=0,lift=0,ochreBefore=0,ochreAfter=0,grainBefore=0,grainAfter=0;
  for(let y=100;y<1600;y+=2)for(let x=100;x<2100;x+=2){
    if(protection.distance[(y/2)*protection.width+x/2]<30)continue;
    const i=(y*before.info.width+x)*4,r=before.data[i],g=before.data[i+1],b=before.data[i+2];
    if(r<75||r>190||r<=g||g<b+16)continue;
    n++;lift+=difference(x,y,1);ochreBefore+=r-g;ochreAfter+=after.data[i]-after.data[i+1];
    grainBefore+=Math.abs(g-softBefore[i+1]);grainAfter+=Math.abs(after.data[i+1]-softAfter[i+1]);
  }
  assert.ok(n>10000);assert.ok(lift/n>18&&lift/n<38,'Lift muddy midtones without bleaching the land');
  assert.ok(ochreAfter/ochreBefore<.8,'The brown cast should move toward olive/sage');
  assert.ok(grainAfter/grainBefore>.5&&grainAfter/grainBefore<.92,'Soften fine etched grain while retaining readable relief');
});
