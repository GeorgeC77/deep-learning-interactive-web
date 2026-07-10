import { useMemo, useState } from 'react';
import { Slider } from '@/components/ui/slider';

const K = 3;
const MEANS = [-2, 0, 2];
const WEIGHTS = [0.3, 0.4, 0.3];
const STD = 1;
const SEED = 7;

export default function DiscreteLatentELBODemo() {
  const data = useMemo(() => generateGMMData(8, SEED), []);
  const [sampleIdx, setSampleIdx] = useState(0);
  const [qRaw, setQRaw] = useState<number[]>([0.33, 0.34, 0.33]);

  const x = data[sampleIdx];

  // True posterior gamma_k = p(z=k | x, theta)
  const logProbs = WEIGHTS.map((w, k) => Math.log(w) + gaussianLogPdf(x, MEANS[k], STD));
  const logPx = logSumExp(logProbs);
  const gamma = logProbs.map((lp) => Math.exp(lp - logPx));

  // Normalize student's q
  const qSum = qRaw.reduce((a, b) => a + b, 0) || 1;
  const q = qRaw.map((v) => v / qSum);

  // Per-sample log-likelihood, ELBO, KL gap
  const ll = logPx;
  const elbo = q.reduce((sum, qk, k) => sum + qk * (logProbs[k] - Math.log(qk + 1e-12)), 0);
  const klGap = q.reduce((sum, qk, k) => sum + qk * Math.log((qk + 1e-12) / (gamma[k] + 1e-12)), 0);

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-700 font-bold">ELBO</div>
        <h2 className="text-2xl font-bold text-gray-900">离散隐变量：GMM 后验与 ELBO 间隙</h2>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">选择样本 x：{x.toFixed(2)}</label>
        <Slider
          value={[sampleIdx]}
          min={0}
          max={data.length - 1}
          step={1}
          onValueChange={([v]) => {
            setSampleIdx(v);
            // Reset q to uniform for the new sample
            setQRaw(Array(K).fill(1 / K));
          }}
          className="mt-2"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="font-medium text-gray-700 mb-2">真实后验 p(z=k | x, θ)</p>
          <div className="space-y-2">
            {gamma.map((g, k) => (
              <div key={k} className="flex items-center gap-2">
                <span className="w-8 text-gray-600">k={k}</span>
                <div className="flex-1 h-4 bg-gray-200 rounded overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: `${g * 100}%` }} />
                </div>
                <span className="w-16 text-right">{g.toFixed(3)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-indigo-50 rounded-lg p-4">
          <p className="font-medium text-gray-700 mb-2">你的变分后验 q(z=k)</p>
          <div className="space-y-4">
            {q.map((qk, k) => (
              <div key={k}>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>k={k}</span>
                  <span>{qk.toFixed(3)}</span>
                </div>
                <Slider
                  value={[qRaw[k]]}
                  min={0.01}
                  max={1}
                  step={0.01}
                  onValueChange={([v]) => {
                    const next = [...qRaw];
                    next[k] = v;
                    setQRaw(next);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <MetricBox label="对数似然 ln p(x|θ)" value={ll} />
        <MetricBox label="ELBO(q)" value={elbo} />
        <MetricBox label="KL(q || p) = 间隙" value={klGap} />
      </div>

      <p className="text-sm text-gray-700">
        分解：
        <span className="font-mono text-blue-900">ln p(x|θ) = ELBO(q) + KL(q || p(z|x,θ))</span>
        。当你把 q 调整到与真实后验一致时，KL 会趋近于 0，ELBO 会接触对数似然。
      </p>
    </section>
  );
}

function MetricBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-blue-50 rounded-lg p-4 text-center">
      <div className="text-sm text-gray-600">{label}</div>
      <div className="text-xl font-bold text-blue-700">{value.toFixed(3)}</div>
    </div>
  );
}

function generateGMMData(n: number, seed: number) {
  const rng = mulberry32(seed);
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    const u = rng();
    let cum = 0;
    let comp = 0;
    for (let k = 0; k < K; k++) {
      cum += WEIGHTS[k];
      if (u < cum) {
        comp = k;
        break;
      }
    }
    out.push(MEANS[comp] + randn(rng) * STD);
  }
  return out;
}

function gaussianLogPdf(x: number, mu: number, sigma: number) {
  const z = (x - mu) / sigma;
  return -0.5 * (z * z + Math.log(2 * Math.PI * sigma * sigma));
}

function logSumExp(arr: number[]) {
  const max = Math.max(...arr);
  return max + Math.log(arr.reduce((sum, v) => sum + Math.exp(v - max), 0));
}

function randn(rng: () => number) {
  const u = rng();
  const v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
