import { useMemo, useState, type ReactNode } from 'react';
import InteractiveDemo from '@/components/InteractiveDemo';
import { RefreshCw } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface Point2D {
  x: number;
  y: number;
}

function generateData(n: number, seed: number): Point2D[] {
  let s = seed;
  const data: Point2D[] = [];
  for (let i = 0; i < n; i++) {
    s = (s * 9301 + 49297) % 233280;
    const u1 = s / 233280;
    s = (s * 9301 + 49297) % 233280;
    const u2 = s / 233280;
    const r1 = Math.sqrt(-2 * Math.log(Math.max(1e-10, u1)));
    const z1 = r1 * Math.cos(2 * Math.PI * u2);
    const z2 = r1 * Math.sin(2 * Math.PI * u2);
    const x1 = 1.5 * z1 + 0.8 * z2;
    const x2 = 1.2 * z1 + 1.0 * z2;
    data.push({ x: x1, y: x2 });
  }
  return data;
}

function meanCenter(data: Point2D[]): Point2D[] {
  const mx = data.reduce((sum, p) => sum + p.x, 0) / data.length;
  const my = data.reduce((sum, p) => sum + p.y, 0) / data.length;
  return data.map((p) => ({ x: p.x - mx, y: p.y - my }));
}

function covarianceMatrix(data: Point2D[]): [[number, number], [number, number]] {
  const n = data.length;
  let a = 0;
  let b = 0;
  let d = 0;
  for (const p of data) {
    a += p.x * p.x;
    b += p.x * p.y;
    d += p.y * p.y;
  }
  return [
    [a / n, b / n],
    [b / n, d / n],
  ];
}

interface EigResult {
  lambda1: number;
  lambda2: number;
  u1: Point2D;
  u2: Point2D;
}

function eigenDecomposition(m: [[number, number], [number, number]]): EigResult {
  const a = m[0][0],
    b = m[0][1],
    d = m[1][1];
  const trace = a + d;
  const delta = Math.sqrt(((a - d) / 2) * ((a - d) / 2) + b * b);
  const lambda1 = trace / 2 + delta;
  const lambda2 = trace / 2 - delta;

  const vx = lambda1 - d;
  const vy = b;
  const norm1 = Math.sqrt(vx * vx + vy * vy);
  const u1 = { x: vx / norm1, y: vy / norm1 };
  const u2 = { x: -u1.y, y: u1.x };

  return { lambda1, lambda2, u1, u2 };
}

function project(p: Point2D, u: Point2D): Point2D {
  const dot = p.x * u.x + p.y * u.y;
  return { x: dot * u.x, y: dot * u.y };
}

