import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, GitBranch, Route, Unlink } from 'lucide-react';
import ChapterProgressCard from '@/components/ChapterProgressCard';

const progressSections = [
  { exerciseSetId: 'chapter08-graphical-models', label: '11.1 图模型', path: '/ch08/graphical-models', exerciseCount: 3 },
  { exerciseSetId: 'chapter08-conditional-independence', label: '11.2 条件独立', path: '/ch08/conditional-independence', exerciseCount: 3 },
  { exerciseSetId: 'chapter08-sequence-models', label: '11.3 序列模型', path: '/ch08/sequence-models', exerciseCount: 3 },
];

const routes = [
  ['11.1 图模型', '/ch08/graphical-models', GitBranch, '从有向无环图读出联合分布的局部因子，并区分概率方向与因果语义'],
  ['11.2 条件独立', '/ch08/conditional-independence', Unlink, '用链、分岔、汇聚与 d-分离判断信息通道何时关闭或打开'],
  ['11.3 序列模型', '/ch08/sequence-models', Route, '从独立模型到马尔可夫链，再用隐状态压缩预测未来所需的历史'],
] as const;

export default function Ch08OverviewPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <section className="rounded-2xl border bg-white px-6 py-12 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100"><BookOpen className="h-9 w-9 text-blue-600" /></div>
        <h1 className="mt-4 text-4xl font-bold text-gray-900">结构化分布</h1>
        <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-gray-600">第 11 章用图把高维联合分布的结构显式画出来：局部条件分布给出因子分解，d-分离给出条件独立语义，链式结构与隐状态则把同一思想扩展到序列。</p>
        <div className="mt-5 inline-flex rounded-full bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-800">Bishop &amp; Bishop §11.1–11.3（教材页码 326–353）</div>
      </section>

      <ChapterProgressCard title="第八章掌握进度" sections={progressSections} />

      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900">学习路线</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {routes.map(([label, path, Icon, description]) => (
            <Link key={path} to={path} className="group rounded-xl border-2 border-blue-200 bg-blue-50 p-5 hover:border-blue-400 hover:shadow-md">
              <Icon className="h-7 w-7 text-blue-700" />
              <h3 className="mt-3 font-bold text-gray-900">{label}</h3>
              <p className="mt-2 text-sm text-gray-700">{description}</p>
              <span className="mt-3 flex items-center gap-1 text-sm font-semibold text-blue-800">进入学习 <ArrowRight className="h-4 w-4" /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-amber-200 bg-amber-50 p-6">
        <h2 className="text-xl font-bold text-amber-900">统一视角：结构就是可检验的假设</h2>
        <p className="mt-2 text-sm leading-relaxed text-amber-950">删除一条边不是美化图形，而是在联合分布中删除一个条件依赖；把全历史缩成前一状态，也不是记号简化，而是马尔可夫假设。图越稀疏，模型越省参数，但允许表达的分布也越少。</p>
      </section>

      <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-6">
        <h2 className="text-xl font-bold text-emerald-900">完成标准</h2>
        <p className="mt-2 text-sm leading-relaxed text-emerald-900">完成三节共 9 道原创练习，并能从任意 DAG 写出因子分解、用 d-分离判断链/分岔/汇聚路径，以及解释为什么隐状态是一阶马尔可夫而边缘观测序列通常不是。</p>
      </section>
    </div>
  );
}
