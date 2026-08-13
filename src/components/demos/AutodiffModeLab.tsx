import { useMemo, useState } from 'react';
import InteractiveDemo from '@/components/InteractiveDemo';
import PredictionGate from '@/components/PredictionGate';
import { Slider } from '@/components/ui/slider';
import {
  autodiffPassCounts,
  forwardModeDirectionalDerivative,
  recommendAutodiffMode,
  reverseModeGradient,
} from '@/lib/math/autodiffModes';

const modeLabel = {
  forward: '前向模式',
  reverse: '反向模式',
  either: '两者相当',
};

export default function AutodiffModeLab() {
  const [inputExponent, setInputExponent] = useState(6);
  const [outputExponent, setOutputExponent] = useState(0);
  const [x1, setX1] = useState(0.7);
  const [x2, setX2] = useState(-0.4);
  const [prediction, setPrediction] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const inputDimension = 10 ** inputExponent;
  const outputDimension = 10 ** outputExponent;
  const counts = autodiffPassCounts(inputDimension, outputDimension);
  const recommendation = recommendAutodiffMode(inputDimension, outputDimension);
  const gradient = useMemo(() => reverseModeGradient(x1, x2), [x1, x2]);
  const forwardColumns = useMemo(
    () => [
      forwardModeDirectionalDerivative(x1, x2, [1, 0]),
      forwardModeDirectionalDerivative(x1, x2, [0, 1]),
    ],
    [x1, x2],
  );
  const maxLog = Math.max(Math.log10(counts.forward), Math.log10(counts.reverse), 1);
  const width = (passes: number) => `${Math.max(3, Math.log10(passes + 1) / maxLog * 100)}%`;

  return (
    <InteractiveDemo title="自动微分模式实验：输入、输出维度与计算成本">
      <div className="space-y-6">
        <p className="text-sm leading-relaxed text-gray-700">
          完整 Jacobian 有 K×D 个元素。前向模式一次传播一个输入方向（或一个 JVP），反向模式一次传播一个输出方向（或一个 VJP）。
          先判断标量损失对百万参数求梯度时应选哪种模式，再改变 D、K 验证。
        </p>

        <PredictionGate
          resetKey="chapter05-autodiff-mode"
          prediction={prediction}
          onPredictionChange={setPrediction}
          submitted={submitted}
          onSubmit={() => setSubmitted(true)}
          revealed={revealed}
          onReveal={() => setRevealed((value) => !value)}
          canReveal={submitted}
          question="D=1,000,000 个参数、K=1 个标量损失，求完整梯度通常选哪种模式？"
          hint="完整 Jacobian：前向模式约需 D 次传播，反向模式约需 K 次传播。"
          options={[
            { value: 'reverse', label: '反向模式' },
            { value: 'forward', label: '前向模式' },
            { value: 'same', label: '两者总是完全相同' },
          ]}
          evaluatePrediction={(answer) => ({
            correct: answer === 'reverse',
            category: '模式选择',
            feedback: answer === 'reverse'
              ? '正确。标量输出只需一次反向传播，就能得到对全部输入参数的梯度。'
              : '前向模式每次给出一个输入方向；百万个输入方向会需要约百万次传播。',
          })}
          revealContent={
            <p className="text-sm text-gray-700">
              若输入很少、输出很多，关系会反过来。这里只比较完整 Jacobian 的传播次数；单次传播仍有实际算子成本。
            </p>
          }
        />

        {submitted && (
          <div className="space-y-6" aria-label="自动微分模式实验控制区">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="space-y-2 text-sm font-medium text-gray-700">
                <span>输入维度 D = 10^{inputExponent}</span>
                <Slider value={[inputExponent]} min={0} max={6} step={1} onValueChange={([value]) => setInputExponent(value)} />
                <span className="block font-mono text-xs text-gray-500">D = {inputDimension.toLocaleString()}</span>
              </label>
              <label className="space-y-2 text-sm font-medium text-gray-700">
                <span>输出维度 K = 10^{outputExponent}</span>
                <Slider value={[outputExponent]} min={0} max={6} step={1} onValueChange={([value]) => setOutputExponent(value)} />
                <span className="block font-mono text-xs text-gray-500">K = {outputDimension.toLocaleString()}</span>
              </label>
            </div>

            <div className="rounded-xl border bg-gray-50 p-4 space-y-4">
              <div>
                <div className="flex justify-between text-sm"><span>前向模式完整 Jacobian</span><strong>{counts.forward.toLocaleString()} 次</strong></div>
                <div className="mt-1 h-4 rounded bg-white"><div className="h-full rounded bg-blue-500" style={{ width: width(counts.forward) }} /></div>
              </div>
              <div>
                <div className="flex justify-between text-sm"><span>反向模式完整 Jacobian</span><strong>{counts.reverse.toLocaleString()} 次</strong></div>
                <div className="mt-1 h-4 rounded bg-white"><div className="h-full rounded bg-rose-500" style={{ width: width(counts.reverse) }} /></div>
              </div>
              <p className="rounded-lg bg-emerald-50 p-3 text-sm font-medium text-emerald-900">
                当前建议：{modeLabel[recommendation]}。D&lt;K 时前向模式占优；K&lt;D 时反向模式占优。
              </p>
            </div>

            <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 space-y-4">
              <div>
                <h4 className="font-bold text-indigo-900">同一导数，两种传播方向</h4>
                <p className="mt-1 text-sm text-indigo-900">
                  对教材 §8.2 的 f=x₁x₂+exp(x₁x₂)-sin(x₂)，前向模式分别播种 e₁、e₂，所得两列应与一次反向模式的梯度一致。
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="text-sm text-gray-700">x₁ = {x1.toFixed(2)}<Slider value={[x1]} min={-1} max={1} step={0.05} onValueChange={([value]) => setX1(value)} /></label>
                <label className="text-sm text-gray-700">x₂ = {x2.toFixed(2)}<Slider value={[x2]} min={-1} max={1} step={0.05} onValueChange={([value]) => setX2(value)} /></label>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 text-sm">
                <div className="rounded-lg bg-white p-3">前向两次：[{forwardColumns.map((value) => value.toFixed(4)).join(', ')}]</div>
                <div className="rounded-lg bg-white p-3">反向一次：[{gradient.map((value) => value.toFixed(4)).join(', ')}]</div>
              </div>
            </div>

            <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
              反向模式要保留或重算前向中间值，通常内存更多；前向模式更易流式执行。实际系统还会用向量化种子、混合模式和检查点技术。
            </p>
          </div>
        )}
      </div>
    </InteractiveDemo>
  );
}
