import { useState, useMemo } from 'react';
import InteractiveDemo from '@/components/InteractiveDemo';
import { multiHeadAttention, divisors, sinusoidalPE } from '@/lib/math/attention';

type Token = { text: string; pos: number };
function tokenize(text: string): Token[] {
  const cleaned = text.trim();
  if (!cleaned) return [];
  return cleaned.split(/\s+/).map((t, i) => ({ text: t, pos: i }));
}

function buildX(tokens: Token[], dModel: number, usePE: boolean): number[][] {
  return tokens.map((token) => {
    const tokenText = token.text;
    let hash = 0;
    for (let c = 0; c < tokenText.length; c++) hash = ((hash << 5) - hash + tokenText.charCodeAt(c)) | 0;
    const rng = mulberry32(Math.abs(hash) + 1);
    const base = Array.from({ length: dModel }, () => (rng() - 0.5) * 0.5);
    if (usePE) {
      const pe = sinusoidalPE(token.pos, dModel);
      for (let j = 0; j < dModel; j++) base[j] += pe[j];
    }
    return base;
  });
}

function computeEquivarianceMetric(
  tokens: Token[],
  dModel: number,
  Ws: { allWQ: number[][][]; allWK: number[][][]; allWV: number[][][]; WO: number[][] },
  usePE: boolean,
  causalMask: boolean,
): number | null {
  const N = tokens.length;
  if (N === 0) return null;

  const X = buildX(tokens, dModel, usePE);
  const permutedTokens = [...tokens].reverse().map((t, i) => ({ ...t, pos: i }));
  const PX = buildX(permutedTokens, dModel, usePE);

  const yX = multiHeadAttention(X, Ws.allWQ, Ws.allWK, Ws.allWV, Ws.WO, causalMask).finalOutput;
  const yPX = multiHeadAttention(PX, Ws.allWQ, Ws.allWK, Ws.allWV, Ws.WO, causalMask).finalOutput;

  let maxErr = 0;
  for (let i = 0; i < N; i++) {
    const pi = N - 1 - i;
    for (let j = 0; j < dModel; j++) {
      maxErr = Math.max(maxErr, Math.abs(yPX[pi][j] - yX[i][j]));
    }
  }
  return maxErr;
}

function makeW(rows: number, cols: number, seed: number): number[][] {
  const rng = mulberry32(seed);
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => (rng() - 0.5) * 0.4));
}

const PRESETS = [
  { label: '猫追狗', text: '猫 追 狗' },
  { label: '狗追猫', text: '狗 追 猫' },
  { label: '深度学习是ML子集', text: '深度 学习 是 机器 学习 的 子集' },
];

