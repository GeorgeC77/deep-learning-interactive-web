import SectionMetadata from '@/components/SectionMetadata';
import { useState } from 'react';
import {
  History,
  Cpu,
  GitBranch,
  Layers,
  TrendingUp,
  Globe,
  ShieldAlert,
  BookOpen,
  Lightbulb,
  Brain,
} from 'lucide-react';
import KaTeX from '../../../components/KaTeX';
import FormulaCard from '../../../components/FormulaCard';
import ConceptCard from '../../../components/ConceptCard';
import InteractiveDemo from '../../../components/InteractiveDemo';
import ExercisePanel from '@/components/ExercisePanel';
import PredictionGate from '@/components/PredictionGate';
import { chapter01HistoryExercises } from '@/course/chapter01Exercises';

const milestones = [
  {
    year: '1943–1958',
    title: '神经网络的黎明与感知机',
    icon: <Cpu className="w-5 h-5" />,
    description:
      'McCulloch 与 Pitts 提出神经元数学模型；Rosenblatt 的感知机（Perceptron）证明线性可分问题可以通过简单学习规则求解，开启了对“学习机器”的系统研究。',
  },
  {
    year: '1960–1986',
    title: '低谷、理论与反向传播',
    icon: <GitBranch className="w-5 h-5" />,
    description:
      'Minsky 与 Papert 指出单层感知机的局限；多层网络与反向传播算法（Backpropagation）的出现让人们能够训练具有隐藏层的网络，为深度学习奠定算法基础。',
  },
  {
    year: '2006–2012',
    title: '深度网络的复兴',
    icon: <Layers className="w-5 h-5" />,
    description:
      'Hinton 等人通过逐层预训练（如 RBM、自编码器）让深层网络可训练；ImageNet 2012 上 AlexNet 的巨大成功标志着深度学习在计算机视觉中的爆发。',
  },
  {
    year: '2012–2020',
    title: '规模化与通用表示',
    icon: <TrendingUp className="w-5 h-5" />,
    description:
      '更大的数据集、更深的网络、更强的算力推动性能持续提升。ResNet、Transformer、BERT、GPT 等架构相继出现，预训练 + 微调成为主流范式。',
  },
  {
    year: '2020–至今',
    title: '基础模型时代',
    icon: <Globe className="w-5 h-5" />,
    description:
      '大语言模型、多模态模型与科学基础模型展现出惊人的涌现能力。深度学习的关注点从单一任务转向通用智能、可解释性与安全对齐。',
  },
];

const timelineMarkers = [
  { year: 1943, text: 'McCulloch 与 Pitts 提出神经元数学模型' },
  { year: 1958, text: 'Rosenblatt 推动感知机研究' },
  { year: 1986, text: '反向传播在多层网络训练中得到广泛关注' },
  { year: 2006, text: '逐层预训练推动深层网络复兴' },
  { year: 2012, text: 'AlexNet 在 ImageNet 上取得突破' },
  { year: 2014, text: '生成对抗网络提出' },
  { year: 2017, text: 'Transformer 架构提出' },
  { year: 2018, text: 'BERT 推动预训练语言表示' },
  { year: 2020, text: 'GPT-3 展示大规模语言模型能力' },
  { year: 2022, text: '对话式大语言模型进入大众视野' },
  { year: 2024, text: '多模态模型与科学基础模型继续发展' },
];

