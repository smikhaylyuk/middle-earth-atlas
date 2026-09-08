// The southern painting uses a 2500 × 1300 display plane at world y=800.
// Anchors are aligned with the painting; they are not surveyed coordinates.
export const SOUTH_OFFSET = 800;
export const SOUTH_HEIGHT = 1140;
export const southernPlaces = {
  'moria-west-gate': { x: 2195, y: 317 + SOUTH_OFFSET },
  'ost-in-edhil': { x: 1958, y: 500 + SOUTH_OFFSET },
  tharbad: { x: 1457, y: 547 + SOUTH_OFFSET },
  'lond-daer': { x: 950, y: 922 + SOUTH_OFFSET },
  isengard: { x: 1839, y: 989 + SOUTH_OFFSET },
};

// River segments follow visible channels. Ambiguous marsh branches are left unmarked.
export const southernRivers = 'M1740 0 L1714 34 L1665 68 L1621 94 L1601 118 L1600 144 L1610 171 L1592 201 L1563 230 L1535 256 L1506 280 L1518 311 L1524 334 L1500 366 L1487 402 L1507 429 L1493 460 L1468 488 M2159 416 L2142 437 L2111 455 L2106 478 L2085 508 L2025 541 L1971 539 L1939 550 L1890 552 L1854 538 L1826 509 L1796 501 L1764 519 L1717 521 L1674 515 L1631 523 L1584 520 L1529 522 M1459 585 L1436 616 L1403 635 L1358 656 L1326 679 L1290 697 L1277 718 L1287 742 L1283 764 L1258 792 L1225 811 L1195 842 L1175 874 L1150 902 L1144 923 L1120 946 L1078 957 M1325 237 L1293 256 L1251 272 L1206 289 L1164 313 L1120 332 L1079 330 L1043 326 L1000 333 L956 336 L911 355 L872 375 L840 389 L793 396 L755 415 L715 427 L684 451 L649 470 L611 486';
export const southernMist = [
  {x:1360,y:285,w:350,h:130,delay:-18},
  {x:1975,y:308,w:240,h:85,delay:-31},
  {x:1010,y:900,w:300,h:105,delay:-9},
  {x:1770,y:900,w:250,h:80,delay:-26},
];
export const southernFlocks = [
  {path:'M1310 860 C1470 680 1770 660 2040 590',duration:61,delay:-24},
  {path:'M1620 230 C1810 220 2100 390 2330 540',duration:73,delay:-48},
];

// The annotation starts south of the ruined crossing; it never draws an intact bridge.
export const southernRoad = 'M1502 601 L1541 684 L1601 749 L1651 818 L1706 878 L1765 931 L1805 973';
