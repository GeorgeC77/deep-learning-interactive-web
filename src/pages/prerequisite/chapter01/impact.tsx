import SectionMetadata from '@/components/SectionMetadata';
import { useState } from 'react';
import {
  Zap,
  Activity,
  Dna,
  Palette,
  MessageSquare,
  Brain,
  GraduationCap,
  ShieldAlert,
  BookOpen,
  Target,
} from 'lucide-react';
import KaTeX from '../../../components/KaTeX';
import FormulaCard from '../../../components/FormulaCard';
import ConceptCard from '../../../components/ConceptCard';
import InteractiveDemo from '../../../components/InteractiveDemo';
import ExercisePanel from '@/components/ExercisePanel';
import PredictionGate from '@/components/PredictionGate';
import { chapter01ImpactExercises } from '@/course/chapter01Exercises';

function ScaleTradeoffDemo() {
  const [modelSize, setModelSize] = useState(100);
  const [dataCoverage, setDataCoverage] = useState(50);
  const [prediction, setPrediction] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const capacity = Math.log10(modelSize + 1) / Math.log10(1001);
  const support = Math.sqrt(dataCoverage / 100);
  const mismatch = Math.max(0, capacity - support);
  const trainingScore = Math.min(0.99, 0.35 + 0.62 * capacity);
  const validationScore = Math.min(
    0.96,
    Math.max(0.2, 0.35 + 0.58 * Math.min(capacity, support) - 0.22 * mismatch),
  );

  return (
    <InteractiveDemo title="概念实验：规模、数据与泛化">
      <div className="space-y-6">
        <PredictionGate
          resetKey="chapter01-scale-tradeoff"
          prediction={prediction}
          onPredictionChange={setPrediction}
          submitted={submitted}
          onSubmit={() => setSubmitted(true)}
          revealed={revealed}
          onReveal={() => setRevealed((value) => !value)}
          canReveal={submitted}
          question="如果数据覆盖有限，只增大模型容量，训练表现和验证表现最可能怎样变化？"
          hint="容量更大的模型更容易记住训练样本，但新数据可能来自训练集没有覆盖的区域。"
          options={[
            { value: 'gap', label: '训练表现继续提高，但验证表现可能停滞或下降' },
            { value: 'both', label: '两者一定以相同速度持续提高' },
            { value: 'none', label: '模型大小不会影响训练或验证表现' },
          ]}
          evaluatePrediction={(answer) => ({
            correct: answer === 'gap',
            category: '泛化判断',
            feedback:
              answer === 'gap'
                ? '容量与数据覆盖需要匹配；规模不是脱离数据质量和任务约束的万能旋钮。'
                : '请区分拟合训练数据的能力与在新数据上的泛化能力。',
          })}
          revealContent={
            <p className="text-sm text-gray-700">
              大模型提供更强的表示能力，但是否转化为可靠泛化，还取决于数据覆盖、目标函数、优化和评估方式。
              下面的概念模拟刻意展示容量与数据不匹配时出现的训练-验证间隙。
            </p>
          }
        />

        {submitted && (
          <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-5 space-y-5">
            <div>
              <label htmlFor="impact-model-size" className="flex justify-between text-sm font-medium text-gray-700">
                <span>模型容量（相对参数规模）</span>
                <span className="font-mono text-blue-700">{modelSize}</span>
              </label>
              <input
                id="impact-model-size"
                aria-label="模型容量"
                type="range"
                min="1"
                max="1000"
                value={modelSize}
                onChange={(event) => setModelSize(Number(event.target.value))}
                className="mt-2 w-full accent-blue-600"
              />
            </div>
            <div>
              <label htmlFor="impact-data-coverage" className="flex justify-between text-sm font-medium text-gray-700">
                <span>数据覆盖</span>
                <span className="font-mono text-emerald-700">{dataCoverage}%</span>
              </label>
              <input
                id="impact-data-coverage"
                aria-label="数据覆盖"
                type="range"
                min="10"
                max="100"
                value={dataCoverage}
                onChange={(event) => setDataCoverage(Number(event.target.value))}
                className="mt-2 w-full accent-emerald-600"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                { label: '训练表现', value: trainingScore, color: 'bg-blue-600' },
                { label: '验证表现', value: validationScore, color: 'bg-emerald-600' },
              ].map((metric) => (
                <div key={metric.label} className="rounded-lg border border-gray-200 bg-white p-4">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-700">{metric.label}</span>
                    <span className="font-mono">{metric.value.toFixed(2)}</span>
                  </div>
                  <div className="mt-2 h-3 overflow-hidden rounded-full bg-gray-200">
                    <div className={`h-full ${metric.color}`} style={{ width: `${metric.value * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500">
              这是用于理解容量-数据匹配关系的概念模型，不是经验缩放定律，也不能用于预测真实系统指标。
            </p>
          </div>
        )}
      </div>
    </InteractiveDemo>
  );
}

export default function PrerequisiteChapter01ImpactPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Hero */}
      <section className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
            <Zap className="w-9 h-9 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">1.1 深度学习的影响</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          深度学习已经从实验室走向现实：它能辅助医生诊断癌症、预测蛋白质结构、生成逼真图像、
          写出流畅文章。这些应用共享同一个核心思想——从大量数据中学习层次化表示。
        </p>
        <p className="mt-6 text-sm text-amber-800">
          <ShieldAlert className="w-4 h-4 inline-block mr-1" />
          仅供教学与非商业学习使用。
        </p>
      </section>

      {/* Four application areas */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">四个改变世界的应用</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <ConceptCard
            icon={<Activity className="w-5 h-5" />}
            title="医疗诊断：皮肤病变分类"
            description={
              <span>
                深度神经网络可以从皮肤镜图像中识别黑色素瘤等病变，性能媲美甚至超越皮肤科医生。
                这是典型的<strong>监督学习</strong>：每张训练图像都带有专家标注的诊断标签，
                模型学习从输入到标签的映射。
              </span>
            }
          />
          <ConceptCard
            icon={<Dna className="w-5 h-5" />}
            title="蛋白质结构：AlphaFold"
            description={
              <span>
                AlphaFold 将蛋白质序列映射到三维结构，解决了生物学中困扰数十年的难题。
                它结合了序列表示学习、注意力机制与结构预测，展示了深度学习在<strong>科学发现</strong>
                中的巨大潜力。
              </span>
            }
          />
          <ConceptCard
            icon={<Palette className="w-5 h-5" />}
            title="图像合成：GAN 与扩散模型"
            description={
              <span>
                生成对抗网络（GAN）和扩散模型能够生成以假乱真的图像、视频与艺术。
                它们通常属于<strong>无监督/自监督学习</strong>：不需要人工标注，
                模型从大量未标注图像中捕捉数据分布。
              </span>
            }
          />
          <ConceptCard
            icon={<MessageSquare className="w-5 h-5" />}
            title="大语言模型：自回归生成"
            description={
              <span>
                GPT 等大语言模型通过预测下一个词来学习语言结构与知识，能够写作、翻译、编程与推理。
                这种<strong>自监督学习</strong>让模型可以从海量文本中自动构建监督信号。
              </span>
            }
          />
        </div>
      </section>

      {/* Learning paradigms */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <GraduationCap className="w-6 h-6 text-emerald-600" />
          <h2 className="text-2xl font-bold text-gray-900">三种学习方式</h2>
        </div>

        <p className="text-gray-700 mb-5">
          这些应用虽然形式不同，但都离不开对数据进行学习。根据监督信号的多少，
          机器学习通常分为监督、无监督与自监督三种范式。
        </p>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <ConceptCard
            icon={<Target className="w-5 h-5" />}
            title="监督学习"
            description={
              <span>
                每个训练样本都有明确的标签。模型学习输入到标签的映射，
                例如从图像预测疾病、从房屋特征预测房价。
              </span>
            }
          />
          <ConceptCard
            icon={<Brain className="w-5 h-5" />}
            title="无监督学习"
            description={
              <span>
                只有输入，没有标签。目标是发现数据的内在结构，
                例如聚类、降维、密度估计与生成模型。
              </span>
            }
          />
          <ConceptCard
            icon={<MessageSquare className="w-5 h-5" />}
            title="自监督学习"
            description={
              <span>
                从无标注数据中构造监督任务（如下一个词预测、掩码重建），
                让模型学到可用于下游任务的通用表示。
              </span>
            }
          />
        </div>

        <FormulaCard
          title="监督学习的目标"
          formula={
            <KaTeX
              math={String.raw`y = f(x, w)`}
              display
            />
          }
          description={
            <span>
              给定输入 <KaTeX math={String.raw`x`} /> 与标签 <KaTeX math={String.raw`y`} />，
              寻找参数 <KaTeX math={String.raw`w`} /> 使得模型预测尽可能准确。
            </span>
          }
        />
      </section>

      {/* Impact summary */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Zap className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">为什么深度学习如此强大？</h2>
        </div>
        <p className="text-gray-700 mb-4">
          深度学习的成功并非偶然。它同时具备三个关键要素：
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          <ConceptCard
            icon={<Brain className="w-5 h-5" />}
            title="表示学习"
            description="深度网络自动从原始数据中提取层次化特征，无需手工设计特征工程。"
          />
          <ConceptCard
            icon={<Activity className="w-5 h-5" />}
            title="可扩展性"
            description="增加数据、模型大小与计算量通常能带来稳定且显著的性能提升。"
          />
          <ConceptCard
            icon={<Palette className="w-5 h-5" />}
            title="通用性"
            description="同样的神经网络框架可以处理图像、文本、语音、分子结构与控制任务。"
          />
        </div>
      </section>
    
      <ScaleTradeoffDemo />

      {/* Why? */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">为什么？</h2>
        <div className="space-y-4 text-gray-700">
          <p>
            <strong>为什么深度学习能在这么多领域成功？</strong>
            它不需要人工设计特征，而是从数据中自动学习层次化表示。同一套框架可以处理图像、文本、语音、分子结构等不同模态。
          </p>
          <p>
            <strong>为什么扩大规模有时会出现新的可观察能力？</strong>
            模型、数据与计算规模共同增加时，某些任务表现可能跨过可用阈值。不过“突然涌现”也可能受评价指标影响，
            因此应以具体任务实验为依据，而不是把规模当作必然保证。
          </p>
        </div>
      </section>

      <ExercisePanel
        exerciseSetId="chapter01-impact"
        title="1.1 分级练习"
        description="从学习范式判断，到真实部署中的泛化与风险检查。"
        exercises={chapter01ImpactExercises}
      />

      {/* Counterexamples */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">反例</h2>
        <div className="space-y-3 text-gray-700">
          <p>
            <strong>反例 1：认为深度学习在所有任务上都优于传统方法。</strong>
            在小数据集或特征工程已经很完善的任务上，传统方法（如 XGBoost）可能更简单有效——说明深度学习并非万能。
          </p>
          <p>
            <strong>反例 2：认为规模越大能力越强。</strong>
            在数据质量差或任务与预训练目标不匹配时，盲目扩大模型规模可能适得其反——说明规模必须与数据和任务匹配。
          </p>
        </div>
      </section>
    
      <SectionMetadata
        bishopChapter={"Ch 1"}
        bishopSection={"1.1"}
        textbookSections={['1.1.1 医疗诊断', '1.1.2 蛋白质结构', '1.1.3 图像合成', '1.1.4 大语言模型']}
        learningObjectives={[
          '列举深度学习在医疗、蛋白质结构、图像生成和语言建模中的任务形式。',
          '根据监督信号的来源区分监督、无监督与自监督学习。',
          '解释模型容量、数据覆盖与可靠泛化之间的关系。',
        ]}
        coreIntuition={
          <p>
            不同领域的输入和输出看起来差异巨大，但学习问题共享同一结构：从数据构造目标、优化参数、
            再在未见样本上验证。深度学习的通用性来自可学习表示，不代表它能绕过数据质量和部署风险。
          </p>
        }
        commonMistakes={[
          '把自监督误解为“没有训练目标”，忽略目标由数据自身构造。',
          '把内部测试集的高准确率直接当成真实部署可靠性。',
          '认为增加参数量必然提升所有任务，而不检查数据覆盖和评价方式。',
        ]}
      />
</div>
  );
}
