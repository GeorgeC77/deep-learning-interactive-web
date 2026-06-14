import { useState, useMemo, type ReactNode } from 'react';
import { ShieldAlert, TrendingUp, CheckCircle2, RefreshCw } from 'lucide-react';
import KaTeX from '@/components/KaTeX';
import FormulaCard from '@/components/FormulaCard';
import { Slider } from '@/components/ui/slider';

/* -------------------------------------------------------------------------- */
/* 数值工具                                                                   */
/* -------------------------------------------------------------------------- */
function solveLinearSystem(A: number[][], b: number[]): number[] {
  const n = A.length;
  const M = A.map((row, i) => [...row, b[i]]);

  for (let i = 0; i < n; i++) {
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(M[k][i]) > Math.abs(M[maxRow][i])) maxRow = k;
    }
    [M[i], M[maxRow]] = [M[maxRow], M[i]];

    const pivot = M[i][i];
    if (Math.abs(pivot) < 1e-12) continue;

    for (let j = i; j <= n; j++) M[i][j] /= pivot;

    for (let k = 0; k < n; k++) {
      if (k === i) continue;
      const factor = M[k][i];
      for (let j = i; j <= n; j++) M[k][j] -= factor * M[i][j];
    }
  }

  return M.map((row) => row[n]);
}

function matMul(A: number[][], B: number[][]): number[][] {
  return A.map((row) => B[0].map((_, j) => row.reduce((sum, v, k) => sum + v * B[k][j], 0)));
}

function transpose(A: number[][]): number[][] {
  return A[0].map((_, j) => A.map((row) => row[j]));
}

function generateGaussianMatrix(rows: number, cols: number, seed: number): number[][] {
  let s = seed;
  const M: number[][] = [];
  for (let i = 0; i < rows; i++) {
    const row: number[] = [];
    for (let j = 0; j < cols; j++) {
      s = (s * 9301 + 49297) % 233280;
      const u = Math.max(1e-10, s / 233280);
      s = (s * 9301 + 49297) % 233280;
      const v = s / 233280;
      row.push(Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v));
    }
    M.push(row);
  }
  return M;
}

function generateDataLinear(
  n: number,
  d: number,
  noiseStd: number,
  seed: number
): { X: number[][]; y: number[]; betaTrue: number[] } {
  const betaTrue = Array.from({ length: d }, (_, j) => (j < 5 ? 1.0 : 0.0));
  const X = generateGaussianMatrix(n, d, seed);
  let s = seed + 7;
  const y = X.map((row) => {
    const pred = row.reduce((sum, xj, j) => sum + xj * betaTrue[j], 0);
    s = (s * 9301 + 49297) % 233280;
    const u = Math.max(1e-10, s / 233280);
    s = (s * 9301 + 49297) % 233280;
    const v = s / 233280;
    return pred + noiseStd * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  });
  return { X, y, betaTrue };
}

function fitLinearModel(X: number[][], y: number[]): number[] {
  const n = X.length;
  const d = X[0].length;

  if (d <= n) {
    const Xt = transpose(X);
    const XtX = matMul(Xt, X);
    const Xty = Xt.map((row) => row.reduce((sum, v, i) => sum + v * y[i], 0));
    return solveLinearSystem(XtX, Xty);
  } else {
    const Xt = transpose(X);
    const XXt = matMul(X, Xt);
    const alpha = solveLinearSystem(XXt, y);
    return Xt.map((row) => row.reduce((sum, v, i) => sum + v * alpha[i], 0));
  }
}

function mseLinear(X: number[][], beta: number[], y: number[]): number {
  const pred = X.map((row) => row.reduce((sum, xj, j) => sum + xj * beta[j], 0));
  return pred.reduce((sum, p, i) => sum + Math.pow(p - y[i], 2), 0) / pred.length;
}

