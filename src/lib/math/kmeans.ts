/* -------------------------------------------------------------------------- */
/* K-means (Lloyd algorithm) helpers                                           */
/* -------------------------------------------------------------------------- */

export interface Point {
  x: number;
  y: number;
  cluster?: number;
}

export interface Centroid {
  x: number;
  y: number;
}

/** Seeded PRNG (mulberry32). */
export function mulberry32(a: number): () => number {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function squaredDistance(
  a: { x: number; y: number },
  b: { x: number; y: number },
): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return dx * dx + dy * dy;
}

/** Assign each point to the nearest centroid. Returns a new point array. */
export function assignStep(points: Point[], centroids: Centroid[]): Point[] {
  return points.map((p) => {
    let best = 0;
    let bestDist = Infinity;
    centroids.forEach((c, idx) => {
      const d = squaredDistance(p, c);
      if (d < bestDist) {
        bestDist = d;
        best = idx;
      }
    });
    return { ...p, cluster: best };
  });
}

/**
 * Update centroids to the mean of assigned points.
 * Empty clusters keep their previous centroid (documented tie-breaking).
 */
export function updateStep(points: Point[], centroids: Centroid[]): Centroid[] {
  return centroids.map((c, idx) => {
    const clusterPoints = points.filter((p) => p.cluster === idx);
    if (clusterPoints.length === 0) return { ...c };
    return {
      x: clusterPoints.reduce((s, p) => s + p.x, 0) / clusterPoints.length,
      y: clusterPoints.reduce((s, p) => s + p.y, 0) / clusterPoints.length,
    };
  });
}

/** One Lloyd iteration: assign then update. */
export function lloydStep(
  points: Point[],
  centroids: Centroid[],
): { points: Point[]; centroids: Centroid[]; distortion: number } {
  const assigned = assignStep(points, centroids);
  const newCentroids = updateStep(assigned, centroids);
  const distortion = computeDistortion(assigned, newCentroids);
  return { points: assigned, centroids: newCentroids, distortion };
}

/** Sum of squared distances from each point to its assigned centroid. */
export function computeDistortion(points: Point[], centroids: Centroid[]): number {
  return points.reduce((sum, p) => {
    const c = centroids[p.cluster ?? 0];
    return sum + squaredDistance(p, c);
  }, 0);
}

/** Randomly choose k distinct data points as initial centroids. */
export function randomInit(
  points: Point[],
  k: number,
  rng: () => number = Math.random,
): Centroid[] {
  if (points.length < k) return [];
  const copy = [...points];
  // Fisher-Yates shuffle
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, k).map((p) => ({ x: p.x, y: p.y }));
}

/** Extract the current cluster assignment array. */
export function getAssignments(points: Point[]): number[] {
  return points.map((p) => p.cluster ?? -1);
}

/**
 * Check whether the algorithm has converged.
 * Convergence means assignments unchanged AND centroid movement below tolerance.
 */
export function hasConverged(
  prevAssignments: number[],
  newAssignments: number[],
  prevCentroids: Centroid[],
  newCentroids: Centroid[],
  tol = 1e-9,
): boolean {
  if (prevAssignments.length !== newAssignments.length) return false;
  for (let i = 0; i < prevAssignments.length; i++) {
    if (prevAssignments[i] !== newAssignments[i]) return false;
  }
  for (let i = 0; i < prevCentroids.length; i++) {
    const dx = prevCentroids[i].x - newCentroids[i].x;
    const dy = prevCentroids[i].y - newCentroids[i].y;
    if (dx * dx + dy * dy > tol * tol) return false;
  }
  return true;
}

/** Run Lloyd's algorithm until convergence or max iterations. */
export function kMeansLloyd(
  points: Point[],
  k: number,
  seed: number,
  maxIter = 100,
  tol = 1e-9,
): {
  points: Point[];
  centroids: Centroid[];
  iterations: number;
  distortion: number;
  converged: boolean;
} {
  const rng = mulberry32(seed);
  let centroids = randomInit(points, k, rng);
  let current: Point[] = assignStep(points, centroids);
  for (let iter = 0; iter < maxIter; iter++) {
    const prevAssignments = getAssignments(current);
    const prevCentroids = centroids.map((c) => ({ ...c }));
    const step = lloydStep(current, centroids);
    current = step.points;
    centroids = step.centroids;
    if (
      hasConverged(
        prevAssignments,
        getAssignments(current),
        prevCentroids,
        centroids,
        tol,
      )
    ) {
      return {
        points: current,
        centroids,
        iterations: iter + 1,
        distortion: step.distortion,
        converged: true,
      };
    }
  }
  return {
    points: current,
    centroids,
    iterations: maxIter,
    distortion: computeDistortion(current, centroids),
    converged: false,
  };
}
