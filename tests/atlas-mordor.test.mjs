import assert from 'node:assert/strict';
import {test} from 'node:test';
import sharp from 'sharp';
import layout from '../lib/atlas/mordor-layout.json' with {type:'json'};
import morannon from '../lib/atlas/morannon-layout.json' with {type:'json'};
import {mordorAlpha} from '../scripts/extend-mordor.mjs';

const base=await sharp('public/images/atlas-morannon.webp').ensureAlpha().raw().toBuffer({resolveWithObject:true});
const current=await sharp('public/images/atlas-mordor.webp').ensureAlpha().raw().toBuffer({resolveWithObject:true});
const pixel=(image,x,y)=>image.data.subarray((y*image.info.width+x)*4,(y*image.info.width+x)*4+4);

await test('Mordor preserves the approved atlas, Black Gate and open river outlet',()=>{
  assert.equal(current.info.width,layout.worldWidth);assert.equal(current.info.height,layout.worldHeight);
  let error=0,count=0;
  for(let y=0;y<base.info.height;y+=5)for(let x=0;x<base.info.width;x+=5){
    const a=pixel(base,x,y),b=pixel(current,x,y);
    if(x<layout.x||y<layout.y||mordorAlpha(x-layout.x,y-layout.y)===0)assert.equal(a[3],b[3],'Only the joining region may change alpha');
    if(a[3]===255){assert.equal(b[3],255);for(let c=0;c<3;c++){error+=Math.abs(a[c]-b[c]);count++;}}
  }
  assert.ok(error/count<2,'Previous opaque geography must not be repainted or rescaled');
  for(const [x,y] of [[5025,3070],[3909,3185],[3999,3294]]){
    const a=pixel(base,x,y),b=pixel(current,x,y);assert.equal(a[3],b[3]);
    assert.ok(a.slice(0,3).every((v,c)=>Math.abs(v-b[c])<8),'Keep the Gate and existing Anduin outlet intact');
  }
});

await test('Mordor adds no false water and does not stretch river animation coverage',async()=>{
  const old=await sharp('public/images/atlas-masks/morannon-water.png').greyscale().raw().toBuffer({resolveWithObject:true});
  const next=await sharp('public/images/atlas-masks/mordor-water.png').greyscale().raw().toBuffer({resolveWithObject:true});
  assert.equal(next.info.width*2,current.info.width);assert.equal(next.info.height*2,current.info.height);
  for(let y=0;y<next.info.height;y++){
    const row=next.data.subarray(y*next.info.width,(y+1)*next.info.width);
    if(y<old.info.height){
      assert.deepEqual(row.subarray(0,old.info.width),old.data.subarray(y*old.info.width,(y+1)*old.info.width));
      assert.ok(row.subarray(old.info.width).every(v=>v===0));
    }else assert.ok(row.every(v=>v===0));
  }
});

await test('Udûn connects south to Gorgoroth and its landmarks follow the published map',()=>{
  const {udun,isenmouthe,'mount-doom':doom,'barad-dur':tower}=layout.places,gate=morannon.places['black-gate'];
  assert.ok(gate.y<udun.y&&udun.y<isenmouthe.y&&isenmouthe.y<doom.y,'Gate → Udûn → Isenmouthe → Gorgoroth must run southward');
  assert.ok(doom.x>isenmouthe.x&&tower.x>doom.x,'Mount Doom lies southeast of the pass; Barad-dûr lies east of Mount Doom');
  assert.ok(tower.y<=doom.y+40&&Math.abs(tower.y-doom.y)<150,'The Dark Tower and volcano occupy the northern plateau at similar latitude');
  for(const p of Object.values(layout.places))assert.equal(pixel(current,p.x,p.y)[3],255,'Place cards must point to completed terrain');
  for(let x=4930;x<=5380;x+=30)for(let y=3350;y<=3650;y+=10)assert.ok(pixel(current,x,y)[3]>245,'A paper gap interrupts the basin connection');
});
