import assert from 'node:assert/strict';
import {test} from 'node:test';
import sharp from 'sharp';
import layout from '../lib/atlas/rauros-layout.json' with {type:'json'};

const expanded=await sharp('public/images/atlas-expanded.webp').ensureAlpha().raw().toBuffer({resolveWithObject:true});
const pixel=(x,y)=>expanded.data.subarray((Math.round(y)*expanded.info.width+Math.round(x))*4,(Math.round(y)*expanded.info.width+Math.round(x))*4+4);
const water=([r,g,b,a])=>a>100&&g>=r-5&&b>=r-10&&b>=g-30;

await test('expansion preserves the old map coordinate plane and coastline alpha',async()=>{
  assert.equal(expanded.info.width,4350);assert.equal(expanded.info.height,3300);
  const base=await sharp('public/images/atlas-cartographic.webp').ensureAlpha().raw().toBuffer({resolveWithObject:true});
  // A larger canvas must not stretch the earlier map or move the coast under
  // its shoreline animation. Compare opaque and feathered pixels alike.
  let difference=0,count=0;
  for(let y=0;y<base.info.height;y+=13)for(let x=0;x<2950;x+=13){
    const at=(y*base.info.width+x)*4,p=pixel(x,y);
    assert.equal(p[3],base.data[at+3],`coast alpha changed at ${x},${y}`);
    if(p[3]>240){for(let c=0;c<3;c++)difference+=Math.abs(p[c]-base.data[at+c]);count+=3;}
  }
  assert.ok(difference/count<4,'Earlier painting was moved or recoloured');
  const mask=await sharp('public/images/atlas-masks/expanded-water.png').metadata();
  assert.equal(mask.width*2,expanded.info.width);assert.equal(mask.height*2,expanded.info.height);
});

await test('the displayed Anduin joins the old river to the lake, falls and Entwash delta',()=>{
  const {x:left,y:top,width,height}=layout,seen=new Uint8Array(width*height),queue=new Int32Array(width*height);
  const relative=([x,y])=>[x-left,y-top];
  const start=relative([3480,2320]),index=([x,y])=>y*width+x;
  let length=1;queue[0]=index(start);seen[queue[0]]=1;
  for(let j=0;j<length;j++){
    const i=queue[j],x=i%width,y=Math.floor(i/width);
    for(const n of [x?i-1:-1,x<width-1?i+1:-1,y?i-width:-1,y<height-1?i+width:-1]){
      if(n<0||seen[n])continue;
      if(water(pixel(left+n%width,top+Math.floor(n/width)))){seen[n]=1;queue[length++]=n;}
    }
  }
  const checkpoints=[['Nen Hithoel',3500,2460],['above Rauros',3570,2670],['below Rauros',3600,2780],['lower Anduin',3818,3080],['Entwash delta',3664,3004],['Entwash western reach',3170,2640]];
  for(const [name,x,y] of checkpoints){let reached=false;for(let dy=-12;dy<=12;dy++)for(let dx=-12;dx<=12;dx++)if(seen[index(relative([x+dx,y+dy]))])reached=true;
    assert.ok(reached,`${name} is disconnected in the displayed painting`);
  }
  // Its grey summit can resemble foam in the colour classifier; the warm
  // rock at the foot must remain land, with water on either side.
  assert.ok(!water(pixel(3512,2602)),'Tol Brandir must remain a landform, not an extra river channel');
  assert.ok(water(pixel(3470,2602))&&water(pixel(3560,2602)),'Tol Brandir must stand within the lake');
});

await test('new water motion guides follow the painted channels',()=>{
  for(const key of ['anduin','entwash']){
    let hits=0;
    for(const [x,y] of layout[key]){let found=false;for(let dy=-8;dy<=8;dy++)for(let dx=-8;dx<=8;dx++)if(water(pixel(x+dx,y+dy)))found=true;if(found)hits++;}
    assert.ok(hits/layout[key].length>.9,`${key} guide drifts off the painted water: ${hits}/${layout[key].length}`);
  }
});
