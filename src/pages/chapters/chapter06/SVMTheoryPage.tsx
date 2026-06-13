import { useState, useMemo } from 'react';
import { ShieldAlert, BookOpen, CheckCircle2 } from 'lucide-react';
import KaTeX from '@/components/KaTeX';
import FormulaCard from '@/components/FormulaCard';

export default function SVMTheoryPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Header */}
      <section className="text-center py-8 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="text-sm font-medium text-blue-600 mb-2 tracking-wide uppercase">
          第六章 · 支持向量机
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">SVM 理论与算法</h1>
        <p className="text-gray-600 max-w-2xl mx-auto px-4">
          从优化问题到对偶问题，从 KKT 条件到 SMO 算法，本节将梳理 SVM 的完整理论脉络，
          并展示核技巧如何自然融入 SVM 框架。
        </p>

        {/* Copyright Notice */}
        <div className="mt-6 inline-flex items-center gap-2 bg-amber-50 border border-amber-300 rounded-lg px-5 py-3 max-w-3xl mx-auto">
          <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <span className="text-sm font-medium text-amber-800">
            © 版权声明：本课程内容仅供个人学习交流使用，采用 CC BY-NC 4.0 许可。未经授权，严禁以任何形式用于商业用途。
          </span>
        </div>
      </section>

      {/* Primal problem */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">原始优化问题</h2>
        </div>
        <p className="text-gray-700 mb-4">
          最大间隔分类器可以写成如下凸优化问题：
        </p>

        <FormulaCard
          title="SVM 原始问题"
          formula={
            <KaTeX
              math={String.raw`\min_{w, b} \; \frac{1}{2} \|w\|^2 \quad \text{s.t.} \quad y^{(i)}(w^T x^{(i)} + b) \ge 1, \; i = 1, \dots, m`}
              display
            />
          }
          description="约束条件要求所有样本的函数间隔至少为 1，目标是最小化 ||w||²，即最大化几何间隔。"
        />

        <p className="text-gray-700 mb-4">
          为了允许部分样本被误分类，引入松弛变量 <KaTeX math={String.raw`\xi_i`} /> 和惩罚参数 C：
        </p>

        <FormulaCard
          title="软间隔 SVM"
          formula={
            <KaTeX
              math={String.raw`\min_{w, b, \xi} \; \frac{1}{2} \|w\|^2 + C \sum_{i=1}^{m} \xi_i`}
              display
            />
          }
          description="C 越大，对误分类的惩罚越重，间隔越窄；C 越小，允许更多误分类，间隔更宽。"
        />
      </section>

      {/* Dual problem */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">对偶问题</h2>
        <p className="text-gray-700 mb-4">
          通过拉格朗日乘子法，可以得到 SVM 的对偶问题。对偶问题只涉及样本之间的内积，
          这为核技巧的应用打开了大门。
        </p>

        <FormulaCard
          title="SVM 对偶问题"
          formula={
            <KaTeX
              math={String.raw`\max_{\alpha} \; \sum_{i=1}^{m} \alpha_i - \frac{1}{2} \sum_{i,j=1}^{m} y^{(i)} y^{(j)} \alpha_i \alpha_j \langle x^{(i)}, x^{(j)} \rangle`}
              display
            />
          }
          description="约束条件：0 ≤ α_i ≤ C，且 Σ α_i y^(i) = 0。"
        />

        <FormulaCard
          title="决策函数"
          formula={
            <KaTeX
              math={String.raw`h_{w,b}(x) = \sum_{i=1}^{m} \alpha_i y^{(i)} \langle x^{(i)}, x \rangle + b`}
              display
            />
          }
          description="只有 α_i > 0 的样本才是支持向量。"
        />
      </section>

      {/* Kernel SVM */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">核 SVM</h2>
        <p className="text-gray-700 mb-4">
          对偶问题中的内积 <KaTeX math={String.raw`\langle x^{(i)}, x^{(j)} \rangle`} /> 可以直接替换为核函数 <KaTeX math={String.raw`K(x^{(i)}, x^{(j)})`} />：
        </p>

        <FormulaCard
          title="核 SVM 决策函数"
          formula={
            <KaTeX
              math={String.raw`h(x) = \sum_{i=1}^{m} \alpha_i y^{(i)} K(x^{(i)}, x) + b`}
              display
            />
          }
          description="这样就在高维特征空间中训练了线性 SVM，却不需要显式计算 φ(x)。"
        />
      </section>

      {/* Interactive demo */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">交互演示：C 参数与间隔宽度</h2>
        <p className="text-gray-700 mb-4">
          下面用一个简化的二维数据集演示软间隔 SVM 中 C 参数的作用。
          C 控制对误分类的惩罚强度：C 越大，间隔越窄，越不允许误分类；C 越小，间隔越宽，允许更多样本穿过间隔边界。
        </p>
        <SoftMarginDemo />
      </section>

      {/* SMO algorithm */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">SMO 算法</h2>
        <p className="text-gray-700 mb-4">
          SMO（Sequential Minimal Optimization）是求解 SVM 对偶问题的高效算法。
          它每次只优化两个拉格朗日乘子 <KaTeX math={String.raw`\alpha_i`} /> 和 <KaTeX math={String.raw`\alpha_j`} />，
          而将其他乘子固定。
        </p>

        <div className="bg-violet-50 rounded-lg p-4 border border-violet-200">
          <h3 className="font-semibold text-violet-800 mb-2">SMO 的核心步骤</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
            <li>选择一对违反 KKT 条件的乘子 α_i 和 α_j。</li>
            <li>在保持其他乘子不变的约束下，优化这两个乘子。</li>
            <li>更新阈值 b。</li>
            <li>重复直到所有乘子满足 KKT 条件。</li>
          </ol>
        </div>
      </section>

      {/* Summary */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
        <h3 className="text-lg font-bold text-blue-800 mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          小结
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">●</span>
            <span>SVM 原始问题是带约束的凸二次规划问题。</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">●</span>
            <span>对偶问题只涉及样本内积，便于引入核函数。</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">●</span>
            <span>软间隔参数 C 控制间隔宽度与误分类惩罚之间的权衡。</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">●</span>
            <span>SMO 算法通过每次优化两个乘子来高效求解对偶问题。</span>
          </li>
        </ul>
      </section>
    </div>
  );
}

function SoftMarginDemo() {
  const [cValue, setCValue] = useState(1.0);

  // Fixed dataset: linearly separable with some outliers
  const points = useMemo(
    () => [
      { x: 1.2, y: 2.5, label: 1 },
      { x: 1.8, y: 3.0, label: 1 },
      { x: 2.2, y: 2.0, label: 1 },
      { x: 2.8, y: 2.8, label: 1 },
      { x: 1.5, y: 3.5, label: 1 },
      { x: 3.5, y: 1.0, label: -1 },
      { x: 4.0, y: 0.8, label: -1 },
      { x: 4.5, y: 1.5, label: -1 },
      { x: 5.0, y: 0.5, label: -1 },
      { x: 3.8, y: 1.8, label: -1 },
      // A few outliers to show soft margin effect
      { x: 2.8, y: 1.3, label: -1 },
      { x: 3.2, y: 2.6, label: 1 },
    ],
    []
  );

  // Approximate decision boundary for visualization: shift based on C
  // For demonstration only, not computed from real SVM solver
  const boundaryShift = useMemo(() => {
    // Larger C => boundary closer to hard-margin (around x+y = 4.5)
    // Smaller C => boundary shifts to allow more slack (x+y = 4.2)
    return 4.5 - 0.4 / (1 + cValue);
  }, [cValue]);

  const width = 520;
  const height = 360;
  const padding = 40;
  const xMin = 0;
  const xMax = 6;
  const yMin = 0;
  const yMax = 4;

  const xScale = (x: number) => padding + ((x - xMin) / (xMax - xMin)) * (width - 2 * padding);
  const yScale = (y: number) => padding + (1 - (y - yMin) / (yMax - yMin)) * (height - 2 * padding);

  // Boundary line: x + y = boundaryShift => y = boundaryShift - x
  const boundaryPoints: { x: number; y: number }[] = [];
  const margin = 0.5 / Math.sqrt(cValue + 0.2); // visual margin width
  const marginPos: { x: number; y: number }[] = [];
  const marginNeg: { x: number; y: number }[] = [];

  for (let x = xMin; x <= xMax; x += 0.1) {
    const y = boundaryShift - x;
    if (y >= yMin && y <= yMax) boundaryPoints.push({ x, y });

    const yPos = boundaryShift - x + margin;
    const yNeg = boundaryShift - x - margin;
    if (yPos >= yMin && yPos <= yMax) marginPos.push({ x, y: yPos });
    if (yNeg >= yMin && yNeg <= yMax) marginNeg.push({ x, y: yNeg });
  }

  const pathD = boundaryPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xScale(p.x)} ${yScale(p.y)}`).join(' ');
  const pathPos = marginPos.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xScale(p.x)} ${yScale(p.y)}`).join(' ');
  const pathNeg = marginNeg.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xScale(p.x)} ${yScale(p.y)}`).join(' ');

  return (
    <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          软间隔参数 C = <span className="font-mono">{cValue.toFixed(2)}</span>
        </label>
        <input
          type="range"
          min={0.05}
          max={5}
          step={0.05}
          value={cValue}
          onChange={(e) => setCValue(Number(e.target.value))}
          className="w-full accent-blue-500"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>C 小：允许更多误分类，间隔宽</span>
          <span>C 大：惩罚更重，间隔窄</span>
        </div>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto bg-white rounded-lg border border-gray-200" style={{ maxHeight: 360 }}>
        {/* grid */}
        {[0, 1, 2, 3, 4, 5, 6].map((x) => (
          <line key={`v-${x}`} x1={xScale(x)} y1={yScale(yMin)} x2={xScale(x)} y2={yScale(yMax)} stroke="#e5e7eb" />
        ))}
        {[0, 1, 2, 3, 4].map((y) => (
          <line key={`h-${y}`} x1={xScale(xMin)} y1={yScale(y)} x2={xScale(xMax)} y2={yScale(y)} stroke="#e5e7eb" />
        ))}
        {/* axes */}
        <line x1={padding} y1={yScale(yMin)} x2={width - padding} y2={yScale(yMin)} stroke="#6b7280" strokeWidth={1.5} />
        <line x1={padding} y1={yScale(yMin)} x2={padding} y2={yScale(yMax)} stroke="#6b7280" strokeWidth={1.5} />
        {/* ticks */}
        {[0, 1, 2, 3, 4, 5, 6].map((x) => (
          <g key={`xt-${x}`}>
            <line x1={xScale(x)} y1={yScale(yMin)} x2={xScale(x)} y2={yScale(yMin) + 5} stroke="#6b7280" />
            <text x={xScale(x)} y={yScale(yMin) + 18} textAnchor="middle" fontSize={10} fill="#4b5563">{x}</text>
          </g>
        ))}
        {[0, 1, 2, 3, 4].map((y) => (
          <g key={`yt-${y}`}>
            <line x1={padding - 5} y1={yScale(y)} x2={padding} y2={yScale(y)} stroke="#6b7280" />
            <text x={padding - 8} y={yScale(y) + 3} textAnchor="end" fontSize={10} fill="#4b5563">{y}</text>
          </g>
        ))}

        {/* margin boundaries */}
        {pathPos && <path d={pathPos} fill="none" stroke="#93c5fd" strokeWidth={2} strokeDasharray="6,4" />}
        {pathNeg && <path d={pathNeg} fill="none" stroke="#93c5fd" strokeWidth={2} strokeDasharray="6,4" />}

        {/* decision boundary */}
        {pathD && <path d={pathD} fill="none" stroke="#2563eb" strokeWidth={3} />}

        {/* points */}
        {points.map((p, i) => (
          <circle
            key={i}
            cx={xScale(p.x)}
            cy={yScale(p.y)}
            r={6}
            fill={p.label === 1 ? '#10b981' : '#f43f5e'}
            stroke="white"
            strokeWidth={2}
          />
        ))}
      </svg>

      <div className="text-sm text-gray-600">
        提示：这是用于演示 C 参数影响的简化可视化。真实 SVM 的边界和间隔由二次规划求解器决定。
      </div>
    </div>
  );
}
