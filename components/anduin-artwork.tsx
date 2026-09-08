import { assetPath } from '@/lib/atlas/asset-path';
import { ANDUIN_OFFSET, ANDUIN_WIDTH, ANDUIN_PAINT_HEIGHT, anduinRivers, anduinMist, anduinFlocks, lorienLights } from '@/lib/atlas/anduin-illustration';
import { MapAtmosphere } from './map-atmosphere';

export function AnduinArtwork() {
  return <div className="anduin-sheet" style={{left:ANDUIN_OFFSET,width:ANDUIN_WIDTH,maskImage:`url('${assetPath('/images/atlas-masks/anduin.png')}')`}}>
    <div className="map-light-wash"/><div className="map-night-wash"/>
    <MapAtmosphere chimneyPoints={[]} flockPaths={anduinFlocks}/>
    <svg className="map-ink" viewBox={`0 0 1500 ${ANDUIN_PAINT_HEIGHT}`} fill="none" style={{height:ANDUIN_PAINT_HEIGHT}}>
      <path className="river-underlight" d={anduinRivers} stroke="#b4dfd5" strokeWidth="3"/>
      <path className="river-current" d={anduinRivers} stroke="#e3f6e7" strokeWidth="1.8" strokeDasharray="2 30 7 65"/>
      <text x="415" y="545" className="geographic-label land-label" textAnchor="middle" transform="rotate(-85 415 545)">VALES OF ANDUIN</text>
      <text x="1170" y="700" className="geographic-label forest-label" textAnchor="middle" transform="rotate(84 1170 700)">MIRKWOOD</text>
      <text x="590" y="1460" className="geographic-label lorien-label" textAnchor="middle">LOTHLÓRIEN</text>
      <text x="1200" y="1720" className="geographic-label land-label" textAnchor="middle">BROWN LANDS</text>
    </svg>
    {lorienLights.map((p,i)=><span key={i} className="settlement-light lorien-lamp" style={{left:p.x,top:p.y,animationDelay:`-${i*1.7}s`}}/>)}
    <div className="valley-mists">{anduinMist.map((p,i)=><span key={i} className="valley-mist" style={{left:p.x,top:p.y,width:p.w,height:p.h,animationDelay:`${p.delay}s`}}/>)}</div>
  </div>;
}
