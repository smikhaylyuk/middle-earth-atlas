import { anduinPlaces, ANDUIN_OFFSET, ANDUIN_WIDTH } from './anduin-illustration';
import { illustratedPlaces } from './illustration';
import { westernPlaces } from './western-illustration';
import { southernPlaces } from './southern-illustration';
import { rohanPlaces, ROHAN_OFFSET, ROHAN_HEIGHT } from './rohan-illustration';
import rauros from './rauros-layout.json';
import morannon from './morannon-layout.json';
import mordor from './mordor-layout.json';
import gondor from './gondor-layout.json';
import pelennor from './pelennor-layout.json';
import morgul from './morgul-layout.json';
import lamedon from './lamedon-layout.json';
import anfalas from './anfalas-layout.json';
import belfalas from './belfalas-layout.json';
import linhir from './linhir-layout.json';

export const EAST_OFFSET = 1000;
export const BASE_MAP_WIDTH = ANDUIN_OFFSET + ANDUIN_WIDTH;
export const BASE_MAP_HEIGHT = ROHAN_OFFSET + ROHAN_HEIGHT;
export const MAP_WIDTH = belfalas.worldWidth;
export const MAP_HEIGHT = belfalas.worldHeight;
export const mapPlaces = {
  ...westernPlaces,
  ...southernPlaces,
  ...anduinPlaces,
  ...rohanPlaces,
  ...rauros.places,
  ...morannon.places,
  ...mordor.places,
  ...gondor.places,
  ...pelennor.places,
  ...morgul.places,
  ...lamedon.places,
  ...anfalas.places,
  ...belfalas.places,
  ...linhir.places,
  bree:{x:illustratedPlaces.bree.x+EAST_OFFSET,y:illustratedPlaces.bree.y},
  weathertop:{x:illustratedPlaces.weathertop.x+EAST_OFFSET,y:illustratedPlaces.weathertop.y},
  rivendell:{x:illustratedPlaces.rivendell.x+EAST_OFFSET,y:illustratedPlaces.rivendell.y},
};
export type RegionId = 'all' | 'west' | 'east' | 'south' | 'anduin' | 'rohan' | 'rauros' | 'morannon' | 'mordor' | 'gondor' | 'pelennor' | 'morgul' | 'lamedon' | 'anfalas' | 'belfalas' | 'linhir';
