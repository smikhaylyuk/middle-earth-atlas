import lamedon from './lamedon-layout.json';
import belfalas from './belfalas-layout.json';
import linhir from './linhir-layout.json';
import { roadHighlight } from './illustration';
import { westernRoad, westernSpur } from './western-illustration';

// Network relationships are checked against Christopher Tolkien's 1980 map.
// Coordinates follow this pictorial painting, not a geographic projection.
export const cartographySources={
  general:'https://tolkiengateway.net/wiki/File:Christopher_Tolkien_-_The_West_of_Middle-earth.png',
  rohan:'https://tolkiengateway.net/wiki/File:Christopher_Tolkien_-_Map_of_Rohan,_Gondor,_and_Mordor.png',
  shire:'https://tolkiengateway.net/wiki/File:Christopher_Tolkien_-_A_Part_of_the_Shire.jpg',
};

export const tributaryLabels=[
  {text:'THE WATER',x:918,y:390,angle:0},
  {text:'WITHYWINDLE',x:1158,y:656,angle:-27},
  {text:'ADORN',x:1585,y:2310,angle:25},
];
export const roadNodes={
  linhirCrossing:[linhir.crossing.x,linhir.crossing.y],lebenninEastEdge:linhir.road.at(-1)!,
  belfalasEastEdge:belfalas.road.at(-1)!,
  erechRoad:lamedon.road[0],tarlangPass:lamedon.road[4],cirilFord:lamedon.road[19],calembelRoad:lamedon.road[20],ethringBridge:lamedon.road[26],linhirApproach:lamedon.road.at(-1)!,
  havens:[435.55,538.09],shireJunction:[793.95,520.51],hobbiton:[804.69,369.14],
  bree:[1284.18,481.45],fordBruinen:[2035.16,595.7],
  tharbad:[1457,1347],isenJunction:[1745,1710],isengard:[1839,1789],
  fordsIsen:[1842.92,2069.45],edoras:[2628.42,2510.36],southernEdge:[2945,2800],
  darkTowerGate:[5690,3826],doomEastEntrance:[5435,3870],
  gondorApproach:[4313,4350],minasGreatGate:[4198,4831],osgiliathWest:[4555,4605],
  harlondJunction:[4307,5010],harlondQuays:[4380,4990],pelennorSouthGate:[4341,5177],southGondorEdge:[4420,5470],
  osgiliathEast:[4810,4618],ithilienCrossroads:[5041,4611],haradNorth:[4599,4180],haradSouth:[4985,5030],
  morgulBridgeNorth:[5570,4537],morgulGate:[5587,4580],stairsBranch:[5548,4531],torechEntrance:[5649,4311],
} as const;
type RoadNode=keyof typeof roadNodes;
export type RoadGuide={name:string;from:RoadNode;to:RoadNode;path:string;x?:number;y?:number};
const shireSplit=westernRoad.indexOf("L793.95 520.51");
const lamedonRoad=(start:number,end:number)=>lamedon.road.slice(start,end+1).map(([x,y],i)=>`${i?'L':'M'}${x} ${y}`).join(' ');
export const roadGuides:RoadGuide[]=[
  {name:'Road through Linhir toward Pelargir',from:'belfalasEastEdge',to:'lebenninEastEdge',path:linhir.road.map(([x,y],i)=>`${i?'L':'M'}${x} ${y}`).join(' ')},
  {name:'Road onward toward Linhir',from:'linhirApproach',to:'belfalasEastEdge',path:belfalas.road.map(([x,y],i)=>`${i?'L':'M'}${x} ${y}`).join(' ')},
  {name:'Erech road over Tarlang’s Neck',from:'erechRoad',to:'tarlangPass',path:lamedonRoad(0,4)},
  {name:'Lamedon road to the Ciril ford',from:'tarlangPass',to:'cirilFord',path:lamedonRoad(4,19)},
  {name:'Road into Calembel',from:'cirilFord',to:'calembelRoad',path:lamedonRoad(19,20)},
  {name:'Calembel road to Ethring',from:'calembelRoad',to:'ethringBridge',path:lamedonRoad(20,26)},
  {name:'Road south toward Linhir',from:'ethringBridge',to:'linhirApproach',path:lamedonRoad(26,lamedon.road.length-1)},
  {name:'Great East Road',from:'havens',to:'shireJunction',path:westernRoad.slice(0,shireSplit)+'L793.95 520.51'},
  {name:'Great East Road',from:'shireJunction',to:'bree',path:'M793.95 520.51'+westernRoad.slice(shireSplit+14)},
  {name:'Hobbiton road',from:'shireJunction',to:'hobbiton',path:westernSpur},
  {name:'East Road to the Ford',from:'bree',to:'fordBruinen',path:roadHighlight,x:1000},
  {name:'Greenway',from:'bree',to:'tharbad',path:'M1284.18 481.45 C1300 650 1280 718 1340 802 L1390 908 L1424 979 L1433 1082 L1450 1174 L1465 1263 L1457 1347'},
  {name:'North–South Road',from:'tharbad',to:'isenJunction',path:'M1457 1347 L1502 1401 L1541 1484 L1601 1549 L1651 1618 L1706 1678 L1745 1710'},
  {name:'Isengard spur',from:'isenJunction',to:'isengard',path:'M1745 1710 L1788 1759 L1839 1789'},
  {name:'North–South Road to the Fords',from:'isenJunction',to:'fordsIsen',path:'M1745 1710 L1750 1752 L1733 1779 L1725 1815 L1741 1867 L1734 1909 L1748 1938 L1757 1966 L1750 2000 L1755 2021 L1777 2038 L1842.92 2069.45'},
  {name:'Great West Road',from:'fordsIsen',to:'edoras',path:'M1842.92 2069.45 C1940 2124 2030 2160 2150 2230 S2338 2310 2400 2400 S2500 2510 2628.42 2510.36'},
  {name:'Great West Road toward Gondor',from:'edoras',to:'southernEdge',path:'M2628.42 2510.36 C2710 2580 2810 2675 2945 2800'},
  // Book VI, ch. 3: the Tower's western gate connects to Orodruin's
  // eastern flank. Keep this documented connection explicit.
  {name:'Sauron’s Road',from:'darkTowerGate',to:'doomEastEntrance',path:'M5690 3826 C5644 3840 5611 3863 5563 3870 S5505 3890 5490 3915 L5468 3910 L5455 3886 L5435 3870'},
  {name:'North-way into Minas Tirith',from:'gondorApproach',to:'minasGreatGate',path:'M4313 4350 C4340 4410 4342 4460 4358 4515 L4380 4580 L4414 4661 L4379 4709 L4329 4785 L4198 4831'},
  // Stop on Osgiliath’s western bank: the last bridge fell in 3018.
  {name:'Causeway to Osgiliath',from:'minasGreatGate',to:'osgiliathWest',path:'M4198 4831 L4329 4785 L4379 4709 L4414 4661 L4474 4641 L4555 4605'},
  {name:'South Road from the White City',from:'minasGreatGate',to:'harlondJunction',path:'M4198 4831 C4209 4874 4253 4952 4307 5010'},
  {name:'Harlond quay road',from:'harlondJunction',to:'harlondQuays',path:'M4307 5010 L4333 4976 L4380 4990'},
  {name:'South Road through the Rammas',from:'harlondJunction',to:'pelennorSouthGate',path:'M4307 5010 C4340 5044 4339 5110 4341 5177'},
  {name:'South Road toward lower Gondor',from:'pelennorSouthGate',to:'southGondorEdge',path:'M4341 5177 C4360 5220 4420 5250 4430 5320 S4460 5410 4420 5470'},
  // Osgiliath's eastern bank is a separate node. No line restores the lost
  // Anduin bridge or presents the Morgul road as Frodo's western approach.
  {name:'Osgiliath road to the Cross-roads',from:'osgiliathEast',to:'ithilienCrossroads',path:'M4810 4618 C4880 4618 4970 4616 5041 4611'},
  {name:'Harad Road through North Ithilien',from:'haradNorth',to:'ithilienCrossroads',path:'M4599 4180 C4605 4230 4650 4275 4730 4300 S4810 4370 4900 4410 S4985 4480 5007 4550 L5041 4611'},
  {name:'Harad Road south of the Cross-roads',from:'ithilienCrossroads',to:'haradSouth',path:'M5041 4611 C5064 4650 5040 4672 5011 4694 L5003 4720 C4975 4760 4915 4750 4900 4810 S4900 4915 4985 5030'},
  {name:'Morgul road along the northern bank',from:'ithilienCrossroads',to:'stairsBranch',path:'M5041 4611 C5140 4620 5240 4584 5340 4560 S5460 4513 5548 4531'},
  {name:'Approach to the white bridge',from:'stairsBranch',to:'morgulBridgeNorth',path:'M5548 4531 L5570 4537'},
  {name:'White bridge to Minas Morgul',from:'morgulBridgeNorth',to:'morgulGate',path:'M5570 4537 C5567 4555 5572 4570 5587 4580'},
  // The surface annotation ends at the cave mouth. The tunnel's interior
  // and exit are not drawn as an invented road over the mountain crest.
  {name:'Stairs to Torech Ungol',from:'stairsBranch',to:'torechEntrance',path:'M5548 4531 L5550 4500 L5530 4480 L5542 4450 L5576 4420 L5570 4398 L5605 4350 L5649 4311'},
];

// Water highlights follow the inspected corrected channels. The Glanduin
// joins upstream of Tharbad; the Limlight reaches the Anduin, not the Entwash.
export const correctedRivers={
  glanduin:'M2159 1216 L2142 1237 L2111 1255 L2106 1278 L2085 1308 L2025 1341 L1971 1339 L1939 1350 L1890 1352 L1854 1338 L1826 1329 L1796 1317 L1766 1303 L1724 1306 L1690 1292 L1655 1267 L1618 1237 L1589 1226 L1560 1206 L1530 1194 L1499 1184',
  limlight:'M2280 1810 L2332 1832 L2380 1833 L2415 1822 L2448 1839 L2487 1822 L2521 1838 L2550 1847 L2599 1847 L2633 1842 L2673 1848 L2712 1839 L2760 1825 L2793 1816 L2832 1820 L2870 1824 L2910 1812 L2953 1801 L2985 1800 L3020 1811 L3054 1815 L3087 1820 L3120 1825 L3151 1824 L3185 1829 L3212 1835',
};
