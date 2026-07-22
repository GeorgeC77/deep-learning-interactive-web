import SectionMetadata from '@/components/SectionMetadata';
import { useState, useMemo, type ReactNode } from 'react';
import { ShieldAlert, Scale, CheckCircle2, RefreshCw , Circle} from 'lucide-react';
import KaTeX from '@/components/KaTeX';
import FormulaCard from '@/components/FormulaCard';
import { Slider } from '@/components/ui/slider';

/* -------------------------------------------------------------------------- */
/* 数值工具：多项式最小二乘拟合                                               */
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

function polyFit(xs: number[], ys: number[], degree: number): number[] {
  const effectiveDegree = Math.max(0, Math.min(degree, xs.length - 1));
  if (xs.length < effectiveDegree + 1) return new Array(effectiveDegree + 1).fill(0);
  const X = designMatrix(xs, effectiveDegree);
  const Xt = X[0].map((_, col) => X.map((row) => row[col]));
  const XtX = Xt.map((row) => XtXRow(row, X));
  const Xty = Xt.map((row) => row.reduce((sum, v, i) => sum + v * ys[i], 0));
  return solveLinearSystem(XtX, Xty);
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

/* -------------------------------------------------------------------------- */
/* 数据生成                                                                   */
/* -------------------------------------------------------------------------- */
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

export default function BiasVariancePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <section className="text-center py-8 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="text-sm font-medium text-blue-600 mb-2 tracking-wide uppercase">
          泛化
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">偏差-方差权衡</h1>
        <p className="text-gray-600 max-w-2xl mx-auto px-4">
          测试误差可以分解为偏差、方差与不可约噪声。通过交互拟合实验，
          直观理解模型复杂度如何同时影响这三者。
        </p>

        <p className="mt-6 text-sm text-amber-700 flex items-center justify-center gap-2"><ShieldAlert className="w-4 h-4" /> 本内容仅供教学与非商业学习使用，完整授权说明见页脚。</p>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Scale className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">测试误差的分解</h2>
        </div>
        <p className="text-gray-700 mb-4">
          对于回归问题，在固定测试点上的期望测试误差可以分解为三项：
        </p>

        <FormulaCard
          title="偏差-方差分解"
          formula={
            <KaTeX
              math={String.raw`\mathbb{E}\left[(y - \hat{h}(x))^2\right] = \underbrace{\sigma^2}_{\text{不可约噪声}} + \underbrace{\bigl(h^*(x) - \bar{h}(x)\bigr)^2}_{\text{偏差}^2} + \underbrace{\mathrm{Var}\bigl(\hat{h}(x)\bigr)}_{\text{方差}}`}
              display
            />
          }
          description="其中 h* 是真实函数，h̄ 是多个训练集上学习到的平均模型。"
        />

        <div className="grid md:grid-cols-3 gap-4 mt-4">
          <div className="bg-rose-50 rounded-lg p-4 border border-rose-200">
            <h3 className="font-semibold text-rose-800 mb-2">偏差（Bias）</h3>
            <p className="text-sm text-gray-700">
              即使拥有无限训练数据，模型族也无法表示真实函数所带来的误差。简单模型（如线性模型拟合二次函数）通常偏差大。
            </p>
          </div>
          <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
            <h3 className="font-semibold text-amber-800 mb-2">方差（Variance）</h3>
            <p className="text-sm text-gray-700">
              由于训练集有限且带有噪声，不同训练集学出的模型波动很大。复杂模型（如高次多项式）通常方差大。
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-2">不可约噪声</h3>
            <p className="text-sm text-gray-700">
              数据本身的随机噪声，无论多好的模型都无法消除。它是测试误差的下界。
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">交互演示：多项式拟合与欠/过拟合</h2>
        <p className="text-gray-700 mb-4">
          真实函数是二次曲线（黑色虚线），训练点带有噪声。调整多项式次数、样本数和噪声水平，
          观察拟合曲线（蓝色）如何随模型复杂度变化。
        </p>
        <PolyFitDemo />
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">交互演示：多次采样看方差</h2>
        <p className="text-gray-700 mb-4">
          从同一分布中抽取多个训练集并分别拟合模型。灰色曲线展示不同训练集带来的波动，
          橙色曲线是这些模型的平均，帮助我们直观理解“方差”与“偏差”。
        </p>
        <VarianceDemo />
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">偏差-方差权衡曲线</h2>
        <p className="text-gray-700 mb-4">
          对不同次数的多项式重复多次实验，绘制训练误差、测试误差随模型复杂度的变化。
          在经典有限模型复杂度情形下，测试误差常呈现 U 型：左侧欠拟合（偏差大），右侧过拟合（方差大）；现代过参数化模型中还可能出现双下降现象，后续章节会进一步讨论。
        </p>
        <TradeoffCurveDemo />
      </section>

      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
        <h3 className="text-lg font-bold text-blue-800 mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          小结
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start gap-2">
            <Circle className="w-2 h-2 fill-current text-blue-500 mt-0.5 mt-1" />
            <span>简单模型偏差大、方差小，容易欠拟合。</span>
          </li>
          <li className="flex items-start gap-2">
            <Circle className="w-2 h-2 fill-current text-blue-500 mt-0.5 mt-1" />
            <span>复杂模型偏差小、方差大，容易过拟合。</span>
          </li>
          <li className="flex items-start gap-2">
            <Circle className="w-2 h-2 fill-current text-blue-500 mt-0.5 mt-1" />
            <span>测试误差 = 不可约噪声 + 偏差² + 方差，需在模型复杂度间寻找平衡。</span>
          </li>
        </ul>
      </section>
    
      <SectionMetadata
        bishopChapter={"Ch 4"}
        bishopSection={"0.5"}
        learningObjectives={["理解 Bias Variance 的核心概念与直观含义。", "掌握与本小节相关的关键公式与算法流程。", "能够在简单示例中应用所学方法并识别常见误区。"]}
        commonMistakes={["只记忆公式而忽略其背后的概率或优化假设。", "混淆相近概念的定义与适用场景。", "在应用时忽视数据分布与模型假设的匹配。"]}
              />
</div>
  );
}

