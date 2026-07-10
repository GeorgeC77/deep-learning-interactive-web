import { Link } from 'react-router-dom';
import { BookOpen, SeparatorVertical, Scale, BrainCircuit, Activity, ArrowRight } from 'lucide-react';

const roadmapItems = [
  {
    label: '5.1 判别函数',
    path: '/ch02/discriminant-functions',
    icon: SeparatorVertical,
    desc: '二分类与多类判别函数、1-of-K 编码、最小二乘分类',
    color: 'bg-blue-100 text-blue-700 border-blue-300',
  },
  {
    label: '5.2 决策理论',
    path: '/ch02/decision-theory',
    icon: Scale,
    desc: '误分类率、期望损失、拒绝选项与 ROC 曲线',
    color: 'bg-emerald-100 text-emerald-700 border-emerald-300',
  },
  {
    label: '5.3 生成分类器',
    path: '/ch02/generative-classifiers',
    icon: BrainCircuit,
    desc: '类条件密度、最大似然与朴素贝叶斯',
    color: 'bg-amber-100 text-amber-700 border-amber-300',
  },
  {
    label: '5.4 判别分类器',
    path: '/ch02/discriminative-classifiers',
    icon: Activity,
    desc: '激活函数、逻辑回归、多类逻辑回归与 probit',
    color: 'bg-violet-100 text-violet-700 border-violet-300',
  },
];

export default function Ch02OverviewPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-12">
      <section className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-center mb-4">
          <BookOpen className="w-12 h-12 text-blue-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">单层网络：分类</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Bishop 第 5 章围绕分类问题展开：判别函数给出决策边界，决策理论量化错误代价，生成分类器建模类条件分布，判别分类器直接建模后验概率。
        </p>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">本章学习路线</h2>
        <div className="grid md:grid-cols-2 gap-4">
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
          生成分类器与判别分类器的根本区别在于建模对象：前者建模 p(x|C_k) 和 p(C_k)，后者直接建模 p(C_k|x)。当类条件假设成立时生成模型更稳定；当数据量大时判别模型通常更准确。
        </p>
      </section>
    </div>
  );
}
