import { river, road, roadHighlight, warmLights, mistPatches, chimneys } from './illustration';
import { westernRoad, westernSpur, westernRivers, westernLights, westernMist, westernChimneys } from './western-illustration';
import { southernRivers, southernMist, southernFlocks, southernRoad } from './southern-illustration';
import { anduinRivers, anduinMist, anduinFlocks, lorienLights } from './anduin-illustration';
import { rohanRivers, rohanMist, rohanFlocks, rohanLights } from './rohan-illustration';

type Point={x:number;y:number};
type Flock={path:string;duration:number;delay:number};
export type InkLabel=Point & {text:string;angle?:number;kind?:'forest'|'water'|'mountain';size?:number};
export type SceneRegion={id:string;x:number;y:number;width:number;height:number;rivers:string;roads:string[];lights:readonly Point[];chimneys:readonly Point[];mist:readonly (Point & {w:number;h:number;delay:number})[];flocks:readonly Flock[];labels:InkLabel[]};
const flocks:Flock[]=[{path:'M70 700 C330 460 710 190 1270 180',duration:64,delay:-12},{path:'M400 990 C480 720 950 450 1450 290',duration:76,delay:-36}];
export const sceneRegions:SceneRegion[]=[
  {id:'west',x:0,y:0,width:1500,height:1000,rivers:westernRivers,roads:[westernRoad,westernSpur],lights:westernLights,chimneys:westernChimneys,mist:westernMist,flocks,labels:[
    {x:765,y:315,text:'THE SHIRE'},{x:255,y:466,text:'GULF OF LUNE',kind:'water'},{x:795,y:166,text:'LAKE EVENDIM',kind:'water',size:16},{x:1110,y:600,text:'OLD FOREST',kind:'forest'},{x:410,y:185,text:'BLUE MOUNTAINS',kind:'mountain',angle:-68},
  ]},
  {id:'east',x:1000,y:0,width:1500,height:1000,rivers:river,roads:[roadHighlight],lights:warmLights,chimneys,mist:mistPatches,flocks,labels:[{x:664,y:280,text:'THE LONE-LANDS'},{x:1360,y:343,text:'MISTY MOUNTAINS',kind:'mountain',angle:67}]},
  {id:'south',x:0,y:800,width:2500,height:1140,rivers:southernRivers,roads:[southernRoad],lights:[],chimneys:[],mist:southernMist,flocks:southernFlocks,labels:[
    {x:1915,y:380,text:'EREGION'},{x:1940,y:420,text:'HOLLIN',size:16},{x:975,y:610,text:'MINHIRIATH'},{x:1515,y:830,text:'ENEDWAITH'},{x:1825,y:707,text:'DUNLAND'},{x:2310,y:990,text:'FANGORN',kind:'forest'},{x:1340,y:777,text:'GWATHLÓ',kind:'water',angle:-49,size:16},{x:595,y:825,text:'THE GREAT SEA',kind:'water'},
  ]},
  {id:'anduin',x:2200,y:0,width:1500,height:1940,rivers:anduinRivers,roads:[],lights:lorienLights,chimneys:[],mist:anduinMist,flocks:anduinFlocks,labels:[
    {x:415,y:545,text:'VALES OF ANDUIN',angle:-85},{x:1170,y:700,text:'MIRKWOOD',kind:'forest',angle:84},{x:590,y:1460,text:'LOTHLÓRIEN',kind:'forest'},{x:1200,y:1720,text:'BROWN LANDS'},
  ]},
  {id:'rohan',x:0,y:1800,width:3700,height:1000,rivers:rohanRivers,roads:[],lights:rohanLights,chimneys:rohanLights.slice(0,2),mist:rohanMist,flocks:rohanFlocks,labels:[
    {x:2540,y:400,text:'ROHAN',size:34},{x:2050,y:430,text:'GAP OF ROHAN',size:16},{x:2220,y:960,text:'WHITE MOUNTAINS',kind:'mountain',angle:10},{x:3100,y:470,text:'EAST EMNET',size:16},{x:3300,y:340,text:'EMYN MUIL',size:16},{x:3510,y:740,text:'NEN HITHOEL',kind:'water',size:16},
  ]},
];
export const travellerPath={path:road,x:1000,y:0};
// One guide through the repaired joining band. Ends overlap the existing
// channel centrelines; this is a pictorial river bend, not a surveyed course.
export const anduinJoinPath='M3233 1790 L3245 1810 L3260 1830 L3276 1850 L3283 1870 L3322 1890 L3380 1910 L3401 1930 L3401 1950 L3388 1970 L3385 1990 L3397 2010 L3410 2030';
