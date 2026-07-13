import { describe, it, expect } from 'vitest';
import {
  computeUNetSizes,
  buildUNetStages,
  checkSkipCompatibility,
  requiredInputAlignment,
  computePaddedInputSize,
  computeOutputCrop,
  type Rectangle,
  type UNetStage,
} from '../lib/math/unet';

function rectanglesOverlap(a: Rectangle, b: Rectangle): boolean {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

function computeBottleneckRect(stages: UNetStage[]): Rectangle {
  const lastEncoder = stages[stages.length - 1].encoderPosition;
  const firstDecoder = stages[stages.length - 1].decoderPosition;
  const gap = firstDecoder.x - (lastEncoder.x + lastEncoder.w);
  return {
    x: lastEncoder.x + lastEncoder.w + gap / 4,
    y: lastEncoder.y + lastEncoder.h / 2 - 15,
    w: gap / 2,
    h: 30,
  };
}

describe('unet', () => {
  it('computeUNetSizes returns bottleneckSize = inputSize / 2^levels and encoderSizes.length == levels', () => {
    const inputSize = 256;
    const levels = 4;
    const result = computeUNetSizes(inputSize, levels);

    expect(result.encoderSizes.length).toBe(levels);
    expect(result.bottleneckSize).toBe(inputSize / Math.pow(2, levels));
    expect(result.encoderSizes).toEqual([256, 128, 64, 32]);
    expect(result.decoderSizes).toEqual([32, 64, 128, 256]);
  });

  it('bottleneck appears once (count coordinates equal to bottleneck)', () => {
    const inputSize = 256;
    const levels = 3;
    const stages = buildUNetStages(inputSize, levels, 64, 2);
    const sizes = computeUNetSizes(inputSize, levels);
    const bottleneckRect = computeBottleneckRect(stages);

    // Only the bottleneck block itself has the bottleneck spatial size.
    const allBlocks: { rect: Rectangle; spatialSize: number }[] = [
      ...stages.map((s) => ({ rect: s.encoderPosition, spatialSize: s.encoderSpatial[0] })),
      { rect: bottleneckRect, spatialSize: sizes.bottleneckSize },
      ...stages.map((s) => ({ rect: s.decoderPosition, spatialSize: s.decoderSpatial[0] })),
    ];
    const bottleneckCount = allBlocks.filter(
      (b) => b.spatialSize === sizes.bottleneckSize,
    ).length;
    expect(bottleneckCount).toBe(1);
  });

  it('bottleneck does not overlap any encoder block', () => {
    const inputSize = 256;
    const levels = 3;
    const stages = buildUNetStages(inputSize, levels, 64, 2);
    const bottleneckRect = computeBottleneckRect(stages);

    for (const stage of stages) {
      expect(rectanglesOverlap(bottleneckRect, stage.encoderPosition)).toBe(false);
    }
  });

  it('skip connection count equals levels and each stage is compatible', () => {
    const levels = 4;
    const stages = buildUNetStages(256, levels, 64, 2);
    expect(stages.length).toBe(levels);
    expect(stages.every(checkSkipCompatibility)).toBe(true);
  });

  it('every skip has a unique decoder endpoint', () => {
    const levels = 4;
    const stages = buildUNetStages(256, levels, 64, 2);
    const decoderEndpoints = stages.map((s) => s.decoderPosition);
    const keys = decoderEndpoints.map((r) => `${r.x},${r.y},${r.w},${r.h}`);
    expect(new Set(keys).size).toBe(levels);
  });

  it('decoder channel chain is consistent', () => {
    const stages = buildUNetStages(256, 3, 64, 2);
    for (const stage of stages) {
      expect(stage.decoderInputChannels).toBe(stage.encoderChannels * 2);
      expect(stage.decoderInputSpatial[0]).toBe(stage.decoderSpatial[0] / 2);
      expect(stage.upsampledChannels).toBe(stage.encoderChannels);
      expect(stage.skipChannels).toBe(stage.encoderChannels);
      expect(stage.concatChannels).toBe(stage.upsampledChannels + stage.skipChannels);
      expect(stage.outputChannels).toBe(stage.encoderChannels);
    }
  });

  it('same-resolution encoder and decoder stages share the same centre y-coordinate', () => {
    const levels = 4;
    const stages = buildUNetStages(256, levels, 64, 2);
    for (const stage of stages) {
      const encCY = stage.encoderPosition.y + stage.encoderPosition.h / 2;
      const decCY = stage.decoderPosition.y + stage.decoderPosition.h / 2;
      expect(encCY).toBeCloseTo(decCY, 10);
    }
  });

  it('checkSkipCompatibility rejects mismatched spatial dimensions', () => {
    const stages = buildUNetStages(256, 3, 64, 2);
    const stage = { ...stages[0] };
    expect(checkSkipCompatibility(stage)).toBe(true);

    const mismatched = {
      ...stage,
      decoderSpatial: [stage.decoderSpatial[0] + 1, stage.decoderSpatial[1]] as [number, number],
    };
    expect(checkSkipCompatibility(mismatched)).toBe(false);
  });

  it('requiredInputAlignment returns 2^levels', () => {
    expect(requiredInputAlignment(1)).toBe(2);
    expect(requiredInputAlignment(3)).toBe(8);
    expect(requiredInputAlignment(5)).toBe(32);
  });

  it('computePaddedInputSize returns correct padding for non-aligned inputs', () => {
    const result = computePaddedInputSize(250, 3);
    expect(result.paddedSize).toBe(256);
    expect(result.totalPadding).toBe(6);
    expect(result.top + result.bottom).toBe(result.totalPadding);
    expect(result.left + result.right).toBe(result.totalPadding);

    const aligned = computePaddedInputSize(256, 3);
    expect(aligned.totalPadding).toBe(0);
  });

  it('computeOutputCrop restores original input size', () => {
    const inputSize = 255;
    const paddedSize = 256;
    const crop = computeOutputCrop(inputSize, paddedSize);
    expect(crop.finalHeight).toBe(inputSize);
    expect(crop.finalWidth).toBe(inputSize);
    expect(crop.cropBottom - crop.cropTop).toBe(inputSize);
    expect(crop.cropRight - crop.cropLeft).toBe(inputSize);
  });

  it('asymmetric padding crop restores exact H×W', () => {
    const inputSize = 250;
    const { paddedSize, top, bottom, left, right } = computePaddedInputSize(inputSize, 3);
    expect(paddedSize).toBe(256);
    expect(top).toBe(3);
    expect(bottom).toBe(3);
    expect(left).toBe(3);
    expect(right).toBe(3);

    const crop = computeOutputCrop(inputSize, paddedSize);
    expect(crop.cropTop).toBe(top);
    expect(crop.cropBottom).toBe(paddedSize - bottom);
    expect(crop.cropLeft).toBe(left);
    expect(crop.cropRight).toBe(paddedSize - right);
    expect(crop.finalHeight).toBe(inputSize);
    expect(crop.finalWidth).toBe(inputSize);
  });

  it('valid-region mask excludes padded pixels for 255 and 257 presets', () => {
    for (const inputSize of [255, 257]) {
      const { paddedSize } = computePaddedInputSize(inputSize, 3);
      const crop = computeOutputCrop(inputSize, paddedSize);
      expect(crop.validMask.length).toBe(inputSize);
      expect(crop.validMask[0].length).toBe(inputSize);
      expect(crop.validMask.every((row) => row.every((v) => v))).toBe(true);
    }
  });
});
