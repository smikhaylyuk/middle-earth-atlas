import assert from 'node:assert/strict';
import {test} from 'node:test';
import sharp from 'sharp';

await test('the repaired atlas retains its exact outer alpha and excluded southeastern geography',async()=>{
  const original=await sharp('public/images/atlas-painted-polished.webp').extractChannel(3).raw().toBuffer();
  const repaired=await sharp('public/images/atlas-continuous.webp').extractChannel(3).raw().toBuffer();
  assert.ok(original.equals(repaired),'A raw-mask channel conversion must not remove or reshape the atlas alpha');
});

await test('the Anduin remains water throughout the formerly disconnected joining band',async()=>{
  const {data,info}=await sharp('public/images/atlas-continuous.webp').ensureAlpha().raw().toBuffer({resolveWithObject:true});
  for(const [x,y] of [[3322,1890],[3380,1910],[3401,1930],[3401,1950],[3388,1970]]){
    const at=(y*info.width+x)*4;
    assert.ok(data[at+2]-data[at]>15&&data[at+1]-data[at]>10,`River continuity lost at ${x},${y}`);
    assert.equal(data[at+3],255);
  }
});

await test('open sea on either side of the former join shares the same broad palette',async()=>{
  const samples=[];
  for(const top of [1660,2240]){
    const sample=await sharp('public/images/atlas-continuous.webp').extract({left:300,top,width:100,height:100}).png().toBuffer();
    const stat=await sharp(sample).stats();
    samples.push(stat.channels.slice(0,3).map(c=>c.mean));
  }
  assert.ok(samples[0].every((v,i)=>Math.abs(v-samples[1][i])<20),'Ocean color must not change sharply at the sheet boundary');
});
