import { useState, type ReactNode } from 'react';
import { ShieldAlert, Activity, CheckCircle2 , Circle} from 'lucide-react';
import KaTeX from '@/components/KaTeX';
import FormulaCard from '@/components/FormulaCard';
import { Slider } from '@/components/ui/slider';

export default function LargeLanguageModelsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <section className="text-center py-8 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="text-sm font-medium text-blue-600 mb-2 tracking-wide uppercase">
          第十四章 · 自监督学习与基础模型
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">预训练大语言模型</h1>
        <p className="text-gray-600 max-w-2xl mx-auto px-4">
          自然语言处理是基础模型最成功的领域之一。通过自回归方式预训练 Transformer，
          语言模型能够捕捉丰富的语言结构和世界知识，并用于零样本和上下文学习。
        </p>

        <p className="mt-6 text-sm text-amber-700 flex items-center justify-center gap-2"><ShieldAlert className="w-4 h-4" /> 本内容仅供教学与非商业学习使用，完整授权说明见页脚。</p>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Activity className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">语言模型</h2>
        </div>
        <p className="text-gray-700 mb-4">
          语言模型描述一个文档 x = (x_1, ..., x_T) 的概率分布。直接对文档整体建模的分布空间是指数级的，
          因此通常使用链式法则将其分解为条件概率的乘积：
        </p>
        <FormulaCard
          title="链式法则"
          formula={
            <KaTeX
              math={String.raw`p(x_1, \dots, x_T) = \prod_{t=1}^T p(x_t | x_1, \dots, x_{t-1})`}
              display
            />
          }
          description="这样每次只需要建模词汇表大小为 V 的条件分布。"
        />
        <p className="text-gray-700 mt-4">
          {'Transformer 把词嵌入序列 (e_{x_0}, e_{x_1}, ..., e_{x_T}) 映射为一组 logit 向量 (u_1, ..., u_{T+1})，其中 u_t 只依赖于前面的词 x_1, ..., x_{t-1}。条件概率由 softmax 给出：'}
        </p>
        <FormulaCard
          title="条件分布"
          formula={
            <KaTeX
              math={String.raw`p(x_t | x_1, \dots, x_{t-1}) = \text{softmax}\bigl(f_\theta(x_0, x_1, \dots, x_{t-1})\bigr)`}
              display
            />
          }
          description="f_θ 表示整个 Transformer 映射，x_0 是特殊的起始标记。"
        />
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">预训练损失</h2>
        <p className="text-gray-700 mb-4">
          给定文本数据，模型通过最大化对数似然进行预训练，等价于最小化每个位置上的交叉熵损失：
        </p>
        <FormulaCard
          title="交叉熵损失"
          formula={
            <KaTeX
              math={String.raw`\ell(\theta) = \frac{1}{T}\sum_{t=1}^T -\log \text{softmax}\bigl(f_\theta(x_0, \dots, x_{t-1})\bigr)_{x_t}`}
              display
            />
          }
          description="下标 x_t 表示模型在位置 t 对真实下一个词的预测概率。"
        />
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">文本生成与温度</h2>
        <p className="text-gray-700 mb-4">
          训练完成后，语言模型可以自回归地生成文本。给定前缀，模型依次采样下一个词，再把采样结果作为新的输入。
          温度参数 τ 控制生成分布的尖锐程度：
        </p>
        <FormulaCard
          title="带温度的采样"
          formula={
            <KaTeX
              math={String.raw`x_{t+1} \sim \text{softmax}\left(\frac{f_\theta(x_0, \dots, x_t)}{\tau}\right)`}
              display
            />
          }
          description="τ = 1 时按模型原始分布采样；τ → 0 时趋近于贪婪解码；τ 越大，分布越平坦，生成越随机。"
        />
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">交互演示：温度对 softmax 的影响</h2>
        <p className="text-gray-700 mb-4">
          调整温度，观察一组固定 logit 上的 softmax 分布如何变化。低温会让概率集中在最大 logit 对应的词上，
          高温则让分布更均匀。
        </p>
        <TemperatureDemo />
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">下游适配方式</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li><strong>微调：</strong>在下游任务数据上继续训练整个模型，常用于掩码语言模型如 BERT。</li>
          <li><strong>零样本学习：</strong>把任务写成自然语言问题，让模型直接生成答案，无需任何标注数据。</li>
          <li><strong>上下文学习：</strong>在提示中给出几个输入-输出示例，模型根据这些示例推断任务模式并完成新输入。</li>
        </ul>
      </section>

      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
        <h3 className="text-lg font-bold text-blue-800 mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          小结
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start gap-2">
            <Circle className="w-2 h-2 fill-current text-blue-500 mt-0.5 mt-1" />
            <span>语言模型通过链式法则把文档概率分解为 next-token 条件概率。</span>
          </li>
          <li className="flex items-start gap-2">
            <Circle className="w-2 h-2 fill-current text-blue-500 mt-0.5 mt-1" />
            <span>Transformer 以自回归方式输出每个位置的 next-token logits。</span>
          </li>
          <li className="flex items-start gap-2">
            <Circle className="w-2 h-2 fill-current text-blue-500 mt-0.5 mt-1" />
            <span>预训练使用交叉熵损失；温度参数控制生成文本的多样性。</span>
          </li>
          <li className="flex items-start gap-2">
            <Circle className="w-2 h-2 fill-current text-blue-500 mt-0.5 mt-1" />
            <span>大语言模型可通过微调、零样本或上下文学习适配到下游任务。</span>
          </li>
        </ul>
      </section>
    </div>
  );
}

function TemperatureDemo() {
  const [temperature, setTemperature] = useState(1.0);

  // 固定的 logits，对应几个假想的 next-token 候选
  const tokens = ['猫', '狗', '车', '书', '天'];
  const logits = [2.0, 1.2, 0.5, -0.3, -1.0];

  const maxLogit = Math.max(...logits);
  const expSum = logits.reduce((sum, z) => sum + Math.exp((z - maxLogit) / temperature), 0);
  const probs = logits.map((z) => Math.exp((z - maxLogit) / temperature) / expSum);
  const entropy = -probs.reduce((sum, p) => sum + (p > 0 ? p * Math.log(p) : 0), 0);

  const maxProb = Math.max(...probs);

  return (
    <div className="space-y-4">
      <ControlRow label={`温度 τ: ${temperature.toFixed(2)}`}>
        <Slider
          value={[temperature]}
          min={0.1}
          max={2.5}
          step={0.05}
          onValueChange={(v) => setTemperature(v[0])}
        />
      </ControlRow>

      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        {tokens.map((token, idx) => {
          const width = probs[idx] / maxProb;
          return (
            <div key={token} className="flex items-center gap-3 mb-2 last:mb-0">
              <div className="w-8 text-sm font-medium text-gray-700 text-center">{token}</div>
              <div className="flex-1 bg-white rounded border border-gray-200 h-6 overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-150"
                  style={{ width: `${width * 100}%` }}
                />
              </div>
              <div className="w-20 text-right text-sm font-mono text-gray-700">
                {probs[idx].toFixed(6)}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <span className="text-gray-600">分布熵:</span>
          <span className="ml-2 font-mono font-medium text-blue-700">{entropy.toFixed(6)}</span>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <span className="text-gray-600">最大概率:</span>
          <span className="ml-2 font-mono font-medium text-emerald-700">{maxProb.toFixed(6)}</span>
        </div>
      </div>
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