/* -------------------------------------------------------------------------- */
/* 公共 SVG 参数                                                              */
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

function gridLinesX(): number[] {
  return [0, 0.2, 0.4, 0.6, 0.8, 1.0];
}

function gridLinesY(): number[] {
  return [-0.5, 0, 0.5, 1.0, 1.5];
}

function ChartFrame() {
  return (
    <>
      {/* 背景 */}
      <rect x={PADDING.left} y={PADDING.top} width={WIDTH - PADDING.left - PADDING.right} height={HEIGHT - PADDING.top - PADDING.bottom} fill="#f9fafb" />
      {/* 网格线 */}
      {gridLinesX().map((x) => (
        <line
          key={`vx-${x}`}
          x1={scaleX(x)}
          y1={PADDING.top}
          x2={scaleX(x)}
          y2={HEIGHT - PADDING.bottom}
          stroke="#e5e7eb"
          strokeWidth={1}
        />
      ))}
      {gridLinesY().map((y) => (
        <line
          key={`hy-${y}`}
          x1={PADDING.left}
          y1={scaleY(y)}
          x2={WIDTH - PADDING.right}
          y2={scaleY(y)}
          stroke="#e5e7eb"
          strokeWidth={1}
        />
      ))}
      {/* 坐标轴 */}
      <line x1={PADDING.left} y1={HEIGHT - PADDING.bottom} x2={WIDTH - PADDING.right} y2={HEIGHT - PADDING.bottom} stroke="#374151" strokeWidth={2} />
      <line x1={PADDING.left} y1={PADDING.top} x2={PADDING.left} y2={HEIGHT - PADDING.bottom} stroke="#374151" strokeWidth={2} />
      {/* 标签 */}
      {gridLinesX().map((x) => (
        <text key={`lx-${x}`} x={scaleX(x)} y={HEIGHT - PADDING.bottom + 20} textAnchor="middle" fontSize={12} fill="#4b5563">
          {x.toFixed(1)}
        </text>
      ))}
      {gridLinesY().map((y) => (
        <text key={`ly-${y}`} x={PADDING.left - 10} y={scaleY(y) + 4} textAnchor="end" fontSize={12} fill="#4b5563">
          {y.toFixed(1)}
        </text>
      ))}
      <text x={WIDTH / 2} y={HEIGHT - 10} textAnchor="middle" fontSize={13} fill="#374151">
        x
      </text>
      <text x={20} y={HEIGHT / 2} textAnchor="middle" fontSize={13} fill="#374151" transform={`rotate(-90, 20, ${HEIGHT / 2})`}>
        y
      </text>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* 演示 1：单次拟合                                                           */
/* -------------------------------------------------------------------------- */
function PolyFitDemo() {
  const [degree, setDegree] = useState(1);
  const [nTrain, setNTrain] = useState(20);
  const [noise, setNoise] = useState(0.15);
  const [seed, setSeed] = useState(42);

  const { train, test, weights, trainError, testError, predPoints, truePoints } = useMemo(() => {
    const tr = generateData(nTrain, noise, seed);
    const te = generateData(200, noise, seed + 1000);
    const w = polyFit(tr.x, tr.y, degree);
    const predTrain = predict(tr.x, w);
    const predTest = predict(te.x, w);
    const trainErr = mse(predTrain, tr.y);
    const testErr = mse(predTest, te.y);

    const curvePoints = Array.from({ length: 200 }, (_, i) => (i / 199) * (X_MAX - X_MIN) + X_MIN);
    return {
      train: tr,
      test: te,
      weights: w,
      trainError: trainErr,
      testError: testErr,
      predPoints: curvePoints.map((x) => ({ x, y: predict([x], w)[0] })),
      truePoints: curvePoints.map((x) => ({ x, y: trueFunction(x) })),
    };
  }, [degree, nTrain, noise, seed]);

  const effectiveDegree = Math.min(degree, nTrain - 1);

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
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSeed((s) => s + 1)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              重新采样
            </button>
            <span className="text-sm text-gray-500">随机种子: {seed}</span>
          </div>
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
              <span className="text-gray-600">模型参数:</span>
              <span className="font-mono font-medium text-gray-700">{weights.length} (有效次数 {effectiveDegree})</span>
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
            {test.x.map((x, i) => (
              <circle key={`te-${i}`} cx={scaleX(x)} cy={scaleY(test.y[i])} r={2} fill="#10b981" opacity={0.25} />
            ))}
          </svg>
          <div className="flex flex-wrap gap-4 justify-center mt-2 text-xs text-gray-600">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-orange-500" /> 训练点</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-emerald-500" /> 测试点</span>
            <span className="flex items-center gap-1"><span className="w-6 h-0.5 bg-blue-600" /> 拟合曲线</span>
            <span className="flex items-center gap-1"><span className="w-6 h-0.5 border-b-2 border-dashed border-gray-700" /> 真实函数</span>
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

/* -------------------------------------------------------------------------- */
/* 演示 2：多次采样看方差                                                     */
/* -------------------------------------------------------------------------- */
function VarianceDemo() {
  const [degree, setDegree] = useState(8);
  const [nTrain, setNTrain] = useState(20);
  const [noise, setNoise] = useState(0.15);
  const [numTrials, setNumTrials] = useState(30);
  const [seedOffset, setSeedOffset] = useState(0);

  const { curves, meanCurve, truePoints, biasSq, variance, testErr } = useMemo(() => {
    const trials: { x: number[]; y: number[] }[] = [];
    for (let t = 0; t < numTrials; t++) {
      trials.push(generateData(nTrain, noise, seedOffset * 10000 + t));
    }

    const curveX = Array.from({ length: 200 }, (_, i) => (i / 199) * (X_MAX - X_MIN) + X_MIN);
    const allCurves = trials.map((tr) => {
      const w = polyFit(tr.x, tr.y, degree);
      return curveX.map((x) => predict([x], w)[0]);
    });

    const meanPred = curveX.map((_, i) => allCurves.reduce((sum, c) => sum + c[i], 0) / allCurves.length);
    const varPred = curveX.map((_, i) => {
      const mean = meanPred[i];
      return allCurves.reduce((sum, c) => sum + Math.pow(c[i] - mean, 2), 0) / allCurves.length;
    });

    const testData = generateData(200, noise, seedOffset * 10000 + 99999);
    const testPreds = trials.map((tr) => {
      const w = polyFit(tr.x, tr.y, degree);
      return predict(testData.x, w);
    });
    const avgTestErr =
      testPreds.reduce((sum, pred) => sum + mse(pred, testData.y), 0) / testPreds.length;

    const bias2 =
      meanPred.reduce((sum, mp, i) => sum + Math.pow(mp - trueFunction(curveX[i]), 2), 0) /
      curveX.length;
    const varAvg = varPred.reduce((sum, v) => sum + v, 0) / varPred.length;

    return {
      curves: allCurves,
      meanCurve: curveX.map((x, i) => ({ x, y: meanPred[i] })),
      truePoints: curveX.map((x) => ({ x, y: trueFunction(x) })),
      biasSq: bias2,
      variance: varAvg,
      testErr: avgTestErr,
    };
  }, [degree, nTrain, noise, numTrials, seedOffset]);

  const effectiveDegree = Math.min(degree, nTrain - 1);

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
          <ControlRow label={`重复实验次数: ${numTrials}`}>
            <Slider value={[numTrials]} min={10} max={100} step={10} onValueChange={(v) => setNumTrials(v[0])} />
          </ControlRow>
          <button
            onClick={() => setSeedOffset((s) => s + 1)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            重新采样
          </button>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-600">平均偏差²:</span>
              <span className="font-mono font-medium text-rose-700">{biasSq.toFixed(6)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">平均方差:</span>
              <span className="font-mono font-medium text-amber-700">{variance.toFixed(6)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">平均测试误差:</span>
              <span className="font-mono font-medium text-emerald-700">{testErr.toFixed(6)}</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full min-w-[360px]" style={{ maxHeight: 360 }}>
            <ChartFrame />
            <path d={pathFromPoints(truePoints)} fill="none" stroke="#374151" strokeWidth={2} strokeDasharray="6 4" />
            {curves.map((c, idx) => {
              const pts = c.map((y, i) => ({ x: (i / 199) * (X_MAX - X_MIN) + X_MIN, y }));
              return <path key={idx} d={pathFromPoints(pts)} fill="none" stroke="#9ca3af" strokeWidth={1} opacity={0.25} />;
            })}
            <path d={pathFromPoints(meanCurve)} fill="none" stroke="#f97316" strokeWidth={3} />
          </svg>
          <div className="flex flex-wrap gap-4 justify-center mt-2 text-xs text-gray-600">
            <span className="flex items-center gap-1"><span className="w-6 h-0.5 bg-gray-400" /> 各次拟合</span>
            <span className="flex items-center gap-1"><span className="w-6 h-0.5 bg-orange-500" /> 平均模型 h̄</span>
            <span className="flex items-center gap-1"><span className="w-6 h-0.5 border-b-2 border-dashed border-gray-700" /> 真实函数</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 演示 3：偏差-方差权衡曲线                                                  */
/* -------------------------------------------------------------------------- */
function TradeoffCurveDemo() {
  const [nTrain, setNTrain] = useState(20);
  const [noise, setNoise] = useState(0.15);
  const [maxDegree, setMaxDegree] = useState(15);
  const [numTrials, setNumTrials] = useState(30);
  const [seedOffset, setSeedOffset] = useState(0);

  const curveData = useMemo(() => {
    const result: { degree: number; train: number; test: number }[] = [];
    for (let d = 1; d <= maxDegree; d++) {
      let trainSum = 0;
      let testSum = 0;
      for (let t = 0; t < numTrials; t++) {
        const tr = generateData(nTrain, noise, seedOffset * 100000 + d * 1000 + t);
        const te = generateData(200, noise, seedOffset * 100000 + d * 1000 + t + 50000);
        const w = polyFit(tr.x, tr.y, d);
        const predTr = predict(tr.x, w);
        const predTe = predict(te.x, w);
        trainSum += mse(predTr, tr.y);
        testSum += mse(predTe, te.y);
      }
      result.push({ degree: d, train: trainSum / numTrials, test: testSum / numTrials });
    }
    return result;
  }, [nTrain, noise, maxDegree, numTrials, seedOffset]);

  const CW = 720;
  const CH = 360;
  const CP = { top: 25, right: 40, bottom: 50, left: 70 };
  const rawMaxErr = Math.max(...curveData.map((d) => Math.max(d.train, d.test)), 0.01);
  const yMax = rawMaxErr * 1.05;

  function cx(degree: number): number {
    return CP.left + ((degree - 1) / (maxDegree - 1 || 1)) * (CW - CP.left - CP.right);
  }
  function cy(err: number): number {
    const clamped = Math.min(Math.max(err, 0), yMax);
    return CH - CP.bottom - (clamped / yMax) * (CH - CP.top - CP.bottom);
  }
  function formatY(y: number): string {
    if (y === 0) return '0';
    if (y < 0.001) return y.toExponential(1);
    if (y < 0.01) return y.toFixed(4);
    if (y < 0.1) return y.toFixed(3);
    if (y < 1) return y.toFixed(2);
    if (y < 10) return y.toFixed(2);
    return y.toFixed(1);
  }
  const yTicks = [0, yMax * 0.25, yMax * 0.5, yMax * 0.75, yMax];

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-5">
          <ControlRow label={`训练样本数: ${nTrain}`}>
            <Slider value={[nTrain]} min={10} max={100} step={5} onValueChange={(v) => setNTrain(v[0])} />
          </ControlRow>
          <ControlRow label={`噪声标准差: ${noise.toFixed(2)}`}>
            <Slider value={[noise]} min={0} max={0.5} step={0.01} onValueChange={(v) => setNoise(v[0])} />
          </ControlRow>
          <ControlRow label={`最大多项式次数: ${maxDegree}`}>
            <Slider value={[maxDegree]} min={3} max={20} step={1} onValueChange={(v) => setMaxDegree(v[0])} />
          </ControlRow>
          <ControlRow label={`重复实验次数: ${numTrials}`}>
            <Slider value={[numTrials]} min={10} max={100} step={10} onValueChange={(v) => setNumTrials(v[0])} />
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
            {[1, 5, 10, 15, 20].filter((d) => d <= maxDegree).map((d) => (
              <line key={`vx-${d}`} x1={cx(d)} y1={CP.top} x2={cx(d)} y2={CH - CP.bottom} stroke="#e5e7eb" strokeWidth={1} />
            ))}
            {yTicks.map((e) => (
              <line key={`hy-${e}`} x1={CP.left} y1={cy(e)} x2={CW - CP.right} y2={cy(e)} stroke="#e5e7eb" strokeWidth={1} />
            ))}
            <line x1={CP.left} y1={CH - CP.bottom} x2={CW - CP.right} y2={CH - CP.bottom} stroke="#374151" strokeWidth={2} />
            <line x1={CP.left} y1={CP.top} x2={CP.left} y2={CH - CP.bottom} stroke="#374151" strokeWidth={2} />
            {[1, 5, 10, 15, 20].filter((d) => d <= maxDegree).map((d) => (
              <text key={`lx-${d}`} x={cx(d)} y={CH - CP.bottom + 20} textAnchor="middle" fontSize={12} fill="#4b5563">
                {d}
              </text>
            ))}
            {yTicks.map((e) => (
              <text key={`ly-${e}`} x={CP.left - 10} y={cy(e) + 4} textAnchor="end" fontSize={12} fill="#4b5563">
                {formatY(e)}
              </text>
            ))}
            <text x={CW / 2} y={CH - 10} textAnchor="middle" fontSize={13} fill="#374151">
              多项式次数
            </text>
            <text x={20} y={CH / 2} textAnchor="middle" fontSize={13} fill="#374151" transform={`rotate(-90, 20, ${CH / 2})`}>
              误差
            </text>

            <polyline
              points={curveData.map((d) => `${cx(d.degree)},${cy(d.train)}`).join(' ')}
              fill="none"
              stroke="#2563eb"
              strokeWidth={2}
            />
            <polyline
              points={curveData.map((d) => `${cx(d.degree)},${cy(d.test)}`).join(' ')}
              fill="none"
              stroke="#ef4444"
              strokeWidth={2}
            />
            {curveData.map((d) => (
              <g key={`pt-${d.degree}`}>
                <circle cx={cx(d.degree)} cy={cy(d.train)} r={3} fill="#2563eb" />
                <circle cx={cx(d.degree)} cy={cy(d.test)} r={3} fill="#ef4444" />
              </g>
            ))}
          </svg>
          <div className="flex flex-wrap gap-4 justify-center mt-2 text-xs text-gray-600">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-600" /> 平均训练误差</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500" /> 平均测试误差</span>
          </div>
        </div>
      </div>
    </div>
  );
}
