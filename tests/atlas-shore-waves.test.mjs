import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFile} from 'node:fs/promises';
import {rolldown} from 'rolldown';
import sharp from 'sharp';
const bundle=await rolldown({input:'lib/atlas/shore-waves.ts'});
const {output}=await bundle.generate({format:'esm'});await bundle.close();
const {shoreWaveAt,drawShoreWaves}=await import('data:text/javascript;base64,'+Buffer.from(output[0].code).toString('base64'));
const shore=JSON.parse(await readFile('public/images/atlas-masks/shoreline.json','utf8'));

await test('surf travels toward shore, fades at loop boundaries, and shares a repeatable clock',()=>{
  let last=Infinity;
  for(let t=0;t<12;t+=.5){const w=shoreWaveAt(t,0);assert.ok(w.distance<last);last=w.distance;assert.ok(w.opacity>=0&&w.opacity<=1);}
  assert.equal(shoreWaveAt(0,0).opacity,0);
  assert.ok(shoreWaveAt(11.999,0).opacity<.001);
  assert.deepEqual(shoreWaveAt(3,4),shoreWaveAt(15,4));
});

await test('shore contours cover multiple coastal reaches without tracing the outer paper edge',()=>{
  assert.ok(shore.tracks.length>10);
  const points=shore.tracks.flat();assert.ok(points.length>400&&points.length<3000);
  assert.ok(points.some(([,y])=>y<600));assert.ok(points.some(([,y])=>y>2400));
  for(const [x,y,nx,ny]of points){assert.ok(x>=176&&y>=160&&y<=2700);assert.ok(Math.abs(Math.hypot(nx,ny)-1)<.001);}
});

await test('every drawn surf segment stays on painted water at different times and zooms',async()=>{
  const {data,info}=await sharp('public/images/atlas-masks/water.png').greyscale().raw().toBuffer({resolveWithObject:true});
  const water=(x,y)=>{const sx=Math.floor(x/3700*info.width),sy=Math.floor(y/2800*info.height);return sx<0||sy<0||sx>=info.width||sy>=info.height?0:data[sy*info.width+sx]/255;};
  let segments=0,previous;
  const ctx={save(){},restore(){},beginPath(){},stroke(){},moveTo(x,y){previous=[x,y];},lineTo(x,y){assert.ok(water(...previous)>.9&&water(x,y)>.9&&water((previous[0]+x)/2,(previous[1]+y)/2)>.9);segments++;}};
  for(const time of [0,2.7,5.9,9.3,12])for(const scale of [.2,.6,.9])drawShoreWaves(ctx,shore,time,{x:0,y:0,scale},{width:3700,height:2800},'subtle',.4,water);
  assert.ok(segments>1000,'The sea must visibly animate, rather than passing by drawing nothing');
});
