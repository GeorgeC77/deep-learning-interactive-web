import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { Slider } from '@/components/ui/slider';
import { Ruler, TrendingUp, Mountain } from 'lucide-react';
import KaTeX from '../components/KaTeX';
import FormulaCard from '../components/FormulaCard';

/* ── D3 scatter plot + adjustable line ── */
interface DataPoint {
  x: number;
  y: number;
}

const MARGIN = { top: 20, right: 20, bottom: 40, left: 50 };
const WIDTH = 600;
const HEIGHT = 400;
const INNER_W = WIDTH - MARGIN.left - MARGIN.right;
const INNER_H = HEIGHT - MARGIN.top - MARGIN.bottom;

function generateData(): DataPoint[] {
  const points: DataPoint[] = [];
  for (let i = 0; i < 20; i++) {
    const x = Math.random() * 10;
    const noise = (Math.random() - 0.5) * 4;
    const y = 2 * x + 1 + noise;
    points.push({ x, y });
  }
  return points;
}

function drawScatter(
  svgEl: SVGSVGElement,
  data: DataPoint[],
  theta0: number,
  theta1: number,
) {
  const svg = svgEl;
  // clear
  while (svg.firstChild) svg.removeChild(svg.firstChild);

  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  g.setAttribute('transform', `translate(${MARGIN.left},${MARGIN.top})`);
  svg.appendChild(g);

  // scales
  const xMax = 10;
  const yMin = Math.min(-2, ...data.map((d) => d.y));
  const yMax = Math.max(22, ...data.map((d) => d.y));

  const xScale = (x: number) => (x / xMax) * INNER_W;
  const yScale = (y: number) => INNER_H - ((y - yMin) / (yMax - yMin)) * INNER_H;

  // grid lines
  const xGrid = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  for (let i = 0; i <= 10; i += 2) {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', String(xScale(i)));
    line.setAttribute('y1', String(0));
    line.setAttribute('x2', String(xScale(i)));
    line.setAttribute('y2', String(INNER_H));
    line.setAttribute('stroke', '#e5e7eb');
    line.setAttribute('stroke-dasharray', '3,3');
    xGrid.appendChild(line);
  }
  g.appendChild(xGrid);

  const yGrid = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  const yTicks = 5;
  for (let i = 0; i <= yTicks; i++) {
    const yVal = yMin + (i / yTicks) * (yMax - yMin);
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', String(0));
    line.setAttribute('y1', String(yScale(yVal)));
    line.setAttribute('x2', String(INNER_W));
    line.setAttribute('y2', String(yScale(yVal)));
    line.setAttribute('stroke', '#e5e7eb');
    line.setAttribute('stroke-dasharray', '3,3');
    yGrid.appendChild(line);
  }
  g.appendChild(yGrid);

  // axes
  const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  xAxis.setAttribute('x1', String(0));
  xAxis.setAttribute('y1', String(INNER_H));
  xAxis.setAttribute('x2', String(INNER_W));
  xAxis.setAttribute('y2', String(INNER_H));
  xAxis.setAttribute('stroke', '#374151');
  xAxis.setAttribute('stroke-width', '1.5');
  g.appendChild(xAxis);

  const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  yAxis.setAttribute('x1', String(0));
  yAxis.setAttribute('y1', String(0));
  yAxis.setAttribute('x2', String(0));
  yAxis.setAttribute('y2', String(INNER_H));
  yAxis.setAttribute('stroke', '#374151');
  yAxis.setAttribute('stroke-width', '1.5');
  g.appendChild(yAxis);

  // x labels
  for (let i = 0; i <= 10; i += 2) {
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', String(xScale(i)));
    text.setAttribute('y', String(INNER_H + 18));
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-size', '11');
    text.setAttribute('fill', '#6b7280');
    text.textContent = String(i);
    g.appendChild(text);
  }

  // y labels
  for (let i = 0; i <= yTicks; i++) {
    const yVal = yMin + (i / yTicks) * (yMax - yMin);
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', String(-8));
    text.setAttribute('y', String(yScale(yVal) + 4));
    text.setAttribute('text-anchor', 'end');
    text.setAttribute('font-size', '11');
    text.setAttribute('fill', '#6b7280');
    text.textContent = yVal.toFixed(0);
    g.appendChild(text);
  }

  // axis titles
  const xTitle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  xTitle.setAttribute('x', String(INNER_W / 2));
  xTitle.setAttribute('y', String(INNER_H + 36));
  xTitle.setAttribute('text-anchor', 'middle');
  xTitle.setAttribute('font-size', '12');
  xTitle.setAttribute('fill', '#374151');
  xTitle.textContent = 'x';
  g.appendChild(xTitle);

  const yTitle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  yTitle.setAttribute('x', String(-30));
  yTitle.setAttribute('y', String(INNER_H / 2));
  yTitle.setAttribute('text-anchor', 'middle');
  yTitle.setAttribute('font-size', '12');
  yTitle.setAttribute('fill', '#374151');
  yTitle.setAttribute('transform', `rotate(-90, -30, ${INNER_H / 2})`);
  yTitle.textContent = 'y';
  g.appendChild(yTitle);

  // true line (y = 2x + 1)
  const trueLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  trueLine.setAttribute('x1', String(xScale(0)));
  trueLine.setAttribute('y1', String(yScale(1)));
  trueLine.setAttribute('x2', String(xScale(10)));
  trueLine.setAttribute('y2', String(yScale(21)));
  trueLine.setAttribute('stroke', '#10b981');
  trueLine.setAttribute('stroke-width', '2');
  trueLine.setAttribute('stroke-dasharray', '6,4');
  trueLine.setAttribute('opacity', '0.7');
  g.appendChild(trueLine);

  // predicted line
  const y0 = theta0 + theta1 * 0;
  const y10 = theta0 + theta1 * 10;
  const predLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  predLine.setAttribute('x1', String(xScale(0)));
  predLine.setAttribute('y1', String(yScale(y0)));
  predLine.setAttribute('x2', String(xScale(10)));
  predLine.setAttribute('y2', String(yScale(y10)));
  predLine.setAttribute('stroke', '#2563eb');
  predLine.setAttribute('stroke-width', '3');
  g.appendChild(predLine);

  // data points
  data.forEach((d) => {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', String(xScale(d.x)));
    circle.setAttribute('cy', String(yScale(d.y)));
    circle.setAttribute('r', '5');
    circle.setAttribute('fill', '#3b82f6');
    circle.setAttribute('stroke', '#1d4ed8');
    circle.setAttribute('stroke-width', '1.5');
    circle.setAttribute('opacity', '0.85');
    g.appendChild(circle);
  });

  // legend
  const legend = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  legend.setAttribute('transform', `translate(10, 10)`);

  const legendBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  legendBg.setAttribute('width', '125');
  legendBg.setAttribute('height', '50');
  legendBg.setAttribute('rx', '6');
  legendBg.setAttribute('fill', 'white');
  legendBg.setAttribute('stroke', '#e5e7eb');
  legend.appendChild(legendBg);

  // true line legend
  const tl = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  tl.setAttribute('x1', '10');
  tl.setAttribute('y1', '18');
  tl.setAttribute('x2', '30');
  tl.setAttribute('y2', '18');
  tl.setAttribute('stroke', '#10b981');
  tl.setAttribute('stroke-width', '2');
  tl.setAttribute('stroke-dasharray', '4,3');
  legend.appendChild(tl);

  const tlText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  tlText.setAttribute('x', '36');
  tlText.setAttribute('y', '22');
  tlText.setAttribute('font-size', '10');
  tlText.setAttribute('fill', '#374151');
  tlText.textContent = '真实: y = 2x + 1';
  legend.appendChild(tlText);

  // pred line legend
  const pl = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  pl.setAttribute('x1', '10');
  pl.setAttribute('y1', '36');
  pl.setAttribute('x2', '30');
  pl.setAttribute('y2', '36');
  pl.setAttribute('stroke', '#2563eb');
  pl.setAttribute('stroke-width', '3');
  legend.appendChild(pl);

  const plText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  plText.setAttribute('x', '36');
  plText.setAttribute('y', '40');
  plText.setAttribute('font-size', '10');
  plText.setAttribute('fill', '#374151');
  plText.textContent = '预测: y = θ₀ + θ₁x';
  legend.appendChild(plText);

  g.appendChild(legend);
}

