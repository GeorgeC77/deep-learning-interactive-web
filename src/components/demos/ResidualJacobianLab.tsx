import { useState } from 'react';
import InteractiveDemo from '@/components/InteractiveDemo';
import KaTeX from '@/components/KaTeX';
import {
  residualForward,
  residualJacobian,
  backpropGradient,
  matNorm,
  type MLPParams,
} from '@/lib/math/residual';

function formatMat(M: [[number, number], [number, number]]): string {
  return `[[${M[0][0].toFixed(3)}, ${M[0][1].toFixed(3)}], [${M[1][0].toFixed(3)}, ${M[1][1].toFixed(3)}]]`;
}

function formatVec(v: [number, number]): string {
  return `[${v[0].toFixed(3)}, ${v[1].toFixed(3)}]`;
}

const DEFAULT_PARAMS: MLPParams = {
  W1: [
    [0.6, -0.3],
    [0.2, 0.5],
  ],
  b1: [0.1, -0.1],
  W2: [
    [0.4, 0.1],
    [-0.2, 0.5],
  ],
  b2: [0, 0],
};

const DEGENERATE_PARAMS: MLPParams = {
  W1: [
    [1, 0],
    [0, 1],
  ],
  b1: [1, 1],
  W2: [
    [-1, 0],
    [0, -1],
  ],
  b2: [0, 0],
};

export default function ResidualJacobianLab() {
  const [x0, setX0] = useState(0.5);
  const [x1, setX1] = useState(0.3);
  const [numBlocks, setNumBlocks] = useState(5);
  const [degenerate, setDegenerate] = useState(false);

  const x: [number, number] = [x0, x1];
  const params = degenerate ? DEGENERATE_PARAMS : DEFAULT_PARAMS;

  const y = residualForward(x, params);
  const J = residualJacobian(x, params);

  const residualBlocks = new Array(numBlocks).fill(params);
  const residualJacobians = residualBlocks.map(() => residualJacobian(x, params));
  const plainJacobians = residualBlocks.map(() => {
    const Jf = {
      W1: params.W1,
      b1: params.b1,
      W2: params.W2,
      b2: params.b2,
    };
    // plain block Jacobian = just MLP Jacobian (no identity shortcut)
    const rJ = residualJacobian(x, Jf);
    // subtract identity
    return [
      [rJ[0][0] - 1, rJ[0][1]],
      [rJ[1][0], rJ[1][1] - 1],
    ] as [[number, number], [number, number]];
  });

  const g: [number, number] = [1, 0];
  const residualGrad = backpropGradient(g, residualJacobians);
  const plainGrad = backpropGradient(g, plainJacobians);

  const residualNorm = Math.sqrt(residualGrad[0] ** 2 + residualGrad[1] ** 2);
  const plainNorm = Math.sqrt(plainGrad[0] ** 2 + plainGrad[1] ** 2);

  return (
    <InteractiveDemo title="残差 Jacobian 实验：I + ∂F/∂x">
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          残差块 <KaTeX math="y = x + F(x)" /> 的 Jacobian 是 <KaTeX math="I + \\partial F/\\partial x" />。
          当 <KaTeX math="\\partial F/\\partial x" /> 很小时，Jacobian 接近单位阵，梯度不易衰减；
          但若 <KaTeX math="F \\approx -x" />，整体 Jacobian 仍可能退化。
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">x₀ = {x0.toFixed(2)}</label>
            <input type="range" min={-2} max={2} step={0.1} value={x0} onChange={(e) => setX0(parseFloat(e.target.value))} className="w-full" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">x₁ = {x1.toFixed(2)}</label>
            <input type="range" min={-2} max={2} step={0.1} value={x1} onChange={(e) => setX1(parseFloat(e.target.value))} className="w-full" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">堆叠块数 L = {numBlocks}</label>
            <input type="range" min={1} max={20} step={1} value={numBlocks} onChange={(e) => setNumBlocks(parseInt(e.target.value, 10))} className="w-full" />
          </div>
          <div className="flex items-center gap-2">
            <input
              id="degenerate"
              type="checkbox"
              checked={degenerate}
              onChange={(e) => setDegenerate(e.target.checked)}
              className="rounded border-gray-300 text-blue-600"
            />
            <label htmlFor="degenerate" className="text-sm text-gray-700 cursor-pointer">
              退化分支 <KaTeX math="F \\approx -x" />
            </label>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 text-sm space-y-2">
            <div className="font-medium text-gray-700">单块前向</div>
            <div>x = {formatVec(x)}</div>
            <div>y = x + F(x) = {formatVec(y)}</div>
            <div className="font-medium text-gray-700 mt-2">单块 Jacobian</div>
            <div className="font-mono text-xs">{formatMat(J)}</div>
            <div>Frobenius 范数: {matNorm(J).toFixed(4)}</div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm font-medium text-gray-700 mb-3">堆叠 L 块后的回传梯度范数（从输出 g=[1,0]）</div>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="w-24 text-sm text-blue-700">残差网络</span>
                <div className="flex-1 h-4 bg-gray-100 rounded overflow-hidden">
                  <div
                    className="h-full bg-blue-500"
                    style={{ width: `${Math.min(100, residualNorm * 20)}%` }}
                  />
                </div>
                <span className="w-20 text-right font-mono text-sm">{residualNorm.toFixed(3)}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-24 text-sm text-purple-700">无残差网络</span>
                <div className="flex-1 h-4 bg-gray-100 rounded overflow-hidden">
                  <div
                    className="h-full bg-purple-500"
                    style={{ width: `${Math.min(100, plainNorm * 20)}%` }}
                  />
                </div>
                <span className="w-20 text-right font-mono text-sm">{plainNorm.toFixed(3)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-700 bg-slate-50 p-4 rounded-lg border">
          <strong>观察结论：</strong>
          <ul className="list-disc list-inside space-y-1 mt-1">
            <li>残差 Jacobian 总是 <KaTeX math="I + \\partial F/\\partial x" />，特征值接近 1 时梯度稳定。</li>
            <li>普通网络的梯度是每层 Jacobian 的连乘，容易出现衰减或爆炸。</li>
            <li>如果 <KaTeX math="F(x) \\approx -x" />，残差块整体近似 0，梯度仍可能消失——残差连接不是万能药。</li>
          </ul>
        </div>
      </div>
    </InteractiveDemo>
  );
}
