import { useMemo, useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import InteractiveDemo from '@/components/InteractiveDemo';
import KaTeX from '@/components/KaTeX';
import PredictionGate, { type Evaluation } from '@/components/PredictionGate';
import {
  klDivergenceDiagonalGaussian,
  betaObjective,
  sampleLatent,
  latentStatistics,
} from '@/lib/math/vae';

const SAMPLE_COUNT = 400;
const SAMPLE_SEED = 123;

export default function VAELatentCloudLab() {
  const [muX, setMuX] = useState(0);
  const [muY, setMuY] = useState(0);
  const [sigma, setSigma] = useState(1);
  const [beta, setBeta] = useState(1);
  const [priorVar, setPriorVar] = useState(1);
  const [reconLogLik, setReconLogLik] = useState(-10);

  const [betaPred, setBetaPred] = useState('');
  const [betaSubmitted, setBetaSubmitted] = useState(false);
  const [betaRevealed, setBetaRevealed] = useState(false);

  const [transferRevealed, setTransferRevealed] = useState(false);

  const mu = useMemo(() => [muX, muY], [muX, muY]);
  const sigmaVec = useMemo(() => [sigma, sigma], [sigma]);

  const points = useMemo(
    () => sampleLatent(mu, sigmaVec, SAMPLE_SEED, SAMPLE_COUNT),
    [mu, sigmaVec],
  );
  const stats = useMemo(() => latentStatistics(points), [points]);

  const kl = useMemo(
    () => klDivergenceDiagonalGaussian(mu, sigmaVec, priorVar),
    [mu, sigmaVec, priorVar],
  );
  const betaKl = beta * kl;
  const objective = betaObjective(reconLogLik, kl, beta);
  const standardElbo = betaObjective(reconLogLik, kl, 1);
  const objectiveExceedsElbo = objective > standardElbo;

  const klPrior1 = useMemo(
    () => klDivergenceDiagonalGaussian(mu, sigmaVec, 1),
    [mu, sigmaVec],
  );
  const klPrior4 = useMemo(
    () => klDivergenceDiagonalGaussian(mu, sigmaVec, 4),
    [mu, sigmaVec],
  );

  const limit = useMemo(() => {
    const dataMax = Math.max(Math.abs(muX), Math.abs(muY)) + 3 * sigma;
    const priorMax = 3 * Math.sqrt(priorVar);
    return Math.max(dataMax, priorMax, 1) * 1.2;
  }, [muX, muY, sigma, priorVar]);

  const toSvg = (x: number, y: number) => {
    const scale = 90 / (2 * limit);
    return {
      sx: 5 + (x + limit) * scale,
      sy: 95 - (y + limit) * scale,
    };
  };

  const scale = 90 / (2 * limit);
  const priorRx = 2 * Math.sqrt(priorVar) * scale;
  const postRx = 2 * sigma * scale;

  const reset = () => {
    setMuX(0);
    setMuY(0);
    setSigma(1);
    setBeta(1);
    setPriorVar(1);
    setReconLogLik(-10);
  };

  const applyBetaCounterexample = () => {
    setMuX(2.5);
    setMuY(0);
    setSigma(2);
    setBeta(0.5);
    setReconLogLik(-10);
  };

  const applyWidePrior = () => {
    setPriorVar(4);
    setTransferRevealed(true);
  };

  const evaluateBetaPrediction = (p: string): Evaluation => {
    const v = p.trim();
    if (v === '否' || v === 'no') {
      return {
        correct: true,
        category: '正确',
        feedback: 'β=1 对应标准 ELBO；β>1 只是对 KL 加权更重，不再是“标准 ELBO 目标”。',
      };
    }
    if (v === '是' || v === 'yes') {
      return {
        correct: false,
        category: '概念混淆',
        feedback: '不正确。标准 ELBO 特指 β=1 的情形。',
      };
    }
    return {
      correct: false,
      category: '无效选择',
      feedback: '请点击下方的“是”或“否”按钮进行选择。',
    };
  };

  return (
    <InteractiveDemo title="VAE 潜在空间云：重参数化与 β-目标">
      <div className="space-y-6">
        <div className="text-sm text-gray-700 space-y-2">
          <div>
            在 2D 潜在空间里，近似后验与先验分别为
            <KaTeX math="q(z|x)=\mathcal N(\mu, \sigma^2 I)" className="mx-1" />
            与
            <KaTeX math="p(z)=\mathcal N(0, I)" className="mx-1" />
            。重参数化采样为
            <KaTeX math="z=\mu+\sigma\odot\varepsilon" className="mx-1" />
            。
          </div>
          <div className="font-mono text-blue-900 bg-blue-50 rounded-lg p-2 inline-block">
            <KaTeX
              math="\mathrm{KL}=\tfrac12\sum_i\bigl(\sigma_i^2-\ln\sigma_i^2-1+\mu_i^2\bigr)"
              display={false}
            />
          </div>
          <div className="text-xs text-gray-500">
            KL 在 μ=0、σ=1 时为 0；偏离标准正态或均值远离原点都会使其增大。
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <SliderControl
            label="μ_x"
            value={muX}
            min={-3}
            max={3}
            step={0.1}
            onChange={setMuX}
          />
          <SliderControl
            label="μ_y"
            value={muY}
            min={-3}
            max={3}
            step={0.1}
            onChange={setMuY}
          />
          <SliderControl
            label="σ"
            value={sigma}
            min={0.1}
            max={3}
            step={0.05}
            onChange={setSigma}
          />
          <SliderControl
            label="β"
            value={beta}
            min={0}
            max={2}
            step={0.05}
            onChange={setBeta}
          />
          <SliderControl
            label="prior variance"
            value={priorVar}
            min={0.25}
            max={9}
            step={0.25}
            onChange={setPriorVar}
          />
          <SliderControl
            label="重构对数似然 E_q[ln p(x|z)]"
            value={reconLogLik}
            min={-20}
            max={0}
            step={0.5}
            onChange={setReconLogLik}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={reset}>
            重置为标准 ELBO
          </Button>
          <Button variant="outline" onClick={applyBetaCounterexample}>
            β=0.5 反例
          </Button>
          <Button variant="outline" onClick={applyWidePrior}>
            先验方差改为 4
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricBox label="KL(q||p)" value={kl} />
          <MetricBox label="β · KL" value={betaKl} />
          <MetricBox label="E_q[ln p(x|z)]" value={reconLogLik} />
          <MetricBox label="L_β" value={objective} />
        </div>

        <div className="h-72 relative border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Axes */}
            <line
              x1={5}
              y1={50}
              x2={95}
              y2={50}
              stroke="#d1d5db"
              strokeWidth={0.4}
            />
            <line
              x1={50}
              y1={5}
              x2={50}
              y2={95}
              stroke="#d1d5db"
              strokeWidth={0.4}
            />

            {/* Prior covariance ellipse (2σ) */}
            <ellipse
              cx={50}
              cy={50}
              rx={priorRx}
              ry={priorRx}
              fill="none"
              stroke="#f59e0b"
              strokeWidth={0.6}
              strokeDasharray="2,1"
            />

            {/* Posterior covariance ellipse (2σ) */}
            {(() => {
              const { sx, sy } = toSvg(muX, muY);
              return (
                <ellipse
                  cx={sx}
                  cy={sy}
                  rx={postRx}
                  ry={postRx}
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth={0.6}
                />
              );
            })()}

            {/* Sampled latent points */}
            {points.map((p, i) => {
              const { sx, sy } = toSvg(p[0], p[1]);
              return (
                <circle
                  key={i}
                  cx={sx}
                  cy={sy}
                  r={0.6}
                  fill="#3b82f6"
                  opacity={0.5}
                />
              );
            })}

            {/* Posterior mean marker */}
            {(() => {
              const { sx, sy } = toSvg(muX, muY);
              return <circle cx={sx} cy={sy} r={1.4} fill="#dc2626" />;
            })()}

            <text x={5} y={8} fontSize={3.5} fill="#4b5563">
              蓝点=采样潜在变量，蓝圈=后验 2σ 协方差，橙虚线=先验 2σ 协方差
            </text>
          </svg>
        </div>

        <div className="text-xs text-gray-600">
          样本均值：[{stats.mean.map((v) => v.toFixed(2)).join(', ')}]
          {' · '}
          std_x = {Math.sqrt(Math.max(stats.cov[0]?.[0] ?? 0, 0)).toFixed(2)}
          {' · '}
          std_y = {Math.sqrt(Math.max(stats.cov[1]?.[1] ?? 0, 0)).toFixed(2)}
          {' · '}
          cov_xy = {(stats.cov[0]?.[1] ?? 0).toFixed(2)}
        </div>

        <PredictionGate
          resetKey={beta}
          prediction={betaPred}
          onPredictionChange={setBetaPred}
          submitted={betaSubmitted}
          onSubmit={() => setBetaSubmitted(true)}
          revealed={betaRevealed}
          onReveal={() => setBetaRevealed((r) => !r)}
          canReveal={betaSubmitted}
          question="当 β > 1 时，优化目标是否仍然是标准 ELBO？"
          hint="想一想标准 ELBO 的定义中 β 等于多少。"
          evaluatePrediction={evaluateBetaPrediction}
          revealContent={
            <div className="space-y-3 text-sm text-gray-700">
              <div>
                标准 ELBO 严格对应
                <KaTeX math="\beta=1" className="mx-1" />：
                <KaTeX
                  math="\mathcal L=E_q[\ln p(x|z)]-\mathrm{KL}(q(z|x)\|p(z))"
                  className="mx-1"
                />
                。
              </div>
              <div>
                <span className="font-medium">β &gt; 1：</span>
                目标函数仍为 log p(x) 的下界（因为 KL 被放大），但它不再是“标准 ELBO 目标函数”。
              </div>
              <div>
                <span className="font-medium">0 &lt; β &lt; 1：</span>
                KL 项被低估，可能导致目标超过对数似然，
                <strong>不再保证是下界</strong>
                。
              </div>
              {objectiveExceedsElbo && (
                <div className="text-red-700 bg-red-50 rounded p-2">
                  当前设置下，L_β = {objective.toFixed(3)} 已经大于标准 ELBO ={' '}
                  {standardElbo.toFixed(3)}。若 ELBO 接近真实对数似然，β&lt;1
                  的目标就会超出该下界。
                </div>
              )}
            </div>
          }
        >
          <div className="space-y-2">
            <div className="text-sm text-gray-700 font-medium">请选择你的判断</div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={betaPred === '是' ? 'default' : 'outline'}
                onClick={() => setBetaPred('是')}
                disabled={betaSubmitted}
              >
                是
              </Button>
              <Button
                type="button"
                variant={betaPred === '否' ? 'default' : 'outline'}
                onClick={() => setBetaPred('否')}
                disabled={betaSubmitted}
              >
                否
              </Button>
            </div>
          </div>
        </PredictionGate>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
          <h4 className="font-bold text-amber-900">迁移挑战：先验方差对 KL 的影响</h4>
          <div className="text-sm text-gray-700">
            如果保持 q 不变，把先验方差从 1 改为 4，KL(q||p) 会如何变化？
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={applyWidePrior}>
              设置 prior variance = 4
            </Button>
            <Button
              variant="secondary"
              onClick={() => setTransferRevealed((r) => !r)}
            >
              {transferRevealed ? '收起答案' : '揭晓答案'}
            </Button>
          </div>
          {transferRevealed && (
            <div className="bg-white rounded-lg p-3 text-sm text-gray-700 space-y-2">
              <div>prior variance = 1 时 KL = {klPrior1.toFixed(3)}</div>
              <div>prior variance = 4 时 KL = {klPrior4.toFixed(3)}</div>
              <div>
                变化方向取决于 μ 与 σ 的取值：更宽的先验会减小均值惩罚
                <KaTeX math="\mu^2/\sigma_p^2" className="mx-1" />
                ，但也会让方差比
                <KaTeX math="\sigma^2/\sigma_p^2" className="mx-1" />
                偏离 1，从而增大方差不匹配惩罚。
              </div>
            </div>
          )}
        </div>
      </div>
    </InteractiveDemo>
  );
}

function SliderControl({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700">
        {label}：{Number.isInteger(value) ? value : value.toFixed(2)}
      </label>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={([v]) => onChange(v)}
        className="mt-2"
      />
    </div>
  );
}

function MetricBox({ label, value }: { label: string; value: number }) {
  const display = Number.isFinite(value) ? value.toFixed(3) : '—';
  return (
    <div className="bg-blue-50 rounded-lg p-4 text-center">
      <div className="text-xs text-gray-600">{label}</div>
      <div className="text-lg font-bold text-blue-700">{display}</div>
    </div>
  );
}
