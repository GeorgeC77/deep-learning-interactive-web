import BishopSectionPage from '@/components/BishopSectionPage';
import { Scale } from 'lucide-react';

export default function Ch12EvidenceLowerBoundPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch12/evidence-lower-bound"
      heroIcon={<Scale className="w-9 h-9 text-blue-600" />}
      summary={"证据下界为观测数据的对数似然提供了可优化的下界；EM 算法可视为交替优化 ELBO 的过程。"}
      concepts={[
    {
      title: "ELBO",
      description: "通过引入变分后验，将难解的边缘似然转化为可计算的期望加 KL 惩罚。",
      formula: String.raw`\ln p(\mathbf{X}) \ge \mathcal{L}(q) = \mathbb{E}_q[\ln p(\mathbf{X},\mathbf{Z})] - \mathbb{E}_q[\ln q(\mathbf{Z})]`,
    },
    {
      title: "EM 算法",
      description: "E 步固定参数优化 q，M 步固定 q 优化模型参数，保证似然单调不减。",
    },
    {
      title: "广义 EM",
      description: "M 步不必完全最大化 ELBO，只要有所提升即可。",
    }
      ]}
      learningObjectives={[
      "理解 ELBO 的含义与作用。",
      "理解 EM 算法 的含义与作用。",
      "理解 广义 EM 的含义与作用。"
    ]}
      coreIntuition={"证据下界为观测数据的对数似然提供了可优化的下界；EM 算法可视为交替优化 ELBO 的过程。"}
      commonMistakes={[
      "混淆相关概念的定义与适用场景。",
      "只记忆公式而忽略其背后的概率或优化假设。"
    ]}
      quiz={[
      {
        question: "关于“ELBO”，下列说法是否正确？",
        options: ["通过引入变分后验，将难解的边缘似然转化为可计算的期望加 KL 惩罚。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。通过引入变分后验，将难解的边缘似然转化为可计算的期望加 KL 惩罚。",
      },
      {
        question: "关于“EM 算法”，下列说法是否正确？",
        options: ["E 步固定参数优化 q，M 步固定 q 优化模型参数，保证似然单调不减。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。E 步固定参数优化 q，M 步固定 q 优化模型参数，保证似然单调不减。",
      },
      {
        question: "关于“广义 EM”，下列说法是否正确？",
        options: ["M 步不必完全最大化 ELBO，只要有所提升即可。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。M 步不必完全最大化 ELBO，只要有所提升即可。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 15",
      section: "",
      pages: "",
    }}
          demo={{
      title: "KL 项对 ELBO 的影响",
      label: "变分后验标准差 σ",
      param: 1,
      min: 0.1,
      max: 3,
      step: 0.1,
      compute: (sigma) => ({
        label: '-KL(q||N(0,1))',
        value: -0.5 * (sigma * sigma - Math.log(sigma * sigma) - 1),
        display: String.raw`-D_{KL}=${(-0.5 * (sigma * sigma - Math.log(sigma * sigma) - 1)).toFixed(3)}`,
      }),
      formula: String.raw`-D_{KL}\bigl(\mathcal{N}(0,\sigma^2) \| \mathcal{N}(0,1)\bigr) = -\frac{1}{2}(\sigma^2 - \ln \sigma^2 - 1)`,
    }}
    />
  );
}
