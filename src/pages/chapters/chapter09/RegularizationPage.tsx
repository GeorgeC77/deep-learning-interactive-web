import SectionMetadata from '@/components/SectionMetadata';
import { useState, useMemo, type ReactNode } from 'react';
import { ShieldAlert, SlidersHorizontal, CheckCircle2 , Circle} from 'lucide-react';
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

function designMatrix(xs: number[], degree: number): number[][] {
  return xs.map((x) => Array.from({ length: degree + 1 }, (_, j) => Math.pow(x, j)));
}

function fitPolyRidge(xs: number[], ys: number[], degree: number, lambda: number): number[] {
  const effectiveDegree = Math.max(0, Math.min(degree, xs.length - 1));
  const X = designMatrix(xs, effectiveDegree);
  const Xt = X[0].map((_, col) => X.map((row) => row[col]));
  const XtX = Xt.map((row) => XtXRow(row, X));
  const Xty = Xt.map((row) => row.reduce((sum, v, i) => sum + v * ys[i], 0));

  // 不惩罚偏置项（j=0）
  for (let i = 0; i < XtX.length; i++) {
    if (i > 0) XtX[i][i] += lambda;
  }
  return solveLinearSystem(XtX, Xty);
}

function fitPolyLasso(xs: number[], ys: number[], degree: number, lambda: number, steps = 2000): number[] {
  const effectiveDegree = Math.max(0, Math.min(degree, xs.length - 1));
  const X = designMatrix(xs, effectiveDegree);
  const n = X.length;
  const d = X[0].length;

  // 计算步长：1 / (最大特征值近似)
  let maxEigen = 0;
  for (let j = 0; j < d; j++) {
    let sum = 0;
    for (let i = 0; i < n; i++) sum += X[i][j] * X[i][j];
    if (sum > maxEigen) maxEigen = sum;
  }
  const eta = maxEigen > 0 ? 1 / maxEigen : 0.01;

  const w = new Array(d).fill(0);
  for (let step = 0; step < steps; step++) {
    const grad = new Array(d).fill(0);
    for (let i = 0; i < n; i++) {
      const pred = X[i].reduce((sum, xij, j) => sum + xij * w[j], 0);
      const residual = pred - ys[i];
      for (let j = 0; j < d; j++) {
        grad[j] += residual * X[i][j] / n;
      }
    }
    // 软阈值：不惩罚偏置项
    for (let j = 0; j < d; j++) {
      const v = w[j] - eta * grad[j];
      if (j === 0) {
        w[j] = v;
      } else {
        w[j] = v > lambda * eta ? v - lambda * eta : v < -lambda * eta ? v + lambda * eta : 0;
      }
    }
  }
  return w;
}

function XtXRow(row: number[], X: number[][]): number[] {
  return X[0].map((_, j) => row.reduce((sum, v, i) => sum + v * X[i][j], 0));
}

function predict(xs: number[], weights: number[]): number[] {
  return xs.map((x) => weights.reduce((sum, w, j) => sum + w * Math.pow(x, j), 0));
}

function mse(pred: number[], actual: number[]): number {
  return pred.reduce((sum, p, i) => sum + Math.pow(p - actual[i], 2), 0) / pred.length;
}

function trueFunction(x: number): number {
  return 4 * Math.pow(x - 0.5, 2);
}

function generateUniform(n: number, seed: number): number[] {
  let s = seed;
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    s = (s * 9301 + 49297) % 233280;
    out.push(s / 233280);
  }
  return out;
}

function generateGaussian(n: number, seed: number): number[] {
  let s = seed;
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    s = (s * 9301 + 49297) % 233280;
    const u = Math.max(1e-10, s / 233280);
    s = (s * 9301 + 49297) % 233280;
    const v = s / 233280;
    out.push(Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v));
  }
  return out;
}

function generateData(n: number, noise: number, seed: number): { x: number[]; y: number[] } {
  const x = generateUniform(n, seed);
  const noiseValues = generateGaussian(n, seed + 1000000);
  const y = x.map((xi, i) => trueFunction(xi) + noise * noiseValues[i]);
  return { x, y };
}

