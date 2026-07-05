import SectionMetadata from '@/components/SectionMetadata';
import { useState, useCallback, useEffect, useRef, type ReactNode } from 'react';
import type React from 'react';
import { ShieldAlert, Target, CheckCircle2, RefreshCw, Play, SkipForward, MousePointer2 , Circle} from 'lucide-react';
import KaTeX from '@/components/KaTeX';
import FormulaCard from '@/components/FormulaCard';
import { Slider } from '@/components/ui/slider';

interface Point {
  x: number;
  y: number;
  cluster: number;
}

interface Centroid {
  x: number;
  y: number;
}

const WIDTH = 600;
const HEIGHT = 480;
const PADDING = 30;

function scaleX(val: number): number {
  return PADDING + (val / 10) * (WIDTH - 2 * PADDING);
}

function scaleY(val: number): number {
  return HEIGHT - PADDING - (val / 10) * (HEIGHT - 2 * PADDING);
}

function unscaleX(px: number): number {
  return ((px - PADDING) / (WIDTH - 2 * PADDING)) * 10;
}

function unscaleY(py: number): number {
  return ((HEIGHT - PADDING - py) / (HEIGHT - 2 * PADDING)) * 10;
}

function dist2(a: { x: number; y: number }, b: { x: number; y: number }): number {
  return Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2);
}

