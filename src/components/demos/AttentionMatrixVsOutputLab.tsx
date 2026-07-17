import { useMemo, useState } from 'react';
import InteractiveDemo from '@/components/InteractiveDemo';
import { softmax, matMul } from '@/lib/math/attention';

function makeLcg(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function randomMatrix(rand: () => number, rows: number, cols: number): number[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => rand() * 2 - 1),
  );
}

const N = 3;
const D = 2;

function attention(Q: number[][], K: number[][], V: number[][]) {
  const KT = K[0].map((_, j) => K.map((row) => row[j]));
  const scores = matMul(Q, KT).map((row) => row.map((v) => v / Math.sqrt(D)));
  const A = scores.map((row) => softmax(row));
  const Y = matMul(A, V);
  return { A, Y };
}

function fmt(m: number[][]) {
  return m.map((row) => row.map((v) => v.toFixed(2)).join('  ')).join('\n');
}

function Heatmap({ title, matrix }: { title: string; matrix: number[][] }) {
  return (
    <div className="flex-1 min-w-[150px]">
      <div className="text-xs font-medium text-gray-600 mb-1">{title}</div>
      <div className="inline-block border border-gray-200 rounded-md overflow-hidden">
        {matrix.map((row, i) => (
          <div key={i} className="flex">
            {row.map((v, j) => (
              <div
                key={j}
                className="w-12 h-10 flex items-center justify-center text-[11px] font-mono border border-white"
                style={{ backgroundColor: `rgba(79,70,229,${Math.min(1, Math.max(0, v))})`, color: v > 0.55 ? '#fff' : '#312e81' }}
              >
                {v.toFixed(2)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

type Mode = 'fixQK' | 'fixV';

export default function AttentionMatrixVsOutputLab() {
  const [mode, setMode] = useState<Mode>('fixQK');
  const [seed, setSeed] = useState(1);

  const base = useMemo(() => {
    const rand = makeLcg(20240601);
    return {
      Q: randomMatrix(rand, N, D),
      K: randomMatrix(rand, N, D),
      V: randomMatrix(rand, N, D),
    };
  }, []);

  const varied = useMemo(() => {
    const rand = makeLcg(9000 + seed);
    if (mode === 'fixQK') {
      // Experiment 1: Q,K fixed => attention matrix identical; only V changes.
      return { Q: base.Q, K: base.K, V: randomMatrix(rand, N, D) };
    }
    // Experiment 2: V fixed; Q,K change => attention matrix changes.
    return { Q: randomMatrix(rand, N, D), K: randomMatrix(rand, N, D), V: base.V };
  }, [base, mode, seed]);

  const baseResult = useMemo(() => attention(base.Q, base.K, base.V), [base]);
  const variedResult = useMemo(() => attention(varied.Q, varied.K, varied.V), [varied]);

  const attentionSame = useMemo(() => {
    let maxDiff = 0;
    for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
      maxDiff = Math.max(maxDiff, Math.abs(baseResult.A[i][j] - variedResult.A[i][j]));
    }
    return maxDiff < 1e-9;
  }, [baseResult, variedResult]);

  return (
    <InteractiveDemo title="Attention Matrix 与 Output 的区别">
      <div className="space-y-4 text-sm text-gray-700">
        <p>
          真正的注意力输出是 <span className="font-mono font-semibold">Y = A · V</span>，而不只是
          <span className="font-mono"> A = softmax(QKᵀ/√d)</span>。下面用两个实验拆开“看谁”（A）与“拿什么信息”（V）。
        </p>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setMode('fixQK')}
            className={`px-3 py-1.5 rounded-lg border text-sm ${mode === 'fixQK' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300'}`}
          >
            实验一：固定 Q、K，只改 V
          </button>
          <button
            type="button"
            onClick={() => setMode('fixV')}
            className={`px-3 py-1.5 rounded-lg border text-sm ${mode === 'fixV' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300'}`}
          >
            实验二：固定 V，只改 Q、K
          </button>
          <button
            type="button"
            onClick={() => setSeed((s) => s + 1)}
            className="px-3 py-1.5 rounded-lg border bg-amber-50 text-amber-800 border-amber-300 text-sm"
          >
            {mode === 'fixQK' ? '换一组 V' : '换一组 Q、K'}
          </button>
        </div>

        <div className={`rounded-lg p-3 text-sm font-medium ${attentionSame ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-blue-50 text-blue-800 border border-blue-200'}`}>
          {attentionSame
            ? '✓ 两次 Attention Heatmap 完全一样（A 不变），但 Output Token 全部改变了。'
            : '✓ 这次 Attention Matrix 改变了，Output 也随之改变。'}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-lg p-3">
            <div className="text-xs font-semibold text-gray-500 mb-2">基准</div>
            <div className="flex flex-wrap gap-4">
              <Heatmap title="Attention A" matrix={baseResult.A} />
              <div className="flex-1 min-w-[150px]">
                <div className="text-xs font-medium text-gray-600 mb-1">Output Y = A·V</div>
                <pre className="text-[11px] font-mono bg-gray-50 border border-gray-200 rounded-md p-2 whitespace-pre">{fmt(baseResult.Y)}</pre>
              </div>
            </div>
          </div>
          <div className="border border-gray-200 rounded-lg p-3">
            <div className="text-xs font-semibold text-gray-500 mb-2">{mode === 'fixQK' ? '只改了 V' : '只改了 Q、K'}</div>
            <div className="flex flex-wrap gap-4">
              <Heatmap title="Attention A" matrix={variedResult.A} />
              <div className="flex-1 min-w-[150px]">
                <div className="text-xs font-medium text-gray-600 mb-1">Output Y = A·V</div>
                <pre className="text-[11px] font-mono bg-gray-50 border border-gray-200 rounded-md p-2 whitespace-pre">{fmt(variedResult.Y)}</pre>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm">
          <strong>总结：</strong>Attention Matrix 决定“<strong>看谁</strong>”，Value 决定“<strong>拿什么信息</strong>”。
        </div>
      </div>
    </InteractiveDemo>
  );
}
