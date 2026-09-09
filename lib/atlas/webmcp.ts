import { type LightMode } from './terrain';
import { places, type PlaceId } from './places';
import type { RegionId } from './world';
import type { DayPhase, MotionIntensity } from './day-cycle';
import { isBreeDetail, type BreeDetail } from './bree';
type AtlasState={place:PlaceId|null;region?:RegionId|null;breeDetail?:BreeDetail|null;lighting:LightMode|DayPhase;routeVisible:boolean;motionEnabled?:boolean;motionIntensity?:MotionIntensity;timeOfDay?:number;cycleEnabled?:boolean;cycleDuration?:number};
type Tool={name:string;title:string;description:string;inputSchema:object;annotations:{readOnlyHint:boolean;untrustedContentHint:boolean};execute:(input:unknown)=>unknown};
type ModelContext={registerTool:(tool:Tool,options:{signal:AbortSignal})=>void|Promise<void>};
export function registerAtlasTools<TPlace extends PlaceId=PlaceId>(actions:{supportedPlaces?:readonly TPlace[];read:()=>AtlasState;focus:(id:TPlace)=>void;overview:()=>void;lighting:(mode:LightMode)=>void;route:(visible:boolean)=>void;motion?:(enabled:boolean)=>void;intensity?:(value:MotionIntensity)=>void;time?:(hour:number)=>void;cycle?:(enabled:boolean)=>void;duration?:(seconds:number)=>void;bree?:(detail:BreeDetail|null)=>void;region?:(region:RegionId)=>void}) {
  const context=(document as Document & {modelContext?:ModelContext}).modelContext;
  if(!context?.registerTool)return()=>{};
  const lifecycle=new AbortController();
  const availablePlaces:readonly PlaceId[]=actions.supportedPlaces??places.map(p=>p.id);
  const afterPaint=()=>new Promise<void>(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve())));
  const tools:Tool[]=[{
    name:'read_atlas_view',title:'Read atlas view',description:'Read the selected Eriador place and region, open Bree detail, illustrated route visibility, motion settings and current time, phase, duration and play state of the dynamic day cycle.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:false},
    execute(input){if(!input||typeof input!=='object'||Array.isArray(input)||Object.keys(input).length)throw new Error('Expected an empty object.');return actions.read();},
  },{
    name:'configure_atlas_view',title:'Explore Eriador',description:'Explore Eriador and its southern borders, from the Grey Havens and Rivendell through Eregion and Moria to Isengard, east across the mountains to Lórien and the Anduin valley, and south into Rohan as far as Edoras, Dunharrow and the Argonath, then through Nen Hithoel to Rauros and Nindalf, east across Emyn Muil to the Dead Marshes, Dagorlad and the Black Gate, then through Udûn and the Isenmouthe to Mount Doom and Barad-dûr, and down the Anduin to Cair Andros, Henneth Annûn, Drúadan Forest and Amon Dîn. region frames west, east, south, anduin, rohan, rauros, morannon, mordor, gondor or all; it cannot be combined with place or an open Bree detail. Explore a place and configure atmosphere. breeDetail opens the Prancing Pony detail view in Bree and selects a book-based point of interest; closed returns to the map. Opening a Bree detail cannot be combined with another place. Navigating to a place closes an open detail. routeVisible shows the illustrative road, not Frodo’s exact itinerary. The artwork is an interpretation. timeOfDay sets a 0–24 hour clock shared by the map and inn; cycleEnabled starts or holds it. cycleDuration is seconds per day. motionEnabled pauses all motion, including time. Lighting presets hold morning or evening light. These controls never advance historical journey dates.',
    inputSchema:{type:'object',properties:{place:{type:'string',enum:[...availablePlaces,'overview']},region:{type:'string',enum:['west','east','south','anduin','rohan','rauros','morannon','mordor','gondor','all']},breeDetail:{type:'string',enum:['prancing-pony','sign','courtyard','hobbit-rooms','closed']},lighting:{type:'string',enum:['morning','golden']},routeVisible:{type:'boolean'},motionEnabled:{type:'boolean'},motionIntensity:{type:'string',enum:['subtle','lively']},timeOfDay:{type:'number',minimum:0,exclusiveMaximum:24},cycleEnabled:{type:'boolean'},cycleDuration:{type:'number',enum:[30,60,120]}},additionalProperties:false,minProperties:1},annotations:{readOnlyHint:false,untrustedContentHint:false},
    async execute(input){
      if(!input||typeof input!=='object'||Array.isArray(input))throw new Error('Expected a view configuration object.');
      const v=input as Record<string,unknown>,keys=Object.keys(v);
      if(!keys.length||keys.some(k=>!['place','region','breeDetail','lighting','routeVisible','motionEnabled','motionIntensity','timeOfDay','cycleEnabled','cycleDuration'].includes(k)))throw new Error('Provide supported atlas settings.');
      if(v.breeDetail!==undefined&&((v.breeDetail!=='closed'&&!isBreeDetail(v.breeDetail))||!actions.bree))throw new Error('Unknown Bree detail.');
      if(v.breeDetail!==undefined&&v.breeDetail!=='closed'&&v.place!==undefined&&v.place!=='bree')throw new Error('A Bree detail must be opened in Bree.');
      if(v.region!==undefined&&(!['west','east','south','anduin','rohan','rauros','morannon','mordor','gondor','all'].includes(v.region as string)||!actions.region))throw new Error('Unknown map region.');
      if(v.region!==undefined&&(v.place!==undefined||(v.breeDetail!==undefined&&v.breeDetail!=='closed')))throw new Error('Choose a region, a place, or a Bree detail.');
      if(v.place!==undefined&&v.place!=='overview'&&!availablePlaces.includes(v.place as PlaceId))throw new Error('Unknown place.');
      if(v.lighting!==undefined&&!['morning','golden'].includes(v.lighting as string))throw new Error('Unknown lighting.');
      if(v.routeVisible!==undefined&&typeof v.routeVisible!=='boolean')throw new Error('routeVisible must be a boolean.');
      if(v.motionEnabled!==undefined&&(typeof v.motionEnabled!=='boolean'||!actions.motion))throw new Error('motionEnabled must be a supported boolean setting.');
      if(v.motionIntensity!==undefined&&(!['subtle','lively'].includes(v.motionIntensity as string)||!actions.intensity))throw new Error('Unknown motion intensity.');
      if(v.timeOfDay!==undefined&&(typeof v.timeOfDay!=='number'||!Number.isFinite(v.timeOfDay)||v.timeOfDay<0||v.timeOfDay>=24||!actions.time))throw new Error('timeOfDay must be a supported hour from 0 up to 24.');
      if(v.cycleEnabled!==undefined&&(typeof v.cycleEnabled!=='boolean'||!actions.cycle))throw new Error('cycleEnabled must be a supported boolean setting.');
      if(v.cycleDuration!==undefined&&(![30,60,120].includes(v.cycleDuration as number)||!actions.duration))throw new Error('cycleDuration must be 30, 60 or 120 seconds.');
      if(v.lighting!==undefined&&v.timeOfDay!==undefined)throw new Error('Choose either lighting or timeOfDay.');
      if(v.region)actions.region?.(v.region as RegionId);
      if(v.place==='overview')actions.overview();else if(v.place)actions.focus(v.place as TPlace);
      if(v.breeDetail!==undefined)actions.bree?.(v.breeDetail==='closed'?null:v.breeDetail as BreeDetail);
      if(v.lighting)actions.lighting(v.lighting as LightMode);
      if(typeof v.routeVisible==='boolean')actions.route(v.routeVisible);
      if(typeof v.motionEnabled==='boolean')actions.motion?.(v.motionEnabled);
      if(v.motionIntensity)actions.intensity?.(v.motionIntensity as MotionIntensity);
      if(typeof v.timeOfDay==='number')actions.time?.(v.timeOfDay);
      if(typeof v.cycleDuration==='number')actions.duration?.(v.cycleDuration);
      if(typeof v.cycleEnabled==='boolean')actions.cycle?.(v.cycleEnabled);
      await afterPaint();
      if((v.place||v.region||(v.breeDetail!==undefined&&v.breeDetail!=='closed'))&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches)await new Promise(resolve=>setTimeout(resolve,1750));
      return actions.read();
    },
  }];
  tools.forEach(tool=>{try{void Promise.resolve(context.registerTool(tool,{signal:lifecycle.signal})).catch(error=>console.warn('Atlas tool registration failed:',error));}catch(error){console.warn('Atlas tool registration failed:',error);}});
  return()=>lifecycle.abort();
}
