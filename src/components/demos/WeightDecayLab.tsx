import { useMemo, useState } from 'react';
import { Slider } from '@/components/ui/slider';
import InteractiveDemo from '@/components/InteractiveDemo';

const PLOT_W = 560;
const PLOT_H = 280;
const MARGIN = { t: 20, r: 20, b: 40, l: 50 };
const INNER_W = PLOT_W - MARGIN.l - MARGIN.r;
const INNER_H = PLOT_H - MARGIN.t - MARGIN.b;

// 生成模拟数据：真实关系是 y = 0.5x + noise，但模型用高阶多项式拟合
function generateData(n: number, noise: number): { x: number; y: number }[] {
  const data: { x: number; y: number }[] = [];
  for (let i = 0; i < n; i++) {
    const x = (i / (n - 1)) * 2 - 1;
    const noiseVal = (Math.random() - 0.5) * noise;
    data.push({ x, y: 0.5 * x + noiseVal });
  }
  return data;
}

// 多项式拟合（带权重衰减）
function fitPolynomial(data: { x: number; y: number }[], degree: number, lambda: number): number[] {
  const X: number[][] = data.map((p) => {
    const row: number[] = [];
    for (let j = 0; j <= degree; j++) {
      row.push(Math.pow(p.x, j));
    }
    return row;
  });

  // 计算 XtX + lambda * I
  const XtX: number[][] = Array.from({ length: degree + 1 }, (_, i) =>
    Array.from({ length: degree + 1 }, (_, j) =>
      X.reduce((sum, row) => sum + row[i] * row[j], 0) + (i === j ? lambda : 0)
    )
  );

  const Xty: number[] = Array.from({ length: degree + 1 }, (_, i) =>
    data.reduce((sum, p, idx) => sum + X[idx][i] * p.y, 0)
  );

  // 简单的高斯消元
  const M: number[][] = XtX.map((row, i) => [...row, Xty[i]]);
  for (let col = 0; col <= degree; col++) {
    let maxRow = col;
    for (let row = col + 1; row <= degree; row++) {
      if (Math.abs(M[row][col]) > Math.abs(M[maxRow][col])) maxRow = row;
    }
    [M[col], M[maxRow]] = [M[maxRow], M[col]];
    const pivot = M[col][col];
    if (Math.abs(pivot) < 1e-12) continue;
    for (let j = col; j <= degree + 1; j++) M[col][j] /= pivot;
    for (let row = 0; row <= degree; row++) {
      if (row === col) continue;
      const factor = M[row][col];
      for (let j = col; j <= degree + 1; j++) M[row][j] -= factor * M[col][j];
    }
  }
  return M.map((row) => row[degree + 1]);
}

function predict(x: number, coeffs: number[]): number {
  let y = 0;
  for (let j = 0; j < coeffs.length; j++) {
    y += coeffs[j] * Math.pow(x, j);
  }
  return y;
}

function rmsError(data: { x: number; y: number }[], coeffs: number[]): number {
  const sq = data.reduce((sum, p) => sum + Math.pow(predict(p.x, coeffs) - p.y, 2), 0);
  return Math.sqrt(sq / data.length);
}

