import SectionMetadata from '@/components/SectionMetadata';
import { useState, useMemo } from 'react';
import { ChartSpline, Move, Maximize2, ShieldAlert, BookOpen } from 'lucide-react';
import KaTeX from '../../../components/KaTeX';
import FormulaCard from '../../../components/FormulaCard';
import ConceptCard from '../../../components/ConceptCard';
import InteractiveDemo from '../../../components/InteractiveDemo';
import InteractivePanel from '../../../components/InteractivePanel';

export default function MultivariateGaussianPage() {
  const [sigmaX, setSigmaX] = useState(1.5);
  const [sigmaY, setSigmaY] = useState(1.0);
  const [rho, setRho] = useState(0.5);

  const cov = useMemo(() => {
    return {
      xx: sigmaX * sigmaX,
      yy: sigmaY * sigmaY,
      xy: rho * sigmaX * sigmaY,
    };
  }, [sigmaX, sigmaY, rho]);

  const { angle, lambda1, lambda2 } = useMemo(() => {
    const a = cov.xx;
    const b = cov.xy;
    const c = cov.yy;
    const trace = a + c;
    const gap = Math.sqrt(((a - c) / 2) ** 2 + b * b);
    const l1 = trace / 2 + gap;
    const l2 = trace / 2 - gap;
    const theta = 0.5 * Math.atan2(2 * b, a - c);
    return { angle: theta, lambda1: l1, lambda2: l2 };
  }, [cov]);

  // Shared extent for x and y axes; keeps aspect ratio 1:1.
  const extent = Math.max(sigmaX, sigmaY) * 4 + 1;
  const levels = [1, 4, 9];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Hero */}
      <section className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center">
            <ChartSpline className="w-9 h-9 text-indigo-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">3.2 多元高斯</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          多元高斯分布是深度学习中连续随机变量的主角。它的形状完全由均值向量和协方差矩阵决定，
          协方差矩阵的特征结构揭示了分布的“椭圆几何”。
        </p>
        <p className="mt-6 text-sm text-amber-800 flex items-center justify-center gap-1">
          <ShieldAlert className="w-4 h-4" />
          本页为依据 Bishop & Bishop 教材知识体系制作的原创教学解释与交互演示。教材原文、原图及习题解答版权归原作者和出版方所有。
        </p>
      </section>

      {/* Formula & concepts */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-6 h-6 text-indigo-600" />
          <h2 className="text-2xl font-bold text-gray-900">二维高斯分布</h2>
        </div>
        <FormulaCard
          title="概率密度函数"
          formula={
            <KaTeX
              math={String.raw`p(\mathbf{x}\mid\boldsymbol{\mu},\boldsymbol{\Sigma})=\frac{1}{(2\pi)^{D/2}|\boldsymbol{\Sigma}|^{1/2}}\exp\!\left\{-\frac{1}{2}(\mathbf{x}-\boldsymbol{\mu})^T\boldsymbol{\Sigma}^{-1}(\mathbf{x}-\boldsymbol{\mu})\right\}`}
              display
            />
          }
          description={
            <>
              当 D=2 时，等概率密度线是一族同心椭圆，中心为均值 <KaTeX math={String.raw`\boldsymbol{\mu}`} />，
              形状由协方差矩阵 <KaTeX math={String.raw`\boldsymbol{\Sigma}`} /> 决定。
            </>
          }
        />
        <div className="grid md:grid-cols-3 gap-4 mt-4">
          <ConceptCard
            icon={<Maximize2 className="w-5 h-5" />}
            title="协方差矩阵"
            description={
              <>
                <KaTeX math={String.raw`\boldsymbol{\Sigma}=\begin{bmatrix}\sigma_x^2&\rho\sigma_x\sigma_y\\\rho\sigma_x\sigma_y&\sigma_y^2\end{bmatrix}`} />
                。对角线是方差，非对角线衡量变量间的线性相关性。
              </>
            }
          />
          <ConceptCard
            icon={<Move className="w-5 h-5" />}
            title="主轴与旋转"
            description={
              <>
                椭圆的长、短轴方向由 <KaTeX math={String.raw`\boldsymbol{\Sigma}`} /> 的特征向量决定，
                轴长与特征值的平方根成正比。
              </>
            }
          />
          <ConceptCard
            icon={<ChartSpline className="w-5 h-5" />}
            title="相关系数 ρ"
            description={
              <>
                <KaTeX math={String.raw`\rho`} /> 越接近 ±1，椭圆越“扁”；
                <KaTeX math={String.raw`\rho=0`} /> 时椭圆主轴与坐标轴对齐。
              </>
            }
          />
        </div>
      </section>

      {/* Interactive demo */}
      <InteractiveDemo title="交互演示：协方差如何改变椭圆">
        <p className="text-gray-700 mb-4">
          调整两个标准差 <KaTeX math={String.raw`\sigma_x,\sigma_y`} /> 与相关系数{' '}
          <KaTeX math={String.raw`\rho`} />，观察二维高斯等概率密度椭圆的变化。
        </p>
        <InteractivePanel
          hint="三条等高线分别对应马氏距离的平方 c = 1, 4, 9（约 1σ、2σ、3σ）。"
          chart={
            <svg
              viewBox={`-${extent} -${extent} ${2 * extent} ${2 * extent}`}
              className="w-full h-auto"
              style={{ maxHeight: 420 }}
            >
              {/* grid */}
              <rect
                x={-extent}
                y={-extent}
                width={2 * extent}
                height={2 * extent}
                fill="#f8fafc"
              />
              {/* axes */}
              <line
                x1={-extent}
                y1={0}
                x2={extent}
                y2={0}
                stroke="#9ca3af"
                strokeWidth={0.08}
              />
              <line
                x1={0}
                y1={-extent}
                x2={0}
                y2={extent}
                stroke="#9ca3af"
                strokeWidth={0.08}
              />
              {/* contours */}
              {levels.map((c, idx) => {
                const rx = Math.sqrt(c * lambda1);
                const ry = Math.sqrt(c * lambda2);
                const deg = (angle * 180) / Math.PI;
                return (
                  <ellipse
                    key={c}
                    cx={0}
                    cy={0}
                    rx={rx}
                    ry={ry}
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth={0.08 + idx * 0.04}
                    opacity={0.9 - idx * 0.18}
                    transform={`rotate(${deg.toFixed(2)})`}
                  />
                );
              })}
              {/* mean dot */}
              <circle cx={0} cy={0} r={0.12} fill="#4f46e5" />
              <text x={0.25} y={-0.25} fontSize={0.35} fill="#4f46e5">
                μ
              </text>
            </svg>
          }
          controls={
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <KaTeX math={String.raw`\sigma_x`} /> ={' '}
                  <span className="font-mono text-blue-700">{sigmaX.toFixed(1)}</span>
                </label>
                <input
                  type="range"
                  min={0.5}
                  max={3}
                  step={0.1}
                  value={sigmaX}
                  onChange={(e) => setSigmaX(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <KaTeX math={String.raw`\sigma_y`} /> ={' '}
                  <span className="font-mono text-blue-700">{sigmaY.toFixed(1)}</span>
                </label>
                <input
                  type="range"
                  min={0.5}
                  max={3}
                  step={0.1}
                  value={sigmaY}
                  onChange={(e) => setSigmaY(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  相关系数 ρ = <span className="font-mono text-blue-700">{rho.toFixed(2)}</span>
                </label>
                <input
                  type="range"
                  min={-0.95}
                  max={0.95}
                  step={0.05}
                  value={rho}
                  onChange={(e) => setRho(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>
              <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200 space-y-1 text-sm text-indigo-900">
                <p>
                  <KaTeX math={String.raw`\sigma_{xy}=\rho\sigma_x\sigma_y`} /> ={' '}
                  <span className="font-mono font-semibold">{cov.xy.toFixed(3)}</span>
                </p>
                <p>
                  旋转角 θ = <span className="font-mono font-semibold">{((angle * 180) / Math.PI).toFixed(1)}°</span>
                </p>
                <p>
                  特征值 λ₁, λ₂ ={' '}
                  <span className="font-mono font-semibold">
                    {lambda1.toFixed(2)}, {lambda2.toFixed(2)}
                  </span>
                </p>
              </div>
            </div>
          }
        />
        <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
          <h4 className="font-semibold text-indigo-800 mb-2">相关系数如何改变形状？</h4>
          <p className="text-sm text-gray-700">
            当 <KaTeX math={String.raw`\rho>0`} /> 时，椭圆沿 <KaTeX math={String.raw`y=x`} /> 方向倾斜；
            当 <KaTeX math={String.raw`\rho<0`} /> 时，沿 <KaTeX math={String.raw`y=-x`} /> 方向倾斜。
            <KaTeX math={String.raw`|\rho|`} /> 越接近 1，椭圆越狭长，说明两个变量有很强的线性关系；
            <KaTeX math={String.raw`\rho=0`} /> 时椭圆主轴与坐标轴平行。
          </p>
        </div>
      </InteractiveDemo>
    
      <SectionMetadata
        bishopChapter={"Ch 3"}
        bishopSection={"mvgaussian"}
        learningObjectives={["理解 Mvgaussian 的核心概念与直观含义。", "掌握与本小节相关的关键公式与算法流程。", "能够在简单示例中应用所学方法并识别常见误区。"]}
        commonMistakes={["只记忆公式而忽略其背后的概率或优化假设。", "混淆相近概念的定义与适用场景。", "在应用时忽视数据分布与模型假设的匹配。"]}
        quiz={[
      {
        question: "关于“Mvgaussian”，下列说法最准确的是？",
        options: ["它是本小节需要掌握的核心主题。", "它与当前章节完全无关。", "它只适用于无限大数据集。", "它不需要任何数学基础。"],
        correctIndex: 0,
        explanation: "Mvgaussian 是本小节的核心内容，理解其动机、公式与应用场景是学习目标。",
      },
      {
        question: "学习本小节时，最重要的提醒是什么？",
        options: ["只看结论，忽略推导。", "理解概念背后的直觉与假设。", "直接套用代码，不必关心理论。", "只记忆英文术语。"],
        correctIndex: 1,
        explanation: "理解直觉和假设有助于在遇到新问题时正确选择与扩展方法。",
      }
        ]}
      />
</div>
  );
}
