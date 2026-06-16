import { useState, useMemo } from 'react';
import { ShieldAlert, Activity, CheckCircle2, RefreshCw, SkipForward , Circle} from 'lucide-react';
import KaTeX from '@/components/KaTeX';
import FormulaCard from '@/components/FormulaCard';

interface Vec2 {
  x: number;
  y: number;
}

type Mat2 = [[number, number], [number, number]];

function generateSources(n: number, seed: number): Vec2[] {
  let s = seed;
  const data: Vec2[] = [];
  for (let i = 0; i < n; i++) {
    s = (s * 9301 + 49297) % 233280;
    const u1 = s / 233280;
    s = (s * 9301 + 49297) % 233280;
    const u2 = s / 233280;
    s = (s * 9301 + 49297) % 233280;
    const u3 = s / 233280;
    s = (s * 9301 + 49297) % 233280;
    const u4 = s / 233280;

    // 源 1：均匀分布
    const s1 = 2 * u1 - 1;
    // 源 2：双峰高斯混合，非高斯
    const z = u2 < 0.5 ? -1.2 : 1.2;
    const r = Math.sqrt(-2 * Math.log(Math.max(1e-10, u3)));
    const noise = r * Math.cos(2 * Math.PI * u4);
    const s2 = z + 0.25 * noise;
    data.push({ x: s1, y: s2 });
  }
  return center(data);
}

function center(data: Vec2[]): Vec2[] {
  const mx = data.reduce((sum, p) => sum + p.x, 0) / data.length;
  const my = data.reduce((sum, p) => sum + p.y, 0) / data.length;
  return data.map((p) => ({ x: p.x - mx, y: p.y - my }));
}

function mix(data: Vec2[], A: Mat2): Vec2[] {
  return data.map((p) => ({
    x: A[0][0] * p.x + A[0][1] * p.y,
    y: A[1][0] * p.x + A[1][1] * p.y,
  }));
}

function matVecMul(m: Mat2, v: Vec2): Vec2 {
  return {
    x: m[0][0] * v.x + m[0][1] * v.y,
    y: m[1][0] * v.x + m[1][1] * v.y,
  };
}

function matInv(m: Mat2): Mat2 {
  const det = m[0][0] * m[1][1] - m[0][1] * m[1][0];
  if (Math.abs(det) < 1e-10) {
    return [
      [1, 0],
      [0, 1],
    ];
  }
  return [
    [m[1][1] / det, -m[0][1] / det],
    [-m[1][0] / det, m[0][0] / det],
  ];
}

function matTranspose(m: Mat2): Mat2 {
  return [
    [m[0][0], m[1][0]],
    [m[0][1], m[1][1]],
  ];
}

function sigmoidVec(v: Vec2): Vec2 {
  return {
    x: 1 / (1 + Math.exp(-v.x)),
    y: 1 / (1 + Math.exp(-v.y)),
  };
}

const mixingA: Mat2 = [
  [1, 0.8],
  [0.5, 1.2],
];

