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

/**
 * Pointwise optimum of the discriminator for fixed data and generator densities.
 *
 *   D*(x) = p_data(x) / (p_data(x) + p_G(x))
 */
export function optimalDiscriminator(pData: number, pGenerator: number): number {
  if (!Number.isFinite(pData) || !Number.isFinite(pGenerator) || pData < 0 || pGenerator < 0) {
    throw new RangeError('Densities must be finite and non-negative.');
  }
  const total = pData + pGenerator;
  if (total === 0) {
    throw new RangeError('At least one density must be positive.');
  }
  return pData / total;
}

export type CycleGanLoss = {
  adversarial: number;
  cycle: number;
  total: number;
};

/** Combine the two adversarial directions and the two reconstruction cycles. */
export function cycleGanObjective(
  adversarialX: number,
  adversarialY: number,
  cycleX: number,
  cycleY: number,
  cycleWeight: number,
): CycleGanLoss {
  const values = [adversarialX, adversarialY, cycleX, cycleY, cycleWeight];
  if (values.some((value) => !Number.isFinite(value) || value < 0)) {
    throw new RangeError('CycleGAN loss terms and weight must be finite and non-negative.');
  }
  const adversarial = adversarialX + adversarialY;
  const cycle = cycleX + cycleY;
  return { adversarial, cycle, total: adversarial + cycleWeight * cycle };
}

export type CycleGanCandidate = {
  id: 'semantic' | 'shortcut';
  label: string;
  adversarial: number;
  cycle: number;
};

/**
 * A deliberately small counterexample: cycle consistency can prefer a reversible
 * shortcut even when that mapping is not the intended semantic translation.
 */
export const cycleGanCandidates: CycleGanCandidate[] = [
  { id: 'semantic', label: '语义正确映射', adversarial: 0.9, cycle: 0.35 },
  { id: 'shortcut', label: '可逆捷径映射', adversarial: 1.6, cycle: 0.05 },
];

export function scoreCycleGanCandidate(
  candidate: CycleGanCandidate,
  cycleWeight: number,
): number {
  if (!Number.isFinite(cycleWeight) || cycleWeight < 0) {
    throw new RangeError('Cycle weight must be finite and non-negative.');
  }
  return candidate.adversarial + cycleWeight * candidate.cycle;
}

export function rankCycleGanCandidates(
  cycleWeight: number,
  candidates: CycleGanCandidate[] = cycleGanCandidates,
): Array<CycleGanCandidate & { total: number }> {
  return candidates
    .map((candidate) => ({ ...candidate, total: scoreCycleGanCandidate(candidate, cycleWeight) }))
    .sort((left, right) => left.total - right.total);
}
