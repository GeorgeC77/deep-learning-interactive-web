import { useMemo, useState } from 'react';
import InteractiveDemo from '@/components/InteractiveDemo';
import KaTeX from '@/components/KaTeX';
import {
  factorization,
  markovChainFactorization,
  isFirstOrderMarkovChain,
} from '@/lib/math/graphFactorization';

const NODE_IDS = ['1', '2', '3'];
const POSITIONS: Record<string, { x: number; y: number }> = {
  '1': { x: 80, y: 160 },
  '2': { x: 240, y: 80 },
  '3': { x: 400, y: 160 },
};

type Edge = [string, string];

const PRESETS: { name: string; edges: Edge[]; label: string }[] = [
  {
    name: '链式（一阶马尔可夫）',
    edges: [['1', '2'], ['2', '3']],
    label: '特殊案例：因子分解退化为 p(x_1)p(x_2|x_1)p(x_3|x_2)',
  },
  {
    name: '共同原因',
    edges: [['2', '1'], ['2', '3']],
    label: 'X2 同时影响 X1 与 X3',
  },
  {
    name: '共同结果（V 结构）',
    edges: [['1', '2'], ['3', '2']],
    label: 'X2 是 X1 与 X3 的共同结果',
  },
  {
    name: '全连接',
    edges: [['1', '2'], ['1', '3'], ['2', '3']],
    label: '每个节点都依赖前面所有节点',
  },
];

export default function GraphFactorizationLab() {
  const [edges, setEdges] = useState<Edge[]>(PRESETS[0].edges);

  const toggleEdge = (src: string, dst: string) => {
    const exists = edges.some((e) => e[0] === src && e[1] === dst);
    if (exists) {
      setEdges(edges.filter((e) => !(e[0] === src && e[1] === dst)));
    } else {
      setEdges([...edges, [src, dst]]);
    }
  };

  const { latex, order, parents } = useMemo(
    () => factorization({ nodes: NODE_IDS, edges }),
    [edges],
  );
  const isChain = useMemo(
    () => isFirstOrderMarkovChain({ nodes: NODE_IDS, edges }),
    [edges],
  );
  const chainLatex = useMemo(
    () => markovChainFactorization({ nodes: NODE_IDS, edges }),
    [edges],
  );

  return (
    <InteractiveDemo title="DAG 因子分解实验">
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          切换有向边，观察联合分布如何按 <KaTeX math="p(\\mathbf{x}) = \\prod_i p(x_i \\mid \\text{pa}_i)" /> 分解。
          只有当每个节点最多依赖拓扑排序中的前一个节点时，才是链式分解的特例。
        </p>

        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => setEdges(p.edges)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              {p.name}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <svg viewBox="0 0 480 240" className="w-full" style={{ maxHeight: 240 }}>
              {edges.map(([src, dst]) => {
                const s = POSITIONS[src];
                const t = POSITIONS[dst];
                return (
                  <g key={`edge-${src}-${dst}`}>
                    <defs>
                      <marker
                        id={`gf-arrow-${src}-${dst}`}
                        markerWidth="10"
                        markerHeight="10"
                        refX="18"
                        refY="3"
                        orient="auto"
                        markerUnits="strokeWidth"
                      >
                        <path d="M0,0 L0,6 L9,3 z" fill="#2563eb" />
                      </marker>
                    </defs>
                    <line
                      x1={s.x}
                      y1={s.y}
                      x2={t.x}
                      y2={t.y}
                      stroke="#2563eb"
                      strokeWidth={2}
                      markerEnd={`url(#gf-arrow-${src}-${dst})`}
                    />
                  </g>
                );
              })}
              {NODE_IDS.map((node) => {
                const pos = POSITIONS[node];
                return (
                  <g key={`node-${node}`}>
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={24}
                      fill="#eff6ff"
                      stroke="#374151"
                      strokeWidth={2}
                    />
                    <text
                      x={pos.x}
                      y={pos.y + 5}
                      textAnchor="middle"
                      className="text-sm font-semibold"
                      fill="#1f2937"
                    >
                      {`x_${node}`}
                    </text>
                  </g>
                );
              })}
            </svg>

            <div className="mt-3 grid grid-cols-3 gap-2">
              {NODE_IDS.map((src) =>
                NODE_IDS.map((dst) =>
                  src === dst ? null : (
                    <label
                      key={`${src}-${dst}`}
                      className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={edges.some((e) => e[0] === src && e[1] === dst)}
                        onChange={() => toggleEdge(src, dst)}
                        className="rounded border-gray-300 text-blue-600"
                      />
                      <KaTeX math={`x_${src} \\to x_${dst}`} />
                    </label>
                  ),
                ),
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
              <div className="text-xs text-gray-500 mb-1">拓扑顺序</div>
              <div className="font-mono text-sm text-gray-800">
                {order.map((n) => `x_${n}`).join(' → ')}
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
              <div className="text-xs text-gray-500 mb-1">联合分布分解</div>
              <KaTeX math={latex} display />
            </div>

            {isChain && chainLatex && (
              <div className="bg-emerald-50 rounded-lg border border-emerald-200 p-4 text-sm text-emerald-800">
                这是一个一阶马尔可夫链特例：
                <KaTeX math={chainLatex} display />
              </div>
            )}

            {!isChain && (
              <div className="bg-amber-50 rounded-lg border border-amber-200 p-4 text-sm text-amber-800">
                这不是一阶链；必须使用一般的 DAG 因子分解
                <KaTeX math="p(\\mathbf{x}) = \\prod_i p(x_i \\mid \\text{pa}_i)" />。
              </div>
            )}

            <div className="text-xs text-gray-500">
              父节点集合：
              {NODE_IDS.map((n) => (
                <span key={n} className="mr-3">
                  pa(x_{n}) = {'{'}
                  {parents[n].map((p) => `x_${p}`).join(', ') || '∅'}
                  {'}'}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </InteractiveDemo>
  );
}
