// The 1103 × 1426 image is displayed at 1500 × 2350 and clipped below y=1940.
// This aligns Moria's two entrances without moving the approved western map.
export const ANDUIN_OFFSET = 2200;
export const ANDUIN_WIDTH = 1500;
export const ANDUIN_PAINT_HEIGHT = 2350;
// World-space pins; atmosphere paths below use the sheet's local plane.
export const anduinPlaces = {
  "gladden-fields": {
    "x": 2981.96,
    "y": 964.06
  },
  "dimrill-dale": {
    "x": 2394.47,
    "y": 1118.97
  },
  "cerin-amroth": {
    "x": 2760.29,
    "y": 1211.26
  },
  "caras-galadhon": {
    "x": 2964.28,
    "y": 1318.37
  },
  "dol-guldur": {
    "x": 3350.5,
    "y": 1188.18
  }
} as const;
export const anduinRivers = "M730.28 0.0 L758.84 80.75 L781.96 135.13 L757.48 215.88 L705.8 332.89 L693.56 413.64 L711.24 496.04 L704.44 588.32 L688.12 675.67 L737.08 741.58 L787.4 815.74 L795.56 899.79 L790.12 993.72 L828.2 1109.08 L858.11 1168.41 L866.27 1249.16 L889.39 1341.44 L905.71 1425.49 L943.79 1532.61 L964.19 1636.43 L1029.47 1753.44 L1090.66 1853.96 L1090.66 1946.25 L1119.22 2028.65 L1161.38 2111.04 L1191.3 2226.4 L1222.57 2350.0 M197.19 786.08 L246.15 805.86 L311.42 848.7 L413.42 876.72 L431.1 906.38 L501.81 916.27 L572.53 931.1 L648.69 949.23 L738.44 959.12 L781.96 964.06 M359.02 1244.21 L405.26 1277.17 L410.7 1290.36 L406.62 1310.13 L441.98 1326.61 L473.25 1336.5 L499.09 1376.05 L538.53 1390.88 L571.17 1422.19 L611.97 1448.56 L663.64 1451.86 L719.4 1469.99 L781.96 1468.34 L837.72 1489.76 L881.23 1504.59 L905.71 1506.24";
export const anduinMist = [
  {x:460,y:610,w:310,h:125,delay:-18},
  {x:525,y:890,w:300,h:110,delay:-33},
  {x:245,y:1150,w:240,h:95,delay:-9},
  {x:865,y:1470,w:250,h:90,delay:-27},
];
export const anduinFlocks = [
  {path:'M300 940 C510 780 750 700 910 470',duration:64,delay:-21},
  {path:'M420 1450 C610 1280 850 1180 1020 1040',duration:79,delay:-47},
];
// Tiny lamps among the tree dwellings; no magical or narrative effects.
export const lorienLights = [{"x": 743.88, "y": 1308.49}, {"x": 768.36, "y": 1298.6}, {"x": 790.12, "y": 1326.61}, {"x": 760.2, "y": 1344.74}];
