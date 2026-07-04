import { useMemo, useState } from 'react';
import { Grid3X3, RotateCcw, Shuffle } from 'lucide-react';
import ConceptCard from '@/components/ConceptCard';
import FormulaCard from '@/components/FormulaCard';
import InteractiveDemo from '@/components/InteractiveDemo';
import KaTeX from '@/components/KaTeX';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import SectionNavigation from '@/components/SectionNavigation';

const fmt = (n: number) => {
  const s = n.toFixed(2);
  return s === '-0.00' ? '0.00' : s;
};

function eigenDecompose(a: number, b: number, c: number) {
  const trace = a + c;
  const det = a * c - b * b;
  const disc = Math.sqrt((a - c) ** 2 + 4 * b * b);
  const lambda1 = (trace + disc) / 2;
  const lambda2 = (trace - disc) / 2;

  const vec = (lambda: number): [number, number] => {
    if (Math.abs(b) < 1e-9) {
      return Math.abs(lambda - a) < Math.abs(lambda - c) ? [1, 0] : [0, 1];
    }
    const vx = lambda - c;
    const vy = b;
    const len = Math.sqrt(vx * vx + vy * vy);
    return [vx / len, vy / len];
  };

  return {
    trace,
    det,
    lambda1,
    lambda2,
    v1: vec(lambda1),
    v2: vec(lambda2),
  };
}