/* ── Cost contour drawer ── */
function drawCostPath(
  svgEl: SVGSVGElement,
  data: DataPoint[],
  theta0: number,
  theta1: number,
) {
  const svg = svgEl;
  while (svg.firstChild) svg.removeChild(svg.firstChild);

  const W = 260;
  const H = 200;
  const PAD = 20;

  const t0Min = -3, t0Max = 5;
  const t1Min = -1, t1Max = 5;

  const toX = (t0: number) => PAD + ((t0 - t0Min) / (t0Max - t0Min)) * (W - 2 * PAD);
  const toY = (t1: number) => H - (PAD + ((t1 - t1Min) / (t1Max - t1Min)) * (H - 2 * PAD));

  // compute J over grid
  const GRID = 60;
  const costAt = (t0: number, t1: number) => {
    let s = 0;
    data.forEach((d) => {
      const err = t0 + t1 * d.x - d.y;
      s += err * err;
    });
    return s / (2 * data.length);
  };

  let minJ = Infinity, maxJ = -Infinity;
  const gridVals: number[][] = [];
  for (let r = 0; r < GRID; r++) {
    gridVals[r] = [];
    for (let c = 0; c < GRID; c++) {
      const t0 = t0Min + (c / (GRID - 1)) * (t0Max - t0Min);
      const t1 = t1Min + ((GRID - 1 - r) / (GRID - 1)) * (t1Max - t1Min);
      const j = costAt(t0, t1);
      gridVals[r][c] = j;
      if (j < minJ) minJ = j;
      if (j > maxJ) maxJ = j;
    }
  }

  // Use simple filled contour bands
  const bandColors: [number, number, string][] = [
    [0, 2, '#eff6ff'],
    [2, 5, '#dbeafe'],
    [5, 10, '#bfdbfe'],
    [10, 20, '#93c5fd'],
    [20, 40, '#60a5fa'],
    [40, 80, '#3b82f6'],
    [80, Infinity, '#1d4ed8'],
  ];

  // draw cell by cell
  const cellW = (W - 2 * PAD) / (GRID - 1);
  const cellH = (H - 2 * PAD) / (GRID - 1);

  for (let r = 0; r < GRID - 1; r++) {
    for (let c = 0; c < GRID - 1; c++) {
      const j = gridVals[r][c];
      for (const [lo, hi, color] of bandColors) {
        if (j >= lo && j < hi) {
          const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          rect.setAttribute('x', String(toX(t0Min + (c / (GRID - 1)) * (t0Max - t0Min)) - cellW / 2));
          rect.setAttribute('y', String(toY(t1Min + ((GRID - 1 - r) / (GRID - 1)) * (t1Max - t1Min)) - cellH / 2));
          rect.setAttribute('width', String(cellW + 1));
          rect.setAttribute('height', String(cellH + 1));
          rect.setAttribute('fill', color);
          svg.appendChild(rect);
          break;
        }
      }
    }
  }

  // axes
  const xAx = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  xAx.setAttribute('x1', String(PAD));
  xAx.setAttribute('y1', String(H - PAD));
  xAx.setAttribute('x2', String(W - PAD));
  xAx.setAttribute('y2', String(H - PAD));
  xAx.setAttribute('stroke', '#374151');
  xAx.setAttribute('stroke-width', '1.5');
  svg.appendChild(xAx);

  const yAx = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  yAx.setAttribute('x1', String(PAD));
  yAx.setAttribute('y1', String(PAD));
  yAx.setAttribute('x2', String(PAD));
  yAx.setAttribute('y2', String(H - PAD));
  yAx.setAttribute('stroke', '#374151');
  yAx.setAttribute('stroke-width', '1.5');
  svg.appendChild(yAx);

  // labels
  const xl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  xl.setAttribute('x', String(W / 2));
  xl.setAttribute('y', String(H - 2));
  xl.setAttribute('text-anchor', 'middle');
  xl.setAttribute('font-size', '10');
  xl.setAttribute('fill', '#4b5563');
  xl.textContent = 'θ₀';
  svg.appendChild(xl);

  const yl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  yl.setAttribute('x', String(6));
  yl.setAttribute('y', String(H / 2));
  yl.setAttribute('text-anchor', 'middle');
  yl.setAttribute('font-size', '10');
  yl.setAttribute('fill', '#4b5563');
  yl.setAttribute('transform', `rotate(-90, 6, ${H / 2})`);
  yl.textContent = 'θ₁';
  svg.appendChild(yl);

  // current point
  const cx = toX(theta0);
  const cy = toY(theta1);
  const pt = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  pt.setAttribute('cx', String(cx));
  pt.setAttribute('cy', String(cy));
  pt.setAttribute('r', '6');
  pt.setAttribute('fill', '#ef4444');
  pt.setAttribute('stroke', 'white');
  pt.setAttribute('stroke-width', '2');
  svg.appendChild(pt);

  // minimum point (true theta: 1, 2)
  const mCx = toX(1);
  const mCy = toY(2);
  const minPt = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  minPt.setAttribute('cx', String(mCx));
  minPt.setAttribute('cy', String(mCy));
  minPt.setAttribute('r', '5');
  minPt.setAttribute('fill', '#10b981');
  minPt.setAttribute('stroke', 'white');
  minPt.setAttribute('stroke-width', '2');
  svg.appendChild(minPt);

  // legend
  const legY = 12;
  const leg = document.createElementNS('http://www.w3.org/2000/svg', 'g');

  const p1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  p1.setAttribute('cx', String(W - 70));
  p1.setAttribute('cy', String(legY));
  p1.setAttribute('r', '4');
  p1.setAttribute('fill', '#10b981');
  leg.appendChild(p1);

  const t1 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  t1.setAttribute('x', String(W - 62));
  t1.setAttribute('y', String(legY + 4));
  t1.setAttribute('font-size', '9');
  t1.setAttribute('fill', '#374151');
  t1.textContent = '最优';
  leg.appendChild(t1);

  const p2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  p2.setAttribute('cx', String(W - 30));
  p2.setAttribute('cy', String(legY));
  p2.setAttribute('r', '4');
  p2.setAttribute('fill', '#ef4444');
  leg.appendChild(p2);

  const t2 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  t2.setAttribute('x', String(W - 22));
  t2.setAttribute('y', String(legY + 4));
  t2.setAttribute('font-size', '9');
  t2.setAttribute('fill', '#374151');
  t2.textContent = '当前';
  leg.appendChild(t2);

  svg.appendChild(leg);
}

