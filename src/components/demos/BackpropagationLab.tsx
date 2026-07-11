import { useState, useCallback } from 'react';
import InteractiveDemo from '@/components/InteractiveDemo';
import { forwardPass, backwardPass, centralDiff, type NodeSpec } from '@/lib/math/backprop';

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

export default function BackpropagationLab() {
  const [fwdVals, setFwdVals] = useState<Record<string, number> | null>(null);
  const [bwdResult, setBwdResult] = useState<{
    grads: Record<string, number>;
    localGrads: Record<string, Record<string, number>>;
  } | null>(null);
  const [phase, setPhase] = useState<'idle' | 'forward' | 'backward'>('idle');
  const [fdH, setFdH] = useState(0.001);
  const [fdGrad, setFdGrad] = useState<number | null>(null);

  const runForward = useCallback(() => {
    const g = JSON.parse(JSON.stringify(INITIAL_GRAPH));
    const vals = forwardPass(g);
    setFwdVals(vals);
    setPhase('forward');
  }, []);

  const runBackward = useCallback(() => {
    if (!fwdVals) return;
    const result = backwardPass(INITIAL_GRAPH, fwdVals);
    setBwdResult(result);
    setPhase('backward');
  }, [fwdVals]);

  const resetAll = useCallback(() => {
    setFwdVals(null); setBwdResult(null); setPhase('idle'); setFdGrad(null);
  }, []);

  const runNumericalCheck = useCallback(() => {
    // Independent of UI state: use fresh graph copies, central difference
    const f = (params: number[]) => {
      const g = JSON.parse(JSON.stringify(INITIAL_GRAPH));
      g[1].value = params[0]; // w1
      g[6].value = params[1]; // w2
      return forwardPass(g)['mul2'];
    };
    const numGrad = centralDiff(f, [INITIAL_GRAPH[1].value, INITIAL_GRAPH[6].value], 0, fdH);
    setFdGrad(numGrad);
  }, [fdH]);

  const paramCount = INITIAL_GRAPH.filter((n) => n.op === 'weight').length;

  return (
    <InteractiveDemo title="反向传播实验：可交互计算图">
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          <code>f(x,w₁,w₂) = w₂ · sin(w₁·x + 1)</code>。点击 Forward 计算前向值，点击 Backward 传播梯度。
        </p>
        <div className="flex flex-wrap gap-2">
          <button onClick={runForward} disabled={phase !== 'idle'} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 disabled:bg-gray-300">▶ Forward</button>
          <button onClick={runBackward} disabled={phase !== 'forward'} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 disabled:bg-gray-300">◀ Backward</button>
          <button onClick={resetAll} className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200">↺ 重置</button>
          <button onClick={runNumericalCheck} className="px-3 py-2 bg-indigo-100 text-indigo-700 rounded-lg text-sm hover:bg-indigo-200">🔢 数值梯度校验</button>
        </div>

        <div className="bg-gray-50 rounded-xl border overflow-x-auto">
          <svg viewBox="0 0 760 360" className="w-full" style={{ minWidth: 700, maxHeight: 380 }}>
            {INITIAL_GRAPH.flatMap((n) =>
              n.inputs.map((inId) => {
                const [x1, y1] = nodePos[inId]; const [x2, y2] = nodePos[n.id];
                const gradW = bwdResult?.grads[inId] ? Math.min(6, 1 + Math.abs(bwdResult.grads[inId]) * 2) : 1;
                return <line key={`${inId}-${n.id}`} x1={x1 + 28} y1={y1} x2={x2 - 4} y2={y2} stroke="#94a3b8" strokeWidth={gradW} opacity={0.6} />;
              }),
            )}
            {INITIAL_GRAPH.map((n) => {
              const [nx, ny] = nodePos[n.id];
              return (
                <g key={n.id}>
                  <rect x={nx} y={ny - 20} width={56} height={40} rx={8} fill={opColors[n.op]} opacity={0.8} />
                  <text x={nx + 28} y={ny - 2} textAnchor="middle" className="text-[11px] font-bold" fill="white">{opLabels[n.op]}</text>
                  <text x={nx + 28} y={ny + 14} textAnchor="middle" className="text-[9px]" fill="white">
                    {fwdVals ? fwdVals[n.id].toFixed(2) : n.value.toFixed(1)}
                  </text>
                  {bwdResult?.grads[n.id] ? (
                    <text x={nx + 28} y={ny + 32} textAnchor="middle" className="text-[9px] font-bold" fill="#ef4444">∇{bwdResult.grads[n.id].toFixed(3)}</text>
                  ) : null}
                </g>
              );
            })}
          </svg>
        </div>

        {fwdVals && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead><tr className="bg-gray-100">
                <th className="p-2 text-left border">节点</th><th className="p-2 text-left border">操作</th>
                <th className="p-2 text-right border">前向值</th><th className="p-2 text-right border">局部梯度</th>
                <th className="p-2 text-right border">累积梯度</th>
              </tr></thead>
              <tbody>
                {INITIAL_GRAPH.map((n) => (
                  <tr key={n.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 border font-mono">{n.id}</td><td className="p-2 border">{opLabels[n.op]}</td>
                    <td className="p-2 border text-right font-mono">{fwdVals[n.id].toFixed(4)}</td>
                    <td className="p-2 border text-right font-mono">
                      {bwdResult?.localGrads[n.id]
                        ? Object.entries(bwdResult.localGrads[n.id]).map(([id, v]) => `${id}:${v.toFixed(3)}`).join(', ')
                        : '-'}
                    </td>
                    <td className="p-2 border text-right font-mono font-bold">{bwdResult?.grads[n.id]?.toFixed(4) ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {fdGrad !== null && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
            <p className="text-sm font-medium text-indigo-800">数值梯度校验 ∂f/∂w₁（中心差分）：</p>
            <div className="flex gap-4 text-xs mt-1">
              <span>分析梯度: <strong className="font-mono">{bwdResult?.grads['w1']?.toFixed(6) ?? '—'}</strong></span>
              <span>中心差分 (h={fdH}): <strong className="font-mono">{fdGrad.toFixed(6)}</strong></span>
              <span>相对误差: <strong className="font-mono">{bwdResult?.grads['w1'] ? (Math.abs(fdGrad - bwdResult.grads['w1']) / Math.max(1e-12, Math.abs(fdGrad))).toExponential(2) : '—'}</strong></span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-gray-500">h:</span>
              <input type="number" value={fdH} step={0.0001} min={1e-10} max={1} onChange={(e) => setFdH(Number(e.target.value))} className="w-24 px-2 py-1 border rounded text-xs font-mono" />
            </div>
          </div>
        )}

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm">
          <p><strong>⏱ 计算成本：</strong></p>
          <p className="text-gray-600 mt-1">
            相对于逐参数有限差分，反向模式把 O({paramCount}) 次函数计算降低为一次前向和一次反向的常数倍成本。
            参数数量：{paramCount} 个可训练权重。
          </p>
        </div>
      </div>
    </InteractiveDemo>
  );
}
