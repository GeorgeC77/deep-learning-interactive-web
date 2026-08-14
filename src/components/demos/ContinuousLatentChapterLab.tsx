import { useCallback, useMemo, useState } from 'react';
import InteractiveDemo from '@/components/InteractiveDemo';
import KaTeX from '@/components/KaTeX';
import PredictionGate, { type Evaluation } from '@/components/PredictionGate';
import { Slider } from '@/components/ui/slider';
import {
  covarianceCorrelation,
  factorAnalysisCovariance,
  pcaVarianceSummary,
  rankGenerativeApproaches,
  scalarGaussianPosterior,
  type GenerativeCriteria,
} from '@/lib/math/continuousLatent';

type LabMode = 'pca' | 'probabilistic' | 'elbo' | 'nonlinear';
const PCA_EIGENVALUES = [5, 2, 0.7, 0.3];

function useGateState() {
  const [prediction, setPrediction] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const changePrediction = useCallback((value: string) => {
    setPrediction(value);
    setSubmitted(false);
    setRevealed(false);
  }, []);
  const submit = useCallback(() => setSubmitted(true), []);
  const toggleReveal = useCallback(() => setRevealed((value) => !value), []);
  return { prediction, submitted, revealed, changePrediction, submit, toggleReveal };
}

function Metric({ label, value, tone = 'blue' }: { label: string; value: string; tone?: 'blue' | 'emerald' | 'amber' | 'violet' }) {
  const styles = {
    blue: 'border-blue-200 bg-blue-50 text-blue-800',
    emerald: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    amber: 'border-amber-200 bg-amber-50 text-amber-800',
    violet: 'border-violet-200 bg-violet-50 text-violet-800',
  };
  return (
    <div className={`rounded-lg border p-3 text-center ${styles[tone]}`}>
      <div className="text-xs opacity-75">{label}</div>
      <div className="mt-1 font-mono text-lg font-bold">{value}</div>
    </div>
  );
}

