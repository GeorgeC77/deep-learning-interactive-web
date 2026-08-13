import BishopSectionPage from '@/components/BishopSectionPage';
import ModelAveragingLab from '@/components/demos/ModelAveragingLab';
import DerivationStepper from '@/components/DerivationStepper';
import ExercisePanel from '@/components/ExercisePanel';
import { chapter06ModelAveragingExercises } from '@/course/chapter06Exercises';
import { Users } from 'lucide-react';

export default function Ch06ModelAveragingPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch06/model-averaging"
      heroIcon={<Users className="w-9 h-9 text-blue-600" />}
      summary={
        "Bishop §9.6 说明，与其选单个模型，不如平均多个模型的预测。互不相关误差时委员会误差可按 1/M 降低，但实际相关性限制收益。Bagging 用 bootstrap 数据制造差异；Dropout 则训练共享参数的随机掩码子网络并近似平均。"
      }
      concepts={[
        {
          title: "委员会机器",
          description: "独立训练多个模型并平均输出。若各模型误差方差相同且两两相关，平均后的方差为 σ²·[ρ + (1−ρ)/M]。",
          formula: String.raw`\operatorname{Var}\bigl(\bar y\bigr) = \sigma^2 \left( \rho + \frac{1-\rho}{M} \right)`,
        },
        {
          title: "模型相关性的影响",
          description: "ρ=0 时独立模型的误差随 M 以 1/M 下降；ρ=1 时所有模型等价，集成不再降低方差；ρ 接近 1 时边际增益迅速消失。",
          formula: String.raw`\rho=0 \Rightarrow \operatorname{Var}(\bar y)=\frac{\sigma^2}{M},\quad \rho=1 \Rightarrow \operatorname{Var}(\bar y)=\sigma^2`,
        },
        {
          title: "Dropout 作为模型平均的近似",
          description: "训练时为每个样本采样 mask，得到共享参数的剪枝子网络；预测时可采样多个 mask 做 Monte Carlo 平均，或用完整网络配合缩放近似。它不等于独立训练全部 2^M 个网络。",
        },
        {
          title: "Bagging 与多样性",
          description: "bootstrap aggregation 从原数据有放回采样出多个训练集，分别训练模型再平均。还可用不同初始化或算法增加多样性；若误差仍高度相关，收益有限。",
        },
      ]}
      learningObjectives={[
        "理解委员会机器降低方差的前提：模型误差方差与共方差",
        "能写出含相关性 ρ 的集成方差公式",
        "解释 ρ=0 与 ρ=1 时集成效果的差异",
        "理解 Dropout 与模型平均之间的近似关系",
      ]}
      coreIntuition={
        "模型平均就像让多位专家投票：如果专家意见独立（ρ=0），人数越多误差越小；如果他们总是说一样的话（ρ=1），再多人也帮不上忙。Dropout 则是通过随机'缺席'制造大量略有不同的专家，然后近似他们的平均意见。"
      }
      commonMistakes={[
        "把 σ/√M 当作无条件成立的公式——它只在模型误差独立（ρ=0）且等方差时成立",
        "忽视模型相关性：高度相关的模型集成几乎没有方差缩减收益",
        "认为 Dropout 测试时的缩放就是精确模型平均——它只是一种实用的近似",
        "把委员会机器的成功推广到任意相关误差结构而不检验协方差假设",
      ]}
      whyCards={[
        {
          question: "为什么模型平均能降低误差？",
          answer: "多个模型的误差如果独立，平均后方差会减小。但如果模型高度相关，误差会相互抵消的效果就弱。",
        },
        {
          question: "为什么 Dropout 能近似模型平均？",
          answer: "训练时随机失活神经元，相当于每次训练一个不同的子网络；测试时缩放权重，近似所有这些子网络的平均输出。",
        },
      ]}
      counterexamples={[
        "集成两个几乎相同的模型，平均后误差几乎不变——说明模型相关性决定集成收益。",
        "认为 Dropout 测试时的缩放就是精确模型平均——实际上它只是近似，不能无条件等价。",
      ]}
            bishopMapping={{
        chapter: "Ch 9",
        section: "9.6",
        pages: "§9.6, pp. 277–281",
        textbookSubsections: ["9.6 Model Averaging", "9.6.1 Dropout"],
        formulas: [
          "Var(y_avg) = σ²[ρ + (1−ρ)/M]",
          "ρ=0 ⇒ σ²/M",
          "ρ=1 ⇒ σ²",
        ],
        exercises: [
          "推导等方差相关模型平均的方差公式",
          "比较独立模型与完全相同模型的集成收益",
          "讨论 Dropout 为何只能近似模型平均",
        ],
      }}
      interactiveDemo={<ModelAveragingLab />}
      extraContent={<div className="space-y-10"><DerivationStepper title="分步推导：相关误差如何限制集成收益" steps={[
        { label: '平均误差', formula: String.raw`\bar\varepsilon=\frac1M\sum_{m=1}^{M}\varepsilon_m`, explanation: '委员会预测误差是成员误差的平均。' },
        { label: '展开方差', formula: String.raw`\operatorname{Var}(\bar\varepsilon)=\frac1{M^2}\left(\sum_m\sigma^2+\sum_{m\ne l}\rho\sigma^2\right)`, explanation: '对角项是单模型方差，非对角项来自模型间协方差。' },
        { label: '整理结果', formula: String.raw`\operatorname{Var}(\bar\varepsilon)=\sigma^2\left[\rho+\frac{1-\rho}{M}\right]`, explanation: 'ρ=0 时按 1/M 降低；ρ=1 时完全没有方差收益。' },
        { label: '无限模型', formula: String.raw`M\to\infty\quad\Rightarrow\quad\operatorname{Var}(\bar\varepsilon)\to\rho\sigma^2`, explanation: '相关性形成不可由增加成员数消除的方差下限。' },
      ]}/><ExercisePanel exerciseSetId="chapter06-model-averaging" exercises={chapter06ModelAveragingExercises}/></div>}
    />
  );
}
