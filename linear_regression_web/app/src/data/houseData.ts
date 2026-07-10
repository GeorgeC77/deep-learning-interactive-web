export interface DataPoint {
  x: number; // house area (sq ft)
  y: number; // house price (10k USD)
  id: number;
}

export const DEFAULT_HOUSE_DATA: DataPoint[] = [
  { id: 1, x: 650, y: 78 },
  { id: 2, x: 780, y: 92 },
  { id: 3, x: 850, y: 105 },
  { id: 4, x: 920, y: 118 },
  { id: 5, x: 980, y: 125 },
  { id: 6, x: 1050, y: 138 },
  { id: 7, x: 1120, y: 145 },
  { id: 8, x: 1180, y: 158 },
  { id: 9, x: 1250, y: 172 },
  { id: 10, x: 1320, y: 185 },
  { id: 11, x: 1400, y: 198 },
  { id: 12, x: 1480, y: 210 },
  { id: 13, x: 1550, y: 225 },
  { id: 14, x: 1620, y: 240 },
  { id: 15, x: 1700, y: 258 },
  { id: 16, x: 1780, y: 272 },
  { id: 17, x: 1850, y: 288 },
  { id: 18, x: 1920, y: 305 },
  { id: 19, x: 2100, y: 325 },
  { id: 20, x: 2350, y: 340 },
];
