import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFile} from 'node:fs/promises';
import {rolldown} from 'rolldown';
import sharp from 'sharp';
const bundle=await rolldown({input:'lib/atlas/shore-waves.ts'});
const {output}=await bundle.generate({format:'esm'});await bundle.close();
const {shoreWaveAt,SHORE_WAVE_PERIOD,drawShoreWaves}=await import('data:text/javascript;base64,'+Buffer.from(output[0].code).toString('base64'));
const shore=JSON.parse(await readFile('public/images/atlas-masks/shoreline.json','utf8'));
const field=JSON.parse(await readFile('public/images/atlas-masks/shore-wave-field.json','utf8'));
const {data,info}=await sharp('public/images/atlas-masks/water.png').greyscale().raw().toBuffer({resolveWithObject:true});
const water=(x,y)=>{const sx=Math.floor(x/3700*info.width),sy=Math.floor(y/2800*info.height);return sx<0||sy<0||sx>=info.width||sy>=info.height?0:data[sy*info.width+sx]/255;};
function render(time,scale=.6,night=0){
  const marks=[];
  const ctx={save(){},restore(){},beginPath(){},fill(){},ellipse(x,y,rx,ry,angle){marks.push({x,y,rx,ry,angle,alpha:this.globalAlpha});}};
  drawShoreWaves(ctx,field,time,{x:0,y:0,scale},{width:3700,height:2800},'subtle',night,water);
  return marks;
}

await test('surf travels toward shore, fades at loop boundaries, and shares a repeatable clock',()=>{
  let last=Infinity;
  for(let t=0;t<SHORE_WAVE_PERIOD;t+=.5){const w=shoreWaveAt(t,0);assert.ok(w.distance<last);last=w.distance;assert.ok(w.opacity>=0&&w.opacity<=1);}
  assert.equal(shoreWaveAt(0,0).opacity,0);
  assert.ok(shoreWaveAt(SHORE_WAVE_PERIOD-.001,0).opacity<.001);
  const first=shoreWaveAt(3,4),next=shoreWaveAt(3+SHORE_WAVE_PERIOD,4);
  assert.ok(Math.abs(first.distance-next.distance)<1e-10&&Math.abs(first.opacity-next.opacity)<1e-10);
});

await test('shore coverage reaches the pale Gulf shallows, both coasts and excludes the paper edge',()=>{
  const points=shore.tracks.flat();assert.ok(points.length>400&&points.length<3000);
  assert.ok(points.some(([x,y])=>x>400&&y>420&&y<510),'Include the actual Gulf of Lune bank, not only the darker open sea');
  assert.ok(points.some(([,y])=>y<600));assert.ok(points.some(([,y])=>y>2400));
  for(const [x,y,nx,ny]of points){assert.ok(x>=176&&y>=160&&y<=2700);assert.ok(Math.abs(Math.hypot(nx,ny)-1)<.001);}
});

await test('foam remains on painted water at different times and zooms',()=>{
  let total=0;
  for(const time of [0,2.7,5.9])for(const scale of [.15,.6,.9]){
    const marks=render(time,scale);total+=marks.length;
    for(const p of marks){
      assert.ok(water(p.x,p.y)>.9);
      for(let angle=0;angle<Math.PI*2;angle+=Math.PI/4){
        const x=p.x+Math.cos(angle)*p.rx*Math.cos(p.angle)-Math.sin(angle)*p.ry*Math.sin(p.angle);
        const y=p.y+Math.cos(angle)*p.rx*Math.sin(p.angle)+Math.sin(angle)*p.ry*Math.cos(p.angle);
        assert.ok(water(x,y)>.9,'The foam footprint must stay off the bank');
      }
    }
  }
  assert.ok(total>1000);
});

await test('subtle foam is visible by day and night and deterministic when motion is paused',()=>{
  for(const night of [0,.5,1]){
    const first=render(2,.6,night),same=render(2,.6,night),next=render(4,.6,night);
    assert.deepEqual(first,same,'Holding the animation clock must hold every grain');
    assert.ok(first.filter(p=>p.alpha>.25).length>100,'Soft foam still needs clearly visible highlights');
    const alphas=new Map(first.map(p=>[`${p.x},${p.y}`,p.alpha]));
    assert.ok(next.filter(p=>Math.abs(p.alpha-(alphas.get(`${p.x},${p.y}`)??0))>.15).length>100,'Breaking foam should visibly advance in two seconds');
  }
});