export default function ICAPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <section className="text-center py-8 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="text-sm font-medium text-blue-600 mb-2 tracking-wide uppercase">
          第十三章 · 独立成分分析
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">独立成分分析</h1>
        <p className="text-gray-600 max-w-2xl mx-auto px-4">
          独立成分分析（ICA）与 PCA 一样寻找新的坐标系来表示数据，但目标截然不同：
          ICA 试图把观测到的混合信号分离成统计上相互独立的源信号。
        </p>

        <p className="mt-6 text-sm text-amber-700 flex items-center justify-center gap-2"><ShieldAlert className="w-4 h-4" /> 本内容仅供教学与非商业学习使用，完整授权说明见页脚。</p>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Activity className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">问题动机：鸡尾酒会问题</h2>
        </div>
        <p className="text-gray-700 mb-4">
          想象一个房间里有多个人同时说话，多个麦克风记录下了这些声音的叠加。
          每个麦克风因为位置不同，接收到的各个人声音的权重也不同。
          鸡尾酒会问题就是：能否只从这些混合录音中恢复出每个人的原始声音？
        </p>
        <p className="text-gray-700">
          形式上，假设存在 d 个相互独立的源信号 s，我们观测到的是它们的线性混合：
        </p>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <FormulaCard
          title="观测模型"
          formula={
            <KaTeX
              math={String.raw`x^{(i)} = A s^{(i)}`}
              display
            />
          }
          description="A 称为混合矩阵，未知。我们的目标是找到解混矩阵 W = A^{-1}，使得 s^(i) = W x^(i)。"
        />
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">ICA 的不确定性</h2>
        <p className="text-gray-700 mb-4">
          仅凭观测数据 x，我们无法唯一确定 A 和 s。主要有两类固有的不确定性：
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
          <li><strong>排列不确定性：</strong>我们无法知道恢复出的第 j 个信号对应原来的第几个源，但这在大多数应用中并不重要。</li>
          <li><strong>尺度不确定性：</strong>若 A 的某一列乘以非零常数，对应源除以同一常数，观测 x 不变。对声音而言，这只影响音量或符号。</li>
        </ul>
        <p className="text-gray-700">
          此外，如果源信号是高斯分布，ICA 原则上无法恢复源。因为多元标准正态分布具有旋转对称性，
          任意正交旋转后的混合都会产生同样的观测协方差，无法区分。因此，ICA 要求源信号是非高斯的。
        </p>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">线性变换下的密度</h2>
        <p className="text-gray-700 mb-4">
          若 s 的密度为 p_s，且 x = A s = W^{-1} s，则 x 的密度需要乘以雅可比行列式的绝对值：
        </p>
        <FormulaCard
          title="变换后的密度"
          formula={
            <KaTeX
              math={String.raw`p_x(x) = p_s(W x) \cdot |W|`}
              display
            />
          }
          description="|W| 保证密度在变换后仍然归一化。这个公式是推导 ICA 似然函数的基础。"
        />
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">ICA 算法</h2>
        <p className="text-gray-700 mb-4">
          假设各源独立，联合密度可分解为边缘密度的乘积：
        </p>
        <FormulaCard
          title="源密度假设"
          formula={
            <KaTeX
              math={String.raw`p(s) = \prod_{j=1}^d p_s(s_j)`}
              display
            />
          }
          description="独立性假设体现在乘积形式上。"
        />
        <p className="text-gray-700 mt-4 mb-4">
          代入密度变换公式，并选择 sigmoid 函数作为源的累积分布函数，可得对数似然：
        </p>
        <FormulaCard
          title="对数似然"
          formula={
            <KaTeX
              math={String.raw`\ell(W) = \sum_{i=1}^n \left( \sum_{j=1}^d \log g'(w_j^T x^{(i)}) + \log |W| \right)`}
              display
            />
          }
          description="其中 g(s) = 1 / (1 + e^{-s}) 是 sigmoid，g' 是其导数。"
        />
        <p className="text-gray-700 mt-4 mb-4">
          对 W 求导，得到随机梯度上升更新规则：
        </p>
        <FormulaCard
          title="梯度上升更新"
          formula={
            <KaTeX
              math={String.raw`W := W + \alpha \left( \begin{bmatrix} 1 - 2g(w_1^T x^{(i)}) \\ \vdots \\ 1 - 2g(w_d^T x^{(i)}) \end{bmatrix} (x^{(i)})^T + (W^T)^{-1} \right)`}
              display
            />
          }
          description="对数据不断应用此更新，W 会收敛到一个能把混合信号分离的解混矩阵。"
        />
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">交互演示：二维盲源分离</h2>
        <p className="text-gray-700 mb-4">
          下面的演示生成了两个非高斯独立源（左侧），通过一个未知混合矩阵得到观测数据（中间）。
          点击「迭代」按钮运行 ICA 梯度上升，观察恢复信号（右侧）如何逐渐变得与源信号形状一致。
        </p>
        <ICADemo />
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">应用</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li><strong>盲源分离：</strong>鸡尾酒会问题、脑电图/脑磁图信号分离。</li>
          <li><strong>特征提取：</strong>从图像或语音中提取统计独立的基函数。</li>
          <li><strong>降噪：</strong>把感兴趣的信号与噪声源分离开。</li>
        </ul>
      </section>

      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
        <h3 className="text-lg font-bold text-blue-800 mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          小结
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start gap-2">
            <Circle className="w-2 h-2 fill-current text-blue-500 mt-0.5 mt-1" />
            <span>ICA 的目标是找到统计独立的源信号，而不是方差最大的方向。</span>
          </li>
          <li className="flex items-start gap-2">
            <Circle className="w-2 h-2 fill-current text-blue-500 mt-0.5 mt-1" />
            <span>ICA 存在排列和尺度不确定性；高斯源不可识别。</span>
          </li>
          <li className="flex items-start gap-2">
            <Circle className="w-2 h-2 fill-current text-blue-500 mt-0.5 mt-1" />
            <span>密度变换公式 p_x(x) = p_s(Wx)|W| 导出似然函数。</span>
          </li>
          <li className="flex items-start gap-2">
            <Circle className="w-2 h-2 fill-current text-blue-500 mt-0.5 mt-1" />
            <span>使用 sigmoid 作为源 cdf 可得到简单的梯度上升更新规则。</span>
          </li>
        </ul>
      </section>
    </div>
  );
}

