import { useState, useMemo } from 'react';
import InteractiveDemo from '@/components/InteractiveDemo';

/* -------------------------------------------------------------------------- */
/* 工具函数                                                                   */
/* -------------------------------------------------------------------------- */
function softmax(arr: number[]): number[] {
  const max = Math.max(...arr);
  const exps = arr.map((v) => Math.exp(v - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

function matMul(A: number[][], B: number[][], transB: boolean = false): number[][] {
  const m = A.length, n = transB ? B.length : B[0].length;
  const inner = A[0].length;
  const result: number[][] = Array.from({ length: m }, () => Array(n).fill(0));
  for (let i = 0; i < m; i++)
    for (let j = 0; j < n; j++)
      for (let k = 0; k < inner; k++)
        result[i][j] += A[i][k] * (transB ? B[j][k] : B[k][j]);
  return result;
}

/* -------------------------------------------------------------------------- */
/* Tokenizer                                                                  */
/* -------------------------------------------------------------------------- */
type Token = { text: string; pos: number };

function tokenize(text: string): Token[] {
  // Simple: split by space (no word boundary)
  return text.trim().split(/\s+/).map((t, i) => ({ text: t, pos: i }));
}

/* -------------------------------------------------------------------------- */
/* Positional Encoding                                                        */
/* -------------------------------------------------------------------------- */
function sinusoidalPE(pos: number, dModel: number): number[] {
  const pe = Array(dModel).fill(0);
  for (let i = 0; i < dModel; i++) {
    const angle = pos / Math.pow(10000, (2 * Math.floor(i / 2)) / dModel);
    pe[i] = i % 2 === 0 ? Math.sin(angle) : Math.cos(angle);
  }
  return pe;
}

/* -------------------------------------------------------------------------- */
/* Small random W_Q, W_K, W_V, W_O matrices (seeded)                          */
/* -------------------------------------------------------------------------- */
function makeW(rows: number, cols: number, seed: number): number[][] {
  const rng = mulberry32(seed);
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => (rng() - 0.5) * 0.4));
}

/* -------------------------------------------------------------------------- */
/* 预设句子                                                                   */
/* -------------------------------------------------------------------------- */
const PRESETS: { label: string; text: string }[] = [
  { label: '猫追狗', text: '猫 追 狗' },
  { label: '狗追猫', text: '狗 追 猫' },
  { label: 'The cat sat on mat', text: 'The cat sat on mat' },
  { label: '深度学习 是 机器学习 的 子集', text: '深度学习 是 机器学习 的 子集' },
];

export default function AttentionLab() {
  const [text, setText] = useState('猫 追 狗');
  const [tokens, setTokens] = useState<Token[]>(() => tokenize('猫 追 狗'));
  const [numHeads, setNumHeads] = useState(2);
  const [dModel, setDModel] = useState(6); // must be divisible by numHeads
  const [usePE, setUsePE] = useState(false);
  const [causalMask, setCausalMask] = useState(false);
  const [activeHead, setActiveHead] = useState(0);
  const [clickedCell, setClickedCell] = useState<{ q: number; k: number } | null>(null);

  const dK = dModel / numHeads;

  const updateText = (t: string) => {
    setText(t);
    setTokens(tokenize(t));
    setClickedCell(null);
  };

  // Re-tokenize on text change
  const N = tokens.length;

  // Generate W matrices (stable seeds based on dModel)
  const Ws = useMemo(() => {
    const allWQ: number[][][] = [];
    const allWK: number[][][] = [];
    const allWV: number[][][] = [];
    for (let h = 0; h < numHeads; h++) {
      allWQ.push(makeW(dModel, dK, 100 + h * 3));
      allWK.push(makeW(dModel, dK, 200 + h * 3));
      allWV.push(makeW(dModel, dK, 300 + h * 3));
    }
    const WO = makeW(dModel, dModel, 400);
    return { allWQ, allWK, allWV, WO };
  }, [dModel, numHeads]);

  // X: N x dModel (with optional PE)
  const X = useMemo(() => {
    const x: number[][] = Array.from({ length: N }, (_, i) => {
      const base = Array(dModel).fill(0);
      base[i % dModel] = 1; // one-hot-like for simplicity
      if (usePE) {
        const pe = sinusoidalPE(tokens[i].pos, dModel);
        for (let j = 0; j < dModel; j++) base[j] += pe[j];
      }
      return base;
    });
    return x;
  }, [N, dModel, usePE, tokens]);

  // Multi-head attention computation
  const headOutputs = useMemo(() => {
    return Array.from({ length: numHeads }, (_, h) => {
      const WQ = Ws.allWQ[h], WK = Ws.allWK[h], WV = Ws.allWV[h];
      const Q = matMul(X, WQ); // N x dK
      const K = matMul(X, WK); // N x dK
      const V = matMul(X, WV); // N x dK

      // Scores: Q * K^T / sqrt(dK)  → N x N
      const scores: number[][] = Array.from({ length: N }, () => Array(N).fill(0));
      for (let i = 0; i < N; i++)
        for (let j = 0; j < N; j++) {
          let s = 0;
          for (let k = 0; k < dK; k++) s += Q[i][k] * K[j][k];
          scores[i][j] = s / Math.sqrt(dK);
        }

      // Causal mask
      if (causalMask) {
        for (let i = 0; i < N; i++)
          for (let j = i + 1; j < N; j++)
            scores[i][j] = -1e9;
      }

      // Softmax per row
      const attention: number[][] = scores.map((row) => softmax(row));

      // Output: A * V  → N x dK
      const headOut = matMul(attention, V);

      return { Q, K, V, scores, attention, headOut };
    });
  }, [X, Ws, numHeads, N, dK, causalMask]);

  const active = headOutputs[activeHead] ?? headOutputs[0];

  // Cell detail
  const cellDetail = clickedCell && active
    ? (() => {
        const { q, k } = clickedCell;
        let dot = 0;
        const terms: { idx: number; valQ: number; valK: number; prod: number }[] = [];
        for (let d = 0; d < dK; d++) {
          const vq = active.Q[q][d];
          const vk = active.K[k][d];
          terms.push({ idx: d, valQ: vq, valK: vk, prod: vq * vk });
          dot += vq * vk;
        }
        return { dot, scaled: dot / Math.sqrt(dK), terms };
      })()
    : null;

  // Complexity
  const complexity = `内存 O(N²)：${N} 个 token → ${N}×${N} = ${N * N} 个注意力分数，每次 softmax 需排序或全扫描。`;

  // Drag-and-drop token reorder
  const moveToken = (from: number, to: number) => {
    if (from === to) return;
    const newTokens = [...tokens];
    const [removed] = newTokens.splice(from, 1);
    newTokens.splice(to, 0, removed);
    // Re-assign positions
    const renumbered = newTokens.map((t, i) => ({ ...t, pos: i }));
    setTokens(renumbered);
    // Update text
    setText(renumbered.map((t) => t.text).join(' '));
  };

  return (
    <InteractiveDemo title="多头注意力实验：真正的 Multi-Head Attention">
      <div className="space-y-5">
        {/* Token editor */}
        <div className="flex flex-wrap gap-2 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs font-medium text-gray-600 block mb-1">输入句子（空格分词）</label>
            <input value={text} onChange={(e) => updateText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono" />
          </div>
          <div className="flex gap-1">
            {PRESETS.map((p) => (
              <button key={p.label} onClick={() => updateText(p.text)}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200">{p.label}</button>
            ))}
          </div>
        </div>

        {/* Draggable tokens */}
        <div className="flex flex-wrap gap-1 items-center">
          <span className="text-xs text-gray-500 mr-1">拖拽重排 →</span>
          {tokens.map((t, i) => (
            <div key={i} className="flex items-center gap-0.5">
              <button onClick={() => i > 0 && moveToken(i, i - 1)}
                className="text-[10px] text-gray-400 hover:text-gray-700 px-0.5">◀</button>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-mono border border-blue-200"
                draggable
                onDragStart={(e) => e.dataTransfer.setData('text/plain', String(i))}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const from = Number(e.dataTransfer.getData('text/plain'));
                  moveToken(from, i);
                }}
              >{t.text}<sub className="text-[8px]">[{i}]</sub></span>
              <button onClick={() => i < tokens.length - 1 && moveToken(i, i + 1)}
                className="text-[10px] text-gray-400 hover:text-gray-700 px-0.5">▶</button>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="grid sm:grid-cols-3 gap-3">
          <div>
            <div className="flex justify-between text-xs font-medium text-gray-700 mb-1">
              <span>头数 H</span><span>{numHeads}</span>
            </div>
            <input type="range" value={numHeads} min={1} max={dModel}
              onChange={(e) => { setNumHeads(Number(e.target.value)); setActiveHead(0); }}
              className="w-full" />
          </div>
          <div>
            <div className="flex justify-between text-xs font-medium text-gray-700 mb-1">
              <span>d_model（须是 H 的倍数）</span><span>{dModel}</span>
            </div>
            <input type="range" value={dModel} min={2} max={12} step={2}
              onChange={(e) => setDModel(Number(e.target.value))}
              className="w-full" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
              <input type="checkbox" checked={usePE} onChange={() => setUsePE(!usePE)} /> 位置编码
            </label>
            <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
              <input type="checkbox" checked={causalMask} onChange={() => setCausalMask(!causalMask)} /> Causal Mask
            </label>
          </div>
        </div>

        {/* Head selector */}
        <div className="flex gap-1 flex-wrap">
          {Array.from({ length: numHeads }, (_, h) => (
            <button key={h} onClick={() => setActiveHead(h)}
              className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                h === activeHead ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}>
              Head {h}
            </button>
          ))}
        </div>

        {/* Attention heatmap */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <div className="text-xs font-medium text-gray-600 mb-1">Head {activeHead} — Attention Matrix (QKᵀ/√dₖ + softmax)</div>
            <div className="overflow-x-auto">
              <table className="text-[10px] border-collapse">
                <thead>
                  <tr>
                    <th className="p-1 border bg-gray-50"></th>
                    {tokens.map((t, j) => (
                      <th key={j} className="p-1 border bg-gray-50 font-mono" title={t.text}>{t.text}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {active?.attention.map((row, i) => (
                    <tr key={i}>
                      <td className="p-1 border bg-gray-50 font-mono font-bold">{tokens[i]?.text}</td>
                      {row.map((val, j) => {
                        const isCausal = causalMask && j > i;
                        return (
                          <td key={j}
                            onClick={() => !isCausal && setClickedCell({ q: i, k: j })}
                            className={`p-1 border text-center font-mono cursor-pointer transition-colors ${
                              clickedCell?.q === i && clickedCell?.k === j ? 'ring-2 ring-indigo-500 bg-indigo-50' : ''
                            }`}
                            style={{
                              backgroundColor: isCausal ? '#f3f4f6' : `rgba(99, 102, 241, ${Math.min(1, val * 1.5)})`,
                              color: isCausal ? '#9ca3af' : val > 0.5 ? 'white' : '#1f2937',
                            }}
                          >{isCausal ? '−' : val.toFixed(2)}</td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cell detail */}
          <div>
            <div className="text-xs font-medium text-gray-600 mb-1">点击单元格查看 Q·K 计算</div>
            {cellDetail ? (
              <div className="bg-gray-50 rounded-lg border p-3 space-y-2 text-[10px]">
                <p><strong>Q<sub>{clickedCell!.q}</sub> · K<sub>{clickedCell!.k}</sub></strong> (dₖ={dK}):</p>
                {cellDetail.terms.map((t) => (
                  <div key={t.idx} className="flex justify-between font-mono">
                    <span>dim {t.idx}: {t.valQ.toFixed(3)} × {t.valK.toFixed(3)}</span>
                    <span>= {t.prod.toFixed(4)}</span>
                  </div>
                ))}
                <div className="border-t pt-1 font-bold">
                  原始 dot = {cellDetail.dot.toFixed(4)}, 缩放 /√{dK} = {cellDetail.scaled.toFixed(4)}
                </div>
              </div>
            ) : (
              <div className="text-xs text-gray-400">点击注意力矩阵中的任意单元格查看详细点积计算</div>
            )}

            {/* Dimension display */}
            <div className="mt-3 bg-indigo-50 rounded-lg p-3 text-[10px] space-y-1">
              <p><strong>维度追踪（Head {activeHead}）：</strong></p>
              <p>X: {N}×{dModel} | W_Q: {dModel}×{dK} → Q: {N}×{dK}</p>
              <p>X: {N}×{dModel} | W_K: {dModel}×{dK} → K: {N}×{dK}</p>
              <p>X: {N}×{dModel} | W_V: {dModel}×{dK} → V: {N}×{dK}</p>
              <p>A = softmax(QKᵀ/√{dK}): {N}×{N}</p>
              <p>O_h = A·V: {N}×{dK}</p>
              <p>Concat all heads: {N}×{dModel} | W_O: {dModel}×{dModel} → Output: {N}×{dModel}</p>
            </div>
          </div>
        </div>

        {/* Complexity */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs">
          <strong>📐 复杂度：</strong>{complexity}
          <span className="ml-2">O(N²·d) 计算复杂度，transformer 长序列的核心瓶颈。</span>
        </div>

        {/* Counterexample: no PE */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs space-y-1">
          <strong>⚠️ 反例："猫追狗" vs "狗追猫"</strong>
          {usePE ? (
            <p className="text-green-700">
              位置编码已启用 → 两个句子的位置嵌入不同，注意力可以区分"猫在位置0"和"狗在位置0"。
            </p>
          ) : (
            <p className="text-red-700">
              位置编码关闭 → 注意力只看 token 内容，不看位置。"猫 追 狗" 和 "狗 追 猫" 在自注意力层完全等价！
              这是 transformer 需要位置编码的根本原因。
            </p>
          )}
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
