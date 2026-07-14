import { useMemo, useState } from 'react';
import InteractiveDemo from '@/components/InteractiveDemo';
import KaTeX from '@/components/KaTeX';
import {
  computeAttention,
  gatAggregate,
  gcnMeanAggregate,
  type GATGraph,
} from '@/lib/math/graphAttention';

const W = [
  [1, 0],
  [0, 1],
];
const A = [0.2, 0, 0.2, 0];

function vecToString(v: number[]): string {
  return `[${v.map((x) => x.toFixed(2)).join(', ')}]`;
}

export default function GraphAttentionLab() {
  const [center, setCenter] = useState<[number, number]>([0.5, 0.5]);
  const [n1, setN1] = useState<[number, number]>([1.5, 0]);
  const [n2, setN2] = useState<[number, number]>([0, 1.5]);
  const [n3, setN3] = useState<[number, number]>([-1, -0.5]);

  const graph: GATGraph = useMemo(
    () => ({
      nodes: [center, n1, n2, n3],
      neighbors: [[0, 1, 2, 3], [1, 0], [2, 0], [3, 0]],
    }),
    [center, n1, n2, n3],
  );

  const { neighbors, scores, weights } = computeAttention(graph, 0, W, A);
  const gatOut = gatAggregate(graph, 0, W, A);
  const gcnOut = gcnMeanAggregate(graph, 0, W);

  return (
    <InteractiveDemo title="Graph Attention 实验：邻居权重如何归一化">
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          调整中心节点与邻居的二维特征，观察 GAT 的注意力系数{' '}
          <KaTeX math="\\alpha_{uv}" /> 如何在以 <KaTeX math="v" /> 为中心的邻居上 softmax 归一化，
          并与 GCN 的均值聚合对比。
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: '中心 v', value: center, set: setCenter },
            { label: '邻居 1', value: n1, set: setN1 },
            { label: '邻居 2', value: n2, set: setN2 },
            { label: '邻居 3', value: n3, set: setN3 },
          ].map((item) => (
            <div key={item.label} className="bg-slate-50 rounded-lg p-3 border border-slate-200 text-sm">
              <div className="font-medium text-gray-700 mb-2">{item.label}</div>
              {['x', 'y'].map((dim, idx) => (
                <div key={dim} className="mb-2">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>{dim}</span>
                    <span className="font-mono">{item.value[idx].toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min={-2}
                    max={2}
                    step={0.1}
                    value={item.value[idx]}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      const next: [number, number] = [...item.value] as [number, number];
                      next[idx] = v;
                      item.set(next);
                    }}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm font-medium text-gray-700 mb-3">注意力系数</div>
            <div className="space-y-2">
              {neighbors.map((k, i) => (
                <div key={k} className="flex items-center gap-3 text-sm">
                  <span className="w-16 text-gray-500">α_{k === 0 ? 'vv' : `v${k}`}</span>
                  <div className="flex-1 h-4 bg-gray-100 rounded overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: `${weights[i] * 100}%` }}
                    />
                  </div>
                  <span className="w-16 text-right font-mono">{weights[i].toFixed(3)}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 text-xs text-gray-500">
              原始分数 e：{scores.map((s) => s.toFixed(3)).join(', ')}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
            <div>
              <div className="text-sm font-medium text-gray-700">GAT 聚合输出</div>
              <div className="font-mono text-sm text-blue-700">{vecToString(gatOut)}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-700">GCN 均值聚合输出</div>
              <div className="font-mono text-sm text-purple-700">{vecToString(gcnOut)}</div>
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-700 bg-slate-50 p-4 rounded-lg border">
          <strong>注意：</strong> 分母求和始终围绕中心节点 <KaTeX math="v" />：
          <KaTeX
            math="\\alpha_{uv}=\\frac{\\exp(\\text{LeakyReLU}(\\mathbf{a}^\\top[W\\mathbf{h}_u \\| W\\mathbf{h}_v]))}{\\sum_{k\\in\\mathcal{N}(v)}\\exp(\\text{LeakyReLU}(\\mathbf{a}^\\top[W\\mathbf{h}_k \\| W\\mathbf{h}_v]))}"
            display
          />
        </div>
      </div>
    </InteractiveDemo>
  );
}
