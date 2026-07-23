import BishopSectionPage from '@/components/BishopSectionPage';
import { Compass } from 'lucide-react';

export default function Ch06InductiveBiasPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch06/inductive-bias"
      heroIcon={<Compass className="w-9 h-9 text-blue-600" />}
      summary={"归纳偏置是模型对学习问题的先验假设；合理设计偏置能缩小搜索空间，而错误的偏置会导致失败。"}
      concepts={[
        {
          title: "逆问题与欠定性",
          description: "训练数据通常无法唯一确定模型，需要偏置选择可泛化解。",
        },
        {
          title: "无免费午餐定理",
          description: "没有通用学习器能在所有任务上同时最优，偏置必须匹配任务结构。",
        },
        {
          title: "对称性、不变性与等变性",
          description: "卷积的平移等变性、池化的平移不变性都是结构化偏置的成功例子。",
        },
      ]}
      learningObjectives={[
        "理解归纳偏置如何缩小模型搜索空间。",
        "认识无免费午餐定理对模型选择的启示。",
        "能区分不变性与等变性在卷积网络中的作用。",
      ]}
      coreIntuition={"归纳偏置是模型对学习问题的先验假设；合理设计偏置能缩小搜索空间，而错误的偏置会导致失败。"}
      commonMistakes={[
        "认为更强的归纳偏置总是更好——偏置必须与任务结构匹配。",
        "忽视无免费午餐定理，试图寻找通用最优算法。",
        "混淆不变性与等变性：不变性输出不变，等变性输出随输入变换。",
      ]}
      whyCards={[
        {
          question: "为什么需要归纳偏置？",
          answer: "有限数据无法唯一确定模型，归纳偏置提供先验假设，帮助模型在多个可行解中选择可泛化的那一个。",
        },
        {
          question: "为什么卷积具有平移等变性？",
          answer: "卷积核在整张特征图上滑动，同一模式无论出现在哪里都会被检测到，输出会随输入平移而平移。",
        },
      ]}
      counterexamples={[
        "用全连接网络处理图像，参数爆炸且无法利用平移等变性——说明偏置必须与数据结构匹配。",
        "认为所有任务都能用同一算法解决——无免费午餐定理说明偏置必须与任务结构匹配。",
      ]}
      bishopMapping={{
        chapter: "Ch 9",
        section: "9.1",
        pages: "Ch 9",
        textbookSubsections: [
          "9.1 Inductive Bias",
          "9.1.1 Inverse problems",
          "9.1.2 No free lunch theorem",
          "9.1.3 Symmetry and invariance",
          "9.1.4 Equivariance"
        ],
        exercises: ["举例说明归纳偏置在图像与文本任务中的差异。", "解释为什么卷积网络适合图像而 RNN 适合序列。"]
      }}
      demo={{
        title: "归纳偏置对模型复杂度的影响",
        label: "归纳偏置强度",
        param: 0.5,
        min: 0,
        max: 1,
        step: 0.1,
        compute: (bias) => {
          const complexity = 1 - bias * 0.7;
          return {
            label: '有效模型复杂度',
            value: complexity,
            display: String.raw`1 - 0.7 \times ${bias.toFixed(1)} = ${complexity.toFixed(2)}`,
          };
        },
        formula: String.raw`\text{有效复杂度} = 1 - \lambda \times \text{偏置强度}`,
      }}
    />
  );
}
