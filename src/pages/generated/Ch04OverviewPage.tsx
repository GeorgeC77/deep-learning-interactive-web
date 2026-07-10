import { Link } from 'react-router-dom';
import { BookOpen, Mountain, ArrowDownCircle, Zap, Scale, ArrowRight } from 'lucide-react';

const roadmapItems = [
  {
    label: '7.1 误差曲面',
    path: '/ch04/error-surfaces',
    icon: Mountain,
    desc: '局部二次近似、Hessian 矩阵、曲率方向与鞍点',
    color: 'bg-blue-100 text-blue-700 border-blue-300',
  },
  {
    label: '7.2 梯度下降优化',
    path: '/ch04/gradient-descent-optimization',
    icon: ArrowDownCircle,
    desc: '梯度信息、批量/随机/小批量梯度下降与参数初始化',
    color: 'bg-emerald-100 text-emerald-700 border-emerald-300',
  },
  {
    label: '7.3 收敛性',
    path: '/ch04/convergence',
    icon: Zap,
    desc: '动量法、学习率调度、RMSProp 与 Adam 自适应优化',
    color: 'bg-amber-100 text-amber-700 border-amber-300',
  },
  {
    label: '7.4 归一化',
    path: '/ch04/normalization',
    icon: Scale,
    desc: '数据归一化、批归一化与层归一化',
    color: 'bg-violet-100 text-violet-700 border-violet-300',
  },
];

export default function Ch04OverviewPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-12">
      <section className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-center mb-4">
          <BookOpen className="w-12 h-12 text-blue-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">梯度下降</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Bishop 第 7 章介绍训练神经网络的核心优化方法：从误差曲面的局部几何结构出发，
          讨论批量、随机与小批量梯度下降的取舍，再到动量、Adam 等自适应优化策略，
          以及归一化技术对训练稳定性的关键作用。
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
          梯度下降的本质是在高维参数空间中沿最陡下降方向行走。理解误差曲面的曲率（Hessian）
          能帮助你选择合适的学习率；理解批量大小与梯度方差的关系能帮助你平衡效率与稳定性；
          而归一化技术则是让深度网络能够使用大学习率快速训练的关键工程技巧。
        </p>
      </section>
    </div>
  );
}