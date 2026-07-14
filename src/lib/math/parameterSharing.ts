/**
 * Parameter-count and connection-count formulas for a single layer that maps an input spatial
 * feature map to an output spatial feature map.
 *
 * The layer is fully specified by:
 * - input spatial size:  Hin x Win
 * - input channels:      Cin
 * - output spatial size: Hout x Wout
 * - output channels:     Cout
 * - kernel spatial size: Kh x Kw
 *
 * Connections are input-output wiring edges, independent of whether the weights are shared.
 * Weight parameters are the learnable multiplicative weights.
 * Bias parameters are the learnable additive biases (one per output unit).
 * Total parameters = weight parameters + bias parameters.
 */

/** Weight parameters for a standard convolutional layer. */
export function convWeightParams(Kh: number, Kw: number, Cin: number, Cout: number): number {
  return Kh * Kw * Cin * Cout;
}

/** Bias parameters for a standard convolutional layer. */
export function convBiasParams(Cout: number): number {
  return Cout;
}

/** Total parameters for a standard convolutional layer (weights + bias). */
export function convParams(Kh: number, Kw: number, Cin: number, Cout: number): number {
  return convWeightParams(Kh, Kw, Cin, Cout) + convBiasParams(Cout);
}

/** Weight parameters for a locally-connected layer. */
export function locallyConnectedWeightParams(
  Hout: number,
  Wout: number,
  Kh: number,
  Kw: number,
  Cin: number,
  Cout: number,
): number {
  return Hout * Wout * Kh * Kw * Cin * Cout;
}

/** Bias parameters for a locally-connected layer (one per output location/channel). */
export function locallyConnectedBiasParams(Hout: number, Wout: number, Cout: number): number {
  return Hout * Wout * Cout;
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
  return locallyConnectedWeightParams(Hout, Wout, Kh, Kw, Cin, Cout) + locallyConnectedBiasParams(Hout, Wout, Cout);
}

/** Weight parameters for a fully-connected layer that flattens the spatial input. */
export function denseWeightParams(
  Hin: number,
  Win: number,
  Cin: number,
  Hout: number,
  Wout: number,
  Cout: number,
): number {
  return Hin * Win * Cin * Hout * Wout * Cout;
}

/** Bias parameters for a fully-connected layer (one per output unit). */
export function denseBiasParams(Hout: number, Wout: number, Cout: number): number {
  return Hout * Wout * Cout;
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
  return denseWeightParams(Hin, Win, Cin, Hout, Wout, Cout) + denseBiasParams(Hout, Wout, Cout);
}

/**
 * Connections for a standard convolutional layer.
 * Convolution shares weights across spatial locations but the input-output wiring
 * is the same as a locally-connected layer.
 */
export function convConnectionCount(
  Hout: number,
  Wout: number,
  Cout: number,
  Kh: number,
  Kw: number,
  Cin: number,
): number {
  return Hout * Wout * Cout * Kh * Kw * Cin;
}

/**
 * Connections for a locally-connected layer.
 * Each output unit is connected to Kh*Kw*Cin input units at its own receptive field.
 */
export function locallyConnectedConnectionCount(
  Hout: number,
  Wout: number,
  Cout: number,
  Kh: number,
  Kw: number,
  Cin: number,
): number {
  return Hout * Wout * Cout * Kh * Kw * Cin;
}

/**
 * Connections for a fully-connected (dense) layer that flattens the spatial input.
 * Every output unit is connected to every input unit.
 */
export function denseConnectionCount(
  Hin: number,
  Win: number,
  Cin: number,
  Hout: number,
  Wout: number,
  Cout: number,
): number {
  return Hin * Win * Cin * Hout * Wout * Cout;
}

/**
 * @deprecated Use the architecture-specific connection-count functions instead.
 * Total number of connections between input and output units for a locally-connected
 * or convolutional wiring pattern.
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
  void Hin;
  void Win;
  return Hout * Wout * Cout * Kh * Kw * Cin;
}
