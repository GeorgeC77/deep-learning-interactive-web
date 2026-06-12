import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: '概览' },
  { to: '/model', label: '模型表示' },
  { to: '/cost-function', label: '代价函数' },
  { to: '/gradient-descent', label: '梯度下降' },
  { to: '/normal-equation', label: '正规方程' },
  { to: '/probabilistic', label: '概率解释' },
  { to: '/overfitting', label: '过拟合' },
];

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <NavLink to="/" className="text-lg font-bold text-blue-700 hover:text-blue-800 transition-colors">
            线性回归教程
          </NavLink>
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
