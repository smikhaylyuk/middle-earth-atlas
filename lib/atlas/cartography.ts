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
  havens:[435.55,538.09],shireJunction:[793.95,520.51],hobbiton:[804.69,369.14],
  bree:[1284.18,481.45],fordBruinen:[2035.16,595.7],
  tharbad:[1457,1347],isenJunction:[1745,1710],isengard:[1839,1789],
  fordsIsen:[1842.92,2069.45],edoras:[2628.42,2510.36],southernEdge:[2945,2800],
} as const;
type RoadNode=keyof typeof roadNodes;
export type RoadGuide={name:string;from:RoadNode;to:RoadNode;path:string;x?:number;y?:number};
const shireSplit=westernRoad.indexOf("L793.95 520.51");
export const roadGuides:RoadGuide[]=[
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
];

// Water highlights follow the inspected corrected channels. The Glanduin
// joins upstream of Tharbad; the Limlight reaches the Anduin, not the Entwash.
export const correctedRivers={
  glanduin:'M2159 1216 L2142 1237 L2111 1255 L2106 1278 L2085 1308 L2025 1341 L1971 1339 L1939 1350 L1890 1352 L1854 1338 L1826 1329 L1796 1317 L1766 1303 L1724 1306 L1690 1292 L1655 1267 L1618 1237 L1589 1226 L1560 1206 L1530 1194 L1499 1184',
  limlight:'M2280 1810 L2332 1832 L2380 1833 L2415 1822 L2448 1839 L2487 1822 L2521 1838 L2550 1847 L2599 1847 L2633 1842 L2673 1848 L2712 1839 L2760 1825 L2793 1816 L2832 1820 L2870 1824 L2910 1812 L2953 1801 L2985 1800 L3020 1811 L3054 1815 L3087 1820 L3120 1825 L3151 1824 L3185 1829 L3212 1835',
};
