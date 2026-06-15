import { useMemo, useState, type ReactNode } from 'react';
import { ShieldAlert, Activity, CheckCircle2, RefreshCw , Circle} from 'lucide-react';
import KaTeX from '@/components/KaTeX';
import FormulaCard from '@/components/FormulaCard';
import { Slider } from '@/components/ui/slider';

export default function LQRPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <section className="text-center py-8 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="text-sm font-medium text-blue-600 mb-2 tracking-wide uppercase">
          第十六章 · 线性二次调节与最优控制
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">线性二次调节（LQR）</h1>
        <p className="text-gray-600 max-w-2xl mx-auto px-4">
          LQR 是有限时域 MDP 的一个特殊而重要的情形：系统动态是线性的，代价是二次的。
          它的最优策略具有漂亮的闭式解——状态反馈控制律。
        </p>

        <div className="mt-6 inline-flex items-center gap-2 bg-amber-50 border border-amber-300 rounded-lg px-5 py-3 max-w-3xl mx-auto">
          <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <span className="text-sm font-medium text-amber-800">
            © 版权声明：本课程内容仅供个人学习交流使用，采用 CC BY-NC 4.0 许可。未经授权，严禁以任何形式用于商业用途。
          </span>
        </div>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Activity className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">问题设定</h2>
        </div>
        <p className="text-gray-700 mb-4">
          考虑连续状态与连续动作。用状态向量 <em>s</em> 与动作（控制输入）<em>a</em> 描述系统：
        </p>
        <FormulaCard
          title="线性动态"
          formula={
            <KaTeX
              math={String.raw`s_{t+1} = A_t s_t + B_t a_t + w_t, \quad w_t \sim \mathcal{N}(0, \Sigma_t)`}
              display
            />
          }
          description="A_t、B_t 为已知矩阵，w_t 是零均值高斯噪声。"
        />
        <p className="text-gray-700 mt-4 mb-4">
          每一步的代价是状态与控制输入的二次函数：
        </p>
        <FormulaCard
          title="二次代价"
          formula={
            <KaTeX
              math={String.raw`c_t(s_t, a_t) = s_t^\top U_t s_t + a_t^\top W_t a_t`}
              display
            />
          }
          description="U_t、W_t 为正定矩阵；代价希望状态靠近原点、动作尽量平滑。"
        />
        <p className="text-gray-700 mt-4">
          等价于把课程中的负奖励 <KaTeX math={String.raw`R_t = -s^\top U_t s - a^\top W_t a`} /> 改写为最小化总代价。
          当噪声为零均值时，最优控制律与噪声方差无关——这是 LQR 的优美性质之一。
        </p>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">动态规划求解</h2>
        <p className="text-gray-700 mb-4">
          假设 <em>t+1</em> 时刻的最优代价函数是二次型
          <KaTeX math={String.raw`J_{t+1}(s) = s^\top P_{t+1} s + p_{t+1}`} />，
          则 <em>t</em> 时刻的最优动作可通过最小化一个关于 <em>a</em> 的二次函数得到：
        </p>
        <FormulaCard
          title="最优状态反馈增益"
          formula={
            <KaTeX
              math={String.raw`K_t = (W_t + B_t^\top P_{t+1} B_t)^{-1} B_t^\top P_{t+1} A_t, \quad a_t^* = -K_t s_t`}
              display
            />
          }
          description="最优控制是状态的线性函数。"
        />
        <p className="text-gray-700 mt-4 mb-4">
          代回后得到离散时间 Riccati 方程：
        </p>
        <FormulaCard
          title="离散 Riccati 方程"
          formula={
            <KaTeX
              math={String.raw`P_t = U_t + A_t^\top P_{t+1} A_t - A_t^\top P_{t+1} B_t (W_t + B_t^\top P_{t+1} B_t)^{-1} B_t^\top P_{t+1} A_t`}
              display
            />
          }
          description="从终点 P_T = U_T 反向递推，即可得到所有时刻的增益 K_t。"
        />
        <p className="text-gray-700 mt-4">
          标量项 <KaTeX math={String.raw`p_t`} /> 仅受噪声方差影响，不影响控制律。
        </p>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">交互演示：一维小车 LQR</h2>
        <p className="text-gray-700 mb-4">
          考虑一个简单的一维小车模型：状态为 <KaTeX math={String.raw`s = [p, v]^\top`} />（位置、速度），
          控制输入为力 <em>a</em>。调整质量、控制代价权重与初始状态，观察 Riccati 反向递推得到的反馈增益和闭环轨迹。
        </p>
        <LQRDemo />
      </section>

      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
        <h3 className="text-lg font-bold text-blue-800 mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          小结
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start gap-2">
            <Circle className="w-2 h-2 fill-current text-blue-500 mt-0.5 mt-1" />
            <span>LQR 假设线性动态与二次代价，是连续状态控制问题的可解析求解特例。</span>
          </li>
          <li className="flex items-start gap-2">
            <Circle className="w-2 h-2 fill-current text-blue-500 mt-0.5 mt-1" />
            <span>反向递推 Riccati 方程得到状态反馈增益 K_t，最优控制为 a_t = −K_t s_t。</span>
          </li>
          <li className="flex items-start gap-2">
            <Circle className="w-2 h-2 fill-current text-blue-500 mt-0.5 mt-1" />
            <span>只要噪声零均值，最优控制律就不依赖于噪声方差。</span>
          </li>
        </ul>
      </section>
    </div>
  );
}

