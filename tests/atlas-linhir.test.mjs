import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFile} from 'node:fs/promises';
import sharp from 'sharp';
import layout from '../lib/atlas/linhir-layout.json' with {type:'json'};
import belfalas from '../lib/atlas/belfalas-layout.json' with {type:'json'};
import pelennor from '../lib/atlas/pelennor-layout.json' with {type:'json'};

await test('western Lebennin fills the eastern gap without shifting earlier terrain',async()=>{
  const before=await sharp('public/images/atlas-belfalas.webp').ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const after=await sharp('public/images/atlas-linhir.webp').ensureAlpha().raw().toBuffer({resolveWithObject:true});
  assert.deepEqual(after.info,before.info);
  assert.equal(after.info.width,layout.worldWidth);assert.equal(after.info.height,layout.worldHeight);
  let error=0,count=0;
  for(let y=0;y<before.info.height;y+=11)for(let x=0;x<before.info.width;x+=11){
    const p=(y*before.info.width+x)*4;
    assert.ok(after.data[p+3]>=before.data[p+3],'Painted terrain must not develop holes');
    if(before.data[p+3]===255)for(let c=0;c<3;c++){error+=Math.abs(before.data[p+c]-after.data[p+c]);count++;}
  }
  assert.ok(error/count<2,'Existing opaque terrain keeps its appearance');
  for(const p of Object.values(layout.places))assert.equal(after.data[(p.y*after.info.width+p.x)*4+3],255);
});

await test('Linhir is west of the combined river and downstream of the Gilrain–Serni junction',()=>{
  const r=layout.rivers,p=layout.places;
  assert.deepEqual(r.anduin[0],pelennor.anduin.at(-1));
  assert.equal(r.anduin.at(-1)[0],layout.x+layout.width);
  assert.deepEqual(r.gilrain.at(-1),r.serni.at(-1));
  assert.deepEqual(r.estuary[0],r.gilrain.at(-1));
  assert.ok(p.linhir.y>r.estuary[0][1]);assert.ok(p.linhir.x<r.estuary[0][0]);
  assert.ok(r.serni[0][0]>r.gilrain[0][0]);assert.ok(r.serni[0][0]>r.serni.at(-1)[0]);
  assert.ok(p['western-lebennin'].x>r.estuary[0][0]);
  assert.deepEqual(layout.road[0],belfalas.road.at(-1));
  assert.equal(layout.road.at(-1)[0],layout.x+layout.width);
  assert.ok(layout.road.at(-1)[1]>r.anduin.at(-1)[1],'The road stays west/south of Anduin');
});

await test('both small rivers reach the sea while Anduin continues separately to the eastern edge',async()=>{
  const old=await sharp('public/images/atlas-masks/belfalas-water.png').greyscale().raw().toBuffer({resolveWithObject:true});
  const {data,info}=await sharp('public/images/atlas-masks/linhir-water.png').greyscale().raw().toBuffer({resolveWithObject:true});
  assert.deepEqual(info,old.info);
  for(let i=0;i<old.data.length;i++)if(old.data[i])assert.equal(data[i],old.data[i]);
  const nearest=([x,y])=>{let best=-1,distance=Infinity;
    for(let dy=-12;dy<=12;dy++)for(let dx=-12;dx<=12;dx++){
      const gx=Math.floor(x/2)+dx,gy=Math.floor(y/2)+dy;if(gx<0||gy<0||gx>=info.width||gy>=info.height)continue;
      const i=gy*info.width+gx,d=dx*dx+dy*dy;if(data[i]>230&&d<distance){best=i;distance=d;}
    }return best;
  };
  const flood=p=>{
    const start=nearest(p);assert.ok(start>=0,`Missing water near ${p.join(',')}`);
    const seen=new Uint8Array(data.length),queue=new Int32Array(data.length);let head=0,tail=0;seen[start]=1;queue[tail++]=start;
    while(head<tail){const i=queue[head++],x=i%info.width;
      for(const n of [x?i-1:-1,x<info.width-1?i+1:-1,i-info.width,i+info.width])if(n>=0&&n<data.length&&!seen[n]&&data[n]>230){seen[n]=1;queue[tail++]=n;}
    }return seen;
  };
  const small=flood(layout.rivers.estuary[0]),lower=flood(layout.rivers.estuary[4]);
  // The painted crossing occludes the surface. Check the two visible reaches
  // meet immediately above and below it, without animating water over its deck.
  const {x:cx,y:cy}=layout.crossing;
  assert.ok(small[nearest([cx,cy-22])]);assert.ok(lower[nearest([cx,cy+22])]);
  for(const p of [...layout.rivers.gilrain,...layout.rivers.serni,...layout.rivers.estuary])assert.ok(small[nearest(p)]||lower[nearest(p)],`Disconnected small river near ${p.join(',')}`);
  assert.ok(lower[nearest([4550,7050])],'The combined river opens into the sea');
  const anduin=flood(layout.rivers.anduin[0]);
  for(const p of layout.rivers.anduin.slice(0,-2))assert.ok(anduin[nearest(p)],`Disconnected Anduin near ${p.join(',')}`);
  assert.equal(anduin[nearest(layout.rivers.estuary[0])],0,'These are separate drainage networks in this sheet');
  for(const id of ['linhir','western-lebennin']){const p=layout.places[id];assert.equal(data[Math.floor(p.y/2)*info.width+Math.floor(p.x/2)],0,`${id} belongs on land`);}
});

await test('the eastern coast shares the old shore field and preserves earlier sea coverage',async()=>{
  const old=JSON.parse(await readFile('public/images/atlas-masks/belfalas-shore-wave-field.json','utf8'));
  const next=JSON.parse(await readFile('public/images/atlas-masks/linhir-shore-wave-field.json','utf8'));
  assert.deepEqual(next.cells.slice(0,old.cells.length),old.cells);
  assert.equal(new Set(next.cells.map(c=>`${c[0]},${c[1]}`)).size,next.cells.length);
  assert.ok(next.cells.some(([x,y])=>x>4400&&y>6700),'Surf reaches the new eastern shore');
  const previous=await sharp('public/images/atlas-masks/belfalas-sea.png').greyscale().raw().toBuffer();
  const current=await sharp('public/images/atlas-masks/linhir-sea.png').greyscale().raw().toBuffer();
  assert.equal(current.length,previous.length);
  for(let i=0;i<previous.length;i++)if(previous[i])assert.equal(current[i],previous[i]);
});
