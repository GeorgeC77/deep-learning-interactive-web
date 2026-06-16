import { NavLink, Link, useLocation } from 'react-router-dom';
import {
  GraduationCap,
  Home,
  ShieldAlert,
  ChevronDown,
  Menu,
  FunctionSquare,
  TrendingDown,
  FileSpreadsheet,
  BarChart3,
  Brain,
  BookOpen,
  Layers,
  Zap,
  Binary,
  Sparkles,
  LineChart,
  GitBranch,
  CheckCircle2,
  Scale,
  Calculator,
  Map,
  Boxes,
  Ruler,
  Activity,
  Network,
  BarChart2,
  SlidersHorizontal,
  SplitSquareHorizontal,
  Sigma,
  CircleDot,
  GitMerge,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

type NavItem = { to: string; label: string; icon: React.ElementType };
type ChapterKey =
  | 'home'
  | 'linear'
  | 'logistic'
  | 'glm'
  | 'generative'
  | 'kernel'
  | 'svm'
  | 'deep'
  | 'generalization'
  | 'regularization'
  | 'clustering'
  | 'em'
  | 'pca'
  | 'ica'
  | 'foundation'
  | 'rl'
  | 'lqr'
  | 'pg';

const linearRegressionItems: NavItem[] = [
  { to: '/overview', label: '课程概览', icon: BookOpen },
  { to: '/model', label: '模型表示', icon: FunctionSquare },
  { to: '/cost-function', label: '代价函数', icon: TrendingDown },
  { to: '/gradient-descent', label: '梯度下降', icon: BarChart3 },
  { to: '/normal-equation', label: '正规方程', icon: FileSpreadsheet },
  { to: '/probabilistic', label: '概率解释', icon: Brain },
  { to: '/overfitting', label: '过拟合', icon: ShieldAlert },
];

const logisticRegressionItems: NavItem[] = [
  { to: '/ch02/overview', label: '课程概览', icon: BookOpen },
  { to: '/ch02/model', label: '模型表示', icon: FunctionSquare },
  { to: '/ch02/cost-function', label: '代价函数', icon: TrendingDown },
  { to: '/ch02/gradient-descent', label: '梯度下降', icon: BarChart3 },
  { to: '/ch02/perceptron', label: '感知机', icon: Brain },
  { to: '/ch02/multiclass', label: '多分类', icon: Layers },
  { to: '/ch02/newton', label: '牛顿法', icon: Zap },
];

const generalizedLinearModelItems: NavItem[] = [
  { to: '/ch03/overview', label: '课程概览', icon: BookOpen },
  { to: '/ch03/exponential-family', label: '指数族分布', icon: FunctionSquare },
  { to: '/ch03/building-glm', label: '构建 GLM', icon: Sparkles },
  { to: '/ch03/ols-as-glm', label: '最小二乘', icon: LineChart },
  { to: '/ch03/logistic-as-glm', label: '逻辑回归', icon: GitBranch },
  { to: '/ch03/softmax-as-glm', label: 'Softmax', icon: Layers },
  { to: '/ch03/summary', label: '本章总结', icon: CheckCircle2 },
];

const generativeLearningItems: NavItem[] = [
  { to: '/ch04/overview', label: '课程概览', icon: BookOpen },
  { to: '/ch04/generative-vs-discriminative', label: '生成式 vs 判别式', icon: Scale },
  { to: '/ch04/gaussian-discriminant-analysis', label: '高斯判别分析', icon: Calculator },
  { to: '/ch04/naive-bayes', label: '朴素贝叶斯', icon: Brain },
];

const kernelMethodsItems: NavItem[] = [
  { to: '/ch05/overview', label: '课程概览', icon: BookOpen },
  { to: '/ch05/feature-mapping', label: '特征映射', icon: Map },
  { to: '/ch05/lms-in-feature-space', label: '特征空间 LMS', icon: TrendingDown },
  { to: '/ch05/kernel-trick', label: '核技巧', icon: Sparkles },
  { to: '/ch05/kernel-properties', label: '核函数性质', icon: Boxes },
];

const svmItems: NavItem[] = [
  { to: '/ch06/overview', label: '课程概览', icon: BookOpen },
  { to: '/ch06/margin-intuition', label: '间隔直观理解', icon: Ruler },
  { to: '/ch06/svm-theory', label: 'SVM 理论与算法', icon: BookOpen },
];

const deepLearningItems: NavItem[] = [
  { to: '/ch07/overview', label: '课程概览', icon: BookOpen },
  { to: '/ch07/nonlinear-supervised-learning', label: '非线性模型', icon: Activity },
  { to: '/ch07/neural-networks', label: '神经网络', icon: Network },
  { to: '/ch07/modern-nn-modules', label: '现代模块', icon: Layers },
  { to: '/ch07/backpropagation', label: '反向传播', icon: GitBranch },
  { to: '/ch07/vectorization', label: '向量化', icon: Zap },
];

const generalizationItems: NavItem[] = [
  { to: '/ch08/overview', label: '课程概览', icon: BookOpen },
  { to: '/ch08/bias-variance', label: '偏差-方差权衡', icon: Scale },
  { to: '/ch08/double-descent', label: '双下降现象', icon: Activity },
  { to: '/ch08/sample-complexity', label: '样本复杂度上界', icon: BarChart2 },
];

const regularizationItems: NavItem[] = [
  { to: '/ch09/overview', label: '课程概览', icon: BookOpen },
  { to: '/ch09/regularization', label: '正则化', icon: SlidersHorizontal },
  { to: '/ch09/implicit-regularization', label: '隐式正则化', icon: Brain },
  { to: '/ch09/cross-validation', label: '交叉验证', icon: SplitSquareHorizontal },
  { to: '/ch09/bayesian-regularization', label: '贝叶斯正则化', icon: Sigma },
];

const clusteringItems: NavItem[] = [
  { to: '/ch10/overview', label: '课程概览', icon: BookOpen },
  { to: '/ch10/k-means', label: 'K-means 聚类', icon: CircleDot },
];

const emItems: NavItem[] = [
  { to: '/ch11/overview', label: '课程概览', icon: BookOpen },
  { to: '/ch11/gaussian-mixture-em', label: '高斯混合模型的 EM', icon: Calculator },
  { to: '/ch11/jensen-inequality', label: 'Jensen 不等式', icon: Sigma },
  { to: '/ch11/general-em', label: '一般 EM 算法', icon: Brain },
  { to: '/ch11/gmm-revisited', label: '高斯混合模型再探', icon: GitMerge },
  { to: '/ch11/variational-inference', label: '变分推断与 VAE', icon: Network },
];

const pcaItems: NavItem[] = [
  { to: '/ch12/overview', label: '课程概览', icon: BookOpen },
  { to: '/ch12/pca', label: '主成分分析', icon: BarChart2 },
];

const icaItems: NavItem[] = [
  { to: '/ch13/overview', label: '课程概览', icon: BookOpen },
  { to: '/ch13/ica', label: '独立成分分析', icon: GitMerge },
];

const foundationItems: NavItem[] = [
  { to: '/ch14/overview', label: '课程概览', icon: BookOpen },
  { to: '/ch14/pretraining-adaptation', label: '预训练与适配', icon: Activity },
  { to: '/ch14/computer-vision-pretraining', label: '视觉预训练', icon: BarChart2 },
  { to: '/ch14/large-language-models', label: '大语言模型', icon: Sparkles },
];

const rlItems: NavItem[] = [
  { to: '/ch15/overview', label: '课程概览', icon: BookOpen },
  { to: '/ch15/mdp', label: 'MDP', icon: Activity },
  { to: '/ch15/value-policy-iteration', label: '值/策略迭代', icon: Zap },
  { to: '/ch15/learning-mdp', label: '学习 MDP 模型', icon: GitMerge },
  { to: '/ch15/continuous-state-mdp', label: '连续状态 MDP', icon: BarChart2 },
  { to: '/ch15/value-policy-connection', label: '算法关系', icon: Sigma },
];

const lqrItems: NavItem[] = [
  { to: '/ch16/finite-horizon-mdp', label: '有限时域 MDP', icon: Activity },
  { to: '/ch16/lqr', label: 'LQR', icon: SlidersHorizontal },
  { to: '/ch16/nonlinear-to-lqr', label: '非线性到 LQR', icon: GitBranch },
  { to: '/ch16/lqg', label: 'LQG', icon: BarChart2 },
];

const pgItems: NavItem[] = [
  { to: '/ch17/policy-gradient', label: 'REINFORCE', icon: Activity },
];

const chapterConfig: Record<
  Exclude<ChapterKey, 'home'>,
  { label: string; icon: React.ElementType; items: NavItem[]; pathPrefix?: string }
> = {
  linear: { label: '线性回归', icon: BookOpen, items: linearRegressionItems },
  logistic: { label: '分类与逻辑回归', icon: Binary, items: logisticRegressionItems, pathPrefix: '/ch02/' },
  glm: { label: '广义线性模型', icon: Sparkles, items: generalizedLinearModelItems, pathPrefix: '/ch03/' },
  generative: { label: '生成学习算法', icon: Scale, items: generativeLearningItems, pathPrefix: '/ch04/' },
  kernel: { label: '核方法', icon: Boxes, items: kernelMethodsItems, pathPrefix: '/ch05/' },
  svm: { label: '支持向量机', icon: Ruler, items: svmItems, pathPrefix: '/ch06/' },
  deep: { label: '深度学习', icon: Network, items: deepLearningItems, pathPrefix: '/ch07/' },
  generalization: { label: '泛化', icon: BarChart2, items: generalizationItems, pathPrefix: '/ch08/' },
  regularization: { label: '正则化', icon: SlidersHorizontal, items: regularizationItems, pathPrefix: '/ch09/' },
  clustering: { label: '聚类', icon: CircleDot, items: clusteringItems, pathPrefix: '/ch10/' },
  em: { label: 'EM 算法', icon: Brain, items: emItems, pathPrefix: '/ch11/' },
  pca: { label: '主成分分析', icon: BarChart2, items: pcaItems, pathPrefix: '/ch12/' },
  ica: { label: '独立成分分析', icon: GitMerge, items: icaItems, pathPrefix: '/ch13/' },
  foundation: { label: '自监督学习', icon: Sparkles, items: foundationItems, pathPrefix: '/ch14/' },
  rl: { label: '强化学习', icon: Zap, items: rlItems, pathPrefix: '/ch15/' },
  lqr: { label: '线性二次调节', icon: SlidersHorizontal, items: lqrItems, pathPrefix: '/ch16/' },
  pg: { label: '策略梯度', icon: Zap, items: pgItems, pathPrefix: '/ch17/' },
};

function getCurrentChapter(path: string): ChapterKey {
  if (path === '/') return 'home';
  const entries = Object.entries(chapterConfig) as [
    Exclude<ChapterKey, 'home'>,
    { items: NavItem[]; pathPrefix?: string }
  ][];
  for (const [key, { items, pathPrefix }] of entries) {
    const paths = new Set(items.map((i) => i.to));
    if (paths.has(path) || (pathPrefix && path.startsWith(pathPrefix))) {
      return key;
    }
  }
  return 'linear';
}

function ChapterNav({ chapter, currentPath }: { chapter: Exclude<ChapterKey, 'home'>; currentPath: string }) {
  const { label, icon: ChapterIcon, items } = chapterConfig[chapter];

  const renderItem = (item: NavItem) => {
    const isActive = currentPath === item.to;
    return (
      <Link
        key={item.to}
        to={item.to}
        className={cn(
          'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
          isActive
            ? 'bg-blue-50 text-blue-700'
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
        )}
      >
        <item.icon className="w-4 h-4" />
        {item.label}
      </Link>
    );
  };

  return (
    <>
      {/* Desktop dropdown */}
      <div className="hidden lg:block">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors outline-none">
            <ChapterIcon className="w-4 h-4" />
            {label}
            <ChevronDown className="w-3.5 h-3.5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {items.map((item) => {
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
      </div>

      {/* Mobile sheet */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors outline-none"
              aria-label="打开章节菜单"
            >
              <Menu className="w-4 h-4" />
              <span className="hidden sm:inline">章节</span>
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] sm:w-80">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2 text-base">
                <ChapterIcon className="w-5 h-5 text-blue-600" />
                {label}
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 py-4">{items.map(renderItem)}</nav>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
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

            {chapter !== 'home' && <ChapterNav chapter={chapter} currentPath={currentPath} />}

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
