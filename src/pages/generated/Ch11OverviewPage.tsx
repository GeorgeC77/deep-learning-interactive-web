import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Dices, Route, Wind } from 'lucide-react';
import ChapterProgressCard from '@/components/ChapterProgressCard';

const progressSections = [
  { exerciseSetId: 'chapter11-basic-sampling', label: '14.1 基本采样算法', path: '/ch11/basic-sampling-algorithms', exerciseCount: 3 },
  { exerciseSetId: 'chapter11-mcmc', label: '14.2 马尔可夫链蒙特卡洛', path: '/ch11/markov-chain-monte-carlo', exerciseCount: 3 },
  { exerciseSetId: 'chapter11-langevin', label: '14.3 Langevin 采样', path: '/ch11/langevin-sampling', exerciseCount: 3 },
];

const routes = [
  ['14.1 基本采样算法', '/ch11/basic-sampling-algorithms', Dices, '蒙特卡洛期望、变换与拒绝采样、重要性权重和 SIR'],
  ['14.2 马尔可夫链蒙特卡洛', '/ch11/markov-chain-monte-carlo', Route, 'Metropolis、平稳分布、MH 修正、Gibbs 与祖先采样'],
  ['14.3 Langevin 采样', '/ch11/langevin-sampling', Wind, '能量模型、似然的正负相位、score 与带噪梯度链'],
] as const;

export default function Ch11OverviewPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 py-8">
      <section className="rounded-2xl border bg-white px-6 py-12 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100"><BookOpen className="h-9 w-9 text-blue-600" /></div>
        <h1 className="mt-4 text-4xl font-bold text-gray-900">采样</h1>
        <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-gray-600">第 14 章从“用样本均值近似期望”出发：直接提议不理想时用拒绝或重要性权重校正，高维中改为构造以目标分布为平稳分布的马尔可夫链，最后利用 score 把无方向随机游走变成带噪梯度探索。</p>
        <div className="mt-5 inline-flex rounded-full bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-800">Bishop &amp; Bishop §14.1–14.3（教材页码 429–456）</div>
      </section>

      <ChapterProgressCard title="第十一章掌握进度" sections={progressSections} />

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

      <section className="rounded-xl border border-amber-200 bg-amber-50 p-6"><h2 className="text-xl font-bold text-amber-900">统一视角：覆盖、校正与混合</h2><p className="mt-2 text-sm leading-relaxed text-amber-950">提议分布首先要覆盖真正有贡献的区域；拒绝采样用接受概率校正，重要性采样用权重校正，MH 用接受率校正状态依赖提议。校正保证目标正确，提议尺度与 score 则决定样本能否快速混合。</p></section>
      <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-6"><h2 className="text-xl font-bold text-emerald-900">完成标准</h2><p className="mt-2 text-sm leading-relaxed text-emerald-900">完成三节共 9 道原创练习，并能推导重要性权重与自归一化估计、用细致平衡解释 MH 接受率、区分 Gibbs 与祖先采样，以及从 EBM 推出 score 和数据/模型两项似然梯度。</p></section>
    </div>
  );
}
