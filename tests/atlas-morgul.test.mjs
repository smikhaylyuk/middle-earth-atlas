import assert from 'node:assert/strict';
import {test} from 'node:test';
import sharp from 'sharp';
import layout from '../lib/atlas/morgul-layout.json' with {type:'json'};
import pelennor from '../lib/atlas/pelennor-layout.json' with {type:'json'};
import {morgulRepairAlpha,junctionRepairAlpha} from '../scripts/extend-morgul.mjs';
const base=await sharp('public/images/atlas-pelennor.webp').ensureAlpha().raw().toBuffer({resolveWithObject:true});
const current=await sharp('public/images/atlas-morgul.webp').ensureAlpha().raw().toBuffer({resolveWithObject:true});
const pixel=(image,x,y)=>image.data.subarray((y*image.info.width+x)*4,(y*image.info.width+x)*4+4);

await test('Morgul Vale fills the eastern gap without enlarging or shifting the atlas',()=>{
  assert.equal(current.info.width,base.info.width);assert.equal(current.info.height,base.info.height);
  let error=0,count=0;
  for(let y=0;y<base.info.height;y+=7)for(let x=0;x<base.info.width;x+=7){
    const a=pixel(base,x,y),b=pixel(current,x,y);
    if(a[3]===255&&morgulRepairAlpha(x,y)===0&&junctionRepairAlpha(x,y)===0){
      assert.equal(b[3],255);for(let c=0;c<3;c++){error+=Math.abs(a[c]-b[c]);count++;}
    }
  }
  assert.ok(error/count<2,'Earlier opaque terrain outside the bounded connection must stay registered');
  for(const p of [...Object.values(layout.places),...Object.values(pelennor.places)])assert.equal(pixel(current,p.x,p.y)[3],255,'A destination must lie on completed artwork');
  assert.equal(pixel(base,5740,4800)[3],0);assert.equal(pixel(current,5740,4800)[3],255,'The former eastern gap must now be filled');
});

await test('Morgul expansion preserves every previously mapped water sample',async()=>{
  const old=await sharp('public/images/atlas-masks/pelennor-water.png').greyscale().raw().toBuffer({resolveWithObject:true});
  const next=await sharp('public/images/atlas-masks/morgul-water.png').greyscale().raw().toBuffer({resolveWithObject:true});
  assert.equal(next.info.width,old.info.width);assert.equal(next.info.height,old.info.height);
  for(let i=0;i<old.data.length;i++){
    if(old.data[i])assert.equal(next.data[i],old.data[i]);
    const x=(i%old.info.width)*2,y=Math.floor(i/old.info.width)*2;
    if(x<layout.x||y<layout.y||x>=layout.x+layout.width||y>=layout.y+layout.height)assert.equal(next.data[i],old.data[i]);
  }
});

await test('the city, northern stairs and eastern tower follow the published relationships',()=>{
  const cross=layout.places['cross-roads'],city=layout.places['minas-morgul'],stairs=layout.places['morgul-stairs'],tower=layout.places['cirith-ungol'];
  assert.ok(cross.x>pelennor.places.osgiliath.x&&city.x>cross.x);
  assert.ok(stairs.y<city.y&&tower.y<city.y,'The narrow pass belongs north of the Morgul Vale');
  assert.ok(tower.x>stairs.x&&tower.x>city.x,'Cirith Ungol’s fortress belongs on the eastern side of the ridge');
  assert.ok(layout.morgulduin.at(-1)[1]>pelennor.places.osgiliath.y,'The tributary joins downstream of Osgiliath');
});

await test('Morgulduin reaches join the Anduin while bridges and tree cover stay still',async()=>{
  const {data,info}=await sharp('public/images/atlas-masks/morgul-water.png').greyscale().raw().toBuffer({resolveWithObject:true});
  const at=(x,y)=>Math.floor(y/2)*info.width+Math.floor(x/2);
  // Visible reaches are separated by the stone bridge and an overhanging
  // canopy. Neither is a gap in the geography or a surface to animate.
  for(const [seed,targets] of [
    [[4731,4800],[[4760,4770],[4840,4726],[4880,4720]]],
    [[5200,4650],layout.morgulduin.filter(([x])=>x>=5120&&x<=5540)],
    [[4960,4701],[[4980,4700]]],
  ]){
    const seen=new Uint8Array(data.length),queue=[at(...seed)];seen[queue[0]]=1;
    assert.equal(data[queue[0]],255,'Visible reach must start on water');
    for(let j=0;j<queue.length;j++){
      const i=queue[j],x=i%info.width,y=Math.floor(i/info.width);
      if(x<2300||x>2820||y<2200||y>2460)continue;
      for(const n of [i-1,i+1,i-info.width,i+info.width])if(n>=0&&n<data.length&&!seen[n]&&data[n]>230){seen[n]=1;queue.push(n);}
    }
    for(const p of targets)assert.equal(seen[at(...p)],1,`Visible stream has a break at ${p.join(',')}`);
  }
  for(const id of ['minas-morgul','cirith-ungol']){
    const p=layout.places[id];assert.equal(data[at(p.x,p.y)],0,'Stone architecture must not shimmer as water');
  }
  assert.equal(data[at(5008,4699)],0,'The bridge deck must not animate');
  assert.equal(data[at(4922,4715)],0,'Overhanging trees must not animate as water');
});