function HistoryTimelineDemo() {
  const [year, setYear] = useState(2012);
  const [prediction, setPrediction] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const closest = timelineMarkers.reduce((previous, current) =>
    Math.abs(current.year - year) < Math.abs(previous.year - year) ? current : previous,
  );

  return (
    <InteractiveDemo title="深度学习发展时间线">
      <div className="space-y-6">
        <PredictionGate
          resetKey="chapter01-history-conditions"
          prediction={prediction}
          onPredictionChange={setPrediction}
          submitted={submitted}
          onSubmit={() => setSubmitted(true)}
          revealed={revealed}
          onReveal={() => setRevealed((value) => !value)}
          canReveal={submitted}
          question="多层网络和反向传播早已出现，为什么大规模视觉突破仍要等到 2012 年前后？"
          hint="从可用训练数据、并行计算和训练方法三个方面考虑。"
          options={[
            { value: 'convergence', label: '数据、GPU 算力与算法/工程改进共同成熟' },
            { value: 'invented', label: '神经网络直到 2012 年才被发明' },
            { value: 'depth', label: '只因为网络层数第一次超过某个固定阈值' },
          ]}
          evaluatePrediction={(answer) => ({
            correct: answer === 'convergence',
            category: '历史因果',
            feedback:
              answer === 'convergence'
                ? '突破来自多项条件汇合，而不是单一发现突然出现。'
                : '感知机、多层网络和反向传播都早于 2012 年，需要解释为何已有思想当时才规模化奏效。',
          })}
          revealContent={
            <p className="text-sm text-gray-700">
              历史时间线的重点不是背年份，而是识别长期思想如何在新数据、硬件与训练技术条件下重新释放价值。
            </p>
          }
        />

        {submitted && (
          <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-5 space-y-4">
            <label htmlFor="history-year" className="flex items-center justify-between gap-4 text-sm text-gray-700">
              <span className="font-medium">选择年份</span>
              <span className="w-20 rounded bg-white px-2 py-1 text-center font-mono">{year}</span>
            </label>
            <input
              id="history-year"
              aria-label="时间线年份"
              type="range"
              min="1943"
              max="2024"
              value={year}
              onChange={(event) => setYear(Number(event.target.value))}
              className="w-full accent-amber-600"
            />
            <div className="rounded-lg border border-amber-200 bg-white p-4" aria-live="polite">
              <p className="text-sm font-bold text-amber-800">{closest.year}</p>
              <p className="mt-1 text-sm text-gray-700">{closest.text}</p>
            </div>
          </div>
        )}
      </div>
    </InteractiveDemo>
  );
}

