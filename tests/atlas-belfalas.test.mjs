import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFile} from 'node:fs/promises';
import sharp from 'sharp';
import layout from '../lib/atlas/belfalas-layout.json' with {type:'json'};
import lamedon from '../lib/atlas/lamedon-layout.json' with {type:'json'};

await test('the southern extension preserves the previous painting and its coordinates',async()=>{
  const before=await sharp('public/images/atlas-anfalas.webp').ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const after=await sharp('public/images/atlas-belfalas.webp').ensureAlpha().raw().toBuffer({resolveWithObject:true});
  assert.equal(after.info.width,before.info.width);
  assert.equal(after.info.height,layout.worldHeight);
  let error=0,count=0;
  for(let y=0;y<before.info.height;y+=11)for(let x=0;x<before.info.width;x+=11){
    const p=(y*before.info.width+x)*4;
    assert.ok(after.data[p+3]>=before.data[p+3],'Previously painted land must not become a hole');
    if(before.data[p+3]===255)for(let c=0;c<3;c++){error+=Math.abs(before.data[p+c]-after.data[p+c]);count++;}
  }
  assert.ok(error/count<2,'Opaque earlier terrain must keep its appearance');
  for(const p of Object.values(layout.places))assert.equal(after.data[(p.y*after.info.width+p.x)*4+3],255);
});

await test('the two rivers meet above Edhellond and Dol Amroth bounds the haven to the south',()=>{
  const r=layout.rivers,p=layout.places;
  assert.deepEqual(r.morthond[0],lamedon.rivers.morthond.at(-1));
  assert.deepEqual(r.ringlo[0],lamedon.rivers.ringlo.at(-1));
  assert.deepEqual(r.morthond.at(-1),r.ringlo.at(-1));
  assert.deepEqual(r.estuary[0],r.morthond.at(-1));
  assert.ok(p.edhellond.y>r.estuary[0][1]&&p.edhellond.x<r.estuary[0][0]);
  assert.ok(p['dol-amroth'].y>p.edhellond.y&&p['cobas-haven'].y<p['dol-amroth'].y);
  assert.ok(p.belfalas.x>p['dol-amroth'].x&&layout.cape.y>p['dol-amroth'].y);
  assert.deepEqual(layout.road[0],lamedon.road.at(-1));
  assert.equal(layout.road.at(-1)[0],layout.x+layout.width);
});

await test('water keeps its old grid registration and both rivers reach the sea without a break',async()=>{
  const old=await sharp('public/images/atlas-masks/anfalas-water.png').greyscale().raw().toBuffer({resolveWithObject:true});
  const {data,info}=await sharp('public/images/atlas-masks/belfalas-water.png').greyscale().raw().toBuffer({resolveWithObject:true});
  assert.equal(info.width,old.info.width);assert.equal(info.height,layout.worldHeight/2);
  for(let i=0;i<old.data.length;i++)if(old.data[i])assert.equal(data[i],old.data[i]);
  const nearest=([x,y])=>{let best=-1,distance=Infinity;
    for(let dy=-12;dy<=12;dy++)for(let dx=-12;dx<=12;dx++){
      const gx=Math.floor(x/2)+dx,gy=Math.floor(y/2)+dy;if(gx<0||gy<0||gx>=info.width||gy>=info.height)continue;
      const i=gy*info.width+gx,d=dx*dx+dy*dy;if(data[i]>230&&d<distance){best=i;distance=d;}
    }return best;
  };
  const start=nearest(layout.rivers.morthond[0]);assert.ok(start>=0);
  const seen=new Uint8Array(data.length),queue=new Int32Array(data.length);let head=0,tail=0;seen[start]=1;queue[tail++]=start;
  while(head<tail){const i=queue[head++],x=i%info.width;
    for(const n of [x?i-1:-1,x<info.width-1?i+1:-1,i-info.width,i+info.width])if(n>=0&&n<data.length&&!seen[n]&&data[n]>230){seen[n]=1;queue[tail++]=n;}
  }
  for(const p of Object.values(layout.rivers).flat())assert.ok(seen[nearest(p)],`Disconnected river near ${p.join(',')}`);
  const haven=layout.places['cobas-haven'];assert.ok(seen[nearest([haven.x,haven.y])],'The estuary opens into the haven');
  for(const id of ['edhellond','dol-amroth','belfalas']){const p=layout.places[id];assert.equal(data[Math.floor(p.y/2)*info.width+Math.floor(p.x/2)],0,`${id} belongs on land`);}
});

await test('coastal waves extend south with no duplicated field cells or shifted original sea',async()=>{
  const old=JSON.parse(await readFile('public/images/atlas-masks/anfalas-shore-wave-field.json','utf8'));
  const next=JSON.parse(await readFile('public/images/atlas-masks/belfalas-shore-wave-field.json','utf8'));
  assert.deepEqual(next.cells.slice(0,old.cells.length),old.cells);
  assert.equal(new Set(next.cells.map(c=>`${c[0]},${c[1]}`)).size,next.cells.length);
  assert.ok(next.cells.some(([x,y])=>x>1800&&y>6500),'Surf reaches the Dol Amroth headland');
  assert.ok(next.cells.some(([x,y])=>x>2900&&y>7000),'Surf reaches southern Belfalas');
  const previous=await sharp('public/images/atlas-masks/anfalas-sea.png').greyscale().raw().toBuffer();
  const current=await sharp('public/images/atlas-masks/belfalas-sea.png').greyscale().raw().toBuffer();
  assert.deepEqual(current.subarray(0,previous.length),previous);
});
