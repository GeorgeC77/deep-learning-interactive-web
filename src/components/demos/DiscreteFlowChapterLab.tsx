import { useMemo, useState } from 'react';
import InteractiveDemo from '@/components/InteractiveDemo';
import KaTeX from '@/components/KaTeX';
import PredictionGate, { type Evaluation } from '@/components/PredictionGate';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  affineCouplingForward,
  affineCouplingInverse,
  autoregressiveSchedule,
  transformedLogDensity,
  type AutoregressiveDirection,
} from '@/lib/math/normalizingFlow';

type DiscreteFlowMode = 'coupling' | 'autoregressive';

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-blue-100 bg-white p-3 text-center">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="mt-1 font-mono text-lg font-bold text-blue-700">{value}</div>
    </div>
  );
}

function CouplingLab() {
  const [prediction, setPrediction] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [zA, setZA] = useState(1);
  const [zB, setZB] = useState(2);
  const [logScale, setLogScale] = useState(Math.log(2));
  const [shift, setShift] = useState(1);

  const forward = useMemo(
    () => affineCouplingForward([zA], [zB], [logScale], [shift]),
    [zA, zB, logScale, shift],
  );
  const inverse = useMemo(
    () => affineCouplingInverse(forward.first, forward.second, [logScale], [shift]),
    [forward, logScale, shift],
  );
  const dataLogDensity = transformedLogDensity(-1, forward.logAbsDet);

  const evaluate = (value: string): Evaluation => ({
    correct: value === 'recover-two',
    category: '仿射耦合逆映射',
    feedback: value === 'recover-two'
      ? '正确。z_B=exp(−ln2)(5−1)=2，且复制的 x_A=z_A 让 conditioner 参数可以被重新计算。'
      : '先减平移 1，再除以缩放 2；逆映射应恢复 z_B=2。',
  });

  return (
    <InteractiveDemo title="仿射耦合实验：同时检查可逆性与 log-det 符号">
      <div className="space-y-6 text-sm text-gray-700">
        <PredictionGate
          resetKey="coupling-inverse"
          prediction={prediction}
          onPredictionChange={setPrediction}
          submitted={submitted}
          onSubmit={() => setSubmitted(true)}
          revealed={revealed}
          onReveal={() => setRevealed((value) => !value)}
          canReveal={submitted}
          question="设 x_B=exp(s)z_B+b，z_B=2、s=ln 2、b=1，因此 x_B=5。逆映射应恢复什么？"
          hint="使用 z_B=exp(−s)(x_B−b)。"
          evaluatePrediction={evaluate}
          options={[
            { value: 'recover-two', label: '恢复 z_B=2' },
            { value: 'recover-three', label: '恢复 z_B=3' },
            { value: 'recover-eight', label: '恢复 z_B=8' },
          ]}
          revealContent={<p>耦合层的关键是 x_A=z_A 原样复制，因此逆向时无需反演产生 s、b 的神经网络。</p>}
        />

        {revealed && (
          <div aria-label="仿射耦合可逆实验区" className="space-y-5 rounded-xl border border-blue-200 bg-blue-50 p-5">
            <div className="grid gap-5 md:grid-cols-2">
              {[
                { label: '复制分量 z_A', value: zA, set: setZA, min: -3, max: 3, step: 0.1 },
                { label: '变换分量 z_B', value: zB, set: setZB, min: -3, max: 3, step: 0.1 },
                { label: 'log-scale s', value: logScale, set: setLogScale, min: -1, max: 1, step: 0.05 },
                { label: '平移 b', value: shift, set: setShift, min: -2, max: 2, step: 0.1 },
              ].map((control) => (
                <label key={control.label} className="space-y-2">
                  <span className="flex justify-between font-medium text-gray-800">
                    <span>{control.label}</span><span className="font-mono">{control.value.toFixed(2)}</span>
                  </span>
                  <Slider
                    value={[control.value]}
                    min={control.min}
                    max={control.max}
                    step={control.step}
                    onValueChange={([value]) => control.set(value)}
                  />
                </label>
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Metric label="x_A" value={forward.first[0].toFixed(3)} />
              <Metric label="x_B" value={forward.second[0].toFixed(3)} />
              <Metric label="逆向恢复 z_B" value={inverse.second[0].toFixed(3)} />
              <Metric label="log|det K|" value={forward.logAbsDet.toFixed(3)} />
            </div>

            <div className="rounded-lg border border-white bg-white p-4 space-y-2">
              <KaTeX math={String.raw`x_B=e^s z_B+b,\qquad z_B=e^{-s}(x_B-b)`} display />
              <p>
                若基分布 log 密度固定为 −1，则当前数据 log 密度为
                <strong className="ml-1 text-blue-800">−1−log|det K|={dataLogDensity.toFixed(3)}</strong>。
                正向体积放大时，数据密度下降。
              </p>
            </div>
          </div>
        )}
      </div>
    </InteractiveDemo>
  );
}

function AutoregressiveLab() {
  const [prediction, setPrediction] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [direction, setDirection] = useState<AutoregressiveDirection>('maf');
  const [dimension, setDimension] = useState(8);
  const schedule = autoregressiveSchedule(direction, dimension);

  const evaluate = (value: string): Evaluation => ({
    correct: value === 'maf-density',
    category: 'MAF/IAF 方向',
    feedback: value === 'maf-density'
      ? '正确。给定完整 x 后，MAF 的所有逆变换 z_i 可并行计算；从 z 采样 x 时却需要逐维等待。'
      : 'MAF 的快方向是给定 x 的逆变换和密度评估；IAF 才把快方向放在采样。',
  });

  return (
    <InteractiveDemo title="自回归方向实验：MAF 与 IAF 谁在哪一端并行">
      <div className="space-y-6 text-sm text-gray-700">
        <PredictionGate
          resetKey="autoregressive-direction"
          prediction={prediction}
          onPredictionChange={setPrediction}
          submitted={submitted}
          onSubmit={() => setSubmitted(true)}
          revealed={revealed}
          onReveal={() => setRevealed((value) => !value)}
          canReveal={submitted}
          question="给定一批完整数据 x，MAF 的哪个方向能把所有维度并行计算？"
          hint="给定 x 后，式 (18.18) 所需的每个前缀 x₁:ᵢ₋₁ 是否都已经可见？"
          evaluatePrediction={evaluate}
          options={[
            { value: 'maf-density', label: 'MAF：逆变换与密度评估' },
            { value: 'maf-sampling', label: 'MAF：从 z 开始采样 x' },
            { value: 'both', label: 'MAF 的两个方向都完全并行' },
          ]}
          revealContent={<p>反转依赖方向得到 IAF：采样变成一次并行传递，但对任意 x 求逆与密度变成顺序链。</p>}
        />

        {revealed && (
          <div aria-label="MAF 与 IAF 方向实验区" className="space-y-5 rounded-xl border border-blue-200 bg-blue-50 p-5">
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant={direction === 'maf' ? 'default' : 'outline'} onClick={() => setDirection('maf')}>MAF</Button>
              <Button type="button" variant={direction === 'iaf' ? 'default' : 'outline'} onClick={() => setDirection('iaf')}>IAF</Button>
            </div>
            <label className="space-y-2 block">
              <span className="flex justify-between font-medium text-gray-800">
                <span>维度 D</span><span className="font-mono">{dimension}</span>
              </span>
              <Slider value={[dimension]} min={2} max={16} step={1} onValueChange={([value]) => setDimension(value)} />
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <div className={`rounded-lg border p-4 ${schedule.densityParallel ? 'border-emerald-400 bg-emerald-50' : 'border-amber-300 bg-amber-50'}`}>
                <h4 className="font-bold text-gray-900">密度评估</h4>
                <p className="mt-2 text-2xl font-bold">{schedule.densitySequentialSteps} 个依赖阶段</p>
                <p className="mt-1 text-xs">{schedule.densityParallel ? '所有维度可并行' : '必须按维度顺序求逆'}</p>
              </div>
              <div className={`rounded-lg border p-4 ${schedule.samplingParallel ? 'border-emerald-400 bg-emerald-50' : 'border-amber-300 bg-amber-50'}`}>
                <h4 className="font-bold text-gray-900">采样</h4>
                <p className="mt-2 text-2xl font-bold">{schedule.samplingSequentialSteps} 个依赖阶段</p>
                <p className="mt-1 text-xs">{schedule.samplingParallel ? '所有维度可并行' : '必须逐维生成'}</p>
              </div>
            </div>

            <p className="rounded-lg border border-violet-200 bg-violet-50 p-3 text-violet-900">
              迁移挑战：高吞吐密度估计偏向 MAF；高吞吐生成偏向 IAF。二者使用相似的三角 Jacobian，差别来自哪组前缀在计算开始时已经知道。
            </p>
          </div>
        )}
      </div>
    </InteractiveDemo>
  );
}

export default function DiscreteFlowChapterLab({ mode }: { mode: DiscreteFlowMode }) {
  return mode === 'coupling' ? <CouplingLab /> : <AutoregressiveLab />;
}
