import BishopSectionPage from '@/components/BishopSectionPage';
import InductiveBiasLab from '@/components/demos/InductiveBiasLab';
import DerivationStepper from '@/components/DerivationStepper';
import ExercisePanel from '@/components/ExercisePanel';
import { chapter06InductiveBiasExercises } from '@/course/chapter06Exercises';
import { Compass } from 'lucide-react';

export default function Ch06InductiveBiasPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch06/inductive-bias"
      heroIcon={<Compass className="w-9 h-9 text-blue-600" />}
      summary={"Bishop §9.1 从逆问题出发说明：有限数据与模型输出之间通常存在多个相容解，任何能够泛化的学习器都必须带有归纳偏置。对称性可通过增强、正则项或网络结构编码；不变性与等变性必须按任务输出类型严格区分。"}
      concepts={[
        {
          title: "逆问题与欠定性",
          description: "训练数据只约束有限位置，通常有无限多个函数同样拟合数据。归纳偏置是从这些解中作出偏好的规则，可以来自平滑性、结构、先验或优化过程。",
        },
        {
          title: "无免费午餐定理",
          description: "若在所有可能数据生成分布上平均，没有一种学习算法普遍占优。这不表示学习无用，而是说明性能来自偏置与任务分布的匹配。",
        },
        {
          title: "对称性与数据增强",
          description: "可通过复制变换样本、惩罚沿变换方向的输出变化，或直接构造结构来编码对称性。增强变换必须保持任务标签，否则会制造系统性标注错误。",
        },
        {
          title: "不变性与等变性",
          description: "不变映射在输入变换后输出保持不变；等变映射的输出按已知方式同步变换。图像分类常要求平移不变，像素分割则要求平移等变。",
          formula: String.raw`\text{invariant: }f(Tx)=f(x),\qquad \text{equivariant: }f(Tx)=T'f(x)`,
        },
      ]}
      learningObjectives={[
        "理解归纳偏置如何缩小模型搜索空间。",
        "认识无免费午餐定理对模型选择的启示。",
        "能区分不变性与等变性在卷积网络中的作用。",
      ]}
      coreIntuition={"数据只能排除一部分候选函数，剩下的选择来自偏置。好的偏置像把搜索限制到任务真正可能出现的变化方向；错误偏置则会把正确答案一起排除。"}
      commonMistakes={[
        "认为更强的归纳偏置总是更好——偏置必须与任务结构匹配。",
        "忽视无免费午餐定理，试图寻找通用最优算法。",
        "把卷积特征图说成平移不变——标准卷积首先是平移等变，分类不变性还需聚合或其他结构。",
        "认为任意视觉变换都可安全增强——旋转、翻转或裁剪可能改变标签语义。",
      ]}
      whyCards={[
        {
          question: "为什么需要归纳偏置？",
          answer: "有限数据无法唯一确定模型，归纳偏置提供先验假设，帮助模型在多个可行解中选择可泛化的那一个。",
        },
        {
          question: "为什么卷积具有平移等变性？",
          answer: "卷积核在整张特征图上共享，同一输入平移会使特征响应同步平移，即 f(Tx)=Tf(x)。边界、步幅等细节可能破坏严格等变性。",
        },
      ]}
      counterexamples={[
        "对数字 6/9 分类无条件加入 180° 旋转且保持原标签，会把一种类别变成另一种——说明增强必须验证标签保持性。",
        "图像分割若强制平移不变，会让掩码无法跟随物体移动——说明该任务需要的是等变而非不变。",
      ]}
      bishopMapping={{
        chapter: "Ch 9",
        section: "9.1",
        pages: "§9.1, pp. 254–260",
        textbookSubsections: [
          "9.1 Inductive Bias",
          "9.1.1 Inverse problems",
          "9.1.2 No free lunch theorem",
          "9.1.3 Symmetry and invariance",
          "9.1.4 Equivariance"
        ],
        formulas: ["f(Tx)=f(x)", "f(Tx)=T′f(x)"],
        algorithms: ["data augmentation", "tangent propagation", "architectural invariance"],
        exercises: ["判断分类与分割任务需要不变性还是等变性。", "为具体任务审查增强变换是否保持标签。"]
      }}
      interactiveDemo={<InductiveBiasLab />}
      extraContent={<div className="space-y-10"><DerivationStepper title="分步对比：不变性与等变性" steps={[
        { label: '输入变换', formula: String.raw`x' = T_gx`, explanation: '群元素 g 对输入施加平移、旋转或其他允许变换。' },
        { label: '不变任务', formula: String.raw`f(T_gx)=f(x)`, explanation: '分类标签不携带空间位置，变换前后输出相同。' },
        { label: '等变任务', formula: String.raw`f(T_gx)=T'_gf(x)`, explanation: '分割等结构化输出必须按对应变换 T′g 同步变化。' },
        { label: '检查增强', formula: String.raw`t(T_gx)=T'_gt(x)`, explanation: '只有目标也满足相容关系时，增强样本才保持监督信号正确。' },
      ]} /><ExercisePanel exerciseSetId="chapter06-inductive-bias" exercises={chapter06InductiveBiasExercises} /></div>}
    />
  );
}
