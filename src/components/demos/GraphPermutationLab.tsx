import { useState } from 'react';
import InteractiveDemo from '@/components/InteractiveDemo';
import KaTeX from '@/components/KaTeX';
import PredictionGate from '@/components/PredictionGate';
import {
  adjacencyFromEdges,
  nodeDegrees,
  permuteAdjacency,
  permuteVector,
  undirectedEdgeCount,
} from '@/lib/math/gnn';

const ADJACENCY = adjacencyFromEdges(4, [[0, 1], [0, 2], [1, 2], [1, 3]]);
const FEATURES = [1, 2, 4, 8];
const PERMUTATIONS = [
  { label: '新顺序 C, A, D, B', value: [2, 0, 3, 1] },
  { label: '新顺序 D, C, B, A', value: [3, 2, 1, 0] },
  { label: '新顺序 B, D, A, C', value: [1, 3, 0, 2] },
];

function Matrix({ values, label }: { values: number[][]; label: string }) {
  return (
    <div>
      <div className="mb-2 text-center text-sm font-semibold text-gray-700">{label}</div>
      <div className="mx-auto grid w-fit grid-cols-4 gap-1" aria-label={label}>
        {values.flatMap((row, rowIndex) => row.map((value, columnIndex) => (
          <span key={`${rowIndex}-${columnIndex}`} className={`flex h-8 w-8 items-center justify-center rounded font-mono text-sm ${value ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
            {value}
          </span>
        )))}
      </div>
    </div>
  );
}

export default function GraphPermutationLab() {
  const [prediction, setPrediction] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [permutationIndex, setPermutationIndex] = useState(0);
  const permutation = PERMUTATIONS[permutationIndex].value;
  const permutedAdjacency = permuteAdjacency(ADJACENCY, permutation);
  const degrees = nodeDegrees(ADJACENCY);
  const permutedDegrees = nodeDegrees(permutedAdjacency);

  return (
    <InteractiveDemo title="节点重编号实验：结构变了吗？">
      <div className="space-y-6">
        <PredictionGate
          resetKey="graph-permutation"
          prediction={prediction}
          onPredictionChange={setPrediction}
          submitted={submitted}
          onSubmit={() => setSubmitted(true)}
          revealed={revealed}
          onReveal={() => setRevealed((value) => !value)}
          canReveal={submitted}
          question="只改变节点编号后，节点度数向量与整图边数分别会怎样变化？"
          hint="度数仍绑定具体节点，而边数是整张图的性质。"
          options={[
            { value: 'correct', label: '度数向量按同一置换重排，边数不变' },
            { value: 'fixed', label: '度数向量逐位置不变，边数也不变' },
            { value: 'changed', label: '度数与边数都会改变' },
          ]}
          evaluatePrediction={(answer) => ({
            correct: answer === 'correct',
            category: '等变与不变',
            feedback: answer === 'correct'
              ? '正确。节点输出跟随节点重排，图级统计不依赖编号。'
              : '重新编号没有改图结构，但节点级量必须跟着所属节点移动。',
          })}
          revealContent={<p className="text-sm text-gray-700"><KaTeX math="\tilde{\mathbf d}=P\mathbf d" />，而 <KaTeX math="|\tilde{\mathcal E}|=|\mathcal E|" />。这正是节点级等变与图级不变的最小例子。</p>}
        />

        {submitted && (
          <div className="space-y-5" aria-label="图置换实验控制区">
            <label className="block text-sm font-medium text-gray-700">
              选择一种新编号
              <select value={permutationIndex} onChange={(event) => setPermutationIndex(Number(event.target.value))} className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2">
                {PERMUTATIONS.map((item, index) => <option key={item.label} value={index}>{item.label}</option>)}
              </select>
            </label>

            <div className="grid gap-6 rounded-xl border bg-white p-5 md:grid-cols-2">
              <Matrix values={ADJACENCY} label="原邻接矩阵 A" />
              <Matrix values={permutedAdjacency} label="重编号后 P A Pᵀ" />
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm"><div className="text-gray-600">节点特征</div><div className="mt-1 font-mono font-bold text-blue-800">X=[{FEATURES.join(', ')}]</div><div className="font-mono text-blue-800">PX=[{permuteVector(FEATURES, permutation).join(', ')}]</div></div>
              <div className="rounded-lg border border-violet-200 bg-violet-50 p-4 text-sm"><div className="text-gray-600">节点度数（等变）</div><div className="mt-1 font-mono font-bold text-violet-800">d=[{degrees.join(', ')}]</div><div className="font-mono text-violet-800">Pd=[{permutedDegrees.join(', ')}]</div></div>
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm"><div className="text-gray-600">整图边数（不变）</div><div className="mt-1 text-2xl font-bold text-emerald-800">{undirectedEdgeCount(ADJACENCY)} = {undirectedEdgeCount(permutedAdjacency)}</div></div>
            </div>
          </div>
        )}
      </div>
    </InteractiveDemo>
  );
}
