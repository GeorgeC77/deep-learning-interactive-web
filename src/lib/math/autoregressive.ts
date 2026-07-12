/* -------------------------------------------------------------------------- */
/* Autoregressive sampling math                                                */
/* -------------------------------------------------------------------------- */

export type RNG = () => number;

export type TransitionMap = Record<string, number[]>;

export function createRng(seed: number): RNG {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function softmax(logits: number[]): number[] {
  const max = Math.max(...logits);
  const exps = logits.map((z) => Math.exp(z - max));
  const sum = exps.reduce((acc, e) => acc + e, 0);
  return exps.map((e) => e / sum);
}

export function applyTemperature(logits: number[], temperature: number): number[] {
  const t = temperature > 0 ? temperature : 1e-6;
  return logits.map((z) => z / t);
}

export function nextLogits(
  context: string[],
  vocab: string[],
  transitionMap: TransitionMap,
): number[] {
  if (vocab.length === 0) return [];
  const last = context.length > 0 ? context[context.length - 1] : '';
  const logits = transitionMap[last];
  if (logits && logits.length === vocab.length) return logits.slice();
  // Unknown token or empty context: return uniform zero logits.
  return new Array(vocab.length).fill(0);
}

export function topKFilter(probs: number[], k: number): number[] {
  const n = probs.length;
  if (n === 0) return [];
  const kk = Math.max(0, Math.min(Math.floor(k), n));
  const sorted = probs
    .map((pr, i) => ({ pr, i }))
    .sort((a, b) => b.pr - a.pr);
  const mask = new Array(n).fill(false);
  for (let j = 0; j < kk; j++) {
    mask[sorted[j].i] = true;
  }
  const filtered = probs.map((pr, i) => (mask[i] ? pr : 0));
  const sum = filtered.reduce((acc, pr) => acc + pr, 0);
  if (sum === 0) return filtered;
  return filtered.map((pr) => pr / sum);
}

export function nucleusFilter(probs: number[], p: number): number[] {
  const n = probs.length;
  if (n === 0) return [];
  const target = Math.max(0, Math.min(p, 1));
  const sorted = probs
    .map((pr, i) => ({ pr, i }))
    .sort((a, b) => b.pr - a.pr);
  const selected = new Set<number>();
  let cum = 0;
  for (const item of sorted) {
    selected.add(item.i);
    cum += item.pr;
    if (cum >= target) break;
  }
  const filtered = probs.map((pr, i) => (selected.has(i) ? pr : 0));
  const sum = filtered.reduce((acc, pr) => acc + pr, 0);
  if (sum === 0) return filtered;
  return filtered.map((pr) => pr / sum);
}

export function sampleNextToken(probs: number[], rng: RNG): number {
  const u = rng();
  let cum = 0;
  for (let i = 0; i < probs.length; i++) {
    cum += probs[i];
    if (u <= cum) return i;
  }
  return probs.length - 1;
}

export function greedyChoice(probs: number[]): number {
  return probs.indexOf(Math.max(...probs));
}

export function buildToyTransitionMap(vocab: string[]): TransitionMap {
  const map: TransitionMap = {};
  const chain: Record<string, string> = {
    猫: '坐',
    坐: '在',
    在: '垫',
    垫: '子',
    子: '上',
    上: '。',
    '。': '猫',
  };
  const bias: Record<string, number> = {
    猫: 2,
    坐: 2,
    在: 1.5,
    垫: 2,
    子: 1.5,
    上: 2,
    '。': 1,
  };

  vocab.forEach((token, idx) => {
    const logits = Array.from({ length: vocab.length }, (_, i) => {
      const a = Math.sin((i + 1) * (idx + 2));
      const b = 0.5 * Math.cos(i * 3 + idx);
      return a + b;
    });
    const next = chain[token];
    if (next !== undefined) {
      const nextIdx = vocab.indexOf(next);
      if (nextIdx >= 0) logits[nextIdx] += bias[token];
    }
    map[token] = logits;
  });

  return map;
}
