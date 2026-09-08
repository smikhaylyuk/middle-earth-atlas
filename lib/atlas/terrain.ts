export const places = [
  { id: 'bree', name: 'Bree', kind: 'A meeting of roads', x: -87, z: 24, subtitle: 'At the sign of the Prancing Pony', description: 'Men and Hobbits share Bree, beside the crossing of the East Road and the Greenway. Frodo and his companions meet Strider at the Prancing Pony on the night of 29 September.', date: '29 September · Third Age 3018', camera: [-14, 30, 40] },
  { id: 'weathertop', name: 'Weathertop', kind: 'The watch of the North', x: -24, z: -7, subtitle: 'Amon Sûl, the hill of the wind', description: 'Amon Sûl stands at the southern end of the Weather Hills, north of the East Road. On 6 October, the Nazgûl attack the camp below its ruined summit and Frodo is wounded.', date: '6 October · Third Age 3018', camera: [-20, 27, 36] },
  { id: 'rivendell', name: 'Rivendell', kind: 'The last homely house', x: 80, z: -20, subtitle: 'Imladris, the refuge in the valley', description: 'Elrond’s refuge lies in a hidden valley west of the Misty Mountains. On 20 October, Frodo escapes across the Ford of Bruinen; he later wakes in Rivendell on 24 October.', date: '20 October · Third Age 3018', camera: [-28, 31, 41] },
] as const;
export type PlaceId = typeof places[number]['id'];
export type LightMode = 'morning' | 'golden';
export const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n));
export const smooth = (a: number, b: number, x: number) => { const t=clamp((x-a)/(b-a),0,1); return t*t*(3-2*t); };
const hash = (x:number,z:number) => { const n=Math.sin(x*127.1+z*311.7)*43758.5453; return n-Math.floor(n); };
export function noise(x:number,z:number) { const i=Math.floor(x),j=Math.floor(z),u=smooth(0,1,x-i),v=smooth(0,1,z-j); const a=hash(i,j),b=hash(i+1,j),c=hash(i,j+1),d=hash(i+1,j+1);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v; }
export function fbm(x:number,z:number) { return noise(x,z)*.52+noise(x*2.07+23,z*2.07+19)*.26+noise(x*4.17,z*4.17)*.13+noise(x*8.21,z*8.21)*.065+noise(x*16.4,z*16.4)*.0325; }
export const riverX=(z:number)=>68+9*Math.sin((z+25)*.03)+3*Math.sin(z*.085);
export const riverY=(z:number)=>2.8+(110-z)*.025;
const peaks = [[109,-66,66,27,34],[136,-27,57,25,32],[114,17,43,24,34],[139,64,51,23,36],[78,-99,54,33,31],[40,-96,31,27,29],[4,-104,19,29,28]];
export function height(x:number,z:number):number {
  const warp=fbm(x*.026,z*.026);
  let h=2+fbm(x*.026+30,z*.026+30)*6;
  let mountain=0;
  for(const [px,pz,ph,wx,wz] of peaks) {
    const dx=(x-px+(warp-.5)*17)/wx,dz=(z-pz+(noise(x*.03+13,z*.03)-.5)*10)/wz;
    const d=Math.sqrt(dx*dx+dz*dz);
    mountain=Math.max(mountain,ph*Math.exp(-Math.pow(d,1.18)*1.45));
  }
  const ridges=1-Math.abs(noise(x*.115+fbm(x*.04,z*.04)*2,z*.115)*2-1);
  const gullies=1-Math.abs(noise(x*.22+warp*3,z*.22)*2-1);
  const erosion=smooth(6,28,mountain);
  h+=mountain*(.5+.5*ridges)+erosion*(gullies-.45)*5.2+Math.pow(mountain/55,1.2)*(fbm(x*.45,z*.45)-.4)*9;
  h+=erosion*Math.sin(z*.92+x*.31+noise(x*.08,z*.08)*4)*.65;
  h+=18*Math.exp(-((x+24)**2/140+(z+7)**2/165));
  const riverDistance=Math.abs(x-riverX(z));
  h=h*smooth(2.3,12,riverDistance)+(riverY(z)-.65)*(1-smooth(2.3,12,riverDistance));
  const b=Math.hypot(x+87,z-24); h=h*smooth(7,14,b)+5.6*(1-smooth(7,14,b));
  const w=Math.hypot(x+24,z+7); h=h*smooth(2.7,6,w)+23.7*(1-smooth(2.7,6,w));
  const r=Math.hypot((x-80)*1.1,(z+20)*.8); h=h*smooth(5,11,r)+10.3*(1-smooth(5,11,r));
  return h;
}
export function seeded(seed=43) { let n=seed; return()=>{n|=0;n=n+0x6D2B79F5|0;let t=Math.imul(n^n>>>15,1|n);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;}; }
