import { Link } from 'react-router-dom';
import { BookOpen, SeparatorVertical, Scale, BrainCircuit, Activity, ArrowRight, Target, Lightbulb } from 'lucide-react';
import KaTeX from '@/components/KaTeX';

const roadmapItems = [
  {
    label: '5.1 判别函数',
    path: '/ch02/discriminant-functions',
    icon: SeparatorVertical,
    desc: '二分类与多类判别函数、1-of-K 编码、最小二乘分类的闭式解及其局限性',
    color: 'bg-blue-100 text-blue-700 border-blue-300',
  },
  {
    label: '5.2 决策理论',
    path: '/ch02/decision-theory',
    icon: Scale,
    desc: '误分类率、期望损失最小化、拒绝选项、推断与决策分离、ROC 曲线',
    color: 'bg-emerald-100 text-emerald-700 border-emerald-300',
  },
  {
    label: '5.3 生成分类器',
    path: '/ch02/generative-classifiers',
    icon: BrainCircuit,
    desc: '类条件密度建模、高斯最大似然解、朴素贝叶斯、指数族框架',
    color: 'bg-amber-100 text-amber-700 border-amber-300',
  },
  {
    label: '5.4 判别分类器',
    path: '/ch02/discriminative-classifiers',
    icon: Activity,
    desc: 'sigmoid/softmax 激活函数、逻辑回归、多类逻辑回归、probit 回归、规范链接函数',
    color: 'bg-violet-100 text-violet-700 border-violet-300',
  },
];

export default function Ch02OverviewPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-12">
      {/* Hero */}
      <section className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
            <BookOpen className="w-9 h-9 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">单层网络：分类</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          将单层线性模型从连续值预测扩展到离散类别预测。本章对齐 Bishop 教材第 5 章，
          覆盖分类问题的完整理论体系——从判别函数画决策边界开始，经过决策理论量化错误代价，
          再到生成模型（建模类条件分布）和判别模型（直接建模后验概率）两大类方法的深入对比。
        </p>
        <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-800 rounded-full text-sm font-medium">
          <Target className="w-4 h-4" />
          Bishop &amp; Bishop §5.1–5.4（教材页码 131–166）
        </div>
      </section>

      {/* Why generative vs discriminative matters */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Lightbulb className="w-6 h-6 text-amber-600" />
          <h2 className="text-2xl font-bold text-gray-900">分类的核心问题</h2>
        </div>
        <p className="text-gray-700 leading-relaxed">
          分类问题将输入映射到 K 个离散类别。本章从两个互补的角度展开：
        </p>
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-bold text-blue-800 mb-2">判别函数 §5.1</h3>
            <p className="text-sm text-blue-700">直接画决策边界，把空间划分为 K 个区域。简单直观，但不提供概率输出。</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="font-bold text-purple-800 mb-2">概率方法 §5.2–5.4</h3>
            <p className="text-sm text-purple-700">输出后验概率 p(C_k|x)，配合损失函数做贝叶斯最优决策。</p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h3 className="font-bold text-amber-800 mb-2">生成式 §5.3</h3>
            <p className="text-sm text-amber-700">建模 p(x|C_k)·p(C_k)，用贝叶斯定理推 p(C_k|x)。强假设但样本少时更稳定。</p>
          </div>
          <div className="bg-violet-50 border border-violet-200 rounded-lg p-4">
            <h3 className="font-bold text-violet-800 mb-2">判别式 §5.4</h3>
            <p className="text-sm text-violet-700">直接建模 p(C_k|x)，用 sigmoid/softmax。数据多时更准，是深度神经网络的基石。</p>
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">学习路线</h2>
        <div className="grid md:grid-cols-2 gap-4">
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
            '写出并理解线性判别函数的决策边界',
            '解释为什么 one-vs-rest 方法会产生不可分类区域',
            '理解 1-of-K 编码与最小二乘分类的关系及其局限性',
            '根据后验概率和损失矩阵计算期望损失，选择最优决策',
            '理解拒绝选项的原理与适用场景',
            '绘制并解读 ROC 曲线，理解 AUC 含义',
            '为连续/离散特征推导高斯类条件密度下的最大似然解',
            '写出逻辑回归的交叉熵损失并通过梯度下降优化',
            '对比生成模型与判别模型的适用场景',
          ].map((obj, idx) => (
            <li key={idx} className="flex items-start gap-2 text-gray-700">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
              <span>{obj}</span>
            </li>
          ))}
        </div>
      </section>

      {/* Connection */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-blue-800 mb-3">🔗 与后续章节的关系</h3>
        <p className="text-sm text-blue-800 leading-relaxed">
          本章的单层分类网络直接引出第 6 章的多层网络——当线性判别函数不足以分离类别时，
          将多个 sigmoid/softmax 层堆叠起来形成深度网络，通过反向传播（第 7–8 章）
          联合学习特征表示和分类边界。而本章的概率框架（交叉熵损失、softmax 输出）
          是几乎所有现代神经网络分类器的标准配置。
        </p>
      </section>

      <p className="text-center text-sm text-amber-800">
        本页内容仅供教学与非商业学习使用（CC BY-NC 4.0）。
      </p>
    </div>
  );
}
