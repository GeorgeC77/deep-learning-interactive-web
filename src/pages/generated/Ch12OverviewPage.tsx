import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, ChartNoAxesCombined, GitBranch, ScanSearch, Scale } from 'lucide-react';
import ChapterProgressCard from '@/components/ChapterProgressCard';

const progressSections = [
  { exerciseSetId: 'chapter12-kmeans', label: '15.1 K-means 聚类', path: '/ch12/k-means-clustering', exerciseCount: 3 },
  { exerciseSetId: 'chapter12-gmm', label: '15.2 高斯混合', path: '/ch12/mixtures-of-gaussians', exerciseCount: 3 },
  { exerciseSetId: 'chapter12-em', label: '15.3 期望最大化算法', path: '/ch12/expectation-maximization', exerciseCount: 3 },
  { exerciseSetId: 'chapter12-elbo', label: '15.4 证据下界', path: '/ch12/evidence-lower-bound', exerciseCount: 3 },
];

const routes = [
  ['15.1 K-means 聚类', '/ch12/k-means-clustering', ScanSearch, '硬分配与质心更新、有限步稳定、初始化局限和图像分割'],
  ['15.2 高斯混合', '/ch12/mixtures-of-gaussians', ChartNoAxesCombined, '离散隐变量、软责任度、混合似然、奇异点与标签交换'],
  ['15.3 期望最大化算法', '/ch12/expectation-maximization', GitBranch, 'GMM 的 E/M 更新、K-means 极限、Bernoulli 混合与局部最优'],
  ['15.4 证据下界', '/ch12/evidence-lower-bound', Scale, 'ELBO 分解、EM 再解释、参数先验、广义 EM 与顺序 EM'],
] as const;

export default function Ch12OverviewPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 py-8">
      <section className="rounded-2xl border bg-white px-6 py-12 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
          <BookOpen className="h-9 w-9 text-blue-600" />
        </div>
        <h1 className="mt-4 text-4xl font-bold text-gray-900">离散隐变量</h1>
        <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-gray-600">
          第 15 章从 K-means 的硬分配出发，把簇编号提升为随机隐变量，于是得到高斯混合的软责任度；EM 再交替估计隐变量后验与模型参数，ELBO 最后说明这套交替更新为何能让似然单调不减。
        </p>
        <div className="mt-5 inline-flex rounded-full bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-800">
          Bishop &amp; Bishop §15.1–15.4（教材页码 459–490）
        </div>
      </section>

      <ChapterProgressCard title="第十二章掌握进度" sections={progressSections} />

      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900">学习路线</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
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
        <h2 className="text-xl font-bold text-amber-900">统一视角：从硬分配到可优化下界</h2>
        <p className="mt-2 text-sm leading-relaxed text-amber-950">
          K-means 的 rₙₖ 只能取 0 或 1；GMM 的 γₙₖ 是和为 1 的后验概率。EM 用 E-step 更新“该怎么分”，用 M-step 更新“每类长什么样”；ELBO 则把观测似然拆成可计算下界与非负 KL 间隙。
        </p>
      </section>

      <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-6">
        <h2 className="text-xl font-bold text-emerald-900">完成标准</h2>
        <p className="mt-2 text-sm leading-relaxed text-emerald-900">
          完成四节共 12 道原创练习，并能推导 K-means 质心更新与 GMM 责任度、写出 GMM 的 E/M 两步、解释方差趋零为何产生硬分配，以及用 log p=ELBO+KL 说明精确 EM 与广义 EM 的单调性边界。
        </p>
      </section>
    </div>
  );
}
