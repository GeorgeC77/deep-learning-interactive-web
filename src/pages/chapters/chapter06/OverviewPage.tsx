import { Link } from 'react-router-dom';
import { Ruler, BookOpen, ShieldAlert, ArrowRight } from 'lucide-react';

const roadmapItems = [
  { label: '间隔的直观理解', path: '/ch06/margin-intuition', icon: Ruler, desc: '函数间隔、几何间隔与支持向量', color: 'bg-blue-100 text-blue-700 border-blue-300' },
  { label: 'SVM 理论与算法', path: '/ch06/svm-theory', icon: BookOpen, desc: '原始问题、对偶问题、SMO 与核 SVM', color: 'bg-violet-100 text-violet-700 border-violet-300' },
];

export default function OverviewPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-12">
      {/* Hero */}
      <section className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-center mb-4">
          <Ruler className="w-12 h-12 text-blue-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          支持向量机：寻找最大间隔分类器
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          支持向量机（SVM）是一种强大的监督学习算法。它通过最大化分类间隔来获得良好的泛化性能，
          并可以通过核技巧处理非线性问题。
        </p>

        {/* Copyright Notice */}
        <div className="mt-6 inline-flex items-center gap-2 bg-amber-50 border border-amber-300 rounded-lg px-5 py-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <span className="text-sm font-medium text-amber-800">
            © 版权声明：本教程仅供个人学习交流使用。未经授权，严禁以任何形式用于商业用途。
          </span>
        </div>
      </section>

      {/* Core idea */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">核心思想</h2>
        <p className="text-gray-700 mb-4">
          与逻辑回归不同，SVM 不仅关注分类是否正确，还关注决策边界与最近样本之间的距离——即<strong>间隔（margin）</strong>。
          间隔越大，模型对噪声的容忍度通常越高，泛化能力也越强。
        </p>
        <p className="text-gray-700 mb-4">
          那些恰好落在间隔边界上的样本被称为<strong>支持向量</strong>，它们完全决定了最终的决策边界。
          这意味着 SVM 具有稀疏性：大部分训练样本对模型没有影响。
        </p>

        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">线性 SVM</h3>
            <p className="text-sm text-gray-700">
              通过求解凸二次规划问题，找到最大间隔的超平面。
            </p>
          </div>
          <div className="bg-violet-50 rounded-lg p-4 border border-violet-200">
            <h3 className="font-semibold text-violet-800 mb-2">核 SVM</h3>
            <p className="text-sm text-gray-700">
              在对偶问题中用核函数替换内积，从而在特征空间中训练线性 SVM。
            </p>
          </div>
        </div>
      </section>

      {/* Chapter roadmap */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">本章学习路线</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {roadmapItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`group flex flex-col p-5 rounded-xl border ${item.color.replace('bg-', 'border-').split(' ')[2]} bg-white hover:shadow-sm transition-all`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-lg ${item.color.split(' ')[0]} flex items-center justify-center`}>
                  <item.icon className={`w-5 h-5 ${item.color.split(' ')[1]}`} />
                </div>
                <span className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{item.label}</span>
              </div>
              <p className="text-sm text-gray-600 mb-4 flex-grow">{item.desc}</p>
              <div className="flex items-center text-sm font-medium text-blue-600">
                开始学习 <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Preview */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-blue-800 mb-3">学习提示</h3>
        <p className="text-sm text-blue-800 leading-relaxed">
          SVM 的理论涉及较多优化知识。建议先建立几何直觉（间隔、支持向量），再学习拉格朗日对偶和 KKT 条件。
          理解对偶问题是掌握核 SVM 的关键。
        </p>
      </section>
    </div>
  );
}
