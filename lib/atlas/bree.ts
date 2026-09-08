import { wrapHour } from './day-cycle';

export const breeDetails = {
  'prancing-pony': {
    label: 'The inn', title: 'At the foot of Bree-hill',
    text: 'The Prancing Pony faces the East Road where it curves around the hill. Its three-storey front shelters a courtyard, with two wings extending into the rising ground behind.',
  },
  sign: {
    label: 'The sign', title: 'A white pony above the arch',
    text: 'A lamp illuminates the inn’s sign: a plump white pony rearing on its hind legs. Barliman Butterbur keeps the house, a meeting place for travellers and news.',
  },
  courtyard: {
    label: 'The courtyard', title: 'Through the archway',
    text: 'The broad arch opens into the space between the two wings. Beneath it, steps on the left lead to the main door. The hill rises behind the inn to meet its upper floor.',
  },
  'hobbit-rooms': {
    label: 'Hobbit rooms', title: 'A welcome for little folk',
    text: 'Ground-floor rooms in the north wing were made especially for hobbit guests. Bree is a place where Men and Hobbits live alongside one another.',
  },
} as const;
export type BreeDetail = keyof typeof breeDetails;
export const isBreeDetail = (value: unknown): value is BreeDetail => typeof value === 'string' && Object.hasOwn(breeDetails, value);

const smooth = (from: number, to: number, value: number) => {
  const t = Math.max(0, Math.min(1, (value - from) / (to - from)));
  return t * t * (3 - 2 * t);
};
// Atmospheric choreography, not a claim about the inn's historical opening hours.
export function windowLightAt(hour: number, windowIndex: number) {
  const h = wrapHour(hour), stagger = (windowIndex % 7) * .22;
  return h < 12 ? 1 - smooth(5.1 + stagger * .4, 6.5 + stagger * .4, h) : smooth(17.4 + stagger, 18.1 + stagger, h);
}

// Window panes and chimneys measured on prancing-pony.jpg (1536 x 1024).
export const innWindows = [
  {
    "x": 16.276,
    "y": 36.719,
    "panes": "237,347 262,349 263,403 238,401"
  },
  {
    "x": 23.763,
    "y": 37.207,
    "panes": "353,354 377,355 377,406 353,405"
  },
  {
    "x": 16.341,
    "y": 50.195,
    "panes": "239,486 264,489 266,541 240,538"
  },
  {
    "x": 24.87,
    "y": 51.172,
    "panes": "371,496 392,499 393,551 372,548"
  },
  {
    "x": 16.667,
    "y": 67.383,
    "panes": "245,659 266,661 268,720 246,718"
  },
  {
    "x": 25.911,
    "y": 69.141,
    "panes": "387,675 409,678 411,738 388,735"
  },
  {
    "x": 69.922,
    "y": 36.523,
    "panes": "1062,347 1084,347 1084,401 1062,402"
  },
  {
    "x": 79.102,
    "y": 36.426,
    "panes": "1204,346 1225,346 1225,400 1204,401"
  },
  {
    "x": 68.75,
    "y": 51.66,
    "panes": "1042,502 1068,501 1068,555 1042,556"
  },
  {
    "x": 78.32,
    "y": 51.27,
    "panes": "1190,499 1215,497 1215,552 1190,554"
  },
  {
    "x": 68.099,
    "y": 70.801,
    "panes": "1032,691 1062,690 1060,758 1032,761"
  },
  {
    "x": 75.716,
    "y": 70.508,
    "panes": "1150,690 1177,687 1176,755 1149,757"
  }
];
export const innChimneys = [
  {
    "x": 22.396,
    "y": 7.422
  },
  {
    "x": 78.776,
    "y": 7.227
  }
];
