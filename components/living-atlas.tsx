'use client';
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type PointerEvent as ReactPointerEvent } from 'react';
import { ArrowRight, Clock3, Compass, Home, Minus, Pause, Play, Plus, Route, Sun, Sunrise, Sunset, Moon, Wind, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { assetPath } from '@/lib/atlas/asset-path';
import { type LightMode } from '@/lib/atlas/terrain';
import { places, majorPlaces, type PlaceId } from '@/lib/atlas/places';
import { MAP_WIDTH, MAP_HEIGHT, type RegionId } from '@/lib/atlas/world';
import { boundView, mapPlaces, placeView, regionView, zoomView, type MapSize, type MapView } from '@/lib/atlas/map-view';
import { registerAtlasTools } from '@/lib/atlas/webmcp';
import { clockLabel, dayPhase, phaseHours, type DayPhase, type MotionIntensity } from '@/lib/atlas/day-cycle';
import { useDayCycle } from './use-day-cycle';
import { AtlasArtwork } from './atlas-artwork';
import { BreeDiscovery } from './bree-discovery';
import { type BreeDetail } from '@/lib/atlas/bree';
import './living-atlas.css';
import './expanded-atlas.css';
import './anduin-atlas.css';

function subscribeMotion(callback:()=>void){const media=window.matchMedia('(prefers-reduced-motion: reduce)');media.addEventListener('change',callback);return()=>media.removeEventListener('change',callback);}
function subscribeVisibility(callback:()=>void){document.addEventListener('visibilitychange',callback);return()=>document.removeEventListener('visibilitychange',callback);}
const visibilitySnapshot=()=>document.visibilityState==='visible';
const phaseIcons={morning:Sunrise,day:Sun,evening:Sunset,night:Moon};
const motionSnapshot=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function animateView(from:MapView,target:MapView,paint:(view:MapView)=>void,rememberFrame:(id:number)=>void){
  const start=performance.now();
  function tick(now:number){const t=Math.min(1,(now-start)/1150),ease=1-Math.pow(1-t,3);paint({x:from.x+(target.x-from.x)*ease,y:from.y+(target.y-from.y)*ease,scale:from.scale+(target.scale-from.scale)*ease});if(t<1)rememberFrame(requestAnimationFrame(tick));}
  rememberFrame(requestAnimationFrame(tick));
}

export default function LivingAtlas(){
  const stage=useRef<HTMLDivElement>(null),world=useRef<HTMLDivElement>(null),labels=useRef<(HTMLButtonElement|null)[]>([]);
  const size=useRef<MapSize>({width:1000,height:760}),view=useRef<MapView>({x:0,y:0,scale:1}),animation=useRef(0),viewInitialized=useRef(false);
  const pointers=useRef(new Map<number,{x:number;y:number}>());
  const reduced=useSyncExternalStore(subscribeMotion,motionSnapshot,()=>false);
  const [selected,setSelected]=useState<PlaceId|null>(null),[intensity,setIntensity]=useState<MotionIntensity>('lively'),[route,setRoute]=useState(true),[motion,setMotion]=useState<boolean|null>(null);
  const [ready,setReady]=useState(false),[failed,setFailed]=useState(false),[dragging,setDragging]=useState(false);
  const [breeDetail,setBreeDetail]=useState<BreeDetail|null>(null);
  const [southReady,setSouthReady]=useState(false),[anduinReady,setAnduinReady]=useState(false);
  const [westReady,setWestReady]=useState(false),[region,setRegion]=useState<RegionId|null>('all');
  const visible=useSyncExternalStore(subscribeVisibility,visibilitySnapshot,()=>true);
  const running=motion??!reduced,place=places.find(p=>p.id===selected);
  const dockRegion=place?.region??region;
  const dockPlaces=dockRegion&&dockRegion!=='all'?places.filter(p=>p.region===dockRegion):majorPlaces;
  const {root,hour,displayHour,cycleEnabled,cycleDuration,setTime,setCycle,setDuration}=useDayCycle(running,visible);
  const phase=dayPhase(displayHour);
  const state=useRef({place:selected,breeDetail,region,routeVisible:route,motionEnabled:running,motionIntensity:intensity,cycleEnabled,cycleDuration});
  useEffect(()=>{state.current={place:selected,breeDetail,region,routeVisible:route,motionEnabled:running,motionIntensity:intensity,cycleEnabled,cycleDuration};},[selected,breeDetail,region,route,running,intensity,cycleEnabled,cycleDuration]);
  const choosePhase=useCallback((value:DayPhase)=>{setTime(phaseHours[value]);setCycle(false);},[setTime,setCycle]);
  const setLight=useCallback((value:LightMode)=>choosePhase(value==='golden'?'evening':'morning'),[choosePhase]);
  const paint=useCallback((next:MapView)=>{
    view.current=next;
    if(world.current)world.current.style.transform=`translate3d(${next.x}px,${next.y}px,0) scale(${next.scale})`;
    if(stage.current)stage.current.dataset.density=next.scale<.38?'overview':'detail';
    places.forEach((p,i)=>{const point=mapPlaces[p.id],label=labels.current[i];if(label){label.style.transform=`translate(${next.x+point.x*next.scale}px,${next.y+point.y*next.scale}px) translate(-50%, 20px)`;const shownAtOverview=['grey-havens','bree','rivendell','tharbad','moria-west-gate','isengard','caras-galadhon','dol-guldur','gladden-fields'].includes(p.id);label.style.visibility=(p.major&&(next.scale>=.28||shownAtOverview))||next.scale>=.62||state.current.place===p.id?'visible':'hidden';}});
  },[]);
  const fly=useCallback((target:MapView)=>{
    cancelAnimationFrame(animation.current);
    if(reduced){paint(target);return;}
    animateView({...view.current},target,paint,id=>{animation.current=id;});
  },[paint,reduced]);
  const focus=useCallback((id:PlaceId)=>{setBreeDetail(null);setRegion(null);setSelected(id);fly(placeView(id,size.current));},[fly]);
  const frameRegion=useCallback((value:RegionId)=>{setBreeDetail(null);setSelected(null);setRegion(value);fly(regionView(value,size.current));},[fly]);
  const overview=useCallback(()=>frameRegion('all'),[frameRegion]);
  const exploreBree=useCallback((detail:BreeDetail|null)=>{if(detail&&state.current.place!=='bree')focus('bree');setBreeDetail(detail);},[focus]);
  const zoom=useCallback((factor:number)=>{setRegion(null);fly(zoomView(view.current,size.current,factor));},[fly]);
  useEffect(()=>{
    const element=stage.current;if(!element)return;
    const resize=()=>{cancelAnimationFrame(animation.current);size.current={width:element.clientWidth,height:element.clientHeight};if(!viewInitialized.current){const initialRegion='anduin';state.current.region=initialRegion;setRegion(initialRegion);viewInitialized.current=true;}paint(state.current.place?placeView(state.current.place,size.current):state.current.region?regionView(state.current.region,size.current):boundView(view.current,size.current));};
    const observer=new ResizeObserver(resize);observer.observe(element);resize();
    const wheel=(event:WheelEvent)=>{event.preventDefault();setRegion(null);cancelAnimationFrame(animation.current);const r=element.getBoundingClientRect();paint(zoomView(view.current,size.current,Math.exp(-event.deltaY*.0013),{x:event.clientX-r.left,y:event.clientY-r.top}));};
    element.addEventListener('wheel',wheel,{passive:false});
    return()=>{observer.disconnect();element.removeEventListener('wheel',wheel);cancelAnimationFrame(animation.current);};
  },[paint]);
  useEffect(()=>{
    if(!ready||!westReady||!southReady||!anduinReady)return;
    return registerAtlasTools({read:()=>({...state.current,lighting:dayPhase(hour.current),timeOfDay:Math.round(hour.current*100)/100}),focus,overview,lighting:setLight,route:setRoute,motion:setMotion,intensity:setIntensity,time:setTime,cycle:setCycle,duration:setDuration,bree:exploreBree,region:frameRegion});
  },[ready,westReady,southReady,anduinReady,frameRegion,focus,overview,setLight,setTime,setCycle,setDuration,hour,exploreBree]);
  function pointerDown(event:ReactPointerEvent<HTMLDivElement>){
    if((event.target as Element).closest('button')||event.button>0)return;
    setRegion(null);event.currentTarget.focus({preventScroll:true});cancelAnimationFrame(animation.current);event.currentTarget.setPointerCapture(event.pointerId);
    pointers.current.set(event.pointerId,{x:event.clientX,y:event.clientY});setDragging(true);
  }
  function pointerMove(event:ReactPointerEvent<HTMLDivElement>){
    const previous=pointers.current.get(event.pointerId);if(!previous)return;
    const before=[...pointers.current.values()];pointers.current.set(event.pointerId,{x:event.clientX,y:event.clientY});
    const after=[...pointers.current.values()];
    if(after.length===2){
      const r=event.currentTarget.getBoundingClientRect(),oldDistance=Math.hypot(before[0].x-before[1].x,before[0].y-before[1].y),newDistance=Math.hypot(after[0].x-after[1].x,after[0].y-after[1].y);
      const center={x:(after[0].x+after[1].x)/2-r.left,y:(after[0].y+after[1].y)/2-r.top};
      if(oldDistance>1)paint(zoomView(view.current,size.current,newDistance/oldDistance,center));
    }else paint(boundView({...view.current,x:view.current.x+event.clientX-previous.x,y:view.current.y+event.clientY-previous.y},size.current));
  }
  function pointerUp(event:ReactPointerEvent<HTMLDivElement>){pointers.current.delete(event.pointerId);if(!pointers.current.size)setDragging(false);}
  return <main ref={root} className={`living-atlas has-day-cycle expanded-atlas ${selected?'is-focused':''} ${running?'is-living':'is-still'} ${!visible?'is-asleep':''} motion-${intensity}`} aria-label="Eriador living illustrated atlas">
    {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex -- This composite map application implements pointer and keyboard navigation. */}
    <div className={`map-stage ${dragging?'is-dragging':''}`} ref={stage} role="application" aria-label="Interactive map. Drag to pan, scroll or pinch to zoom. Arrow keys pan; plus and minus zoom." tabIndex={0} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={pointerUp} onKeyDown={event=>{
      const delta=45,moves:Record<string,[number,number]>={ArrowLeft:[delta,0],ArrowRight:[-delta,0],ArrowUp:[0,delta],ArrowDown:[0,-delta]};
      if(moves[event.key]){event.preventDefault();setRegion(null);cancelAnimationFrame(animation.current);const [x,y]=moves[event.key];paint(boundView({...view.current,x:view.current.x+x,y:view.current.y+y},size.current));}
      else if(event.key==='+'||event.key==='='){event.preventDefault();zoom(1.25);}else if(event.key==='-'){event.preventDefault();zoom(.8);}else if(event.key==='Escape')overview();
    }}>
      <div className="map-content" ref={world} style={{width:MAP_WIDTH,height:MAP_HEIGHT}} aria-hidden="true">
        <AtlasArtwork hour={displayHour} route={route} onEastLoad={()=>setReady(true)} onWestLoad={()=>setWestReady(true)} onSouthLoad={()=>setSouthReady(true)} onAnduinLoad={()=>setAnduinReady(true)} onError={()=>setFailed(true)}/>
      </div>
      <div className="map-pins">{places.map((p,i)=><button key={p.id} className={`map-pin pin-${p.id} ${p.major?'pin-major':'pin-minor'}`} ref={el=>{labels.current[i]=el;}} style={{visibility:'hidden'}} aria-label={`Explore ${p.name} on the map`} aria-pressed={selected===p.id} onClick={()=>focus(p.id)}><span className="pin-stem"/><span className="pin-title"><span className="pin-full-name">{p.name}</span><span className="pin-overview-name">{p.overviewLabel}</span></span><span className="pin-subtitle">{p.pinSubtitle}</span></button>)}</div>
    </div>
    <div className="map-vignette"/>
    <header className="living-header"><div className="living-brand"><Image src={assetPath('/favicon.svg')} width={36} height={36} alt="" unoptimized/><div><span className="atlas-kicker">A living atlas of Middle-earth</span><h1>Eriador</h1></div></div><div className="atmosphere-controls"><Button variant="ghost" className="life-control intensity-control" aria-label="Lively map motion" aria-pressed={intensity==='lively'} title="Switch between lively and subtle motion" onClick={()=>setIntensity(intensity==='lively'?'subtle':'lively')}><Wind size={15}/><span>{intensity==='lively'?'Lively':'Subtle'}</span></Button><Button variant="ghost" className="life-control" aria-label={running?'Pause all map motion':'Play all map motion'} aria-pressed={running} onClick={()=>setMotion(!running)}>{running?<Pause size={14}/>:<Play size={14}/>}<span>{running?'Pause map':'Motion paused'}</span></Button></div></header>
    <section className="day-cycle-panel" aria-label="Dynamic day and night cycle">
      <div className="cycle-heading"><div><span className="cycle-status">{cycleEnabled&&running?'Day cycle':'Time held'}</span><strong>{phase}<span>{clockLabel(displayHour)}</span></strong></div><Button variant="ghost" className="cycle-speed" aria-label={`Cycle speed ${120/cycleDuration} times. Change speed.`} onClick={()=>setDuration(cycleDuration===120?60:cycleDuration===60?30:120)}>{120/cycleDuration}×</Button><Button variant="ghost" size="icon" className="cycle-play" aria-label={cycleEnabled&&running?'Pause day cycle':'Play day cycle'} aria-pressed={cycleEnabled&&running} onClick={()=>{if(!running){setMotion(true);setCycle(true);}else setCycle(!cycleEnabled);}}>{cycleEnabled&&running?<Pause size={14}/>:<Play size={14}/>}</Button></div>
      <input className="time-scrubber" type="range" min="0" max="24" step="0.01" value={displayHour} aria-label="Time of day" aria-valuetext={`${phase}, ${clockLabel(displayHour)}`} onChange={event=>{setTime(Number(event.target.value));setCycle(false);}}/>
      <div className="cycle-phase-buttons">{(Object.keys(phaseHours) as DayPhase[]).map(value=>{const Icon=phaseIcons[value];return <Button key={value} variant="ghost" aria-label={`Hold ${value} light`} aria-pressed={phase===value} onClick={()=>choosePhase(value)}><Icon size={13}/><span>{value}</span></Button>;})}</div>
    </section>
    <div className="map-edition"><span>WESTERN MIDDLE-EARTH</span><i/>Late Third Age · From Lindon to Lórien</div>
    <div className="paper-compass" aria-hidden="true"><span>N</span><Compass size={40} strokeWidth={.75}/></div>
    <div className="journey-caption"><span className="caption-line"/><span>There is a road beyond every familiar place.</span></div>
    <aside className="journey-dock" aria-label="Explore Eriador"><div className="dock-heading"><h2>Explore the atlas</h2><nav className="region-controls" aria-label="Map regions">{(['all','west','east','south','anduin'] as RegionId[]).map(id=><Button key={id} variant="ghost" aria-label={id==='all'?'Show the whole atlas':id==='anduin'?'Explore Lórien and the Anduin valley':id==='south'?'Explore Eregion and the southern lands':`Explore ${id==='west'?'western':'eastern'} Eriador`} aria-pressed={region===id} onClick={()=>frameRegion(id)}>{id==='all'?'All':id==='west'?'West':id==='east'?'East':id==='south'?'South':'Anduin'}</Button>)}</nav><button aria-label="Show illustrated roads" aria-pressed={route} onClick={()=>setRoute(!route)} className="route-control"><Route size={14}/><span>Road</span><i/></button></div><nav className="journey-stops" aria-label="Choose a place">{dockPlaces.map(p=><button key={p.id} className="journey-stop" aria-pressed={selected===p.id} onClick={()=>focus(p.id)}><span><strong>{p.name}</strong><small>{p.pinSubtitle}</small></span><ArrowRight size={15}/></button>)}</nav></aside>
    {place&&<article className="atlas-folio" key={place.id} aria-live="polite"><Button variant="ghost" className="folio-close" size="icon" aria-label="Close place details" onClick={()=>setSelected(null)}><X size={16}/></Button><span className="folio-kicker">{place.kind}</span><h2>{place.name}</h2><p className="folio-subtitle">{place.subtitle}</p>{place.id==='bree'&&<Button className="bree-invitation" onClick={()=>exploreBree('prancing-pony')} aria-haspopup="dialog"><div><small>At the inn</small><span>The Prancing Pony</span></div><ArrowRight size={20}/></Button>}<p className="folio-description">{place.description}</p>{place.date&&<div className="folio-date"><Clock3 size={13}/>{place.date}</div>}<a className="folio-source" href={place.source} target="_blank" rel="noreferrer">{place.sourceLabel} ↗</a></article>}
    <BreeDiscovery detail={breeDetail} onDetail={exploreBree} hour={displayHour} cyclePlaying={cycleEnabled&&running} motionEnabled={running} onTime={value=>{setTime(value);setCycle(false);}} onPlayCycle={()=>{if(!running){setMotion(true);setCycle(true);}else setCycle(!cycleEnabled);}} onPauseMotion={()=>setMotion(!running)}/>
    <footer className="living-footer"><span>Illustrated interpretation · Unofficial fan atlas</span><div className="map-gesture-hint">Drag to wander <i/> Scroll to look closer</div><div className="map-controls" aria-label="Map controls"><Button variant="ghost" size="icon" aria-label="Zoom in" onClick={()=>zoom(1.25)}><Plus size={17}/></Button><Button variant="ghost" size="icon" aria-label="Zoom out" onClick={()=>zoom(.8)}><Minus size={17}/></Button><span/><Button variant="ghost" size="icon" aria-label="Return to overview" onClick={overview}><Home size={16}/></Button></div></footer>
    {(!ready||!westReady||!southReady||!anduinReady)&&!failed&&<output className="map-loading"><Compass size={36} strokeWidth={.7}/><span>Unfolding the map…</span></output>}
    {failed&&<div className="map-failure" role="alert"><h2>The map couldn’t load.</h2><p>Please refresh to try again.</p><Button onClick={()=>window.location.reload()}>Try again</Button></div>}
  </main>;
}
