import { useMemo, useState } from 'react';
import { BookOpen, Focus, ShieldAlert, SlidersHorizontal } from 'lucide-react';
import ConceptCard from '@/components/ConceptCard';
import FormulaCard from '@/components/FormulaCard';
import InteractiveDemo from '@/components/InteractiveDemo';
import KaTeX from '@/components/KaTeX';
import { Slider } from '@/components/ui/slider';
import SectionNavigation from '@/components/SectionNavigation';
import { getSectionByPath } from '@/course/manifest';

const SECTION_PATH = '/ch09/attention';

const TOKENS = ['深', '度', '学'];
const EMBEDDINGS = [
  [1.0, 0.2, 0.1],
  [0.2, 1.0, 0.3],
  [0.1, 0.3, 1.0],
];
const D_K = 3;

function softmax(scores: number[]) {
  const maxScore = Math.max(...scores);
  const exps = scores.map((s) => Math.exp(s - maxScore));
  const sumExp = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sumExp);
}

function scale(v: number[], s: number) {
  return v.map((x) => x * s);
}

function add(a: number[], b: number[]) {
  return a.map((x, i) => x + b[i]);
}

function dot(a: number[], b: number[]) {
  return a.reduce((sum, x, i) => sum + x * b[i], 0);
}

export default function Ch09AttentionPage() {
  const section = getSectionByPath(SECTION_PATH);
  const [wq, setWq] = useState(1.0);
  const [wk, setWk] = useState(1.0);
  const [wv, setWv] = useState(1.0);

  const { attnMatrix, outputs } = useMemo(() => {
    const queries = EMBEDDINGS.map((e) => scale(e, wq));
    const keys = EMBEDDINGS.map((e) => scale(e, wk));
    const values = EMBEDDINGS.map((e) => scale(e, wv));

    const attnMatrix = queries.map((q) => {
      const scores = keys.map((k) => dot(q, k) / Math.sqrt(D_K));
      return softmax(scores);
    });

    const outputs = attnMatrix.map((row) =>
      row.reduce((acc, weight, j) => add(acc, scale(values[j], weight)), [0, 0, 0])
    );

    return { queries, keys, values, attnMatrix, outputs };
  }, [wq, wk, wv]);

  const maxWeight = Math.max(...attnMatrix.flat(), 0.01);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Hero */}
      <section className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
            <Focus className="w-9 h-9 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{section?.title ?? '注意力机制'}</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          注意力机制让模型根据查询动态加权键值对；自注意力与多头注意力是 Transformer 的核心构建块，使序列中任意位置都能直接交互。
        </p>
        <p className="mt-6 text-sm text-amber-800">
          <ShieldAlert className="w-4 h-4 inline-block mr-1" />
          本页内容仅供教学与非商业学习使用（CC BY-NC 4.0）。
        </p>
      </section>

      {/* Concepts */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">核心概念</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <ConceptCard
            title="查询-键-值"
            description="查询决定关注什么，键决定与查询的相似度，值提供最终聚合的信息内容。"
          />
          <ConceptCard
            title="缩放点积注意力"
            description="用查询与键的内积计算相似度，除以维度平方根防止 softmax 进入饱和区。"
          />
          <ConceptCard
            title="自注意力"
            description="查询、键、值来自同一序列，使每个位置都能直接 attending 到其他位置，捕获长距离依赖。"
          />
          <ConceptCard
            title="多头注意力"
            description="多组独立注意力并行，各自关注不同子空间的关系模式，最后拼接并线性投影。"
          />
          <ConceptCard
            title="位置编码"
            description="为词嵌入注入位置信息，弥补自注意力本身的置换不变性，常用正弦/余弦或可学习编码。"
          />
        </div>
      </section>

      {/* Formulas */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">注意力计算</h2>
        <FormulaCard
          title="缩放点积注意力"
          formula={String.raw`\text{Attention}(Q,K,V) = \text{softmax}\left(\frac{QK^{\!T}}{\sqrt{d_k}}\right)V`}
          description="Q、K、V 分别由输入 X 经可学习权重矩阵 W_Q、W_K、W_V 线性投影得到。"
        />
        <FormulaCard
          title="注意力系数"
          formula={String.raw`\alpha_{ij} = \frac{\exp\bigl(q_i^{\!T} k_j / \sqrt{d_k}\bigr)}{\sum_{j'} \exp\bigl(q_i^{\!T} k_{j'} / \sqrt{d_k}\bigr)}`}
          description="第 i 个查询对所有键的归一化相似度，决定了值向量的加权比例。"
        />
        <FormulaCard
          title="多头注意力"
          formula={String.raw`\text{MultiHead}(Q,K,V) = \text{Concat}(\text{head}_1,\dots,\text{head}_h)W^O`}
          description="每个 head 独立学习一组投影，拼接后再经输出矩阵 W^O 变换。"
        />
      </section>

      {/* Interactive demo */}
      <InteractiveDemo title="交互演示：自注意力热力图">
        <div className="space-y-6">
          <p className="text-gray-700">
            调节查询、键、值的权重标量，观察注意力系数矩阵与输出向量的变化。颜色越深表示注意力权重越高。
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  查询权重 <KaTeX math={String.raw`w_Q`} />
                </label>
                <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{wq.toFixed(2)}</span>
              </div>
              <Slider value={[wq]} min={-2} max={2} step={0.1} onValueChange={(v) => setWq(v[0])} />
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  键权重 <KaTeX math={String.raw`w_K`} />
                </label>
                <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{wk.toFixed(2)}</span>
              </div>
              <Slider value={[wk]} min={-2} max={2} step={0.1} onValueChange={(v) => setWk(v[0])} />
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  值权重 <KaTeX math={String.raw`w_V`} />
                </label>
                <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{wv.toFixed(2)}</span>
              </div>
              <Slider value={[wv]} min={-2} max={2} step={0.1} onValueChange={(v) => setWv(v[0])} />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-700 text-center">注意力权重 α</div>
              <div className="inline-block">
                <div className="flex">
                  <div className="w-8" />
                  {TOKENS.map((t) => (
                    <div key={t} className="w-12 text-center text-xs text-gray-500">
                      {t}
                    </div>
                  ))}
                </div>
                {attnMatrix.map((row, i) => (
                  <div key={i} className="flex items-center">
                    <div className="w-8 text-xs text-gray-500 text-right pr-1">{TOKENS[i]}</div>
                    {row.map((w, j) => (
                      <div
                        key={j}
                        className="w-12 h-12 border border-white flex items-center justify-center text-xs font-mono"
                        style={{
                          backgroundColor: `rgba(59, 130, 246, ${Math.max(w / maxWeight, 0.05)})`,
                        }}
                        title={`${TOKENS[i]} → ${TOKENS[j]}: ${w.toFixed(3)}`}
                      >
                        {w.toFixed(2)}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-700">输出向量</div>
              <div className="space-y-2">
                {outputs.map((out, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-2">
                    <div className="w-8 text-sm font-medium text-gray-700">{TOKENS[i]}</div>
                    <div className="font-mono text-sm text-gray-600">[{out.map((v) => v.toFixed(2)).join(', ')}]</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <FormulaCard
            title="当前注意力输出"
            formula={String.raw`\text{head}_i = \sum_{j=1}^{3} \alpha_{ij}\,v_j`}
            description="每个位置的输出都是所有位置值向量的加权求和，权重由查询-键相似度决定。"
          />
        </div>
      </InteractiveDemo>

      <SectionNavigation sectionPath={SECTION_PATH} />
    </div>
  );
}
