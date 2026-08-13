import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, MessageSquare, Network, Orbit } from 'lucide-react';
import ChapterProgressCard from '@/components/ChapterProgressCard';

const progressSections = [
  { exerciseSetId: 'chapter10-graph-basics', label: '13.1 图上的机器学习', path: '/ch10/machine-learning-on-graphs', exerciseCount: 3 },
  { exerciseSetId: 'chapter10-message-passing', label: '13.2 神经消息传递', path: '/ch10/neural-message-passing', exerciseCount: 3 },
  { exerciseSetId: 'chapter10-general-graphs', label: '13.3 通用图网络', path: '/ch10/general-graph-networks', exerciseCount: 3 },
];

const routes = [
  ['13.1 图上的机器学习', '/ch10/machine-learning-on-graphs', Network, '节点、边与图级任务，邻接矩阵，以及置换等变/不变'],
  ['13.2 神经消息传递', '/ch10/neural-message-passing', MessageSquare, '卷积视角、聚合—更新算法，以及节点、边、图级读出'],
  ['13.3 通用图网络', '/ch10/general-graph-networks', Orbit, '图注意力，边与全局嵌入，过平滑、正则化与几何对称性'],
] as const;

export default function Ch10OverviewPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 py-8">
      <section className="rounded-2xl border bg-white px-6 py-12 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100"><BookOpen className="h-9 w-9 text-blue-600" /></div>
        <h1 className="mt-4 text-4xl font-bold text-gray-900">图神经网络</h1>
        <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-gray-600">第 13 章从“图没有天然节点顺序”出发，把卷积改写成共享的邻域聚合与节点更新；再扩展到注意力、边与全局状态，并用几何不变/等变性约束空间图网络。</p>
        <div className="mt-5 inline-flex rounded-full bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-800">Bishop &amp; Bishop §13.1–13.3（教材页码 407–425）</div>
      </section>

      <ChapterProgressCard title="第十章掌握进度" sections={progressSections} />

      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900">学习路线</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {routes.map(([label, path, Icon, description]) => (
            <Link key={path} to={path} className="group rounded-xl border-2 border-blue-200 bg-blue-50 p-5 hover:border-blue-400 hover:shadow-md">
              <Icon className="h-7 w-7 text-blue-700" /><h3 className="mt-3 font-bold text-gray-900">{label}</h3><p className="mt-2 text-sm text-gray-700">{description}</p><span className="mt-3 flex items-center gap-1 text-sm font-semibold text-blue-800">进入学习 <ArrowRight className="h-4 w-4" /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-amber-200 bg-amber-50 p-6"><h2 className="text-xl font-bold text-amber-900">统一视角：先声明对称性，再设计聚合</h2><p className="mt-2 text-sm leading-relaxed text-amber-950">重编号节点不应改变图的语义：节点输出要跟随重排，整图输出要保持不变；若还存在空间坐标，就要继续声明平移、旋转和镜像下哪些量应不变、哪些向量应同步变换。共享更新与对称聚合把这些要求直接写进架构。</p></section>
      <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-6"><h2 className="text-xl font-bold text-emerald-900">完成标准</h2><p className="mt-2 text-sm leading-relaxed text-emerald-900">完成三节共 9 道原创练习，并能验证 PAPᵀ 与 PX 的重编号关系、从聚合—更新证明消息传递层的置换等变性、解释 GAT 的中心邻域归一化与过平滑缓解方法，以及证明平方距离的几何不变性。</p></section>
    </div>
  );
}
