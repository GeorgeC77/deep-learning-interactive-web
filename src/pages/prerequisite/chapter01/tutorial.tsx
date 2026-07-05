import SectionMetadata from '@/components/SectionMetadata';
import { useRef, useEffect, useState, useMemo } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import {
  FunctionSquare,
  RefreshCw,
  SlidersHorizontal,
  BarChart3,
  ShieldAlert,
  BookOpen,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import KaTeX from '../../../components/KaTeX';
import FormulaCard from '../../../components/FormulaCard';
import ConceptCard from '../../../components/ConceptCard';
import InteractiveDemo from '../../../components/InteractiveDemo';
import InteractivePanel from '../../../components/InteractivePanel';

/* ── types & constants ── */
interface DataPoint {
  x: number;
  t: number;
}

const N_TRAIN = 10;
const NOISE_STD = 0.3;

/* ── random helpers ── */
function randNormal(mean = 0, std = 1): number {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return mean + std * Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function generateTrainData(): DataPoint[] {
  const points: DataPoint[] = [];
  for (let i = 0; i < N_TRAIN; i++) {
    const x = Math.random();
    points.push({ x, t: Math.sin(2 * Math.PI * x) + randNormal(0, NOISE_STD) });
  }
  return points;
}

function generateTestData(count = 100): DataPoint[] {
  const points: DataPoint[] = [];
  for (let i = 0; i < count; i++) {
    const x = (i + 0.5) / count;
    points.push({ x, t: Math.sin(2 * Math.PI * x) });
  }
  return points;
}

/* ── linear algebra helpers ── */
function solveLinearSystem(A: number[][], b: number[]): number[] {
  const n = A.length;
  const M: number[][] = A.map((row, i) => [...row, b[i]]);

  for (let col = 0; col < n; col++) {
    let maxRow = col;
    let maxVal = Math.abs(M[col][col]);
    for (let row = col + 1; row < n; row++) {
      if (Math.abs(M[row][col]) > maxVal) {
        maxVal = Math.abs(M[row][col]);
        maxRow = row;
      }
    }
    if (maxVal < 1e-12) continue;
    [M[col], M[maxRow]] = [M[maxRow], M[col]];
    const pivot = M[col][col];
    for (let j = col; j <= n; j++) M[col][j] /= pivot;
    for (let row = 0; row < n; row++) {
      if (row === col) continue;
      const factor = M[row][col];
      for (let j = col; j <= n; j++) M[row][j] -= factor * M[col][j];
    }
  }
  return M.map((row) => row[n]);
}

function fitPolynomial(train: DataPoint[], M: number): number[] {
  const X: number[][] = train.map((p) => {
    const row: number[] = [];
    let xj = 1;
    for (let j = 0; j <= M; j++) {
      row.push(xj);
      xj *= p.x;
    }
    return row;
  });

  const XtX: number[][] = Array.from({ length: M + 1 }, (_, i) =>
    Array.from({ length: M + 1 }, (_, j) =>
      X.reduce((sum, row) => sum + row[i] * row[j], 0)
    )
  );
  const Xty: number[] = Array.from({ length: M + 1 }, (_, i) =>
    train.reduce((sum, p, idx) => sum + X[idx][i] * p.t, 0)
  );

  return solveLinearSystem(XtX, Xty);
}

function predict(x: number, coeffs: number[]): number {
  let y = 0;
  let xj = 1;
  for (let j = 0; j < coeffs.length; j++) {
    y += coeffs[j] * xj;
    xj *= x;
  }
  return y;
}

function rmsError(points: DataPoint[], coeffs: number[]): number {
  const sq = points.reduce((sum, p) => sum + (predict(p.x, coeffs) - p.t) ** 2, 0);
  return Math.sqrt(sq / points.length);
}

/* ── drawing helpers ── */
const FIT_W = 600;
const FIT_H = 400;
const FIT_M = { top: 20, right: 30, bottom: 45, left: 55 };
const FIT_IW = FIT_W - FIT_M.left - FIT_M.right;
const FIT_IH = FIT_H - FIT_M.top - FIT_M.bottom;

function drawFitChart(
  svgEl: SVGSVGElement,
  train: DataPoint[],
  coeffs: number[],
  M: number
) {
  const svg = svgEl;
  while (svg.firstChild) svg.removeChild(svg.firstChild);
  svg.setAttribute('viewBox', `0 0 ${FIT_W} ${FIT_H}`);
  svg.setAttribute('font-family', 'Inter, sans-serif');

  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  g.setAttribute('transform', `translate(${FIT_M.left},${FIT_M.top})`);
  svg.appendChild(g);

  const xMin = 0;
  const xMax = 1;
  const yMin = -1.5;
  const yMax = 1.5;

  const xScale = (x: number) => ((x - xMin) / (xMax - xMin)) * FIT_IW;
  const yScale = (y: number) => FIT_IH - ((y - yMin) / (yMax - yMin)) * FIT_IH;

  // grid
  for (let x = 0; x <= 1; x += 0.2) {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', String(xScale(x)));
    line.setAttribute('y1', String(0));
    line.setAttribute('x2', String(xScale(x)));
    line.setAttribute('y2', String(FIT_IH));
    line.setAttribute('stroke', '#e5e7eb');
    line.setAttribute('stroke-dasharray', '3,3');
    g.appendChild(line);
  }
  for (let y = -1.5; y <= 1.5; y += 0.5) {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', String(0));
    line.setAttribute('y1', String(yScale(y)));
    line.setAttribute('x2', String(FIT_IW));
    line.setAttribute('y2', String(yScale(y)));
    line.setAttribute('stroke', '#e5e7eb');
    line.setAttribute('stroke-dasharray', '3,3');
    g.appendChild(line);
  }

  // axes
  const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  xAxis.setAttribute('x1', String(0));
  xAxis.setAttribute('y1', String(FIT_IH));
  xAxis.setAttribute('x2', String(FIT_IW));
  xAxis.setAttribute('y2', String(FIT_IH));
  xAxis.setAttribute('stroke', '#374151');
  xAxis.setAttribute('stroke-width', '1.5');
  g.appendChild(xAxis);

  const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  yAxis.setAttribute('x1', String(0));
  yAxis.setAttribute('y1', String(0));
  yAxis.setAttribute('x2', String(0));
  yAxis.setAttribute('y2', String(FIT_IH));
  yAxis.setAttribute('stroke', '#374151');
  yAxis.setAttribute('stroke-width', '1.5');
  g.appendChild(yAxis);

  // labels
  for (let x = 0; x <= 1; x += 0.2) {
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', String(xScale(x)));
    text.setAttribute('y', String(FIT_IH + 18));
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-size', '11');
    text.setAttribute('fill', '#6b7280');
    text.textContent = x.toFixed(1);
    g.appendChild(text);
  }
  for (let y = -1.5; y <= 1.5; y += 0.5) {
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', String(-8));
    text.setAttribute('y', String(yScale(y) + 4));
    text.setAttribute('text-anchor', 'end');
    text.setAttribute('font-size', '11');
    text.setAttribute('fill', '#6b7280');
    text.textContent = y.toFixed(1);
    g.appendChild(text);
  }

  const xTitle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  xTitle.setAttribute('x', String(FIT_IW / 2));
  xTitle.setAttribute('y', String(FIT_IH + 38));
  xTitle.setAttribute('text-anchor', 'middle');
  xTitle.setAttribute('font-size', '12');
  xTitle.setAttribute('fill', '#374151');
  xTitle.textContent = 'x';
  g.appendChild(xTitle);

  const yTitle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  yTitle.setAttribute('x', String(-35));
  yTitle.setAttribute('y', String(FIT_IH / 2));
  yTitle.setAttribute('text-anchor', 'middle');
  yTitle.setAttribute('font-size', '12');
  yTitle.setAttribute('fill', '#374151');
  yTitle.setAttribute('transform', `rotate(-90, -35, ${FIT_IH / 2})`);
  yTitle.textContent = 't';
  g.appendChild(yTitle);

  // true sin curve
  const truePoints: string[] = [];
  for (let i = 0; i <= 200; i++) {
    const x = xMin + (i / 200) * (xMax - xMin);
    truePoints.push(`${xScale(x)},${yScale(Math.sin(2 * Math.PI * x))}`);
  }
  const truePath = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
  truePath.setAttribute('points', truePoints.join(' '));
  truePath.setAttribute('fill', 'none');
  truePath.setAttribute('stroke', '#10b981');
  truePath.setAttribute('stroke-width', '2');
  truePath.setAttribute('stroke-dasharray', '6,4');
  truePath.setAttribute('opacity', '0.8');
  g.appendChild(truePath);

  // fitted polynomial curve
  const fitPoints: string[] = [];
  for (let i = 0; i <= 200; i++) {
    const x = xMin + (i / 200) * (xMax - xMin);
    fitPoints.push(`${xScale(x)},${yScale(predict(x, coeffs))}`);
  }
  const fitPath = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
  fitPath.setAttribute('points', fitPoints.join(' '));
  fitPath.setAttribute('fill', 'none');
  fitPath.setAttribute('stroke', '#2563eb');
  fitPath.setAttribute('stroke-width', '3');
  g.appendChild(fitPath);

  // training points
  train.forEach((p) => {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', String(xScale(p.x)));
    circle.setAttribute('cy', String(yScale(p.t)));
    circle.setAttribute('r', '5');
    circle.setAttribute('fill', '#3b82f6');
    circle.setAttribute('stroke', '#1d4ed8');
    circle.setAttribute('stroke-width', '1.5');
    g.appendChild(circle);
  });

  // legend
  const legend = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  legend.setAttribute('transform', `translate(${FIT_IW - 145}, 10)`);

  const legBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  legBg.setAttribute('width', '140');
  legBg.setAttribute('height', '70');
  legBg.setAttribute('rx', '6');
  legBg.setAttribute('fill', 'white');
  legBg.setAttribute('stroke', '#e5e7eb');
  legend.appendChild(legBg);

  const tl = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  tl.setAttribute('x1', '10');
  tl.setAttribute('y1', '22');
  tl.setAttribute('x2', '30');
  tl.setAttribute('y2', '22');
  tl.setAttribute('stroke', '#10b981');
  tl.setAttribute('stroke-width', '2');
  tl.setAttribute('stroke-dasharray', '4,3');
  legend.appendChild(tl);

  const tlText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  tlText.setAttribute('x', '36');
  tlText.setAttribute('y', '26');
  tlText.setAttribute('font-size', '10');
  tlText.setAttribute('fill', '#374151');
  tlText.textContent = String.raw`真实 sin(2πx)`;
  legend.appendChild(tlText);

  const pl = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  pl.setAttribute('x1', '10');
  pl.setAttribute('y1', '40');
  pl.setAttribute('x2', '30');
  pl.setAttribute('y2', '40');
  pl.setAttribute('stroke', '#2563eb');
  pl.setAttribute('stroke-width', '3');
  legend.appendChild(pl);

  const plText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  plText.setAttribute('x', '36');
  plText.setAttribute('y', '44');
  plText.setAttribute('font-size', '10');
  plText.setAttribute('fill', '#374151');
  plText.textContent = `拟合多项式 (M=${M})`;
  legend.appendChild(plText);

  const dp = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  dp.setAttribute('cx', '20');
  dp.setAttribute('cy', '56');
  dp.setAttribute('r', '4');
  dp.setAttribute('fill', '#3b82f6');
  legend.appendChild(dp);

  const dpText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  dpText.setAttribute('x', '36');
  dpText.setAttribute('y', '60');
  dpText.setAttribute('font-size', '10');
  dpText.setAttribute('fill', '#374151');
  dpText.textContent = '训练数据';
  legend.appendChild(dpText);

  g.appendChild(legend);
}

const RMS_W = 520;
const RMS_H = 260;
const RMS_M = { top: 25, right: 25, bottom: 45, left: 55 };
const RMS_IW = RMS_W - RMS_M.left - RMS_M.right;
const RMS_IH = RMS_H - RMS_M.top - RMS_M.bottom;

function drawRmsChart(svgEl: SVGSVGElement, rmsByM: { train: number; test: number }[]) {
  const svg = svgEl;
  while (svg.firstChild) svg.removeChild(svg.firstChild);
  svg.setAttribute('viewBox', `0 0 ${RMS_W} ${RMS_H}`);
  svg.setAttribute('font-family', 'Inter, sans-serif');

  const maxVal = Math.max(
    0.3,
    ...rmsByM.map((r) => Math.max(r.train, r.test))
  );
  const yMax = Math.ceil(maxVal * 1.2 * 10) / 10;

  const xScale = (m: number) => RMS_M.left + (m / 9) * RMS_IW;
  const yScale = (v: number) => RMS_M.top + RMS_IH - (v / yMax) * RMS_IH;

  // grid
  for (let m = 0; m <= 9; m++) {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', String(xScale(m)));
    line.setAttribute('y1', String(RMS_M.top));
    line.setAttribute('x2', String(xScale(m)));
    line.setAttribute('y2', String(RMS_M.top + RMS_IH));
    line.setAttribute('stroke', '#f3f4f6');
    svg.appendChild(line);
  }
  for (let i = 0; i <= 4; i++) {
    const v = (i / 4) * yMax;
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', String(RMS_M.left));
    line.setAttribute('y1', String(yScale(v)));
    line.setAttribute('x2', String(RMS_M.left + RMS_IW));
    line.setAttribute('y2', String(yScale(v)));
    line.setAttribute('stroke', '#f3f4f6');
    svg.appendChild(line);
  }

  // axes
  const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  xAxis.setAttribute('x1', String(RMS_M.left));
  xAxis.setAttribute('y1', String(RMS_M.top + RMS_IH));
  xAxis.setAttribute('x2', String(RMS_M.left + RMS_IW));
  xAxis.setAttribute('y2', String(RMS_M.top + RMS_IH));
  xAxis.setAttribute('stroke', '#374151');
  xAxis.setAttribute('stroke-width', '1.5');
  svg.appendChild(xAxis);

  const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  yAxis.setAttribute('x1', String(RMS_M.left));
  yAxis.setAttribute('y1', String(RMS_M.top));
  yAxis.setAttribute('x2', String(RMS_M.left));
  yAxis.setAttribute('y2', String(RMS_M.top + RMS_IH));
  yAxis.setAttribute('stroke', '#374151');
  yAxis.setAttribute('stroke-width', '1.5');
  svg.appendChild(yAxis);

  // labels
  for (let m = 0; m <= 9; m++) {
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', String(xScale(m)));
    text.setAttribute('y', String(RMS_M.top + RMS_IH + 18));
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-size', '10');
    text.setAttribute('fill', '#6b7280');
    text.textContent = String(m);
    svg.appendChild(text);
  }
  for (let i = 0; i <= 4; i++) {
    const v = (i / 4) * yMax;
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', String(RMS_M.left - 8));
    text.setAttribute('y', String(yScale(v) + 4));
    text.setAttribute('text-anchor', 'end');
    text.setAttribute('font-size', '10');
    text.setAttribute('fill', '#6b7280');
    text.textContent = v.toFixed(2);
    svg.appendChild(text);
  }

  const xTitle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  xTitle.setAttribute('x', String(RMS_W / 2));
  xTitle.setAttribute('y', String(RMS_H - 6));
  xTitle.setAttribute('text-anchor', 'middle');
  xTitle.setAttribute('font-size', '12');
  xTitle.setAttribute('fill', '#374151');
  xTitle.textContent = '多项式阶数 M';
  svg.appendChild(xTitle);

  const yTitle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  yTitle.setAttribute('x', String(14));
  yTitle.setAttribute('y', String(RMS_H / 2));
  yTitle.setAttribute('text-anchor', 'middle');
  yTitle.setAttribute('font-size', '12');
  yTitle.setAttribute('fill', '#374151');
  yTitle.setAttribute('transform', `rotate(-90, 14, ${RMS_H / 2})`);
  yTitle.textContent = 'RMS 误差';
  svg.appendChild(yTitle);

  // train line
  const trainPoints = rmsByM.map((r, m) => `${xScale(m)},${yScale(r.train)}`).join(' ');
  const trainLine = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
  trainLine.setAttribute('points', trainPoints);
  trainLine.setAttribute('fill', 'none');
  trainLine.setAttribute('stroke', '#2563eb');
  trainLine.setAttribute('stroke-width', '2.5');
  svg.appendChild(trainLine);

  // test line
  const testPoints = rmsByM.map((r, m) => `${xScale(m)},${yScale(r.test)}`).join(' ');
  const testLine = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
  testLine.setAttribute('points', testPoints);
  testLine.setAttribute('fill', 'none');
  testLine.setAttribute('stroke', '#ef4444');
  testLine.setAttribute('stroke-width', '2.5');
  testLine.setAttribute('stroke-dasharray', '5,4');
  svg.appendChild(testLine);

  // dots
  rmsByM.forEach((r, m) => {
    const trainDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    trainDot.setAttribute('cx', String(xScale(m)));
    trainDot.setAttribute('cy', String(yScale(r.train)));
    trainDot.setAttribute('r', '4');
    trainDot.setAttribute('fill', '#2563eb');
    svg.appendChild(trainDot);

    const testDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    testDot.setAttribute('cx', String(xScale(m)));
    testDot.setAttribute('cy', String(yScale(r.test)));
    testDot.setAttribute('r', '4');
    testDot.setAttribute('fill', '#ef4444');
    svg.appendChild(testDot);
  });

  // legend
  const legend = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  legend.setAttribute('transform', `translate(${RMS_W - 120}, 10)`);

  const legBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  legBg.setAttribute('width', '110');
  legBg.setAttribute('height', '48');
  legBg.setAttribute('rx', '6');
  legBg.setAttribute('fill', 'white');
  legBg.setAttribute('stroke', '#e5e7eb');
  legend.appendChild(legBg);

  const l1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  l1.setAttribute('x1', '10');
  l1.setAttribute('y1', '20');
  l1.setAttribute('x2', '28');
  l1.setAttribute('y2', '20');
  l1.setAttribute('stroke', '#2563eb');
  l1.setAttribute('stroke-width', '2.5');
  legend.appendChild(l1);

  const t1 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  t1.setAttribute('x', '34');
  t1.setAttribute('y', '24');
  t1.setAttribute('font-size', '10');
  t1.setAttribute('fill', '#374151');
  t1.textContent = '训练 RMS';
  legend.appendChild(t1);

  const l2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  l2.setAttribute('x1', '10');
  l2.setAttribute('y1', '36');
  l2.setAttribute('x2', '28');
  l2.setAttribute('y2', '36');
  l2.setAttribute('stroke', '#ef4444');
  l2.setAttribute('stroke-width', '2.5');
  l2.setAttribute('stroke-dasharray', '4,3');
  legend.appendChild(l2);

  const t2 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  t2.setAttribute('x', '34');
  t2.setAttribute('y', '40');
  t2.setAttribute('font-size', '10');
  t2.setAttribute('fill', '#374151');
  t2.textContent = '测试 RMS';
  legend.appendChild(t2);

  svg.appendChild(legend);
}

/* ── interactive demo component ── */
function PolyFitDemo() {
  const [trainData, setTrainData] = useState<DataPoint[]>(() => generateTrainData());
  const [M, setM] = useState<number>(3);
  const fitRef = useRef<SVGSVGElement>(null);
  const rmsRef = useRef<SVGSVGElement>(null);

  const testData = useMemo(() => generateTestData(), []);

  const coeffs = useMemo(() => fitPolynomial(trainData, M), [trainData, M]);

  const rmsTrain = useMemo(() => rmsError(trainData, coeffs), [trainData, coeffs]);
  const rmsTest = useMemo(() => rmsError(testData, coeffs), [testData, coeffs]);

  const rmsByM = useMemo(() => {
    const result: { train: number; test: number }[] = [];
    for (let m = 0; m <= 9; m++) {
      const c = fitPolynomial(trainData, m);
      result.push({
        train: rmsError(trainData, c),
        test: rmsError(testData, c),
      });
    }
    return result;
  }, [trainData, testData]);

  useEffect(() => {
    if (fitRef.current) {
      drawFitChart(fitRef.current, trainData, coeffs, M);
    }
  }, [trainData, coeffs, M]);

  useEffect(() => {
    if (rmsRef.current) {
      drawRmsChart(rmsRef.current, rmsByM);
    }
  }, [rmsByM]);

  return (
    <InteractiveDemo title="交互式多项式曲线拟合">
      <InteractivePanel
        hint="拖动滑块改变多项式阶数 M，观察拟合曲线与 RMS 误差的变化；点击“重新生成数据”可更换训练样本。"
        chart={
          <div className="space-y-4">
            <svg
              ref={fitRef}
              className="w-full h-auto"
              style={{ maxHeight: 420 }}
            />
            <svg
              ref={rmsRef}
              className="w-full h-auto"
              style={{ maxHeight: 280 }}
            />
          </div>
        }
        controls={
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                多项式阶数 M = <span className="text-blue-700 font-mono font-bold">{M}</span>
              </label>
              <Slider
                value={[M]}
                onValueChange={(v) => setM(v[0])}
                min={0}
                max={9}
                step={1}
              />
              <p className="text-xs text-gray-500 mt-1">M 越大，模型复杂度越高</p>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => setTrainData(generateTrainData())}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              重新生成数据
            </Button>

            <div className="space-y-2">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  训练 RMS = <span className="font-mono font-bold">{rmsTrain.toFixed(3)}</span>
                </p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <p className="text-sm text-red-800">
                  测试 RMS = <span className="font-mono font-bold">{rmsTest.toFixed(3)}</span>
                </p>
              </div>
            </div>

            <div className="text-xs text-gray-600 space-y-1">
              <p>
                <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-1 align-middle" />
                蓝色：训练数据点
              </p>
              <p>
                <span className="inline-block w-3 h-3 rounded-full bg-emerald-500 mr-1 align-middle" />
                绿色虚线：真实函数 sin(2πx)
              </p>
              <p>
                <span className="inline-block w-3 h-3 rounded-full bg-blue-700 mr-1 align-middle" />
                蓝色实线：拟合多项式
              </p>
            </div>
          </div>
        }
      />
    </InteractiveDemo>
  );
}

/* ── page component ── */
export default function PrerequisiteChapter01TutorialPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Hero */}
      <section className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center">
            <FunctionSquare className="w-9 h-9 text-indigo-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">1.2 Tutorial：多项式曲线拟合</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          经典示例：用多项式拟合带有噪声的正弦数据。通过这个例子，
          我们可以直观地理解模型、误差函数、模型复杂度与过拟合。
        </p>
        <p className="mt-6 text-sm text-amber-800">
          <ShieldAlert className="w-4 h-4 inline-block mr-1" />
          仅供教学与非商业学习使用。
        </p>
      </section>

      {/* Data generation */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-6 h-6 text-indigo-600" />
          <h2 className="text-2xl font-bold text-gray-900">合成数据</h2>
        </div>
        <p className="text-gray-700 mb-5">
          我们从一个已知的真实函数出发，并在其输出上添加高斯噪声，从而得到训练数据。
          这样我们就知道“正确答案”，便于评估不同模型的表现。
        </p>

        <FormulaCard
          title="数据生成过程"
          formula={
            <KaTeX
              math={String.raw`t_n = \sin(2\pi x_n) + \epsilon_n, \quad \epsilon_n \sim \mathcal{N}(0, \beta^{-1})`}
              display
            />
          }
          description={
            <span>
              其中 <KaTeX math={String.raw`x_n \in [0, 1]`} /> 均匀采样，
              <KaTeX math={String.raw`\epsilon_n`} /> 是均值为 0、标准差为
              <KaTeX math={String.raw`\beta^{-1/2}`} /> 的高斯噪声。
            </span>
          }
        />
      </section>

      {/* Polynomial model */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <FunctionSquare className="w-6 h-6 text-indigo-600" />
          <h2 className="text-2xl font-bold text-gray-900">多项式模型</h2>
        </div>
        <p className="text-gray-700 mb-5">
          我们选择一个参数化模型族——多项式函数。模型的复杂度由最高阶数 M 控制。
        </p>

        <FormulaCard
          title="多项式函数"
          formula={
            <KaTeX
              math={String.raw`y(x, w) = \sum_{j=0}^{M} w_j x^j`}
              display
            />
          }
          description={
            <span>
              <KaTeX math={String.raw`w = (w_0, w_1, \ldots, w_M)^T`} /> 是待学习的参数向量，
              M 是多项式的最高阶数，也称为模型复杂度。
            </span>
          }
        />

        <div className="grid md:grid-cols-4 gap-3 mt-6">
          {[
            { m: 0, desc: '常数函数，过于简单，无法捕捉正弦趋势。' },
            { m: 1, desc: '直线，只能拟合线性趋势，仍不足够。' },
            { m: 3, desc: '三次多项式，通常能较好地近似真实函数。' },
            { m: 9, desc: '九次多项式，参数过多，容易过拟合训练噪声。' },
          ].map((item) => (
            <ConceptCard
              key={item.m}
              icon={<SlidersHorizontal className="w-5 h-5" />}
              title={`M = ${item.m}`}
              description={item.desc}
            />
          ))}
        </div>
      </section>

      {/* Error function */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="w-6 h-6 text-indigo-600" />
          <h2 className="text-2xl font-bold text-gray-900">误差函数与 RMS 误差</h2>
        </div>

        <FormulaCard
          title="平方误差函数"
          formula={
            <KaTeX
              math={String.raw`E(w) = \frac{1}{2}\sum_{n=1}^{N}\{y(x_n, w) - t_n\}^2`}
              display
            />
          }
          description="衡量模型预测与真实目标之间的差异，目标是最小化该误差。"
        />

        <FormulaCard
          title="均方根误差（RMS）"
          formula={
            <KaTeX
              math={String.raw`E_{\mathrm{RMS}} = \sqrt{\frac{2E(w)}{N}}`}
              display
            />
          }
          description={
            <span>
              RMS 与原始目标变量 <KaTeX math={String.raw`t`} /> 具有相同的量纲，
              便于直观比较不同模型和不同数据集的误差大小。
            </span>
          }
        />
      </section>

      {/* Interactive demo */}
      <PolyFitDemo />

      {/* Overfitting discussion */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <AlertTriangle className="w-6 h-6 text-amber-600" />
          <h2 className="text-2xl font-bold text-gray-900">模型复杂度与过拟合</h2>
        </div>

        <p className="text-gray-700 mb-5">
          当 M 较小时，模型过于简单，无法捕捉数据背后的正弦模式，表现为<strong>欠拟合</strong>。
          当 M 过大（如 M = 9，而训练数据只有 10 个）时，多项式会有足够的自由度穿过所有训练点，
          但也把噪声当作信号学习，导致<strong>过拟合</strong>。
        </p>

        <div className="grid md:grid-cols-2 gap-5 mb-6">
          <ConceptCard
            icon={<AlertTriangle className="w-5 h-5" />}
            title="过拟合的表现"
            description={
              <span>
                训练 RMS 持续下降，但测试 RMS 在 M 过大时反而上升；
                拟合曲线在数据点之间出现剧烈震荡。
              </span>
            }
          />
          <ConceptCard
            icon={<CheckCircle2 className="w-5 h-5" />}
            title="如何选择 M？"
            description={
              <span>
                需要在欠拟合与过拟合之间取得平衡。一个实用的方法是使用验证集或交叉验证，
                选择在未见过的数据上表现最好的模型复杂度。
              </span>
            }
          />
        </div>

        <FormulaCard
          title="带正则化的误差函数"
          formula={
            <KaTeX
              math={String.raw`\tilde{E}(w) = E(w) + \frac{\lambda}{2}\|w\|^2`}
              display
            />
          }
          description={
            <span>
              通过引入正则化项 <KaTeX math={String.raw`\lambda`} />，
              可以惩罚过大的参数，从而抑制高阶多项式的剧烈震荡，缓解过拟合。
            </span>
          }
        />
      </section>
    
      <SectionMetadata
        bishopChapter={"Ch 1"}
        bishopSection={"tutorial"}
        learningObjectives={["理解 Tutorial 的核心概念与直观含义。", "掌握与本小节相关的关键公式与算法流程。", "能够在简单示例中应用所学方法并识别常见误区。"]}
        commonMistakes={["只记忆公式而忽略其背后的概率或优化假设。", "混淆相近概念的定义与适用场景。", "在应用时忽视数据分布与模型假设的匹配。"]}
        quiz={[
      {
        question: "关于“Tutorial”，下列说法最准确的是？",
        options: ["它是本小节需要掌握的核心主题。", "它与当前章节完全无关。", "它只适用于无限大数据集。", "它不需要任何数学基础。"],
        correctIndex: 0,
        explanation: "Tutorial 是本小节的核心内容，理解其动机、公式与应用场景是学习目标。",
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
