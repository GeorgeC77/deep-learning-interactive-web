import { NavLink, Link, useLocation } from 'react-router-dom';
import { GraduationCap, Home, ShieldAlert, ChevronDown, FunctionSquare, TrendingDown, FileSpreadsheet, BarChart3, Brain, BookOpen, Layers, Zap, Binary, Sparkles, LineChart, GitBranch, CheckCircle2, Scale, Calculator, Map, Boxes, Ruler, Activity, Network, BarChart2, SlidersHorizontal, SplitSquareHorizontal, Sigma, CircleDot, GitMerge } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const linearRegressionItems = [
  { to: '/overview', label: '课程概览', icon: BookOpen },
  { to: '/model', label: '模型表示', icon: FunctionSquare },
  { to: '/cost-function', label: '代价函数', icon: TrendingDown },
  { to: '/gradient-descent', label: '梯度下降', icon: BarChart3 },
  { to: '/normal-equation', label: '正规方程', icon: FileSpreadsheet },
  { to: '/probabilistic', label: '概率解释', icon: Brain },
  { to: '/overfitting', label: '过拟合', icon: ShieldAlert },
];

const logisticRegressionItems = [
  { to: '/ch02/overview', label: '课程概览', icon: BookOpen },
  { to: '/ch02/model', label: '模型表示', icon: FunctionSquare },
  { to: '/ch02/cost-function', label: '代价函数', icon: TrendingDown },
  { to: '/ch02/gradient-descent', label: '梯度下降', icon: BarChart3 },
  { to: '/ch02/perceptron', label: '感知机', icon: Brain },
  { to: '/ch02/multiclass', label: '多分类', icon: Layers },
  { to: '/ch02/newton', label: '牛顿法', icon: Zap },
];

const generalizedLinearModelItems = [
  { to: '/ch03/overview', label: '课程概览', icon: BookOpen },
  { to: '/ch03/exponential-family', label: '指数族分布', icon: FunctionSquare },
  { to: '/ch03/building-glm', label: '构建 GLM', icon: Sparkles },
  { to: '/ch03/ols-as-glm', label: '最小二乘', icon: LineChart },
  { to: '/ch03/logistic-as-glm', label: '逻辑回归', icon: GitBranch },
  { to: '/ch03/softmax-as-glm', label: 'Softmax', icon: Layers },
  { to: '/ch03/summary', label: '本章总结', icon: CheckCircle2 },
];

const generativeLearningItems = [
  { to: '/ch04/overview', label: '课程概览', icon: BookOpen },
  { to: '/ch04/generative-vs-discriminative', label: '生成式 vs 判别式', icon: Scale },
  { to: '/ch04/gaussian-discriminant-analysis', label: '高斯判别分析', icon: Calculator },
  { to: '/ch04/naive-bayes', label: '朴素贝叶斯', icon: Brain },
];

const kernelMethodsItems = [
  { to: '/ch05/overview', label: '课程概览', icon: BookOpen },
  { to: '/ch05/feature-mapping', label: '特征映射', icon: Map },
  { to: '/ch05/lms-in-feature-space', label: '特征空间 LMS', icon: TrendingDown },
  { to: '/ch05/kernel-trick', label: '核技巧', icon: Sparkles },
  { to: '/ch05/kernel-properties', label: '核函数性质', icon: Boxes },
];

const svmItems = [
  { to: '/ch06/overview', label: '课程概览', icon: BookOpen },
  { to: '/ch06/margin-intuition', label: '间隔直观理解', icon: Ruler },
  { to: '/ch06/svm-theory', label: 'SVM 理论与算法', icon: BookOpen },
];

const deepLearningItems = [
  { to: '/ch07/overview', label: '课程概览', icon: BookOpen },
  { to: '/ch07/nonlinear-supervised-learning', label: '非线性模型', icon: Activity },
  { to: '/ch07/neural-networks', label: '神经网络', icon: Network },
  { to: '/ch07/modern-nn-modules', label: '现代模块', icon: Layers },
  { to: '/ch07/backpropagation', label: '反向传播', icon: GitBranch },
  { to: '/ch07/vectorization', label: '向量化', icon: Zap },
];

const generalizationItems = [
  { to: '/ch08/overview', label: '课程概览', icon: BookOpen },
  { to: '/ch08/s01', label: '偏差-方差权衡', icon: Scale },
  { to: '/ch08/s02', label: '双下降现象', icon: Activity },
  { to: '/ch08/s03', label: '样本复杂度上界', icon: BarChart2 },
];

