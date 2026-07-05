import BishopSectionPage from '@/components/BishopSectionPage';
import { Scale } from 'lucide-react';

export default function Ch14AdversarialTrainingPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch14/adversarial-training"
      heroIcon={<Scale className="w-9 h-9 text-blue-600" />}
      summary={"GAN 的损失函数定义了生成器与判别器的优化目标；实践中需要平衡两者更新频率与梯度稳定性。"}
      concepts={[
    {
      title: "极小极大损失",
      description: "判别器最大化对数似然，生成器最小化被判别为假的概率。",
      formula: String.raw`\min_G \max_D V(D,G) = \mathbb{E}_{x\sim p_{\text{data}}}\ln D(x) + \mathbb{E}_{z\sim p_z}\ln(1-D(G(z)))`,
    },
    {
      title: "非饱和损失",
      description: "用 -ln D(G(z)) 替代 ln(1-D(G(z))))，缓解生成器早期梯度不足。",
    },
    {
      title: "训练技巧",
      description: "标签平滑、噪声输入、梯度惩罚等方法可提升稳定性。",
    }
      ]}
      learningObjectives={[
      "理解 极小极大损失 的含义与作用。",
      "理解 非饱和损失 的含义与作用。",
      "理解 训练技巧 的含义与作用。"
    ]}
      coreIntuition={"GAN 的损失函数定义了生成器与判别器的优化目标；实践中需要平衡两者更新频率与梯度稳定性。"}
      commonMistakes={[
      "混淆相关概念的定义与适用场景。",
      "只记忆公式而忽略其背后的概率或优化假设。"
    ]}
      quiz={[
      {
        question: "关于“极小极大损失”，下列说法是否正确？",
        options: ["判别器最大化对数似然，生成器最小化被判别为假的概率。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。判别器最大化对数似然，生成器最小化被判别为假的概率。",
      },
      {
        question: "关于“非饱和损失”，下列说法是否正确？",
        options: ["用 -ln D(G(z)) 替代 ln(1-D(G(z))))，缓解生成器早期梯度不足。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。用 -ln D(G(z)) 替代 ln(1-D(G(z))))，缓解生成器早期梯度不足。",
      },
      {
        question: "关于“训练技巧”，下列说法是否正确？",
        options: ["标签平滑、噪声输入、梯度惩罚等方法可提升稳定性。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。标签平滑、噪声输入、梯度惩罚等方法可提升稳定性。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 17",
      section: "",
      pages: "",
    }}
          demo={{
      title: "判别器对生成样本的输出",
      label: "判别器输出 D(G(z))",
      param: 0.3,
      min: 0.01,
      max: 0.99,
      step: 0.01,
      compute: (d) => ({
        label: '生成器损失',
        value: -Math.log(d),
        display: String.raw`L_G=-\\ln ${d.toFixed(2)}=${(-Math.log(d)).toFixed(3)}`,
      }),
      formula: String.raw`L_G = -\ln D(G(z))`,
    }}
    />
  );
}