export default function PrerequisiteChapter01HistoryPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Hero */}
      <section className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center">
            <History className="w-9 h-9 text-amber-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">1.3 机器学习简史</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          从早期感知机到现代基础模型，机器学习经历了多次起伏。理解这段历史，
          有助于我们看清当前技术的发展脉络与未来方向。
        </p>
        <p className="mt-6 text-sm text-amber-800">
          <ShieldAlert className="w-4 h-4 inline-block mr-1" />
          仅供教学与非商业学习使用。
        </p>
      </section>

      {/* Timeline */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-8">
          <BookOpen className="w-6 h-6 text-amber-600" />
          <h2 className="text-2xl font-bold text-gray-900">发展历程</h2>
        </div>

        <div className="relative border-l-2 border-amber-200 ml-3 space-y-10">
          {milestones.map((item) => (
            <div key={item.year} className="relative pl-10">
              <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-amber-500 border-4 border-white shadow-sm" />
              <div className="text-sm font-bold text-amber-700 mb-1">{item.year}</div>
              <ConceptCard icon={item.icon} title={item.title} description={item.description} />
            </div>
          ))}
        </div>
      </section>

      {/* Key ideas */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Lightbulb className="w-6 h-6 text-amber-600" />
          <h2 className="text-2xl font-bold text-gray-900">贯穿始终的核心思想</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <ConceptCard
            icon={<Brain className="w-5 h-5" />}
            title="从数据中自动学习"
            description="与其手写规则，不如让模型从大量样本中自动发现规律。这一思想是机器学习区别于传统编程的本质特征。"
          />
          <ConceptCard
            icon={<Layers className="w-5 h-5" />}
            title="层次化表示"
            description="深度网络通过多层非线性变换，逐步从原始像素、字符或信号中提取越来越抽象的特征表示。"
          />
          <ConceptCard
            icon={<GitBranch className="w-5 h-5" />}
            title="端到端梯度学习"
            description="反向传播让复杂网络中的所有参数都可以根据最终误差进行联合优化，实现端到端的学习。"
          />
          <ConceptCard
            icon={<TrendingUp className="w-5 h-5" />}
            title="可扩展性"
            description="模型、数据与计算规模协同增加时，许多任务性能会持续改善；是否出现新能力仍需用具体评价实验判断。"
          />
        </div>
      </section>

      {/* Perceptron formula */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Cpu className="w-6 h-6 text-amber-600" />
          <h2 className="text-2xl font-bold text-gray-900">感知机：起点</h2>
        </div>
        <p className="text-gray-700 mb-5">
          感知机是最简单的可学习神经元模型之一。它计算输入的加权和，并通过阶跃函数输出类别标签。
          虽然它只能解决线性可分问题，但它奠定了现代神经网络的基本计算单元。
        </p>
        <FormulaCard
          title="感知机输出"
          formula={
            <KaTeX
              math={String.raw`y(x) = f\left(\sum_{j=1}^{D} w_j x_j + b\right)`}
              display
            />
          }
          description={
            <span>
              其中 <KaTeX math={String.raw`f`} /> 是激活函数，
              <KaTeX math={String.raw`w_j`} /> 是权重，<KaTeX math={String.raw`b`} /> 是偏置。
            </span>
          }
        />
      </section>

      {/* Future outlook */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="w-6 h-6 text-amber-600" />
          <h2 className="text-2xl font-bold text-gray-900">展望未来</h2>
        </div>
        <p className="text-gray-700 mb-4">
          今天的深度学习仍在快速发展：可解释性、鲁棒性、效率、隐私保护与可控生成成为新的研究前沿。
          无论未来架构如何变化，概率建模、优化、表示学习与泛化理论始终是理解这些系统的基石。
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          <ConceptCard
            icon={<Brain className="w-5 h-5" />}
            title="更可靠的模型"
            description="提升可解释性、校准不确定性与对抗鲁棒性。"
          />
          <ConceptCard
            icon={<TrendingUp className="w-5 h-5" />}
            title="更高效的训练"
            description="降低计算与能耗成本，让小团队也能使用大模型。"
          />
          <ConceptCard
            icon={<Globe className="w-5 h-5" />}
            title="更广泛的应用"
            description="推动科学研究、教育、医疗与可持续发展。"
          />
        </div>
      </section>
    
      <HistoryTimelineDemo />

      {/* Why? */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">为什么？</h2>
        <div className="space-y-4 text-gray-700">
          <p>
            <strong>为什么反向传播对深度学习如此重要？</strong>
            它让多层网络中的所有参数都可以根据最终误差联合优化，实现端到端学习，是深度网络可训练的关键算法。
          </p>
          <p>
            <strong>为什么深度学习在 2012 年爆发？</strong>
            大数据（ImageNet）、强算力（GPU）、好算法（AlexNet）三者同时成熟，使深度网络首次在大规模视觉任务上取得突破。
          </p>
        </div>
      </section>

      <ExercisePanel
        exerciseSetId="chapter01-history"
        title="1.3 分级练习"
        description="从感知机的限制，到算法与基础设施共同推动突破。"
        exercises={chapter01HistoryExercises}
      />

      {/* Counterexamples */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">反例</h2>
        <div className="space-y-3 text-gray-700">
          <p>
            <strong>反例 1：认为深度学习是全新发明。</strong>
            感知机、反向传播、多层网络等核心概念在几十年前就已提出——说明深度学习是长期积累的结果。
          </p>
          <p>
            <strong>反例 2：认为只要堆深度就能提升性能。</strong>
            没有残差连接等架构创新，深层网络会因梯度消失而无法训练——说明深度需要配合算法进步。
          </p>
        </div>
      </section>
    
      <SectionMetadata
        bishopChapter={"Ch 1"}
        bishopSection={"1.3"}
        textbookSections={['1.3.1 单层网络', '1.3.2 反向传播', '1.3.3 深度网络']}
        learningObjectives={[
          '说明感知机的线性表达限制以及隐藏层带来的变化。',
          '解释反向传播为何使多层网络的端到端训练成为可能。',
          '从数据、计算和算法共同成熟的角度分析 2012 年前后的突破。',
        ]}
        coreIntuition={
          <p>
            深度学习并非突然出现的单一发明。核心思想经历了提出、受限、复兴和规模化：
            表达能力必须配合可行的训练算法，而算法又需要足够的数据、计算和工程基础设施。
          </p>
        }
        commonMistakes={[
          '认为深度学习直到 2012 年才被发明。',
          '认为反向传播保证找到全局最优，而不是一种高效求梯度的方法。',
          '把历史突破归因于网络深度这一项，忽略数据、硬件与训练方法。',
        ]}
      />
</div>
  );
}