export default function AppendixAOverviewPage() {
  const [m00, setM00] = useState(1);
  const [m11, setM11] = useState(1);
  const [m01, setM01] = useState(0);

  const { trace, det, lambda1, lambda2, v1, v2 } = useMemo(
    () => eigenDecompose(m00, m01, m11),
    [m00, m01, m11]
  );

  const CENTER = 160;
  const SCALE = 40;
  const toSvg = (wx: number, wy: number) => ({
    x: CENTER + wx * SCALE,
    y: CENTER - wy * SCALE,
  });

  const ellipsePoints = useMemo(() => {
    const pts: { x: number; y: number }[] = [];
    for (let i = 0; i <= 64; i++) {
      const t = (i / 64) * 2 * Math.PI;
      const cx = Math.cos(t);
      const sy = Math.sin(t);
      const tx = m00 * cx + m01 * sy;
      const ty = m01 * cx + m11 * sy;
      pts.push(toSvg(tx, ty));
    }
    return pts;
  }, [m00, m01, m11]);

  const ellipsePath = useMemo(() => {
    if (ellipsePoints.length === 0) return '';
    return (
      `M ${ellipsePoints[0].x} ${ellipsePoints[0].y} ` +
      ellipsePoints.slice(1).map((p) => `L ${p.x} ${p.y}`).join(' ') +
      ' Z'
    );
  }, [ellipsePoints]);

  const gridLines = [-3, -2, -1, 0, 1, 2, 3];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Hero */}
      <section className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
            <Grid3X3 className="w-9 h-9 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">附录 A：线性代数</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          线性代数是深度学习中矩阵运算、梯度推导与谱分析的基础工具。本页回顾矩阵恒等式、迹、行列式、导数与特征分解。
        </p>
      </section>

      {/* Concepts */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Grid3X3 className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">核心概念</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <ConceptCard
            title="矩阵恒等式"
            description={
              <>
                转置与逆满足反序律：
                <KaTeX math={String.raw`(AB)^{	op}=B^{\top}A^{\top}`} />，
                可逆时 <KaTeX math={String.raw`(AB)^{-1}=B^{-1}A^{-1}`} />。
                对向量有 <KaTeX math={String.raw`\mathbf{x}^{\top}\mathbf{y}=\mathbf{y}^{\top}\mathbf{x}`} />。
              </>
            }
          />
          <ConceptCard
            title="迹与行列式"
            description={
              <>
                迹 <KaTeX math={String.raw`\operatorname{tr}(A)=\sum_i A_{ii}`} /> 对循环置换不变：
                <KaTeX math={String.raw`\operatorname{tr}(AB)=\operatorname{tr}(BA)`} />。
                行列式 <KaTeX math={String.raw`\det(A)`} /> 刻画线性变换对体积的缩放，且等于特征值之积。
              </>
            }
          />
          <ConceptCard
            title="矩阵导数"
            description={
              <>
                二次型的梯度：
                <KaTeX math={String.raw`\frac{\partial}{\partial \mathbf{x}}(\mathbf{x}^{\top}A\mathbf{x})=(A+A^{\top})\mathbf{x}`} />。
                迹的导数：
                <KaTeX math={String.raw`\frac{\partial}{\partial A}\operatorname{tr}(AB)=B^{\top}`} />。
              </>
            }
          />
          <ConceptCard
            title="特征值与特征向量"
            description={
              <>
                若 <KaTeX math={String.raw`A\mathbf{v}=\lambda\mathbf{v}`} />，则 <KaTeX math={String.raw`\lambda`} /> 为特征值，
                <KaTeX math={String.raw`\mathbf{v}`} /> 为特征向量。实对称矩阵可正交对角化：
                <KaTeX math={String.raw`A=Q\Lambda Q^{\top}`} />。
              </>
            }
          />
        </div>
      </section>

      {/* Formulas */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">常用公式</h2>
        <FormulaCard
          title="逆矩阵与行列式（2×2）"
          formula={String.raw`A=\begin{pmatrix}a&b\\c&d\end{pmatrix},\quad A^{-1}=\frac{1}{\det A}\begin{pmatrix}d&-b\\-c&a\end{pmatrix},\quad \det A=ad-bc`}
          description="行列式非零时矩阵可逆。"
        />
        <FormulaCard
          title="矩阵微分常用结论"
          formula={String.raw`\frac{\partial}{\partial \mathbf{x}}(A\mathbf{x})=A^{\top},\quad \frac{\partial}{\partial A}\log\det A=(A^{-1})^{\top}`}
          description="这些恒等式在推导最大似然与反向传播时经常使用。"
        />
        <FormulaCard
          title="特征值与矩阵不变量"
          formula={String.raw`\operatorname{tr}(A)=\sum_i\lambda_i,\qquad \det(A)=\prod_i\lambda_i`}
          description="迹等于特征值之和，行列式等于特征值之积。"
        />
      </section>

      {/* Interactive Demo */}
      <InteractiveDemo title="2×2 对称矩阵特征分解可视化">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 flex justify-between">
                <span>
                  <KaTeX math={String.raw`A_{11}`} />
                </span>
                <span className="font-mono bg-gray-100 px-2 rounded">{fmt(m00)}</span>
              </label>
              <Slider value={[m00]} min={-2} max={2} step={0.1} onValueChange={(v) => setM00(v[0])} />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 flex justify-between">
                <span>
                  <KaTeX math={String.raw`A_{22}`} />
                </span>
                <span className="font-mono bg-gray-100 px-2 rounded">{fmt(m11)}</span>
              </label>
              <Slider value={[m11]} min={-2} max={2} step={0.1} onValueChange={(v) => setM11(v[0])} />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 flex justify-between">
                <span>
                  <KaTeX math={String.raw`A_{12}=A_{21}`} />
                </span>
                <span className="font-mono bg-gray-100 px-2 rounded">{fmt(m01)}</span>
              </label>
              <Slider value={[m01]} min={-2} max={2} step={0.1} onValueChange={(v) => setM01(v[0])} />
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" size="sm" onClick={() => { setM00(1); setM11(1); setM01(0); }}>
                <RotateCcw className="w-4 h-4 mr-1" />
                重置为单位矩阵
              </Button>
              <Button variant="outline" size="sm" onClick={() => { setM00(Math.round((Math.random()*4-2)*10)/10); setM11(Math.round((Math.random()*4-2)*10)/10); setM01(Math.round((Math.random()*4-2)*10)/10); }}>
                <Shuffle className="w-4 h-4 mr-1" />
                随机矩阵
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <svg viewBox="0 0 320 320" className="w-full h-64 border rounded-lg bg-white">
              {/* grid */}
              {gridLines.map((i) => {
                const p = toSvg(i, -3);
                const q = toSvg(i, 3);
                const r = toSvg(-3, i);
                const s = toSvg(3, i);
                return (
                  <g key={i}>
                    <line x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke="#e5e7eb" strokeWidth={1} />
                    <line x1={r.x} y1={r.y} x2={s.x} y2={s.y} stroke="#e5e7eb" strokeWidth={1} />
                  </g>
                );
              })}
              {/* axes */}
              <line x1={toSvg(-3, 0).x} y1={toSvg(-3, 0).y} x2={toSvg(3, 0).x} y2={toSvg(3, 0).y} stroke="#6b7280" strokeWidth={2} />
              <line x1={toSvg(0, -3).x} y1={toSvg(0, -3).y} x2={toSvg(0, 3).x} y2={toSvg(0, 3).y} stroke="#6b7280" strokeWidth={2} />
              {/* original unit circle */}
              <circle cx={CENTER} cy={CENTER} r={SCALE} fill="none" stroke="#93c5fd" strokeWidth={2} strokeDasharray="4 4" />
              {/* transformed ellipse */}
              <path d={ellipsePath} fill="rgba(59,130,246,0.15)" stroke="#2563eb" strokeWidth={2} />
              {/* eigenvectors */}
              {[lambda1, lambda2].map((lambda, idx) => {
                const v = idx === 0 ? v1 : v2;
                const end = toSvg(lambda * v[0], lambda * v[1]);
                return (
                  <g key={idx}>
                    <line x1={CENTER} y1={CENTER} x2={end.x} y2={end.y} stroke={idx === 0 ? '#dc2626' : '#16a34a'} strokeWidth={2} />
                    <circle cx={end.x} cy={end.y} r={3} fill={idx === 0 ? '#dc2626' : '#16a34a'} />
                  </g>
                );
              })}
            </svg>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-gray-500">迹</div>
                <div className="font-mono font-semibold">{fmt(trace)}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-gray-500">行列式</div>
                <div className="font-mono font-semibold">{fmt(det)}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <FormulaCard
            title="当前矩阵"
            formula={String.raw`A=\begin{pmatrix}${fmt(m00)}&${fmt(m01)}\\${fmt(m01)}&${fmt(m11)}\end{pmatrix}`}
          />
          <FormulaCard
            title="特征值"
            formula={String.raw`\lambda_1=${fmt(lambda1)},\quad \lambda_2=${fmt(lambda2)}`}
            description="红色与绿色箭头分别对应两个特征方向，长度约为 |λ|。"
          />
        </div>
      </InteractiveDemo>

      {/* Navigation */}
      <SectionNavigation sectionPath="/appendix/a/overview" />
    </div>
  );
}
