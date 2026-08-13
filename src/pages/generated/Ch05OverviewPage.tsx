import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Calculator, GitBranch, GitMerge, Target } from 'lucide-react';
import ChapterProgressCard from '@/components/ChapterProgressCard';

const progressSections = [
  { exerciseSetId: 'chapter05-gradient-evaluation', label: '8.1 梯度求值', path: '/ch05/evaluation-of-gradients', exerciseCount: 3 },
  { exerciseSetId: 'chapter05-autodiff', label: '8.2 自动微分', path: '/ch05/automatic-differentiation', exerciseCount: 3 },
];

const roadmapItems = [
  {
    label: '8.1 梯度求值',
    path: '/ch05/evaluation-of-gradients',
    icon: GitBranch,
    description: '从单层局部梯度到一般前馈网络反传，再比较有限差分、Jacobian 与 Hessian。',
    color: 'border-blue-300 bg-blue-50 text-blue-800',
  },
  {
    label: '8.2 自动微分',
    path: '/ch05/automatic-differentiation',
    icon: Calculator,
    description: '沿执行轨迹传播 tangent 或 adjoint，用输入/输出维度决定前向或反向模式。',
    color: 'border-violet-300 bg-violet-50 text-violet-800',
  },
];

export default function Ch05OverviewPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <section className="rounded-2xl border border-gray-200 bg-white py-12 px-6 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
          <GitMerge className="h-9 w-9 text-blue-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900">反向传播与自动微分</h1>
        <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-gray-600">
          反向传播不是优化器，而是高效计算导数的局部消息传递过程。本章从网络权重的局部梯度出发，
          推导一般计算图上的梯度累积，再把它放进前向与反向模式自动微分的统一框架。
        </p>
        <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-800">
          <BookOpen className="h-4 w-4" /> Bishop &amp; Bishop §8.1–8.2（教材页码 233–250）
        </div>
      </section>

      <ChapterProgressCard title="第五章掌握进度" sections={progressSections} />

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <Target className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">学习路线</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {roadmapItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.path} to={item.path} className={`group rounded-xl border-2 p-5 transition hover:-translate-y-0.5 hover:shadow-md ${item.color}`}>
                <Icon className="h-8 w-8" />
                <h3 className="mt-3 text-lg font-bold text-gray-900">{item.label}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-700">{item.description}</p>
                <span className="mt-4 flex items-center gap-1 text-sm font-semibold">进入学习 <ArrowRight className="h-4 w-4" /></span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="rounded-xl border border-amber-200 bg-amber-50 p-6">
        <h2 className="text-xl font-bold text-amber-900">先区分三件事</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3 text-sm leading-relaxed text-amber-950">
          <p><strong>反向传播：</strong>给定函数与上游信号，计算梯度的过程。</p>
          <p><strong>自动微分：</strong>由程序根据执行轨迹生成导数计算，可采用前向或反向模式。</p>
          <p><strong>梯度下降：</strong>使用已经算出的梯度更新参数的优化算法。</p>
        </div>
      </section>

      <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-6">
        <h2 className="text-xl font-bold text-emerald-900">完成标准</h2>
        <p className="mt-2 text-sm leading-relaxed text-emerald-900">
          完成两节共 6 道原创练习；能在分支计算图上正确累加 adjoint、解释中心差分的误差折中，
          并根据输入维度 D 与输出维度 K 选择前向或反向模式，同时说明反向模式的 tape 内存代价。
        </p>
      </section>
    </div>
  );
}
