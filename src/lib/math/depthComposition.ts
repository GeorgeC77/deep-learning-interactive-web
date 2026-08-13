export function tentMap(x: number): number {
  const clamped = Math.min(1, Math.max(0, x));
  return clamped <= 0.5 ? 2 * clamped : 2 * (1 - clamped);
}

export function iteratedTentMap(x: number, depth: number): number {
  let value = x;
  for (let layer = 0; layer < depth; layer++) value = tentMap(value);
  return value;
}

export function linearRegionCount(depth: number): number {
  return 2 ** Math.max(0, Math.floor(depth));
}

export function shallowReluUnitsForExactRepresentation(depth: number): number {
  return Math.max(0, linearRegionCount(depth) - 1);
}

