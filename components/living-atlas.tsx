'use client';
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type PointerEvent as ReactPointerEvent } from 'react';
import { ArrowRight, Clock3, Compass, Home, Minus, Pause, Play, Plus, Route, Sun, Sunrise, Sunset, Moon, Wind, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { assetPath } from '@/lib/atlas/asset-path';
import { type LightMode } from '@/lib/atlas/terrain';
import { places, majorPlaces, type PlaceId } from '@/lib/atlas/places';
import { type RegionId } from '@/lib/atlas/world';
import { boundView, placeView, regionView, zoomView, type MapSize, type MapView } from '@/lib/atlas/map-view';
import { registerAtlasTools } from '@/lib/atlas/webmcp';
import { createFrameQueue, wheelPixels } from '@/lib/atlas/frame-queue';
import { clockLabel, dayPhase, phaseHours, type DayPhase, type MotionIntensity } from '@/lib/atlas/day-cycle';
import { useDayCycle } from './use-day-cycle';
import { AtlasPainting, type AtlasPaintingHandle } from './atlas-painting';
import { AtlasLabels, type AtlasLabelsHandle } from './atlas-labels';
import { BreeDiscovery } from './bree-discovery';
import { type BreeDetail } from '@/lib/atlas/bree';
import './living-atlas.css';
import './expanded-atlas.css';
import './anduin-atlas.css';
import './rohan-atlas.css';
import './atlas-rendering.css';

function subscribeMotion(callback:()=>void){const media=window.matchMedia('(prefers-reduced-motion: reduce)');media.addEventListener('change',callback);return()=>media.removeEventListener('change',callback);}
function subscribeVisibility(callback:()=>void){document.addEventListener('visibilitychange',callback);return()=>document.removeEventListener('visibilitychange',callback);}
const visibilitySnapshot=()=>document.visibilityState==='visible';
const regionLabels:Record<RegionId,{label:string;description:string}>={
  all:{label:'All',description:'Show the whole atlas'},
  west:{label:'West',description:'Explore western Eriador'},
  east:{label:'East',description:'Explore eastern Eriador'},
  south:{label:'South',description:'Explore Eregion and the southern lands'},
  anduin:{label:'Anduin',description:'Explore Lórien and the Anduin valley'},
  rohan:{label:'Rohan',description:'Explore Rohan and the Argonath'},
  rauros:{label:'Rauros',description:'Explore Nen Hithoel, Rauros and the Emyn Muil'},
  morannon:{label:'Marshes',description:'Explore the Dead Marshes, Dagorlad and the Black Gate'},
  gondor:{label:'Gondor',description:'Explore Cair Andros, Henneth Annûn, Drúadan Forest and Amon Dîn'},
  lamedon:{label:'Lamedon',description:'Explore Erech, Tarlang’s Neck, Calembel and the crossing of Ethring'},
  morgul:{label:'Morgul Vale',description:'Explore the Cross-roads, Minas Morgul, the mountain stairs and Cirith Ungol'},
  pelennor:{label:'Pelennor',description:'Explore Minas Tirith, Osgiliath, Harlond and Emyn Arnen'},
  mordor:{label:'Mordor',description:'Explore Udûn, the Isenmouthe, Mount Doom and Barad-dûr'},
};
const phaseIcons={morning:Sunrise,day:Sun,evening:Sunset,night:Moon};
const motionSnapshot=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function animateView(from:MapView,target:MapView,paint:(view:MapView)=>void,rememberFrame:(id:number)=>void,complete:()=>void){
  const start=performance.now();
  function tick(now:number){const t=Math.min(1,(now-start)/1150),ease=1-Math.pow(1-t,3);paint({x:from.x+(target.x-from.x)*ease,y:from.y+(target.y-from.y)*ease,scale:from.scale+(target.scale-from.scale)*ease});if(t<1)rememberFrame(requestAnimationFrame(tick));else complete();}
  rememberFrame(requestAnimationFrame(tick));
}

export default function LivingAtlas(){
  const stage=useRef<HTMLDivElement>(null),labels=useRef<AtlasLabelsHandle>(null);
  const size=useRef<MapSize>({width:1000,height:760}),view=useRef<MapView>({x:0,y:0,scale:1}),animation=useRef(0),viewInitialized=useRef(false);
  const painting=useRef<AtlasPaintingHandle>(null);
  const pointers=useRef(new Map<number,{x:number;y:number}>());
  const navigating=useRef(false),settleTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
  const regionNavigation=useRef<HTMLElement>(null);
  const reduced=useSyncExternalStore(subscribeMotion,motionSnapshot,()=>false);
  const [selected,setSelected]=useState<PlaceId|null>(null),[intensity,setIntensity]=useState<MotionIntensity>('subtle'),[route,setRoute]=useState(true),[motion,setMotion]=useState<boolean|null>(null);
  const [ready,setReady]=useState(false),[failed,setFailed]=useState(false),[dragging,setDragging]=useState(false);
  const [breeDetail,setBreeDetail]=useState<BreeDetail|null>(null);
  const [region,setRegion]=useState<RegionId|null>('all');
  const [browseRegion,setBrowseRegion]=useState<RegionId>('lamedon');
  const paintingLoaded=useCallback(()=>setReady(true),[]),paintingFailed=useCallback(()=>setFailed(true),[]);
  useEffect(()=>{regionNavigation.current?.querySelector<HTMLButtonElement>('button[aria-pressed="true"]')?.scrollIntoView({block:'nearest',inline:'nearest'});},[region]);
  const visible=useSyncExternalStore(subscribeVisibility,visibilitySnapshot,()=>true);
  const running=motion??!reduced,place=places.find(p=>p.id===selected);
  const dockRegion=place?.region??browseRegion;
  const dockPlaces=dockRegion&&dockRegion!=='all'?places.filter(p=>p.region===dockRegion):majorPlaces;
  const {root,hour,displayHour,timeRevision,cycleEnabled,cycleDuration,setTime,setCycle,setDuration,holdForNavigation}=useDayCycle(running,visible);
  const beginNavigation=useCallback(()=>{
    if(settleTimer.current!==null)clearTimeout(settleTimer.current);
    if(navigating.current)return;
    navigating.current=true;
    holdForNavigation(true);
  },[holdForNavigation]);
  const settleNavigation=useCallback(()=>{
    if(settleTimer.current!==null)clearTimeout(settleTimer.current);
    settleTimer.current=setTimeout(()=>{
      settleTimer.current=null;
      if(pointers.current.size)return;
      navigating.current=false;
      holdForNavigation(false);
    },180);
  },[holdForNavigation]);
  const phase=dayPhase(displayHour);
  const state=useRef({place:selected,breeDetail,region,routeVisible:route,motionEnabled:running,motionIntensity:intensity,cycleEnabled,cycleDuration});
  useEffect(()=>{state.current={place:selected,breeDetail,region,routeVisible:route,motionEnabled:running,motionIntensity:intensity,cycleEnabled,cycleDuration};},[selected,breeDetail,region,route,running,intensity,cycleEnabled,cycleDuration]);
  const choosePhase=useCallback((value:DayPhase)=>{setTime(phaseHours[value]);setCycle(false);},[setTime,setCycle]);
  const setLight=useCallback((value:LightMode)=>choosePhase(value==='golden'?'evening':'morning'),[choosePhase]);
  const renderView=useCallback((next:MapView)=>{
    painting.current?.paint(next,size.current);
    labels.current?.paint(next,state.current.place);
  },[]);
  const painter=useRef<ReturnType<typeof createFrameQueue<MapView>>|null>(null);
  const paint=useCallback((next:MapView)=>{
    view.current=next;
    if(!painter.current)painter.current=createFrameQueue(renderView,callback=>requestAnimationFrame(callback),id=>cancelAnimationFrame(id));
    painter.current.push(next);
  },[renderView]);
  useEffect(()=>{labels.current?.paint(view.current,selected);},[selected]);
  useEffect(()=>()=>{painter.current?.cancel();painter.current=null;if(settleTimer.current!==null)clearTimeout(settleTimer.current);},[]);
  const fly=useCallback((target:MapView)=>{
    cancelAnimationFrame(animation.current);
    if(reduced){paint(target);settleNavigation();return;}
    beginNavigation();
    animateView({...view.current},target,paint,id=>{animation.current=id;},settleNavigation);
  },[paint,reduced,beginNavigation,settleNavigation]);
  const focus=useCallback((id:PlaceId)=>{setBreeDetail(null);setRegion(null);setSelected(id);fly(placeView(id,size.current));},[fly]);
  const frameRegion=useCallback((value:RegionId)=>{setBreeDetail(null);setSelected(null);setRegion(value);setBrowseRegion(value);fly(regionView(value,size.current));},[fly]);
  const overview=useCallback(()=>frameRegion('all'),[frameRegion]);
  const exploreBree=useCallback((detail:BreeDetail|null)=>{if(detail&&state.current.place!=='bree')focus('bree');setBreeDetail(detail);},[focus]);
  const zoom=useCallback((factor:number)=>{setRegion(null);fly(zoomView(view.current,size.current,factor));},[fly]);
  useEffect(()=>{
    const element=stage.current;if(!element)return;
    const resize=()=>{cancelAnimationFrame(animation.current);settleNavigation();size.current={width:element.clientWidth,height:element.clientHeight};if(!viewInitialized.current){const initialRegion='lamedon';state.current.region=initialRegion;setRegion(initialRegion);viewInitialized.current=true;}paint(state.current.place?placeView(state.current.place,size.current):state.current.region?regionView(state.current.region,size.current):boundView(view.current,size.current));};
    const observer=new ResizeObserver(resize);observer.observe(element);resize();
    const wheel=(event:WheelEvent)=>{event.preventDefault();setRegion(null);cancelAnimationFrame(animation.current);beginNavigation();const r=element.getBoundingClientRect();paint(zoomView(view.current,size.current,Math.exp(-wheelPixels(event.deltaY,event.deltaMode,size.current.height)*.0013),{x:event.clientX-r.left,y:event.clientY-r.top}));settleNavigation();};
    element.addEventListener('wheel',wheel,{passive:false});
    return()=>{observer.disconnect();element.removeEventListener('wheel',wheel);cancelAnimationFrame(animation.current);};
  },[paint,beginNavigation,settleNavigation]);
  useEffect(()=>{
    if(!ready)return;
    return registerAtlasTools({read:()=>({...state.current,lighting:dayPhase(hour.current),timeOfDay:Math.round(hour.current*100)/100,rendering:painting.current?.diagnostics()}),focus,overview,lighting:setLight,route:setRoute,motion:setMotion,intensity:setIntensity,time:setTime,cycle:setCycle,duration:setDuration,bree:exploreBree,region:frameRegion});
  },[ready,frameRegion,focus,overview,setLight,setTime,setCycle,setDuration,hour,exploreBree]);
  function pointerDown(event:ReactPointerEvent<HTMLDivElement>){
    if((event.target as Element).closest('button')||event.button>0)return;
    event.preventDefault();
    setRegion(null);beginNavigation();event.currentTarget.focus({preventScroll:true});cancelAnimationFrame(animation.current);event.currentTarget.setPointerCapture(event.pointerId);
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
  function pointerUp(event:ReactPointerEvent<HTMLDivElement>){pointers.current.delete(event.pointerId);if(!pointers.current.size){setDragging(false);settleNavigation();}}
  return <div className="atlas-shell"><main ref={root} className={`living-atlas has-day-cycle expanded-atlas ${selected?'is-focused':''} ${running?'is-living':'is-still'} ${!visible?'is-asleep':''} motion-${intensity}`} aria-label="Middle-earth living illustrated atlas">
    {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex -- This composite map application implements pointer and keyboard navigation. */}
    <div className={`map-stage ${dragging?'is-dragging':''}`} ref={stage} role="application" aria-label="Interactive map. Drag to pan, scroll or pinch to zoom. Arrow keys pan; plus and minus zoom." tabIndex={0} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={pointerUp} onLostPointerCapture={pointerUp} onKeyDown={event=>{
      const delta=45,moves:Record<string,[number,number]>={ArrowLeft:[delta,0],ArrowRight:[-delta,0],ArrowUp:[0,delta],ArrowDown:[0,-delta]};
      if(moves[event.key]){event.preventDefault();setRegion(null);cancelAnimationFrame(animation.current);beginNavigation();const [x,y]=moves[event.key];paint(boundView({...view.current,x:view.current.x+x,y:view.current.y+y},size.current));settleNavigation();}
      else if(event.key==='+'||event.key==='='){event.preventDefault();zoom(1.25);}else if(event.key==='-'){event.preventDefault();zoom(.8);}else if(event.key==='Escape')overview();
    }}>
      <AtlasPainting ref={painting} onLoad={paintingLoaded} onError={paintingFailed} hour={hour} timeRevision={timeRevision} running={running} visible={visible&&!breeDetail} intensity={intensity} route={route}/>
      <AtlasLabels ref={labels} selected={selected} onSelect={focus}/>
    </div>
    <div className="map-vignette"/>
    </main>
    <div className={`atlas-interface has-day-cycle expanded-atlas ${selected?'is-focused':''}`}>
    <header className="living-header"><div className="living-brand"><Image src={assetPath('/favicon.svg')} width={36} height={36} alt="" unoptimized/><div><span className="atlas-kicker">A Living Atlas</span><h1>Middle-earth</h1></div></div><div className="atmosphere-controls"><Button variant="ghost" className="life-control intensity-control" aria-label="Lively map motion" aria-pressed={intensity==='lively'} title="Switch between lively and subtle motion" onClick={()=>setIntensity(intensity==='lively'?'subtle':'lively')}><Wind size={15}/><span>{intensity==='lively'?'Lively':'Subtle'}</span></Button><Button variant="ghost" className="life-control" aria-label={running?'Pause all map motion':'Play all map motion'} aria-pressed={running} onClick={()=>setMotion(!running)}>{running?<Pause size={14}/>:<Play size={14}/>}<span>{running?'Pause map':'Motion paused'}</span></Button></div></header>
    <section className="day-cycle-panel" aria-label="Dynamic day and night cycle">
      <div className="cycle-heading"><div><span className="cycle-status">{cycleEnabled&&running?'Day cycle':'Time held'}</span><strong>{phase}<span>{clockLabel(displayHour)}</span></strong></div><Button variant="ghost" className="cycle-speed" aria-label={`Cycle speed ${120/cycleDuration} times. Change speed.`} onClick={()=>setDuration(cycleDuration===120?60:cycleDuration===60?30:120)}>{120/cycleDuration}×</Button><Button variant="ghost" size="icon" className="cycle-play" aria-label={cycleEnabled&&running?'Pause day cycle':'Play day cycle'} aria-pressed={cycleEnabled&&running} onClick={()=>{if(!running){setMotion(true);setCycle(true);}else setCycle(!cycleEnabled);}}>{cycleEnabled&&running?<Pause size={14}/>:<Play size={14}/>}</Button></div>
      <input className="time-scrubber" type="range" min="0" max="24" step="0.01" value={displayHour} aria-label="Time of day" aria-valuetext={`${phase}, ${clockLabel(displayHour)}`} onChange={event=>{setTime(Number(event.target.value));setCycle(false);}}/>
      <div className="cycle-phase-buttons">{(Object.keys(phaseHours) as DayPhase[]).map(value=>{const Icon=phaseIcons[value];return <Button key={value} variant="ghost" aria-label={`Hold ${value} light`} aria-pressed={phase===value} onClick={()=>choosePhase(value)}><Icon size={13}/><span>{value}</span></Button>;})}</div>
    </section>
    <div className="map-edition"><span>WESTERN MIDDLE-EARTH</span><i/>Late Third Age · From Lindon to Mordor</div>
    <div className="paper-compass" aria-hidden="true"><span>N</span><Compass size={40} strokeWidth={.75}/></div>
    <aside className="journey-dock" aria-label="Explore Middle-earth"><div className="dock-heading"><h2>Explore the atlas</h2><nav ref={regionNavigation} className="region-controls" aria-label="Map regions">{(Object.keys(regionLabels) as RegionId[]).map(id=><Button key={id} variant="ghost" aria-label={regionLabels[id].description} aria-pressed={region===id} onClick={()=>frameRegion(id)}>{regionLabels[id].label}</Button>)}</nav><button aria-label="Highlight mapped roads" aria-pressed={route} onClick={()=>setRoute(!route)} className="route-control"><Route size={14}/><span>Road</span><i/></button></div><nav className="journey-stops" aria-label="Choose a place">{dockPlaces.map(p=><button key={p.id} className="journey-stop" aria-pressed={selected===p.id} onClick={()=>focus(p.id)}><span><strong>{p.name}</strong><small>{p.pinSubtitle}</small></span><ArrowRight size={15}/></button>)}</nav></aside>
    {place&&<article className="atlas-folio" key={place.id} aria-live="polite"><Button variant="ghost" className="folio-close" size="icon" aria-label="Close place details" onClick={()=>setSelected(null)}><X size={16}/></Button><span className="folio-kicker">{place.kind}</span><h2>{place.name}</h2><p className="folio-subtitle">{place.subtitle}</p>{place.id==='bree'&&<Button className="bree-invitation" onClick={()=>exploreBree('prancing-pony')} aria-haspopup="dialog"><div><small>At the inn</small><span>The Prancing Pony</span></div><ArrowRight size={20}/></Button>}<p className="folio-description">{place.description}</p>{place.date&&<div className="folio-date"><Clock3 size={13}/>{place.date}</div>}<a className="folio-source" href={place.source} target="_blank" rel="noreferrer">{place.sourceLabel} ↗</a></article>}
    <footer className="living-footer"><span>An unofficial illustrated atlas of Tolkien’s world</span><div className="map-gesture-hint">Drag to wander <i/> Scroll to look closer</div><div className="map-controls" aria-label="Map controls"><Button variant="ghost" size="icon" aria-label="Zoom in" onClick={()=>zoom(1.25)}><Plus size={17}/></Button><Button variant="ghost" size="icon" aria-label="Zoom out" onClick={()=>zoom(.8)}><Minus size={17}/></Button><span/><Button variant="ghost" size="icon" aria-label="Return to overview" onClick={overview}><Home size={16}/></Button></div></footer>
    </div>
    <BreeDiscovery detail={breeDetail} onDetail={exploreBree} hour={displayHour} cyclePlaying={cycleEnabled&&running} motionEnabled={running} onTime={value=>{setTime(value);setCycle(false);}} onPlayCycle={()=>{if(!running){setMotion(true);setCycle(true);}else setCycle(!cycleEnabled);}} onPauseMotion={()=>setMotion(!running)}/>
    {(!ready)&&!failed&&<output className="map-loading"><Compass size={36} strokeWidth={.7}/><span>Unfolding the map…</span></output>}
    {failed&&<div className="map-failure" role="alert"><h2>The map couldn’t load.</h2><p>Please refresh to try again.</p><Button onClick={()=>window.location.reload()}>Try again</Button></div>}
  </div>;
}
