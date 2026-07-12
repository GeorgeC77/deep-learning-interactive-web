import { describe, it, expect } from 'vitest';
import {
  computeIoU,
  nmsTrace,
  scoreThresholdFilter,
  softNms,
  type Box,
} from '../lib/math/iouNms';

describe('iouNms', () => {
  it('computeIoU is 0 for non-overlapping boxes and 1 for identical boxes', () => {
    const a: Box = {
      id: 1,
      x: 0,
      y: 0,
      w: 10,
      h: 10,
      score: 1,
      classId: 0,
    };
    const b: Box = {
      id: 2,
      x: 20,
      y: 20,
      w: 10,
      h: 10,
      score: 1,
      classId: 0,
    };

    expect(computeIoU(a, b)).toBe(0);
    expect(computeIoU(a, a)).toBe(1);
  });

  it('nmsTrace kept set is reproduced by replaying the trace', () => {
    const boxes: Box[] = [
      { id: 1, x: 20, y: 20, w: 70, h: 70, score: 0.95, classId: 0 },
      { id: 2, x: 35, y: 35, w: 65, h: 65, score: 0.88, classId: 0 },
      { id: 3, x: 120, y: 30, w: 60, h: 60, score: 0.82, classId: 0 },
      { id: 4, x: 130, y: 120, w: 55, h: 55, score: 0.75, classId: 0 },
      { id: 5, x: 40, y: 130, w: 50, h: 50, score: 0.6, classId: 0 },
    ];

    const result = nmsTrace(boxes, 0.5, 'class-aware');

    const ids = new Set<number>([
      ...result.kept,
      ...result.suppressed,
      ...result.trace.map((entry) => entry.selectedBox),
      ...result.trace.map((entry) => entry.comparedBox),
    ]);

    const active = new Set(ids);
    for (const entry of result.trace) {
      if (entry.action === 'suppress') {
        active.delete(entry.comparedBox);
      }
    }

    const replayKept = Array.from(active).sort((a, b) => a - b);
    expect(replayKept).toEqual([...result.kept].sort((a, b) => a - b));
  });

  it('class-aware NMS never suppresses boxes across different classes', () => {
    const boxes: Box[] = [
      { id: 1, x: 0, y: 0, w: 10, h: 10, score: 0.9, classId: 0 },
      { id: 2, x: 2, y: 2, w: 10, h: 10, score: 0.85, classId: 1 },
      { id: 3, x: 4, y: 4, w: 10, h: 10, score: 0.8, classId: 2 },
    ];

    const result = nmsTrace(boxes, 0.1, 'class-aware');

    const crossClassSuppressions = result.trace.filter((entry) => {
      if (entry.action !== 'suppress') return false;
      const selected = boxes.find((box) => box.id === entry.selectedBox);
      const compared = boxes.find((box) => box.id === entry.comparedBox);
      return selected !== undefined && compared !== undefined && selected.classId !== compared.classId;
    });

    expect(crossClassSuppressions).toHaveLength(0);
  });

  it('score threshold removes low-score boxes', () => {
    const boxes: Box[] = [
      { id: 1, x: 0, y: 0, w: 10, h: 10, score: 0.9, classId: 0 },
      { id: 2, x: 0, y: 0, w: 10, h: 10, score: 0.4, classId: 0 },
      { id: 3, x: 0, y: 0, w: 10, h: 10, score: 0.55, classId: 0 },
    ];

    const filtered = scoreThresholdFilter(boxes, 0.5);
    expect(filtered.map((box) => box.id)).toEqual([1, 3]);
  });

  describe('softNms', () => {
    it('dynamically reselects the maximum after decaying scores', () => {
      // A overlaps heavily with B; B overlaps heavily with C.
      // After A decays B, B's score must drop below C's original score so that
      // C is selected next, not B.
      const boxes: Box[] = [
        { id: 1, x: 0, y: 0, w: 100, h: 100, score: 0.95, classId: 0 },
        { id: 2, x: 10, y: 10, w: 100, h: 100, score: 0.9, classId: 0 },
        { id: 3, x: 200, y: 200, w: 100, h: 100, score: 0.85, classId: 0 },
      ];

      const result = softNms(boxes, 0.1, 'class-agnostic', 0.0);

      // The first selected box should be A (id=1).
      expect(result.selectedOrder[0]).toBe(1);

      // After A decays B, B should be lower than C, so C is selected second.
      const bFinal = result.finalScores.get(2) ?? 1;
      const cFinal = result.finalScores.get(3) ?? 1;
      expect(bFinal).toBeLessThan(cFinal);
      expect(result.selectedOrder[1]).toBe(3);
    });

    it('class-aware mode does not decay boxes across classes', () => {
      const boxes: Box[] = [
        { id: 1, x: 0, y: 0, w: 10, h: 10, score: 0.9, classId: 0 },
        { id: 2, x: 2, y: 2, w: 10, h: 10, score: 0.85, classId: 1 },
      ];

      const aware = softNms(boxes, 0.1, 'class-aware', 0.0);
      expect(aware.finalScores.get(2)).toBeCloseTo(0.85, 10);

      const agnostic = softNms(boxes, 0.1, 'class-agnostic', 0.0);
      expect((agnostic.finalScores.get(2) ?? 1)).toBeLessThan(0.85);
    });

    it('selected order uses updated scores, not original scores', () => {
      const boxes: Box[] = [
        { id: 1, x: 0, y: 0, w: 100, h: 100, score: 0.95, classId: 0 },
        { id: 2, x: 10, y: 10, w: 100, h: 100, score: 0.9, classId: 0 },
        { id: 3, x: 200, y: 200, w: 100, h: 100, score: 0.85, classId: 0 },
      ];

      const result = softNms(boxes, 0.1, 'class-agnostic', 0.0);
      // Original order by score would be 1,2,3. Updated order should be 1,3,2.
      expect(result.selectedOrder).toEqual([1, 3, 2]);
    });

    it('score threshold is applied to decayed scores', () => {
      const boxes: Box[] = [
        { id: 1, x: 0, y: 0, w: 100, h: 100, score: 0.95, classId: 0 },
        { id: 2, x: 10, y: 10, w: 100, h: 100, score: 0.6, classId: 0 },
      ];

      const result = softNms(boxes, 0.1, 'class-agnostic', 0.5);
      expect(result.selectedOrder).toContain(1);
      expect(result.removedByThreshold).toContain(2);
      expect(result.kept).not.toContain(2);
    });

    it('trace reproduces final scores', () => {
      const boxes: Box[] = [
        { id: 1, x: 0, y: 0, w: 10, h: 10, score: 0.9, classId: 0 },
        { id: 2, x: 2, y: 2, w: 10, h: 10, score: 0.8, classId: 0 },
      ];

      const result = softNms(boxes, 0.5, 'class-agnostic', 0.0);
      const traceEntry = result.trace.find((t) => t.comparedBox === 2);
      expect(traceEntry).toBeDefined();
      expect(result.finalScores.get(2)).toBeCloseTo(traceEntry!.newScore, 10);
    });

    it('smaller sigma produces stronger decay for high-IoU boxes', () => {
      const boxes: Box[] = [
        { id: 1, x: 0, y: 0, w: 10, h: 10, score: 0.9, classId: 0 },
        { id: 2, x: 2, y: 2, w: 10, h: 10, score: 0.8, classId: 0 },
      ];

      const smallSigma = softNms(boxes, 0.01, 'class-agnostic', 0.0);
      const largeSigma = softNms(boxes, 1.0, 'class-agnostic', 0.0);
      expect(smallSigma.finalScores.get(2)!).toBeLessThan(largeSigma.finalScores.get(2)!);
    });
  });
});
