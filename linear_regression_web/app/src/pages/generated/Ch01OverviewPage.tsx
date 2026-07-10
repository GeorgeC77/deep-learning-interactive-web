import { Link } from 'react-router-dom';
import { BookOpen, FunctionSquare, Scale, TrendingDown, ArrowRight } from 'lucide-react';

const roadmapItems = [
  {
    label: '4.1 线性回归',
    path: '/ch01/linear-regression',
    icon: FunctionSquare,
    desc: '基函数、最大似然、最小二乘几何与正则化',
    color: 'bg-blue-100 text-blue-700 border-blue-300',
  },
  {
    label: '4.2 决策理论',
    path: '/ch01/decision-theory',
    icon: Scale,
    desc: '损失函数、期望损失与贝叶斯最优决策',
    color: 'bg-emerald-100 text-emerald-700 border-emerald-300',
  },
  {
    label: '4.3 偏差–方差权衡',
    path: '/ch01/bias-variance',
    icon: TrendingDown,
    desc: '模型复杂度、偏差、方差与不可约噪声的分解',
    color: 'bg-violet-100 text-violet-700 border-violet-300',
  },
];

export default function Ch01OverviewPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-12">
      <section className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-center mb-4">
          <BookOpen className="w-12 h-12 text-blue-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">单层网络：回归</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Bishop 第 4 章从最简单的单层网络出发，介绍线性回归的概率视角：先通过基函数扩展模型能力，再用最大似然导出最小二乘；最后用决策理论与偏差–方差分解理解模型选择。
        </p>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">本章学习路线</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {roadmapItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex flex-col p-5 rounded-xl border-2 transition-all hover:scale-105 hover:shadow-md ${item.color.replace('bg-', 'border-').split(' ')[2]} bg-white`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg ${item.color.split(' ')[0]} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${item.color.split(' ')[1]}`} />
                  </div>
                  <span className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{item.label}</span>
                </div>
                <p className="text-sm text-gray-600 mb-4 flex-grow">{item.desc}</p>
                <div className="flex items-center text-sm font-medium text-blue-600">
                  开始学习 <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-blue-800 mb-3">学习提示</h3>
        <p className="text-sm text-blue-800 leading-relaxed">
          线性回归的“线性”指的是对参数线性，而非对输入线性；基函数可以是非线性的。理解这一点，是把线性回归推广到神经网络的关键第一步。
        </p>
      </section>
    </div>
  );
}
