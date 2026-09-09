import assert from 'node:assert/strict';
import {test} from 'node:test';
import sharp from 'sharp';
import layout from '../lib/atlas/morannon-layout.json' with {type:'json'};
import {morannonAlpha} from '../scripts/extend-morannon.mjs';

const base=await sharp('public/images/atlas-harmonized.webp').ensureAlpha().raw().toBuffer({resolveWithObject:true});
const current=await sharp('public/images/atlas-morannon.webp').ensureAlpha().raw().toBuffer({resolveWithObject:true});
const pixel=(image,x,y)=>image.data.subarray((y*image.info.width+x)*4,(y*image.info.width+x)*4+4);

await test('the eastward extension preserves approved geography and the Anduin outlet',()=>{
  assert.equal(current.info.width,layout.worldWidth);assert.equal(current.info.height,layout.worldHeight);
  let error=0,count=0;
  for(let y=0;y<base.info.height;y+=5)for(let x=0;x<base.info.width;x+=5){
    const a=pixel(base,x,y),b=pixel(current,x,y);
    if(x<layout.x||y<layout.y||morannonAlpha(x-layout.x,y-layout.y)===0)assert.equal(a[3],b[3],'Existing paper edge must remain outside the extension');
    if(a[3]===255){assert.equal(b[3],255);for(let c=0;c<3;c++){error+=Math.abs(a[c]-b[c]);count++;}}
  }
  assert.ok(error/count<2,'Opaque original land and water must not be repainted or rescaled');
  for(const [x,y] of [[3909,3185],[3999,3294]]){
    assert.equal(morannonAlpha(x-layout.x,y-layout.y),0,'New terrain must not block the river at the southern map edge');
    const a=pixel(base,x,y),b=pixel(current,x,y);assert.equal(a[3],b[3]);
    assert.ok(a.slice(0,3).every((v,c)=>Math.abs(v-b[c])<8),'Preserve the unfinished river exit');
  }
});

await test('the enlarged water grid retains every earlier animation coordinate',async()=>{
  const old=await sharp('public/images/atlas-masks/expanded-water.png').greyscale().raw().toBuffer({resolveWithObject:true});
  const next=await sharp('public/images/atlas-masks/morannon-water.png').greyscale().raw().toBuffer({resolveWithObject:true});
  assert.equal(next.info.width*2,current.info.width);assert.equal(next.info.height*2,current.info.height);
  for(let y=0;y<old.info.height;y++){
    assert.deepEqual(next.data.subarray(y*next.info.width,y*next.info.width+old.info.width),old.data.subarray(y*old.info.width,(y+1)*old.info.width),'No stretching, reclassification or river motion drift');
  }
});

await test('the extension has continuous painted coverage and accessible lore landmarks',()=>{
  const {places}=layout,muil=places['emyn-muil'],marsh=places['dead-marshes'],plain=places.dagorlad,gate=places['black-gate'];
  assert.ok(muil.x<marsh.x&&muil.y<marsh.y,'The marshes lie southeast of eastern Emyn Muil');
  assert.ok(marsh.x<plain.x&&marsh.y<plain.y,'Dagorlad lies east/southeast of the Dead Marshes');
  assert.ok(plain.y<gate.y&&marsh.x<gate.x&&marsh.y<gate.y,'The Gate is south of Dagorlad and southeast of the marshes');
  assert.ok(marsh.x>4045&&marsh.y<3030,'Nindalf remains a distinct wetland southwest of the Dead Marshes');
  for(const p of Object.values(places))assert.equal(pixel(current,p.x,p.y)[3],255,'Every place pin must land on completed terrain');
  // Cross the former right-hand paper edge at several heights: no blank
  // strip or isolated new sheet between the hills and the eastern lowland.
  for(let y=2400;y<=2900;y+=100)for(let x=4220;x<=4650;x+=5)assert.ok(pixel(current,x,y)[3]>245,'A paper seam interrupts the joined terrain');
});
