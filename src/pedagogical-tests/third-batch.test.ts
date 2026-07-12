import { describe, it, expect } from 'vitest';
import {
  eig2x2,
  sampleCovariance,
  ppcaClosedFormML,
  pcaOrthogonalProjection,
  posteriorReconstruction,
} from '../lib/math/ppca';
import { computeUNetSizes, buildUNetStages, requiredInputAlignment } from '../lib/math/unet';
import { constrainSimplex, truePosterior, computeELBO } from '../lib/math/discreteElbo';
import { computeIoU, nmsTrace } from '../lib/math/iouNms';

describe('pedagogical invariants: third batch', () => {
  /* ---------------------------------------------------------------------- */
  /* PPCA closed-form semantics                                             */
  /* ---------------------------------------------------------------------- */
  it('PPCA: closed-form sigma2_ML equals average discarded eigenvalue', () => {
    // Correlated 2D cloud.
    const data = [
      [1, 2], [2, 3.5], [0.5, 1.2], [3, 5], [-1, -1.8],
    ];
    const centered = data.map((p) => [p[0], p[1]]);
    const S = sampleCovariance(centered);
    const { eigenvalues } = eig2x2(S);
    const ml = ppcaClosedFormML(S, 1);
    const discardedMean = eigenvalues[1] / (2 - 1);
    expect(ml.sigma2ml).toBeCloseTo(discardedMean, 10);
    expect(ml.boundary).toBe(false);
  });

  it('PPCA: M=D is flagged as a boundary case, not a standard PPCA mode', () => {
    const data = [[1, 2], [2, 3], [0, 0], [-1, -1]];
    const S = sampleCovariance(data);
    const ml = ppcaClosedFormML(S, 2);
    expect(ml.boundary).toBe(true);
  });

  it('PPCA: posterior reconstruction differs from orthogonal PCA projection when sigma2 > 0', () => {
    const data = [[1, 2], [2, 3.5], [0.5, 1.2], [3, 5], [-1, -1.8]];
    const mean = [data.reduce((s, p) => s + p[0], 0) / data.length, data.reduce((s, p) => s + p[1], 0) / data.length];
    const centered = data.map((p) => [p[0] - mean[0], p[1] - mean[1]]);
    const S = sampleCovariance(centered);
    const { eigenvectors } = eig2x2(S);
    const ml = ppcaClosedFormML(S, 1);
    const x = data[0];
    const ppcaRec = posteriorReconstruction(x, ml.Wml, ml.sigma2ml, mean);
    const pcaRec = pcaOrthogonalProjection(x, eigenvectors, 1, mean);
    expect(Math.hypot(ppcaRec[0] - pcaRec[0], ppcaRec[1] - pcaRec[1])).toBeGreaterThan(1e-6);
  });

  /* ---------------------------------------------------------------------- */
  /* U-Net structure & skip connections                                     */
  /* ---------------------------------------------------------------------- */
  it('U-Net: bottleneck is a single block at the correct resolution', () => {
    const sizes = computeUNetSizes(256, 4);
    expect(sizes.encoderSizes.length).toBe(4);
    expect(sizes.decoderSizes.length).toBe(4);
    expect(sizes.bottleneckSize).toBe(256 / 16);
    expect(sizes.bottleneckSize).toBe(sizes.encoderSizes[sizes.encoderSizes.length - 1] / 2);
  });

  it('U-Net: bottleneck position does not overlap any encoder block', () => {
    const stages = buildUNetStages(256, 3, 64, 2);
    const bottleneck = stages[stages.length - 1].encoderPosition;
    for (let i = 0; i < stages.length - 1; i++) {
      const enc = stages[i].encoderPosition;
      const overlap = !(
        bottleneck.x + bottleneck.w <= enc.x ||
        bottleneck.x >= enc.x + enc.w ||
        bottleneck.y + bottleneck.h <= enc.y ||
        bottleneck.y >= enc.y + enc.h
      );
      expect(overlap).toBe(false);
    }
  });

  it('U-Net: skip connections target matching decoder stages', () => {
    const stages = buildUNetStages(256, 3, 64, 2);
    const decoderStages = [...stages].reverse();
    for (let i = 0; i < stages.length; i++) {
      const enc = stages[i].encoderPosition;
      const dec = decoderStages[i].decoderPosition;
      expect(enc.spatialSize).toBe(dec.spatialSize);
    }
  });

  it('U-Net: input alignment is 2^levels', () => {
    expect(requiredInputAlignment(3)).toBe(8);
    expect(requiredInputAlignment(4)).toBe(16);
  });

  /* ---------------------------------------------------------------------- */
  /* Discrete ELBO q semantics                                              */
  /* ---------------------------------------------------------------------- */
  it('discrete ELBO: simplex control values always sum to 1', () => {
    expect(constrainSimplex([0.2, 0.3]).reduce((a, b) => a + b, 0)).toBeCloseTo(1, 10);
    expect(constrainSimplex([0.6, 0.6]).reduce((a, b) => a + b, 0)).toBeCloseTo(1, 10);
    expect(constrainSimplex([-0.1, 0.4]).reduce((a, b) => a + b, 0)).toBeCloseTo(1, 10);
  });

  it('discrete ELBO: identity residual is numerically zero at true posterior', () => {
    const means = [-2, 0, 2];
    const weights = [0.3, 0.4, 0.3];
    const x = 0.1;
    const q = truePosterior(x, means, weights, 1);
    const { logPx, elbo, kl } = computeELBO(x, q, means, weights, 1);
    expect(Math.abs(logPx - elbo - kl)).toBeLessThan(1e-9);
  });

  /* ---------------------------------------------------------------------- */
  /* IoU / NMS                                                              */
  /* ---------------------------------------------------------------------- */
  it('IoU: identical boxes have IoU 1, disjoint boxes have IoU 0', () => {
    const a = { x: 10, y: 10, w: 50, h: 50 };
    const b = { x: 10, y: 10, w: 50, h: 50 };
    const c = { x: 100, y: 100, w: 50, h: 50 };
    expect(computeIoU(a, b)).toBeCloseTo(1, 10);
    expect(computeIoU(a, c)).toBeCloseTo(0, 10);
  });

  it('NMS: class-aware mode never suppresses across classes', () => {
    const boxes = [
      { id: 1, x: 10, y: 10, w: 50, h: 50, score: 0.95, classId: 0 },
      { id: 2, x: 15, y: 15, w: 45, h: 45, score: 0.9, classId: 1 },
      { id: 3, x: 12, y: 12, w: 48, h: 48, score: 0.85, classId: 0 },
    ];
    const result = nmsTrace(boxes, 0.1, 'class-aware');
    expect(result.suppressed).not.toContain(2);
  });

  it('NMS: trace reproduces the final kept set', () => {
    const boxes = [
      { id: 1, x: 10, y: 10, w: 50, h: 50, score: 0.95, classId: 0 },
      { id: 2, x: 15, y: 15, w: 45, h: 45, score: 0.9, classId: 0 },
      { id: 3, x: 200, y: 200, w: 40, h: 40, score: 0.8, classId: 0 },
    ];
    const { kept, trace } = nmsTrace(boxes, 0.5, 'class-agnostic');
    const active = new Set(boxes.map((b) => b.id));
    for (const t of trace) {
      if (t.action === 'suppress') active.delete(t.comparedBox);
    }
    const reproduced = Array.from(active).sort((a, b) => a - b);
    expect(reproduced).toEqual(kept.sort((a, b) => a - b));
  });
});