/* -------------------------------------------------------------------------- */
/* SVG 参数                                                                   */
/* -------------------------------------------------------------------------- */
const WIDTH = 720;
const HEIGHT = 360;
const PADDING = { top: 20, right: 30, bottom: 50, left: 60 };
const X_MIN = 0;
const X_MAX = 1;
const Y_MIN = -0.8;
const Y_MAX = 1.6;

function scaleX(x: number): number {
  return PADDING.left + ((x - X_MIN) / (X_MAX - X_MIN)) * (WIDTH - PADDING.left - PADDING.right);
}

function scaleY(y: number): number {
  return HEIGHT - PADDING.bottom - ((y - Y_MIN) / (Y_MAX - Y_MIN)) * (HEIGHT - PADDING.top - PADDING.bottom);
}

function pathFromPoints(points: { x: number; y: number }[]): string {
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(p.x)} ${scaleY(p.y)}`).join(' ');
}

function ChartFrame() {
  const gridX = [0, 0.2, 0.4, 0.6, 0.8, 1.0];
  const gridY = [-0.5, 0, 0.5, 1.0, 1.5];
  return (
    <>
      <rect x={PADDING.left} y={PADDING.top} width={WIDTH - PADDING.left - PADDING.right} height={HEIGHT - PADDING.top - PADDING.bottom} fill="#f9fafb" />
      {gridX.map((x) => (
        <line key={`vx-${x}`} x1={scaleX(x)} y1={PADDING.top} x2={scaleX(x)} y2={HEIGHT - PADDING.bottom} stroke="#e5e7eb" strokeWidth={1} />
      ))}
      {gridY.map((y) => (
        <line key={`hy-${y}`} x1={PADDING.left} y1={scaleY(y)} x2={WIDTH - PADDING.right} y2={scaleY(y)} stroke="#e5e7eb" strokeWidth={1} />
      ))}
      <line x1={PADDING.left} y1={HEIGHT - PADDING.bottom} x2={WIDTH - PADDING.right} y2={HEIGHT - PADDING.bottom} stroke="#374151" strokeWidth={2} />
      <line x1={PADDING.left} y1={PADDING.top} x2={PADDING.left} y2={HEIGHT - PADDING.bottom} stroke="#374151" strokeWidth={2} />
      {gridX.map((x) => (
        <text key={`lx-${x}`} x={scaleX(x)} y={HEIGHT - PADDING.bottom + 20} textAnchor="middle" fontSize={12} fill="#4b5563">
          {x.toFixed(1)}
        </text>
      ))}
      {gridY.map((y) => (
        <text key={`ly-${y}`} x={PADDING.left - 10} y={scaleY(y) + 4} textAnchor="end" fontSize={12} fill="#4b5563">
          {y.toFixed(1)}
        </text>
      ))}
      <text x={WIDTH / 2} y={HEIGHT - 10} textAnchor="middle" fontSize={13} fill="#374151">x</text>
      <text x={20} y={HEIGHT / 2} textAnchor="middle" fontSize={13} fill="#374151" transform={`rotate(-90, 20, ${HEIGHT / 2})`}>y</text>
    </>
  );
}

export default function RegularizationPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <section className="text-center py-8 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="text-sm font-medium text-blue-600 mb-2 tracking-wide uppercase">
          第九章 · 正则化与模型选择
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">正则化</h1>
        <p className="text-gray-600 max-w-2xl mx-auto px-4">
          正则化通过在损失函数中加入惩罚项来控制模型复杂度。L2 正则化（权重衰减）倾向于让参数变小，
          L1 正则化（LASSO）则倾向于产生稀疏解。
        </p>

        <p className="mt-6 text-sm text-amber-700 flex items-center justify-center gap-2"><ShieldAlert className="w-4 h-4" /> 本内容仅供教学与非商业学习使用，完整授权说明见页脚。</p>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <SlidersHorizontal className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">正则化损失函数</h2>
        </div>
        <p className="text-gray-700 mb-4">
          当模型过于复杂时，它可能会记住训练数据中的噪声而不是学习潜在规律。正则化在优化目标中加入一个惩罚项，
          使得模型在拟合数据的同时保持较小的复杂度。
        </p>

        <FormulaCard
          title="正则化目标"
          formula={
            <KaTeX
              math={String.raw`J_{\text{reg}}(\theta) = J(\theta) + \lambda R(\theta)`}
              display
            />
          }
          description="λ 是正则化强度：λ=0 时退化为原始损失；λ 越大，对模型复杂度的惩罚越强。"
        />

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">L2 正则化 / 权重衰减</h3>
            <KaTeX math={String.raw`R(\theta) = \frac{1}{2}\|\theta\|_2^2`} />
            <p className="text-sm text-gray-700 mt-2">
              倾向于让所有参数均匀变小。在普通 SGD 下，L2 正则化与 weight decay 形式等价；在 AdamW 等优化器中，weight decay 通常采用解耦实现，与直接加入 L2 penalty 不完全相同。
            </p>
          </div>
          <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
            <h3 className="font-semibold text-emerald-800 mb-2">L1 正则化 / LASSO</h3>
            <KaTeX math={String.raw`R(\theta) = \|\theta\|_1`} />
            <p className="text-sm text-gray-700 mt-2">
              倾向于让部分参数精确为零，从而产生稀疏模型。
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">交互演示：不同正则化对比</h2>
        <p className="text-gray-700 mb-4">
          真实函数是二次曲线。我们用一个较高次的多项式拟合，比较无正则化、L2 和 L1 正则化的效果。
        </p>

        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
          这里的 L1/L2 拟合是教学用的简化数值实现，用于展示正则化趋势；实际应用中通常使用更稳定的优化器或机器学习库。
        </div>

        <RegularizationDemo />
      </section>

      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
        <h3 className="text-lg font-bold text-blue-800 mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          小结
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start gap-2">
            <Circle className="w-2 h-2 fill-current text-blue-500 mt-0.5 mt-1" />
            <span>正则化通过惩罚模型复杂度来防止过拟合。</span>
          </li>
          <li className="flex items-start gap-2">
            <Circle className="w-2 h-2 fill-current text-blue-500 mt-0.5 mt-1" />
            <span>L2 正则化让参数变小但通常不为零；在普通 SGD 下它与权重衰减形式等价。</span>
          </li>
          <li className="flex items-start gap-2">
            <Circle className="w-2 h-2 fill-current text-blue-500 mt-0.5 mt-1" />
            <span>L1 正则化可以产生精确为零的参数，实现特征选择。</span>
          </li>
        </ul>
      </section>
    
      <SectionMetadata
        bishopChapter={"Ch 9"}
        bishopSection={"0.01"}
        learningObjectives={["理解 Weight Decay 的核心概念与直观含义。", "掌握与本小节相关的关键公式与算法流程。", "能够在简单示例中应用所学方法并识别常见误区。"]}
        commonMistakes={["只记忆公式而忽略其背后的概率或优化假设。", "混淆相近概念的定义与适用场景。", "在应用时忽视数据分布与模型假设的匹配。"]}
              />
</div>
  );
}

/* -------------------------------------------------------------------------- */
/* 交互演示                                                                   */
/* -------------------------------------------------------------------------- */
function RegularizationDemo() {
  const [degree, setDegree] = useState(12);
  const [nTrain, setNTrain] = useState(20);
  const [noise, setNoise] = useState(0.2);
  const [lambda, setLambda] = useState(0.05);
  const [regType, setRegType] = useState<'none' | 'l2' | 'l1'>('l2');
  const [seed, setSeed] = useState(42);

  const { train, weights, trainError, testError, predPoints, truePoints } = useMemo(() => {
    const tr = generateData(nTrain, noise, seed);
    const te = generateData(200, noise, seed + 1000);
    let w: number[];
    if (regType === 'none') {
      w = fitPolyRidge(tr.x, tr.y, degree, 0);
    } else if (regType === 'l2') {
      w = fitPolyRidge(tr.x, tr.y, degree, lambda);
    } else {
      w = fitPolyLasso(tr.x, tr.y, degree, lambda);
    }
    const predTrain = predict(tr.x, w);
    const predTest = predict(te.x, w);
    const curvePoints = Array.from({ length: 200 }, (_, i) => (i / 199) * (X_MAX - X_MIN) + X_MIN);
    return {
      train: tr,
      weights: w,
      trainError: mse(predTrain, tr.y),
      testError: mse(predTest, te.y),
      predPoints: curvePoints.map((x) => ({ x, y: predict([x], w)[0] })),
      truePoints: curvePoints.map((x) => ({ x, y: trueFunction(x) })),
    };
  }, [degree, nTrain, noise, lambda, regType, seed]);

  const effectiveDegree = Math.min(degree, nTrain - 1);
  const maxAbsWeight = Math.max(...weights.map(Math.abs), 1e-6);

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-5">
          <ControlRow label={`多项式次数: ${degree}${degree !== effectiveDegree ? ` (实际拟合: ${effectiveDegree})` : ''}`}>
            <Slider value={[degree]} min={1} max={15} step={1} onValueChange={(v) => setDegree(v[0])} />
          </ControlRow>
          <ControlRow label={`训练样本数: ${nTrain}`}>
            <Slider value={[nTrain]} min={10} max={100} step={5} onValueChange={(v) => setNTrain(v[0])} />
          </ControlRow>
          <ControlRow label={`噪声标准差: ${noise.toFixed(2)}`}>
            <Slider value={[noise]} min={0} max={0.5} step={0.01} onValueChange={(v) => setNoise(v[0])} />
          </ControlRow>
          <ControlRow label={`正则化强度 λ: ${lambda.toFixed(3)}`}>
            <Slider value={[lambda]} min={0} max={0.5} step={0.001} onValueChange={(v) => setLambda(v[0])} />
          </ControlRow>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">正则化类型</label>
            <div className="flex gap-2">
              {(['none', 'l2', 'l1'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setRegType(t)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    regType === t
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {t === 'none' ? '无' : t === 'l2' ? 'L2' : 'L1'}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setSeed((s) => s + 1)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            重新采样
          </button>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-600">训练误差:</span>
              <span className="font-mono font-medium text-blue-700">{trainError.toFixed(6)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">测试误差:</span>
              <span className="font-mono font-medium text-emerald-700">{testError.toFixed(6)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">非零参数:</span>
              <span className="font-mono font-medium text-gray-700">{weights.filter((w) => Math.abs(w) > 1e-6).length}/{weights.length}</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full min-w-[360px]" style={{ maxHeight: 360 }}>
            <ChartFrame />
            <path d={pathFromPoints(truePoints)} fill="none" stroke="#374151" strokeWidth={2} strokeDasharray="6 4" />
            <path d={pathFromPoints(predPoints)} fill="none" stroke="#2563eb" strokeWidth={3} />
            {train.x.map((x, i) => (
              <circle key={`tr-${i}`} cx={scaleX(x)} cy={scaleY(train.y[i])} r={4} fill="#f97316" opacity={0.7} />
            ))}
          </svg>
          <div className="flex flex-wrap gap-4 justify-center mt-2 text-xs text-gray-600">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-orange-500" /> 训练点</span>
            <span className="flex items-center gap-1"><span className="w-6 h-0.5 bg-blue-600" /> 拟合曲线</span>
            <span className="flex items-center gap-1"><span className="w-6 h-0.5 border-b-2 border-dashed border-gray-700" /> 真实函数</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">多项式系数大小</h3>
        <div className="space-y-2">
          {weights.map((w, j) => (
            <div key={j} className="flex items-center gap-3">
              <span className="w-16 text-xs text-gray-500 font-mono">x^{j}</span>
              <div className="flex-grow h-6 bg-gray-100 rounded overflow-hidden relative">
                <div
                  className="absolute top-0 bottom-0 bg-blue-500 transition-all"
                  style={{
                    left: w >= 0 ? '50%' : `${50 + (w / maxAbsWeight) * 50}%`,
                    width: `${Math.abs(w) / maxAbsWeight * 50}%`,
                  }}
                />
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-400" />
              </div>
              <span className="w-24 text-xs font-mono text-right">{w.toFixed(6)}</span>
            </div>
          ))}
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
