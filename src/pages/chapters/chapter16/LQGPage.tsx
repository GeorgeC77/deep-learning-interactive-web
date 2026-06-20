import { useMemo, useState, type ReactNode } from 'react';
import { ShieldAlert, Activity, CheckCircle2, RefreshCw , Circle} from 'lucide-react';
import KaTeX from '@/components/KaTeX';
import FormulaCard from '@/components/FormulaCard';
import { Slider } from '@/components/ui/slider';

export default function LQGPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <section className="text-center py-8 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="text-sm font-medium text-blue-600 mb-2 tracking-wide uppercase">
          第十六章 · 线性二次调节与最优控制
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">线性二次高斯（LQG）</h1>
        <p className="text-gray-600 max-w-2xl mx-auto px-4">
          实际系统中我们常常无法直接观测完整状态。LQG 把 LQR 与卡尔曼滤波结合起来：
          先用观测在线估计状态，再把估计值代入 LQR 控制律——这就是著名的分离原理。
        </p>

        <p className="mt-6 text-sm text-amber-700 flex items-center justify-center gap-2"><ShieldAlert className="w-4 h-4" /> 本内容仅供教学与非商业学习使用，完整授权说明见页脚。</p>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Activity className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">部分可观测设定</h2>
        </div>
        <p className="text-gray-700 mb-4">
          在完全可观测 MDP 中，智能体直接看到状态 <em>s</em>。但在很多场景里只能看到观测 <em>y</em>，
          例如相机图像、传感器读数。部分可观测 MDP（POMDP）在状态之上增加了一层观测分布：
        </p>
        <FormulaCard
          title="观测模型"
          formula={
            <KaTeX
              math={String.raw`y_t \mid s_t \sim O(y \mid s)`}
              display
            />
          }
          description="给定真实状态后，观测按某个条件分布生成。"
        />
        <p className="text-gray-700 mt-2 text-sm">
          {'文本形式：p(y_t | s_t)'}
        </p>
        <p className="text-gray-700 mt-4">
          在 LQG 中，状态转移和观测都是线性的，噪声都是高斯的：
        </p>
        <FormulaCard
          title="LQG 模型"
          formula={
            <KaTeX
              math={String.raw`\begin{aligned} s_{t+1} &= A s_t + B a_t + w_t, \quad w_t \sim \mathcal{N}(0, \Sigma_w) \\ y_t &= C s_t + v_t, \quad v_t \sim \mathcal{N}(0, \Sigma_v) \end{aligned}`}
              display
            />
          }
          description="奖励仍是状态与控制的二次函数。"
        />
        <p className="text-gray-700 mt-2 text-sm">
          {'文本形式：s_{t+1} = A s_t + B a_t + w_t, w_t ~ N(0,Σ_w); y_t = C s_t + v_t, v_t ~ N(0,Σ_v)'}
        </p>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">卡尔曼滤波与分离原理</h2>
        <p className="text-gray-700 mb-4">
          因为所有分布都是高斯，信念状态（对状态的分布估计）也是高斯，例如 {'N(ŝ_{t|t}, Σ_{t|t})'}。
          卡尔曼滤波通过两步递推高效更新信念：
        </p>
        <FormulaCard
          title="预测步"
          formula={
            <KaTeX
              math={String.raw`\hat{s}_{t+1\mid t} = A \hat{s}_{t\mid t} + B a_t, \quad \Sigma_{t+1\mid t} = A \Sigma_{t\mid t} A^\top + \Sigma_w`}
              display
            />
          }
          description="根据模型预测下一时刻的状态分布。"
        />
        <p className="text-gray-700 mt-2 text-sm">
          {'文本形式：ŝ_{t+1|t} = A ŝ_{t|t} + B a_t, Σ_{t+1|t} = A Σ_{t|t} A^T + Σ_w'}
        </p>
        <FormulaCard
          title="更新步"
          formula={
            <KaTeX
              math={String.raw`\begin{aligned} K_t &= \Sigma_{t+1\mid t} C^\top (C \Sigma_{t+1\mid t} C^\top + \Sigma_v)^{-1} \\ \hat{s}_{t+1\mid t+1} &= \hat{s}_{t+1\mid t} + K_t (y_{t+1} - C \hat{s}_{t+1\mid t}) \\ \Sigma_{t+1\mid t+1} &= (I - K_t C) \Sigma_{t+1\mid t} \end{aligned}`}
              display
            />
          }
          description="K_t 称为卡尔曼增益，用来根据新观测修正预测。"
        />
        <p className="text-gray-700 mt-2 text-sm">
          {`文本形式：K_t = Σ_{t+1|t} C^T (C Σ_{t+1|t} C^T + Σ_v)^{-1}; ŝ_{t+1|t+1} = ŝ_{t+1|t} + K_t (y_{t+1} − C ŝ_{t+1|t}); Σ_{t+1|t+1} = (I − K_t C) Σ_{t+1|t}`}
        </p>
        <p className="text-gray-700 mt-4">
          分离原理告诉我们：对 LQG 问题，可以先独立设计卡尔曼滤波器进行状态估计，
          再独立用 LQR 计算反馈增益，最后把控制律中的真实状态替换为估计均值：
        </p>
        <FormulaCard
          title="LQG 控制律"
          formula={
            <KaTeX
              math={String.raw`a_t = -K_{\text{LQR}} \, \hat{s}_{t\mid t}`}
              display
            />
          }
          description="K_LQR 来自 LQR，卡尔曼估计 ŝ_{t|t} 来自滤波器。"
        />
        <p className="text-gray-700 mt-2 text-sm">
          {'文本形式：a_t = -K_LQR ŝ_{t|t}'}
        </p>
        <p className="text-gray-700 mt-4 text-sm">
          注意：这里的 K_t 是卡尔曼增益（用于观测更新），K_LQR 是 LQR 反馈增益（用于计算控制律），二者含义不同。
        </p>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">交互演示：一维随机游走的卡尔曼滤波</h2>
        <p className="text-gray-700 mb-4">
          下面是一个简单的一维系统：真实状态按随机游走演化，我们只能看到带噪声的观测。
          调整过程噪声与观测噪声，观察卡尔曼滤波如何平衡“相信模型预测”和“相信观测”。
        </p>
        <KalmanDemo />
      </section>

      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
        <h3 className="text-lg font-bold text-blue-800 mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          小结
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start gap-2">
            <Circle className="w-2 h-2 fill-current text-blue-500 mt-0.5 mt-1" />
            <span>LQG 处理状态不完全可观测的线性二次控制问题。</span>
          </li>
          <li className="flex items-start gap-2">
            <Circle className="w-2 h-2 fill-current text-blue-500 mt-0.5 mt-1" />
            <span>卡尔曼滤波用预测-更新两步递推维护高斯信念状态。</span>
          </li>
          <li className="flex items-start gap-2">
            <Circle className="w-2 h-2 fill-current text-blue-500 mt-0.5 mt-1" />
            <span>分离原理允许我们独立设计估计器与控制器，再把估计均值反馈给 LQR。</span>
          </li>
        </ul>
      </section>
    </div>
  );
}