export default function DoubleDescentPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <section className="text-center py-8 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="text-sm font-medium text-blue-600 mb-2 tracking-wide uppercase">
          第八章 · 泛化
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">双下降现象</h1>
        <p className="text-gray-600 max-w-2xl mx-auto px-4">
          传统观点认为测试误差随模型复杂度先降后升，形成 U 型曲线。
          但在现代高维模型中，当参数数量超过样本数后，测试误差可能再次下降，
          这一现象被称为双下降（Double Descent）。
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
          <TrendingUp className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">经典 U 型曲线之外</h2>
        </div>
        <p className="text-gray-700 mb-4">
          在参数较少的“欠参数化”区域，模型会经历偏差-方差权衡：测试误差随复杂度下降，达到最低点后又开始上升。
          当模型复杂度继续增加到可以插值所有训练样本时（插值区域），某些模型反而表现出测试误差的第二次下降。
        </p>

        <FormulaCard
          title="最小范数插值"
          formula={
            <KaTeX
              math={String.raw`\hat{\beta} = \arg\min_{\beta} \|\beta\|_2 \quad \text{s.t.} \quad X\beta = y`}
              display
            />
          }
          description="当特征维度 d 大于样本数 n 时，训练误差可以为零的解有无穷多个。选择范数最小的解能让模型更稳定，是双下降第二次下降的关键。"
        />
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">交互演示：线性模型的双下降</h2>
        <p className="text-gray-700 mb-4">
          考虑一个高维线性模型：输入特征从高斯分布采样，真实标签由前 5 个特征的线性组合加上噪声生成。
          调整样本数、噪声水平和最大维度，观察测试误差随特征维度变化的曲线。
        </p>
        <DoubleDescentDemo />
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">为什么会出现第二次下降？</h2>
        <div className="space-y-4 text-gray-700">
          <p>
            <strong>1. 插值不再可怕</strong>：在经典统计学习中，完全拟合训练数据通常意味着过拟合。
            但在高维空间中，最小范数插值解往往具有较好的隐式正则化效果。
          </p>
          <p>
            <strong>2. 更多的特征带来更多信息</strong>：即使真实信号只依赖少数几个特征，
            增加额外的随机特征也扩展了模型的表达能力，而最小范数约束让模型倾向于使用与真实信号对齐的方向。
          </p>
          <p>
            <strong>3. 插值阈值附近最危险</strong>：当模型参数数量刚好接近样本数时，
            模型既不稳定又缺乏足够的表达自由度，测试误差达到峰值。
          </p>
        </div>
      </section>

      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
        <h3 className="text-lg font-bold text-blue-800 mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          小结
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">●</span>
            <span>双下降挑战了“模型越复杂越容易过拟合”的简单结论。</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">●</span>
            <span>在插值区域，最小范数解等隐式正则化可以帮助泛化。</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">●</span>
            <span>插值阈值（参数数≈样本数）附近通常是泛化最差的地方。</span>
          </li>
        </ul>
      </section>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 双下降交互演示                                                             */
