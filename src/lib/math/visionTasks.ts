export type VisionTask = 'classification' | 'detection' | 'segmentation';

export function visionOutputElements(
  task: VisionTask,
  height: number,
  width: number,
  classes: number,
  boxes = 1,
): number {
  if (task === 'classification') return classes;
  if (task === 'detection') return boxes * (4 + 1 + classes);
  return height * width * classes;
}

export function denseLayerParameterCount(
  height: number,
  width: number,
  inputChannels: number,
  units: number,
): number {
  return (height * width * inputChannels + 1) * units;
}

export function convolutionParameterCount(
  kernelSize: number,
  inputChannels: number,
  outputChannels: number,
): number {
  return (kernelSize * kernelSize * inputChannels + 1) * outputChannels;
}
