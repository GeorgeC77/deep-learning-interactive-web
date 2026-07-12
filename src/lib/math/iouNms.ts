/* -------------------------------------------------------------------------- */
/* IoU / NMS math                                                             */
/* -------------------------------------------------------------------------- */

export type Box = {
  id: number;
  x: number;
  y: number;
  w: number;
  h: number;
  score: number;
  classId: number;
};

export type Rect = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export type NmsMode = 'class-aware' | 'class-agnostic';

export type NmsTraceEntry = {
  iteration: number;
  selectedBox: number;
  comparedBox: number;
  iou: number;
  threshold: number;
  action: 'keep' | 'suppress';
};

export type NmsResult = {
  kept: number[];
  suppressed: number[];
  trace: NmsTraceEntry[];
};

export type SoftNmsMode = NmsMode;

export type SoftNmsTraceEntry = {
  iteration: number;
  selectedBox: number;
  comparedBox: number;
  iou: number;
  oldScore: number;
  newScore: number;
};

export type SoftNmsResult = {
  /** Order in which boxes were selected as the current maximum. */
  selectedOrder: number[];
  /** Final score for every input box id. */
  finalScores: Map<number, number>;
  /** Boxes kept after Soft-NMS (selected + remaining above threshold). */
  kept: number[];
  /** Boxes removed because their decayed score fell below the threshold. */
  removedByThreshold: number[];
  trace: SoftNmsTraceEntry[];
};

/**
 * Area of an axis-aligned rectangle. Negative widths/heights are clamped to 0.
 */
export function rectArea(r: Rect): number {
  return Math.max(0, r.w) * Math.max(0, r.h);
}

/**
 * Intersection area of two axis-aligned rectangles.
 */
export function intersectionArea(a: Rect, b: Rect): number {
  const x1 = Math.max(a.x, b.x);
  const y1 = Math.max(a.y, b.y);
  const x2 = Math.min(a.x + a.w, b.x + b.w);
  const y2 = Math.min(a.y + a.h, b.y + b.h);
  return Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
}

/**
 * Intersection over Union (IoU) of two rectangles.
 */
export function computeIoU(a: Rect, b: Rect): number {
  const inter = intersectionArea(a, b);
  const union = rectArea(a) + rectArea(b) - inter;
  return union > 0 ? inter / union : 0;
}

/**
 * Remove boxes whose confidence score is below `minScore`.
 */
export function scoreThresholdFilter(boxes: readonly Box[], minScore: number): Box[] {
  return boxes.filter((box) => box.score >= minScore);
}

/**
 * Non-Maximum Suppression with a complete pairwise trace.
 *
 * Boxes are processed in descending score order. For every selected box,
 * every still-active lower-scoring box is compared, and the decision
 * (keep/suppress) is recorded.
 *
 * - `class-agnostic`: suppress whenever IoU > threshold.
 * - `class-aware`:    suppress only when the two boxes share the same class.
 */
export function nmsTrace(
  boxes: readonly Box[],
  threshold: number,
  mode: NmsMode,
): NmsResult {
  const sorted = [...boxes].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.id - a.id;
  });

  const active = new Set<number>(sorted.map((box) => box.id));
  const suppressed = new Set<number>();
  const kept: number[] = [];
  const trace: NmsTraceEntry[] = [];

  let iteration = 0;

  for (let i = 0; i < sorted.length; i++) {
    const current = sorted[i];
    if (!active.has(current.id)) continue;

    iteration += 1;
    kept.push(current.id);

    for (let j = i + 1; j < sorted.length; j++) {
      const other = sorted[j];
      if (!active.has(other.id)) continue;

      const iou = computeIoU(current, other);
      let action: 'keep' | 'suppress' = 'keep';

      if (iou > threshold) {
        if (mode === 'class-agnostic' || current.classId === other.classId) {
          action = 'suppress';
          active.delete(other.id);
          suppressed.add(other.id);
        }
      }

      trace.push({
        iteration,
        selectedBox: current.id,
        comparedBox: other.id,
        iou,
        threshold,
        action,
      });
    }

    active.delete(current.id);
  }

  return {
    kept,
    suppressed: Array.from(suppressed),
    trace,
  };
}

/**
 * Gaussian Soft-NMS.
 *
 * Instead of hard suppression, overlapping boxes have their scores decayed by
 * exp(-IoU² / σ). After each decay pass the current maximum is recomputed from
 * the updated scores, and boxes that fall below `scoreThreshold` are removed.
 *
 * - `class-aware`: different classes do not decay each other.
 * - `class-agnostic`: all remaining boxes may be decayed.
 */
export function softNms(
  boxes: readonly Box[],
  sigma: number,
  mode: SoftNmsMode,
  scoreThreshold: number,
): SoftNmsResult {
  const safeSigma = sigma > 0 ? sigma : 1e-6;
  const scores = new Map<number, number>(boxes.map((box) => [box.id, box.score]));
  const remaining = new Set<number>(boxes.map((box) => box.id));

  const selectedOrder: number[] = [];
  const removedByThreshold: number[] = [];
  const trace: SoftNmsTraceEntry[] = [];
  let iteration = 0;

  while (remaining.size > 0) {
    // Select the box with the current highest score.
    let selectedId = -1;
    let maxScore = -Infinity;
    for (const id of remaining) {
      const s = scores.get(id) ?? -Infinity;
      if (s > maxScore) {
        maxScore = s;
        selectedId = id;
      }
    }

    if (maxScore < scoreThreshold) {
      for (const id of remaining) {
        removedByThreshold.push(id);
      }
      remaining.clear();
      break;
    }

    iteration += 1;
    selectedOrder.push(selectedId);
    remaining.delete(selectedId);

    const current = boxes.find((box) => box.id === selectedId);
    if (!current) break;

    for (const id of remaining) {
      const other = boxes.find((box) => box.id === id);
      if (!other) continue;
      if (mode === 'class-aware' && current.classId !== other.classId) continue;

      const iou = computeIoU(current, other);
      const oldScore = scores.get(id) ?? other.score;
      const newScore = oldScore * Math.exp(-(iou * iou) / safeSigma);
      scores.set(id, newScore);

      trace.push({
        iteration,
        selectedBox: selectedId,
        comparedBox: id,
        iou,
        oldScore,
        newScore,
      });
    }

    // Remove boxes whose decayed score is now below the threshold.
    for (const id of remaining) {
      if ((scores.get(id) ?? 0) < scoreThreshold) {
        removedByThreshold.push(id);
        remaining.delete(id);
      }
    }
  }

  const kept = [...selectedOrder, ...remaining].sort((a, b) => a - b);

  return {
    selectedOrder,
    finalScores: scores,
    kept,
    removedByThreshold,
    trace,
  };
}
