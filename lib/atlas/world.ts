import { anduinPlaces, ANDUIN_OFFSET, ANDUIN_WIDTH } from './anduin-illustration';
import { illustratedPlaces } from './illustration';
import { westernPlaces } from './western-illustration';
import { southernPlaces } from './southern-illustration';
import { rohanPlaces, ROHAN_OFFSET, ROHAN_HEIGHT } from './rohan-illustration';

export const EAST_OFFSET = 1000;
export const MAP_WIDTH = ANDUIN_OFFSET + ANDUIN_WIDTH;
export const MAP_HEIGHT = ROHAN_OFFSET + ROHAN_HEIGHT;
export const mapPlaces = {
  ...westernPlaces,
  ...southernPlaces,
  ...anduinPlaces,
  ...rohanPlaces,
  bree:{x:illustratedPlaces.bree.x+EAST_OFFSET,y:illustratedPlaces.bree.y},
  weathertop:{x:illustratedPlaces.weathertop.x+EAST_OFFSET,y:illustratedPlaces.weathertop.y},
  rivendell:{x:illustratedPlaces.rivendell.x+EAST_OFFSET,y:illustratedPlaces.rivendell.y},
};
export type RegionId = 'all' | 'west' | 'east' | 'south' | 'anduin' | 'rohan';
