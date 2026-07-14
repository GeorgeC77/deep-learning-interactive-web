import { useMemo, useState } from 'react';
import InteractiveDemo from '@/components/InteractiveDemo';
import KaTeX from '@/components/KaTeX';
import { isDSeparated, activeTrails, type DAG } from '@/lib/math/dSeparation';

type Preset = {
  id: string;
  name: string;
  description: string;
  dag: DAG;
  query: [string, string];
  /** Nodes the user is allowed to condition on. */
  conditionable: string[];
  positions: Record<string, { x: number; y: number }>;
};

const PRESETS: Preset[] = [
  {
    id: 'chain',
    name: '链式 A → B → C',
    description: '无条件时 A 与 C 相关；给定 B 后路径被阻断。',
    dag: { nodes: ['A', 'B', 'C'], edges: [['A', 'B'], ['B', 'C']] },
    query: ['A', 'C'],
    conditionable: ['B'],
    positions: { A: { x: 80, y: 160 }, B: { x: 240, y: 160 }, C: { x: 400, y: 160 } },
  },
  {
    id: 'fork',
    name: '分岔 A ← B → C',
    description: 'B 是共同原因；给定 B 后 A 与 C 独立。',
    dag: { nodes: ['A', 'B', 'C'], edges: [['B', 'A'], ['B', 'C']] },
    query: ['A', 'C'],
    conditionable: ['B'],
    positions: { A: { x: 80, y: 240 }, B: { x: 240, y: 80 }, C: { x: 400, y: 240 } },
  },
  {
    id: 'collider',
    name: '汇聚 A → B ← C',
    description: '无条件时 A 与 C 独立；给定 B 后二者相关（解释消除）。',
    dag: { nodes: ['A', 'B', 'C'], edges: [['A', 'B'], ['C', 'B']] },
    query: ['A', 'C'],
    conditionable: ['B'],
    positions: { A: { x: 80, y: 80 }, B: { x: 240, y: 240 }, C: { x: 400, y: 80 } },
  },
  {
    id: 'collider-descendant',
    name: '汇聚 + 子孙 A → B ← C, B → D',
    description: '给定 B 的子孙 D 也会解开汇聚点，使 A 与 C 相关。',
    dag: {
      nodes: ['A', 'B', 'C', 'D'],
      edges: [['A', 'B'], ['C', 'B'], ['B', 'D']],
    },
    query: ['A', 'C'],
    conditionable: ['B', 'D'],
    positions: {
      A: { x: 80, y: 80 },
      B: { x: 240, y: 240 },
      C: { x: 400, y: 80 },
      D: { x: 240, y: 400 },
    },
  },
];

export default function DSeparationLab() {
  const [presetIndex, setPresetIndex] = useState(0);
  const [observed, setObserved] = useState<Set<string>>(new Set());

  const preset = PRESETS[presetIndex];

  const toggleObserved = (node: string) => {
    const next = new Set(observed);
    if (next.has(node)) next.delete(node);
    else next.add(node);
    setObserved(next);
  };

  const separated = useMemo(
    () => isDSeparated(preset.dag, preset.query[0], preset.query[1], observed),
    [preset, observed],
  );
  const active = useMemo(
    () => activeTrails(preset.dag, preset.query[0], preset.query[1], observed),
    [preset, observed],
  );

  const activeEdges = useMemo(() => {
    const edgeSet = new Set<string>();
    for (const trail of active) {
      for (let i = 0; i < trail.length - 1; i++) {
        const a = trail[i];
        const b = trail[i + 1];
        edgeSet.add(`${a}-${b}`);
        edgeSet.add(`${b}-${a}`);
      }
    }
    return edgeSet;
  }, [active]);

  return (
    <InteractiveDemo title="d-分离实验：点击节点进行条件化">
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          选择一种基本图结构，点击节点将其加入条件集 Z，观察 A 与 C 之间的路径是否被阻断。
          红色连线表示至少存在一条活跃路径；灰色连线表示当前条件下不活跃。
        </p>

        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => {
                setPresetIndex(idx);
                setObserved(new Set());
              }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                idx === presetIndex
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>

        <div className="text-sm text-gray-700 bg-slate-50 p-3 rounded-lg border">
          {preset.description}
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          {preset.conditionable.map((node) => (
            <button
              key={node}
              onClick={() => toggleObserved(node)}
              className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                observed.has(node)
                  ? 'bg-amber-100 border-amber-400 text-amber-800'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              观测 {node}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <svg viewBox="0 0 480 480" className="w-full" style={{ maxHeight: 360 }}>
            {preset.dag.edges.map(([src, dst]) => {
              const s = preset.positions[src];
              const t = preset.positions[dst];
              const isActive = activeEdges.has(`${src}-${dst}`);
              return (
                <g key={`edge-${src}-${dst}`}>
                  <defs>
                    <marker
                      id={`arrow-${src}-${dst}`}
                      markerWidth="10"
                      markerHeight="10"
                      refX="18"
                      refY="3"
                      orient="auto"
                      markerUnits="strokeWidth"
                    >
                      <path d="M0,0 L0,6 L9,3 z" fill={isActive ? '#ef4444' : '#9ca3af'} />
                    </marker>
                  </defs>
                  <line
                    x1={s.x}
                    y1={s.y}
                    x2={t.x}
                    y2={t.y}
                    stroke={isActive ? '#ef4444' : '#9ca3af'}
                    strokeWidth={isActive ? 3 : 2}
                    markerEnd={`url(#arrow-${src}-${dst})`}
                  />
                </g>
              );
            })}

            {preset.dag.nodes.map((node) => {
              const pos = preset.positions[node];
              const isObserved = observed.has(node);
              const isQuery = preset.query.includes(node);
              return (
                <g key={`node-${node}`} onClick={() => toggleObserved(node)} className="cursor-pointer">
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={24}
                    fill={isObserved ? '#fbbf24' : '#eff6ff'}
                    stroke={isQuery ? '#2563eb' : '#374151'}
                    strokeWidth={isQuery ? 3 : 2}
                  />
                  <text
                    x={pos.x}
                    y={pos.y + 5}
                    textAnchor="middle"
                    className="text-sm font-semibold"
                    fill="#1f2937"
                  >
                    {node}
                  </text>
                  {isObserved && (
                    <text
                      x={pos.x}
                      y={pos.y - 32}
                      textAnchor="middle"
                      className="text-[10px]"
                      fill="#b45309"
                    >
                      观测
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        <div
          className={`rounded-lg p-4 border text-sm ${
            separated
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <strong>结论：</strong>
          在条件集 <KaTeX math={`Z = \\{${Array.from(observed).join(', ') || '\\emptyset'}\\}`} /> 下，
          <KaTeX math={`A`} /> 与 <KaTeX math={`C`} />{' '}
          {separated ? 'd-分离（条件独立）。' : '不 d-分离（可能相关）。'}
          {active.length > 0 && !separated && (
            <span className="block mt-1">
              活跃路径：{active.map((t) => t.join(' → ')).join('；')}
            </span>
          )}
        </div>
      </div>
    </InteractiveDemo>
  );
}
