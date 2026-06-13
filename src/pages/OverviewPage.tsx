import { BookOpen, FunctionSquare, TrendingDown, FileSpreadsheet, BarChart3, Brain, ShieldAlert, Home, GraduationCap, ArrowRight } from 'lucide-react';
import KaTeX from '../components/KaTeX';
import FormulaCard from '../components/FormulaCard';

const roadmapItems = [
  { label: '模型表示', path: '/model', icon: FunctionSquare, desc: '假设函数与参数', color: 'bg-blue-100 text-blue-700 border-blue-300' },
  { label: '代价函数', path: '/cost-function', icon: TrendingDown, desc: '衡量拟合程度', color: 'bg-emerald-100 text-emerald-700 border-emerald-300' },
  { label: '梯度下降', path: '/gradient-descent', icon: BarChart3, desc: '优化参数', color: 'bg-violet-100 text-violet-700 border-violet-300' },
  { label: '正规方程', path: '/normal-equation', icon: FileSpreadsheet, desc: '解析解', color: 'bg-amber-100 text-amber-700 border-amber-300' },
  { label: '概率解释', path: '/probabilistic', icon: Brain, desc: '为什么最小二乘', color: 'bg-rose-100 text-rose-700 border-rose-300' },
  { label: '过拟合', path: '/overfitting', icon: ShieldAlert, desc: '正则化', color: 'bg-orange-100 text-orange-700 border-orange-300' },
];

