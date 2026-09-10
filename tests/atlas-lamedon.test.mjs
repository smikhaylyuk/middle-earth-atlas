import assert from 'node:assert/strict';
import {test} from 'node:test';
import sharp from 'sharp';
import layout from '../lib/atlas/lamedon-layout.json' with {type:'json'};
const base=await sharp('public/images/atlas-morgul.webp').ensureAlpha().raw().toBuffer({resolveWithObject:true});
const current=await sharp('public/images/atlas-lamedon.webp').ensureAlpha().raw().toBuffer({resolveWithObject:true});
const pixel=(image,x,y)=>image.data.subarray((y*image.info.width+x)*4,(y*image.info.width+x)*4+4);
await test('Lamedon fills the southern mountain valleys without moving old terrain or growing the atlas',()=>{
  assert.equal(current.info.width,base.info.width);assert.equal(current.info.height,base.info.height);
  let error=0,count=0;
  for(let y=0;y<base.info.height;y+=7)for(let x=0;x<base.info.width;x+=7){
    const a=pixel(base,x,y),b=pixel(current,x,y);
    if(a[3]===255){assert.equal(b[3],255);for(let c=0;c<3;c++){error+=Math.abs(a[c]-b[c]);count++;}}
    assert.ok(b[3]>=a[3],'New painting must never punch holes into the old terrain');
  }
  assert.ok(error/count<2,'Opaque earlier paintings must retain their registration and palette');
  for(const p of Object.values(layout.places))assert.equal(pixel(current,p.x,p.y)[3],255,'Destinations must sit on complete artwork');
  assert.equal(pixel(base,2700,4100)[3],0);assert.equal(pixel(current,2700,4100)[3],255);
  for(const [x,y] of [[2674,2800],[2964,3500],[3150,4450]])assert.equal(pixel(current,x,y)[3],255,'Former mountain fades must become solid joins');
});
await test('Lamedon retains all previous water and adds flow only inside its bounds',async()=>{
  const old=await sharp('public/images/atlas-masks/morgul-water.png').greyscale().raw().toBuffer({resolveWithObject:true});
  const next=await sharp('public/images/atlas-masks/lamedon-water.png').greyscale().raw().toBuffer({resolveWithObject:true});
  assert.deepEqual([next.info.width,next.info.height],[old.info.width,old.info.height]);
  let added=0;
  for(let i=0;i<old.data.length;i++){
    if(old.data[i])assert.equal(next.data[i],old.data[i]);
    if(next.data[i]&&!old.data[i]){added++;const x=i%old.info.width*2,y=Math.floor(i/old.info.width)*2;assert.ok(x>=layout.x&&x<layout.x+layout.width&&y>=layout.y&&y<layout.y+layout.height);}
  }
  assert.ok(added>10000,'The new valleys need real surface coverage');
  const at=p=>next.data[Math.floor(p.y/2)*next.info.width+Math.floor(p.x/2)];
  for(const id of ['erech','calembel','ethring'])assert.equal(at(layout.places[id]),0,'Stone landmarks and bridge decks must stay still');
});
await test('Erech, the pass, town and river crossing retain the published geographic relationships',()=>{
  const {erech,'tarlangs-neck':pass,calembel,ethring}=layout.places;
  assert.ok(erech.y>2657&&erech.x<calembel.x,'Erech belongs south of Dunharrow and west of Calembel');
  assert.ok(pass.x>erech.x&&pass.x<calembel.x&&pass.y>erech.y&&pass.y<calembel.y);
  assert.ok(ethring.x>calembel.x&&ethring.y>calembel.y);
  assert.deepEqual(layout.rivers.ciril.at(-1),layout.rivers.ringlo.find(p=>p[0]===layout.rivers.ciril.at(-1)[0]&&p[1]===layout.rivers.ciril.at(-1)[1]),'Ciril must join Ringló');
  for(const key of ['morthond','ringlo'])assert.equal(layout.rivers[key].at(-1)[1],layout.worldHeight,'Unfinished downstream reaches continue beyond the map');
  assert.ok(layout.rivers.morthond.at(-1)[0]<layout.rivers.ringlo.at(-1)[0],'Morthond stays west of Ringló until their later confluence');
});
await test('the visible Morthond and joined Ciril–Ringló reaches are continuous through the new valleys',async()=>{
  const {data,info}=await sharp('public/images/atlas-masks/lamedon-water.png').greyscale().raw().toBuffer({resolveWithObject:true});
  const nearest=([x,y])=>{let best=-1,distance=Infinity;for(let dy=-8;dy<=8;dy++)for(let dx=-8;dx<=8;dx++){
    const i=(Math.floor(y/2)+dy)*info.width+Math.floor(x/2)+dx,d=dx*dx+dy*dy;
    if(data[i]>230&&d<distance){distance=d;best=i;}
  }return best;};
  for(const points of [
    [layout.rivers.morthond[3],layout.rivers.morthond[14],[2328,4380],layout.rivers.morthond[27],layout.rivers.morthond[35]],
    [...layout.rivers.ciril.slice(17),...layout.rivers.ringlo.slice(11,-2)],
    layout.rivers.ringlo.slice(1,3),
  ]){
    const start=nearest(points[0]);assert.ok(start>=0);
    const seen=new Set([start]),queue=[start];
    for(let j=0;j<queue.length;j++)for(const n of [queue[j]-1,queue[j]+1,queue[j]-info.width,queue[j]+info.width])if(n>=0&&n<data.length&&data[n]>230&&!seen.has(n)){seen.add(n);queue.push(n);}
    for(const p of points)assert.ok(seen.has(nearest(p)),`A visible river reach is disconnected near ${p.join(',')}`);
  }
});