/* ── Page component ── */
export default function ModelPage() {
  const [theta0, setTheta0] = useState(0);
  const [theta1, setTheta1] = useState(1);
  const scatterRef = useRef<SVGSVGElement>(null);
  const costRef = useRef<SVGSVGElement>(null);

  const data = useMemo(() => generateData(), []);

  useEffect(() => {
    if (scatterRef.current) {
      drawScatter(scatterRef.current, data, theta0, theta1);
    }
  }, [data, theta0, theta1]);

  useEffect(() => {
    if (costRef.current) {
      drawCostPath(costRef.current, data, theta0, theta1);
    }
  }, [data, theta0, theta1]);

  const cost = useCallback(() => {
    let s = 0;
    data.forEach((d) => {
      const err = theta0 + theta1 * d.x - d.y;
      s += err * err;
    });
    return s / (2 * data.length);
  }, [data, theta0, theta1]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Header */}
      <section className="text-center py-8 bg-white rounded-2xl shadow-sm border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">模型表示</h1>
        <p className="text-gray-600 max-w-2xl mx-auto px-4">
          线性回归的模型是一个从输入特征到输出预测的线性映射。我们先定义假设函数，
          然后学习如何找到最优的参数。
        </p>
      </section>

      {/* Hypothesis Function */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">假设函数</h2>
        <p className="text-gray-700 mb-4">
          在线性回归中，我们假设输出是输入特征的线性组合。假设函数（hypothesis）定义为：
        </p>

        <FormulaCard
          title="假设函数定义"
          formula={
            <KaTeX
              math={"h_\\theta(x) = \\theta_0 + \\theta_1 x_1 + \\theta_2 x_2 + \\cdots + \\theta_n x_n"}
              display
            />
          }
          description="其中 x₁, x₂, ..., xₙ 是输入特征，θ₀, θ₁, ..., θₙ 是待学习的参数。"
        />

        <div className="mt-4 space-y-3">
          <div className="p-3 bg-gray-50 rounded-lg">
            <strong className="text-gray-800">
              <KaTeX math={"\\theta_0"} />
            </strong>
            <span className="text-gray-700 ml-2">偏置项（截距，intercept）。当所有特征为 0 时的预测值。</span>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <strong className="text-gray-800">
              <KaTeX math={"\\theta_j \\ (j \\geq 1)"} />
            </strong>
            <span className="text-gray-700 ml-2">第 j 个特征的权重（系数），表示该特征对预测结果的影响程度。</span>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <strong className="text-gray-800">
              <KaTeX math={"x_0 = 1"} />
            </strong>
            <span className="text-gray-700 ml-2">为了方便表示偏置项，我们总是令 x₀ = 1。</span>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-2">单变量线性回归</h3>
          <p className="text-gray-700 mb-2">
            当只有一个输入特征时（n = 1），模型简化为：
          </p>
          <div className="formula-block">
            <KaTeX math={"h_\\theta(x) = \\theta_0 + \\theta_1 x"} display />
          </div>
          <p className="text-gray-700 text-sm">
            这就是高中数学中的直线方程！<KaTeX math={"\\theta_0"} /> 是 y 轴截距，
            <KaTeX math={"\\theta_1"} /> 是斜率。我们的目标是找到一条最能拟合训练数据的直线。
          </p>
        </div>

        {/* Line Fitting Intuition */}
        <div className="mt-8 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Ruler className="w-6 h-6 text-emerald-600" />
            <h3 className="text-lg font-bold text-emerald-800">直线拟合的直觉：找一条&quot;最公平&quot;的线</h3>
          </div>

          <p className="text-gray-700 mb-4">
            想象你在桌上撒了一把豆子（这些就是我们的数据点），现在你需要拿一根直尺，
            画出一条最能代表这些豆子分布趋势的直线。你会怎么做？
          </p>

          <div className="grid md:grid-cols-3 gap-4 mb-5">
            <div className="bg-white rounded-lg p-4 border border-emerald-200 text-center">
              <div className="w-full h-20 bg-gray-50 rounded mb-2 flex items-center justify-center">
                {/* Bad fit: too low */}
                <svg viewBox="0 0 100 50" className="w-full h-full">
                  <circle cx="20" cy="15" r="3" fill="#3b82f6" />
                  <circle cx="35" cy="20" r="3" fill="#3b82f6" />
                  <circle cx="50" cy="30" r="3" fill="#3b82f6" />
                  <circle cx="65" cy="35" r="3" fill="#3b82f6" />
                  <circle cx="80" cy="42" r="3" fill="#3b82f6" />
                  <line x1="10" y1="40" x2="90" y2="45" stroke="#ef4444" strokeWidth="2" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-red-600">太偏下了</span>
              <span className="text-xs text-gray-500 block">大多数点在直线上方</span>
            </div>

            <div className="bg-white rounded-lg p-4 border-2 border-emerald-400 text-center">
              <div className="w-full h-20 bg-gray-50 rounded mb-2 flex items-center justify-center">
                {/* Good fit */}
                <svg viewBox="0 0 100 50" className="w-full h-full">
                  <circle cx="20" cy="15" r="3" fill="#3b82f6" />
                  <circle cx="35" cy="22" r="3" fill="#3b82f6" />
                  <circle cx="50" cy="28" r="3" fill="#3b82f6" />
                  <circle cx="65" cy="33" r="3" fill="#3b82f6" />
                  <circle cx="80" cy="40" r="3" fill="#3b82f6" />
                  <line x1="10" y1="12" x2="90" y2="44" stroke="#10b981" strokeWidth="2.5" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-emerald-600">恰到好处</span>
              <span className="text-xs text-gray-500 block">点到直线距离均衡</span>
            </div>

            <div className="bg-white rounded-lg p-4 border border-emerald-200 text-center">
              <div className="w-full h-20 bg-gray-50 rounded mb-2 flex items-center justify-center">
                {/* Bad fit: too steep */}
                <svg viewBox="0 0 100 50" className="w-full h-full">
                  <circle cx="20" cy="15" r="3" fill="#3b82f6" />
                  <circle cx="35" cy="20" r="3" fill="#3b82f6" />
                  <circle cx="50" cy="30" r="3" fill="#3b82f6" />
                  <circle cx="65" cy="35" r="3" fill="#3b82f6" />
                  <circle cx="80" cy="42" r="3" fill="#3b82f6" />
                  <line x1="10" y1="30" x2="90" y2="10" stroke="#ef4444" strokeWidth="2" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-red-600">太陡了</span>
              <span className="text-xs text-gray-500 block">斜率与趋势不符</span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-emerald-200">
            <p className="text-gray-700 text-sm mb-2">
              <strong>核心直觉：</strong>不同的{" "}
              <KaTeX math={"(\\theta_0, \\theta_1)"} />{" "}
              组合会产生不同的直线。有的直线高高在上，离所有点都很远；有的直线穿过点的中间，
              让每个点到直线的距离都比较小。我们要找的是后者——那条&quot;最公平&quot;的直线。
            </p>
            <p className="text-gray-700 text-sm">
              类比：就像用一根直尺尽量靠近所有散落的点，使得每个点到直尺的垂直距离之和最小。
              <KaTeX math={"\\theta_0"} /> 决定直尺的起始高度，
              <KaTeX math={"\\theta_1"} /> 决定直尺的倾斜角度。
            </p>
          </div>
        </div>
      </section>

      {/* Matrix Notation */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">矩阵表示</h2>
        <p className="text-gray-700 mb-4">
          当有多个特征时，用向量/矩阵表示会更加简洁。定义：
        </p>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="formula-block">
            <KaTeX math={"x = \\begin{bmatrix} x_0 \\\\ x_1 \\\\ \\vdots \\\\ x_n \\end{bmatrix} \\in \\mathbb{R}^{n+1}"} display />
            <p className="text-sm text-gray-600 mt-2">输入特征向量（包含 x₀ = 1）</p>
          </div>
          <div className="formula-block">
            <KaTeX math={"\\theta = \\begin{bmatrix} \\theta_0 \\\\ \\theta_1 \\\\ \\vdots \\\\ \\theta_n \\end{bmatrix} \\in \\mathbb{R}^{n+1}"} display />
            <p className="text-sm text-gray-600 mt-2">参数向量</p>
          </div>
        </div>

        <p className="text-gray-700 mb-4">
          则假设函数可以简洁地写成内积形式：
        </p>

        <FormulaCard
          title="向量形式"
          formula={<KaTeX math={"h_\\theta(x) = \\theta^T x"} display />}
          description="其中 θᵀ 表示 θ 的转置，结果是一个标量。"
        />

        <p className="text-gray-700 mb-4">
          对于整个训练集（m 个样本），将所有输入特征堆叠成一个设计矩阵 X ∈ ℝ<sup>m×(n+1)</sup>：
        </p>

        <FormulaCard
          title="设计矩阵"
          formula={
            <KaTeX
              math={"X = \\begin{bmatrix} (x^{(1)})^T \\\\ (x^{(2)})^T \\\\ \\vdots \\\\ (x^{(m)})^T \\end{bmatrix} = \\begin{bmatrix} x_0^{(1)} & x_1^{(1)} & \\cdots & x_n^{(1)} \\\\ x_0^{(2)} & x_1^{(2)} & \\cdots & x_n^{(2)} \\\\ \\vdots & \\vdots & \\ddots & \\vdots \\\\ x_0^{(m)} & x_1^{(m)} & \\cdots & x_n^{(m)} \\end{bmatrix}"}
              display
            />
          }
          description="设计矩阵的每一行是一个训练样本，每一列是一个特征（第 0 列全为 1）。"
        />

        <FormulaCard
          title="批量预测"
          formula={<KaTeX math={"h = X \\theta"} display />}
          description="其中 h ∈ ℝᵐ 是所有 m 个样本的预测值组成的向量。"
        />
      </section>

      {/* Parameter Meaning - Life Explanation */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-6 h-6 text-violet-600" />
          <h2 className="text-2xl font-bold text-gray-900">参数含义的生活解释</h2>
        </div>

        <p className="text-gray-700 mb-5">
          在房价预测的例子中，假设函数 <KaTeX math={"h(x) = \\theta_0 + \\theta_1 x"} />{" "}
          中的两个参数有着直观的物理意义：
        </p>

        <div className="grid md:grid-cols-2 gap-5 mb-5">
          <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl border border-violet-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold text-sm">
                <KaTeX math={"\\theta_0"} className="text-white" />
              </div>
              <h3 className="font-bold text-violet-800">截距 · 基础成本</h3>
            </div>
            <p className="text-gray-700 text-sm mb-3">
              <KaTeX math={"\\theta_0"} /> 是直线的起点，也就是当面积为 0 时的&quot;基础成本&quot;。
              在实际中，即使房子面积为 0，一块地皮也有它的基础价值。
            </p>
            <div className="bg-white rounded-lg p-3 border border-violet-200">
              <p className="text-sm text-violet-700">
                <strong>房价例子：</strong>
                <KaTeX math={"\\theta_0 = 50"} /> 万元，代表基础装修费 + 土地使用权
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                <KaTeX math={"\\theta_1"} className="text-white" />
              </div>
              <h3 className="font-bold text-blue-800">斜率 · 增长率</h3>
            </div>
            <p className="text-gray-700 text-sm mb-3">
              <KaTeX math={"\\theta_1"} /> 是直线的倾斜程度，表示每增加一平米面积，
              房价平均上涨多少。斜率越大，面积对房价的影响越大。
            </p>
            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <p className="text-sm text-blue-700">
                <strong>房价例子：</strong>
                <KaTeX math={"\\theta_1 = 2"} /> 万元/平米，每多一平米面积增值 2 万
              </p>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 rounded-lg border border-amber-200 p-4">
          <p className="text-gray-700 text-sm">
            <strong>直观理解：</strong>假设你看到一套 80 平米的房子，如果{" "}
            <KaTeX math={"\\theta_0 = 50, \\theta_1 = 2"} />，
            那么预测价格 = 50 + 2{" "}×{" "}80 = 210 万元。
            这就是线性回归模型的预测过程——简单的乘法加法组合！
          </p>
        </div>
      </section>

      {/* Interactive Demo */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">交互演示</h2>
        <p className="text-gray-700 mb-4">
          下面是一个单变量线性回归的交互式演示。蓝点是训练数据（围绕真实直线 y = 2x + 1 生成），
          蓝色实线是你的预测直线。拖动滑块调整参数 <KaTeX math={"\\theta_0"} /> 和{" "}
          <KaTeX math={"\\theta_1"} />，观察拟合效果的变化。
        </p>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Chart */}
          <div className="w-full lg:w-[65%]">
            <div className="bg-white border border-gray-200 rounded-xl p-4 overflow-hidden">
              <svg
                ref={scatterRef}
                viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
                className="w-full h-auto"
                style={{ maxHeight: 420 }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="w-full lg:w-[35%]">
            <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  偏置项 <KaTeX math={"\\theta_0"} /> = <span className="text-blue-700 font-mono">{theta0.toFixed(1)}</span>
                </label>
                <Slider
                  value={[theta0]}
                  onValueChange={(v) => setTheta0(v[0])}
                  min={-5}
                  max={8}
                  step={0.1}
                />
                <p className="text-xs text-gray-500 mt-1">控制直线在 y 轴上的截距</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  斜率 <KaTeX math={"\\theta_1"} /> = <span className="text-blue-700 font-mono">{theta1.toFixed(1)}</span>
                </label>
                <Slider
                  value={[theta1]}
                  onValueChange={(v) => setTheta1(v[0])}
                  min={-1}
                  max={5}
                  step={0.1}
                />
                <p className="text-xs text-gray-500 mt-1">控制直线的倾斜程度</p>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800 font-semibold">
                  当前假设:{" "}
                  <KaTeX math={`h(x) = ${theta0.toFixed(1)} + ${theta1.toFixed(1)}x`} />
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  代价 J(θ) = <span className="font-mono font-semibold text-gray-800">{cost().toFixed(3)}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Cost contour mini-plot */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">代价函数等高线</h3>
          <p className="text-sm text-gray-600 mb-3">
            下图显示了在当前数据集上，代价函数 J(θ₀, θ₁) 的等高线图。
            红色点表示你当前选择的位置，绿色点表示最优解 (θ₀=1, θ₁=2)。
          </p>
          <div className="flex flex-col lg:flex-row gap-5 items-start">
            <div className="bg-white border border-gray-200 rounded-xl p-4 inline-block">
              <svg
                ref={costRef}
                viewBox="0 0 260 200"
                className="w-full"
                style={{ maxWidth: 400 }}
              />
            </div>

            {/* Contour geometric intuition */}
            <div className="flex-1 bg-gradient-to-br from-sky-50 to-cyan-50 rounded-xl border border-sky-200 p-5 max-w-md">
              <div className="flex items-center gap-2 mb-3">
                <Mountain className="w-5 h-5 text-sky-600" />
                <h4 className="font-bold text-sky-800">等高线图的几何直觉</h4>
              </div>
              <p className="text-gray-700 text-sm mb-3">
                这个等高线图就像一张<strong>地形图</strong>：
              </p>
              <ul className="space-y-2 text-sm text-gray-700 mb-4">
                <li className="flex items-start gap-2">
                  <span className="inline-block w-4 h-4 rounded-full bg-emerald-500 mt-0.5 shrink-0" />
                  <span><strong>绿色点</strong>是山谷的最低点——最优参数位置</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="inline-block w-4 h-4 rounded-full bg-red-500 mt-0.5 shrink-0" />
                  <span><strong>红色点</strong>是我们当前站的位置</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="inline-block w-4 h-4 rounded-sm bg-blue-300 mt-0.5 shrink-0" />
                  <span><strong>蓝色圈层</strong>是等高线，同一条线上代价值相同</span>
                </li>
              </ul>
              <div className="bg-white rounded-lg p-3 border border-sky-200">
                <p className="text-sm text-gray-600">
                  <strong>目标：</strong>从红色点出发，沿着下坡方向（梯度的反方向）走，
                  最终到达绿色点——这就是梯度下降在做的事情！
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
