export const LEVEL_WIDTH = 1720;
export const GATE_X = LEVEL_WIDTH - 220;

const STATION_START_X = 260;
const STATION_END_X = LEVEL_WIDTH - 420;

export function getStationX(index: number, stationCount: number) {
  if (stationCount <= 1) {
    return (STATION_START_X + STATION_END_X) / 2;
  }

  const spacing = (STATION_END_X - STATION_START_X) / (stationCount - 1);
  return STATION_START_X + index * spacing;
}
