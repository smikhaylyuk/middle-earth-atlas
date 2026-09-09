import assert from 'node:assert/strict';
import {test} from 'node:test';
import {rolldown} from 'rolldown';
import sharp from 'sharp';

async function load(file){
  const bundle=await rolldown({input:`lib/atlas/${file}.ts`});
  const {output}=await bundle.generate({format:'esm'});await bundle.close();
  return import('data:text/javascript;base64,'+Buffer.from(output[0].code).toString('base64'));
}
const {roadGuides,roadNodes}=await load('cartography');
const {motionMetrics,cycleProgress}=await load('motion');

await test('road annotations have joined endpoints from the Havens through Bree and the Fords to Edoras',()=>{
  const neighbours=new Map();
  for(const r of roadGuides){
    const numbers=r.path.match(/-?\d+(?:\.\d+)?/g).map(Number);
    for(const [point,node] of [[numbers.slice(0,2),r.from],[numbers.slice(-2),r.to]])assert.deepEqual([point[0]+(r.x??0),point[1]+(r.y??0)],[...roadNodes[node]],r.name);
    for(const [from,to]of [[r.from,r.to],[r.to,r.from]])neighbours.set(from,[...(neighbours.get(from)??[]),to]);
  }
  const seen=new Set(['havens']),queue=['havens'];
  for(const node of queue)for(const next of neighbours.get(node)??[])if(!seen.has(next)){seen.add(next);queue.push(next);}
  for(const node of ['hobbiton','bree','fordBruinen','tharbad','fordsIsen','isengard','edoras','southernEdge'])assert.ok(seen.has(node),`${node} is disconnected`);
});

await test('birds remain visible at overview and motion loops do not stall at negative offsets',()=>{
  for(const scale of [.09,.15,.4,.8]){
    const m=motionMetrics(scale,'subtle');assert.ok(m.birdWidth*scale>=12.9);
  }
  for(const t of [-100,-1,0,1,64,129])assert.ok(cycleProgress(t,64,-12)>=0&&cycleProgress(t,64,-12)<1);
  assert.equal(cycleProgress(2,64,12),cycleProgress(66,64,12));
  assert.notEqual(cycleProgress(0,64),cycleProgress(2,64));
});

await test('the new Limlight and Glanduin are continuous painted channels through the corrected areas',async()=>{
  for(const r of [
    {name:'Limlight',left:2670,top:1750,width:650,height:170,start:[25,95],end:[542,85]},
    {name:'Glanduin',left:1470,top:1150,width:460,height:240,start:[29,34],end:[356,169]},
  ]){
    const {data}=await sharp('public/images/atlas-cartographic.webp').extract(r).ensureAlpha().raw().toBuffer({resolveWithObject:true});
    const grid=Buffer.alloc(r.width*r.height);
    for(let i=0;i<grid.length;i++){const p=i*4;if(data[p+1]>data[p]&&data[p+2]>=data[p]-3)grid[i]=255;}
    const mask=await sharp(grid,{raw:{width:r.width,height:r.height,channels:1}}).toColourspace('b-w').raw().toBuffer();
    const start=r.start[1]*r.width+r.start[0],end=r.end[1]*r.width+r.end[0],seen=new Set([start]),queue=[start];
    for(let j=0;j<queue.length;j++){
      const i=queue[j],x=i%r.width,y=Math.floor(i/r.width);
      for(const n of [x?i-1:-1,x<r.width-1?i+1:-1,y?i-r.width:-1,y<r.height-1?i+r.width:-1])if(n>=0&&mask[n]&&!seen.has(n)){seen.add(n);queue.push(n);}
    }
    assert.ok(seen.has(end),`${r.name} has a break between its river and confluence`);
  }
});
