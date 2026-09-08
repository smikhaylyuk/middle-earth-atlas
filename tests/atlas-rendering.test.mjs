import assert from 'node:assert/strict';
import {test} from 'node:test';
import {fileURLToPath} from 'node:url';
import {rolldown} from 'rolldown';
const load=async file=>{
  const bundle=await rolldown({input:fileURLToPath(new URL(`../lib/atlas/${file}.ts`,import.meta.url))});
  const {output}=await bundle.generate({format:'esm'});
  await bundle.close();
  return import('data:text/javascript;base64,'+Buffer.from(output[0].code).toString('base64'));
};
const {createFrameQueue,zoomDetail,wheelPixels}=await load('frame-queue');
const {renderAtlasPainting}=await load('painting');

await test('a burst of camera input draws only the final accumulated view in one frame',()=>{
  const frames=new Map(),draws=[];let id=0;
  const queue=createFrameQueue(v=>draws.push(v),cb=>{frames.set(id,cb);return id++;},n=>frames.delete(n));
  let x=0;
  for(let i=0;i<100;i++)queue.push({x:++x});
  assert.equal(frames.size,1);
  assert.deepEqual(draws,[]);
  frames.get(0)();frames.delete(0);
  assert.deepEqual(draws,[{x:100}]);
  queue.push({x:101});queue.cancel();
  assert.equal(frames.size,0);
  queue.push({x:102});frames.get(2)();
  assert.deepEqual(draws,[{x:100},{x:102}]);
});

await test('labels do not oscillate at a zoom boundary',()=>{
  let detailed=false;
  for(const scale of [.379,.381,.377,.383])detailed=zoomDetail(scale,detailed,.38);
  assert.equal(detailed,false);
  detailed=zoomDetail(.42,detailed,.38);
  for(const scale of [.379,.381,.377,.383])detailed=zoomDetail(scale,detailed,.38);
  assert.equal(detailed,true);
  assert.equal(zoomDetail(.34,detailed,.38),false);
  assert.equal(wheelPixels(2,1,800),32);
  assert.equal(wheelPixels(1,2,800),800);
});

await test('zoom never reallocates the viewport canvas or separates clearing from drawing',()=>{
  let width=0,height=0,resizes=0;const calls=[];
  const context={setTransform(...args){calls.push(['transform',...args]);},clearRect(...args){calls.push(['clear',...args]);},drawImage(...args){calls.push(['draw',...args]);}};
  const canvas={get width(){return width;},set width(v){width=v;resizes++;},get height(){return height;},set height(v){height=v;resizes++;},getContext(){return context;}};
  const image={};
  for(const scale of [.1,.2,.4,.8,1.65,.8,.4,.1])assert.equal(renderAtlasPainting(canvas,image,{x:-270,y:40,scale},{width:1440,height:900},3),true);
  assert.equal(resizes,2,'Only initial allocation, regardless of zoom');
  assert.equal(width,2880);assert.equal(height,1800);
  assert.equal(calls.length,24);
  for(let i=0;i<calls.length;i+=3){assert.equal(calls[i][0],'transform');assert.equal(calls[i+1][0],'clear');assert.equal(calls[i+2][0],'draw');assert.equal(calls[i+2][1],image);}
  renderAtlasPainting(canvas,image,{x:0,y:0,scale:1.65},{width:3840,height:2160},3);
  assert.ok(width*height<8_010_000,'High-density displays have bounded allocation');
});
