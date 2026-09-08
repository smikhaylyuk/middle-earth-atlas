'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Clock3, Compass, Home, Minus, Plus, Sun, Sunrise, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { places, type LightMode, type PlaceId } from '@/lib/atlas/terrain';
import type { AtlasScene } from '@/lib/atlas/scene';
import { registerAtlasTools } from '@/lib/atlas/webmcp';

export default function Atlas() {
  const mount=useRef<HTMLDivElement>(null), scene=useRef<AtlasScene|null>(null);
  const labels=useRef<(HTMLButtonElement|null)[]>([]), compass=useRef<SVGSVGElement>(null);
  const [ready,setReady]=useState(false),[error,setError]=useState('');
  const [selected,setSelected]=useState<PlaceId|null>(null),[light,setLight]=useState<LightMode>('morning'),[route,setRoute]=useState(true);
  const place=places.find(p=>p.id===selected);
  const state=useRef({place:selected,lighting:light,routeVisible:route});
  useEffect(()=>{state.current={place:selected,lighting:light,routeVisible:route};},[selected,light,route]);
  function focus(id:PlaceId) {setSelected(id);scene.current?.focus(id);}
  function overview(){setSelected(null);scene.current?.overview();}
  function lighting(value:LightMode){setLight(value);scene.current?.lighting(value);}
  function toggleRoute(){setRoute(v=>{scene.current?.showRoute(!v);return !v;});}
  useEffect(()=>{
    if(!ready)return;
    return registerAtlasTools({supportedPlaces:places.map(p=>p.id),read:()=>state.current,focus,overview,lighting,route:visible=>{setRoute(visible);scene.current?.showRoute(visible);}});
  },[ready]);
  useEffect(()=>{
    let disposed=false;
    import('@/lib/atlas/scene').then(async ({createAtlasScene})=>{
      if(disposed||!mount.current)return;
      try {const result=await createAtlasScene(mount.current,labels.current,compass.current);if(disposed){result.dispose();return;}scene.current=result;setReady(true);}
      catch(e){setError(e instanceof Error?e.message:'3D rendering is unavailable.');}
    }).catch(()=>setError('The landscape could not load. Please refresh to try again.'));
    return()=>{disposed=true;scene.current?.dispose();scene.current=null;};
  },[]);
  return <main className={`atlas ${selected?'has-selection':''}`} aria-label="Eriador interactive 3D atlas">
    <div className="world" ref={mount}/>
    <header className="atlas-header">
      <div className="brand">
        <svg className="brand-mark" viewBox="0 0 42 50" fill="none" aria-hidden="true"><path d="M21 1v42M21 8 9 19m12-7 12 11M21 22 4 34m17-6 17 9M21 34 12 44m9-9 8 11M21 1l-3 5m3-5 3 5" stroke="currentColor" strokeWidth="1.2"/><path d="M5 45c8 5 24 5 32 0M6 11 3 6m30 3 3-5" stroke="currentColor" opacity=".5"/><circle cx="7" cy="6" r="1" fill="currentColor"/><circle cx="34" cy="3" r="1" fill="currentColor"/></svg>
        <div><span className="eyebrow">A living atlas of Middle-earth</span><h1>ERIADOR</h1></div>
      </div>
      <div className="header-right"><span className="edition">An autumn in the Third Age</span><div className="light-controls" aria-label="Landscape lighting">
        <Button variant="ghost" aria-label="Morning light" aria-pressed={light==='morning'} onClick={()=>lighting('morning')}><Sun size={14}/><span>Morning</span></Button>
        <Button variant="ghost" aria-label="Golden hour light" aria-pressed={light==='golden'} onClick={()=>lighting('golden')}><Sunrise size={14}/><span>Golden hour</span></Button>
      </div></div>
    </header>
    <div className="region-title"><span>The lands between</span><p>BREE · AMON SÛL · IMLADRIS</p></div>
    <div className="compass" aria-hidden="true"><span>N</span><svg ref={compass} viewBox="0 0 40 48"><path d="M20 2 27 37 20 31 13 37Z" fill="currentColor" opacity=".8"/><path d="m20 2 0 29 7 6Z" fill="#60745b"/><path d="M3 27h34M20 5v39" stroke="currentColor" strokeWidth=".5"/></svg></div>
    <div className="world-labels">{places.map((p,i)=><button key={p.id} ref={el=>{labels.current[i]=el;}} style={{visibility:'hidden'}} className="world-label" aria-label={`Explore ${p.name} on the map`} aria-pressed={selected===p.id} onClick={()=>focus(p.id)}><span className="label-name">{p.name}</span><span className="label-kind">{p.id==='bree'?'The crossroads':p.id==='weathertop'?'Amon Sûl':'Imladris'}</span><i className="label-pin"/></button>)}</div>
    <aside className="story-panel" aria-label="Choose a place">
      <div className="panel-heading"><span className="eyebrow">Chapter I · The road east</span><h2>A little further<br className="desktop-break"/> into the wild.</h2><p>Follow the old road from familiar hearths to the hidden valley.</p></div>
      <nav className="stop-list" aria-label="Journey stops">{places.map((p,i)=><button className="stop-button" key={p.id} aria-pressed={selected===p.id} onClick={()=>focus(p.id)}><span className="stop-number">0{i+1}</span><span><span className="stop-name">{p.name}</span><span className="stop-note">{p.kind}</span></span><ArrowUpRight className="stop-arrow"/></button>)}</nav>
      <div className="panel-bottom"><button className="route-toggle" aria-pressed={route} onClick={toggleRoute}><span className="toggle-track"/>Journey route</button><Button variant="ghost" className="overview-btn" onClick={overview}><Compass size={12}/>Overview</Button></div>
    </aside>
    {place&&<article className="place-card" key={place.id} aria-live="polite"><Button variant="ghost" size="icon" className="close-card" aria-label="Close place details" onClick={()=>{setSelected(null);scene.current?.center();}}><X size={14}/></Button><span className="eyebrow">{place.kind}</span><h2>{place.name}</h2><p className="place-subtitle">{place.subtitle}</p><p className="place-description">{place.description}</p><div className="place-date"><Clock3 size={12}/>{place.date}</div></article>}
    <div className="camera-hint"><span>Drag to orbit</span><span>Scroll to explore</span><span>Right-drag to pan</span></div>
    <footer className="bottom-bar"><div className="prototype-note"><strong>A landscape study</strong> · Original, interpretive terrain<br/>An unofficial Middle-earth fan prototype</div><div className="camera-controls" aria-label="Camera controls"><Button variant="ghost" size="icon" aria-label="Zoom in" onClick={()=>scene.current?.zoom(.8)}><Plus size={16}/></Button><Button variant="ghost" size="icon" aria-label="Zoom out" onClick={()=>scene.current?.zoom(1.25)}><Minus size={16}/></Button><span className="control-separator"/><Button variant="ghost" size="icon" aria-label="Return to overview" onClick={overview}><Home size={15}/></Button></div></footer>
    {!ready&&!error&&<output className="loading-world"><span/><p>Beyond the familiar roads…</p></output>}
    {error&&<div className="error-world" role="alert"><h2>The landscape couldn’t open.</h2><p>{error.includes('WebGL')?'This 3D atlas needs WebGL 2. Try a browser with hardware acceleration enabled.':error}</p><Button onClick={()=>window.location.reload()}>Try again</Button></div>}
  </main>;
}
