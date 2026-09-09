import assert from 'node:assert/strict';
import {test} from 'node:test';
import {rolldown} from 'rolldown';
import sharp from 'sharp';
import layout from '../lib/atlas/rauros-layout.json' with {type:'json'};
const bundle=await rolldown({input:'lib/atlas/river-surface.ts'});
const {output}=await bundle.generate({format:'esm'});await bundle.close();
const {buildRiverField,riverPhase,shadeRiverPixel}=await import('data:text/javascript;base64,'+Buffer.from(output[0].code).toString('base64'));
const {data,info}=await sharp('public/images/atlas-masks/morannon-water.png').greyscale().raw().toBuffer({resolveWithObject:true});
const water=(x,y)=>{const sx=Math.floor(x/2),sy=Math.floor(y/2);return sx<0||sy<0||sx>=info.width||sy>=info.height?0:data[sy*info.width+sx]/255;};
function track(points){
  const sampled=[];let length=0;
  for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i],d=Math.hypot(b[0]-a[0],b[1]-a[1]);length+=d;
    for(let j=0;j<Math.ceil(d/5);j++){const t=j/Math.ceil(d/5);sampled.push({x:a[0]+(b[0]-a[0])*t,y:a[1]+(b[1]-a[1])*t,alpha:1});}}
  sampled.push({x:points.at(-1)[0],y:points.at(-1)[1],alpha:1});return {points:sampled,length};
}
const field=buildRiverField([track(layout.anduin),track(layout.entwash)],water);
const {data:paint,info:paintInfo}=await sharp('public/images/atlas-morannon.webp').ensureAlpha().raw().toBuffer({resolveWithObject:true});
const source={data:paint,width:paintInfo.width,height:paintInfo.height};
function frame(t){const rgba=new Uint8ClampedArray(field.pixels.length*4);field.pixels.forEach((p,i)=>shadeRiverPixel(p,source,p.x,p.y,t,'subtle',rgba,i*4));return rgba;}

await test('river surface fills the painted channel and keeps its footprint off banks and islands',()=>{
  assert.ok(field.pixels.length>10000,'The effect should cover water, not only a centreline');
  assert.ok(field.pixels.some(p=>Math.abs(p.across)>30),'Broad water must have motion away from the guide');
  assert.equal(new Set(field.pixels.map(p=>`${p.x},${p.y}`)).size,field.pixels.length,'Overlapping guides must not double-paint a join');
  for(const p of field.pixels){
    assert.ok(p.alpha>0&&p.alpha<=1);assert.ok(p.travel>=0&&p.travel<=10);assert.ok(Math.abs(Math.hypot(p.vx,p.vy)-1)<1e-8);
    for(const dx of [-3,0,3])for(const dy of [-3,0,3])assert.ok(water(p.x+dx,p.y+dy)>.9,'Animated pixels must not touch the bank');
    for(let d=0;d<=p.travel;d+=.5)for(const dx of [-2,0,2])for(const dy of [-2,0,2])assert.ok(water(p.x-p.vx*d+dx,p.y-p.vy*d+dy)>.9,'Displaced brushwork must not sample land');
  }
});

await test('texture resets have zero weight and the flow clock remains continuous',()=>{
  const a=riverPhase(0,0,'subtle'),b=riverPhase(8.8-1e-6,0,'subtle'),c=riverPhase(8.8+1e-6,0,'subtle');
  assert.equal(a.weight,0);assert.ok(b.weight<1e-10&&c.weight<1e-10);assert.ok(Math.abs(b.second-c.second)<1e-6);
  const before=frame(8.8-1/120),after=frame(8.8+1/120);let error=0;for(let i=0;i<before.length;i++)error+=Math.abs(before[i]-after[i]);
  assert.ok(error/before.length<.7,'There must be no visible reset flash');
});

await test('surface motion preserves the painted palette, changes over time and freezes exactly',()=>{
  const first=frame(1.7),same=frame(1.7),next=frame(3.7);assert.deepEqual(first,same);
  let changed=0,difference=0;for(let i=0;i<first.length;i+=4){if(Math.abs(first[i]-next[i])+Math.abs(first[i+1]-next[i+1])+Math.abs(first[i+2]-next[i+2])>8)changed++;
    const p=field.pixels[i/4],at=(p.y*paintInfo.width+p.x)*4;for(let c=0;c<3;c++)difference+=Math.abs(first[i+c]-paint[at+c]);}
  assert.ok(changed>field.pixels.length*.2,'Water texture should visibly move');
  assert.ok(difference/(field.pixels.length*3)<18,'Do not repaint the river as bright synthetic water');
});
