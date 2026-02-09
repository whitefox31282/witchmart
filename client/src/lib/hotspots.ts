/**
 * Village Village Background Hotspots
 * Interactive clickable regions on the village background map
 * Coordinates normalized to 0-1 (relative to image dimensions)
 */

export interface Hotspot {
  id: string;
  label: string;
  route: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export const HOTSPOTS: Hotspot[] = [
  {
    id: 'educational-tent',
    label: 'Educational Tent',
    route: '/tents/educational',
    x: 0.42,
    y: 0.63,
    width: 0.10,
    height: 0.12,
  },
  {
    id: 'healers-tent',
    label: 'Healers Tent',
    route: '/tents/healers',
    x: 0.10,
    y: 0.75,
    width: 0.10,
    height: 0.12,
  },
  {
    id: 'storytellers-tent',
    label: 'Storytellers Tent',
    route: '/tents/story',
    x: 0.65,
    y: 0.72,
    width: 0.10,
    height: 0.12,
  },
  {
    id: 'traders-tent',
    label: 'Traders Tent',
    route: '/tents/traders',
    x: 0.18,
    y: 0.58,
    width: 0.10,
    height: 0.12,
  },
  {
    id: 'hecates-highway',
    label: 'Hecate\'s Highway',
    route: '/tents/hecates-highway',
    x: 0.55,
    y: 0.60,
    width: 0.10,
    height: 0.12,
  },
];