export default function AttentionLab() {
  const [text, setText] = useState('猫 追 狗');
  const [tokens, setTokens] = useState<Token[]>(() => tokenize('猫 追 狗'));
  const [numHeads, setNumHeads] = useState(2);
  const [dModel, setDModel] = useState(6);
  const [usePE, setUsePE] = useState(false);
  const [causalMask, setCausalMask] = useState(false);
  const [activeHead, setActiveHead] = useState(0);
  const [clickedCell, setClickedCell] = useState<{ q: number; k: number } | null>(null);

  const dK = dModel / numHeads;
  const N = tokens.length;

  const updateText = (t: string) => {
    setText(t);
    setTokens(tokenize(t));
    setActiveHead(0);
    setClickedCell(null);
  };

  const togglePE = () => { setUsePE((v) => !v); setClickedCell(null); };
  const toggleCausal = () => { setCausalMask((v) => !v); setClickedCell(null); };
  const selectHead = (h: number) => { setActiveHead(h); setClickedCell(null); };

  // W matrices
  const Ws = useMemo(() => {
    const allWQ = Array.from({ length: numHeads }, (_, h) => makeW(dModel, dK, 100 + h * 3));
    const allWK = Array.from({ length: numHeads }, (_, h) => makeW(dModel, dK, 200 + h * 3));
    const allWV = Array.from({ length: numHeads }, (_, h) => makeW(dModel, dK, 300 + h * 3));
    const WO = makeW(dModel, dModel, 400);
    return { allWQ, allWK, allWV, WO };
  }, [dModel, dK, numHeads]);

  // X
  const X = useMemo(() => buildX(tokens, dModel, usePE), [tokens, dModel, usePE]);

  // Use math lib!
  const attentionResult = useMemo(() => {
    if (N === 0) return null;
    return multiHeadAttention(X, Ws.allWQ, Ws.allWK, Ws.allWV, Ws.WO, causalMask);
  }, [X, Ws, causalMask, N]);

  const metricOffOff = useMemo(
    () => computeEquivarianceMetric(tokens, dModel, Ws, false, false),
    [tokens, dModel, Ws],
  );
  const metricPEOn = useMemo(
    () => computeEquivarianceMetric(tokens, dModel, Ws, true, false),
    [tokens, dModel, Ws],
  );
  const metricCausalOn = useMemo(
    () => computeEquivarianceMetric(tokens, dModel, Ws, false, true),
    [tokens, dModel, Ws],
  );

  const active = attentionResult ? attentionResult.headOutputs[activeHead] : null;
  const cellDetail = clickedCell && active ? (() => {
    const { q, k } = clickedCell;
    let dot = 0;
    const terms: { idx: number; valQ: number; valK: number; prod: number }[] = [];
    for (let d = 0; d < dK; d++) {
      const vq = active.Q[q][d], vk = active.K[k][d];
      terms.push({ idx: d, valQ: vq, valK: vk, prod: vq * vk });
      dot += vq * vk;
    }
    return { dot, scaled: dot / Math.sqrt(dK), terms };
  })() : null;

  const moveToken = (from: number, to: number) => {
    if (from === to) return;
    const newTokens = [...tokens];
    const [removed] = newTokens.splice(from, 1);
    newTokens.splice(to, 0, removed);
    setTokens(newTokens.map((t, i) => ({ ...t, pos: i })));
    setText(newTokens.map((t) => t.text).join(' '));
    setActiveHead(0);
    setClickedCell(null);
  };

  return (
    <InteractiveDemo title="多头注意力实验">
      <div className="space-y-5">
        <p className="text-sm text-gray-600">
          使用 <code>multiHeadAttention()</code> 计算真实多头注意力。下方渲染每个 head 的输出、concat 矩阵和 final output。
        </p>

        <div className="flex flex-wrap gap-2 items-end">
          <div className="flex-1 min-w-[200px]">
            <input value={text} onChange={(e) => updateText(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono" />
          </div>
          {PRESETS.map((p) => <button key={p.label} onClick={() => updateText(p.text)} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200">{p.label}</button>)}
        </div>

        <div className="flex flex-wrap gap-1 items-center">
          <span className="text-xs text-gray-500">拖拽重排 →</span>
          {tokens.map((t, i) => (
            <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-mono border cursor-move"
              draggable onDragStart={(e) => e.dataTransfer.setData('text/plain', String(i))}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); moveToken(Number(e.dataTransfer.getData('text/plain')), i); }}>
              {t.text}<sub className="text-[8px]">[{i}]</sub>
            </span>
          ))}
        </div>

        <div className="grid sm:grid-cols-3 gap-3 items-end">
          <div><div className="text-xs font-medium text-gray-700 mb-1">H</div>
            <select value={numHeads} onChange={(e) => { setNumHeads(Number(e.target.value)); setActiveHead(0); setClickedCell(null); }} className="w-full px-2 py-1.5 border rounded text-xs">
              {divisors(dModel).map((d) => <option key={d} value={d}>{d}头</option>)}</select></div>
          <div><div className="text-xs font-medium text-gray-700 mb-1">d_model</div>
            <select value={dModel} onChange={(e) => { setDModel(Number(e.target.value)); setNumHeads(1); setActiveHead(0); setClickedCell(null); }} className="w-full px-2 py-1.5 border rounded text-xs">
              {[2,4,6,8,10,12].map((d) => <option key={d} value={d}>{d}</option>)}</select></div>
          <div className="flex flex-col gap-1">
            <label className="text-xs"><input type="checkbox" checked={usePE} onChange={togglePE} /> PE</label>
            <label className="text-xs"><input type="checkbox" checked={causalMask} onChange={toggleCausal} /> Causal</label>
          </div>
        </div>

        <div className="flex gap-1">
          {Array.from({ length: numHeads }, (_, h) => (
            <button key={h} onClick={() => selectHead(h)} className={`px-3 py-1 text-xs rounded-lg ${h === activeHead ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`}>Head {h}</button>
          ))}
        </div>

        {N === 0 ? (
          <div className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
            请输入至少一个 token
          </div>
        ) : (
          <>
            {/* Heatmap + cell detail */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-medium text-gray-600 mb-1">Head {activeHead} Attention</div>
                <table className="text-[10px] border-collapse">
                  <thead><tr>{[''].concat(tokens.map((t) => t.text)).map((s, j) => <th key={j} className="p-1 border bg-gray-50 font-mono">{s}</th>)}</tr></thead>
                  <tbody>
                    {active?.attention.map((row, i) => (
                      <tr key={i}><td className="p-1 border bg-gray-50 font-mono font-bold">{tokens[i]?.text}</td>
                        {row.map((val, j) => {
                          const masked = causalMask && j > i;
                          const maxVal = Math.max(...active.attention.flat(), 1e-6);
                          return <td key={j} onClick={() => !masked && setClickedCell({ q: i, k: j })} className={`p-1 border text-center font-mono ${masked ? '' : 'cursor-pointer'} ${clickedCell?.q === i && clickedCell?.k === j ? 'ring-2 ring-indigo-500' : ''}`}
                            style={{ backgroundColor: masked ? '#f3f4f6' : `rgba(99,102,241,${val / maxVal})`, color: masked ? '#9ca3af' : val / maxVal > 0.55 ? 'white' : '#1f2937' }}>{masked ? '−' : val.toFixed(2)}</td>;
                        })}
                      </tr>))}
                  </tbody>
                </table>
              </div>
              <div>
                {cellDetail ? (
                  <div className="bg-gray-50 rounded-lg border p-3 text-[10px] space-y-1">
                    <p><strong>Q<sub>{clickedCell!.q}</sub>·K<sub>{clickedCell!.k}</sub></strong> (dₖ={dK})</p>
                    {cellDetail.terms.map((t) => <div key={t.idx} className="font-mono">{t.valQ.toFixed(3)}×{t.valK.toFixed(3)} = {t.prod.toFixed(4)}</div>)}
                    <div className="border-t pt-1 font-bold">dot={cellDetail.dot.toFixed(4)}, /√{dK}={cellDetail.scaled.toFixed(4)}</div>
                  </div>
                ) : <div className="text-xs text-gray-400">点击矩阵单元格查看点积</div>}
                <div className="mt-3 bg-indigo-50 rounded-lg p-3 text-[10px]">
                  <p><strong>维度：</strong>X:{N}×{dModel} → Q/K/V:{N}×{dK} → A:{N}×{N} → O_h:{N}×{dK}</p>
                </div>
              </div>
            </div>

            {/* Active head output */}
            <div className="bg-white border rounded-lg p-3">
              <div className="text-xs font-medium text-gray-600 mb-2">Head {activeHead} Output (A·V) [{N}×{dK}]</div>
              <div className="overflow-x-auto">
                <table className="text-[10px] border-collapse">
                  <thead>
                    <tr>
                      <th className="p-1 border bg-gray-50">token</th>
                      {Array.from({ length: dK }, (_, i) => <th key={i} className="p-1 border bg-gray-50 font-mono">d{i}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {active?.headOut.map((row, i) => (
                      <tr key={i}>
                        <td className="p-1 border bg-gray-50 font-mono font-bold">{tokens[i]?.text}</td>
                        {row.map((v, j) => <td key={j} className="p-1 border text-right font-mono">{v.toFixed(2)}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Concat + Final Output */}
            <div className="bg-white border rounded-lg p-3">
              <div className="text-xs font-medium text-gray-600 mb-2">Concat matrix [{N}×{dModel}] + Final Output [{N}×{dModel}]</div>
              <div className="overflow-x-auto">
                <table className="text-[10px] border-collapse">
                  <thead><tr><th className="p-1 border bg-gray-50" colSpan={dModel}>Concat = [head0 | head1 | ...]</th><th className="p-1 border bg-gray-50 w-4"></th><th className="p-1 border bg-indigo-50" colSpan={dModel}>Final Output = Concat × W_O</th></tr></thead>
                  <tbody>
                    {attentionResult!.concat.map((row, i) => (
                      <tr key={i}>
                        {row.map((v, j) => <td key={j} className="p-1 border text-right font-mono">{v.toFixed(2)}</td>)}
                        <td className="border w-4"></td>
                        {attentionResult!.finalOutput[i].map((v, j) => <td key={j} className="p-1 border text-right font-mono bg-indigo-50">{v.toFixed(2)}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Equivariance metrics */}
        <div className="bg-gray-50 border rounded-lg p-3 text-xs space-y-2">
          <p>
            <strong>Equivariance 检查：</strong>
            No positional encoding AND no causal mask 时，self-attention 对任意 token permutation 是 equivariant。
          </p>
          <div className="grid sm:grid-cols-3 gap-2">
            <div className="bg-white border rounded p-2">
              <div className="text-[10px] text-gray-500">PE off / Causal off</div>
              <div className="font-mono font-medium">maxAbs = {metricOffOff?.toExponential(2) ?? '—'}</div>
            </div>
            <div className="bg-white border rounded p-2">
              <div className="text-[10px] text-gray-500">PE on / Causal off</div>
              <div className="font-mono font-medium">maxAbs = {metricPEOn?.toExponential(2) ?? '—'}</div>
            </div>
            <div className="bg-white border rounded p-2">
              <div className="text-[10px] text-gray-500">PE off / Causal on</div>
              <div className="font-mono font-medium">maxAbs = {metricCausalOn?.toExponential(2) ?? '—'}</div>
            </div>
          </div>
          <p className="text-[10px] text-gray-500">
            指标：maxAbs(Y(PX) − P·Y(X))，其中 P 为 token 顺序反转。
          </p>
        </div>
      </div>
    </InteractiveDemo>
  );
}

function mulberry32(a: number) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
