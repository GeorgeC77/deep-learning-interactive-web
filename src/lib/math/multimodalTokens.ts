export type VisionTokenization = {
  tokens: number;
  patchDimension: number;
  attentionPairs: number;
  pixelAttentionPairs: number;
  reduction: number;
};

export function visionTokenization(
  height: number,
  width: number,
  channels: number,
  patchSize: number,
): VisionTokenization {
  if (![height, width, channels, patchSize].every((value) => Number.isInteger(value) && value > 0)) {
    throw new Error('dimensions must be positive integers');
  }
  if (height % patchSize !== 0 || width % patchSize !== 0) {
    throw new Error('patch size must divide image height and width');
  }
  const tokens = (height / patchSize) * (width / patchSize);
  const patchDimension = patchSize * patchSize * channels;
  const attentionPairs = tokens * tokens;
  const pixelTokens = height * width;
  const pixelAttentionPairs = pixelTokens * pixelTokens;
  return { tokens, patchDimension, attentionPairs, pixelAttentionPairs, reduction: pixelAttentionPairs / attentionPairs };
}

export function audioFrameCount(durationSeconds: number, frameRate: number): number {
  if (durationSeconds < 0 || frameRate <= 0) throw new Error('duration and frame rate must be valid');
  return Math.ceil(durationSeconds * frameRate);
}