const palette = ['#2563eb', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

export default function KMeansPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <section className="text-center py-8 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="text-sm font-medium text-blue-600 mb-2 tracking-wide uppercase">
          第十章 · 聚类
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">K-means 算法</h1>
        <p className="text-gray-600 max-w-2xl mx-auto px-4">
          K-means 是最经典的聚类算法之一。它通过交替执行“分配样本到最近质心”和“更新质心为簇内均值”两个步骤，
          逐步最小化失真函数。
        </p>

        <p className="mt-6 text-sm text-amber-700 flex items-center justify-center gap-2"><ShieldAlert className="w-4 h-4" /> 本内容仅供教学与非商业学习使用，完整授权说明见页脚。</p>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Target className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">算法步骤</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">1. 初始化</h3>
            <p className="text-sm text-gray-700">
              随机选择 K 个样本作为初始质心，或手动指定。
            </p>
          </div>
          <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
            <h3 className="font-semibold text-emerald-800 mb-2">2. 分配步骤</h3>
            <p className="text-sm text-gray-700">
              每个样本被分配到距离最近的质心所在的簇。
            </p>
          </div>
          <div className="bg-violet-50 rounded-lg p-4 border border-violet-200">
            <h3 className="font-semibold text-violet-800 mb-2">3. 更新步骤</h3>
            <p className="text-sm text-gray-700">
              每个质心被更新为所在簇所有样本的均值坐标。
            </p>
          </div>
          <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
            <h3 className="font-semibold text-amber-800 mb-2">4. 收敛</h3>
            <p className="text-sm text-gray-700">
              重复分配与更新，直到质心位置不再变化或变化极小。
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">失真函数</h2>
        <p className="text-gray-700 mb-4">
          K-means 的目标函数被称为失真函数（distortion function），它是所有样本到其所属质心的欧氏距离平方和：
        </p>
        <FormulaCard
          title="失真函数"
          formula={
            <KaTeX
              math={String.raw`J(c, \mu) = \sum_{i=1}^n \bigl\|x^{(i)} - \mu_{c^{(i)}}\bigr\|^2`}
              display
            />
          }
          description="在有限样本且平局、空簇处理规则固定时，分配步骤和更新步骤都会使 J 单调不增，通常在有限次迭代后达到稳定分配；但结果依赖初始化，且只保证局部最优或固定点。"
        />
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">交互演示</h2>
        <p className="text-gray-700 mb-4">
          在画布上点击添加数据点，选择聚类数 K，然后逐步运行 K-means。观察质心如何移动以及失真函数如何下降。
        </p>
        <KMeansDemo />
      </section>

      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
        <h3 className="text-lg font-bold text-blue-800 mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          小结
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start gap-2">
            <Circle className="w-2 h-2 fill-current text-blue-500 mt-0.5 mt-1" />
            <span>K-means 交替执行分配与更新两步，最小化失真函数。</span>
          </li>
          <li className="flex items-start gap-2">
            <Circle className="w-2 h-2 fill-current text-blue-500 mt-0.5 mt-1" />
            <span>在规则固定时目标函数单调不增，通常在有限步后稳定；结果依赖于初始质心，只保证局部最优或固定点。</span>
          </li>
          <li className="flex items-start gap-2">
            <Circle className="w-2 h-2 fill-current text-blue-500 mt-0.5 mt-1" />
            <span>多次随机初始化并选择失真函数最小的结果是常用策略。</span>
          </li>
        </ul>
      </section>
    
      <SectionMetadata
        bishopChapter={"Ch 15"}
        bishopSection={"0.5"}
        learningObjectives={["理解 K Means Clustering 的核心概念与直观含义。", "掌握与本小节相关的关键公式与算法流程。", "能够在简单示例中应用所学方法并识别常见误区。"]}
        commonMistakes={["只记忆公式而忽略其背后的概率或优化假设。", "混淆相近概念的定义与适用场景。", "在应用时忽视数据分布与模型假设的匹配。"]}
        quiz={[
      {
        question: "关于“K Means Clustering”，下列说法最准确的是？",
        options: ["它是本小节需要掌握的核心主题。", "它与当前章节完全无关。", "它只适用于无限大数据集。", "它不需要任何数学基础。"],
        correctIndex: 0,
        explanation: "K Means Clustering 是本小节的核心内容，理解其动机、公式与应用场景是学习目标。",
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

/* -------------------------------------------------------------------------- */
/* 交互演示                                                                   */
/* -------------------------------------------------------------------------- */
function KMeansDemo() {
  const [points, setPoints] = useState<Point[]>(() => generateSampleData());
  const [centroids, setCentroids] = useState<Centroid[]>([]);
  const [k, setK] = useState(3);
  const [iterations, setIterations] = useState(0);
  const [distortion, setDistortion] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const runningRef = useRef(false);
  const pointsRef = useRef(points);
  const centroidsRef = useRef(centroids);

  useEffect(() => {
    pointsRef.current = points;
  }, [points]);

  useEffect(() => {
    centroidsRef.current = centroids;
  }, [centroids]);

  const generateRandomCentroids = useCallback((pts: Point[], count: number): Centroid[] => {
    if (pts.length < count) return [];
    const copy = [...pts];
    // Fisher-Yates shuffle 取前 count 个
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, count).map((p) => ({ x: p.x, y: p.y }));
  }, []);

  const assignStep = useCallback((pts: Point[], cents: Centroid[]): Point[] => {
    return pts.map((p) => {
      let best = 0;
      let bestDist = Infinity;
      cents.forEach((c, idx) => {
        const d = dist2(p, c);
        if (d < bestDist) {
          bestDist = d;
          best = idx;
        }
      });
      return { ...p, cluster: best };
    });
  }, []);

  const updateStep = useCallback((pts: Point[], cents: Centroid[]): Centroid[] => {
    return cents.map((_, idx) => {
      const clusterPoints = pts.filter((p) => p.cluster === idx);
      if (clusterPoints.length === 0) return cents[idx];
      return {
        x: clusterPoints.reduce((sum, p) => sum + p.x, 0) / clusterPoints.length,
        y: clusterPoints.reduce((sum, p) => sum + p.y, 0) / clusterPoints.length,
      };
    });
  }, []);

  const computeDistortion = useCallback((pts: Point[], cents: Centroid[]): number => {
    return pts.reduce((sum, p) => sum + dist2(p, cents[p.cluster]), 0);
  }, []);

  const reset = useCallback(() => {
    const cents = generateRandomCentroids(points, k);
    const assigned = assignStep(points, cents);
    setCentroids(cents);
    setPoints(assigned);
    setIterations(0);
    setDistortion(computeDistortion(assigned, cents));
  }, [points, k, generateRandomCentroids, assignStep, computeDistortion]);

  const doOneStep = useCallback(() => {
    const currentPoints = pointsRef.current;
    const currentCentroids = centroidsRef.current;
    if (currentCentroids.length === 0) return;
    const newCentroids = updateStep(currentPoints, currentCentroids);
    const newPoints = assignStep(currentPoints, newCentroids);
    setCentroids(newCentroids);
    setPoints(newPoints);
    setDistortion(computeDistortion(newPoints, newCentroids));
    setIterations((it) => it + 1);
  }, [assignStep, updateStep, computeDistortion]);

  useEffect(() => {
    if (!isRunning) {
      runningRef.current = false;
      return;
    }
    runningRef.current = true;
    const interval = setInterval(() => {
      if (!runningRef.current) {
        clearInterval(interval);
        return;
      }
      doOneStep();
    }, 600);
    return () => clearInterval(interval);
  }, [isRunning, doOneStep]);

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isRunning) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = unscaleX(e.clientX - rect.left);
    const y = unscaleY(e.clientY - rect.top);
    if (x < 0 || x > 10 || y < 0 || y > 10) return;
    setPoints((prev) => [...prev, { x, y, cluster: 0 }]);
    setCentroids([]);
    setIterations(0);
    setDistortion(0);
  };

  const regenerateData = () => {
    if (isRunning) setIsRunning(false);
    const newPoints = generateSampleData();
    setPoints(newPoints);
    setCentroids([]);
    setIterations(0);
    setDistortion(0);
  };

  const clearPoints = () => {
    if (isRunning) setIsRunning(false);
    setPoints([]);
    setCentroids([]);
    setIterations(0);
    setDistortion(0);
  };

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-1 space-y-5">
          <ControlRow label={`聚类数 K: ${k}`}>
            <Slider value={[k]} min={2} max={8} step={1} onValueChange={(v) => setK(v[0])} />
          </ControlRow>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={reset}
              disabled={points.length < k}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 transition-colors text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              重置质心
            </button>
            <button
              onClick={doOneStep}
              disabled={centroids.length === 0 || isRunning}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-300 transition-colors text-sm"
            >
              <SkipForward className="w-4 h-4" />
              下一步
            </button>
            <button
              onClick={() => setIsRunning((r) => !r)}
              disabled={centroids.length === 0}
              className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-white transition-colors text-sm ${
                isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-violet-600 hover:bg-violet-700'
              } disabled:bg-gray-300`}
            >
              <Play className="w-4 h-4" />
              {isRunning ? '暂停' : '自动运行'}
            </button>
            <button
              onClick={regenerateData}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
            >
              <MousePointer2 className="w-4 h-4" />
              随机数据
            </button>
          </div>

          <button
            onClick={clearPoints}
            className="w-full px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            清空画布
          </button>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-600">样本数:</span>
              <span className="font-mono font-medium text-gray-700">{points.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">迭代次数:</span>
              <span className="font-mono font-medium text-gray-700">{iterations}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">失真函数 J:</span>
              <span className="font-mono font-medium text-blue-700">{distortion.toFixed(6)}</span>
            </div>
          </div>

          <div className="text-xs text-gray-500 flex items-start gap-2">
            <MousePointer2 className="w-4 h-4 flex-shrink-0" />
            点击画布可手动添加数据点。选择 K 后点击“重置质心”开始算法。
          </div>
        </div>

        <div className="md:col-span-2 overflow-x-auto">
          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            className="w-full min-w-[360px] border border-gray-200 rounded-lg bg-white cursor-crosshair"
            style={{ maxHeight: 480 }}
            onClick={handleSvgClick}
          >
            {/* 网格 */}
            {Array.from({ length: 11 }, (_, i) => i).map((i) => (
              <g key={`grid-${i}`}>
                <line x1={scaleX(i)} y1={scaleY(0)} x2={scaleX(i)} y2={scaleY(10)} stroke="#e5e7eb" strokeWidth={1} />
                <line x1={scaleX(0)} y1={scaleY(i)} x2={scaleX(10)} y2={scaleY(i)} stroke="#e5e7eb" strokeWidth={1} />
              </g>
            ))}

            {/* 数据点 */}
            {points.map((p, i) => (
              <circle
                key={`pt-${i}`}
                cx={scaleX(p.x)}
                cy={scaleY(p.y)}
                r={centroids.length > 0 ? 6 : 4}
                fill={centroids.length > 0 ? palette[p.cluster % palette.length] : '#6b7280'}
                opacity={0.75}
                stroke="white"
                strokeWidth={1}
              />
            ))}

            {/* 质心 */}
            {centroids.map((c, i) => (
              <g key={`centroid-${i}`}>
                <line x1={scaleX(c.x) - 8} y1={scaleY(c.y)} x2={scaleX(c.x) + 8} y2={scaleY(c.y)} stroke="#1f2937" strokeWidth={2} />
                <line x1={scaleX(c.x)} y1={scaleY(c.y) - 8} x2={scaleX(c.x)} y2={scaleY(c.y) + 8} stroke="#1f2937" strokeWidth={2} />
                <circle cx={scaleX(c.x)} cy={scaleY(c.y)} r={10} fill="none" stroke={palette[i % palette.length]} strokeWidth={2} strokeDasharray="4 2" />
              </g>
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}

function generateSampleData(): Point[] {
  const clusters: { cx: number; cy: number; n: number }[] = [
    { cx: 2.5, cy: 2.5, n: 25 },
    { cx: 7, cy: 3, n: 25 },
    { cx: 5, cy: 7, n: 25 },
  ];
  const points: Point[] = [];
  let s = 12345;
  for (const cl of clusters) {
    for (let i = 0; i < cl.n; i++) {
      s = (s * 9301 + 49297) % 233280;
      const u1 = s / 233280;
      s = (s * 9301 + 49297) % 233280;
      const u2 = s / 233280;
      const z1 = Math.sqrt(-2 * Math.log(Math.max(1e-10, u1))) * Math.cos(2 * Math.PI * u2);
      const z2 = Math.sqrt(-2 * Math.log(Math.max(1e-10, u1))) * Math.sin(2 * Math.PI * u2);
      points.push({
        x: Math.max(0, Math.min(10, cl.cx + z1 * 0.9)),
        y: Math.max(0, Math.min(10, cl.cy + z2 * 0.9)),
        cluster: 0,
      });
    }
  }
  return points;
}

function ControlRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      {children}
    </div>
  );
}