export default function WeightDecayLab() {
  const [lambda, setLambda] = useState(0);
  const [degree, setDegree] = useState(5);
  const [noise, setNoise] = useState(0.3);

  const trainData = useMemo(() => generateData(20, noise), [noise]);
  const testData = useMemo(() => generateData(100, 0), []);

  const coeffs = useMemo(() => fitPolynomial(trainData, degree, lambda), [trainData, degree, lambda]);

  const trainError = useMemo(() => rmsError(trainData, coeffs), [trainData, coeffs]);
  const testError = useMemo(() => rmsError(testData, coeffs), [testData, coeffs]);

  const weightNorm = useMemo(() => {
    return Math.sqrt(coeffs.reduce((sum, c) => sum + c * c, 0));
  }, [coeffs]);

  // 绘制拟合曲线
  const curvePath = useMemo(() => {
    const points: string[] = [];
    for (let i = 0; i <= 100; i++) {
      const x = (i / 100) * 2 - 1;
      const y = predict(x, coeffs);
      const px = MARGIN.l + ((x + 1) / 2) * INNER_W;
      const py = MARGIN.t + INNER_H - ((y + 1.5) / 3) * INNER_H;
      points.push(`${i === 0 ? 'M' : 'L'} ${px} ${py}`);
    }
    return points.join(' ');
  }, [coeffs]);

  const truePath = useMemo(() => {
    const points: string[] = [];
    for (let i = 0; i <= 100; i++) {
      const x = (i / 100) * 2 - 1;
      const y = 0.5 * x;
      const px = MARGIN.l + ((x + 1) / 2) * INNER_W;
      const py = MARGIN.t + INNER_H - ((y + 1.5) / 3) * INNER_H;
      points.push(`${i === 0 ? 'M' : 'L'} ${px} ${py}`);
    }
    return points.join(' ');
  }, []);

  return (
    <InteractiveDemo title="权重衰减对模型复杂度的影响">
      <div className="space-y-6">
        <p className="text-gray-700">
          调整权重衰减系数 λ，观察训练误差、测试误差和权重范数的变化。
          当 λ=0 时模型容易过拟合；当 λ 过大时模型欠拟合。
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">权重衰减系数 λ</label>
              <Slider value={[lambda]} min={0} max={10} step={0.1} onValueChange={(v) => setLambda(v[0])} />
              <div className="text-sm text-gray-500 mt-1">λ = {lambda.toFixed(1)}</div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">多项式阶数</label>
              <Slider value={[degree]} min={1} max={9} step={1} onValueChange={(v) => setDegree(v[0])} />
              <div className="text-sm text-gray-500 mt-1">阶数 = {degree}</div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">数据噪声</label>
              <Slider value={[noise]} min={0} max={0.5} step={0.05} onValueChange={(v) => setNoise(v[0])} />
              <div className="text-sm text-gray-500 mt-1">噪声 = {noise.toFixed(2)}</div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <div className="text-xs text-gray-600">训练误差</div>
                <div className="text-lg font-bold text-blue-700">{trainError.toFixed(3)}</div>
              </div>
              <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                <div className="text-xs text-gray-600">测试误差</div>
                <div className="text-lg font-bold text-emerald-700">{testError.toFixed(3)}</div>
              </div>
              <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
                <div className="text-xs text-gray-600">权重范数</div>
                <div className="text-lg font-bold text-amber-700">{weightNorm.toFixed(3)}</div>
              </div>
            </div>
          </div>

          <div>
            <svg viewBox={`0 0 ${PLOT_W} ${PLOT_H}`} className="w-full border border-gray-200 rounded-lg">
              <rect x={MARGIN.l} y={MARGIN.t} width={INNER_W} height={INNER_H} fill="#f9fafb" />
              {/* 网格线 */}
              {[-1, 0, 1].map((y) => (
                <line
                  key={`gy-${y}`}
                  x1={MARGIN.l}
                  y1={MARGIN.t + INNER_H - ((y + 1.5) / 3) * INNER_H}
                  x2={MARGIN.l + INNER_W}
                  y2={MARGIN.t + INNER_H - ((y + 1.5) / 3) * INNER_H}
                  stroke="#e5e7eb"
                  strokeDasharray="3,3"
                />
              ))}
              {[-1, 0, 1].map((x) => (
                <line
                  key={`gx-${x}`}
                  x1={MARGIN.l + ((x + 1) / 2) * INNER_W}
                  y1={MARGIN.t}
                  x2={MARGIN.l + ((x + 1) / 2) * INNER_W}
                  y2={MARGIN.t + INNER_H}
                  stroke="#e5e7eb"
                  strokeDasharray="3,3"
                />
              ))}

              {/* 真实关系 */}
              <path d={truePath} fill="none" stroke="#10b981" strokeWidth={2} strokeDasharray="5,5" />
              {/* 拟合曲线 */}
              <path d={curvePath} fill="none" stroke="#3b82f6" strokeWidth={2.5} />
              {/* 训练数据点 */}
              {trainData.map((p, i) => (
                <circle
                  key={i}
                  cx={MARGIN.l + ((p.x + 1) / 2) * INNER_W}
                  cy={MARGIN.t + INNER_H - ((p.y + 1.5) / 3) * INNER_H}
                  r={4}
                  fill="#ef4444"
                  opacity={0.7}
                />
              ))}
            </svg>
            <div className="flex gap-4 justify-center mt-2 text-xs text-gray-600">
              <span className="flex items-center gap-1"><span className="w-4 h-0.5 bg-emerald-500" style={{ borderTop: '2px dashed #10b981' }} /> 真实关系</span>
              <span className="flex items-center gap-1"><span className="w-4 h-0.5 bg-blue-600" /> 拟合曲线</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-400 rounded-full" /> 训练数据</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="text-sm text-gray-700">
            <strong>当前状态：</strong>
            {lambda < 0.5 && degree > 3 && ' λ 较小且阶数较高，模型可能过拟合。训练误差低但测试误差高。'}
            {lambda > 5 && ' λ 较大，模型可能欠拟合。训练误差和测试误差都较高，权重范数很小。'}
            {lambda >= 0.5 && lambda <= 5 && ' λ 适中，模型在训练误差和测试误差之间取得平衡。'}
          </div>
        </div>
      </div>
    </InteractiveDemo>
  );
}
