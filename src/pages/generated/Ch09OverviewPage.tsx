import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Bot, Focus, ImagePlus, Languages } from 'lucide-react';
import ChapterProgressCard from '@/components/ChapterProgressCard';

const progressSections = [
  { exerciseSetId: 'chapter09-attention', label: '12.1 注意力机制', path: '/ch09/attention', exerciseCount: 3 },
  { exerciseSetId: 'chapter09-natural-language', label: '12.2 自然语言', path: '/ch09/natural-language', exerciseCount: 3 },
  { exerciseSetId: 'chapter09-language-models', label: '12.3 语言模型', path: '/ch09/transformer-language-models', exerciseCount: 3 },
  { exerciseSetId: 'chapter09-multimodal', label: '12.4 多模态', path: '/ch09/multimodal-transformers', exerciseCount: 3 },
];

const routes = [
  ['12.1 注意力机制', '/ch09/attention', Focus, 'Q/K/V、缩放点积、多头、Transformer 层、复杂度与位置编码'],
  ['12.2 自然语言', '/ch09/natural-language', Languages, '词嵌入、分词、词袋、自回归模型、RNN 与 BPTT'],
  ['12.3 Transformer 语言模型', '/ch09/transformer-language-models', Bot, 'decoder、采样与 beam search、encoder、seq2seq 和 LLM'],
  ['12.4 多模态 Transformer', '/ch09/multimodal-transformers', ImagePlus, '图像 patch、离散图像码、音频、语音合成与视觉-语言 token'],
] as const;

export default function Ch09OverviewPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <section className="rounded-2xl border bg-white px-6 py-12 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100"><BookOpen className="h-9 w-9 text-blue-600" /></div>
        <h1 className="mt-4 text-4xl font-bold text-gray-900">Transformer</h1>
        <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-gray-600">第 12 章从注意力的加权检索出发，先建立语言表示与自回归建模，再组合 encoder、decoder 与 cross-attention，最后说明只要能把输入输出变成合适的 token，同一核心架构就能跨越文本、图像和音频。</p>
        <div className="mt-5 inline-flex rounded-full bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-800">Bishop &amp; Bishop §12.1–12.4（教材页码 357–403）</div>
      </section>

      <ChapterProgressCard title="第九章掌握进度" sections={progressSections} />

      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900">学习路线</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {routes.map(([label, path, Icon, description]) => (
            <Link key={path} to={path} className="group rounded-xl border-2 border-blue-200 bg-blue-50 p-5 hover:border-blue-400 hover:shadow-md">
              <Icon className="h-7 w-7 text-blue-700" /><h3 className="mt-3 font-bold text-gray-900">{label}</h3><p className="mt-2 text-sm text-gray-700">{description}</p><span className="mt-3 flex items-center gap-1 text-sm font-semibold text-blue-800">进入学习 <ArrowRight className="h-4 w-4" /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-amber-200 bg-amber-50 p-6"><h2 className="text-xl font-bold text-amber-900">统一视角：表示、交互与可见性</h2><p className="mt-2 text-sm leading-relaxed text-amber-950">embedding 决定一个 token 表示什么，位置编码说明它在哪里，注意力决定它与谁交互，mask 决定它能看见谁。跨模态复用 Transformer 并没有消除表示设计，反而把关键难题集中到了 token 化与输出解码。</p></section>
      <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-6"><h2 className="text-xl font-bold text-emerald-900">完成标准</h2><p className="mt-2 text-sm leading-relaxed text-emerald-900">完成四节共 12 道原创练习，并能手算注意力行归一化与缩放、解释 BPTT 的 Jacobian 连乘、区分 greedy 局部最优与序列全局最优，以及计算视觉 patch token 数和 N² 注意力成本。</p></section>
    </div>
  );
}