const regularizationItems = [
  { to: '/ch09/overview', label: '课程概览', icon: BookOpen },
  { to: '/ch09/s01', label: '正则化', icon: SlidersHorizontal },
  { to: '/ch09/s02', label: '隐式正则化', icon: Brain },
  { to: '/ch09/s03', label: '交叉验证', icon: SplitSquareHorizontal },
  { to: '/ch09/s04', label: '贝叶斯正则化', icon: Sigma },
];

const clusteringItems = [
  { to: '/ch10/overview', label: '课程概览', icon: BookOpen },
  { to: '/ch10/s01', label: 'K-means 聚类', icon: CircleDot },
];

const emItems = [
  { to: '/ch11/overview', label: '课程概览', icon: BookOpen },
  { to: '/ch11/s01', label: '高斯混合模型的 EM', icon: Calculator },
  { to: '/ch11/s02', label: 'Jensen 不等式', icon: Sigma },
  { to: '/ch11/s03', label: '一般 EM 算法', icon: Brain },
  { to: '/ch11/s04', label: '高斯混合模型再探', icon: GitMerge },
  { to: '/ch11/s05', label: '变分推断与 VAE', icon: Network },
];

const pcaItems = [
  { to: '/ch12/overview', label: '课程概览', icon: BookOpen },
  { to: '/ch12/s01', label: '主成分分析', icon: BarChart2 },
];

const icaItems = [
  { to: '/ch13/overview', label: '课程概览', icon: BookOpen },
  { to: '/ch13/s01', label: '独立成分分析', icon: GitMerge },
];

const foundationItems = [
  { to: '/ch14/overview', label: '课程概览', icon: BookOpen },
  { to: '/ch14/s01', label: '预训练与适配', icon: Activity },
  { to: '/ch14/s02', label: '视觉预训练', icon: BarChart2 },
  { to: '/ch14/s03', label: '大语言模型', icon: Sparkles },
];

const rlItems = [
  { to: '/ch15/overview', label: '课程概览', icon: BookOpen },
  { to: '/ch15/s01', label: 'MDP', icon: Activity },
  { to: '/ch15/s02', label: '值/策略迭代', icon: Zap },
  { to: '/ch15/s03', label: '学习 MDP 模型', icon: GitMerge },
  { to: '/ch15/s04', label: '连续状态 MDP', icon: BarChart2 },
  { to: '/ch15/s05', label: '算法关系', icon: Sigma },
];

const lqrItems = [
  { to: '/ch16/s01', label: '有限时域 MDP', icon: Activity },
  { to: '/ch16/s02', label: 'LQR', icon: SlidersHorizontal },
  { to: '/ch16/s03', label: '非线性到 LQR', icon: GitBranch },
  { to: '/ch16/s04', label: 'LQG', icon: BarChart2 },
];

const pgItems = [
  { to: '/ch17/s01', label: 'REINFORCE', icon: Activity },
];

function getCurrentChapter(path: string): 'home' | 'linear' | 'logistic' | 'glm' | 'generative' | 'kernel' | 'svm' | 'deep' | 'generalization' | 'regularization' | 'clustering' | 'em' | 'pca' | 'ica' | 'foundation' | 'rl' | 'lqr' | 'pg' {
  if (path === '/') return 'home';
  const logisticPaths = new Set(logisticRegressionItems.map((i) => i.to));
  if (logisticPaths.has(path) || path.startsWith('/ch02/')) return 'logistic';
  const glmPaths = new Set(generalizedLinearModelItems.map((i) => i.to));
  if (glmPaths.has(path) || path.startsWith('/ch03/')) return 'glm';
  const generativePaths = new Set(generativeLearningItems.map((i) => i.to));
  if (generativePaths.has(path) || path.startsWith('/ch04/')) return 'generative';
  const kernelPaths = new Set(kernelMethodsItems.map((i) => i.to));
  if (kernelPaths.has(path) || path.startsWith('/ch05/')) return 'kernel';
  const svmPaths = new Set(svmItems.map((i) => i.to));
  if (svmPaths.has(path) || path.startsWith('/ch06/')) return 'svm';
  const deepPaths = new Set(deepLearningItems.map((i) => i.to));
  if (deepPaths.has(path) || path.startsWith('/ch07/')) return 'deep';
  const generalizationPaths = new Set(generalizationItems.map((i) => i.to));
  if (generalizationPaths.has(path) || path.startsWith('/ch08/')) return 'generalization';
  const regularizationPaths = new Set(regularizationItems.map((i) => i.to));
  if (regularizationPaths.has(path) || path.startsWith('/ch09/')) return 'regularization';
  const clusteringPaths = new Set(clusteringItems.map((i) => i.to));
  if (clusteringPaths.has(path) || path.startsWith('/ch10/')) return 'clustering';
  const emPaths = new Set(emItems.map((i) => i.to));
  if (emPaths.has(path) || path.startsWith('/ch11/')) return 'em';
  const pcaPaths = new Set(pcaItems.map((i) => i.to));
  if (pcaPaths.has(path) || path.startsWith('/ch12/')) return 'pca';
  const icaPaths = new Set(icaItems.map((i) => i.to));
  if (icaPaths.has(path) || path.startsWith('/ch13/')) return 'ica';
  const foundationPaths = new Set(foundationItems.map((i) => i.to));
  if (foundationPaths.has(path) || path.startsWith('/ch14/')) return 'foundation';
  const rlPaths = new Set(rlItems.map((i) => i.to));
  if (rlPaths.has(path) || path.startsWith('/ch15/')) return 'rl';
  const lqrPaths = new Set(lqrItems.map((i) => i.to));
  if (lqrPaths.has(path) || path.startsWith('/ch16/')) return 'lqr';
  const pgPaths = new Set(pgItems.map((i) => i.to));
  if (pgPaths.has(path) || path.startsWith('/ch17/')) return 'pg';
  return 'linear';
}

