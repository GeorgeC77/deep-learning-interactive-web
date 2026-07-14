/* -------------------------------------------------------------------------- */
/* GAN generator loss and gradients — extracted from GANGradientLab          */
/* -------------------------------------------------------------------------- */

/**
 * Sigmoid (logistic) function.
 * Maps a discriminator logit a to a probability D = sigmoid(a).
 */
export function sigmoid(a: number): number {
  return 1 / (1 + Math.exp(-a));
}

/**
 * Minimax generator loss: L_MM = log(1 - D).
 * This is the objective the generator minimizes in the original GAN minimax game.
 */
export function minimaxLoss(D: number): number {
  return Math.log(1 - D);
}

/**
 * Non-saturating generator loss: L_NS = -log(D).
 * Heuristic modification that avoids vanishing gradients when D is near 0.
 */
export function nonSaturatingLoss(D: number): number {
  return -Math.log(D);
}

/**
 * Derivative of the minimax generator loss with respect to the discriminator logit a.
 *
 *   L_MM = log(1 - D)
 *   dL_MM / da = dL_MM / dD * dD / da
 *              = (1 / (1 - D)) * (-D * (1 - D))
 *              = -D
 *
 * Gradient descent updates a <- a - eta * dL_MM/da = a + eta*D, which raises
 * the logit and therefore raises D(G(z)).
 */
export function gradMinimaxLogit(D: number): number {
  return -D;
}

/**
 * Gradient of the non-saturating generator loss with respect to the discriminator logit a.
 *
 *   dL_NS / da = dL_NS / dD * dD / da
 *              = (-1 / D) * (D * (1 - D))
 *              = -(1 - D)
 */
export function gradNonSaturatingLogit(D: number): number {
  return -(1 - D);
}

/**
 * Gradient of the minimax generator loss with respect to the discriminator output D.
 *
 *   dL_MM / dD = 1 / (1 - D)
 */
export function gradMinimaxD(D: number): number {
  return 1 / (1 - D);
}

/**
 * Gradient of the non-saturating generator loss with respect to the discriminator output D.
 *
 *   dL_NS / dD = -1 / D
 */
export function gradNonSaturatingD(D: number): number {
  return -1 / D;
}

/**
 * Convenience bundle for a given discriminator logit.
 */
export function ganMetrics(a: number) {
  const D = sigmoid(a);
  return {
    a,
    D,
    minimax: minimaxLoss(D),
    nonSaturating: nonSaturatingLoss(D),
    gradMinimaxLogit: gradMinimaxLogit(D),
    gradNonSaturatingLogit: gradNonSaturatingLogit(D),
    gradMinimaxD: gradMinimaxD(D),
    gradNonSaturatingD: gradNonSaturatingD(D),
  };
}
