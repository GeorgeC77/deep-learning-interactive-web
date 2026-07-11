import { useState, useCallback, useMemo } from 'react';
import InteractiveDemo from '@/components/InteractiveDemo';
import { forwardPass, backwardPass, centralDiff, evalNode, localDeriv, topoSort, type NodeSpec, type OpType } from '@/lib/math/backprop';

const INITIAL_GRAPH: NodeSpec[] = [
  { id: 'x',   op: 'input',    inputs: [],       value: 2.0 },
  { id: 'w1',  op: 'weight',   inputs: [],       value: 0.8 },
  { id: 'b',   op: 'input',    inputs: [],       value: 1.0 },
  { id: 'mul1',op: 'multiply', inputs: ['x','w1'],value:0 },
  { id: 'add1',op: 'add',      inputs: ['mul1','b'],value:0 },
  { id: 'sin1',op: 'sin',      inputs: ['add1'],  value:0 },
  { id: 'w2',  op: 'weight',   inputs: [],       value: 1.5 },
  { id: 'mul2',op: 'multiply', inputs: ['sin1','w2'],value:0 },
];

const BRANCHED_GRAPH: NodeSpec[] = [
  { id: 'x',   op: 'input',    inputs: [],       value: 2.0 },
  { id: 'sq',  op: 'square',   inputs: ['x'],    value: 0 },
  { id: 'sn',  op: 'sin',      inputs: ['x'],    value: 0 },
  { id: 'out', op: 'add',      inputs: ['sq','sn'], value:0 },
];

const opColors: Record<string, string> = {
  input:'#3b82f6',weight:'#f59e0b',add:'#10b981',multiply:'#ef4444',
  sin:'#8b5cf6',exp:'#8b5cf6',relu:'#8b5cf6',sigmoid:'#8b5cf6',square:'#8b5cf6',
};
const opLabels: Record<string, string> = {
  input:'输入',weight:'权重',add:'+',multiply:'×',
  sin:'sin',exp:'exp',relu:'ReLU',sigmoid:'σ',square:'(·)²',
};
const nodePos: Record<string, [number, number]> = {
  x:[80,160],w1:[80,60],b:[80,280],mul1:[220,110],add1:[360,170],sin1:[500,170],w2:[500,280],mul2:[640,220],
};
const branchedPos: Record<string, [number, number]> = {
  x:[80,160],sq:[260,80],sn:[260,240],out:[440,160],
};

