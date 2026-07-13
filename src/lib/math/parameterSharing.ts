/**
 * Parameter-count formulas for a single layer that maps an input spatial
 * feature map to an output spatial feature map.
 *
 * The layer is fully specified by:
 * - input spatial size:  Hin x Win
 * - input channels:      Cin
 * - output spatial size: Hout x Wout
 * - output channels:     Cout
 * - kernel spatial size: Kh x Kw
 */

/** Parameters for a standard convolutional layer (weights + bias). */
export function convParams(Kh: number, Kw: number, Cin: number, Cout: number): number {
  return Kh * Kw * Cin * Cout + Cout;
}

/**
 * Parameters for a locally-connected layer: every output location has its own
 * kernel and bias.
 */
export function locallyConnectedParams(
  Hout: number,
  Wout: number,
  Kh: number,
  Kw: number,
  Cin: number,
  Cout: number,
): number {
  return Hout * Wout * Kh * Kw * Cin * Cout + Hout * Wout * Cout;
}

/** Parameters for a fully-connected layer that flattens the spatial input. */
export function denseParams(
  Hin: number,
  Win: number,
  Cin: number,
  Hout: number,
  Wout: number,
  Cout: number,
): number {
  return Hin * Win * Cin * Hout * Wout * Cout + Hout * Wout * Cout;
}

/**
 * Total number of connections between input and output units. This quantity is
 * independent of whether weights are shared (convolution), not shared
 * (locally-connected), or fully-dense.
 */
export function connectionCount(
  Hin: number,
  Win: number,
  Cin: number,
  Hout: number,
  Wout: number,
  Cout: number,
  Kh: number,
  Kw: number,
): number {
  // Hin/Win are part of the public signature for symmetry with the other
  // formulas; the connection count itself only depends on the output field
  // and the kernel receptive field.
  void Hin;
  void Win;
  return Hout * Wout * Cout * Kh * Kw * Cin;
}
