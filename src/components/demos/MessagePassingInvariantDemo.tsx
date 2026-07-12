import { useState, useMemo } from 'react';
import InteractiveDemo from '@/components/InteractiveDemo';
import { Slider } from '@/components/ui/slider';
import KaTeX from '@/components/KaTeX';
import {
  adjacencyFromEdges,
  messagePassing,
  readout,
  permutationEquivarianceError,
  permutationInvarianceError,
  nodeFeatureVariance,
  pairwiseDistances,
  permuteVector,
  type Activation,
} from '@/lib/math/gnn';

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
];

const ADJ = adjacencyFromEdges(NODES.length, EDGES);
const INITIAL_FEATURES = [1.0, 2.0, 3.0, 0.5];

export default function MessagePassingInvariantDemo() {
  const [permuted, setPermuted] = useState(false);
  const [round, setRound] = useState(0);
  const [selectedNode, setSelectedNode] = useState<number | null>(0);
  const [activation, setActivation] = useState<Activation>('tanh');
  const [wSelf, setWSelf] = useState(0.5);
  const [wNeighbor, setWNeighbor] = useState(0.5);

  const perm = useMemo(
    () => (permuted ? [3, 1, 0, 2] : [0, 1, 2, 3]),
    [permuted],
  );

  const history = useMemo(
    () => messagePassing(ADJ, INITIAL_FEATURES, 3, wSelf, wNeighbor, activation),
    [wSelf, wNeighbor, activation],
  );

  const displayValues = permuteVector(history[round], perm);
  const displayLabels = permuteVector(NODES.map((n) => n.label), perm);
  const displayOrder = perm;

  const variance = nodeFeatureVariance(history[round]);
  const distances = pairwiseDistances(history[round]);

  const equiErr = permutationEquivarianceError(
    ADJ,
    INITIAL_FEATURES,
    perm,
    round,
    wSelf,
    wNeighbor,
    activation,
  );
  const invErr = permutationInvarianceError(
    ADJ,
    INITIAL_FEATURES,
    perm,
    round,
    wSelf,
    wNeighbor,
    activation,
  );

  const kHopNeighbors = useMemo(() => {
    if (selectedNode === null) return new Set<number>();
    const hop1 = new Set<number>();
    for (let j = 0; j < NODES.length; j++) {
      if (ADJ[selectedNode][j] !== 0) hop1.add(j);
    }
    return hop1;
  }, [selectedNode]);

  return (
    <InteractiveDemo title="消息传递与置换不变性 / 等变性">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {(['tanh', 'relu'] as const).map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setActivation(a)}
                className={`px-3 py-1 rounded-md text-sm border ${
                  activation === a
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300'
                }`}
              >
                {a === 'tanh' ? 'tanh' : 'ReLU'}
              </button>
            ))}
          </div>

          <div>
            <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
              <span>消息传递轮数</span>
              <span>{round}</span>
            </div>
            <Slider value={[round]} min={0} max={3} step={1} onValueChange={(v) => setRound(v[0])} />
          </div>

          <div>
            <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
              <span>自权重 w_self</span>
              <span>{wSelf.toFixed(2)}</span>
            </div>
            <Slider value={[wSelf]} min={0} max={1} step={0.05} onValueChange={(v) => setWSelf(v[0])} />
          </div>

          <div>
            <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
              <span>邻居权重 w_neighbor</span>
              <span>{wNeighbor.toFixed(2)}</span>
            </div>
            <Slider value={[wNeighbor]} min={0} max={1} step={0.05} onValueChange={(v) => setWNeighbor(v[0])} />
          </div>

          <button
            type="button"
            onClick={() => setPermuted((p) => !p)}
            className="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm hover:bg-gray-50"
          >
            {permuted ? '恢复原始编号' : '打乱节点编号'}
          </button>

          <div className="text-sm text-gray-700 space-y-2">
            <p>
              <strong>节点级表示：</strong>若把节点编号重新排列，聚合结果按同样方式排列——这是置换等变（permutation equivariant）。
            </p>
            <p>
              <strong>图级输出：</strong>对聚合结果再做全局平均，节点重排不改变最终标量——这是置换不变（permutation invariant）。
            </p>
            <p>
              <strong>过度平滑：</strong>多轮消息传递后，节点表示趋于一致，方差下降。
            </p>
            <KaTeX
              math={String.raw`h_i^{(l+1)} = \sigma\!\left(w_{\text{self}} h_i^{(l)} + w_{\text{neigh}} \frac{1}{|\mathcal{N}(i)|}\sum_{j\in\mathcal{N}(i)} h_j^{(l)}\right)`}
            />
          </div>
        </div>

        <div className="space-y-4">
          <svg viewBox="0 0 300 240" className="w-full h-64 bg-gray-50 border rounded-lg">
            {EDGES.map(([u, v], i) => {
              const a = perm[u];
              const b = perm[v];
              const highlighted =
                selectedNode !== null &&
                ((a === selectedNode && kHopNeighbors.has(b)) ||
                  (b === selectedNode && kHopNeighbors.has(a)));
              return (
                <line
                  key={i}
                  x1={NODES[a].x}
                  y1={NODES[a].y}
                  x2={NODES[b].x}
                  y2={NODES[b].y}
                  stroke={highlighted ? '#f59e0b' : '#9ca3af'}
                  strokeWidth={highlighted ? 3 : 2}
                />
              );
            })}
            {displayOrder.map((origIdx, i) => {
              const isSelected = selectedNode === origIdx;
              return (
                <g
                  key={origIdx}
                  className="cursor-pointer"
                  onClick={() => setSelectedNode(origIdx)}
                >
                  <circle
                    cx={NODES[origIdx].x}
                    cy={NODES[origIdx].y}
                    r={isSelected ? 28 : 24}
                    fill={isSelected ? '#fde68a' : '#bfdbfe'}
                    stroke={isSelected ? '#d97706' : '#2563eb'}
                    strokeWidth={2}
                  />
                  <text
                    x={NODES[origIdx].x}
                    y={NODES[origIdx].y + 4}
                    textAnchor="middle"
                    fontSize={12}
                    fill="#1e3a8a"
                  >
                    {displayLabels[i]}
                  </text>
                  <text
                    x={NODES[origIdx].x}
                    y={NODES[origIdx].y + 46}
                    textAnchor="middle"
                    fontSize={10}
                    fill="#059669"
                  >
                    h={displayValues[i].toFixed(2)}
                  </text>
                </g>
              );
            })}
          </svg>

          <div className="grid grid-cols-2 gap-3 text-center text-sm">
            <div className="rounded-lg p-2 bg-blue-50">
              <div className="text-xs text-gray-600">节点特征方差</div>
              <div className="font-bold text-blue-700">{variance.toFixed(4)}</div>
            </div>
            <div className="rounded-lg p-2 bg-emerald-50">
              <div className="text-xs text-gray-600">图级读出处</div>
              <div className="font-bold text-emerald-700">{readout([history[round]]).toFixed(4)}</div>
            </div>
            <div className="rounded-lg p-2 bg-purple-50">
              <div className="text-xs text-gray-600">置换等变误差</div>
              <div className="font-bold text-purple-700">{equiErr.toExponential(2)}</div>
            </div>
            <div className="rounded-lg p-2 bg-amber-50">
              <div className="text-xs text-gray-600">置换不变误差</div>
              <div className="font-bold text-amber-700">{invErr.toExponential(2)}</div>
            </div>
          </div>

          {selectedNode !== null && (
            <div className="text-sm text-gray-700">
              <p className="font-medium mb-1">
                选中节点 {displayLabels[displayOrder.indexOf(selectedNode)]} 到其它节点的表示距离
              </p>
              <div className="grid grid-cols-4 gap-2 text-center">
                {displayOrder.map((origIdx, i) => (
                  <div key={origIdx} className="rounded bg-gray-100 p-1">
                    <div className="text-xs text-gray-500">{displayLabels[i]}</div>
                    <div className="font-mono">{distances[selectedNode][origIdx].toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="text-sm text-gray-700">
            当前使用 <strong>{activation === 'tanh' ? 'tanh' : 'ReLU'}</strong>{' '}
            激活。点击节点可高亮其一阶邻居并查看节点间距离。
          </p>
        </div>
      </div>
    </InteractiveDemo>
  );
}