export default function PCALab() {
  const [seed, setSeed] = useState(42);
  const [mode, setMode] = useState<'pca' | 'manual'>('pca');
  const [manualAngle, setManualAngle] = useState(0);
  const [k, setK] = useState(1);

  const rawData = useMemo(() => generateData(250, seed), [seed]);
  const data = useMemo(() => meanCenter(rawData), [rawData]);
  const sigma = useMemo(() => covarianceMatrix(data), [data]);
  const eig = useMemo(() => eigenDecomposition(sigma), [sigma]);

  const totalVariance = eig.lambda1 + eig.lambda2;
  const retainedVariance = k === 1 ? eig.lambda1 : totalVariance;
  const retainedRatio = totalVariance > 0 ? retainedVariance / totalVariance : 0;

  const manualRad = (manualAngle * Math.PI) / 180;
  const manualU = { x: Math.cos(manualRad), y: Math.sin(manualRad) };
  const manualVar =
    manualU.x * manualU.x * sigma[0][0] +
    2 * manualU.x * manualU.y * sigma[0][1] +
    manualU.y * manualU.y * sigma[1][1];

  const SIZE = 560;
  const PADDING = 50;
  const SCALE = 45;
  const CX = SIZE / 2;
  const CY = SIZE / 2;

  function toSvg(p: Point2D): { x: number; y: number } {
    return { x: CX + p.x * SCALE, y: CY - p.y * SCALE };
  }

  function arrowPath(origin: Point2D, dir: Point2D, len: number): string {
    const end = { x: origin.x + dir.x * len, y: origin.y + dir.y * len };
    const oSvg = toSvg(origin);
    const eSvg = toSvg(end);
    return `M ${oSvg.x} ${oSvg.y} L ${eSvg.x} ${eSvg.y}`;
  }

  const firstComponents = k >= 1 ? [eig.u1] : [];
  const components = k >= 2 ? [eig.u1, eig.u2] : firstComponents;

  return (
    <InteractiveDemo title="PCA 实验：最大方差方向与重构">
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          PCA 是无监督的：它寻找的是数据方差最大的方向，而不是标签区分度最大的方向。
          比较 PCA 主成分与手动方向的投影方差，可以看到 PCA 方向使投影方差最大。
        </p>

        <div className="grid sm:grid-cols-3 gap-3">
          <div className="flex gap-2">
            <button
              onClick={() => setMode('pca')}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                mode === 'pca' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              PCA 模式
            </button>
            <button
              onClick={() => setMode('manual')}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                mode === 'manual' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              手动方向
            </button>
          </div>

          {mode === 'pca' && (
            <div className="sm:col-span-2">
              <ControlRow label={`保留主成分数 k: ${k}`}>
                <Slider value={[k]} min={1} max={2} step={1} onValueChange={(v) => setK(v[0])} />
              </ControlRow>
            </div>
          )}

          {mode === 'manual' && (
            <div className="sm:col-span-2">
              <ControlRow label={`手动方向角度: ${manualAngle.toFixed(1)}°`}>
                <Slider
                  value={[manualAngle]}
                  min={-180}
                  max={180}
                  step={1}
                  onValueChange={(v) => setManualAngle(v[0])}
                />
              </ControlRow>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-3">
            <button
              onClick={() => setSeed((s) => s + 1)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              重新采样
            </button>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 text-sm space-y-1">
              <div className="text-gray-600">协方差矩阵 Σ:</div>
              <div className="font-mono text-gray-700">
                [{sigma[0][0].toFixed(3)}, {sigma[0][1].toFixed(3)}]
              </div>
              <div className="font-mono text-gray-700">
                [{sigma[1][0].toFixed(3)}, {sigma[1][1].toFixed(3)}]
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-gray-600">λ₁:</span>
                <span className="font-mono font-medium text-blue-700">{eig.lambda1.toFixed(4)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">λ₂:</span>
                <span className="font-mono font-medium text-blue-700">{eig.lambda2.toFixed(4)}</span>
              </div>
              {mode === 'pca' && (
                <div className="flex justify-between">
                  <span className="text-gray-600">保留方差比例:</span>
                  <span className="font-mono font-medium text-emerald-700">{retainedRatio.toFixed(4)}</span>
                </div>
              )}
              {mode === 'manual' && (
                <div className="flex justify-between">
                  <span className="text-gray-600">手动方向方差:</span>
                  <span className="font-mono font-medium text-amber-700">{manualVar.toFixed(4)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-2 overflow-x-auto">
            <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full min-w-[360px]" style={{ maxHeight: 480 }}>
              <rect x={0} y={0} width={SIZE} height={SIZE} fill="#f9fafb" />
              {[-5, -4, -3, -2, -1, 1, 2, 3, 4, 5].map((v) => {
                const p = toSvg({ x: v, y: 0 });
                return (
                  <line key={`vx-${v}`} x1={p.x} y1={PADDING} x2={p.x} y2={SIZE - PADDING} stroke="#e5e7eb" strokeWidth={1} />
                );
              })}
              {[-5, -4, -3, -2, -1, 1, 2, 3, 4, 5].map((v) => {
                const p = toSvg({ x: 0, y: v });
                return (
                  <line key={`hy-${v}`} x1={PADDING} y1={p.y} x2={SIZE - PADDING} y2={p.y} stroke="#e5e7eb" strokeWidth={1} />
                );
              })}
              <line x1={PADDING} y1={CY} x2={SIZE - PADDING} y2={CY} stroke="#374151" strokeWidth={2} />
              <line x1={CX} y1={PADDING} x2={CX} y2={SIZE - PADDING} stroke="#374151" strokeWidth={2} />
              {[-5, -4, -3, -2, -1, 1, 2, 3, 4, 5].map((v) => {
                const p = toSvg({ x: v, y: 0 });
                return (
                  <text key={`lx-${v}`} x={p.x} y={CY + 18} textAnchor="middle" fontSize={11} fill="#6b7280">
                    {v}
                  </text>
                );
              })}
              {[-5, -4, -3, -2, -1, 1, 2, 3, 4, 5].map((v) => {
                const p = toSvg({ x: 0, y: v });
                return (
                  <text key={`ly-${v}`} x={CX - 10} y={p.y + 4} textAnchor="end" fontSize={11} fill="#6b7280">
                    {v}
                  </text>
                );
              })}

              {mode === 'pca' &&
                k === 1 &&
                data.map((p, idx) => {
                  const proj = project(p, eig.u1);
                  const s0 = toSvg(p);
                  const s1 = toSvg(proj);
                  return (
                    <line
                      key={`proj-line-${idx}`}
                      x1={s0.x}
                      y1={s0.y}
                      x2={s1.x}
                      y2={s1.y}
                      stroke="#9ca3af"
                      strokeWidth={1}
                      strokeDasharray="3 3"
                      opacity={0.5}
                    />
                  );
                })}

              {mode === 'manual' &&
                data.map((p, idx) => {
                  const proj = project(p, manualU);
                  const s0 = toSvg(p);
                  const s1 = toSvg(proj);
                  return (
                    <line
                      key={`manual-proj-line-${idx}`}
                      x1={s0.x}
                      y1={s0.y}
                      x2={s1.x}
                      y2={s1.y}
                      stroke="#f59e0b"
                      strokeWidth={1}
                      strokeDasharray="3 3"
                      opacity={0.4}
                    />
                  );
                })}

              {mode === 'pca' &&
                data.map((p, idx) => {
                  let recon = { x: 0, y: 0 };
                  for (const u of components) {
                    const proj = project(p, u);
                    recon = { x: recon.x + proj.x, y: recon.y + proj.y };
                  }
                  const s = toSvg(recon);
                  return <circle key={`recon-${idx}`} cx={s.x} cy={s.y} r={3} fill="#10b981" opacity={0.7} />;
                })}

              {mode === 'manual' &&
                data.map((p, idx) => {
                  const proj = project(p, manualU);
                  const s = toSvg(proj);
                  return <circle key={`manual-proj-${idx}`} cx={s.x} cy={s.y} r={3} fill="#f59e0b" opacity={0.7} />;
                })}

              {data.map((p, idx) => {
                const s = toSvg(p);
                return <circle key={`data-${idx}`} cx={s.x} cy={s.y} r={3} fill="#2563eb" opacity={0.6} />;
              })}

              {mode === 'pca' && (
                <>
                  <path d={arrowPath({ x: 0, y: 0 }, eig.u1, 4)} fill="none" stroke="#ef4444" strokeWidth={3} markerEnd="url(#pca-arrow-red)" />
                  <path d={arrowPath({ x: 0, y: 0 }, eig.u2, 3)} fill="none" stroke="#10b981" strokeWidth={3} markerEnd="url(#pca-arrow-green)" />
                </>
              )}

              {mode === 'manual' && (
                <path d={arrowPath({ x: 0, y: 0 }, manualU, 4)} fill="none" stroke="#f59e0b" strokeWidth={3} strokeDasharray="6 4" markerEnd="url(#pca-arrow-amber)" />
              )}

              <defs>
                <marker id="pca-arrow-red" markerWidth={10} markerHeight={10} refX={9} refY={3} orient="auto" markerUnits="strokeWidth">
                  <path d="M0,0 L0,6 L9,3 z" fill="#ef4444" />
                </marker>
                <marker id="pca-arrow-green" markerWidth={10} markerHeight={10} refX={9} refY={3} orient="auto" markerUnits="strokeWidth">
                  <path d="M0,0 L0,6 L9,3 z" fill="#10b981" />
                </marker>
                <marker id="pca-arrow-amber" markerWidth={10} markerHeight={10} refX={9} refY={3} orient="auto" markerUnits="strokeWidth">
                  <path d="M0,0 L0,6 L9,3 z" fill="#f59e0b" />
                </marker>
              </defs>
            </svg>
            <div className="flex flex-wrap gap-4 justify-center mt-2 text-xs text-gray-600">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-600 opacity-60" /> 原始数据</span>
              <span className="flex items-center gap-1"><span className="w-6 h-0.5 bg-red-500" /> 第一主成分</span>
              <span className="flex items-center gap-1"><span className="w-6 h-0.5 bg-emerald-500" /> 第二主成分</span>
              {mode === 'pca' && <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-emerald-500 opacity-70" /> 重构点</span>}
              {mode === 'manual' && <span className="flex items-center gap-1"><span className="w-6 h-0.5 border-b-2 border-dashed border-amber-500" /> 手动方向</span>}
            </div>
          </div>
        </div>
      </div>
    </InteractiveDemo>
  );
}

function ControlRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      {children}
    </div>
  );
}
