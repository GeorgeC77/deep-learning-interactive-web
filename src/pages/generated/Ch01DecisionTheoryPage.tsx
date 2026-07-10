import BishopSectionPage from '@/components/BishopSectionPage';
import { Scale } from 'lucide-react';

export default function Ch01DecisionTheoryPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch01/decision-theory"
      heroIcon={<Scale className="w-9 h-9 text-blue-600" />}
      summary={"决策理论研究不确定性下的最优选择。通过损失函数量化错误代价，并按后验概率计算期望损失，从而得到贝叶斯最优决策。"}
      concepts={[
        {
          title: "Loss function",
          description: "量化决策与真实状态之间差距的函数；不同任务、不同错误代价对应不同的损失。",
        },
        {
          title: "Expected loss",
          description: "对未知状态按后验概率加权后的平均损失，是选择决策的依据。",
          formula: String.raw`\mathbb{E}[L] = \sum_{k} L_{kj} \, p(\mathcal{C}_k \mid \mathbf{x})`,
        },
        {
          title: "Bayes optimal decision",
          description: "选择使期望损失最小的决策，是理论上不可超越的基准。",
        },
        {
          title: "Generative vs discriminative",
          description: "生成分类器先建模类条件分布再推导后验；判别分类器直接建模后验；决策理论为两者提供统一的决策目标。",
        },
      ]}
      learningObjectives={[
        "能写出期望损失的表达式并解释各项含义。",
        "理解贝叶斯最优决策是使期望损失最小化的决策。",
        "了解损失函数选择如何影响最优决策边界。",
      ]}
      coreIntuition={"决策理论像一位医生开药：先评估各种病情的概率（后验），再权衡每种误诊的代价（损失），最后选择让患者期望风险最小的方案。"}
      commonMistakes={[
        "默认使用 0-1 损失而不考虑实际错误代价，导致决策边界偏离业务最优。",
        "把后验概率估计准确等同于决策最优；决策还需要损失矩阵。",
        "混淆推断（估计概率）与决策（选择动作）两个不同阶段。",
      ]}
      quiz={[
        {
          question: "贝叶斯最优决策的核心目标是什么？",
          options: [
            "最小化期望损失",
            "最大化后验概率",
            "最小化训练误差",
            "最大化似然函数",
          ],
          correctIndex: 0,
          explanation: "贝叶斯最优决策对每种可能状态的后验概率加权损失，选择使总体期望损失最小的动作。",
        },
        {
          question: "如果某个疾病的漏诊代价远高于误诊代价，最优决策边界会如何移动？",
          options: [
            "倾向于更积极地判为患病，即使后验概率不高。",
            "保持不变，因为后验概率不受影响。",
            "倾向于更保守，只在中毒概率极高时才判为患病。",
            "完全随机决策。",
          ],
          correctIndex: 0,
          explanation: "当漏诊代价高时，降低判为阳性的阈值可以减少漏诊，即使增加误诊。",
        },
        {
          question: "生成分类器与判别分类器在决策理论框架下的主要区别是什么？",
          options: [
            "建模路径不同：生成模型先估计 p(x|C)p(C)，判别模型直接估计 p(C|x)。",
            "生成分类器不需要损失函数。",
            "判别分类器不能直接给出决策。",
            "两者在相同损失下会给出不同的最优决策。",
          ],
          correctIndex: 0,
          explanation: "无论生成还是判别，最终决策都可统一到期望损失最小化；区别在于如何获得后验概率。",
        },
      ]}
      bishopMapping={{
        chapter: "Ch 4",
        section: "4.2",
        pages: "Ch 4",
        textbookSubsections: ["4.2 Decision theory"],
        formulas: ["expected loss", "Bayes optimal decision"],
        exercises: [
          "对二分类问题推导 0-1 损失下的贝叶斯最优决策。",
          "给定损失矩阵，手算不同后验下的最优类别。",
        ],
      }}
      demo={{
        title: "不同损失的权衡",
        label: "假阳性损失 L_fp",
        param: 1,
        min: 0.1,
        max: 5,
        step: 0.1,
        compute: (lfp) => ({
          label: '最优决策阈值相对偏移',
          value: Math.log(lfp) / 2,
          display: String.raw`\Delta=${(Math.log(lfp) / 2).toFixed(2)}`,
        }),
        formula: String.raw`\text{阈值偏移} \propto \ln L_{fp}`,
      }}
    />
  );
}
