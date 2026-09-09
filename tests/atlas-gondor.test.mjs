import assert from 'node:assert/strict';
import {test} from 'node:test';
import sharp from 'sharp';
import layout from '../lib/atlas/gondor-layout.json' with {type:'json'};
import {gondorAlpha} from '../scripts/extend-gondor.mjs';

const base=await sharp('public/images/atlas-mordor.webp').ensureAlpha().raw().toBuffer({resolveWithObject:true});
const current=await sharp('public/images/atlas-gondor.webp').ensureAlpha().raw().toBuffer({resolveWithObject:true});
const pixel=(image,x,y)=>image.data.subarray((y*image.info.width+x)*4,(y*image.info.width+x)*4+4);

await test('northern Gondor preserves approved terrain and joins the old Anduin outlet',()=>{
  assert.equal(current.info.width,layout.worldWidth);assert.equal(current.info.height,layout.worldHeight);
  let error=0,count=0;
  for(let y=0;y<base.info.height;y+=5)for(let x=0;x<base.info.width;x+=5){
    const a=pixel(base,x,y),b=pixel(current,x,y);
    if(x<layout.x||y<layout.y||gondorAlpha(x-layout.x,y-layout.y)===0)assert.equal(a[3],b[3]);
    if(a[3]===255){assert.equal(b[3],255);for(let c=0;c<3;c++){error+=Math.abs(a[c]-b[c]);count++;}}
  }
  assert.ok(error/count<2,'Existing opaque artwork must not be repainted or rescaled');
  for(const points of layout.anduin)for(const [x,y] of points.filter(p=>p[1]<layout.worldHeight-110))assert.equal(pixel(current,x,y)[3],255,'No paper gap in the Anduin corridor');
});

await test('new water coverage preserves every earlier completed channel and land pixel',async()=>{
  const old=await sharp('public/images/atlas-masks/mordor-water.png').greyscale().raw().toBuffer({resolveWithObject:true});
  const next=await sharp('public/images/atlas-masks/gondor-water.png').greyscale().raw().toBuffer({resolveWithObject:true});
  assert.equal(next.info.width*2,current.info.width);assert.equal(next.info.height*2,current.info.height);
  for(let y=0;y<old.info.height;y++)for(let x=0;x<old.info.width;x++){
    const prior=old.data[y*old.info.width+x],alpha=pixel(base,x*2,y*2)[3];
    if(prior||alpha===255)assert.equal(next.data[y*next.info.width+x],prior,'An earlier water coordinate changed');
  }
});

await test('northern Gondor landmarks follow the published river-bank relationships',()=>{
  const {places}=layout,island=places['cair-andros'],refuge=places['henneth-annun'],wood=places['druadan-forest'],beacon=places['amon-din'];
  assert.ok(refuge.x>island.x&&refuge.y<island.y,'Henneth Annûn must lie northeast of Cair Andros');
  assert.ok(wood.x<island.x&&wood.y>island.y,'Drúadan Forest belongs on the western side, south of Cair Andros');
  assert.ok(beacon.x>wood.x&&beacon.x<island.x,'Amon Dîn lies east of the woods, still west of Anduin');
  for(const p of Object.values(places))assert.equal(pixel(current,p.x,p.y)[3],255,'Every place pin must reach completed terrain');
});

await test('Anduin water connects the old outlet, both island arms and the southern edge',async()=>{
  const {data,info}=await sharp('public/images/atlas-masks/gondor-water.png').greyscale().raw().toBuffer({resolveWithObject:true});
  const at=(x,y)=>Math.floor(y/2)*info.width+Math.floor(x/2);
  const seed=at(3909,3185),seen=new Uint8Array(data.length),queue=[seed];seen[seed]=1;
  assert.equal(data[seed],255,'The previous outlet must stay wet');
  for(let j=0;j<queue.length;j++){
    const i=queue[j],x=i%info.width,y=Math.floor(i/info.width);
    for(const n of [i-1,i+1,i-info.width,i+info.width]){
      if(x<1850||x>2340||y<1560||y>2210||n<0||n>=data.length||seen[n]||data[n]<230)continue;
      seen[n]=1;queue.push(n);
    }
  }
  for(const [x,y] of [[4163,3750],[4360,3800],[4326,3950],[4495,4350]])assert.equal(seen[at(x,y)],1,`Broken channel at ${x},${y}`);
  const island=layout.places['cair-andros'];
  assert.equal(data[at(island.x,island.y)],0,'The wooded island must remain dry');
});
