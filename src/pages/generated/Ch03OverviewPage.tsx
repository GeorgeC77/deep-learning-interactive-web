import { Link } from 'react-router-dom';
import { BookOpen, AlertTriangle, Layers, ArrowRight, Target, Lightbulb, Brain, GitBranch } from 'lucide-react';

const roadmapItems = [
  {
    label: '6.1 固定基函数的局限性',
    path: '/ch03/limitations-of-fixed-basis-functions',
    icon: AlertTriangle,
    desc: '维度灾难、高维空间的数据流形、从固定基函数到可学习基函数的动机',
    color: 'bg-blue-100 text-blue-700 border-blue-300',
  },
  {
    label: '6.2 多层网络',
    path: '/ch03/multilayer-networks',
    icon: Layers,
    desc: '参数矩阵、通用近似定理、隐藏单元激活函数、权重空间对称性',
    color: 'bg-emerald-100 text-emerald-700 border-emerald-300',
  },
  {
    label: '6.3 深度网络',
    path: '/ch03/deep-networks',
    icon: Brain,
    desc: '层次化表示、分布式表示、表示学习、迁移学习与对比学习',
    color: 'bg-violet-100 text-violet-700 border-violet-300',
  },
  {
    label: '6.4 误差函数',
    path: '/ch03/error-functions',
    icon: Target,
    desc: '回归、二分类与多分类的误差函数及其概率解释',
    color: 'bg-rose-100 text-rose-700 border-rose-300',
  },
  {
    label: '6.5 混合密度网络',
    path: '/ch03/mixture-density-networks',
    icon: GitBranch,
    desc: '条件混合分布、机器人运动学示例、多模态预测分布',
    color: 'bg-amber-100 text-amber-700 border-amber-300',
  },
];

export default function Ch03OverviewPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-12">
      <section className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
            <BookOpen className="w-9 h-9 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">深度神经网络</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          从单层网络到多层深度网络的关键一步。本章对齐 Bishop 教材第 6 章，解释为什么固定基函数不够用，
          多层网络如何通过可学习特征表示突破维度灾难，以及深度架构如何实现层次化表示学习。
        </p>
        <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-800 rounded-full text-sm font-medium">
          <Target className="w-4 h-4" />
          Bishop &amp; Bishop §6.1–6.5（教材页码 171–204）
        </div>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Lightbulb className="w-6 h-6 text-amber-600" />
          <h2 className="text-2xl font-bold text-gray-900">从单层到深度：核心飞跃</h2>
        </div>
        <div className="text-gray-700 leading-relaxed space-y-3">
          <p>前两章（第 4–5 章）使用<strong>固定基函数</strong>将输入映射到特征空间——但基函数是人工选择的，不随数据学习。</p>
          <p>本章完成机器学习中的关键飞跃：</p>
          <ul className="space-y-2 ml-4">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
              <span><strong>从固定基函数 → 可学习基函数</strong>：用神经网络隐藏层自动学习特征表示</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
              <span><strong>从浅层 → 深度</strong>：堆叠多层，每层学习不同抽象层次的特征</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
              <span><strong>从单任务 → 迁移</strong>：深度网络的层次化特征可在不同任务间复用</span>
            </li>
          </ul>
        </div>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Brain className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">学习路线</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roadmapItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.path} to={item.path}
                className={`block p-5 rounded-xl border-2 transition-all hover:shadow-md hover:scale-[1.02] ${item.color} bg-white`}>
                <Icon className="w-8 h-8 mb-3" />
                <h3 className="font-bold text-gray-900 mb-2">{item.label}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
                <div className="mt-3 flex items-center gap-1 text-sm font-medium">
                  进入学习 <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Target className="w-6 h-6 text-emerald-600" />
          <h2 className="text-2xl font-bold text-gray-900">学完本章你将能够</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-2">
          {[
            '解释维度灾难如何使固定基函数方法在高维空间中失效',
            '理解数据流形假设及其对深度学习的重要意义',
            '描述多层网络的前向传播过程（参数矩阵和激活函数）',
            '列举常见隐藏单元激活函数并比较其特点',
            '理解通用近似定理及其对网络宽度和深度的含义',
            '解释层次化表示和分布式表示的概念',
            '写出回归、二分类和多分类的误差函数及其概率推导',
            '了解混合密度网络如何建模多模态条件分布',
          ].map((obj, idx) => (
            <li key={idx} className="flex items-start gap-2 text-gray-700">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
              <span>{obj}</span>
            </li>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-blue-800 mb-3">🔗 本章的枢纽地位</h3>
        <p className="text-sm text-blue-800 leading-relaxed">
          第 6 章是 Bishop 教材的转折点。前 5 章建立了概率论和单层模型的基础；从本章开始，
          网络有了"深度"——隐藏层自动学习特征，输出层只需做简单的线性组合。
          这直接引出后续的梯度下降（第 7 章）、反向传播（第 8 章）和正则化（第 9 章），
          构成了现代深度学习的核心三部曲。
        </p>
      </section>

      <p className="text-center text-sm text-gray-400">
        本页为依据 Bishop & Bishop 教材知识体系制作的原创教学解释与交互演示。
        教材原文、原图及习题解答版权归原作者和出版方所有。
      </p>
    </div>
  );
}