function LQRDemo() {
  const [horizon, setHorizon] = useState(30);
  const [dt, setDt] = useState(0.2);
  const [mass, setMass] = useState(1.0);
  const [qPos, setQPos] = useState(1.0);
  const [rControl, setRControl] = useState(0.5);
  const [initPos, setInitPos] = useState(5.0);
  const [initVel, setInitVel] = useState(0.0);
  const [processNoise, setProcessNoise] = useState(0.0);
  const [runKey, setRunKey] = useState(0);

  const { K, trajectory, totalCost } = useMemo(() => {
    const A = [
      [1, dt],
      [0, 1],
    ];
    const B = [[0], [dt / mass]];
    const U = [
      [qPos, 0],
      [0, 0],
    ];

    const Klist: number[][] = [];
    let P = U;

    for (let t = horizon - 1; t >= 0; t--) {
      const BtP = matMul(transpose(B), P);
      const M = BtP[0][0] * B[0][0] + BtP[0][1] * B[1][0] + rControl;
      const invM = 1 / M;
      const K = scaleMat(matMul(BtP, A), invM);
      Klist.unshift(K[0]);

      const AtP = matMul(transpose(A), P);
      const AtPA = matMul(AtP, A);
      const AtPB = matMul(AtP, B);
      const update = matMul(AtPB, K);
      P = matAdd(U, matSub(AtPA, update));
    }

    const traj: number[][] = [[initPos, initVel]];
    let s = [initPos, initVel];
    let cost = 0;
    for (let t = 0; t < horizon; t++) {
      const k = Klist[t];
      const a = -(k[0] * s[0] + k[1] * s[1]);
      const As = matVec(A, s);
      const Ba = [B[0][0] * a, B[1][0] * a];
      const noise = processNoise > 0 ? [randn() * processNoise, randn() * processNoise] : [0, 0];
      s = [As[0] + Ba[0] + noise[0], As[1] + Ba[1] + noise[1]];
      traj.push([...s]);
      cost += (qPos * s[0] * s[0] + rControl * a * a) * dt;
    }

    return { K: Klist, trajectory: traj, totalCost: cost };
  }, [horizon, dt, mass, qPos, rControl, initPos, initVel, processNoise, runKey]);

  const posPoints = trajectory.map((s, t) => ({ t, v: s[0] }));
  const velPoints = trajectory.map((s, t) => ({ t, v: s[1] }));
  const controlPoints = trajectory.slice(0, -1).map((s, t) => {
    const k = K[t];
    return { t, v: -(k[0] * s[0] + k[1] * s[1]) };
  });

  return (
    <div className="space-y-5">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Control label={`时间范围 T: ${horizon}`}>
          <Slider value={[horizon]} min={5} max={60} step={1} onValueChange={(v) => setHorizon(v[0])} />
        </Control>
        <Control label={`时间步长 dt: ${dt.toFixed(2)}`}>
          <Slider value={[dt]} min={0.05} max={0.5} step={0.05} onValueChange={(v) => setDt(v[0])} />
        </Control>
        <Control label={`质量 m: ${mass.toFixed(1)}`}>
          <Slider value={[mass]} min={0.5} max={3.0} step={0.1} onValueChange={(v) => setMass(v[0])} />
        </Control>
        <Control label={`位置代价 q: ${qPos.toFixed(1)}`}>
          <Slider value={[qPos]} min={0.1} max={5.0} step={0.1} onValueChange={(v) => setQPos(v[0])} />
        </Control>
        <Control label={`控制代价 r: ${rControl.toFixed(2)}`}>
          <Slider value={[rControl]} min={0.05} max={2.0} step={0.05} onValueChange={(v) => setRControl(v[0])} />
        </Control>
        <Control label={`初始位置: ${initPos.toFixed(1)}`}>
          <Slider value={[initPos]} min={-8} max={8} step={0.5} onValueChange={(v) => setInitPos(v[0])} />
        </Control>
        <Control label={`初始速度: ${initVel.toFixed(1)}`}>
          <Slider value={[initVel]} min={-4} max={4} step={0.5} onValueChange={(v) => setInitVel(v[0])} />
        </Control>
        <Control label={`过程噪声 σ: ${processNoise.toFixed(2)}`}>
          <Slider value={[processNoise]} min={0} max={0.5} step={0.05} onValueChange={(v) => setProcessNoise(v[0])} />
        </Control>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => setRunKey((k) => k + 1)}
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          重新采样噪声
        </button>
        <span className="text-sm text-gray-600">
          估计累计代价：
          <span className="font-mono font-medium text-blue-700">{totalCost.toFixed(3)}</span>
        </span>
        <span className="text-sm text-gray-600">
          t=0 反馈增益 K₀ = [{K[0][0].toFixed(3)}, {K[0][1].toFixed(3)}]
        </span>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <LineChart title="状态轨迹" series={[{ name: '位置 p', color: '#2563eb', data: posPoints }, { name: '速度 v', color: '#ea580c', data: velPoints }]} />
        <LineChart title="控制输入 a_t = −K_t s_t" series={[{ name: '控制力', color: '#16a34a', data: controlPoints }]} />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border rounded-lg">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="px-3 py-2">时刻 t</th>
              <th className="px-3 py-2">K_t[0]（位置增益）</th>
              <th className="px-3 py-2">K_t[1]（速度增益）</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {K.slice(0, 10).map((k, t) => (
              <tr key={t}>
                <td className="px-3 py-2 font-mono">{t}</td>
                <td className="px-3 py-2 font-mono">{k[0].toFixed(4)}</td>
                <td className="px-3 py-2 font-mono">{k[1].toFixed(4)}</td>
              </tr>
            ))}
            {K.length > 10 && (
              <tr>
                <td className="px-3 py-2 text-gray-500" colSpan={3}>… 共 {K.length} 行</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LineChart({ title, series }: { title: string; series: { name: string; color: string; data: { t: number; v: number }[] }[] }) {
  const width = 480;
  const height = 220;
  const pad = { top: 10, right: 10, bottom: 28, left: 44 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;

  const allValues = series.flatMap((s) => s.data.map((d) => d.v));
  const min = Math.min(0, ...allValues);
  const max = Math.max(0, ...allValues);
  const range = Math.max(1e-6, max - min);
  const T = series[0]?.data.length ?? 0;

  const x = (t: number) => pad.left + (t / Math.max(1, T - 1)) * innerW;
  const y = (v: number) => pad.top + innerH - ((v - min) / range) * innerH;

  const zeroY = y(0);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <h4 className="text-sm font-semibold text-gray-800 mb-3">{title}</h4>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ maxHeight: 260 }}>
        <line x1={pad.left} y1={zeroY} x2={width - pad.right} y2={zeroY} stroke="#e5e7eb" strokeWidth={1} />
        <line x1={pad.left} y1={pad.top} x2={pad.left} y2={height - pad.bottom} stroke="#d1d5db" strokeWidth={1} />
        <line x1={width - pad.right} y1={pad.top} x2={width - pad.right} y2={height - pad.bottom} stroke="#e5e7eb" strokeWidth={1} />
        {series.map((s, idx) => {
          const d = s.data
            .map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(p.t)} ${y(p.v)}`)
            .join(' ');
          return (
            <path key={idx} d={d} fill="none" stroke={s.color} strokeWidth={2.5} />
          );
        })}
        <text x={pad.left} y={height - 6} fontSize={10} fill="#6b7280">t=0</text>
        <text x={width - pad.right - 20} y={height - 6} fontSize={10} fill="#6b7280">t=T</text>
        <text x={6} y={pad.top + 8} fontSize={10} fill="#6b7280">{max.toFixed(1)}</text>
        <text x={6} y={height - pad.bottom - 2} fontSize={10} fill="#6b7280">{min.toFixed(1)}</text>
      </svg>
      <div className="flex flex-wrap gap-3 mt-2">
        {series.map((s, idx) => (
          <div key={idx} className="flex items-center gap-1.5 text-xs text-gray-700">
            <span className="w-3 h-0.5 rounded" style={{ backgroundColor: s.color }} />
            {s.name}
          </div>
        ))}
      </div>
    </div>
  );
}

function Control({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      {children}
    </div>
  );
}

function transpose(A: number[][]) {
  return A[0].map((_, j) => A.map((row) => row[j]));
}

function matMul(A: number[][], B: number[][]) {
  const m = A.length;
  const n = B[0].length;
  const p = B.length;
  const C: number[][] = Array.from({ length: m }, () => new Array(n).fill(0));
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      let sum = 0;
      for (let k = 0; k < p; k++) sum += A[i][k] * B[k][j];
      C[i][j] = sum;
    }
  }
  return C;
}

function matVec(A: number[][], x: number[]) {
  return A.map((row) => row.reduce((s, v, i) => s + v * x[i], 0));
}

function matAdd(A: number[][], B: number[][]) {
  return A.map((row, i) => row.map((v, j) => v + B[i][j]));
}

function matSub(A: number[][], B: number[][]) {
  return A.map((row, i) => row.map((v, j) => v - B[i][j]));
}

function scaleMat(A: number[][], c: number) {
  return A.map((row) => row.map((v) => v * c));
}

function randn() {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}
