import { useMemo, useState, type ReactNode } from 'react';
import { Slider } from '@/components/ui/slider';
import InteractiveDemo from '@/components/InteractiveDemo';
import KaTeX from '@/components/KaTeX';
import {
  sigmoid,
  scaledProbit,
  logisticLoss,
  probitLoss,
  logisticGradient,
  probitGradient,
  DEFAULT_LAMBDA,
} from '@/lib/math/probit';

const A_MIN = -8;
const A_MAX = 8;

function formatNumber(n: number): string {
  if (!Number.isFinite(n)) return '∞';
  return n.toFixed(4);
}

interface MetricCardProps {
  label: ReactNode;
  value: string;
}

function MetricCard({ label, value }: MetricCardProps) {
  return (
    <div className="rounded p-3 bg-white border">
      <div className="text-gray-500 mb-1 text-xs">{label}</div>
      <div className="font-semibold text-gray-800 font-mono text-sm">{value}</div>
    </div>
  );
}

export default function LinkFunctionLab() {
  const [a, setA] = useState(0);

  const sig = sigmoid(a);
  const prob = scaledProbit(a);
  const lLoss1 = logisticLoss(1, a);
  const pLoss1 = probitLoss(1, a);
  const lLoss0 = logisticLoss(0, a);
  const pLoss0 = probitLoss(0, a);
  const lGrad1 = logisticGradient(1, a);
  const pGrad1 = probitGradient(1, a);
  const lGrad0 = logisticGradient(0, a);
  const pGrad0 = probitGradient(0, a);

  const { probPoints, sigPoints, gradLogisticPoints, gradProbitPoints } =
    useMemo(() => {
      const n = 200;
      const probPoints: { x: number; y: number }[] = [];
      const sigPoints: { x: number; y: number }[] = [];
      const gradLogisticPoints: { x: number; y: number }[] = [];
      const gradProbitPoints: { x: number; y: number }[] = [];
      for (let i = 0; i <= n; i++) {
        const x = A_MIN + ((A_MAX - A_MIN) * i) / n;
        sigPoints.push({ x, y: sigmoid(x) });
        probPoints.push({ x, y: scaledProbit(x) });
        gradLogisticPoints.push({ x, y: Math.abs(logisticGradient(1, x)) });
        gradProbitPoints.push({ x, y: Math.min(Math.abs(probitGradient(1, x)), 10) });
      }
      return { probPoints, sigPoints, gradLogisticPoints, gradProbitPoints };
    }, []);

  const W = 480;
  const H = 240;
  const M = { t: 10, r: 10, b: 40, l: 50 };
  const PW = W - M.l - M.r;
  const PH = H - M.t - M.b;

  function toX(x: number): number {
    return M.l + ((x - A_MIN) / (A_MAX - A_MIN)) * PW;
  }

  function toY(y: number): number {
    return M.t + PH - y * PH;
  }

  function path(points: { x: number; y: number }[]): string {
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${toX(p.x)} ${toY(p.y)}`).join(' ');
  }

  const currentX = toX(a);

  return (
    <InteractiveDemo title="Link Function 对比：尾部薄不等于更鲁棒">
      <div className="space-y-5">
        <p className="text-sm text-gray-600">
          调整线性预测值 <KaTeX math="a" />，对比 sigmoid 与 scaled probit{' '}
          <KaTeX math={`\\Phi(${DEFAULT_LAMBDA.toFixed(4)}a)`} /> 的概率输出、损失与梯度。
          注意：probit 的概率尾部更薄，但其梯度对强异常点反而更大。
        </p>

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              线性预测值 <KaTeX math="a" />
            </span>
            <span className="text-sm font-mono text-gray-600">{a.toFixed(2)}</span>
          </div>
          <Slider
            value={[a]}
            min={A_MIN}
            max={A_MAX}
            step={0.1}
            onValueChange={(v) => setA(v[0])}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <MetricCard label={<KaTeX math="\sigma(a)" />} value={formatNumber(sig)} />
          <MetricCard
            label={<KaTeX math={`\\Phi(${DEFAULT_LAMBDA.toFixed(4)}a)`} />}
            value={formatNumber(prob)}
          />
          <MetricCard
            label={<KaTeX math="\ell_{\mathrm{log}}(y=1)" />}
            value={formatNumber(lLoss1)}
          />
          <MetricCard
            label={<KaTeX math="\ell_{\Phi}(y=1)" />}
            value={formatNumber(pLoss1)}
          />
          <MetricCard
            label={<KaTeX math="\ell_{\mathrm{log}}(y=0)" />}
            value={formatNumber(lLoss0)}
          />
          <MetricCard
            label={<KaTeX math="\ell_{\Phi}(y=0)" />}
            value={formatNumber(pLoss0)}
          />
          <MetricCard
            label={<KaTeX math="|\nabla_a \ell_{\mathrm{log}}(y=1)|" />}
            value={formatNumber(Math.abs(lGrad1))}
          />
          <MetricCard
            label={<KaTeX math="|\nabla_a \ell_{\Phi}(y=1)|" />}
            value={formatNumber(Math.abs(pGrad1))}
          />
          <MetricCard
            label={<KaTeX math="|\nabla_a \ell_{\mathrm{log}}(y=0)|" />}
            value={formatNumber(Math.abs(lGrad0))}
          />
          <MetricCard
            label={<KaTeX math="|\nabla_a \ell_{\Phi}(y=0)|" />}
            value={formatNumber(Math.abs(pGrad0))}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <div className="text-xs font-medium text-gray-600 mb-2">
              概率输出 <KaTeX math="p(y=1\mid a)" />
            </div>
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 240 }}>
              {[-6, -4, -2, 0, 2, 4, 6].map((v) => (
                <line
                  key={`gx-${v}`}
                  x1={toX(v)}
                  y1={M.t}
                  x2={toX(v)}
                  y2={H - M.b}
                  stroke="#e5e7eb"
                  strokeWidth={0.5}
                />
              ))}
              {[0.25, 0.5, 0.75].map((v) => (
                <line
                  key={`gy-${v}`}
                  x1={M.l}
                  y1={toY(v)}
                  x2={W - M.r}
                  y2={toY(v)}
                  stroke="#e5e7eb"
                  strokeWidth={0.5}
                />
              ))}
              <path d={path(sigPoints)} fill="none" stroke="#3b82f6" strokeWidth={2} />
              <path
                d={path(probPoints)}
                fill="none"
                stroke="#ef4444"
                strokeWidth={2}
                strokeDasharray="4,2"
              />
              <line
                x1={currentX}
                y1={M.t}
                x2={currentX}
                y2={H - M.b}
                stroke="#1f2937"
                strokeWidth={1}
                strokeDasharray="3,3"
              />
              <line
                x1={M.l}
                y1={toY(0)}
                x2={W - M.r}
                y2={toY(0)}
                stroke="#9ca3af"
                strokeWidth={1}
              />
              <line
                x1={toX(0)}
                y1={M.t}
                x2={toX(0)}
                y2={H - M.b}
                stroke="#9ca3af"
                strokeWidth={1}
              />
              <rect
                x={M.l}
                y={M.t}
                width={PW}
                height={PH}
                fill="none"
                stroke="#d1d5db"
                strokeWidth={1}
              />
            </svg>
            <div className="flex justify-center gap-3 text-xs text-gray-500 mt-2">
              <span>
                <span className="inline-block w-3 h-[2px] bg-blue-500 mr-1 align-middle" />
                sigmoid
              </span>
              <span>
                <span className="inline-block w-3 h-[2px] bg-red-500 mr-1 align-middle" />
                scaled probit
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <div className="text-xs font-medium text-gray-600 mb-2">
              梯度幅值 <KaTeX math="|\nabla_a \ell(y=1)|" />
            </div>
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 240 }}>
              {[-6, -4, -2, 0, 2, 4, 6].map((v) => (
                <line
                  key={`gx2-${v}`}
                  x1={toX(v)}
                  y1={M.t}
                  x2={toX(v)}
                  y2={H - M.b}
                  stroke="#e5e7eb"
                  strokeWidth={0.5}
                />
              ))}
              {[2, 4, 6, 8, 10].map((v) => (
                <line
                  key={`gy2-${v}`}
                  x1={M.l}
                  y1={toY(v / 10)}
                  x2={W - M.r}
                  y2={toY(v / 10)}
                  stroke="#e5e7eb"
                  strokeWidth={0.5}
                />
              ))}
              <path
                d={path(gradLogisticPoints)}
                fill="none"
                stroke="#3b82f6"
                strokeWidth={2}
              />
              <path
                d={path(gradProbitPoints)}
                fill="none"
                stroke="#ef4444"
                strokeWidth={2}
                strokeDasharray="4,2"
              />
              <line
                x1={currentX}
                y1={M.t}
                x2={currentX}
                y2={H - M.b}
                stroke="#1f2937"
                strokeWidth={1}
                strokeDasharray="3,3"
              />
              <line
                x1={M.l}
                y1={toY(0)}
                x2={W - M.r}
                y2={toY(0)}
                stroke="#9ca3af"
                strokeWidth={1}
              />
              <line
                x1={toX(0)}
                y1={M.t}
                x2={toX(0)}
                y2={H - M.b}
                stroke="#9ca3af"
                strokeWidth={1}
              />
              <rect
                x={M.l}
                y={M.t}
                width={PW}
                height={PH}
                fill="none"
                stroke="#d1d5db"
                strokeWidth={1}
              />
            </svg>
            <div className="flex justify-center gap-3 text-xs text-gray-500 mt-2">
              <span>
                <span className="inline-block w-3 h-[2px] bg-blue-500 mr-1 align-middle" />
                logistic
              </span>
              <span>
                <span className="inline-block w-3 h-[2px] bg-red-500 mr-1 align-middle" />
                probit (上限 10)
              </span>
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-700 space-y-2 bg-slate-50 p-4 rounded-lg border">
          <p>
            <strong>核心结论：</strong>probit 的概率尾部比 sigmoid 更薄，但这并不意味着它更鲁棒。
          </p>
          <ul className="space-y-1 list-disc list-inside">
            <li>
              当样本被强错误分类时（例如 <KaTeX math="y=1" /> 但{' '}
              <KaTeX math="a \ll 0" />），logistic 梯度幅值趋于 1，是<strong>有界</strong>的。
            </li>
            <li>
              probit 梯度为 <KaTeX math="-\phi(a)/\Phi(a)" />；当{' '}
              <KaTeX math="a \to -\infty" /> 时，其幅值大致按 <KaTeX math="|a|" />{' '}
              增长，<strong>没有上界</strong>。
            </li>
            <li>
              因此，尾部更薄的概率模型会把更强的“拉力”施加在远处的异常点上，反而降低了对离群值的鲁棒性。
            </li>
          </ul>
        </div>
      </div>
    </InteractiveDemo>
  );
}
