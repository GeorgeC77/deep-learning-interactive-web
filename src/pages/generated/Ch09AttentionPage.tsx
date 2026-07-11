import { useMemo, useState } from 'react';
import { BookOpen, ChevronLeft, ChevronRight, Focus, ShieldAlert, SlidersHorizontal, AlertTriangle, HelpCircle, Target, Lightbulb, MapPin, Layers } from 'lucide-react';
import ConceptCard from '@/components/ConceptCard';
import FormulaCard from '@/components/FormulaCard';
import InteractiveDemo from '@/components/InteractiveDemo';
import KaTeX from '@/components/KaTeX';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { getSectionByPath, getAllSections } from '@/course/manifest';
import { Link } from 'react-router-dom';

const SECTION_PATH = '/ch09/attention';

const TOKENS = ['深', '度', '学'];
const EMBEDDINGS = [
  [1.0, 0.2, 0.1, 0.0],
  [0.2, 1.0, 0.3, 0.1],
  [0.1, 0.3, 1.0, 0.2],
];
const D_K = 2;
const H = 2;

// Fixed learned projection weights for the advanced demo (D x D)
const W_Q = [
  [0.5, -0.2, 0.1, 0.0],
  [0.3, 0.4, -0.1, 0.2],
  [-0.1, 0.2, 0.6, 0.1],
  [0.0, 0.1, -0.2, 0.5],
];
const W_K = [
  [0.4, 0.1, -0.1, 0.2],
  [-0.2, 0.5, 0.1, 0.0],
  [0.1, -0.1, 0.4, 0.2],
  [0.2, 0.0, 0.1, 0.5],
];
const W_V = [
  [0.6, 0.0, 0.1, -0.1],
  [0.1, 0.5, 0.2, 0.0],
  [-0.1, 0.1, 0.6, 0.2],
  [0.0, 0.2, -0.1, 0.5],
];

function matMul(A: number[][], B: number[][]): number[][] {
  const n = A.length;
  const m = B[0].length;
  const p = B.length;
  const C = Array.from({ length: n }, () => Array(m).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      for (let k = 0; k < p; k++) {
        C[i][j] += A[i][k] * B[k][j];
      }
    }
  }
  return C;
}

function transpose(A: number[][]): number[][] {
  return A[0].map((_, j) => A.map((row) => row[j]));
}

function softmaxRows(A: number[][]): number[][] {
  return A.map((row) => {
    const max = Math.max(...row);
    const exps = row.map((v) => Math.exp(v - max));
    const sum = exps.reduce((a, b) => a + b, 0);
    return exps.map((e) => e / sum);
  });
}

function scaleMatrix(A: number[][], s: number): number[][] {
  return A.map((row) => row.map((v) => v * s));
}

function formatMatrix(A: number[][], digits = 2) {
  return A.map((row) => row.map((v) => v.toFixed(digits)).join(' ')).join(' \\ ');
}

