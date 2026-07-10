import { useState, useMemo, type ReactNode } from 'react';
import { ShieldAlert, Sigma, CheckCircle2 , Circle} from 'lucide-react';
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
  const XtX = Xt.map((row) => row.map((_, j) => row.reduce((sum, v, i) => sum + v * X[i][j], 0)));
  const Xty = Xt.map((row) => row.reduce((sum, v, i) => sum + v * ys[i], 0));
  for (let i = 0; i < XtX.length; i++) {
    if (i > 0) XtX[i][i] += lambda;
  }
  return solveLinearSystem(XtX, Xty);
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
        <text key={`lx-${x}`} x={scaleX(x)} y={HEIGHT - PADDING.bottom + 20} textAnchor="middle" fontSize={12} fill="#4b5563">{x.toFixed(1)}</text>
      ))}
      {gridY.map((y) => (
        <text key={`ly-${y}`} x={PADDING.left - 10} y={scaleY(y) + 4} textAnchor="end" fontSize={12} fill="#4b5563">{y.toFixed(1)}</text>
      ))}
      <text x={WIDTH / 2} y={HEIGHT - 10} textAnchor="middle" fontSize={13} fill="#374151">x</text>
      <text x={20} y={HEIGHT / 2} textAnchor="middle" fontSize={13} fill="#374151" transform={`rotate(-90, 20, ${HEIGHT / 2})`}>y</text>
    </>
  );
}

export default function BayesianRegularizationPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <section className="text-center py-8 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="text-sm font-medium text-blue-600 mb-2 tracking-wide uppercase">
          第九章 · 正则化与模型选择
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">贝叶斯统计与正则化</h1>
        <p className="text-gray-600 max-w-2xl mx-auto px-4">
          从贝叶斯统计的角度看，正则化等价于对模型参数引入先验分布。最大后验估计（MAP）在似然项之外加入了先验项，
          自然起到了正则化的作用。
        </p>

        <p className="mt-6 text-sm text-amber-700 flex items-center justify-center gap-2"><ShieldAlert className="w-4 h-4" /> 本内容仅供教学与非商业学习使用，完整授权说明见页脚。</p>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Sigma className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">频率学派 vs 贝叶斯学派</h2>
        </div>
        <p className="text-gray-700 mb-4">
          在频率学派中，参数 θ 被看作未知的固定常数，我们通过最大似然估计（MLE）来寻找它。
          在贝叶斯学派中，参数 θ 本身是一个随机变量，我们对它有一个先验信念 p(θ)。
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          <FormulaCard
            title="最大似然估计（MLE）"
            formula={
              <KaTeX
                math={String.raw`\theta_{\text{MLE}} = \arg\max_\theta \prod_{i=1}^n p\bigl(y^{(i)}|x^{(i)};\theta\bigr)`}
                display
              />
            }
            description="只考虑数据似然，容易过拟合。"
          />
          <FormulaCard
            title="最大后验估计（MAP）"
            formula={
              <KaTeX
                math={String.raw`\theta_{\text{MAP}} = \arg\max_\theta \left(\prod_{i=1}^n p\bigl(y^{(i)}|x^{(i)},\theta\bigr)\right) p(\theta)`}
                display
              />
            }
            description="在似然基础上乘以先验，等价于正则化。"
          />
        </div>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">高斯先验与 L2 正则化</h2>
        <p className="text-gray-700 mb-4">
          如果我们假设参数服从零均值高斯分布 θ ∼ N(0, τ²I)，那么 MAP 估计中的先验项取对数后就变成了 L2 惩罚：
        </p>
        <FormulaCard
          title="MAP = L2 正则化"
          formula={
            <KaTeX
              math={String.raw`\log p(\theta) = -\frac{1}{2\tau^2}\|\theta\|_2^2 + \text{const} \quad \Longleftrightarrow \quad R(\theta) = \frac{1}{2}\|\theta\|_2^2`}
              display
            />
          }
          description="高斯先验对应 L2 penalty；先验方差 τ² 越小，正则化强度 λ 越大。在普通 SGD 下，它与 weight decay 形式等价，但在 AdamW 等解耦 weight decay 实现中，两者并不完全相同。"
        />

        <p className="text-gray-700 mt-4">
          交互演示：调整“先验强度”（等价于正则化强度 λ），观察 MAP 估计如何从无正则化的 MLE
          逐渐转变为更受先验影响的平滑解。
        </p>
        <BayesianDemo />
      </section>

      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
        <h3 className="text-lg font-bold text-blue-800 mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          小结
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start gap-2">
            <Circle className="w-2 h-2 fill-current text-blue-500 mt-0.5 mt-1" />
            <span>贝叶斯方法把参数看作随机变量，通过先验表达我们的信念。</span>
          </li>
          <li className="flex items-start gap-2">
            <Circle className="w-2 h-2 fill-current text-blue-500 mt-0.5 mt-1" />
            <span>MAP 估计在似然基础上加入先验，等价于正则化。</span>
          </li>
          <li className="flex items-start gap-2">
            <Circle className="w-2 h-2 fill-current text-blue-500 mt-0.5 mt-1" />
            <span>零均值高斯先验对应 L2 penalty；在普通 SGD 下它与 weight decay 形式等价，但在 AdamW 等解耦实现中并不完全相同。</span>
          </li>
        </ul>
      </section>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 交互演示                                                                   */
