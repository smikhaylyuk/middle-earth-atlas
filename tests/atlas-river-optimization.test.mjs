import assert from 'node:assert/strict';
import {test} from 'node:test';
import {rolldown} from 'rolldown';
import original from './fixtures/river-shader-original.json' with {type:'json'};

const bundle=await rolldown({input:'lib/atlas/river-surface.ts'});
const {output}=await bundle.generate({format:'esm'});await bundle.close();
const {prepareRiverPixel,prepareRiverFrame,shadePreparedRiverPixel}=await import('data:text/javascript;base64,'+Buffer.from(output[0].code).toString('base64'));

await test('prepared water shading retains the original RGB output across both intensities and loop boundaries',()=>{
  const source={width:80,height:80,data:Uint8ClampedArray.from({length:80*80*4},(_,i)=>(i*73+Math.floor(i/29)*31)%256)};
  const pixels=original.pixels.map(prepareRiverPixel);
  for(const sample of original.samples){
    const frame=prepareRiverFrame(sample.time,sample.intensity),rgba=new Uint8ClampedArray(pixels.length*4);
    pixels.forEach((p,i)=>shadePreparedRiverPixel(p,source,40,40,frame,rgba,i*4));
    assert.deepEqual([...rgba],sample.rgba);
  }
});
