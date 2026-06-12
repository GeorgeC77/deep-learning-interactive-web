import { NavLink, Link, useLocation } from 'react-router-dom';
import { GraduationCap, Home, ShieldAlert, ChevronDown, FunctionSquare, TrendingDown, FileSpreadsheet, BarChart3, Brain, BookOpen, Layers, Zap, Binary } from 'lucide-react';
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

export default function Navbar() {
  const location = useLocation();
  const currentPath = location.hash.slice(1) || '/';

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
