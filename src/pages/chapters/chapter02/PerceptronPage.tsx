import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import * as d3 from 'd3';
import { ShieldAlert, ExternalLink, Play, Pause, RotateCcw, StepForward, Sparkles } from 'lucide-react';
import KaTeX from '@/components/KaTeX';
import FormulaCard from '@/components/FormulaCard';

// ─── Types ───────────────────────────────────────────────────────────
interface DataPoint {
  x1: number;
  x2: number;
  y: number; // 0 or 1
}

interface Theta {
  t0: number;
  t1: number;
  t2: number;
}

// ─── Demo Constants ──────────────────────────────────────────────────
const MARGIN = { top: 20, right: 30, bottom: 50, left: 60 };
const WIDTH = 560 - MARGIN.left - MARGIN.right;
const HEIGHT = 420 - MARGIN.top - MARGIN.bottom;

const X_DOMAIN = [-6, 6];
const Y_DOMAIN = [-6, 6];

// ─── Generate Linearly Separable 2D Data ─────────────────────────────
function generateData(seed = 0): DataPoint[] {
  const points: DataPoint[] = [];
  const rng = d3.randomLcg(seed);
  const rand = d3.randomNormal.source(rng)(0, 1);

  const trueTheta: Theta = { t0: 0.5, t1: -1, t2: 1 }; // boundary: x2 = x1 - 0.5

  for (let i = 0; i < 40; i++) {
    const x1 = rng() * 10 - 5; // uniform [-5, 5]
    const x2 = rng() * 10 - 5;
    const z = trueTheta.t0 + trueTheta.t1 * x1 + trueTheta.t2 * x2;
    // keep points reasonably separated but not too far from boundary
    if (Math.abs(z) < 0.3) continue;
    const y = z > 0 ? 1 : 0;
    points.push({ x1, x2, y });
  }

  // add a few noisy points near boundary to make it interesting
  for (let i = 0; i < 10; i++) {
    const x1 = rng() * 8 - 4;
    const x2 = x1 - 0.5 + rand() * 1.5;
    const z = trueTheta.t0 + trueTheta.t1 * x1 + trueTheta.t2 * x2;
    const y = z > 0 ? 1 : 0;
    points.push({ x1, x2, y });
  }

  return points.slice(0, 50);
}

// ─── Perceptron Learning Algorithm ───────────────────────────────────
function runPerceptron(
  data: DataPoint[],
  alpha: number,
  theta0: Theta = { t0: 0, t1: 0, t2: 0 },
  maxEpochs = 100,
): Theta[] {
  const history: Theta[] = [{ ...theta0 }];
  const theta = { ...theta0 };

  for (let epoch = 0; epoch < maxEpochs; epoch++) {
    let errors = 0;
    // shuffle data each epoch for more dynamic visualization
    const shuffled = d3.shuffle([...data]);
    for (const p of shuffled) {
      const z = theta.t0 * 1 + theta.t1 * p.x1 + theta.t2 * p.x2;
      const h = z >= 0 ? 1 : 0;
      if (h !== p.y) {
        errors++;
        const err = p.y - h; // +1 or -1
        theta.t0 += alpha * err * 1;
        theta.t1 += alpha * err * p.x1;
        theta.t2 += alpha * err * p.x2;
        history.push({ ...theta });
      }
    }
    if (errors === 0) break;
  }

  return history;
}

