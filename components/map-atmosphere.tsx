import Image from 'next/image';
import { assetPath } from '@/lib/atlas/asset-path';
import { chimneys } from '@/lib/atlas/illustration';

const flocks = [
  {path:'M70 700 C330 460 710 190 1270 180',duration:46,delay:-12},
  {path:'M400 990 C480 720 950 450 1450 290',duration:57,delay:-36},
  {path:'M240 230 C560 210 990 400 1430 670',duration:64,delay:-54},
];
export function MapAtmosphere({chimneyPoints=chimneys}:{chimneyPoints?:readonly {x:number;y:number}[]}={}) {
  return <>
    <div className="weather-field"><div className="cloud-shadow shadow-one"/><div className="cloud-shadow shadow-two"/><div className="sun-break"/></div>
    <div className="hearths">{chimneyPoints.map((point,i)=><div key={i} className="chimney" style={{left:point.x,top:point.y}}>{[0,1,2].map(j=><span className="chimney-wisp" key={j} style={{animationDelay:`-${j*3.4+i*1.1}s`}}/>)}</div>)}</div>
    <div className="birds-in-daylight">{flocks.map((flock,i)=><div key={i} className="bird-flock" style={{offsetPath:`path('${flock.path}')`,animationDuration:`${flock.duration}s`,animationDelay:`${flock.delay}s`}}>{[0,1,2,3].map(j=><div key={j} className="atlas-bird" style={{left:-j*23,top:j%2===0?j*6:-j*8,width:18-j*1.5,animationDelay:`-${j*.29}s`}}><Image src={assetPath('/images/raven-overhead.png')} alt="" width={128} height={85} unoptimized draggable={false}/></div>)}</div>)}</div>
  </>;
}
