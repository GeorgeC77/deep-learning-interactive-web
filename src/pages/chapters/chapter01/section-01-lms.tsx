import { BookOpen, FunctionSquare, TrendingDown, FileSpreadsheet, BarChart3, Brain, ShieldAlert, Home, GraduationCap, ArrowRight, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import KaTeX from '@/components/KaTeX';
import FormulaCard from '@/components/FormulaCard';

const roadmapItems = [
  { label: '课程概览', path: '/overview', icon: GraduationCap, desc: '监督学习与线性回归引入', color: 'bg-slate-100 text-slate-700 border-slate-300' },
  { label: '模型表示', path: '/model', icon: FunctionSquare, desc: '假设函数与参数', color: 'bg-blue-100 text-blue-700 border-blue-300' },
  { label: '代价函数', path: '/cost-function', icon: TrendingDown, desc: '衡量拟合程度', color: 'bg-emerald-100 text-emerald-700 border-emerald-300' },
  { label: '梯度下降', path: '/gradient-descent', icon: BarChart3, desc: '优化参数', color: 'bg-violet-100 text-violet-700 border-violet-300' },
  { label: '正规方程', path: '/normal-equation', icon: FileSpreadsheet, desc: '解析解', color: 'bg-amber-100 text-amber-700 border-amber-300' },
  { label: '概率解释', path: '/probabilistic', icon: Brain, desc: '为什么最小二乘', color: 'bg-rose-100 text-rose-700 border-rose-300' },
  { label: '过拟合', path: '/overfitting', icon: ShieldAlert, desc: '正则化', color: 'bg-orange-100 text-orange-700 border-orange-300' },
];

export default function Chapter01Section01Page() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-12">
      {/* Hero */}
      <section className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-center mb-4">
          <BookOpen className="w-12 h-12 text-blue-600" />
        </div>
        <div className="text-sm font-medium text-blue-600 mb-2 tracking-wide uppercase">
          第一章 · 线性回归
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          1.1 LMS algorithm
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          最小均方（LMS）算法是线性回归的核心优化方法。我们将从模型假设出发，
          学习梯度下降、正规方程与概率解释，理解如何通过数据学习最优参数。
        </p>

        <p className="mt-6 text-sm text-amber-700 flex items-center justify-center gap-2"><AlertTriangle className="w-4 h-4" /> 本内容仅供教学与非商业学习使用，完整授权说明见页脚。</p>
      </section>

      {/* What is LMS */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">什么是 LMS 算法？</h2>
        <p className="text-gray-700 mb-4">
          LMS（Least Mean Squares）算法通过迭代更新参数 <KaTeX math={String.raw`\theta`} />，
          使得预测值 <KaTeX math={String.raw`h_\theta(x)`} /> 与真实值 <KaTeX math={String.raw`y`} /> 之间的误差逐渐减小。
          每次更新都沿着代价函数下降最快的方向——即负梯度方向——迈出一小步。
        </p>
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <FormulaCard
            title="LMS 更新规则"
            formula={
              <KaTeX
                math={String.raw`\theta_j := \theta_j + \alpha \left(y^{(i)} - h_\theta(x^{(i)})\right) x_j^{(i)}`}
                display
              />
            }
            description="对单个训练样本，参数按预测误差成正比更新。"
          />
          <FormulaCard
            title="批量梯度下降"
            formula={
              <KaTeX
                math={String.raw`\theta_j := \theta_j + \alpha \sum_{i=1}^{n} \left(y^{(i)} - h_\theta(x^{(i)})\right) x_j^{(i)}`}
                display
              />
            }
            description="每次迭代遍历整个训练集，稳定收敛到全局最优。"
          />
        </div>
      </section>

      {/* Learning Path */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">本节学习路径</h2>
        <p className="text-gray-600 mb-6">
          点击下方卡片进入对应主题的交互式学习页面。建议按顺序学习，以获得最完整的理解。
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roadmapItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="group flex flex-col p-5 rounded-xl border transition-all hover:shadow-md bg-white border-gray-200 hover:border-blue-300"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${item.color.split(' ').slice(0, 2).join(' ')} border ${item.color.split(' ')[2]}`}>
                <item.icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                {item.label}
              </h3>
              <p className="text-sm text-gray-600 flex-grow">{item.desc}</p>
              <div className="mt-4 flex items-center text-sm font-medium text-blue-600">
                开始学习
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Return home */}
      <section className="flex justify-center pb-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors"
        >
          <Home className="w-4 h-4" />
          返回课程目录
        </Link>
      </section>
    </div>
  );
}
