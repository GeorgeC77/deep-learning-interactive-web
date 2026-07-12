/* -------------------------------------------------------------------------- */
/* U-Net architecture helpers                                                  */
/* -------------------------------------------------------------------------- */

export interface UNetSizeResult {
  encoderSizes: number[];
  bottleneckSize: number;
  decoderSizes: number[];
}

export interface Rectangle {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface UNetStage {
  encoderPosition: Rectangle;
  decoderPosition: Rectangle;
  spatialSize: number;
  encoderChannels: number;
  decoderChannels: number;
}

/**
 * Compute the spatial sizes of every U-Net level.
 *
 * Each encoder level halves the resolution, so for i = 0..levels-1:
 *   encoderSizes[i] = inputSize / 2^i
 * The bottleneck is one further halving:
 *   bottleneckSize = inputSize / 2^levels
 * Decoder sizes are the reverse of the encoder sizes.
 */
export function computeUNetSizes(inputSize: number, levels: number): UNetSizeResult {
  const encoderSizes: number[] = [];
  for (let i = 0; i < levels; i++) {
    encoderSizes.push(inputSize / Math.pow(2, i));
  }
  const bottleneckSize = inputSize / Math.pow(2, levels);
  const decoderSizes = [...encoderSizes].reverse();
  return { encoderSizes, bottleneckSize, decoderSizes };
}

/**
 * Build metadata for each U-Net stage, ordered from input resolution to bottleneck.
 *
 * Layout convention:
 * - Encoder blocks descend from top-left to bottom-center.
 * - Decoder blocks ascend from bottom-center to top-right.
 * - The bottleneck sits between the last encoder and the first decoder block.
 */
export function buildUNetStages(
  inputSize: number,
  levels: number,
  baseChannels: number,
  growth: number,
): UNetStage[] {
  const stages: UNetStage[] = [];
  for (let i = 0; i < levels; i++) {
    const spatialSize = inputSize / Math.pow(2, i);
    const encoderChannels = baseChannels * Math.pow(growth, i);
    const decoderChannels = baseChannels * Math.pow(growth, i);

    stages.push({
      encoderPosition: {
        x: 20 + i * 120,
        y: 20 + i * 60,
        w: 80,
        h: 80 - i * 10,
      },
      decoderPosition: {
        x: 20 + (2 * levels - i) * 120,
        y: 20 + (levels - 1 - i) * 60,
        w: 80,
        h: 50 + i * 10,
      },
      spatialSize,
      encoderChannels,
      decoderChannels,
    });
  }
  return stages;
}

/**
 * Verify that an encoder skip connection can be concatenated with the
 * corresponding decoder feature map. They must share the same H×W.
 */
export function checkSkipCompatibility(stage: UNetStage): boolean {
  return (
    stage.encoderPosition.w > 0 &&
    stage.encoderPosition.h > 0 &&
    stage.decoderPosition.w > 0 &&
    stage.decoderPosition.h > 0 &&
    stage.spatialSize > 0 &&
    Number.isFinite(stage.encoderChannels) &&
    Number.isFinite(stage.decoderChannels)
  );
}

/**
 * Return the input-size alignment required by the encoder/decoder halving.
 * A U-Net with `levels` pooling layers requires the input side length to be
 * divisible by 2^levels.
 */
export function requiredInputAlignment(levels: number): number {
  return Math.pow(2, levels);
}
