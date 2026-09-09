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
const {renderAtlasPainting,renderCachedPainting,lightAtlasPainting}=await load('painting');
const {trackPoint}=await load('canvas-scene');
const {renderMapLabels}=await load('map-labels');
const {places}=await load('places');
const {mapPlaces,homeView,placeView,zoomView,boundView,MAP_WIDTH,MAP_HEIGHT}=await load('map-view');

await test('daylight is a single uniform operation over the entire viewport, including midnight wrap',()=>{
  const calls=[];
  const ctx={save(){},restore(){},fillRect(...rect){calls.push({color:this.fillStyle,alpha:this.globalAlpha,blend:this.globalCompositeOperation,rect});}};
  const size={width:1440,height:900};
  for(const hour of [0,6,12,18,23.999,24]){
    calls.length=0;lightAtlasPainting(ctx,size,hour);
    assert.ok(calls.length>0);
    assert.ok(calls.every(c=>c.blend==='source-atop'&&c.alpha>=0&&c.alpha<=1));
    assert.ok(calls.every(c=>JSON.stringify(c.rect)==='[0,0,1440,900]'),'No region bounds or region-specific sun positions');
  }
  calls.length=0;lightAtlasPainting(ctx,size,0);const midnight=[...calls];
  calls.length=0;lightAtlasPainting(ctx,size,24);assert.deepEqual(calls,midnight);
});

await test('flow and wildlife positions remain continuous between sampled points',()=>{
  const track={length:100,points:[{x:10,y:20,alpha:1},{x:30,y:60,alpha:.5},{x:70,y:80,alpha:0}]};
  assert.deepEqual(trackPoint(track,.25),{x:20,y:40,alpha:.75});
  assert.deepEqual(trackPoint(track,1),{x:70,y:80,alpha:0});
  assert.deepEqual(trackPoint(track,-1),track.points[0]);
});

await test('the whole atlas fits between the header and dock and detail zoom stays within the painting limit',()=>{
  for(const size of [{width:390,height:844},{width:828,height:755},{width:1440,height:900}]){
    const home=homeView(size);
    assert.ok(home.x>=20);
    assert.ok(home.x+MAP_WIDTH*home.scale<=size.width-20);
    assert.ok(home.y>=100);
    assert.ok(home.y+MAP_HEIGHT*home.scale<=size.height-(size.width<650?205:232));
    assert.equal(boundView({...home,scale:10},size).scale,.9);
    for(const id of Object.keys(mapPlaces))assert.ok(placeView(id,size).scale<=.8);
    const anchor={x:size.width*.5,y:size.height*.5};
    const atLimit=boundView({x:-1200,y:-1200,scale:.9},size);
    assert.deepEqual(zoomView(atLimit,size,3,anchor),atLimit,'Extra zoom at the limit must not move the camera');
  }
});

await test('camera labels stay on device pixels and unchanged frames do not rewrite their styles',()=>{
  const writes=[];
  const tracked=(name)=>new Proxy({}, {set(target,key,value){writes.push([name,key,value]);target[key]=value;return true;}});
  const layer={dataset:tracked('density'),children:places.map(p=>({style:tracked(p.id)}))};
  const detail={names:false,major:false,minor:false};
  const view={x:-143.317,y:17.239,scale:.7};
  renderMapLabels(layer,view,null,detail,2);
  for(const [i,p] of places.entries()){
    const {left,top,visibility}=layer.children[i].style;
    assert.equal(Number.parseFloat(left)*2,Math.round((view.x+mapPlaces[p.id].x*view.scale)*2));
    assert.equal(Number.parseFloat(top)*2,Math.round((view.y+mapPlaces[p.id].y*view.scale)*2));
    assert.equal(visibility,'visible');
  }
  writes.length=0;
  renderMapLabels(layer,view,null,detail,2);
  assert.deepEqual(writes,[],'Clock or selection renders must not reset positioned labels');
  renderMapLabels(layer,{...view,x:view.x+10},null,detail,2);
  assert.equal(writes.length,places.length);
  assert.ok(writes.every(([,key])=>key==='left'),'Panning must not hide or recreate labels');
});

await test('label selection remains reachable at overview and density changes only outside the hysteresis band',()=>{
  const layer={dataset:{},children:places.map(()=>({style:{}}))};
  const detail={names:false,major:false,minor:false};
  const minor=places.find(p=>!p.major),index=places.indexOf(minor);
  const view={x:0,y:0,scale:.2};
  renderMapLabels(layer,view,null,detail,1);
  assert.equal(layer.children[index].style.visibility,'hidden');
  renderMapLabels(layer,view,minor.id,detail,1);
  assert.equal(layer.children[index].style.visibility,'visible');
  renderMapLabels(layer,view,null,detail,1);
  assert.equal(layer.children[index].style.visibility,'hidden');
  for(const scale of [.379,.381,.377,.383]){
    renderMapLabels(layer,{...view,scale},null,detail,1);
    assert.equal(layer.dataset.density,'overview');
  }
  renderMapLabels(layer,{...view,scale:.42},null,detail,1);
  for(const scale of [.379,.381,.377,.383]){
    renderMapLabels(layer,{...view,scale},null,detail,1);
    assert.equal(layer.dataset.density,'detail');
  }
});

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

await test('stationary animation reuses the full-resolution painting; navigation and resizing invalidate it',()=>{
  const sourceDraws=[],copies=[];
  const sourceContext={setTransform(){},clearRect(){},drawImage(...args){sourceDraws.push(args);}};
  const targetContext={setTransform(){},drawImage(...args){copies.push({args,operation:this.globalCompositeOperation});}};
  const cache={canvas:{width:0,height:0,getContext:()=>sourceContext},key:'',builds:0};
  const target={width:0,height:0,getContext:()=>targetContext},image={},view={x:-420,y:20,scale:.5},size={width:1440,height:900};
  for(let i=0;i<120;i++)assert.ok(renderCachedPainting(target,cache,image,view,size,2));
  assert.equal(sourceDraws.length,1,'Animation must not rescale the atlas every frame');
  assert.equal(cache.builds,1);assert.equal(target.width,2880);assert.equal(target.height,1800);
  assert.ok(copies.every(c=>c.operation==='copy'&&c.args[0]===cache.canvas),'Transparent edges replace the previous frame without trails');
  renderCachedPainting(target,cache,image,{...view,x:-400},size,2);
  renderCachedPainting(target,cache,image,{...view,scale:.7},size,2);
  renderCachedPainting(target,cache,image,view,{width:1000,height:800},2);
  renderCachedPainting(target,cache,image,view,size,1);
  assert.equal(cache.builds,5,'Pan, zoom, viewport and display density changes must all refresh geography');
});