/* -------------------------------------------------------------------------- */
function BayesianDemo() {
  const [degree, setDegree] = useState(12);
  const [lambda, setLambda] = useState(0.05);
  const [nTrain, setNTrain] = useState(20);
  const [noise, setNoise] = useState(0.2);
  const [seed, setSeed] = useState(42);

  const { train, weights, trainError, testError, predPoints, truePoints, mlePredPoints } = useMemo(() => {
    const tr = generateData(nTrain, noise, seed);
    const te = generateData(200, noise, seed + 1000);
    const wMap = fitPolyRidge(tr.x, tr.y, degree, lambda);
    const wMle = fitPolyRidge(tr.x, tr.y, degree, 0);
    const curvePoints = Array.from({ length: 200 }, (_, i) => (i / 199) * (X_MAX - X_MIN) + X_MIN);
    return {
      train: tr,
      weights: wMap,
      trainError: mse(predict(tr.x, wMap), tr.y),
      testError: mse(predict(te.x, wMap), te.y),
      predPoints: curvePoints.map((x) => ({ x, y: predict([x], wMap)[0] })),
      mlePredPoints: curvePoints.map((x) => ({ x, y: predict([x], wMle)[0] })),
      truePoints: curvePoints.map((x) => ({ x, y: trueFunction(x) })),
    };
  }, [degree, lambda, nTrain, noise, seed]);

  return (
    <div className="space-y-4 mt-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-5">
          <ControlRow label={`先验强度 / λ: ${lambda.toFixed(3)}`}>
            <Slider value={[lambda]} min={0} max={0.5} step={0.001} onValueChange={(v) => setLambda(v[0])} />
          </ControlRow>
          <ControlRow label={`多项式次数: ${degree}`}>
            <Slider value={[degree]} min={1} max={15} step={1} onValueChange={(v) => setDegree(v[0])} />
          </ControlRow>
          <ControlRow label={`训练样本数: ${nTrain}`}>
            <Slider value={[nTrain]} min={10} max={100} step={5} onValueChange={(v) => setNTrain(v[0])} />
          </ControlRow>
          <ControlRow label={`噪声标准差: ${noise.toFixed(2)}`}>
            <Slider value={[noise]} min={0} max={0.5} step={0.01} onValueChange={(v) => setNoise(v[0])} />
          </ControlRow>
          <button
            onClick={() => setSeed((s) => s + 1)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            重新采样
          </button>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-600">MAP 训练误差:</span>
              <span className="font-mono font-medium text-blue-700">{trainError.toFixed(6)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">MAP 测试误差:</span>
              <span className="font-mono font-medium text-emerald-700">{testError.toFixed(6)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">参数 L2 范数:</span>
              <span className="font-mono font-medium text-gray-700">
                {Math.sqrt(weights.reduce((sum, w) => sum + w * w, 0)).toFixed(6)}
              </span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full min-w-[360px]" style={{ maxHeight: 360 }}>
            <ChartFrame />
            <path d={pathFromPoints(truePoints)} fill="none" stroke="#374151" strokeWidth={2} strokeDasharray="6 4" />
            <path d={pathFromPoints(mlePredPoints)} fill="none" stroke="#9ca3af" strokeWidth={2} />
            <path d={pathFromPoints(predPoints)} fill="none" stroke="#2563eb" strokeWidth={3} />
            {train.x.map((x, i) => (
              <circle key={`tr-${i}`} cx={scaleX(x)} cy={scaleY(train.y[i])} r={4} fill="#f97316" opacity={0.7} />
            ))}
          </svg>
          <div className="flex flex-wrap gap-4 justify-center mt-2 text-xs text-gray-600">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-orange-500" /> 训练点</span>
            <span className="flex items-center gap-1"><span className="w-6 h-0.5 bg-blue-600" /> MAP 解</span>
            <span className="flex items-center gap-1"><span className="w-6 h-0.5 bg-gray-400" /> MLE 解</span>
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