export default function Navbar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const chapter = getCurrentChapter(currentPath);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <NavLink
            to="/"
            className="flex items-center gap-2 text-lg font-bold text-blue-700 hover:text-blue-800 transition-colors"
          >
            <GraduationCap className="w-6 h-6" />
            <span className="hidden sm:inline">机器学习交互式课程</span>
            <span className="sm:hidden">机器学习课程</span>
          </NavLink>

          <div className="flex items-center gap-1">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                )
              }
            >
              <Home className="w-4 h-4" />
              目录
            </NavLink>

            {chapter === 'linear' && (
              <DropdownMenu>
                <DropdownMenuTrigger className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors outline-none">
                  <BookOpen className="w-4 h-4" />
                  线性回归
                  <ChevronDown className="w-3.5 h-3.5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {linearRegressionItems.map((item) => {
                    const isActive = currentPath === item.to;
                    return (
                      <DropdownMenuItem key={item.to} asChild>
                        <Link
                          to={item.to}
                          className={cn(
                            'flex items-center gap-2 cursor-pointer',
                            isActive && 'bg-blue-50 text-blue-700'
                          )}
                        >
                          <item.icon className="w-4 h-4" />
                          {item.label}
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {chapter === 'logistic' && (
              <DropdownMenu>
                <DropdownMenuTrigger className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors outline-none">
                  <Binary className="w-4 h-4" />
                  分类与逻辑回归
                  <ChevronDown className="w-3.5 h-3.5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {logisticRegressionItems.map((item) => {
                    const isActive = currentPath === item.to;
                    return (
                      <DropdownMenuItem key={item.to} asChild>
                        <Link
                          to={item.to}
                          className={cn(
                            'flex items-center gap-2 cursor-pointer',
                            isActive && 'bg-blue-50 text-blue-700'
                          )}
                        >
                          <item.icon className="w-4 h-4" />
                          {item.label}
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {chapter === 'glm' && (
              <DropdownMenu>
                <DropdownMenuTrigger className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors outline-none">
                  <Sparkles className="w-4 h-4" />
                  广义线性模型
                  <ChevronDown className="w-3.5 h-3.5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {generalizedLinearModelItems.map((item) => {
                    const isActive = currentPath === item.to;
                    return (
                      <DropdownMenuItem key={item.to} asChild>
                        <Link
                          to={item.to}
                          className={cn(
                            'flex items-center gap-2 cursor-pointer',
                            isActive && 'bg-blue-50 text-blue-700'
                          )}
                        >
                          <item.icon className="w-4 h-4" />
                          {item.label}
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {chapter === 'generative' && (
              <DropdownMenu>
                <DropdownMenuTrigger className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors outline-none">
                  <Scale className="w-4 h-4" />
                  生成学习算法
                  <ChevronDown className="w-3.5 h-3.5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {generativeLearningItems.map((item) => {
                    const isActive = currentPath === item.to;
                    return (
                      <DropdownMenuItem key={item.to} asChild>
                        <Link
                          to={item.to}
                          className={cn(
                            'flex items-center gap-2 cursor-pointer',
                            isActive && 'bg-blue-50 text-blue-700'
                          )}
                        >
                          <item.icon className="w-4 h-4" />
                          {item.label}
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {chapter === 'kernel' && (
              <DropdownMenu>
                <DropdownMenuTrigger className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors outline-none">
                  <Sparkles className="w-4 h-4" />
                  核方法
                  <ChevronDown className="w-3.5 h-3.5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {kernelMethodsItems.map((item) => {
                    const isActive = currentPath === item.to;
                    return (
                      <DropdownMenuItem key={item.to} asChild>
                        <Link
                          to={item.to}
                          className={cn(
                            'flex items-center gap-2 cursor-pointer',
                            isActive && 'bg-blue-50 text-blue-700'
                          )}
                        >
                          <item.icon className="w-4 h-4" />
                          {item.label}
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {chapter === 'svm' && (
              <DropdownMenu>
                <DropdownMenuTrigger className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors outline-none">
                  <Ruler className="w-4 h-4" />
                  支持向量机
                  <ChevronDown className="w-3.5 h-3.5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {svmItems.map((item) => {
                    const isActive = currentPath === item.to;
                    return (
                      <DropdownMenuItem key={item.to} asChild>
                        <Link
                          to={item.to}
                          className={cn(
                            'flex items-center gap-2 cursor-pointer',
                            isActive && 'bg-blue-50 text-blue-700'
                          )}
                        >
                          <item.icon className="w-4 h-4" />
                          {item.label}
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {chapter === 'deep' && (
              <DropdownMenu>
                <DropdownMenuTrigger className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors outline-none">
                  <Network className="w-4 h-4" />
                  深度学习
                  <ChevronDown className="w-3.5 h-3.5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {deepLearningItems.map((item) => {
                    const isActive = currentPath === item.to;
                    return (
                      <DropdownMenuItem key={item.to} asChild>
                        <Link
                          to={item.to}
                          className={cn(
                            'flex items-center gap-2 cursor-pointer',
                            isActive && 'bg-blue-50 text-blue-700'
                          )}
                        >
                          <item.icon className="w-4 h-4" />
                          {item.label}
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {chapter === 'generalization' && (
              <DropdownMenu>
                <DropdownMenuTrigger className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors outline-none">
                  <BarChart2 className="w-4 h-4" />
                  泛化
                  <ChevronDown className="w-3.5 h-3.5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {generalizationItems.map((item) => {
                    const isActive = currentPath === item.to;
                    return (
                      <DropdownMenuItem key={item.to} asChild>
                        <Link
                          to={item.to}
                          className={cn(
                            'flex items-center gap-2 cursor-pointer',
                            isActive && 'bg-blue-50 text-blue-700'
                          )}
                        >
                          <item.icon className="w-4 h-4" />
                          {item.label}
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {chapter === 'regularization' && (
              <DropdownMenu>
                <DropdownMenuTrigger className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors outline-none">
                  <SlidersHorizontal className="w-4 h-4" />
                  正则化
                  <ChevronDown className="w-3.5 h-3.5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {regularizationItems.map((item) => {
                    const isActive = currentPath === item.to;
                    return (
                      <DropdownMenuItem key={item.to} asChild>
                        <Link
                          to={item.to}
                          className={cn(
                            'flex items-center gap-2 cursor-pointer',
                            isActive && 'bg-blue-50 text-blue-700'
                          )}
                        >
                          <item.icon className="w-4 h-4" />
                          {item.label}
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {chapter === 'clustering' && (
              <DropdownMenu>
                <DropdownMenuTrigger className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors outline-none">
                  <CircleDot className="w-4 h-4" />
                  聚类
                  <ChevronDown className="w-3.5 h-3.5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {clusteringItems.map((item) => {
                    const isActive = currentPath === item.to;
                    return (
                      <DropdownMenuItem key={item.to} asChild>
                        <Link
                          to={item.to}
                          className={cn(
                            'flex items-center gap-2 cursor-pointer',
                            isActive && 'bg-blue-50 text-blue-700'
                          )}
                        >
                          <item.icon className="w-4 h-4" />
                          {item.label}
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {chapter === 'em' && (
              <DropdownMenu>
                <DropdownMenuTrigger className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors outline-none">
                  <Brain className="w-4 h-4" />
                  EM 算法
                  <ChevronDown className="w-3.5 h-3.5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {emItems.map((item) => {
                    const isActive = currentPath === item.to;
                    return (
                      <DropdownMenuItem key={item.to} asChild>
                        <Link
                          to={item.to}
                          className={cn(
                            'flex items-center gap-2 cursor-pointer',
                            isActive && 'bg-blue-50 text-blue-700'
                          )}
                        >
                          <item.icon className="w-4 h-4" />
                          {item.label}
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {chapter === 'pca' && (
              <DropdownMenu>
                <DropdownMenuTrigger className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors outline-none">
                  <BarChart2 className="w-4 h-4" />
                  主成分分析
                  <ChevronDown className="w-3.5 h-3.5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {pcaItems.map((item) => {
                    const isActive = currentPath === item.to;
                    return (
                      <DropdownMenuItem key={item.to} asChild>
                        <Link
                          to={item.to}
                          className={cn(
                            'flex items-center gap-2 cursor-pointer',
                            isActive && 'bg-blue-50 text-blue-700'
                          )}
                        >
                          <item.icon className="w-4 h-4" />
                          {item.label}
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {chapter === 'ica' && (
              <DropdownMenu>
                <DropdownMenuTrigger className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors outline-none">
                  <GitMerge className="w-4 h-4" />
                  独立成分分析
                  <ChevronDown className="w-3.5 h-3.5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {icaItems.map((item) => {
                    const isActive = currentPath === item.to;
                    return (
                      <DropdownMenuItem key={item.to} asChild>
                        <Link
                          to={item.to}
                          className={cn(
                            'flex items-center gap-2 cursor-pointer',
                            isActive && 'bg-blue-50 text-blue-700'
                          )}
                        >
                          <item.icon className="w-4 h-4" />
                          {item.label}
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {chapter === 'foundation' && (
              <DropdownMenu>
                <DropdownMenuTrigger className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors outline-none">
                  <Sparkles className="w-4 h-4" />
                  自监督学习
                  <ChevronDown className="w-3.5 h-3.5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {foundationItems.map((item) => {
                    const isActive = currentPath === item.to;
                    return (
                      <DropdownMenuItem key={item.to} asChild>
                        <Link
                          to={item.to}
                          className={cn(
                            'flex items-center gap-2 cursor-pointer',
                            isActive && 'bg-blue-50 text-blue-700'
                          )}
                        >
                          <item.icon className="w-4 h-4" />
                          {item.label}
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {chapter === 'rl' && (
              <DropdownMenu>
                <DropdownMenuTrigger className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors outline-none">
                  <Zap className="w-4 h-4" />
                  强化学习
                  <ChevronDown className="w-3.5 h-3.5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {rlItems.map((item) => {
                    const isActive = currentPath === item.to;
                    return (
                      <DropdownMenuItem key={item.to} asChild>
                        <Link
                          to={item.to}
                          className={cn(
                            'flex items-center gap-2 cursor-pointer',
                            isActive && 'bg-blue-50 text-blue-700'
                          )}
                        >
                          <item.icon className="w-4 h-4" />
                          {item.label}
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {chapter === 'lqr' && (
              <DropdownMenu>
                <DropdownMenuTrigger className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors outline-none">
                  <SlidersHorizontal className="w-4 h-4" />
                  线性二次调节
                  <ChevronDown className="w-3.5 h-3.5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {lqrItems.map((item) => {
                    const isActive = currentPath === item.to;
                    return (
                      <DropdownMenuItem key={item.to} asChild>
                        <Link
                          to={item.to}
                          className={cn(
                            'flex items-center gap-2 cursor-pointer',
                            isActive && 'bg-blue-50 text-blue-700'
                          )}
                        >
                          <item.icon className="w-4 h-4" />
                          {item.label}
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {chapter === 'pg' && (
              <DropdownMenu>
                <DropdownMenuTrigger className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors outline-none">
                  <Zap className="w-4 h-4" />
                  策略梯度
                  <ChevronDown className="w-3.5 h-3.5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {pgItems.map((item) => {
                    const isActive = currentPath === item.to;
                    return (
                      <DropdownMenuItem key={item.to} asChild>
                        <Link
                          to={item.to}
                          className={cn(
                            'flex items-center gap-2 cursor-pointer',
                            isActive && 'bg-blue-50 text-blue-700'
                          )}
                        >
                          <item.icon className="w-4 h-4" />
                          {item.label}
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <a
              href="https://github.com/GeorgeC77/machine-learning-interactive-web/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors"
              title="CC BY-NC 4.0 非商业许可"
            >
              <ShieldAlert className="w-4 h-4" />
              CC BY-NC 4.0
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
