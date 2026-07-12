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
  /** Encoder spatial size as [H, W] (always square in this toy). */
  encoderSpatial: [number, number];
  /** Decoder spatial size as [H, W] before concatenation. */
  decoderSpatial: [number, number];
  encoderChannels: number;
  /** Channels after upsampling inside the decoder block. */
  upsampledChannels: number;
  /** Channels brought in by the skip connection. */
  skipChannels: number;
  /** Channels after skip concatenation. */
  concatChannels: number;
  /** Channels after the decoder convolutions. */
  outputChannels: number;
  encoderPosition: Rectangle;
  decoderPosition: Rectangle;
}

/**
 * Compute the spatial sizes of every U-Net level for an already-aligned input.
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
 * - Encoder blocks descend from top-left to bottom-left.
 * - Decoder blocks mirror the encoder vertically on the right side, so that
 *   encoder[i] and decoder[levels-1-i] share the same centre y-coordinate and
 *   the same spatial resolution (the skip-concat requirement).
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
    const upsampledChannels = encoderChannels;
    const skipChannels = encoderChannels;
    const concatChannels = upsampledChannels + skipChannels;
    const outputChannels = encoderChannels;

    stages.push({
      encoderSpatial: [spatialSize, spatialSize],
      decoderSpatial: [spatialSize, spatialSize],
      encoderChannels,
      upsampledChannels,
      skipChannels,
      concatChannels,
      outputChannels,
      encoderPosition: {
        x: 20 + i * 120,
        y: 20 + i * 60,
        w: 80,
        h: 80 - i * 10,
      },
      decoderPosition: {
        x: 20 + (2 * levels - i) * 120,
        // Align the vertical centre with the matching encoder block so that
        // skip connections are horizontal and same-resolution endpoints coincide.
        y: 20 + i * 60 + (80 - i * 10 - (50 + i * 10)) / 2,
        w: 80,
        h: 50 + i * 10,
      },
    });
  }
  return stages;
}

/**
 * Verify that an encoder skip connection can be concatenated with the
 * corresponding decoder feature map. They must share the same H×W.
 */
export function checkSkipCompatibility(stage: UNetStage): boolean {
  const [hEnc, wEnc] = stage.encoderSpatial;
  const [hDec, wDec] = stage.decoderSpatial;
  return (
    Number.isFinite(hEnc) &&
    Number.isFinite(wEnc) &&
    Number.isFinite(hDec) &&
    Number.isFinite(wDec) &&
    hEnc > 0 &&
    wEnc > 0 &&
    hDec > 0 &&
    wDec > 0 &&
    hEnc === hDec &&
    wEnc === wDec
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

/**
 * Compute the smallest side length that is divisible by the required alignment
 * and the padding needed on each side to reach it.
 */
export function computePaddedInputSize(
  inputSize: number,
  levels: number,
): {
  paddedSize: number;
  totalPadding: number;
  top: number;
  bottom: number;
  left: number;
  right: number;
} {
  const alignment = requiredInputAlignment(levels);
  const paddedSize = Math.ceil(inputSize / alignment) * alignment;
  const totalPadding = paddedSize - inputSize;
  const top = Math.floor(totalPadding / 2);
  const bottom = totalPadding - top;
  return {
    paddedSize,
    totalPadding,
    top,
    bottom,
    left: top,
    right: bottom,
  };
}
