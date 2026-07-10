import { useState, useMemo } from 'react';
import InteractiveDemo from '@/components/InteractiveDemo';

/* -------------------------------------------------------------------------- */
/* 计算图节点                                                                 */
/* -------------------------------------------------------------------------- */
type OpType = 'input' | 'weight' | 'add' | 'multiply' | 'sin' | 'exp' | 'relu' | 'sigmoid' | 'square';

type GraphNode = {
  id: string;
  op: OpType;
  inputs: string[];        // input node ids
  value: number;            // primal (forward)
  grad: number;             // adjoint (backward)
  localGrad: number | null; // local derivative ∂out/∂in (per input)
  x: number;                // SVG position
  y: number;
  fixed?: boolean;          // input/weight not trainable?
};

/* -------------------------------------------------------------------------- */
/* 预设计算图：f(x,w₁,w₂) = w₂ * sin(w₁ * x + 1)                              */
/* -------------------------------------------------------------------------- */
const NODES: GraphNode[] = [
  { id: 'x',   op: 'input',    inputs: [],       value: 2.0, grad: 0, localGrad: null, x: 80,  y: 160, fixed: true },
  { id: 'w1',  op: 'weight',   inputs: [],       value: 0.8, grad: 0, localGrad: null, x: 80,  y: 60,  fixed: false },
  { id: 'b',   op: 'input',    inputs: [],       value: 1.0, grad: 0, localGrad: null, x: 80,  y: 280, fixed: true },
  { id: 'mul1',op: 'multiply', inputs: ['x','w1'],value:0,  grad: 0, localGrad: null, x: 220, y: 110 },
  { id: 'add1',op: 'add',      inputs: ['mul1','b'],value:0,grad: 0, localGrad: null, x: 360, y: 170 },
  { id: 'sin1',op: 'sin',      inputs: ['add1'],  value:0,  grad: 0, localGrad: null, x: 500, y: 170 },
  { id: 'w2',  op: 'weight',   inputs: [],       value: 1.5, grad: 0, localGrad: null, x: 500, y: 280, fixed: false },
  { id: 'mul2',op: 'multiply', inputs: ['sin1','w2'],value:0,grad:0,localGrad:null,x: 640, y: 220 },
];

function evalNode(node: GraphNode, nodeMap: Map<string, GraphNode>) {
  const getVal = (id: string) => nodeMap.get(id)!.value;
  switch (node.op) {
    case 'input': case 'weight': return node.value;
    case 'add': return node.inputs.reduce((s, id) => s + getVal(id), 0);
    case 'multiply': return node.inputs.reduce((p, id) => p * getVal(id), 1);
    case 'sin': return Math.sin(getVal(node.inputs[0]));
    case 'exp': return Math.exp(getVal(node.inputs[0]));
    case 'relu': return Math.max(0, getVal(node.inputs[0]));
    case 'sigmoid': return 1 / (1 + Math.exp(-getVal(node.inputs[0])));
    case 'square': { const v = getVal(node.inputs[0]); return v * v; }
    default: return 0;
  }
}

function localDeriv(op: OpType, outVal: number, inVals: number[], inIdx: number): number {
  switch (op) {
    case 'add': return 1;
    case 'multiply': {
      // For multiply(a,b): ∂/∂a = b
      const other = inVals[1 - inIdx];
      return other;
    }
    case 'sin': return Math.cos(inVals[0]);
    case 'exp': return Math.exp(inVals[0]);
    case 'relu': return inVals[0] > 0 ? 1 : 0;
    case 'sigmoid': return outVal * (1 - outVal);
    case 'square': return 2 * inVals[0];
    default: return 0;
  }
}

/* -------------------------------------------------------------------------- */
/* SVG 尺寸                                                                   */
/* -------------------------------------------------------------------------- */
const W = 760, H = 360;