function ICADemo() {
  const [seed, setSeed] = useState(42);
  const [W, setW] = useState<Mat2>([
    [1, 0],
    [0, 1],
  ]);
  const [iterations, setIterations] = useState(0);

  const sources = useMemo(() => generateSources(400, seed), [seed]);
  const observations = useMemo(() => center(mix(sources, mixingA)), [sources]);

  const alpha = 0.02;

  const doIteration = () => {
    setW((currentW) => {
      let grad00 = 0;
      let grad01 = 0;
      let grad10 = 0;
      let grad11 = 0;
      for (const x of observations) {
        const y = matVecMul(currentW, x);
        const g = sigmoidVec(y);
        const phi = { x: 1 - 2 * g.x, y: 1 - 2 * g.y };
        grad00 += phi.x * x.x;
        grad01 += phi.x * x.y;
        grad10 += phi.y * x.x;
        grad11 += phi.y * x.y;
      }
      const n = observations.length;
      const invWt = matInv(matTranspose(currentW));
      const next: Mat2 = [
        [
          currentW[0][0] + alpha * (grad00 / n + invWt[0][0]),
          currentW[0][1] + alpha * (grad01 / n + invWt[0][1]),
        ],
        [
          currentW[1][0] + alpha * (grad10 / n + invWt[1][0]),
          currentW[1][1] + alpha * (grad11 / n + invWt[1][1]),
        ],
      ];
      return next;
    });
    setIterations((it) => it + 1);
  };

  const reset = () => {
    setW([
      [1, 0],
      [0, 1],
    ]);
    setIterations(0);
  };

  const recovered = useMemo(() => observations.map((p) => matVecMul(W, p)), [observations, W]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={doIteration}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm"
        >
          <SkipForward className="w-4 h-4" />
          迭代一次
        </button>
        <button
          onClick={() => {
            for (let i = 0; i < 10; i++) doIteration();
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          迭代 10 次
        </button>
        <button
          onClick={reset}
          className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          重置
        </button>
        <button
          onClick={() => {
            setSeed((s) => s + 1);
            reset();
          }}
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          重新采样
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <ScatterPanel title="源信号 s" data={sources} color="#2563eb" />
        <ScatterPanel title={`观测信号 x （已迭代 ${iterations} 次）`} data={observations} color="#7c3aed" />
        <ScatterPanel title="恢复信号 ŝ = Wx" data={recovered} color="#ef4444" />
      </div>

      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 text-sm space-y-1">
        <div className="flex justify-between">
          <span className="text-gray-600">解混矩阵 W:</span>
        </div>
        <div className="font-mono text-gray-700">
          [{W[0][0].toFixed(6)}, {W[0][1].toFixed(6)}]
        </div>
        <div className="font-mono text-gray-700">
          [{W[1][0].toFixed(6)}, {W[1][1].toFixed(6)}]
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-gray-600">迭代次数:</span>
          <span className="font-mono font-medium text-blue-700">{iterations}</span>
        </div>
      </div>
    </div>
  );
}

function ScatterPanel({ title, data, color }: { title: string; data: Vec2[]; color: string }) {
  const SIZE = 260;
  const CX = SIZE / 2;
  const CY = SIZE / 2;
  const SCALE = 80;

  function toSvg(p: Vec2): { x: number; y: number } {
    return {
      x: CX + p.x * SCALE,
      y: CY - p.y * SCALE,
    };
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-3">
      <h4 className="text-sm font-semibold text-gray-800 mb-2 text-center">{title}</h4>
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full" style={{ maxHeight: 260 }}>
        <rect x={0} y={0} width={SIZE} height={SIZE} fill="#f9fafb" />
        <line x1={10} y1={CY} x2={SIZE - 10} y2={CY} stroke="#d1d5db" strokeWidth={1} />
        <line x1={CX} y1={10} x2={CX} y2={SIZE - 10} stroke="#d1d5db" strokeWidth={1} />
        {data.map((p, idx) => {
          const s = toSvg(p);
          return <circle key={idx} cx={s.x} cy={s.y} r={2.5} fill={color} opacity={0.6} />;
        })}
      </svg>
    </div>
  );
}