function PcaVarianceLab() {
  const gate = useGateState();
  const [retained, setRetained] = useState(1);
  const summary = useMemo(() => pcaVarianceSummary(PCA_EIGENVALUES, retained), [retained]);
  const evaluate = useCallback((value: string): Evaluation => ({
    correct: value === 'discarded',
    category: 'PCA 重构',
    feedback: value === 'discarded'
      ? '正交基把总方差分解到各特征方向；无法由保留子空间重构的能量正是被丢弃特征值之和。'
      : '保留特征值之和描述成功保存的方差；重构误差来自子空间之外，因此应看被丢弃特征值之和。',
  }), []);

  return (
    <InteractiveDemo title="PCA 方差账本：保留多少，丢失多少">
      <div className="space-y-5">
        <PredictionGate
          resetKey="chapter13-pca"
          prediction={gate.prediction}
          onPredictionChange={gate.changePrediction}
          submitted={gate.submitted}
          onSubmit={gate.submit}
          revealed={gate.revealed}
          onReveal={gate.toggleReveal}
          canReveal={gate.submitted}
          question="保留最大的前 M 个主成分时，最小平方重构误差由哪部分决定？"
          hint="总方差 = 保留子空间内方差 + 正交补空间方差。"
          options={[
            { value: 'discarded', label: '被丢弃的 D−M 个特征值之和' },
            { value: 'kept', label: '被保留的 M 个特征值之和' },
            { value: 'count', label: '只由 M 的数值决定，与特征值大小无关' },
          ]}
          evaluatePrediction={evaluate}
          revealContent={<p className="text-sm text-gray-700">解锁后改变 M，验证保留方差与重构误差始终加总为固定的总方差。</p>}
        />

        {gate.revealed && (
          <div className="space-y-4" aria-label="PCA 方差实验区">
            <div>
              <div className="mb-2 flex justify-between text-sm font-medium text-gray-700">
                <span>保留主成分数 M</span><span>{retained} / {PCA_EIGENVALUES.length}</span>
              </div>
              <Slider value={[retained]} min={0} max={PCA_EIGENVALUES.length} step={1} onValueChange={([value]) => setRetained(value)} />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {PCA_EIGENVALUES.map((value, index) => (
                <div key={value} className={`rounded-lg border p-3 text-center ${index < retained ? 'border-blue-300 bg-blue-50' : 'border-gray-200 bg-gray-100'}`}>
                  <div className="text-xs text-gray-500">λ{index + 1}</div>
                  <div className="font-mono font-bold">{value.toFixed(1)}</div>
                  <div className="text-xs">{index < retained ? '保留' : '丢弃'}</div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Metric label="总方差" value={summary.total.toFixed(1)} />
              <Metric label="保留方差" value={summary.kept.toFixed(1)} tone="emerald" />
              <Metric label="重构误差" value={summary.discarded.toFixed(1)} tone="amber" />
              <Metric label="保留比例" value={`${(summary.retainedRatio * 100).toFixed(1)}%`} tone="violet" />
            </div>
            <KaTeX display math={String.raw`\sum_{i=1}^{D}\lambda_i=\underbrace{\sum_{i=1}^{M}\lambda_i}_{\text{保留}}+\underbrace{\sum_{i=M+1}^{D}\lambda_i}_{\text{重构误差}}`} />
          </div>
        )}
      </div>
    </InteractiveDemo>
  );
}

function FactorAnalysisLab() {
  const gate = useGateState();
  const [w1, setW1] = useState(1.8);
  const [w2, setW2] = useState(1.2);
  const [psi2, setPsi2] = useState(0.4);
  const covariance = useMemo(() => factorAnalysisCovariance([w1, w2], [0.3, psi2]), [w1, w2, psi2]);
  const correlation = covarianceCorrelation(covariance);
  const evaluate = useCallback((value: string): Evaluation => ({
    correct: value === 'correlation-down',
    category: '因子分析协方差',
    feedback: value === 'correlation-down'
      ? 'Ψ₂只增加 x₂ 的独立噪声方差；共享协方差 w₁w₂ 不变，但标准化后的相关系数绝对值下降。'
      : '独立噪声不会创造新的共享变化。它增加边缘方差、稀释相关性，却不改变由共同因子产生的 w₁w₂。',
  }), []);

  return (
    <InteractiveDemo title="因子分析实验：共享因子与独立噪声">
      <div className="space-y-5">
        <PredictionGate
          resetKey="chapter13-factor-analysis"
          prediction={gate.prediction}
          onPredictionChange={gate.changePrediction}
          submitted={gate.submitted}
          onSubmit={gate.submit}
          revealed={gate.revealed}
          onReveal={gate.toggleReveal}
          canReveal={gate.submitted}
          question="保持载荷 w₁、w₂ 不变，只增大 x₂ 的独立噪声方差 Ψ₂，会发生什么？"
          hint="Cov(x₁,x₂)=w₁w₂；相关系数还要除以两个边缘标准差。"
          options={[
            { value: 'correlation-down', label: 'Cov(x₁,x₂) 不变，但 |Corr(x₁,x₂)| 下降' },
            { value: 'cov-up', label: 'Cov(x₁,x₂) 与相关系数都会同幅增大' },
            { value: 'nothing', label: '边缘方差、协方差和相关系数都不变' },
          ]}
          evaluatePrediction={evaluate}
          revealContent={<p className="text-sm text-gray-700">解锁后分别调整载荷与 Ψ₂，区分“共同变化”与“维度独有噪声”。</p>}
        />

        {gate.revealed && (
          <div className="space-y-5" aria-label="因子分析协方差实验区">
            {[
              { label: `载荷 w₁ = ${w1.toFixed(1)}`, value: w1, set: setW1, min: -2.5, max: 2.5 },
              { label: `载荷 w₂ = ${w2.toFixed(1)}`, value: w2, set: setW2, min: -2.5, max: 2.5 },
              { label: `独立噪声 Ψ₂ = ${psi2.toFixed(1)}`, value: psi2, set: setPsi2, min: 0, max: 4 },
            ].map((control) => (
              <div key={control.label}>
                <label className="mb-1 block text-sm font-medium text-gray-700">{control.label}</label>
                <Slider value={[control.value]} min={control.min} max={control.max} step={0.1} onValueChange={([value]) => control.set(value)} />
              </div>
            ))}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Metric label="Var(x₁)" value={covariance[0][0].toFixed(3)} />
              <Metric label="Var(x₂)" value={covariance[1][1].toFixed(3)} tone="amber" />
              <Metric label="Cov(x₁,x₂)" value={covariance[0][1].toFixed(3)} tone="emerald" />
              <Metric label="Corr(x₁,x₂)" value={correlation.toFixed(3)} tone="violet" />
            </div>
            <KaTeX display math={String.raw`\operatorname{cov}(\mathbf x)=\mathbf W\mathbf W^T+\boldsymbol\Psi=\begin{pmatrix}w_1^2+\psi_1&w_1w_2\\w_1w_2&w_2^2+\psi_2\end{pmatrix}`} />
          </div>
        )}
      </div>
    </InteractiveDemo>
  );
}

function PosteriorShrinkageLab() {
  const gate = useGateState();
  const [loading, setLoading] = useState(2);
  const [noise, setNoise] = useState(0.5);
  const posterior = useMemo(() => scalarGaussianPosterior(loading, noise), [loading, noise]);
  const observedX = 2;
  const posteriorMean = posterior.meanCoefficient * observedX;
  const evaluate = useCallback((value: string): Evaluation => ({
    correct: value === 'shrink',
    category: '连续隐变量后验',
    feedback: value === 'shrink'
      ? '噪声越大，似然精度越低；后验均值更靠近零均值先验，后验方差则向先验方差 1 回升。'
      : '更噪的观测应提供更少信息，而不是让后验更确定。贝叶斯更新会减少观测权重并回到先验。',
  }), []);

  return (
    <InteractiveDemo title="PPCA 后验实验：观测噪声与收缩">
      <div className="space-y-5">
        <PredictionGate
          resetKey="chapter13-ppca-posterior"
          prediction={gate.prediction}
          onPredictionChange={gate.changePrediction}
          submitted={gate.submitted}
          onSubmit={gate.submit}
          revealed={gate.revealed}
          onReveal={gate.toggleReveal}
          canReveal={gate.submitted}
          question="固定载荷 w 和观测 x，增大噪声方差 σ² 后，p(z|x) 会怎样？"
          hint="当观测越来越不可信时，后验应更相信 z~N(0,1) 的先验。"
          options={[
            { value: 'shrink', label: '后验均值向 0 收缩，后验方差增大' },
            { value: 'certain', label: '后验均值远离 0，后验方差减小' },
            { value: 'same', label: '后验完全不受 σ² 影响' },
          ]}
          evaluatePrediction={evaluate}
          revealContent={<p className="text-sm text-gray-700">解锁后把 σ² 从接近 0 调到 4，观察均值系数与后验方差的相反变化。</p>}
        />

        {gate.revealed && (
          <div className="space-y-5" aria-label="PPCA 后验收缩实验区">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">载荷 w = {loading.toFixed(1)}</label>
              <Slider value={[loading]} min={0.2} max={3} step={0.1} onValueChange={([value]) => setLoading(value)} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">噪声方差 σ² = {noise.toFixed(2)}</label>
              <Slider value={[noise]} min={0.05} max={4} step={0.05} onValueChange={([value]) => setNoise(value)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Metric label="均值系数 w/(w²+σ²)" value={posterior.meanCoefficient.toFixed(3)} />
              <Metric label={`E[z|x=${observedX}]`} value={posteriorMean.toFixed(3)} tone="emerald" />
              <Metric label="Var(z|x)" value={posterior.variance.toFixed(3)} tone="violet" />
            </div>
            <KaTeX display math={String.raw`p(z\mid x)=\mathcal N\!\left(z\mid\frac{w}{w^2+\sigma^2}x,\frac{\sigma^2}{w^2+\sigma^2}\right)`} />
          </div>
        )}
      </div>
    </InteractiveDemo>
  );
}

function GenerativeApproachLab() {
  const gate = useGateState();
  const [criteria, setCriteria] = useState<GenerativeCriteria>({ exactLikelihood: true, fastSampling: true, compactLatent: false });
  const ranking = useMemo(() => rankGenerativeApproaches(criteria), [criteria]);
  const evaluate = useCallback((value: string): Evaluation => ({
    correct: value === 'flow',
    category: '四类生成方法',
    feedback: value === 'flow'
      ? 'Flow 的可逆变换同时支持变量替换下的精确似然与一次网络变换采样；结构约束是它为此付出的代价。'
      : 'GAN 没有显式归一化似然，VAE 优化下界，Diffusion 通常需多步采样；只有 Flow 同时满足这两个条件。',
  }), []);

  const toggle = (key: keyof GenerativeCriteria) => setCriteria((current) => ({ ...current, [key]: !current[key] }));
  const likelihoodLabel = { none: '无显式似然', 'lower-bound': 'ELBO 下界', exact: '精确似然', indirect: '间接/变分界' };

  return (
    <InteractiveDemo title="生成方法权衡实验：没有免费的午餐">
      <div className="space-y-5">
        <PredictionGate
          resetKey="chapter13-generative-approaches"
          prediction={gate.prediction}
          onPredictionChange={gate.changePrediction}
          submitted={gate.submitted}
          onSubmit={gate.submit}
          revealed={gate.revealed}
          onReveal={gate.toggleReveal}
          canReveal={gate.submitted}
          question="如果必须同时拥有精确归一化似然和非迭代采样，应优先选择哪类模型？"
          hint="逐一排除：谁没有显式似然，谁只优化下界，谁通常需要多步去噪？"
          options={[
            { value: 'flow', label: 'Normalizing Flow' },
            { value: 'gan', label: 'GAN' },
            { value: 'vae', label: 'VAE' },
            { value: 'diffusion', label: 'Diffusion' },
          ]}
          evaluatePrediction={evaluate}
          revealContent={<p className="text-sm text-gray-700">解锁后改变任务约束，观察推荐排序，并辨认每种方法为获得优势所牺牲的能力。</p>}
        />

        {gate.revealed && (
          <div className="space-y-5" aria-label="四类生成方法权衡实验区">
            <div className="flex flex-wrap gap-2">
              {[
                ['exactLikelihood', '要求精确似然'],
                ['fastSampling', '要求快速采样'],
                ['compactLatent', '要求低维隐空间'],
              ].map(([key, label]) => {
                const active = criteria[key as keyof GenerativeCriteria];
                return (
                  <button key={key} type="button" aria-pressed={active} onClick={() => toggle(key as keyof GenerativeCriteria)} className={`rounded-lg border px-3 py-2 text-sm font-medium ${active ? 'border-indigo-500 bg-indigo-100 text-indigo-800' : 'border-gray-200 bg-white text-gray-600'}`}>
                    {active ? '✓ ' : ''}{label}
                  </button>
                );
              })}
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {ranking.map((approach, index) => (
                <article key={approach.id} className={`rounded-xl border p-4 ${index === 0 ? 'border-emerald-400 bg-emerald-50' : 'border-gray-200 bg-white'}`}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-900">{index + 1}. {approach.name}</h3>
                    <span className="rounded-full bg-white px-2 py-1 text-xs font-bold text-indigo-700">得分 {approach.score}</span>
                  </div>
                  <dl className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <div><dt className="font-semibold">似然</dt><dd>{likelihoodLabel[approach.likelihood]}</dd></div>
                    <div><dt className="font-semibold">采样</dt><dd>{approach.fastSampling ? '非迭代/快速' : '多步/较慢'}</dd></div>
                    <div><dt className="font-semibold">低维隐空间</dt><dd>{approach.compactLatent ? '支持' : '通常不是核心优势'}</dd></div>
                    <div><dt className="font-semibold">训练信号</dt><dd>{approach.trainingSignal}</dd></div>
                  </dl>
                </article>
              ))}
            </div>
            <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
              排序是教学用约束匹配，不代表通用排行榜；模型选择还取决于数据类型、质量、算力和实现成熟度。
            </p>
          </div>
        )}
      </div>
    </InteractiveDemo>
  );
}

export default function ContinuousLatentChapterLab({ mode }: { mode: LabMode }) {
  if (mode === 'pca') return <PcaVarianceLab />;
  if (mode === 'probabilistic') return <FactorAnalysisLab />;
  if (mode === 'elbo') return <PosteriorShrinkageLab />;
  return <GenerativeApproachLab />;
}
