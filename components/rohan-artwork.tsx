import { assetPath } from '@/lib/atlas/asset-path';
import { ROHAN_OFFSET, ROHAN_WIDTH, ROHAN_HEIGHT, ROHAN_PAINT_HEIGHT, rohanRivers, rohanMist, rohanFlocks, rohanLights } from '@/lib/atlas/rohan-illustration';
import { MapAtmosphere } from './map-atmosphere';

export function RohanArtwork() {
  return <div className="rohan-sheet" style={{top:ROHAN_OFFSET,width:ROHAN_WIDTH,height:ROHAN_HEIGHT,maskImage:`url('${assetPath('/images/atlas-masks/rohan.png')}')`}}>
    <div className="map-light-wash"/><div className="map-night-wash"/>
    <MapAtmosphere chimneyPoints={rohanLights.slice(0,2)} flockPaths={rohanFlocks}/>
    <svg className="map-ink" viewBox={`0 0 ${ROHAN_WIDTH} ${ROHAN_PAINT_HEIGHT}`} fill="none" style={{width:ROHAN_WIDTH,height:ROHAN_PAINT_HEIGHT}}>
      <path className="river-underlight" d={rohanRivers} stroke="#b4dfd5" strokeWidth="3"/>
      <path className="river-current" d={rohanRivers} stroke="#e3f6e7" strokeWidth="1.8" strokeDasharray="2 30 7 65"/>
      <text x="2540" y="400" className="geographic-label rohan-label" textAnchor="middle">ROHAN</text>
      <text x="2050" y="430" className="geographic-label southern-sublabel" textAnchor="middle">GAP OF ROHAN</text>
      <text x="2220" y="960" className="geographic-label mountain-label" textAnchor="middle" transform="rotate(10 2220 960)">WHITE MOUNTAINS</text>
      <text x="3100" y="470" className="geographic-label southern-sublabel" textAnchor="middle">EAST EMNET</text>
      <text x="3300" y="340" className="geographic-label southern-sublabel" textAnchor="middle">EMYN MUIL</text>
      <text x="3510" y="740" className="geographic-label lake-label" textAnchor="middle">NEN HITHOEL</text>
    </svg>
    {rohanLights.map((p,i)=><span key={i} className="settlement-light" style={{left:p.x,top:p.y,animationDelay:`-${i*1.7}s`}}/>)}
    <div className="valley-mists">{rohanMist.map((p,i)=><span key={i} className="valley-mist" style={{left:p.x,top:p.y,width:p.w,height:p.h,animationDelay:`${p.delay}s`}}/>)}</div>
  </div>;
}
