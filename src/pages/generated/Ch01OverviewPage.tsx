import { Link } from 'react-router-dom';
import { BookOpen, FunctionSquare, Scale, TrendingDown, ArrowRight, Brain, Target, Lightbulb } from 'lucide-react';
import KaTeX from '@/components/KaTeX';

const roadmapItems = [
  {
    label: '4.1 线性回归',
    path: '/ch01/linear-regression',
    icon: FunctionSquare,
    desc: '基函数、似然函数、最大似然估计、最小二乘几何、序列学习、正则化最小二乘与多输出',
    color: 'bg-blue-100 text-blue-700 border-blue-300',
  },
  {
    label: '4.2 决策理论',
    path: '/ch01/decision-theory',
    icon: Scale,
    desc: '损失函数量化错误代价，期望损失最小化导出贝叶斯最优决策',
    color: 'bg-emerald-100 text-emerald-700 border-emerald-300',
  },
  {
    label: '4.3 偏差–方差权衡',
    path: '/ch01/bias-variance',
    icon: TrendingDown,
    desc: '期望测试误差分解为偏差² + 方差 + 不可约噪声，模型选择的核心依据',
    color: 'bg-violet-100 text-violet-700 border-violet-300',
  },
];

export default function Ch01OverviewPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-12">
      {/* Hero */}
      <section className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
            <BookOpen className="w-9 h-9 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">单层网络：回归</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          从最简单的线性回归出发，把它理解为只有一层可学习参数的单层神经网络。
          本章完全对齐 Bishop 教材第 4 章，涵盖线性回归的完整理论体系——
          从基函数展开到概率视角、从最小二乘几何到决策理论、最后进入偏差-方差权衡的经典讨论。
        </p>
        <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-800 rounded-full text-sm font-medium">
          <Target className="w-4 h-4" />
          Bishop &amp; Bishop §4.1–4.3（教材页码 111–128）
        </div>
      </section>

      {/* Why regression first */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Lightbulb className="w-6 h-6 text-amber-600" />
          <h2 className="text-2xl font-bold text-gray-900">为什么从回归开始？</h2>
        </div>
        <div className="text-gray-700 leading-relaxed space-y-3">
          <p>
            线性回归是机器学习最简单的监督学习模型，但它的理论框架包含了所有深度学习方法的核心要素：
          </p>
          <div className="grid md:grid-cols-2 gap-3 mt-3">
            {[
              { label: '模型', detail: '用基函数的线性组合对输入-输出关系建模。关键：线性是对参数 w 而言，基函数可以非线性。' },
              { label: '损失函数', detail: '平方误差度量预测与目标的差距，是最直观的损失函数。' },
              { label: '概率解释', detail: '高斯噪声假设下，最大似然严格等价于最小二乘——这是连接概率和优化的桥梁。' },
              { label: '学习算法', detail: '正规方程给出闭式解；序列学习（SGD）支持在线更新和大规模数据。' },
              { label: '正则化', detail: 'L2 正则化等价于高斯权重的贝叶斯先验，控制过拟合。' },
              { label: '泛化理论', detail: '偏差-方差分解解释了模型复杂度与泛化误差的关系，指导模型选择。' },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <span className="font-semibold text-blue-700">{item.label}：</span>
                <span className="text-gray-600 text-sm">{item.detail}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Brain className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">学习路线</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {roadmapItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`block p-5 rounded-xl border-2 transition-all hover:shadow-md hover:scale-[1.02] ${item.color} bg-white`}
              >
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

      {/* Learning objectives */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Target className="w-6 h-6 text-emerald-600" />
          <h2 className="text-2xl font-bold text-gray-900">学完本章你将能够</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-2">
          {[
            '将任意非线性基函数嵌入线性模型，理解"对参数线性"的含义',
            '从高斯噪声假设推导出最大似然等价于最小二乘',
            '写出并求解正规方程，理解其几何意义（正交投影）',
            '实现序列学习算法在线处理流式数据',
            '用 L2 正则化控制模型复杂度，理解其贝叶斯解释',
            '根据损失函数计算期望损失，选择贝叶斯最优预测',
            '将测试误差分解为偏差² + 方差 + σ²，诊断过拟合与欠拟合',
            '理解模型复杂度如何影响偏差和方差的权衡',
          ].map((obj, idx) => (
            <li key={idx} className="flex items-start gap-2 text-gray-700">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
              <span>{obj}</span>
            </li>
          ))}
        </div>
      </section>

      {/* Connection to later chapters */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-blue-800 mb-3">
          🔗 本节在整个课程中的位置
        </h3>
        <p className="text-sm text-blue-800 leading-relaxed">
          本章的单层线性模型是深度网络的原子单元。当你理解了
          <KaTeX math="y(\mathbf{x},\mathbf{w})=\mathbf{w}^T\boldsymbol{\phi}(\mathbf{x})" />，
          将其堆叠多层（每层的输出作为下一层的输入）就自然引出了第 6–9 章的深度神经网络。
          而本章的概率视角（高斯似然 → 最小二乘）为后续所有概率模型（第 14–20 章）奠定了基础。
        </p>
      </section>

      <p className="text-center text-sm text-amber-800">
        本页为依据 Bishop & Bishop 教材知识体系制作的原创教学解释与交互演示。教材原文、原图及习题解答版权归原作者和出版方所有。
      </p>
    </div>
  );
}