export default function BackpropagationLab() {
  const [useBranched, setUseBranched] = useState(false);
  const [graph, setGraph] = useState<NodeSpec[]>(INITIAL_GRAPH);
  const [fwdVals, setFwdVals] = useState<Record<string, number> | null>(null);
  const [bwdResult, setBwdResult] = useState<{
    grads: Record<string, number>;
    localGrads: Record<string, Record<string, number>>;
  } | null>(null);
  const [phase, setPhase] = useState<'idle' | 'forward' | 'backward'>('idle');
  const fdH = 0.001;
  const [fdGrad, setFdGrad] = useState<{ id: string; value: number } | null>(null);

  // Step-by-step state
  const [stepFwdIdx, setStepFwdIdx] = useState<number | null>(null);
  const [stepBwdIdx, setStepBwdIdx] = useState<number | null>(null);
  const [stepFwdVals, setStepFwdVals] = useState<Record<string, number>>({});
  const [stepBwdGrads, setStepBwdGrads] = useState<Record<string, number>>({});

  const pos = useBranched ? branchedPos : nodePos;

  const order = useMemo(() => topoSort(graph), [graph]);
  const revOrder = useMemo(() => [...order].reverse(), [order]);

  const leafNodes = useMemo(() => graph.filter((n) => n.op === 'input' || n.op === 'weight'), [graph]);

  const runForward = useCallback(() => {
    const vals = forwardPass(graph);
    setFwdVals(vals); setPhase('forward');
    setStepFwdIdx(null); setStepBwdIdx(null); setStepFwdVals({}); setStepBwdGrads({});
  }, [graph]);

  const runBackward = useCallback(() => {
    if (!fwdVals) return;
    setBwdResult(backwardPass(graph, fwdVals)); setPhase('backward');
  }, [fwdVals, graph]);

  const stepForward = useCallback(() => {
    const next = stepFwdIdx === null ? 0 : stepFwdIdx + 1;
    if (next >= order.length) return;
    const node = graph.find((n) => n.id === order[next])!;
    const vals: Record<string, number> = {};
    if (node.op === 'input' || node.op === 'weight') vals[node.id] = node.value;
    else vals[node.id] = evalNode(node.op as OpType, node.inputs.map((inId) => stepFwdVals[inId]));
    setStepFwdVals((prev) => ({ ...prev, ...vals }));
    setStepFwdIdx(next);
  }, [stepFwdIdx, graph, order, stepFwdVals]);

  const stepBackward = useCallback(() => {
    const next = stepBwdIdx === null ? 0 : stepBwdIdx + 1;
    if (next >= revOrder.length) return;
    const nodeId = revOrder[next];
    const node = graph.find((n) => n.id === nodeId)!;
    setStepBwdGrads((prev) => {
      const g = { ...prev };
      if (stepBwdIdx === null) {
        for (const id of order) g[id] = 0;
        g[revOrder[0]] = 1; // output node adjoint
      }
      if (node.inputs.length > 0) {
        const inVals = node.inputs.map((inId) => stepFwdVals[inId] ?? fwdVals?.[inId] ?? 0);
        const outVal = stepFwdVals[nodeId] ?? fwdVals?.[nodeId] ?? 0;
        for (let i = 0; i < node.inputs.length; i++) {
          const lg = localDeriv(node.op as OpType, outVal, inVals, i);
          g[node.inputs[i]] = (g[node.inputs[i]] ?? 0) + (g[nodeId] ?? 0) * lg;
        }
      }
      return g;
    });
    setStepBwdIdx(next);
  }, [stepBwdIdx, graph, revOrder, order, stepFwdVals, fwdVals]);

  const resetAll = useCallback(() => {
    setFwdVals(null); setBwdResult(null); setPhase('idle'); setFdGrad(null);
    setStepFwdIdx(null); setStepBwdIdx(null); setStepFwdVals({}); setStepBwdGrads({});
  }, []);

  const runNumericalCheck = useCallback(() => {
    if (leafNodes.length === 0) return;
    const targetId = leafNodes[0].id;
    const f = (p: number[]) => {
      const g = JSON.parse(JSON.stringify(graph));
      g.forEach((n: NodeSpec) => {
        if (n.id === targetId) n.value = p[0];
      });
      return forwardPass(g)[order[order.length - 1]];
    };
    setFdGrad({ id: targetId, value: centralDiff(f, [leafNodes[0].value], 0, fdH) });
  }, [graph, leafNodes, fdH, order]);

  const updateLeafValue = (id: string, value: number) => {
    setGraph((prev) => prev.map((n) => (n.id === id ? { ...n, value } : n)));
    resetAll();
  };

  const toggleGraph = () => {
    const next = !useBranched;
    setUseBranched(next);
    setGraph(next ? BRANCHED_GRAPH : INITIAL_GRAPH);
    resetAll();
  };

  const highlightFwd = stepFwdIdx !== null ? order[stepFwdIdx] : null;
  const highlightBwd = stepBwdIdx !== null ? revOrder[stepBwdIdx] : null;

  // Edge width: either from full backward pass (contribution magnitude) or from step state.
  const edgeMagnitude = (inId: string, outId: string) => {
    if (bwdResult?.localGrads[outId]?.[inId] !== undefined) {
      return Math.abs((bwdResult.grads[outId] ?? 0) * bwdResult.localGrads[outId][inId]);
    }
    if (stepBwdGrads[outId] !== undefined && stepFwdVals[outId] !== undefined) {
      const node = graph.find((n) => n.id === outId)!;
      const inVals = node.inputs.map((id) => stepFwdVals[id] ?? fwdVals?.[id] ?? 0);
      const idx = node.inputs.indexOf(inId);
      if (idx >= 0) {
        const lg = localDeriv(node.op as OpType, stepFwdVals[outId], inVals, idx);
        return Math.abs((stepBwdGrads[outId] ?? 0) * lg);
      }
    }
    return 0;
  };

  return (
    <InteractiveDemo title="反向传播实验：步进式计算图">
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          {useBranched ? 'y = x² + sin(x) — 两条路径梯度在 x 处相加' : 'f(x,w₁,w₂) = w₂ · sin(w₁·x + 1)'}
        </p>

        <div className="flex flex-wrap gap-2">
          <button onClick={toggleGraph}
            className={`px-3 py-2 text-sm rounded-lg ${useBranched ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
            {useBranched ? 'branched' : '切 y=x²+sin(x)'}
          </button>
          <button onClick={runForward} disabled={phase !== 'idle'} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 disabled:bg-gray-300">▶ Forward</button>
          <button onClick={runBackward} disabled={phase !== 'forward'} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 disabled:bg-gray-300">◀ Backward</button>
          <button onClick={resetAll} className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200">↺ 重置</button>
          <button onClick={runNumericalCheck} className="px-3 py-2 bg-indigo-100 text-indigo-700 rounded-lg text-sm hover:bg-indigo-200">🔢 数值梯度</button>
        </div>

        <div className="flex gap-2 items-center text-xs flex-wrap">
          <span className="font-medium text-gray-500">步进:</span>
          <button onClick={stepForward} className="px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200">Next Fwd</button>
          <button onClick={stepBackward} disabled={Object.keys(stepFwdVals).length === 0}
            className="px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200">Next Bwd</button>
          {stepFwdIdx !== null && <span className="text-gray-500">fwd:{stepFwdIdx+1}/{order.length}</span>}
          {stepBwdIdx !== null && <span className="text-gray-500">bwd:{stepBwdIdx+1}/{order.length}</span>}
        </div>

        <div className="bg-gray-50 rounded-xl border overflow-x-auto">
          <svg viewBox="0 0 760 360" className="w-full" style={{ minWidth: 700, maxHeight: 380 }}>
            {graph.flatMap((n) => n.inputs.map((inId) => {
              const [x1, y1] = pos[inId]; const [x2, y2] = pos[n.id];
              const mag = edgeMagnitude(inId, n.id);
              const gw = mag > 0 ? Math.min(6, 1 + mag * 1.5) : 1;
              return <line key={`${inId}-${n.id}`} x1={x1+28} y1={y1} x2={x2-4} y2={y2} stroke="#94a3b8" strokeWidth={gw} opacity={0.6} />;
            }))}
            {graph.map((n) => {
              const [nx, ny] = pos[n.id];
              const hl = highlightFwd === n.id || highlightBwd === n.id;
              const isLeaf = n.op === 'input' || n.op === 'weight';
              return <g key={n.id}>
                <rect x={nx} y={ny-20} width={56} height={40} rx={8} fill={opColors[n.op]} opacity={hl?1:0.8} stroke={hl?'#1f2937':'none'} strokeWidth={hl?2:0} />
                <text x={nx+28} y={ny-2} textAnchor="middle" className="text-[11px] font-bold" fill="white">{opLabels[n.op]}</text>
                <text x={nx+28} y={ny+14} textAnchor="middle" className="text-[9px]" fill="white">
                  {stepFwdVals[n.id] !== undefined ? stepFwdVals[n.id].toFixed(2) : fwdVals ? fwdVals[n.id].toFixed(2) : n.value.toFixed(1)}
                </text>
                {(bwdResult?.grads[n.id] ?? stepBwdGrads[n.id]) !== undefined
                  ? <text x={nx+28} y={ny+32} textAnchor="middle" className="text-[9px] font-bold" fill="#ef4444">∇{(stepBwdGrads[n.id] ?? bwdResult?.grads[n.id] ?? 0).toFixed(3)}</text>
                  : null}
                {isLeaf && (
                  <foreignObject x={nx-10} y={ny+34} width={76} height={22}>
                    <input type="number" step={0.1} defaultValue={n.value}
                      onChange={(e) => updateLeafValue(n.id, Number(e.target.value))}
                      className="w-full text-[9px] px-1 py-0.5 border rounded text-center" />
                  </foreignObject>
                )}
              </g>;
            })}
          </svg>
        </div>

        {fwdVals && (
          <div className="overflow-x-auto"><table className="w-full text-xs border-collapse">
            <thead><tr className="bg-gray-100">
              <th className="p-2 text-left border">节点</th><th className="p-2 text-left border">操作</th>
              <th className="p-2 text-right border">前向值</th><th className="p-2 text-right border">局部梯度</th>
              <th className="p-2 text-right border">累积梯度</th>
            </tr></thead>
            <tbody>{graph.map(n => (
              <tr key={n.id} className="border-b hover:bg-gray-50">
                <td className="p-2 border font-mono">{n.id}</td><td className="p-2 border">{opLabels[n.op]}</td>
                <td className="p-2 border text-right font-mono">{fwdVals[n.id].toFixed(4)}</td>
                <td className="p-2 border text-right font-mono">{bwdResult?.localGrads[n.id] ? Object.entries(bwdResult.localGrads[n.id]).map(([id,v])=>`${id}:${v.toFixed(3)}`).join(', ') : '-'}</td>
                <td className="p-2 border text-right font-mono font-bold">{bwdResult?.grads[n.id]?.toFixed(4) ?? '-'}</td>
              </tr>))}
            </tbody>
          </table></div>
        )}

        {fdGrad !== null && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
            <p className="text-sm font-medium text-indigo-800">数值梯度校验（中心差分）</p>
            <div className="flex gap-4 text-xs mt-1">
              <span>变量: <strong className="font-mono">{fdGrad.id}</strong></span>
              <span>分析: <strong className="font-mono">{(bwdResult?.grads[fdGrad.id] ?? stepBwdGrads[fdGrad.id] ?? 0).toFixed(6)}</strong></span>
              <span>差分: <strong className="font-mono">{fdGrad.value.toFixed(6)}</strong></span>
              <span>误差: <strong className="font-mono">{
                (() => {
                  const a = bwdResult?.grads[fdGrad.id] ?? stepBwdGrads[fdGrad.id] ?? 0;
                  return (Math.abs(fdGrad.value - a) / Math.max(1e-12, Math.abs(fdGrad.value))).toExponential(2);
                })()
              }</strong></span>
            </div>
          </div>
        )}
      </div>
    </InteractiveDemo>
  );
}
