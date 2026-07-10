import { useState } from 'react';
import InteractiveDemo from '@/components/InteractiveDemo';
import { Slider } from '@/components/ui/slider';
import KaTeX from '@/components/KaTeX';

const NODES = [
  { id: 0, x: 120, y: 40, label: 'A' },
  { id: 1, x: 220, y: 90, label: 'B' },
  { id: 2, x: 80, y: 140, label: 'C' },
  { id: 3, x: 180, y: 180, label: 'D' },
];

const EDGES = [
  [0, 1],
  [0, 2],
  [1, 2],
  [1, 3],
  [2, 3],
];

export default function MessagePassingInvariantDemo() {
  const [permuted, setPermuted] = useState(false);
  const [round, setRound] = useState(1);
  const [agg, setAgg] = useState<'mean' | 'sum' | 'max'>('mean');

  const labels = permuted ? ['D', 'B', 'A', 'C'] : ['A', 'B', 'C', 'D'];
  const order = permuted ? [3, 1, 0, 2] : [0, 1, 2, 3];

  const nodeValues = [1.0, 2.0, 3.0, 0.5];

  const aggregated = order.map((origIdx) => {
    const neighbors = EDGES.filter(([u, v]) => u === origIdx || v === origIdx).map(([u, v]) => (u === origIdx ? v : u));
    const vals = neighbors.map((n) => nodeValues[n]);
    if (agg === 'mean') return vals.reduce((a, b) => a + b, 0) / vals.length;
    if (agg === 'sum') return vals.reduce((a, b) => a + b, 0);
    return Math.max(...vals);
  });

  return (
    <InteractiveDemo title="邻居聚合与置换不变性/等变性">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {(['mean', 'sum', 'max'] as const).map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setAgg(a)}
                className={`px-3 py-1 rounded-md text-sm border ${agg === a ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300'}`}
              >
                {a === 'mean' ? '均值聚合' : a === 'sum' ? '求和聚合' : '最大聚合'}
              </button>
            ))}
          </div>
          <div>
            <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
              <span>消息传递轮数</span>
              <span>{round}</span>
            </div>
            <Slider value={[round]} min={1} max={3} step={1} onValueChange={(v) => setRound(v[0])} />
          </div>
          <button
            type="button"
            onClick={() => setPermuted((p) => !p)}
            className="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm hover:bg-gray-50"
          >
            {permuted ? '恢复原始编号' : '打乱节点编号'}
          </button>
          <div className="text-sm text-gray-700 space-y-2">
            <p><strong>节点级表示：</strong>若把节点编号重新排列，聚合结果按同样方式排列——这是置换等变（permutation equivariant）。</p>
            <p><strong>图级输出：</strong>对聚合结果再做全局求和/平均，节点重排不改变最终标量——这是置换不变（permutation invariant）。</p>
            <p><strong>聚合函数本身：</strong>mean/sum/max 都是置换不变的操作，因此消息传递天然保持图的对称性。</p>
            <KaTeX math={String.raw`m_v^{(l+1)} = \gamma^{(l)}\!\left(h_v^{(l)}, \bigoplus_{u\in\mathcal{N}(v)} \phi^{(l)}(h_u^{(l)}, h_v^{(l)}, e_{uv})\right)`} />
          </div>
        </div>

        <div className="space-y-4">
          <svg viewBox="0 0 300 240" className="w-full h-64 bg-gray-50 border rounded-lg">
            {EDGES.map(([u, v], i) => (
              <line
                key={i}
                x1={NODES[order[u]].x}
                y1={NODES[order[u]].y}
                x2={NODES[order[v]].x}
                y2={NODES[order[v]].y}
                stroke="#9ca3af"
                strokeWidth={2}
              />
            ))}
            {order.map((origIdx, i) => (
              <g key={origIdx}>
                <circle cx={NODES[origIdx].x} cy={NODES[origIdx].y} r={24} fill="#bfdbfe" stroke="#2563eb" strokeWidth={2} />
                <text x={NODES[origIdx].x} y={NODES[origIdx].y + 4} textAnchor="middle" fontSize={12} fill="#1e3a8a">
                  {labels[i]}
                </text>
                <text x={NODES[origIdx].x} y={NODES[origIdx].y + 42} textAnchor="middle" fontSize={10} fill="#059669">
                  h={aggregated[i].toFixed(2)}
                </text>
              </g>
            ))}
          </svg>
          <p className="text-sm text-gray-700">
            当前使用 <strong>{agg === 'mean' ? 'mean' : agg === 'sum' ? 'sum' : 'max'}</strong> 聚合。注意：无论节点编号如何打乱，同一物理节点（如 A/D）的聚合值不变，只是标签顺序改变。
          </p>
        </div>
      </div>
    </InteractiveDemo>
  );
}
