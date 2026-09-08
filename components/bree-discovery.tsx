'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { assetPath } from '@/lib/atlas/asset-path';
import { ArrowLeft, ArrowUpRight, Moon, Pause, Play, Sun, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { breeDetails, innChimneys, innWindows, windowLightAt, type BreeDetail } from '@/lib/atlas/bree';
import { clockLabel, dayPhase } from '@/lib/atlas/day-cycle';
import './bree-discovery.css';

type Props = {
  detail: BreeDetail | null;
  onDetail: (detail: BreeDetail | null) => void;
  hour: number;
  cyclePlaying: boolean;
  motionEnabled: boolean;
  onTime: (hour: number) => void;
  onPlayCycle: () => void;
  onPauseMotion: () => void;
};

export function BreeDiscovery({detail,onDetail,hour,cyclePlaying,motionEnabled,onTime,onPlayCycle,onPauseMotion}:Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const open = detail !== null;
  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (open && !element.open) element.showModal();
    else if (!open && element.open) element.close();
  }, [open]);
  const entry = breeDetails[detail ?? 'prancing-pony'];
  return <dialog ref={dialog} className="bree-discovery" aria-labelledby="bree-discovery-title" onCancel={()=>onDetail(null)}>
    {open&&<>
      <header className="bree-heading"><div><span className="bree-eyebrow">Bree · Along the East Road</span><h2 id="bree-discovery-title">The Prancing Pony</h2></div><Button variant="ghost" size="icon" aria-label="Return to the map" className="bree-close" onClick={()=>onDetail(null)}><X size={20}/></Button></header>
      <div className="bree-body">
        <div className="bree-picture-column">
          <div className="inn-scene">
            <Image className="inn-art" src={assetPath('/images/prancing-pony.jpg')} alt="Painted interpretation of the Prancing Pony, with a three-storey front and courtyard beneath Bree-hill." width={1536} height={1024} unoptimized draggable={false}/>
            <div className="inn-night" aria-hidden="true"/><div className="inn-sunset" aria-hidden="true"/>
            <div className="inn-lights" aria-hidden="true">{innWindows.map((p,i)=><span className="inn-window" key={i} style={{left:`${p.x}%`,top:`${p.y}%`,opacity:windowLightAt(hour,i),animationDelay:`-${i*1.3}s`}}/>)}</div>
            <svg className="inn-window-panes" viewBox="0 0 1536 1024" aria-hidden="true">{innWindows.map((p,i)=><polygon key={i} points={p.panes} style={{opacity:windowLightAt(hour,i)*.45}}/>)}</svg>
            <span className="inn-sign-lamp" style={{opacity:windowLightAt(hour,0)}} aria-hidden="true"/>
            <div className="inn-hearths" aria-hidden="true">{innChimneys.map((p,i)=><div className="inn-chimney" key={i} style={{left:`${p.x}%`,top:`${p.y}%`}}>{[0,1,2].map(j=><span className="chimney-wisp" key={j} style={{animationDelay:`-${j*3.4+i*1.8}s`}}/>)}</div>)}</div>
            <Button variant="ghost" className="inn-hotspot hotspot-sign" aria-label="Discover the pony sign" aria-pressed={detail==='sign'} onClick={()=>onDetail('sign')}>02</Button>
            <Button variant="ghost" className="inn-hotspot hotspot-courtyard" aria-label="Discover the courtyard" aria-pressed={detail==='courtyard'} onClick={()=>onDetail('courtyard')}>03</Button>
          </div>
          <div className="bree-scene-caption"><span>29 September · Third Age 3018</span><span>Illustrated interpretation</span></div>
          <div className="bree-clock">
            <div className="bree-clock-label"><span>{dayPhase(hour)}</span><time>{clockLabel(hour)}</time><span className="bree-clock-status">{cyclePlaying?'Day cycle':'Time held'}</span></div>
            <div className="bree-clock-controls"><Button variant="ghost" aria-label="Hold daylight at the inn" onClick={()=>onTime(13)}><Sun size={16}/></Button><input type="range" className="time-scrubber" min="0" max="23.99" step=".01" value={hour} aria-label="Time of day at the Prancing Pony" aria-valuetext={clockLabel(hour)} onChange={event=>onTime(Number(event.target.value))}/><Button variant="ghost" aria-label="Hold night at the inn" onClick={()=>onTime(23)}><Moon size={16}/></Button><Button variant="ghost" className="bree-cycle-play" aria-label={cyclePlaying?'Pause inn day cycle':'Play inn day cycle'} onClick={onPlayCycle}>{cyclePlaying?<Pause size={16}/>:<Play size={16}/>}</Button></div>
          </div>
        </div>
        <aside className="bree-notes" aria-label="Discover the Prancing Pony">
          <span className="bree-eyebrow">Around the inn</span>
          <nav className="bree-discoveries" aria-label="Inn details">{(Object.keys(breeDetails) as BreeDetail[]).map((id,i)=><Button key={id} variant="ghost" className="bree-discovery-choice" aria-pressed={detail===id} onClick={()=>onDetail(id)}><span>0{i+1}</span>{breeDetails[id].label}<ArrowUpRight size={15}/></Button>)}</nav>
          <article className="bree-detail-copy" aria-live="polite"><h3>{entry.title}</h3><p>{entry.text}</p></article>
          <a className="bree-source" href="https://tolkiengateway.net/wiki/The_Prancing_Pony" target="_blank" rel="noreferrer">The Fellowship of the Ring<br/><span>Book I, chapter 9 · Reference notes ↗</span></a>
          <div className="bree-note-footer"><Button variant="ghost" onClick={()=>onDetail(null)}><ArrowLeft size={15}/> Back to Bree</Button><Button variant="ghost" onClick={onPauseMotion} aria-label={motionEnabled?'Pause all inn and map motion':'Resume all inn and map motion'}>{motionEnabled?<Pause size={14}/>:<Play size={14}/>}</Button></div>
        </aside>
      </div>
    </>}
  </dialog>;
}
