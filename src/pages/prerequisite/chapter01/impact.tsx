import SectionMetadata from '@/components/SectionMetadata';
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
    
      <SectionMetadata
        bishopChapter={"Ch 1"}
        bishopSection={"impact"}
        learningObjectives={["理解 Impact 的核心概念与直观含义。", "掌握与本小节相关的关键公式与算法流程。", "能够在简单示例中应用所学方法并识别常见误区。"]}
        commonMistakes={["只记忆公式而忽略其背后的概率或优化假设。", "混淆相近概念的定义与适用场景。", "在应用时忽视数据分布与模型假设的匹配。"]}
              />
</div>
  );
}
