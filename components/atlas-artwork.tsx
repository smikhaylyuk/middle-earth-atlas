import Image from 'next/image';
import { RohanArtwork } from './rohan-artwork';
import { AnduinArtwork } from './anduin-artwork';
import { assetPath } from '@/lib/atlas/asset-path';
import { MapAtmosphere } from './map-atmosphere';
import { SOUTH_OFFSET, SOUTH_HEIGHT, southernRivers, southernMist, southernFlocks, southernRoad } from '@/lib/atlas/southern-illustration';
import { EAST_OFFSET } from '@/lib/atlas/world';
import { road, roadHighlight, river, warmLights, mistPatches } from '@/lib/atlas/illustration';
import { westernRoad, westernSpur, westernRivers, westernLights, westernMist, westernChimneys } from '@/lib/atlas/western-illustration';
import { windowLightAt } from '@/lib/atlas/bree';

export function AtlasArtwork({hour,route,onEastLoad,onWestLoad,onSouthLoad,onAnduinLoad,onRohanLoad,onError}:{hour:number;route:boolean;onEastLoad:()=>void;onWestLoad:()=>void;onSouthLoad:()=>void;onAnduinLoad:()=>void;onRohanLoad:()=>void;onError:()=>void}) {
  return <>
    <RohanArtwork onLoad={onRohanLoad} onError={onError}/>
    <AnduinArtwork onLoad={onAnduinLoad} onError={onError}/>
    <div className="southern-sheet" style={{top:SOUTH_OFFSET,height:SOUTH_HEIGHT}}>
      <Image className="map-art" src={assetPath('/images/eriador-south.jpg')} alt="" width={2500} height={1300} unoptimized loading="eager" draggable={false} onLoad={onSouthLoad} onError={onError}/>
      <div className="map-light-wash"/><div className="map-night-wash"/>
      <MapAtmosphere chimneyPoints={[]} flockPaths={southernFlocks}/>
      <svg className="map-ink" viewBox="0 0 2500 1300" fill="none" style={{height:1300}}>
        <path className="river-underlight" d={southernRivers} stroke="#b4dfd5" strokeWidth="3"/>
        <path className="river-current" d={southernRivers} stroke="#e3f6e7" strokeWidth="1.8" strokeDasharray="2 30 7 65"/>
        {route&&<g className="journey-drawing"><path d={southernRoad} className="route-shadow" strokeWidth="4"/><path d={southernRoad} className="journey-dashes" strokeWidth="1.5" strokeDasharray="3 10"/></g>}
        <text x="1915" y="380" className="geographic-label land-label" textAnchor="middle">EREGION</text>
        <text x="1940" y="420" className="geographic-label southern-sublabel" textAnchor="middle">HOLLIN</text>
        <text x="975" y="610" className="geographic-label land-label" textAnchor="middle">MINHIRIATH</text>
        <text x="1515" y="830" className="geographic-label land-label" textAnchor="middle">ENEDWAITH</text>
        <text x="1825" y="707" className="geographic-label land-label" textAnchor="middle">DUNLAND</text>
        <text x="2310" y="990" className="geographic-label forest-label" textAnchor="middle">FANGORN</text>
        <text x="1340" y="777" className="geographic-label southern-sublabel" textAnchor="middle" transform="rotate(-49 1340 777)">GWATHLÓ</text>
        <text x="595" y="825" className="geographic-label sea-label" textAnchor="middle">THE GREAT SEA</text>
      </svg>
      <div className="valley-mists">{southernMist.map((p,i)=><span key={i} className="valley-mist" style={{left:p.x,top:p.y,width:p.w,height:p.h,animationDelay:`${p.delay}s`}}/>)}</div>
    </div>
    <div className="eastern-sheet" style={{left:EAST_OFFSET}}>
      <Image className="map-art" src={assetPath('/images/eriador-painted.jpg')} alt="" width={1500} height={1000} unoptimized loading="eager" draggable={false} onLoad={onEastLoad} onError={onError}/>
      {[{x:1001,y:573,w:80,h:69},{x:1097,y:504,w:47,h:48}].map((p,i)=><div key={i} className="map-art-correction" style={{left:p.x*1500/1536,top:p.y*1000/1024,width:p.w*1500/1536,height:p.h*1000/1024}}><Image src={assetPath('/images/eriador-ford-correction.jpg')} alt="" width={1500} height={1000} unoptimized loading="eager" draggable={false} style={{left:-p.x*1500/1536,top:-p.y*1000/1024}} onError={onError}/></div>)}
      <div className="map-light-wash"/><div className="map-night-wash"/><MapAtmosphere/>
      <svg className="map-ink" viewBox="0 0 1500 1000" fill="none">
        <defs><filter id="river-soft"><feGaussianBlur stdDeviation="1.2"/></filter></defs>
        <path className="river-underlight" d={river} stroke="#b4dfd5" strokeWidth="3" filter="url(#river-soft)"/>
        <path className="river-current" d={river} stroke="#e3f6e7" strokeWidth="1.8" strokeDasharray="2 30 7 65"/>
        {route&&<g className="journey-drawing"><path d={roadHighlight} className="route-shadow" strokeWidth="5"/><path d={roadHighlight} className="journey-ink" pathLength="1" strokeWidth="2.2"/><path d={roadHighlight} className="journey-dashes" strokeWidth="1" strokeDasharray="2 8"/></g>}
        <text x="664" y="280" className="geographic-label land-label" textAnchor="middle">THE LONE-LANDS</text>
        <text x="1360" y="343" className="geographic-label mountain-label" textAnchor="middle" transform="rotate(67 1360 343)">MISTY MOUNTAINS</text>
      </svg>
      {route&&<div className="traveller" style={{offsetPath:`path('${road}')`}}><span className="traveller-halo"/><span className="traveller-point"/></div>}
      {warmLights.map((p,i)=><span key={i} className="settlement-light" style={{left:p.x,top:p.y,animationDelay:`-${i*1.7}s`,...(i<3?{opacity:windowLightAt(hour,i*2)}:{})}}/>)}
      <div className="valley-mists">{mistPatches.map((p,i)=><span key={i} className="valley-mist" style={{left:p.x,top:p.y,width:p.w,height:p.h,animationDelay:`${p.delay}s`}}/>)}</div>
    </div>
    <div className="western-sheet">
      <Image className="map-art" src={assetPath('/images/eriador-west.jpg')} alt="" width={1500} height={1000} unoptimized loading="eager" draggable={false} onLoad={onWestLoad} onError={onError}/>
      <div className="map-light-wash"/><div className="map-night-wash"/>
      <div className="gulf-shimmer"/>
      <MapAtmosphere chimneyPoints={westernChimneys}/>
      <svg className="map-ink" viewBox="0 0 1500 1000" fill="none">
        <path className="river-underlight" d={westernRivers} stroke="#b4dfd5" strokeWidth="3"/>
        <path className="river-current" d={westernRivers} stroke="#e3f6e7" strokeWidth="1.8" strokeDasharray="2 30 7 65"/>
        {route&&<g className="journey-drawing"><path d={westernRoad} className="route-shadow" strokeWidth="5"/><path d={westernRoad} className="journey-ink" pathLength="1" strokeWidth="2.2"/><path d={westernSpur} className="journey-dashes" strokeWidth="1.4" strokeDasharray="2 8"/></g>}
        <text x="765" y="315" className="geographic-label land-label" textAnchor="middle">THE SHIRE</text>
        <text x="255" y="466" className="geographic-label sea-label" textAnchor="middle">GULF OF LUNE</text>
        <text x="795" y="166" className="geographic-label lake-label" textAnchor="middle">LAKE EVENDIM</text>
        <text x="1110" y="600" className="geographic-label forest-label" textAnchor="middle">OLD FOREST</text>
        <text x="410" y="185" className="geographic-label mountain-label" textAnchor="middle" transform="rotate(-68 410 185)">BLUE MOUNTAINS</text>
      </svg>
      {westernLights.map((p,i)=><span key={i} className="settlement-light" style={{left:p.x,top:p.y,opacity:windowLightAt(hour,i),animationDelay:`-${i*1.5}s`}}/>)}
      <div className="valley-mists">{westernMist.map((p,i)=><span key={i} className="valley-mist" style={{left:p.x,top:p.y,width:p.w,height:p.h,animationDelay:`${p.delay}s`}}/>)}</div>
    </div>
    {route&&<svg className="map-join-route" viewBox="0 0 2500 1000" fill="none"><path d="M1132 468 C1190 477 1230 466 1284.18 481.45" className="journey-dashes" strokeWidth="2" strokeDasharray="2 8"/></svg>}
  </>;
}