export default function Ch09AttentionPage() {
  const section = getSectionByPath(SECTION_PATH);
  const allSections = getAllSections();
  const currentIndex = allSections.findIndex((s) => s.path === SECTION_PATH);
  const prevSection = allSections[currentIndex - 1] ?? null;
  const nextSection = allSections[currentIndex + 1] ?? null;

  const [wq, setWq] = useState(1.0);
  const [wk, setWk] = useState(1.0);
  const [wv, setWv] = useState(1.0);
  const [advanced, setAdvanced] = useState(false);
  const [seqLen, setSeqLen] = useState(8);
  const [embedDim, setEmbedDim] = useState(64);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number | null>>({});

  // Toy scalar demo
  const { attnMatrix: toyAttn, outputs: toyOutputs } = useMemo(() => {
    const queries = EMBEDDINGS.map((e) => e.slice(0, 3).map((v) => v * wq));
    const keys = EMBEDDINGS.map((e) => e.slice(0, 3).map((v) => v * wk));
    const values = EMBEDDINGS.map((e) => e.slice(0, 3).map((v) => v * wv));

    const attnMatrix = queries.map((q) => {
      const scores = keys.map((k) => {
        const dot = q.reduce((sum, x, i) => sum + x * k[i], 0);
        return dot / Math.sqrt(3);
      });
      const maxScore = Math.max(...scores);
      const exps = scores.map((s) => Math.exp(s - maxScore));
      const sumExp = exps.reduce((a, b) => a + b, 0);
      return exps.map((e) => e / sumExp);
    });

    const outputs = attnMatrix.map((row) =>
      row.reduce((acc, weight, j) => acc.map((v, i) => v + weight * values[j][i]), [0, 0, 0])
    );

    return { attnMatrix, outputs };
  }, [wq, wk, wv]);

  const maxWeight = Math.max(...toyAttn.flat(), 0.01);

  // Advanced matrix demo
  const advancedResults = useMemo(() => {
    const Q = matMul(EMBEDDINGS, transpose(W_Q));
    const K = matMul(EMBEDDINGS, transpose(W_K));
    const V = matMul(EMBEDDINGS, transpose(W_V));
    const scores = matMul(Q, transpose(K));
    const scaledScores = scaleMatrix(scores, 1 / Math.sqrt(D_K));
    const attn = softmaxRows(scaledScores);
    const out = matMul(attn, V);

    // Multi-head split: D=4, H=2 => each head D_k=2
    const headQ = Array.from({ length: H }, (_, h) =>
      Q.map((row) => row.slice(h * D_K, (h + 1) * D_K))
    );
    const headK = Array.from({ length: H }, (_, h) =>
      K.map((row) => row.slice(h * D_K, (h + 1) * D_K))
    );
    const headV = Array.from({ length: H }, (_, h) =>
      V.map((row) => row.slice(h * D_K, (h + 1) * D_K))
    );

    return { Q, K, V, scores: scaledScores, attn, out, headQ, headK, headV };
  }, []);

  const quiz = [
    {
      question: '没有位置编码时，自注意力对 token 顺序具有什么性质？',
      options: ['置换不变性（permutation invariant）', '置换等变性（permutation equivariant）', '完全不受顺序影响，输出也完全不变化', '对顺序高度敏感'],
      correctIndex: 1,
      explanation: '没有位置编码时，若输入 token 顺序被置换，输出 token 会以同样方式置换，因此是置换等变而不是置换不变。',
    },
    {
      question: '缩放点积注意力中除以 √(d_k) 的主要目的是什么？',
      options: ['让 softmax 输出更尖锐', '防止点积过大导致 softmax 梯度消失', '减少参数量', '保证注意力权重和为 1'],
      correctIndex: 1,
      explanation: 'd_k 较大时点积方差会增大，softmax 容易进入饱和区，除以 √(d_k) 可以稳定梯度。',
    },
    {
      question: '自注意力计算复杂度关于序列长度 N 的增长规律是？',
      options: ['O(N)', 'O(N log N)', 'O(N²D)', 'O(N³)'],
      correctIndex: 2,
      explanation: '每个 token 都要与其他所有 token 计算相似度，因此主要计算复杂度为 O(N²D)。',
    },
  ];

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
        <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-800 rounded-full text-sm">
          <MapPin className="w-4 h-4" />
          教材映射：Bishop Ch 12 §12.1
        </div>
        <p className="mt-6 text-sm text-amber-800">
          <ShieldAlert className="w-4 h-4 inline-block mr-1" />
          本页为依据 Bishop & Bishop 教材知识体系制作的原创教学解释与交互演示。教材原文、原图及习题解答版权归原作者和出版方所有。
        </p>
      </section>

      {/* Learning objectives */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Target className="w-6 h-6 text-emerald-600" />
          <h2 className="text-2xl font-bold text-gray-900">学习目标</h2>
        </div>
        <ul className="space-y-2">
          {[
            '理解查询-键-值（Q, K, V）三者在注意力中的角色。',
            '掌握缩放点积注意力的计算流程与除以 √(d_k) 的原因。',
            '区分“置换等变”与“置换不变”，并理解位置编码的必要性。',
            '了解多头注意力如何扩展单头注意力的表达能力。',
            '认识自注意力 O(N²D) 的计算复杂度及其对长序列的影响。',
          ].map((obj, idx) => (
            <li key={idx} className="flex items-start gap-2 text-gray-700">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
              <span>{obj}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Core intuition */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Lightbulb className="w-6 h-6 text-amber-600" />
          <h2 className="text-2xl font-bold text-gray-900">核心直觉</h2>
        </div>
        <div className="text-gray-700 leading-relaxed space-y-3">
          <p>
            可以把注意力想象成“数据库查询”：你有一个查询（Query），一组键（Key）和对应的值（Value）。
            查询与每个键比较相似度，相似度越高，对应的值在最终结果中占比越大。
          </p>
          <p>
            在自注意力中，查询、键、值都来自同一个序列，因此每个位置都能“看向”其他位置，
            并根据内容相关性聚合信息。这使得模型能一次性捕获长距离依赖，而不像 RNN 那样逐步传递。
          </p>
          <p>
            <strong>关键细节：</strong>自注意力本身对 token 顺序是<strong>置换等变</strong>的——
            如果打乱输入 token 的顺序，输出 token 会按同样方式被打乱，但每个输出对应的局部计算不变。
            因此处理自然语言等顺序敏感任务时，必须加入位置编码来打破这种对称性。
          </p>
        </div>
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
            description="查询、键、值来自同一序列，使每个位置都能关注其他位置、向其他 token 分配注意力权重，从而捕获长距离依赖。"
          />
          <ConceptCard
            title="置换等变与位置编码"
            description="没有位置编码时，自注意力/Transformer 层对 token 顺序是置换等变的：输入顺序被置换，输出 token 会以同样方式置换。因此处理自然语言必须加入位置编码。"
          />
          <ConceptCard
            title="多头注意力"
            description="多组独立注意力并行，各自关注不同子空间的关系模式，最后拼接并线性投影。"
          />
          <ConceptCard
            title="计算复杂度"
            description="自注意力的主要计算复杂度为 O(N²D)，序列长度 N 增大时计算量呈二次增长，是长序列建模的核心瓶颈。"
          />
        </div>
      </section>

      {/* Formulas */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">数学公式</h2>
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
        <FormulaCard
          title="计算复杂度"
          formula={String.raw`\mathcal{C} = O(N^2 \, D)`}
          description="N 为序列长度，D 为模型维度；注意力矩阵 N×N 的计算量是 Transformer 处理长序列时的主要瓶颈。"
        />
      </section>

      {/* Interactive demo */}
      <InteractiveDemo title="交互演示：自注意力">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-gray-700">
              {advanced
                ? '高级模式：展示完整的矩阵投影 Q=XW_Q、K=XW_K、V=XW_V、缩放点积、softmax 与输出。'
                : '简化的一维玩具演示：用标量权重调节查询、键、值，观察注意力系数矩阵与输出向量的变化。'}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">高级模式</span>
              <Switch checked={advanced} onCheckedChange={setAdvanced} />
            </div>
          </div>

          {!advanced ? (
            <>
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
                    {toyAttn.map((row, i) => (
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
                    {toyOutputs.map((out, i) => (
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
            </>
          ) : (
            <div className="space-y-6">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
                提示：这是固定权重下的矩阵演示。输入 X 为 3×4，投影后 Q/K/V 为 3×4；多头拆分为 2 个 head，每个 head 的维度 d_k=2。
              </div>

              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="space-y-1">
                  <div className="font-medium text-gray-700">XW_Q = Q</div>
                  <div className="font-mono bg-gray-50 p-2 rounded overflow-auto">
                    <KaTeX math={`\\begin{bmatrix}${formatMatrix(advancedResults.Q)}\\end{bmatrix}`} />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="font-medium text-gray-700">XW_K = K</div>
                  <div className="font-mono bg-gray-50 p-2 rounded overflow-auto">
                    <KaTeX math={`\\begin{bmatrix}${formatMatrix(advancedResults.K)}\\end{bmatrix}`} />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="font-medium text-gray-700">XW_V = V</div>
                  <div className="font-mono bg-gray-50 p-2 rounded overflow-auto">
                    <KaTeX math={`\\begin{bmatrix}${formatMatrix(advancedResults.V)}\\end{bmatrix}`} />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <div className="font-medium text-gray-700">Scores = QK^T / √(d_k)</div>
                  <div className="font-mono bg-gray-50 p-2 rounded overflow-auto">
                    <KaTeX math={`\\begin{bmatrix}${formatMatrix(advancedResults.scores)}\\end{bmatrix}`} />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="font-medium text-gray-700">Softmax(Scores) = A</div>
                  <div className="font-mono bg-gray-50 p-2 rounded overflow-auto">
                    <KaTeX math={`\\begin{bmatrix}${formatMatrix(advancedResults.attn)}\\end{bmatrix}`} />
                  </div>
                </div>
              </div>

              <div className="space-y-1 text-sm">
                <div className="font-medium text-gray-700">输出 = AV</div>
                <div className="font-mono bg-gray-50 p-2 rounded overflow-auto">
                  <KaTeX math={`\\begin{bmatrix}${formatMatrix(advancedResults.out)}\\end{bmatrix}`} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="font-medium text-gray-700 flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  多头拆分（H=2, d_k=2）
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {[0, 1].map((h) => (
                    <div key={h} className="bg-white border border-gray-200 rounded-lg p-3 text-sm">
                      <div className="font-medium text-gray-700 mb-2">Head {h + 1}</div>
                      <div className="text-xs text-gray-500 mb-1">Q_h</div>
                      <div className="font-mono bg-gray-50 p-1 rounded mb-2">
                        <KaTeX math={`\\begin{bmatrix}${formatMatrix(advancedResults.headQ[h])}\\end{bmatrix}`} />
                      </div>
                      <div className="text-xs text-gray-500 mb-1">V_h</div>
                      <div className="font-mono bg-gray-50 p-1 rounded">
                        <KaTeX math={`\\begin{bmatrix}${formatMatrix(advancedResults.headV[h])}\\end{bmatrix}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </InteractiveDemo>

      {/* Complexity demo */}
      <InteractiveDemo title="复杂度演示：O(N²D)">
        <div className="space-y-6">
          <p className="text-gray-700">
            调节序列长度 N 与模型维度 D，观察自注意力层计算量（相对值）如何随 N 二次增长。
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">序列长度 N</label>
                <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{seqLen}</span>
              </div>
              <Slider value={[seqLen]} min={4} max={256} step={4} onValueChange={(v) => setSeqLen(v[0])} />
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">模型维度 D</label>
                <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{embedDim}</span>
              </div>
              <Slider value={[embedDim]} min={16} max={512} step={16} onValueChange={(v) => setEmbedDim(v[0])} />
            </div>
            <div className="bg-blue-50 rounded-lg p-5 border border-blue-200 flex flex-col justify-center">
              <div className="text-sm text-gray-600">相对计算量</div>
              <div className="text-3xl font-bold text-blue-700">{(seqLen * seqLen * embedDim).toLocaleString()}</div>
              <div className="text-sm text-gray-500 mt-2">
                <KaTeX math={String.raw`N^2 \cdot D = ${seqLen}^2 \cdot ${embedDim}`} />
              </div>
            </div>
          </div>
        </div>
      </InteractiveDemo>

      {/* Common mistakes */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-6 h-6 text-red-600" />
          <h2 className="text-2xl font-bold text-gray-900">常见误区</h2>
        </div>
        <ul className="space-y-3">
          {[
            '把“置换等变”说成“置换不变”。等变意味着输出会随输入顺序一起置换；不变才意味着输出完全不变。',
            '忽略位置编码的必要性。没有位置编码时，Transformer 无法区分 “猫追狗” 与 “狗追猫”。',
            '认为注意力权重是模型直接“理解”语义的结果。权重由可学习投影决定，其可解释性需额外验证。',
            '低估长序列开销。当 N 从 1k 增加到 4k 时，注意力计算量增长约 16 倍。',
          ].map((m, idx) => (
            <li key={idx} className="flex items-start gap-2 text-gray-700">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
              <span>{m}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Quiz */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <HelpCircle className="w-6 h-6 text-violet-600" />
          <h2 className="text-2xl font-bold text-gray-900">小测题</h2>
        </div>
        <div className="space-y-6">
          {quiz.map((q, qIdx) => (
            <div key={qIdx} className="border border-gray-200 rounded-lg p-4">
              <div className="font-medium text-gray-900 mb-3">
                {qIdx + 1}. {q.question}
              </div>
              <div className="space-y-2">
                {q.options.map((opt, oIdx) => {
                  const answered = quizAnswers[qIdx] !== undefined;
                  const isSelected = quizAnswers[qIdx] === oIdx;
                  const isCorrect = oIdx === q.correctIndex;
                  let btnClass = 'w-full text-left px-3 py-2 rounded-md text-sm border transition-colors ';
                  if (answered) {
                    if (isCorrect) btnClass += 'bg-emerald-50 border-emerald-300 text-emerald-800';
                    else if (isSelected) btnClass += 'bg-red-50 border-red-300 text-red-800';
                    else btnClass += 'bg-gray-50 border-gray-200 text-gray-500';
                  } else {
                    btnClass += 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700';
                  }
                  return (
                    <button
                      key={oIdx}
                      type="button"
                      disabled={answered}
                      className={btnClass}
                      onClick={() => setQuizAnswers((prev) => ({ ...prev, [qIdx]: oIdx }))}
                    >
                      {String.fromCharCode(65 + oIdx)}. {opt}
                    </button>
                  );
                })}
              </div>
              {quizAnswers[qIdx] !== undefined && (
                <div className="mt-3 text-sm text-gray-700 bg-slate-50 p-3 rounded-md">
                  <span className="font-medium">解析：</span>
                  {q.explanation}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Navigation */}
      <section className="flex flex-wrap justify-between gap-4">
        {prevSection ? (
          <Link
            to={prevSection.path}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            {prevSection.title}
          </Link>
        ) : (
          <div />
        )}
        {nextSection && (
          <Link
            to={nextSection.path}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            {nextSection.title}
            <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </section>
    </div>
  );
}
