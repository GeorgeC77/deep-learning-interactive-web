import BishopSectionPage from '@/components/BishopSectionPage';
import { ArrowRight } from 'lucide-react';

export default function Ch15AutoregressiveFlowsPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch15/autoregressive-flows"
      heroIcon={<ArrowRight className="w-9 h-9 text-blue-600" />}
      summary={"自回归流按顺序对每个维度做条件变换，天然具有三角 Jacobian，是 MAF 与 IAF 等模型的基础。"}
      concepts={[
    {
      title: "自回归分解",
      description: "联合分布分解为各维度的条件分布乘积。",
      formula: String.raw`p(x) = \prod_{i} p(x_i \mid x_{<i})`,
    },
    {
      title: "MAF 与 IAF",
      description: "MAF 便于密度估计，IAF 便于快速采样，两者在自回归方向上互补。",
    },
    {
      title: " masked 自回归网络",
      description: "通过掩码保证每个输出只依赖前面维度，维持自回归结构。",
    }
      ]}
      learningObjectives={[
      "理解 自回归分解 的含义与作用。",
      "理解 MAF 与 IAF 的含义与作用。",
      "理解  masked 自回归网络 的含义与作用。"
    ]}
      coreIntuition={"自回归流按顺序对每个维度做条件变换，天然具有三角 Jacobian，是 MAF 与 IAF 等模型的基础。"}
      commonMistakes={[
      "混淆相关概念的定义与适用场景。",
      "只记忆公式而忽略其背后的概率或优化假设。"
    ]}
      quiz={[
      {
        question: "关于“自回归分解”，下列说法是否正确？",
        options: ["联合分布分解为各维度的条件分布乘积。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。联合分布分解为各维度的条件分布乘积。",
      },
      {
        question: "关于“MAF 与 IAF”，下列说法是否正确？",
        options: ["MAF 便于密度估计，IAF 便于快速采样，两者在自回归方向上互补。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。MAF 便于密度估计，IAF 便于快速采样，两者在自回归方向上互补。",
      },
      {
        question: "关于“ masked 自回归网络”，下列说法是否正确？",
        options: ["通过掩码保证每个输出只依赖前面维度，维持自回归结构。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。通过掩码保证每个输出只依赖前面维度，维持自回归结构。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 18",
      section: "",
      pages: "",
    }}

    />
  );
}