export default function OverviewPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-12">
      {/* Hero */}
      <section className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-center mb-4">
          <BookOpen className="w-12 h-12 text-blue-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          线性回归：从一元到多元回归
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          本教程系统讲解机器学习中线性回归的理论基础与核心算法，从模型建立到优化求解，带你深入理解这一经典算法。
          从模型假设到代价函数优化，逐步深入理解这一机器学习基石。
        </p>

        {/* Copyright Notice */}
        <div className="mt-6 inline-flex items-center gap-2 bg-amber-50 border border-amber-300 rounded-lg px-5 py-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <span className="text-sm font-medium text-amber-800">
            © 版权声明：本教程仅供个人学习交流使用。未经授权，严禁以任何形式用于商业用途，包括但不限于商业培训、付费课程、企业内训等。违者将依法追究法律责任。
          </span>
        </div>
      </section>

      {/* 什么是线性回归 */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">什么是线性回归？</h2>
        <p className="text-gray-700 mb-4">
          线性回归是一种<strong>监督学习</strong>算法。在监督学习中，我们给定一个训练数据集，
          其中每个样本都包含输入特征和对应的输出标签。目标是学习一个从输入到输出的映射函数，
          使得我们能够对新的、未见过的输入做出准确的预测。
        </p>
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">回归问题</h3>
            <p className="text-sm text-gray-700">
              目标变量是<strong>连续值</strong>。例如预测房价、温度、股票价格等。
              线性回归就是经典的回归算法。
            </p>
          </div>
          <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
            <h3 className="font-semibold text-amber-800 mb-2">分类问题</h3>
            <p className="text-sm text-gray-700">
              目标变量是<strong>离散值</strong>。例如判断邮件是否为垃圾邮件、识别手写数字等。
              后续会学到的逻辑回归和 softmax 属于分类算法。
            </p>
          </div>
        </div>

        {/* House Price Analogy */}
        <div className="mt-8 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Home className="w-6 h-6 text-orange-600" />
            <h3 className="text-lg font-bold text-orange-800">直观类比：预测房价</h3>
          </div>
          <p className="text-gray-700 mb-4">
            想象你是一位房产经纪人，想根据房屋特征快速估算房价。你手头有一些历史成交记录，
            每条记录都包含房屋的<strong>特征</strong>（面积、卧室数等）和最终的<strong>成交价</strong>。
            线性回归的目标就是：从这些历史数据中学习一个&quot;经验公式&quot;，让你看到新房子时就能算出合理价格。
          </p>

          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-orange-100">
                  <th className="border border-orange-200 px-3 py-2 text-left text-orange-800">房屋编号</th>
                  <th className="border border-orange-200 px-3 py-2 text-center text-orange-800">面积 (平米)</th>
                  <th className="border border-orange-200 px-3 py-2 text-center text-orange-800">卧室数</th>
                  <th className="border border-orange-200 px-3 py-2 text-center text-orange-800">楼层</th>
                  <th className="border border-orange-200 px-3 py-2 text-center text-orange-800 font-bold">房价 (万元)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white">
                  <td className="border border-orange-200 px-3 py-2 text-gray-600 font-mono">1</td>
                  <td className="border border-orange-200 px-3 py-2 text-center text-gray-700">50</td>
                  <td className="border border-orange-200 px-3 py-2 text-center text-gray-700">1</td>
                  <td className="border border-orange-200 px-3 py-2 text-center text-gray-700">3</td>
                  <td className="border border-orange-200 px-3 py-2 text-center text-orange-700 font-bold font-mono">152</td>
                </tr>
                <tr className="bg-orange-50/50">
                  <td className="border border-orange-200 px-3 py-2 text-gray-600 font-mono">2</td>
                  <td className="border border-orange-200 px-3 py-2 text-center text-gray-700">85</td>
                  <td className="border border-orange-200 px-3 py-2 text-center text-gray-700">2</td>
                  <td className="border border-orange-200 px-3 py-2 text-center text-gray-700">8</td>
                  <td className="border border-orange-200 px-3 py-2 text-center text-orange-700 font-bold font-mono">225</td>
                </tr>
                <tr className="bg-white">
                  <td className="border border-orange-200 px-3 py-2 text-gray-600 font-mono">3</td>
                  <td className="border border-orange-200 px-3 py-2 text-center text-gray-700">120</td>
                  <td className="border border-orange-200 px-3 py-2 text-center text-gray-700">3</td>
                  <td className="border border-orange-200 px-3 py-2 text-center text-gray-700">15</td>
                  <td className="border border-orange-200 px-3 py-2 text-center text-orange-700 font-bold font-mono">340</td>
                </tr>
                <tr className="bg-orange-50/50">
                  <td className="border border-orange-200 px-3 py-2 text-gray-600 font-mono">4</td>
                  <td className="border border-orange-200 px-3 py-2 text-center text-gray-700">200</td>
                  <td className="border border-orange-200 px-3 py-2 text-center text-gray-700">5</td>
                  <td className="border border-orange-200 px-3 py-2 text-center text-gray-700">22</td>
                  <td className="border border-orange-200 px-3 py-2 text-center text-orange-700 font-bold font-mono">510</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid md:grid-cols-3 gap-3 mb-4">
            <div className="bg-white rounded-lg p-3 border border-orange-200 text-center">
              <span className="text-xs text-gray-500 block mb-1">输入特征 (x)</span>
              <span className="text-sm font-semibold text-orange-700">面积、卧室数、楼层</span>
            </div>
            <div className="flex items-center justify-center">
              <ArrowRight className="w-5 h-5 text-orange-400 hidden md:block" />
              <ArrowRight className="w-5 h-5 text-orange-400 md:hidden rotate-90" />
            </div>
            <div className="bg-white rounded-lg p-3 border border-orange-200 text-center">
              <span className="text-xs text-gray-500 block mb-1">输出预测 (y)</span>
              <span className="text-sm font-semibold text-orange-700">房价（万元）</span>
            </div>
          </div>

          <p className="text-gray-700 text-sm bg-white rounded-lg p-3 border border-orange-200">
            <strong>类比理解：</strong>线性回归就像在这些数据点之间找一条最合适的&quot;直线&quot;（或超平面）。
            想象你把每个房屋画在坐标轴上，然后拿一根直尺，尽量让它靠近所有的点——
            这条直线的位置和倾斜程度，就是我们要学习的参数。
          </p>
        </div>

        {/* Supervised Learning Intuition Diagram */}
        <div className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <GraduationCap className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-bold text-blue-800">监督学习的直觉：老师批改作业</h3>
          </div>

          <p className="text-gray-700 mb-5">
            监督学习的过程可以类比为<strong>学生做作业、老师批改</strong>的过程。
            模型就像学生，训练数据就像练习题——每道题都有<strong>标准答案</strong>（标签 y）。
            学生通过不断对比自己的答案和标准答案，逐步改进解题方法。
          </p>

          {/* Flow diagram */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4 mb-5">
            <div className="bg-white rounded-lg border-2 border-blue-300 p-4 text-center min-w-[120px]">
              <span className="text-xs text-gray-500 block mb-1">1. 输入</span>
              <span className="text-sm font-semibold text-blue-700">房屋特征 x</span>
            </div>
            <ArrowRight className="w-5 h-5 text-blue-400 hidden md:block" />
            <ArrowRight className="w-5 h-5 text-blue-400 md:hidden rotate-90" />

            <div className="bg-white rounded-lg border-2 border-indigo-300 p-4 text-center min-w-[120px]">
              <span className="text-xs text-gray-500 block mb-1">2. 模型（学生）</span>
              <span className="text-sm font-semibold text-indigo-700">
                <KaTeX math={"h_\\theta(x)"} />
              </span>
            </div>
            <ArrowRight className="w-5 h-5 text-blue-400 hidden md:block" />
            <ArrowRight className="w-5 h-5 text-blue-400 md:hidden rotate-90" />

            <div className="bg-white rounded-lg border-2 border-violet-300 p-4 text-center min-w-[120px]">
              <span className="text-xs text-gray-500 block mb-1">3. 预测答案</span>
              <span className="text-sm font-semibold text-violet-700">预测房价</span>
            </div>
            <ArrowRight className="w-5 h-5 text-blue-400 hidden md:block" />
            <ArrowRight className="w-5 h-5 text-blue-400 md:hidden rotate-90" />

            <div className="bg-white rounded-lg border-2 border-amber-300 p-4 text-center min-w-[120px]">
              <span className="text-xs text-gray-500 block mb-1">4. 对比答案</span>
              <span className="text-sm font-semibold text-amber-700">真实房价</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-3 text-sm">
            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <strong className="text-blue-700 block mb-1">训练集 = 作业题</strong>
              <span className="text-gray-600">每道题有标准答案，学生先做预测</span>
            </div>
            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <strong className="text-blue-700 block mb-1">代价函数 = 扣分规则</strong>
              <span className="text-gray-600">预测越不准，扣的分数越多</span>
            </div>
            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <strong className="text-blue-700 block mb-1">梯度下降 = 改正过程</strong>
              <span className="text-gray-600">根据错误调整策略，下次做得更好</span>
            </div>
          </div>
        </div>
      </section>

      {/* Notation */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">符号约定</h2>
        <p className="text-gray-700 mb-4">
          在正式介绍算法之前，我们先统一一下符号。这些符号将在整个教程中一致使用。
        </p>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <span className="font-mono text-blue-700 font-semibold min-w-[100px]">m</span>
            <span className="text-gray-700">训练集中的样本数量</span>
          </div>
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <span className="font-mono text-blue-700 font-semibold min-w-[100px]">n</span>
            <span className="text-gray-700">每个样本的特征数量（不包括偏置项 x₀ = 1）</span>
          </div>
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <span className="font-mono text-blue-700 font-semibold min-w-[100px]">x</span>
            <span className="text-gray-700">输入变量 / 特征向量</span>
          </div>
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <span className="font-mono text-blue-700 font-semibold min-w-[100px]">y</span>
            <span className="text-gray-700">输出变量 / 目标值</span>
          </div>
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <span className="font-mono text-blue-700 font-semibold min-w-[100px]">
              <KaTeX math={String.raw`(x^{(i)}, y^{(i)})`} />
            </span>
            <span className="text-gray-700">第 i 个训练样本</span>
          </div>
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <span className="font-mono text-blue-700 font-semibold min-w-[100px]">
              <KaTeX math={"h_\\theta(x)"} />
            </span>
            <span className="text-gray-700">假设函数（hypothesis），由参数 θ 参数化</span>
          </div>
        </div>
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200 text-sm text-gray-700">
          <strong>注意：</strong>上标 <KaTeX math={String.raw`(i)`} /> 表示第 i 个训练样本，<strong>不是</strong>幂运算。
          例如 <KaTeX math={String.raw`x^{(i)}`} /> 是第 i 个样本的输入向量。
        </div>
      </section>

      {/* Learning Roadmap */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">学习路线图</h2>
        <p className="text-gray-700 mb-6">
          线性回归的学习按照以下顺序展开，每个主题建立在前一个的基础之上：
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          {roadmapItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <a
                key={item.path}
                href={`#${item.path}`}
                className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all hover:scale-105 hover:shadow-md ${item.color}`}
              >
                <span className="text-xs font-semibold mb-1 opacity-70">步骤 {idx + 1}</span>
                <Icon className="w-8 h-8 mb-2" />
                <span className="font-bold text-base">{item.label}</span>
                <span className="text-xs mt-1 opacity-80">{item.desc}</span>
              </a>
            );
          })}
        </div>
        <div className="flex justify-center mt-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>点击任意步骤开始</span>
            <span>→</span>
            <span>推荐按顺序学习</span>
          </div>
        </div>

        {/* Roadmap Flowchart */}
        <div className="mt-8 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">数据流向图：从原始数据到最优模型</h3>

          <div className="flex flex-col items-center gap-3">
            {/* Step 1 */}
            <div className="flex items-center gap-3 w-full max-w-xl">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">1</div>
              <div className="flex-1 bg-white rounded-lg border-2 border-blue-300 p-3">
                <span className="font-semibold text-blue-800">训练数据</span>
                <span className="text-gray-600 text-sm ml-2">收集带标签的样本 (x, y)</span>
              </div>
            </div>
            <div className="w-0.5 h-4 bg-blue-300" />

            {/* Step 2 */}
            <div className="flex items-center gap-3 w-full max-w-xl">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0">2</div>
              <div className="flex-1 bg-white rounded-lg border-2 border-indigo-300 p-3">
                <span className="font-semibold text-indigo-800">假设函数</span>
                <span className="text-gray-600 text-sm ml-2">定义模型 h<sub>θ</sub>(x) = θ<sup>T</sup>x</span>
              </div>
            </div>
            <div className="w-0.5 h-4 bg-indigo-300" />

            {/* Step 3 */}
            <div className="flex items-center gap-3 w-full max-w-xl">
              <div className="w-10 h-10 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold text-sm shrink-0">3</div>
              <div className="flex-1 bg-white rounded-lg border-2 border-violet-300 p-3">
                <span className="font-semibold text-violet-800">代价函数</span>
                <span className="text-gray-600 text-sm ml-2">衡量预测误差 J(θ)</span>
              </div>
            </div>
            <div className="w-0.5 h-4 bg-violet-300" />

            {/* Step 4 */}
            <div className="flex items-center gap-3 w-full max-w-xl">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shrink-0">4</div>
              <div className="flex-1 bg-white rounded-lg border-2 border-emerald-300 p-3">
                <span className="font-semibold text-emerald-800">梯度下降</span>
                <span className="text-gray-600 text-sm ml-2">迭代优化参数 θ</span>
              </div>
            </div>
            <div className="w-0.5 h-4 bg-emerald-300" />

            {/* Step 5 */}
            <div className="flex items-center gap-3 w-full max-w-xl">
              <div className="w-10 h-10 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-sm shrink-0">5</div>
              <div className="flex-1 bg-white rounded-lg border-2 border-amber-300 p-3">
                <span className="font-semibold text-amber-800">正规方程</span>
                <span className="text-gray-600 text-sm ml-2">直接求解最优 θ = (X<sup>T</sup>X)<sup>-1</sup>X<sup>T</sup>y</span>
              </div>
            </div>
            <div className="w-0.5 h-4 bg-amber-300" />

            {/* Step 6 */}
            <div className="flex items-center gap-3 w-full max-w-xl">
              <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-sm shrink-0">6</div>
              <div className="flex-1 bg-white rounded-lg border-2 border-rose-300 p-3">
                <span className="font-semibold text-rose-800">正则化</span>
                <span className="text-gray-600 text-sm ml-2">防止过拟合，提升泛化能力</span>
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-gray-500 mt-4">
            数据如水流般从左到右流动：先从原始数据出发，定义模型，量化误差，再通过优化算法找到最佳参数。
          </p>
        </div>
      </section>

      {/* Key Formulas */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">核心公式速览</h2>

        <FormulaCard
          title="训练集"
          formula={
            <KaTeX
              math={String.raw`\{(x^{(i)}, y^{(i)}) \mid i = 1, 2, \ldots, m\}`}
              display
            />
          }
          description="包含 m 个样本的训练数据集，每个样本由特征向量 x 和标签 y 组成。"
        />

        <FormulaCard
          title="假设函数（Hypothesis）"
          formula={
            <KaTeX
              math={"h_\\theta(x) = \\theta^T x = \\sum_{j=0}^{n} \\theta_j x_j"}
              display
            />
          }
          description={
            <span>
              其中 <KaTeX math={"x_0 = 1"} /> 是偏置项，
              <KaTeX math={"\\theta = [\\theta_0, \\theta_1, \\ldots, \\theta_n]^T"} /> 是参数向量。
              假设函数给出了给定输入 x 时输出的预测值。
            </span>
          }
        />

        <FormulaCard
          title="代价函数（均方误差）"
          formula={
            <KaTeX
              math={"J(\\theta) = \\frac{1}{2m} \\sum_{i=1}^{m} \\left( h_\\theta(x^{(i)}) - y^{(i)} \\right)^2"}
              display
            />
          }
          description="衡量假设函数在训练集上的平均预测误差。系数 1/2 是为了求导时消去平方的因子 2。"
        />

        <FormulaCard
          title="梯度下降更新规则"
          formula={
            <KaTeX
              math={"\\theta_j := \\theta_j - \\alpha \\frac{\\partial}{\\partial \\theta_j} J(\\theta)"}
              display
            />
          }
          description={
            <span>
              其中 <KaTeX math={"\\alpha"} /> 是学习率（learning rate），
              控制每次参数更新的步长。
            </span>
          }
        />

        <FormulaCard
          title="批量梯度下降（展开形式）"
          formula={
            <KaTeX
              math={"\\theta_j := \\theta_j - \\alpha \\frac{1}{m} \\sum_{i=1}^{m} \\left( h_\\theta(x^{(i)}) - y^{(i)} \\right) x_j^{(i)}"}
              display
            />
          }
          description="同时对所有的 j = 0, 1, ..., n 更新参数，直到收敛。"
        />
      </section>
    </div>
  );
}