export default function BackpropagationLab() {
  const [nodes, setNodes] = useState<GraphNode[]>(() => NODES.map((n) => ({ ...n })));
  const [phase, setPhase] = useState<'idle' | 'forward' | 'backward'>('idle');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [topoOrder, setTopoOrder] = useState<string[]>([]);
  const [revOrder, setRevOrder] = useState<string[]>([]);
  const [fdH, setFdH] = useState(0.001);
  const [fdGrad, setFdGrad] = useState<number | null>(null);
  const [showNumerical, setShowNumerical] = useState(false);

  const nodeMap = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);

  // Topological sort
  const topoSort = (): string[] => {
    const inDegree = new Map<string, number>();
    const order: string[] = [];
    nodes.forEach((n) => inDegree.set(n.id, n.inputs.length));
    const queue = nodes.filter((n) => n.inputs.length === 0).map((n) => n.id);
    while (queue.length > 0) {
      const id = queue.shift()!;
      order.push(id);
      nodes
        .filter((n) => n.inputs.includes(id))
        .forEach((n) => {
          const deg = (inDegree.get(n.id) ?? 1) - 1;
          inDegree.set(n.id, deg);
          if (deg === 0) queue.push(n.id);
        });
    }
    return order;
  };

  const forwardStep = () => {
    if (phase === 'idle') {
      const order = topoSort();
      setTopoOrder(order);
      setPhase('forward');
      setCurrentIdx(0);
      // Reset all values except inputs
      setNodes((prev) => prev.map((n) => (n.op === 'input' || n.op === 'weight' ? n : { ...n, value: 0, grad: 0, localGrad: null })));
      return;
    }
    if (phase === 'forward' && currentIdx < topoOrder.length) {
      const id = topoOrder[currentIdx];
      const n = nodeMap.get(id)!;
      if (n.op !== 'input' && n.op !== 'weight') {
        const newVal = evalNode(n, nodeMap);
        setNodes((prev) => prev.map((nn) => (nn.id === id ? { ...nn, value: newVal } : nn)));
      }
      if (currentIdx === topoOrder.length - 1) {
        // Last node - set its grad to 1 (loss gradient)
        const lastId = topoOrder[topoOrder.length - 1];
        setNodes((prev) => prev.map((nn) => (nn.id === lastId ? { ...nn, grad: 1 } : nn)));
      }
      setCurrentIdx(currentIdx + 1);
    } else if (phase === 'forward' && currentIdx >= topoOrder.length) {
      // Start backward
      const rev = [...topoOrder].reverse();
      setRevOrder(rev);
      setPhase('backward');
      setCurrentIdx(1); // Skip last (already has grad=1)
    }
  };

  const backwardStep = () => {
    if (phase === 'backward' && currentIdx < revOrder.length) {
      const id = revOrder[currentIdx];
      const n = nodeMap.get(id)!;
      // Compute local gradients for each input
      const inVals = n.inputs.map((inId) => nodeMap.get(inId)!.value);
      for (let i = 0; i < n.inputs.length; i++) {
        const localG = localDeriv(n.op, n.value, inVals, i);
        setNodes((prev) =>
          prev.map((nn) =>
            nn.id === n.inputs[i]
              ? { ...nn, grad: nn.grad + n.grad * localG }
              : nn.id === id
              ? { ...nn, localGrad: localG }
              : nn,
          ),
        );
      }
      setCurrentIdx(currentIdx + 1);
    }
  };

  const resetAll = () => {
    setNodes(NODES.map((n) => ({ ...n })));
    setPhase('idle');
    setCurrentIdx(0);
    setTopoOrder([]);
    setRevOrder([]);
    setFdGrad(null);
  };

  // Numerical gradient check for w1
  const checkNumerical = () => {
    resetAll();
    // Run full forward
    const order = topoSort();
    const nm = new Map(nodes.map((n) => [n.id, { ...n }]));
    order.forEach((id) => {
      const n = nm.get(id)!;
      if (n.op !== 'input' && n.op !== 'weight') n.value = evalNode(n, nm);
    });
    const out1 = nm.get('mul2')!.value;

    const w1Node = nm.get('w1')!;
    w1Node.value += fdH;
    order.forEach((id) => {
      const n = nm.get(id)!;
      if (n.op !== 'input' && n.op !== 'weight') n.value = evalNode(n, nm);
    });
    const out2 = nm.get('mul2')!.value;
    setFdGrad((out2 - out1) / fdH);
    setShowNumerical(true);
  };

  // SVG coordinate helpers
  const opColors: Record<OpType, string> = {
    input: '#3b82f6', weight: '#f59e0b', add: '#10b981', multiply: '#ef4444',
    sin: '#8b5cf6', exp: '#8b5cf6', relu: '#8b5cf6', sigmoid: '#8b5cf6', square: '#8b5cf6',
  };

  const opLabels: Record<OpType, string> = {
    input: '输入', weight: '权重', add: '+', multiply: '×', sin: 'sin',
    exp: 'exp', relu: 'ReLU', sigmoid: 'σ', square: '(·)²',
  };

  // Edges
  const edges = useMemo(() => {
    const e: { from: GraphNode; to: GraphNode; grad: number }[] = [];
    nodes.forEach((n) => {
      n.inputs.forEach((inId) => {
        const from = nodeMap.get(inId)!;
        const arrowWidth = Math.min(6, 1 + Math.abs(from.grad) * 3);
        e.push({ from, to: n, grad: arrowWidth });
      });
    });
    return e;
  }, [nodes, nodeMap]);

  return (
    <InteractiveDemo title="反向传播实验：可交互计算图">
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          下图计算 <code>f(x,w₁,w₂) = w₂ · sin(w₁ · x + 1)</code>。
          点击 <strong>Forward</strong> 逐步计算每个节点的值（primal），再点击 <strong>Backward</strong> 逐步传播梯度（adjoint）。
          箭头粗细 = 梯度大小。
        </p>

        {/* Controls */}
        <div className="flex flex-wrap gap-2 items-center">
          <button onClick={forwardStep} disabled={phase === 'backward'}
            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:bg-gray-300">
            {phase === 'idle' ? '▶ Forward（开始）' : phase === 'forward' ? `▶ Forward (${currentIdx}/${topoOrder.length})` : 'Forward ✓'}
          </button>
          <button onClick={backwardStep} disabled={phase !== 'backward'}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:bg-gray-300">
            {phase === 'backward' ? `◀ Backward (${currentIdx}/${revOrder.length})` : '◀ Backward'}
          </button>
          <button onClick={resetAll} className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200">
            ↺ 重置
          </button>
          <button onClick={checkNumerical} className="px-3 py-2 bg-indigo-100 text-indigo-700 rounded-lg text-sm hover:bg-indigo-200">
            🔢 数值梯度校验
          </button>
        </div>

        {/* SVG Graph */}
        <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-x-auto">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minWidth: 700, maxHeight: 380 }}>
            {/* Edges */}
            {edges.map((e, i) => (
              <g key={`edge-${i}`}>
                <line x1={e.from.x + 28} y1={e.from.y} x2={e.to.x - 4} y2={e.to.y}
                  stroke="#94a3b8" strokeWidth={e.grad} opacity={0.6} />
                {e.from.grad !== 0 && (
                  <text x={(e.from.x + e.to.x) / 2 - 20} y={(e.from.y + e.to.y) / 2 - 6}
                    className="text-[9px]" fill="#ef4444">
                    ∂={e.from.grad.toFixed(2)}
                  </text>
                )}
              </g>
            ))}
            {/* Nodes */}
            {nodes.map((n) => {
              const isActive = phase !== 'idle' && (
                (phase === 'forward' && currentIdx > 0 && topoOrder[currentIdx - 1] === n.id) ||
                (phase === 'backward' && revOrder[currentIdx - 1] === n.id)
              );
              return (
                <g key={n.id}>
                  <rect x={n.x} y={n.y - 20} width={56} height={40} rx={8}
                    fill={opColors[n.op]} opacity={isActive ? 1 : 0.7}
                    stroke={isActive ? '#1f2937' : 'none'} strokeWidth={isActive ? 2 : 0} />
                  <text x={n.x + 28} y={n.y - 2} textAnchor="middle" className="text-[11px] font-bold" fill="white">
                    {opLabels[n.op]}
                  </text>
                  <text x={n.x + 28} y={n.y + 14} textAnchor="middle" className="text-[9px]" fill="white">
                    {n.value.toFixed(2)}
                  </text>
                  {/* Gradient below */}
                  {n.grad !== 0 && (
                    <text x={n.x + 28} y={n.y + 32} textAnchor="middle" className="text-[9px] font-bold" fill="#ef4444">
                      ∇{n.grad.toFixed(2)}
                    </text>
                  )}
                </g>
              );
            })}
            {/* Labels for input nodes */}
            <text x={108} y={155} className="text-[10px]" fill="#6b7280">x={nodes[0].value}</text>
            <text x={108} y={55} className="text-[10px]" fill="#f59e0b">w₁={nodes[1].value.toFixed(1)}</text>
            <text x={528} y={275} className="text-[10px]" fill="#f59e0b">w₂={nodes[6].value.toFixed(1)}</text>
          </svg>
        </div>

        {/* Value table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left border">节点</th>
                <th className="p-2 text-left border">操作</th>
                <th className="p-2 text-right border">前向值</th>
                <th className="p-2 text-right border">局部梯度</th>
                <th className="p-2 text-right border">累积梯度</th>
              </tr>
            </thead>
            <tbody>
              {nodes.map((n) => (
                <tr key={n.id} className="border-b hover:bg-gray-50">
                  <td className="p-2 border font-mono">{n.id}</td>
                  <td className="p-2 border">{opLabels[n.op]}</td>
                  <td className="p-2 border text-right font-mono">{n.value.toFixed(4)}</td>
                  <td className="p-2 border text-right font-mono">{n.localGrad?.toFixed(4) ?? '-'}</td>
                  <td className="p-2 border text-right font-mono font-bold">{n.grad.toFixed(4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Numerical gradient */}
        {showNumerical && fdGrad !== null && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
            <p className="text-sm font-medium text-indigo-800">
              数值梯度校验（∂f/∂w₁）：
            </p>
            <div className="flex gap-4 text-xs mt-1">
              <span>分析梯度: <strong className="font-mono">{nodes[1].grad.toFixed(6)}</strong></span>
              <span>有限差分 (h={fdH}): <strong className="font-mono">{fdGrad.toFixed(6)}</strong></span>
              <span>相对误差: <strong className="font-mono">{Math.abs(fdGrad - nodes[1].grad) / Math.max(1e-12, Math.abs(fdGrad)) < 1e-5 ? '✓ < 10⁻⁵' : (Math.abs(fdGrad - nodes[1].grad) / Math.max(1e-12, Math.abs(fdGrad))).toExponential(2)}</strong></span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-gray-500">h:</span>
              <input type="number" value={fdH} step={0.0001} min={1e-10} max={1}
                onChange={(e) => setFdH(Number(e.target.value))}
                className="w-24 px-2 py-1 border rounded text-xs font-mono" />
            </div>
          </div>
        )}

        {/* Cost comparison */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm">
          <p><strong>⏱ 计算成本比较：</strong></p>
          <p className="text-gray-600 mt-1">
            反向模式一次前向+一次后向即可计算损失对所有 <strong>{nodes.filter(n => !n.fixed).length} 个参数</strong>的梯度（复杂度约为前向的常数倍）。
            有限差分需要每个参数至少一次额外前向计算，N 个参数需要 O(N) 次前向。
            当参数数量达到百万级时，反传的优势是指数级的。
          </p>
        </div>
      </div>
    </InteractiveDemo>
  );
}