function KalmanDemo() {
  const [T, setT] = useState(40);
  const [q, setQ] = useState(0.5);
  const [r, setR] = useState(2.0);
  const [initVar, setInitVar] = useState(1.0);
  const [seed, setSeed] = useState(0);

  const { trueStates, observations, estimates, variances } = useMemo(() => {
    const rng = seededRandom(seed);
    const trueStates: number[] = [0];
    const observations: number[] = [trueStates[0] + Math.sqrt(r) * randn(rng)];
    const estimates: number[] = [0];
    const variances: number[] = [initVar];

    for (let t = 0; t < T; t++) {
      const trueNext = trueStates[t] + Math.sqrt(q) * randn(rng);
      trueStates.push(trueNext);
      observations.push(trueNext + Math.sqrt(r) * randn(rng));

      const predS = estimates[t];
      const predVar = variances[t] + q;
      const kalmanGain = predVar / (predVar + r);
      estimates.push(predS + kalmanGain * (observations[t + 1] - predS));
      variances.push((1 - kalmanGain) * predVar);
    }
    return { trueStates, observations, estimates, variances };
  }, [T, q, r, initVar, seed]);

  const width = 560;
  const height = 280;
  const pad = { top: 16, right: 20, bottom: 28, left: 44 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const values = [...trueStates, ...observations, ...estimates];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(1e-6, max - min);

  const x = (t: number) => pad.left + (t / Math.max(1, T)) * innerW;
  const y = (v: number) => pad.top + innerH - ((v - min) / range) * innerH;

  return (
    <div className="space-y-5">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Control label={`步数 T: ${T}`}>
          <Slider value={[T]} min={10} max={80} step={1} onValueChange={(v) => setT(v[0])} />
        </Control>
        <Control label={`过程噪声 q: ${q.toFixed(2)}`}>
          <Slider value={[q]} min={0.05} max={3.0} step={0.05} onValueChange={(v) => setQ(v[0])} />
        </Control>
        <Control label={`观测噪声 r: ${r.toFixed(2)}`}>
          <Slider value={[r]} min={0.1} max={5.0} step={0.1} onValueChange={(v) => setR(v[0])} />
        </Control>
        <Control label={`初始方差: ${initVar.toFixed(2)}`}>
          <Slider value={[initVar]} min={0.1} max={5.0} step={0.1} onValueChange={(v) => setInitVar(v[0])} />
        </Control>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => setSeed((s) => s + 1)}
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          重新生成噪声
        </button>
        <span className="text-sm text-gray-600">
          终点估计误差：
          <span className="font-mono font-medium text-blue-700">{(estimates[T] - trueStates[T]).toFixed(3)}</span>
        </span>
        <span className="text-sm text-gray-600">
          终点标准差：
          <span className="font-mono font-medium text-blue-700">{Math.sqrt(variances[T]).toFixed(3)}</span>
        </span>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ maxHeight: 320 }}>
          <line x1={pad.left} y1={pad.top} x2={pad.left} y2={height - pad.bottom} stroke="#d1d5db" strokeWidth={1} />
          <line x1={pad.left} y1={y(0)} x2={width - pad.right} y2={y(0)} stroke="#e5e7eb" strokeWidth={1} />

          {estimates.map((v, t) => {
            const cx = x(t);
            const sigma = Math.sqrt(variances[t]);
            const top = y(v + 2 * sigma);
            const bottom = y(v - 2 * sigma);
            return (
              <g key={t}>
                <line x1={cx} y1={top} x2={cx} y2={bottom} stroke="#bfdbfe" strokeWidth={2} opacity={0.7} />
              </g>
            );
          })}

          <path d={path(trueStates, x, y)} fill="none" stroke="#16a34a" strokeWidth={2.5} />
          <path d={path(observations, x, y)} fill="none" stroke="#9ca3af" strokeWidth={1.5} strokeDasharray="4 3" />
          <path d={path(estimates, x, y)} fill="none" stroke="#2563eb" strokeWidth={2.5} />

          {observations.map((v, t) => (
            <circle key={`obs-${t}`} cx={x(t)} cy={y(v)} r={2.5} fill="#6b7280" opacity={0.6} />
          ))}

          <text x={pad.left} y={height - 6} fontSize={10} fill="#6b7280">t=0</text>
          <text x={width - pad.right - 20} y={height - 6} fontSize={10} fill="#6b7280">t=T</text>
          <text x={6} y={pad.top + 8} fontSize={10} fill="#6b7280">{max.toFixed(1)}</text>
          <text x={6} y={height - pad.bottom - 2} fontSize={10} fill="#6b7280">{min.toFixed(1)}</text>
        </svg>
        <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-700">
          <span className="flex items-center gap-2"><span className="w-4 h-0.5 bg-green-600" />真实状态</span>
          <span className="flex items-center gap-2"><span className="w-4 h-0.5 bg-blue-600" />卡尔曼估计</span>
          <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-gray-500" />观测</span>
          <span className="flex items-center gap-2"><span className="w-4 h-2 bg-blue-200" />估计 ±2σ 不确定性带</span>
        </div>
      </div>
    </div>
  );
}

function path(data: number[], x: (t: number) => number, y: (v: number) => number) {
  return data.map((v, t) => `${t === 0 ? 'M' : 'L'} ${x(t)} ${y(v)}`).join(' ');
}

function Control({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      {children}
    </div>
  );
}

function seededRandom(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function randn(rng: () => number) {
  let u = 0;
  let v = 0;
  while (u === 0) u = rng();
  while (v === 0) v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}
