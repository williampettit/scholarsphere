type Coordinate = [number, number];

type CoordinateMap = {
  [key: string]: Coordinate;
};

export const UNIVERSITY_COORDINATES: CoordinateMap = {
  // (longitude, latitude)
  uga: [33.955269, -83.37513],
  tcu: [32.71127, -97.36101],
  usm: [43.66222, -70.277618],
};
