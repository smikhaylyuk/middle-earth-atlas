import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFile} from 'node:fs/promises';
import sharp from 'sharp';
const rivers=JSON.parse(await readFile('public/images/atlas-masks/tributaries.json','utf8'));
const named=name=>rivers.find(r=>r.name===name);

await test('the repaired Shire and Adorn courses retain the published relative geography',()=>{
  const water=named('The Water'),withy=named('Withywindle'),adorn=named('Adorn');
  const besideHobbiton=water.points.reduce((a,b)=>Math.abs(a[0]-804.69)<Math.abs(b[0]-804.69)?a:b);
  assert.ok(besideHobbiton[1]>369.14,'The Water must pass south of Hobbiton');
  assert.ok(water.points.at(-1)[1]<440.43,'The confluence is north of Brandywine Bridge');
  assert.ok(water.points[0][0]<water.points.at(-1)[0]);
  assert.ok(withy.points[0][0]>withy.points.at(-1)[0]&&withy.points[0][1]<withy.points.at(-1)[1],'Withywindle flows southwest through Old Forest');
  assert.ok(adorn.points[0][0]>adorn.points.at(-1)[0]&&adorn.points[0][1]>adorn.points.at(-1)[1]);
  assert.ok(adorn.points.at(-1)[0]<1842.92-200,'Adorn meets Isen downstream and west of the Fords');
  const deep=rivers.find(r=>r.name.startsWith('Deeping-stream'));
  assert.equal(deep.confluence,null,'The unknown final destination must not be invented');
  assert.ok(deep.points[0][1]>deep.points.at(-1)[1],'The known local outflow runs north');
  assert.ok(Math.max(...deep.points.map(p=>p[1]))-Math.min(...deep.points.map(p=>p[1]))<100,'Do not turn a local reach into a speculative full river');
});

await test('the registered river guides coincide with visible muted water, not unedited golden ground',async()=>{
  const {data,info}=await sharp('public/images/atlas-cartographic.webp').ensureAlpha().raw().toBuffer({resolveWithObject:true});
  // The Shire uses warm, grey-green water. Permit its painted highlights and
  // shaded banks; this is a coverage regression, not proof of canon accuracy.
  for(const river of rivers){
    const interior=river.points.slice(6,-6);let found=0;
    for(const [x,y]of interior){let hit=false;for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++){
      const at=(Math.round(y+dy)*info.width+Math.round(x+dx))*4,[r,g,b]=data.subarray(at,at+3);
      if(g>=r-12&&(g+b)/Math.max(30,r)>1.6)hit=true;
    }if(hit)found++;}
    assert.ok(found/interior.length>.96,`${river.name}: river artwork or registration is missing`);
  }
});

await test('the river cutouts leave the original named towns and main crossings untouched',async()=>{
  for(const {name,points}of [{name:'shire-waterways',points:[[305,189],[495,260],[785,300]]},{name:'westfold-waterways',points:[[690,109],[1100,510],[690,60]]}]){
    const {data,info}=await sharp(`public/images/repairs/${name}.webp`).ensureAlpha().raw().toBuffer({resolveWithObject:true});
    for(const[x,y]of points)for(let dy=-5;dy<=5;dy++)for(let dx=-5;dx<=5;dx++)assert.equal(data[((y+dy)*info.width+x+dx)*4+3],0,`${name}: alteration outside river corridors`);
  }
});
