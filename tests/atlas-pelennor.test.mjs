import assert from 'node:assert/strict';
import {test} from 'node:test';
import sharp from 'sharp';
import layout from '../lib/atlas/pelennor-layout.json' with {type:'json'};
import {pelennorAlpha} from '../scripts/extend-pelennor.mjs';
const base=await sharp('public/images/atlas-gondor.webp').ensureAlpha().raw().toBuffer({resolveWithObject:true});
const current=await sharp('public/images/atlas-pelennor.webp').ensureAlpha().raw().toBuffer({resolveWithObject:true});
const pixel=(image,x,y)=>image.data.subarray((y*image.info.width+x)*4,(y*image.info.width+x)*4+4);

await test('Pelennor extends the world without shifting earlier terrain or river banks',()=>{
  assert.equal(current.info.width,layout.worldWidth);assert.equal(current.info.height,layout.worldHeight);
  let error=0,count=0;
  for(let y=0;y<base.info.height;y+=5)for(let x=0;x<base.info.width;x+=5){
    const a=pixel(base,x,y),b=pixel(current,x,y);
    if(x<layout.x||y<layout.y||pelennorAlpha(x-layout.x,y-layout.y)===0)assert.equal(a[3],b[3]);
    if(a[3]===255){assert.equal(b[3],255);for(let c=0;c<3;c++){error+=Math.abs(a[c]-b[c]);count++;}}
  }
  assert.ok(error/count<2,'Previously opaque artwork must retain its palette and registration');
  for(const [x,y] of layout.anduin.filter(p=>p[1]<layout.worldHeight-110))assert.equal(pixel(current,x,y)[3],255,'No blank join along the Anduin');
});

await test('Pelennor retains all previous water coverage on the unchanged world grid',async()=>{
  const old=await sharp('public/images/atlas-masks/gondor-water.png').greyscale().raw().toBuffer({resolveWithObject:true});
  const next=await sharp('public/images/atlas-masks/pelennor-water.png').greyscale().raw().toBuffer({resolveWithObject:true});
  assert.equal(next.info.width*2,current.info.width);assert.equal(next.info.height*2,current.info.height);
  for(let y=0;y<old.info.height;y++)for(let x=0;x<old.info.width;x++){
    const prior=old.data[y*old.info.width+x];
    if(prior||pixel(base,x*2,y*2)[3]===255)assert.equal(next.data[y*next.info.width+x],prior,'Earlier water or bank coordinates changed');
  }
});

await test('the White City, river ruins, port and hills follow the published geography',()=>{
  const city=layout.places['minas-tirith'],ruins=layout.places.osgiliath,port=layout.places.harlond,hills=layout.places['emyn-arnen'];
  assert.ok(city.x<ruins.x&&city.y>ruins.y,'Minas Tirith must be southwest of Osgiliath');
  assert.ok(port.y>city.y&&port.x>city.x,'Harlond belongs southeast of the city on Anduin’s west bank');
  assert.ok(hills.y>ruins.y&&hills.x>port.x,'Emyn Arnen lies south of Osgiliath across the river from Harlond');
  for(const p of Object.values(layout.places))assert.equal(pixel(current,p.x,p.y)[3],255,'Place anchors must reach completed artwork');
});

await test('the Anduin stays navigably open through Osgiliath and around Emyn Arnen',async()=>{
  const {data,info}=await sharp('public/images/atlas-masks/pelennor-water.png').greyscale().raw().toBuffer({resolveWithObject:true});
  const at=(x,y)=>Math.floor(y/2)*info.width+Math.floor(x/2),seed=at(4495,4350);
  const seen=new Uint8Array(data.length),queue=[seed];seen[seed]=1;
  assert.equal(data[seed],255,'Northern Gondor outlet must remain water');
  for(let j=0;j<queue.length;j++){
    const i=queue[j],x=i%info.width,y=Math.floor(i/info.width);
    if(x<2100||x>2500||y<2140||y>2740)continue;
    for(const n of [i-1,i+1,i-info.width,i+info.width])if(n>=0&&n<data.length&&!seen[n]&&data[n]>230){seen[n]=1;queue.push(n);}
  }
  for(const [x,y] of [[4648,4600],[4486,5100],[4647,5400]])assert.equal(seen[at(x,y)],1,`The river has a break at ${x},${y}`);
  const hills=layout.places['emyn-arnen'],city=layout.places['minas-tirith'];
  assert.equal(data[at(hills.x,hills.y)],0,'Emyn Arnen must stay on the eastern bank');
  assert.equal(data[at(city.x,city.y)],0,'City architecture must not be classified as flowing water');
});