/* -------------------------------------------------------------------------- */
function DoubleDescentDemo() {
  const [n, setN] = useState(40);
  const [noise, setNoise] = useState(0.3);
  const [maxD, setMaxD] = useState(120);
  const [numTrials, setNumTrials] = useState(20);
  const [seedOffset, setSeedOffset] = useState(0);

  const curveData = useMemo(() => {
    const result: { d: number; train: number; test: number }[] = [];
    for (let d = 1; d <= maxD; d++) {
      let trainSum = 0;
      let testSum = 0;
      let validTrials = 0;
      for (let t = 0; t < numTrials; t++) {
        try {
          const train = generateDataLinear(n, d, noise, seedOffset * 100000 + d * 1000 + t);
          const test = generateDataLinear(200, d, noise, seedOffset * 100000 + d * 1000 + t + 50000);
          const betaHat = fitLinearModel(train.X, train.y);
          const trainErr = mseLinear(train.X, betaHat, train.y);
          const testErr = mseLinear(test.X, betaHat, test.y);
          if (Number.isFinite(trainErr) && Number.isFinite(testErr)) {
            trainSum += trainErr;
            testSum += testErr;
            validTrials++;
          }
        } catch {
          // 数值不稳定时跳过
        }
      }
      if (validTrials > 0) {
        result.push({ d, train: trainSum / validTrials, test: testSum / validTrials });
      }
    }
    return result;
  }, [n, noise, maxD, numTrials, seedOffset]);

  const CW = 720;
  const CH = 360;
  const CP = { top: 25, right: 40, bottom: 50, left: 70 };
  const maxErr = Math.max(...curveData.map((p) => Math.max(p.train, p.test)), 0.01);

  function cx(d: number): number {
    return CP.left + ((d - 1) / (maxD - 1 || 1)) * (CW - CP.left - CP.right);
  }
  function cy(err: number): number {
    const ratio = Math.log10(err + 1e-6) / Math.log10(maxErr + 1e-6);
    return CH - CP.bottom - ratio * (CH - CP.top - CP.bottom);
  }

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-5">
          <ControlRow label={`样本数 n: ${n}`}>
            <Slider value={[n]} min={10} max={100} step={5} onValueChange={(v) => setN(v[0])} />
          </ControlRow>
          <ControlRow label={`噪声标准差: ${noise.toFixed(2)}`}>
            <Slider value={[noise]} min={0} max={0.5} step={0.01} onValueChange={(v) => setNoise(v[0])} />
          </ControlRow>
          <ControlRow label={`最大维度 d: ${maxD}`}>
            <Slider value={[maxD]} min={n + 10} max={300} step={10} onValueChange={(v) => setMaxD(v[0])} />
          </ControlRow>
          <ControlRow label={`重复实验次数: ${numTrials}`}>
            <Slider value={[numTrials]} min={5} max={50} step={5} onValueChange={(v) => setNumTrials(v[0])} />
          </ControlRow>
          <button
            onClick={() => setSeedOffset((s) => s + 1)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            重新采样
          </button>
        </div>

        <div className="overflow-x-auto">
          <svg viewBox={`0 0 ${CW} ${CH}`} className="w-full min-w-[360px]" style={{ maxHeight: 360 }}>
            <rect x={CP.left} y={CP.top} width={CW - CP.left - CP.right} height={CH - CP.top - CP.bottom} fill="#f9fafb" />
            {[1, Math.round(maxD / 4), Math.round(maxD / 2), Math.round((3 * maxD) / 4), maxD].map((d) => (
              <line key={`vx-${d}`} x1={cx(d)} y1={CP.top} x2={cx(d)} y2={CH - CP.bottom} stroke="#e5e7eb" strokeWidth={1} />
            ))}
            {[0.001, 0.01, 0.1, 1.0].map((e) => (
              <line key={`hy-${e}`} x1={CP.left} y1={cy(e)} x2={CW - CP.right} y2={cy(e)} stroke="#e5e7eb" strokeWidth={1} />
            ))}
            <line x1={cx(n)} y1={CP.top} x2={cx(n)} y2={CH - CP.bottom} stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 4" />
            <line x1={CP.left} y1={CH - CP.bottom} x2={CW - CP.right} y2={CH - CP.bottom} stroke="#374151" strokeWidth={2} />
            <line x1={CP.left} y1={CP.top} x2={CP.left} y2={CH - CP.bottom} stroke="#374151" strokeWidth={2} />
            {[1, Math.round(maxD / 4), Math.round(maxD / 2), Math.round((3 * maxD) / 4), maxD].map((d) => (
              <text key={`lx-${d}`} x={cx(d)} y={CH - CP.bottom + 20} textAnchor="middle" fontSize={12} fill="#4b5563">
                {d}
              </text>
            ))}
            {[0.001, 0.01, 0.1, 1.0].map((e) => (
              <text key={`ly-${e}`} x={CP.left - 10} y={cy(e) + 4} textAnchor="end" fontSize={12} fill="#4b5563">
                {e.toFixed(e < 0.1 ? 3 : 1)}
              </text>
            ))}
            <text x={CW / 2} y={CH - 10} textAnchor="middle" fontSize={13} fill="#374151">
              特征维度 d
            </text>
            <text x={20} y={CH / 2} textAnchor="middle" fontSize={13} fill="#374151" transform={`rotate(-90, 20, ${CH / 2})`}>
              误差（对数刻度）
            </text>
            <text x={cx(n) + 5} y={CP.top + 15} fontSize={12} fill="#d97706" fontWeight={600}>
              d = n
            </text>

            <polyline
              points={curveData.map((p) => `${cx(p.d)},${cy(p.train)}`).join(' ')}
              fill="none"
              stroke="#2563eb"
              strokeWidth={2}
            />
            <polyline
              points={curveData.map((p) => `${cx(p.d)},${cy(p.test)}`).join(' ')}
              fill="none"
              stroke="#ef4444"
              strokeWidth={2}
            />
            {curveData.map((p) => (
              <g key={`pt-${p.d}`}>
                <circle cx={cx(p.d)} cy={cy(p.train)} r={2} fill="#2563eb" />
                <circle cx={cx(p.d)} cy={cy(p.test)} r={2} fill="#ef4444" />
              </g>
            ))}
          </svg>
          <div className="flex flex-wrap gap-4 justify-center mt-2 text-xs text-gray-600">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-600" /> 平均训练误差</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500" /> 平均测试误差</span>
            <span className="flex items-center gap-1"><span className="w-6 h-0.5 border-b-2 border-dashed border-amber-500" /> d = n 插值阈值</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ControlRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      {children}
    </div>
  );
}
