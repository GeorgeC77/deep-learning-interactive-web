/* -------------------------------------------------------------------------- */
/* Masked Autoencoder (MAE) toy math                                          */
/* -------------------------------------------------------------------------- */

export type ImageType = 'stripes' | 'circle' | 'digit' | 'gradient';

/** Deterministic mulberry32 PRNG. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Clamp a number to [0, 1]. */
function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

/** Generate a deterministic structured image as a flat grid of patch values.
 *
 *  @param grid grid size (image has grid × grid patches)
 *  @param type image pattern type
 *  @param seed image seed
 */
export function generateImage(grid: number, type: ImageType, seed: number): number[] {
  const rng = mulberry32(seed);
  const values: number[] = [];

  // Pre-sample pattern parameters so the whole image is coherent.
  const stripeFreq = 2 + Math.floor(rng() * 4);
  const stripeVertical = rng() > 0.5;
  const circleCx = 0.25 + 0.5 * rng();
  const circleCy = 0.25 + 0.5 * rng();
  const circleR = 0.1 + 0.15 * rng();
  const digitThickness = 0.08 + 0.06 * rng();
  const gradAngle = 2 * Math.PI * rng();

  for (let i = 0; i < grid * grid; i++) {
    const row = Math.floor(i / grid);
    const col = i % grid;
    const y = (row + 0.5) / grid;
    const x = (col + 0.5) / grid;

    switch (type) {
      case 'stripes': {
        const t = stripeVertical
          ? Math.sin(2 * Math.PI * stripeFreq * x)
          : Math.sin(2 * Math.PI * stripeFreq * y);
        values.push(clamp01((t + 1) / 2));
        break;
      }
      case 'circle': {
        const dist = Math.hypot(x - circleCx, y - circleCy);
        const softness = 20;
        values.push(clamp01(1 / (1 + Math.exp(softness * (dist - circleR)))));
        break;
      }
      case 'digit': {
        const vertical = Math.abs(x - 0.5) < digitThickness / 2;
        const horizontal = Math.abs(y - 0.5) < digitThickness / 2;
        const on = vertical || horizontal;
        values.push(on ? 0.95 : 0.05);
        break;
      }
      case 'gradient': {
        const t = x * Math.cos(gradAngle) + y * Math.sin(gradAngle);
        values.push(clamp01((t + 1) / 2));
        break;
      }
      default: {
        values.push(0.5);
      }
    }
  }

  return values;
}

/** Deterministic permutation mask.  Returns `true` for masked-out patches. */
export function generateMask(n: number, ratio: number, seed: number): boolean[] {
  const rng = mulberry32(seed);
  const order = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  const mask = Array<boolean>(n).fill(false);
  const k = Math.min(n, Math.max(0, Math.floor(n * ratio)));
  for (let i = 0; i < k; i++) {
    mask[order[i]] = true;
  }
  return mask;
}

/** Fill masked patches with the mean of the visible patches. */
export function globalMeanBaseline(original: number[], mask: boolean[]): number[] {
  const visible = original.filter((_, i) => !mask[i]);
  const mean = visible.length > 0
    ? visible.reduce((a, b) => a + b, 0) / visible.length
    : 0.5;
  return original.map((v, i) => (mask[i] ? mean : v));
}

/** Fill masked patches with the average of adjacent visible patches; fall back
 *  to the global visible mean when no adjacent patch is visible. */
export function localNeighborBaseline(
  original: number[],
  mask: boolean[],
  grid: number,
): number[] {
  const visible = original.filter((_, i) => !mask[i]);
  const globalMean = visible.length > 0
    ? visible.reduce((a, b) => a + b, 0) / visible.length
    : 0.5;

  return original.map((v, i) => {
    if (!mask[i]) return v;
    const row = Math.floor(i / grid);
    const col = i % grid;
    let sum = 0;
    let count = 0;
    const neighbors = [
      [row - 1, col],
      [row + 1, col],
      [row, col - 1],
      [row, col + 1],
    ] as const;
    for (const [nr, nc] of neighbors) {
      if (nr < 0 || nr >= grid || nc < 0 || nc >= grid) continue;
      const j = nr * grid + nc;
      if (!mask[j]) {
        sum += original[j];
        count++;
      }
    }
    return count > 0 ? sum / count : globalMean;
  });
}

/** Toy encoder-decoder reconstruction: inverse-distance weighted interpolation
 *  from visible patches.  This is intentionally simple and is labelled as a
 *  placeholder in the UI. */
export function toyEncoderDecoder(
  original: number[],
  mask: boolean[],
  grid: number,
): number[] {
  const visible = original.filter((_, i) => !mask[i]);
  const globalMean = visible.length > 0
    ? visible.reduce((a, b) => a + b, 0) / visible.length
    : 0.5;

  return original.map((v, i) => {
    if (!mask[i]) return v;
    const row = Math.floor(i / grid);
    const col = i % grid;
    let weightSum = 0;
    let valueSum = 0;
    for (let j = 0; j < original.length; j++) {
      if (mask[j]) continue;
      const r = Math.floor(j / grid);
      const c = j % grid;
      const dist = Math.hypot(row - r, col - c);
      const w = 1 / (1 + dist);
      weightSum += w;
      valueSum += w * original[j];
    }
    return weightSum > 0 ? valueSum / weightSum : globalMean;
  });
}

/** Mean squared error evaluated only on masked patches. */
export function maskedMSE(
  original: number[],
  reconstruction: number[],
  mask: boolean[],
): number {
  let sum = 0;
  let count = 0;
  for (let i = 0; i < original.length; i++) {
    if (mask[i]) {
      const d = original[i] - reconstruction[i];
      sum += d * d;
      count++;
    }
  }
  return count > 0 ? sum / count : 0;
}

/** Mean squared error evaluated over all patches. */
export function allPatchMSE(
  original: number[],
  reconstruction: number[],
): number {
  if (original.length === 0) return 0;
  let sum = 0;
  for (let i = 0; i < original.length; i++) {
    const d = original[i] - reconstruction[i];
    sum += d * d;
  }
  return sum / original.length;
}