// ─── Component ───────────────────────────────────────────────────────
export default function PerceptronPage() {
  const [alpha, setAlpha] = useState(0.1);
  const [seed, setSeed] = useState(1);
  const [history, setHistory] = useState<Theta[]>([{ t0: 0, t1: 0, t2: 0 }]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const animRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const chartRef = useRef<HTMLDivElement>(null);

  const data = useMemo(() => generateData(seed), [seed]);

  // Re-run perceptron when data or alpha changes
  useEffect(() => {
    const newHistory = runPerceptron(data, alpha);
    setHistory(newHistory);
    setCurrentStep(0);
    setIsPlaying(false);
  }, [data, alpha]);

  // ─── D3 Chart ──────────────────────────────────────────────────────
  const drawChart = useCallback(() => {
    if (!chartRef.current) return;
    const container = chartRef.current;
    container.innerHTML = '';

    const svg = d3
      .select(container)
      .append('svg')
      .attr('width', WIDTH + MARGIN.left + MARGIN.right)
      .attr('height', HEIGHT + MARGIN.top + MARGIN.bottom)
      .append('g')
      .attr('transform', `translate(${MARGIN.left},${MARGIN.top})`);

    const xScale = d3.scaleLinear().domain(X_DOMAIN).range([0, WIDTH]);
    const yScale = d3.scaleLinear().domain(Y_DOMAIN).range([HEIGHT, 0]);

    // Grid lines
    const xGrid = svg
      .append('g')
      .attr('transform', `translate(0,${HEIGHT})`)
      .call(d3.axisBottom(xScale).ticks(10).tickSize(-HEIGHT).tickFormat(() => ''));
    xGrid.selectAll('line').attr('stroke', '#e5e7eb').attr('stroke-dasharray', '2,2');
    xGrid.select('.domain').remove();

    const yGrid = svg
      .append('g')
      .call(d3.axisLeft(yScale).ticks(10).tickSize(-WIDTH).tickFormat(() => ''));
    yGrid.selectAll('line').attr('stroke', '#e5e7eb').attr('stroke-dasharray', '2,2');
    yGrid.select('.domain').remove();

    // Axes
    svg
      .append('g')
      .attr('transform', `translate(0,${HEIGHT})`)
      .call(d3.axisBottom(xScale).ticks(10))
      .append('text')
      .attr('x', WIDTH / 2)
      .attr('y', 40)
      .attr('fill', '#374151')
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .style('text-anchor', 'middle')
      .text('x₁');

    svg
      .append('g')
      .call(d3.axisLeft(yScale).ticks(10))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -HEIGHT / 2)
      .attr('y', -45)
      .attr('fill', '#374151')
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .style('text-anchor', 'middle')
      .text('x₂');

    // True decision boundary (dashed green)
    const trueBoundaryX = [X_DOMAIN[0], X_DOMAIN[1]];
    const trueBoundaryY = trueBoundaryX.map((x1) => x1 - 0.5);
    const trueLine = d3
      .line<[number, number]>()
      .x((d) => xScale(d[0]))
      .y((d) => yScale(d[1]));

    svg
      .append('path')
      .datum(d3.zip(trueBoundaryX, trueBoundaryY) as [number, number][])
      .attr('fill', 'none')
      .attr('stroke', '#10b981')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '6,4')
      .attr('opacity', 0.7)
      .attr('d', trueLine);

    // Current decision boundary
    const theta = history[Math.min(currentStep, history.length - 1)];
    const boundaryX = [X_DOMAIN[0], X_DOMAIN[1]];
    let boundaryY: [number, number] = [0, 0];
    if (Math.abs(theta.t2) > 1e-6) {
      boundaryY = boundaryX.map((x1) => -(theta.t0 + theta.t1 * x1) / theta.t2) as [number, number];
    } else {
      boundaryY = [yScale.invert(0), yScale.invert(HEIGHT)];
    }

    const boundaryLine = d3
      .line<[number, number]>()
      .x((d) => xScale(d[0]))
      .y((d) => yScale(d[1]));

    svg
      .append('path')
      .datum(d3.zip(boundaryX, boundaryY) as [number, number][])
      .attr('fill', 'none')
      .attr('stroke', '#2563eb')
      .attr('stroke-width', 3)
      .attr('d', boundaryLine);

    // Data points
    svg
      .selectAll('.data-point')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'data-point')
      .attr('cx', (d) => xScale(d.x1))
      .attr('cy', (d) => yScale(d.x2))
      .attr('r', (d) => {
        const z = theta.t0 + theta.t1 * d.x1 + theta.t2 * d.x2;
        const h = z >= 0 ? 1 : 0;
        return h === d.y ? 5 : 7;
      })
      .attr('fill', (d) => (d.y === 1 ? '#f97316' : '#3b82f6'))
      .attr('stroke', (d) => {
        const z = theta.t0 + theta.t1 * d.x1 + theta.t2 * d.x2;
        const h = z >= 0 ? 1 : 0;
        return h === d.y ? 'transparent' : '#dc2626';
      })
      .attr('stroke-width', 2)
      .attr('opacity', 0.85);

    // Legend
    const legend = svg.append('g').attr('transform', 'translate(10, 10)');
    legend
      .append('rect')
      .attr('width', 180)
      .attr('height', 78)
      .attr('rx', 8)
      .attr('fill', 'white')
      .attr('stroke', '#e5e7eb');

    legend.append('circle').attr('cx', 14).attr('cy', 18).attr('r', 5).attr('fill', '#f97316');
    legend
      .append('text')
      .attr('x', 26)
      .attr('y', 22)
      .attr('font-size', '11')
      .attr('fill', '#374151')
      .text('正类 (y = 1)');

    legend.append('circle').attr('cx', 14).attr('cy', 38).attr('r', 5).attr('fill', '#3b82f6');
    legend
      .append('text')
      .attr('x', 26)
      .attr('y', 42)
      .attr('font-size', '11')
      .attr('fill', '#374151')
      .text('负类 (y = 0)');

    legend
      .append('line')
      .attr('x1', 8)
      .attr('y1', 60)
      .attr('x2', 28)
      .attr('y2', 60)
      .attr('stroke', '#2563eb')
      .attr('stroke-width', 3);
    legend
      .append('text')
      .attr('x', 34)
      .attr('y', 64)
      .attr('font-size', '11')
      .attr('fill', '#374151')
      .text('当前决策边界');

    // Title
    svg
      .append('text')
      .attr('x', WIDTH / 2)
      .attr('y', -5)
      .attr('text-anchor', 'middle')
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .attr('fill', '#1a3a5c')
      .text('感知机决策边界与训练样本');
  }, [data, history, currentStep]);

  useEffect(() => {
    drawChart();
  }, [drawChart]);

  // ─── Animation ─────────────────────────────────────────────────────
  const animate = useCallback(
    (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const elapsed = timestamp - lastTimeRef.current;
      const frameInterval = 400 / speed;

      if (elapsed >= frameInterval) {
        lastTimeRef.current = timestamp;
        setCurrentStep((prev) => {
          if (prev >= history.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }

      if (isPlaying) {
        animRef.current = requestAnimationFrame(animate);
      }
    },
    [isPlaying, history.length, speed],
  );

  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = 0;
      animRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying, animate]);

  const playAnimation = () => {
    if (currentStep >= history.length - 1) setCurrentStep(0);
    setIsPlaying(true);
  };

  const pauseAnimation = () => setIsPlaying(false);

  const resetAnimation = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  const stepForward = () => {
    setIsPlaying(false);
    setCurrentStep((prev) => Math.min(prev + 1, history.length - 1));
  };

  const regenerateData = () => {
    setSeed((s) => s + 1);
  };

  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentStep(Number(e.target.value));
    setIsPlaying(false);
  };

  const currentTheta = history[Math.min(currentStep, history.length - 1)];

  const accuracy = useMemo(() => {
    let correct = 0;
    data.forEach((p) => {
      const z = currentTheta.t0 + currentTheta.t1 * p.x1 + currentTheta.t2 * p.x2;
      const h = z >= 0 ? 1 : 0;
      if (h === p.y) correct++;
    });
    return data.length > 0 ? correct / data.length : 0;
  }, [data, currentTheta]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* ─── Header ──────────────────────────────────────────────────── */}
      <section className="text-center py-8 bg-white rounded-2xl shadow-sm border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">感知机学习算法</h1>
        <p className="text-gray-600 max-w-2xl mx-auto px-4">
          Perceptron Learning Algorithm —— 二分类问题的线性分类器与在线学习规则
        </p>
      </section>

      {/* ─── Copyright Banner ────────────────────────────────────────── */}
      <section className="rounded-xl border border-amber-200 bg-amber-50/60 p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="font-semibold text-amber-900">版权声明</p>
              <p className="text-sm text-amber-800">
                本课程内容仅供个人学习交流使用，未经授权严禁用于商业用途。
              </p>
            </div>
          </div>
          <a
            href="https://github.com/GeorgeC77/machine-learning-interactive-web/blob/main/LICENSE"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-700 hover:bg-amber-500/20 transition-colors text-sm font-medium"
          >
            <span>© CC BY-NC 4.0 · 非商业用途</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
        <div className="mt-4 text-xs text-amber-800/80 leading-relaxed">
          转载或引用请注明出处并遵守{' '}
          <a
            href="https://creativecommons.org/licenses/by-nc/4.0/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-700 underline hover:text-amber-900"
          >
            CC BY-NC 4.0
          </a>{' '}
          许可协议。违者将依法追究法律责任。
        </div>
      </section>

      {/* ─── Perceptron Hypothesis ───────────────────────────────────── */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">感知机假设函数</h2>
        <p className="text-gray-700 mb-4 leading-relaxed">
          感知机（Perceptron）是一种二分类线性模型。给定输入特征向量{' '}
          <KaTeX math={String.raw`x = \begin{bmatrix} x_0 \ x_1 \ \vdots \ x_n \end{bmatrix}`} />{' '}
          （其中 <KaTeX math={String.raw`x_0 = 1`} /> 为偏置项），感知机的假设函数为：
        </p>

        <FormulaCard
          title="感知机假设"
          formula={
            <KaTeX
              math={String.raw`h_\theta(x) = g(\theta^T x) \quad \text{其中} \quad g(z) = \begin{cases} 1 & \text{if } z \geq 0 \ 0 & \text{if } z < 0 \end{cases}`}
              display
            />
          }
          description="阈值函数 g 将线性组合 θᵀx 的符号映射为类别标签：非负为 1，负为 0。"
        />

        <div className="mt-4 space-y-3">
          <div className="p-3 bg-gray-50 rounded-lg">
            <strong className="text-gray-800">
              <KaTeX math={String.raw`\theta^T x = 0`} />
            </strong>
            <span className="text-gray-700 ml-2">
              定义了特征空间中的决策边界（decision boundary），将空间划分为正类区域与负类区域。
            </span>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <strong className="text-gray-800">
              <KaTeX math={String.raw`g(z)`} />
            </strong>
            <span className="text-gray-700 ml-2">
              是一个阶跃函数（step function），输出仅取决于 z 的符号，而不是其大小。
            </span>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-2">二维情形</h3>
          <p className="text-gray-700 mb-2">
            当只有两个特征时，决策边界是一条直线：
          </p>
          <div className="formula-block">
            <KaTeX math={String.raw`\theta_0 + \theta_1 x_1 + \theta_2 x_2 = 0 \quad \Longleftrightarrow \quad x_2 = -\frac{\theta_0 + \theta_1 x_1}{\theta_2}`} display />
          </div>
          <p className="text-gray-700 text-sm">
            这条直线把平面分成两半：直线上方满足 <KaTeX math={String.raw`\theta^T x > 0`} /> 预测为 1，
            下方满足 <KaTeX math={String.raw`\theta^T x < 0`} /> 预测为 0。
          </p>
        </div>
      </section>
