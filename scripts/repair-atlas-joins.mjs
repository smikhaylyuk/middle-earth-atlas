import sharp from 'sharp';

// The edit candidates contain surrounding terrain for context. Only these
// registered masks enter the map; no full generated sheet replaces geography.
export async function repairAtlasJoins(painting){
  const originalAlpha=await sharp(painting).extractChannel(3).toColourspace('b-w').raw().toBuffer();
  const riverMask=await sharp(Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="580" height="580"><rect x="100" y="145" width="300" height="355" rx="45" fill="white"/></svg>')).blur(13).png().toBuffer();
  const river=await sharp('public/images/repairs/anduin-join.webp').composite([{input:riverMask,blend:'dest-in'}]).png().toBuffer();
  let repaired=await sharp(painting).composite([{input:river,left:3100,top:1600}]).png().toBuffer();

  const width=1400,height=1200;
  const {data,info}=await sharp(painting).extract({left:0,top:1600,width,height}).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const sea=new Uint8Array(width*height),queue=new Int32Array(width*height);let first=0,last=0;
  const water=i=>{const p=i*info.channels;return data[p+3]>0&&data[p+1]-data[p]>5&&data[p+2]-data[p]>5;};
  // Flood from open water, excluding isolated blue shadows on land. White
  // foam is filled only within a few pixels of this connected sea selection.
  for(let y=0;y<height;y++){const i=y*width+200;if(water(i)){sea[i]=255;queue[last++]=i;}}
  while(first<last){const i=queue[first++],x=i%width,y=Math.floor(i/width);for(const n of [x>0?i-1:-1,x<width-1?i+1:-1,y>0?i-width:-1,y<height-1?i+width:-1])if(n>=0&&!sea[n]&&water(n)){sea[n]=255;queue[last++]=n;}}
  const mask=await sharp(sea,{raw:{width,height,channels:1}}).dilate(2).erode(9).blur(7).toColourspace('b-w').raw().toBuffer();
  const rgba=Buffer.alloc(width*height*4);
  for(let i=0;i<sea.length;i++){
    const y=Math.floor(i/width),edge=Math.min(1,Math.max(0,(y-30)/150));
    rgba[i*4]=rgba[i*4+1]=rgba[i*4+2]=255;
    // The source edit includes its parchment fade; preserve the original
    // feather by fading its contribution gently at the outermost edge.
    const outer=Math.min(1,(i%width)/100,(height-y)/35);
    rgba[i*4+3]=Math.round(mask[i]*edge*outer);
  }
  const oceanMask=await sharp(rgba,{raw:{width,height,channels:4}}).png().toBuffer();
  const ocean=await sharp('public/images/repairs/ocean-water.webp').composite([{input:oceanMask,blend:'dest-in'}]).png().toBuffer();
  repaired=await sharp(repaired).composite([{input:ocean,left:0,top:1600}]).png().toBuffer();
  // Compositing must never change the outer crop / southeastern exclusion.
  const final=await sharp(repaired).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  for(let i=0;i<originalAlpha.length;i++)final.data[i*4+3]=originalAlpha[i];
  return sharp(final.data,{raw:{width:final.info.width,height:final.info.height,channels:4}}).png().toBuffer();
}
