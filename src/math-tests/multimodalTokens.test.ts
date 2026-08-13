import { describe, expect, it } from 'vitest';
import { audioFrameCount, visionTokenization } from '@/lib/math/multimodalTokens';

describe('multimodalTokens', () => {
  it('computes ViT patch count and flattened patch dimension', () => {
    const result = visionTokenization(224, 224, 3, 16);
    expect(result.tokens).toBe(196);
    expect(result.patchDimension).toBe(16 * 16 * 3);
    expect(result.attentionPairs).toBe(196 ** 2);
  });

  it('reduces attention pairs by sixteen when patch width doubles', () => {
    const small = visionTokenization(224, 224, 3, 16);
    const large = visionTokenization(224, 224, 3, 32);
    expect(large.attentionPairs).toBe(small.attentionPairs / 16);
  });

  it('rejects patch sizes that do not tile the image', () => {
    expect(() => visionTokenization(224, 224, 3, 30)).toThrow(/divide/);
  });

  it('computes the number of fixed-rate audio frames', () => {
    expect(audioFrameCount(2.5, 50)).toBe(125);
  });
});
