import { describe, expect, it } from 'vitest';
import {
  convolutionParameterCount,
  denseLayerParameterCount,
  visionOutputElements,
} from '@/lib/math/visionTasks';

describe('computer-vision task shapes', () => {
  it('distinguishes global, set-valued, and dense outputs', () => {
    expect(visionOutputElements('classification', 32, 32, 10)).toBe(10);
    expect(visionOutputElements('detection', 32, 32, 10, 5)).toBe(75);
    expect(visionOutputElements('segmentation', 32, 32, 10)).toBe(10240);
  });

  it('shows why locality and sharing reduce independent parameters', () => {
    expect(denseLayerParameterCount(1000, 1000, 3, 1000)).toBe(3_000_001_000);
    expect(convolutionParameterCount(3, 3, 64)).toBe(1792);
  });
});
