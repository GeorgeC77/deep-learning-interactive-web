import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Compass, Layers, Scale, Share2, TrendingUp, Users } from 'lucide-react';
import ChapterProgressCard from '@/components/ChapterProgressCard';

const progressSections = [
  { exerciseSetId: 'chapter06-inductive-bias', label: '9.1 归纳偏置', path: '/ch06/inductive-bias', exerciseCount: 3 },
  { exerciseSetId: 'chapter06-weight-decay', label: '9.2 权重衰减', path: '/ch06/weight-decay', exerciseCount: 3 },
  { exerciseSetId: 'chapter06-learning-curves', label: '9.3 学习曲线', path: '/ch06/learning-curves', exerciseCount: 3 },
  { exerciseSetId: 'chapter06-parameter-sharing', label: '9.4 参数共享', path: '/ch06/parameter-sharing', exerciseCount: 3 },
  { exerciseSetId: 'chapter06-residual', label: '9.5 残差连接', path: '/ch06/residual-connections', exerciseCount: 3 },
  { exerciseSetId: 'chapter06-model-averaging', label: '9.6 模型平均', path: '/ch06/model-averaging', exerciseCount: 3 },
];

const routes = [
  ['9.1 归纳偏置', '/ch06/inductive-bias', Compass, '逆问题、无免费午餐、不变性、等变性与数据增强'],
  ['9.2 权重衰减', '/ch06/weight-decay', Scale, '二次惩罚、一致正则化器与广义 q 范数'],
  ['9.3 学习曲线', '/ch06/learning-curves', TrendingUp, '验证曲线、早停与双下降'],
  ['9.4 参数共享', '/ch06/parameter-sharing', Share2, '硬共享、软共享、连接数与自由度'],
  ['9.5 残差连接', '/ch06/residual-connections', Layers, '恒等路径、Jacobian 与深层优化几何'],
  ['9.6 模型平均', '/ch06/model-averaging', Users, '委员会、bagging、相关误差与 Dropout'],
] as const;

export default function OverviewPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <section className="rounded-2xl border bg-white px-6 py-12 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100"><BookOpen className="h-9 w-9 text-blue-600" /></div>
        <h1 className="mt-4 text-4xl font-bold text-gray-900">正则化</h1>
        <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-gray-600">有限数据不能唯一决定预测函数。第 9 章把正则化扩展为一组归纳偏置：从目标函数惩罚、训练时刻选择，到结构共享、残差路径和多个模型的组合。</p>
        <div className="mt-5 inline-flex rounded-full bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-800">Bishop &amp; Bishop §9.1–9.6（教材页码 253–281）</div>
      </section>
      <ChapterProgressCard title="第六章掌握进度" sections={progressSections} />
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900">学习路线</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {routes.map(([label,path,Icon,description]) => <Link key={path} to={path} className="group rounded-xl border-2 border-blue-200 bg-blue-50 p-5 hover:border-blue-400 hover:shadow-md"><Icon className="h-7 w-7 text-blue-700" /><h3 className="mt-3 font-bold text-gray-900">{label}</h3><p className="mt-2 text-sm text-gray-700">{description}</p><span className="mt-3 flex items-center gap-1 text-sm font-semibold text-blue-800">进入学习 <ArrowRight className="h-4 w-4" /></span></Link>)}
        </div>
      </section>
      <section className="rounded-xl border border-amber-200 bg-amber-50 p-6"><h2 className="text-xl font-bold text-amber-900">统一视角：偏好哪一种解</h2><p className="mt-2 text-sm leading-relaxed text-amber-950">权重衰减偏好小参数，早停偏好短优化轨迹，参数共享偏好满足结构约束的函数，残差连接偏好靠近恒等变换的深层组合，模型平均则用多个解的预测降低方差。它们可以组合，但每种偏置都必须与任务匹配。</p></section>
      <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-6"><h2 className="text-xl font-bold text-emerald-900">完成标准</h2><p className="mt-2 text-sm leading-relaxed text-emerald-900">完成六节共 18 道原创练习，并能用实验解释安全的数据增强、权重收缩、早停 checkpoint、共享参数的梯度累加、残差 Jacobian，以及模型相关性对集成收益的限制。</p></section>
    </div>
  );
}
