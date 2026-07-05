import SectionMetadata from '@/components/SectionMetadata';
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Scale, ShieldAlert, ArrowRight, Stethoscope, Calculator } from 'lucide-react';
import FormulaCard from '../../../components/FormulaCard';
import ConceptCard from '../../../components/ConceptCard';
import InteractiveDemo from '../../../components/InteractiveDemo';
import InteractivePanel from '../../../components/InteractivePanel';
import KaTeX from '../../../components/KaTeX';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

export default function PrerequisiteChapter02RulesPage() {
  const [prior, setPrior] = useState(0.01);
  const [sensitivity, setSensitivity] = useState(0.9);
  const [falsePositive, setFalsePositive] = useState(0.03);

  const pTestPositive = useMemo(
    () => sensitivity * prior + falsePositive * (1 - prior),
    [prior, sensitivity, falsePositive]
  );

  const posterior = useMemo(
    () => (sensitivity * prior) / pTestPositive,
    [sensitivity, prior, pTestPositive]
  );

  const setClassicExample = () => {
    setPrior(0.01);
    setSensitivity(0.9);
    setFalsePositive(0.03);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Hero */}
      <section className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center">
            <Scale className="w-9 h-9 text-violet-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">2.1 概率规则</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          概率论只有两条基本规则：和规则与积规则。由此出发，可以导出贝叶斯定理，
          让我们在不断观测到新证据时，定量地更新对假设的信念。
        </p>
        <p className="mt-6 text-sm text-amber-800">
          <ShieldAlert className="w-4 h-4 inline-block mr-1" />
          本页内容仅供教学与非商业学习使用（CC BY-NC 4.0）。
        </p>
      </section>

      {/* Core rules */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Calculator className="w-6 h-6 text-violet-600" />
          <h2 className="text-2xl font-bold text-gray-900">两条基本规则</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <FormulaCard
            title="和规则（Sum Rule）"
            formula={String.raw`p(X) = \sum_{Y} p(X, Y)`}
            description="边缘概率通过对联合概率中所有未关注变量的取值求和得到。"
          />
          <FormulaCard
            title="积规则（Product Rule）"
            formula={String.raw`p(X, Y) = p(Y \mid X) \, p(X)`}
            description="联合概率可分解为条件概率与边缘概率的乘积。"
          />
        </div>
        <div className="mt-6 grid md:grid-cols-2 gap-4">
          <ConceptCard
            icon={<Scale className="w-5 h-5" />}
            title="边缘化"
            description="当我们只关心一个随机变量而对另一个变量不感兴趣时，使用求和或积分将其“边缘化”掉。"
          />
          <ConceptCard
            icon={<Scale className="w-5 h-5" />}
            title="条件概率"
            description="在已知某些信息的前提下重新评估概率，是机器学习中几乎所有推断问题的核心。"
          />
        </div>
      </section>

      {/* Bayes' theorem */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Scale className="w-6 h-6 text-violet-600" />
          <h2 className="text-2xl font-bold text-gray-900">贝叶斯定理</h2>
        </div>
        <FormulaCard
          title="Bayes' Theorem"
          formula={String.raw`p(Y \mid X) = \frac{p(X \mid Y) \, p(Y)}{p(X)}`}
          description="由积规则与和规则直接导出，是推断与学习的基石。"
        />
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <ConceptCard
            title="先验 p(Y)"
            description="在观测数据 X 之前，对假设 Y 的初始信念。"
          />
          <ConceptCard
            title="似然 p(X|Y)"
            description="在给定假设下，观测到数据的概率。"
          />
          <ConceptCard
            title="后验 p(Y|X)"
            description="在观测数据之后，对假设的更新信念。"
          />
        </div>
        <FormulaCard
          className="mt-6"
          title="归一化分母"
          formula={String.raw`p(X) = \sum_{Y} p(X \mid Y) \, p(Y)`}
          description="证据因子，确保后验概率之和为 1。"
        />
      </section>

      {/* Interactive medical screening */}
      <InteractiveDemo title="互动演示：医学筛查中的贝叶斯更新">
        <InteractivePanel
          hint="调整先验患病率、检测灵敏度与假阳性率，观察后验概率的变化。经典案例：1% 患病率、90% 灵敏度、3% 假阳性率，阳性后的真实患病概率仅约 23%。"
          chart={
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-center">
                  <div className="text-sm text-gray-600 mb-1">
                    检测阳性概率 <KaTeX math={String.raw`p(T=1)`} />
                  </div>
                  <div className="text-3xl font-bold text-blue-700">
                    {(pTestPositive * 100).toFixed(2)}%
                  </div>
                </div>
                <div className="p-4 bg-violet-50 rounded-xl border border-violet-100 text-center">
                  <div className="text-sm text-gray-600 mb-1">
                    阳性后真实患病概率 <KaTeX math={String.raw`p(C=1 \mid T=1)`} />
                  </div>
                  <div className="text-3xl font-bold text-violet-700">
                    {(posterior * 100).toFixed(2)}%
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-700 space-y-2">
                <p>
                  <strong>计算过程：</strong>
                </p>
                <p>
                  <KaTeX math={String.raw`p(T=1) = p(T=1 \mid C=1)p(C=1) + p(T=1 \mid C=0)p(C=0)`} />
                </p>
                <p>
                  <KaTeX
                    math={String.raw`= ${sensitivity.toFixed(2)} \times ${prior.toFixed(
                      2
                    )} + ${falsePositive.toFixed(2)} \times ${(1 - prior).toFixed(2)} = ${pTestPositive.toFixed(
                      4
                    )}`}
                  />
                </p>
                <p>
                  <KaTeX math={String.raw`p(C=1 \mid T=1) = \frac{p(T=1 \mid C=1)p(C=1)}{p(T=1)}`} />
                </p>
                <p>
                  <KaTeX
                    math={String.raw`= \frac{${(sensitivity * prior).toFixed(4)}}{${pTestPositive.toFixed(
                      4
                    )}} = ${posterior.toFixed(4)}`}
                  />
                </p>
              </div>
            </div>
          }
          controls={
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>先验患病率 <KaTeX math={String.raw`p(C=1)`} /></span>
                  <span className="font-mono">{(prior * 100).toFixed(1)}%</span>
                </div>
                <Slider
                  min={0.001}
                  max={0.5}
                  step={0.001}
                  value={[prior]}
                  onValueChange={([v]) => setPrior(v)}
                />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>灵敏度 <KaTeX math={String.raw`p(T=1 \mid C=1)`} /></span>
                  <span className="font-mono">{(sensitivity * 100).toFixed(1)}%</span>
                </div>
                <Slider
                  min={0.1}
                  max={1}
                  step={0.01}
                  value={[sensitivity]}
                  onValueChange={([v]) => setSensitivity(v)}
                />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>假阳性率 <KaTeX math={String.raw`p(T=1 \mid C=0)`} /></span>
                  <span className="font-mono">{(falsePositive * 100).toFixed(1)}%</span>
                </div>
                <Slider
                  min={0}
                  max={0.5}
                  step={0.001}
                  value={[falsePositive]}
                  onValueChange={([v]) => setFalsePositive(v)}
                />
              </div>

              <Button onClick={setClassicExample} variant="outline" className="w-full">
                <Stethoscope className="w-4 h-4 mr-2" />
                载入经典案例（1% / 90% / 3%）
              </Button>
            </div>
          }
        />
      </InteractiveDemo>

      {/* Summary and navigation */}
      <section className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-xl border border-violet-200 p-6">
        <h3 className="text-lg font-bold text-violet-900 mb-3">本节小结</h3>
        <p className="text-violet-800 text-sm mb-4">
          和规则与积规则是概率论的公理基础；贝叶斯定理则把“假设→数据”的似然与“数据→假设”的后验联系起来。
          在医学筛查等低先验场景中，即使检测看上去很准确，阳性结果也未必意味着高概率患病。
        </p>
        <Link
          to="/prerequisite/ch02/densities"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors"
        >
          下一节：2.2 概率密度
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    
      <SectionMetadata
        bishopChapter={"Ch 2"}
        bishopSection={"rules"}
        learningObjectives={["理解 Rules 的核心概念与直观含义。", "掌握与本小节相关的关键公式与算法流程。", "能够在简单示例中应用所学方法并识别常见误区。"]}
        commonMistakes={["只记忆公式而忽略其背后的概率或优化假设。", "混淆相近概念的定义与适用场景。", "在应用时忽视数据分布与模型假设的匹配。"]}
        quiz={[
      {
        question: "关于“Rules”，下列说法最准确的是？",
        options: ["它是本小节需要掌握的核心主题。", "它与当前章节完全无关。", "它只适用于无限大数据集。", "它不需要任何数学基础。"],
        correctIndex: 0,
        explanation: "Rules 是本小节的核心内容，理解其动机、公式与应用场景是学习目标。",
      },
      {
        question: "学习本小节时，最重要的提醒是什么？",
        options: ["只看结论，忽略推导。", "理解概念背后的直觉与假设。", "直接套用代码，不必关心理论。", "只记忆英文术语。"],
        correctIndex: 1,
        explanation: "理解直觉和假设有助于在遇到新问题时正确选择与扩展方法。",
      }
        ]}
      />
</div>
  );
}
