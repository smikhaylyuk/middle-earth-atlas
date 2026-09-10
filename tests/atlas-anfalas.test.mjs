import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFile} from 'node:fs/promises';
import sharp from 'sharp';
import layout from '../lib/atlas/anfalas-layout.json' with {type:'json'};
import lamedon from '../lib/atlas/lamedon-layout.json' with {type:'json'};

await test('the western coast fills open terrain without moving established geography or enlarging the canvas',async()=>{
  const before=await sharp('public/images/atlas-lamedon.webp').ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const after=await sharp('public/images/atlas-anfalas.webp').ensureAlpha().raw().toBuffer({resolveWithObject:true});
  assert.deepEqual([after.info.width,after.info.height],[before.info.width,before.info.height]);
  let error=0,count=0;
  for(let y=0;y<before.info.height;y+=9)for(let x=0;x<before.info.width;x+=9){
    const p=(y*before.info.width+x)*4;
    assert.ok(after.data[p+3]>=before.data[p+3],'No holes may be cut in established terrain');
    if(before.data[p+3]===255)for(let c=0;c<3;c++){error+=Math.abs(before.data[p+c]-after.data[p+c]);count++;}
  }
  assert.ok(error/count<2,'The opaque previous painting retains its palette and registration');
  for(const {x,y} of Object.values(layout.places))assert.equal(after.data[(y*after.info.width+x)*4+3],255);
  assert.equal(before.data[(3600*before.info.width+850)*4+3],0);
  assert.equal(after.data[(3600*after.info.width+850)*4+3],255);
  // Former paper tint must not survive as a pale horizontal ocean band.
  for(const y of [2760,2770,2780]){
    let red=0,green=0,samples=0;
    for(let x=250;x<900;x+=10){const p=(y*after.info.width+x)*4;red+=after.data[p];green+=after.data[p+1];samples++;}
    assert.ok(red/samples<80&&green/samples<115,'The ocean band must stay slate, allowing isolated foam and rocks');
  }
});

await test('new regional locations respect the published western Gondor relationships',()=>{
  const p=layout.places;
  assert.ok(p['druwaith-iaur'].x<p.lefnui.x&&p['druwaith-iaur'].y<p.anfalas.y);
  assert.ok(p['pinnath-gelin'].x>layout.lefnui.at(-1)[0]);
  assert.ok(p['pinnath-gelin'].y<p.anfalas.y,'Green hills stand north of the coast');
  assert.ok(p.anfalas.x<lamedon.rivers.morthond.at(-1)[0],'Anfalas belongs west of Morthond');
  assert.ok(layout.cape.x<layout.lefnui.at(-1)[0]&&layout.cape.y>p['druwaith-iaur'].y);
  assert.ok(layout.lefnui[0][0]>layout.lefnui.at(-1)[0]&&layout.lefnui[0][1]<layout.lefnui.at(-1)[1],'Lefnui drains southwest');
});

await test('Lefnui connects to the sea and previous water coverage remains intact',async()=>{
  const old=await sharp('public/images/atlas-masks/lamedon-water.png').greyscale().raw().toBuffer();
  const {data,info}=await sharp('public/images/atlas-masks/anfalas-water.png').greyscale().raw().toBuffer({resolveWithObject:true});
  assert.equal(data.length,old.length);
  for(let i=0;i<old.length;i++)if(old[i])assert.equal(data[i],old[i]);
  const nearest=([x,y])=>{let best=-1,distance=Infinity;
    for(let dy=-10;dy<=10;dy++)for(let dx=-10;dx<=10;dx++){
      const gx=Math.floor(x/2)+dx,gy=Math.floor(y/2)+dy;if(gx<0||gy<0||gx>=info.width||gy>=info.height)continue;
      const i=gy*info.width+gx,d=dx*dx+dy*dy;if(data[i]>230&&d<distance){best=i;distance=d;}
    }return best;
  };
  const start=nearest(layout.lefnui[1]);assert.ok(start>=0);
  const seen=new Uint8Array(data.length),queue=new Int32Array(data.length);let head=0,tail=0;
  seen[start]=1;queue[tail++]=start;
  while(head<tail){const i=queue[head++],x=i%info.width;
    for(const n of [x?i-1:-1,x<info.width-1?i+1:-1,i-info.width,i+info.width])if(n>=0&&n<data.length&&!seen[n]&&data[n]>230){seen[n]=1;queue[tail++]=n;}
  }
  for(const p of layout.lefnui.slice(1))assert.ok(seen[nearest(p)],`Lefnui is broken near ${p.join(',')}`);
  assert.ok(seen[nearest([900,4700])],'River mouth must open into the tidal sea');
  for(const p of [layout.places['druwaith-iaur'],layout.places['pinnath-gelin'],layout.places.anfalas])assert.equal(data[Math.floor(p.y/2)*info.width+Math.floor(p.x/2)],0,'Landscape destinations must not be animated water');
});

await test('the new coast extends the existing wave field without duplicate foam or ocean outside the painting',async()=>{
  const old=JSON.parse(await readFile('public/images/atlas-masks/shore-wave-field.json','utf8'));
  const next=JSON.parse(await readFile('public/images/atlas-masks/anfalas-shore-wave-field.json','utf8'));
  assert.deepEqual(next.cells.slice(0,old.cells.length),old.cells);
  assert.equal(new Set(next.cells.map(c=>`${c[0]},${c[1]}`)).size,next.cells.length);
  assert.ok(next.cells.some(([x,y])=>x<1100&&y>4500),'Surf must reach Andrast and the Lefnui firth');
  assert.ok(next.cells.some(([x,y])=>x>1400&&y>5100),'Surf must reach Anfalas');
  const {data,info}=await sharp('public/images/atlas-masks/anfalas-sea.png').greyscale().raw().toBuffer({resolveWithObject:true});
  const at=(x,y)=>data[Math.floor(y/2)*info.width+Math.floor(x/2)];
  assert.equal(at(400,5200),255);assert.equal(at(3000,5200),0);
});
