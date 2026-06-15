import { useState, useMemo, type ReactNode } from 'react';
import { ShieldAlert, Database, CheckCircle2 , Circle} from 'lucide-react';
import KaTeX from '@/components/KaTeX';
import FormulaCard from '@/components/FormulaCard';
import { Slider } from '@/components/ui/slider';

export default function SampleComplexityPage() {
  const [n, setN] = useState(100);
  const [hSize, setHSize] = useState(1000);
  const [delta, setDelta] = useState(0.05);

  const bound = useMemo(() => {
    return Math.sqrt((2 * Math.log((2 * hSize) / delta)) / n);
  }, [n, hSize, delta]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <section className="text-center py-8 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="text-sm font-medium text-blue-600 mb-2 tracking-wide uppercase">
          第八章 · 泛化
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">样本复杂度与泛化界</h1>
        <p className="text-gray-600 max-w-2xl mx-auto px-4">
          偏差-方差权衡从实验角度解释泛化，而样本复杂度从理论角度回答：
          究竟需要多少训练样本，才能保证测试误差接近训练误差？
        </p>

        <div className="mt-6 inline-flex items-center gap-2 bg-amber-50 border border-amber-300 rounded-lg px-5 py-3 max-w-3xl mx-auto">
          <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <span className="text-sm font-medium text-amber-800">
            © 版权声明：本课程内容仅供个人学习交流使用，采用 CC BY-NC 4.0 许可。未经授权，严禁以任何形式用于商业用途。
          </span>
        </div>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Database className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">从经验风险到期望风险</h2>
        </div>
        <p className="text-gray-700 mb-4">
          训练误差（经验风险）是测试误差（期望风险）的样本估计。我们希望知道：
          训练误差与测试误差之间的差距有多大？能否给出定量上界？
        </p>

        <FormulaCard
          title="Hoeffding 不等式"
          formula={
            <KaTeX
              math={String.raw`P\left(\left|\frac{1}{n}\sum_{i=1}^n Z_i - \mathbb{E}[Z]\right| \ge \varepsilon\right) \le 2\exp(-2n\varepsilon^2)`}
              display
            />
          }
          description="对于独立同分布的随机变量 Z_i ∈ [0,1]，经验均值偏离期望的概率随样本数 n 指数衰减。"
        />
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">有限假设类的泛化界</h2>
        <p className="text-gray-700 mb-4">
          如果假设空间是有限的，利用联合界（Union Bound）可以把单个假设的偏差推广到所有假设：
        </p>

        <FormulaCard
          title="联合界泛化界"
          formula={
            <KaTeX
              math={String.raw`P\left(\exists h \in \mathcal{H}:\ |L(h) - \hat{L}(h)| \ge \varepsilon\right) \le 2|\mathcal{H}|\exp(-2n\varepsilon^2)`}
              display
            />
          }
          description="L(h) 是期望风险，L̂(h) 是经验风险。右边随着假设类大小 |H| 增大而增大，随样本数 n 增大而减小。"
        />

        <p className="text-gray-700 mt-4">
          令右边等于 δ，我们可以得到以至少 1-δ 概率成立的泛化误差上界：
        </p>

        <FormulaCard
          title="泛化误差上界"
          formula={
            <KaTeX
              math={String.raw`|L(h) - \hat{L}(h)| \le \sqrt{\frac{2\log\frac{2|\mathcal{H}|}{\delta}}{n}}`}
              display
            />
          }
          description="该式表明：要获得更紧的界，可以增加样本数 n、减小假设空间 |H|，或接受更低的置信 1-δ。"
        />
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">交互演示：样本数、假设类大小与泛化界</h2>
        <p className="text-gray-700 mb-4">
          调整下方的样本数、假设类大小和置信参数，观察泛化误差上界如何变化。
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-5">
            <ControlRow label={`样本数 n: ${n}`}>
              <Slider value={[n]} min={10} max={10000} step={10} onValueChange={(v) => setN(v[0])} />
            </ControlRow>
            <ControlRow label={`假设类大小 |H|: ${hSize}`}>
              <Slider value={[hSize]} min={2} max={100000} step={100} onValueChange={(v) => setHSize(v[0])} />
            </ControlRow>
            <ControlRow label={`置信参数 δ: ${delta.toFixed(3)}`}>
              <Slider value={[delta]} min={0.001} max={0.5} step={0.001} onValueChange={(v) => setDelta(v[0])} />
            </ControlRow>
          </div>

          <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 flex flex-col justify-center items-center text-center">
            <div className="text-sm text-gray-600 mb-2">泛化误差上界</div>
            <div className="text-4xl font-mono font-bold text-blue-700">{bound.toFixed(6)}</div>
            <div className="text-xs text-gray-500 mt-2">以至少 {(1 - delta) * 100}% 的概率成立</div>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">样本复杂度</h2>
        <p className="text-gray-700 mb-4">
          样本复杂度回答：给定精度 ε 和置信度 δ，需要多少样本 n 才能保证泛化误差不超过 ε？
          从上面的上界反解可得：
        </p>
        <FormulaCard
          title="样本复杂度"
          formula={
            <KaTeX
              math={String.raw`n = O\left(\frac{1}{\varepsilon^2}\log\frac{|\mathcal{H}|}{\delta}\right)`}
              display
            />
          }
          description="要达到 ε 精度，所需样本数与假设类大小的对数成正比，与精度平方成反比。"
        />
      </section>

      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
        <h3 className="text-lg font-bold text-blue-800 mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          小结
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start gap-2">
            <Circle className="w-2 h-2 fill-current text-blue-500 mt-0.5 mt-1" />
            <span>Hoeffding 不等式给出了单个假设经验风险偏离期望风险的指数级概率界。</span>
          </li>
          <li className="flex items-start gap-2">
            <Circle className="w-2 h-2 fill-current text-blue-500 mt-0.5 mt-1" />
            <span>联合界把结论推广到有限假设类中的所有假设。</span>
          </li>
          <li className="flex items-start gap-2">
            <Circle className="w-2 h-2 fill-current text-blue-500 mt-0.5 mt-1" />
            <span>样本复杂度随假设类大小对数增长，随精度平方倒数增长。</span>
          </li>
        </ul>
      </section>
    </div>
  );
}

function ControlRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      {children}
    </div>
  );
}
