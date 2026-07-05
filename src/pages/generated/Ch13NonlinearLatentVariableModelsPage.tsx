import BishopSectionPage from '@/components/BishopSectionPage';
import { Network } from 'lucide-react';

export default function Ch13NonlinearLatentVariableModelsPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch13/nonlinear-latent-variable-models"
      heroIcon={<Network className="w-9 h-9 text-blue-600" />}
      summary={"非线性隐变量模型用神经网络参数化编码器与解码器，能够捕捉复杂流形结构并作为强大生成模型。"}
      concepts={[
    {
      title: "非线性流形",
      description: "真实数据常分布于低维非线性流形，线性方法难以充分刻画。",
    },
    {
      title: "似然函数",
      description: "由于非线性映射的 Jacobian 复杂，精确似然通常难以计算。",
      formula: String.raw`p(x) = \int p(x|z) p(z) \, dz`,
    },
    {
      title: "四类生成方法",
      description: "包括自回归模型、流模型、GAN 与 VAE，它们在表示、训练与采样上各有优劣。",
    }
      ]}
      learningObjectives={[
      "理解 非线性流形 的含义与作用。",
      "理解 似然函数 的含义与作用。",
      "理解 四类生成方法 的含义与作用。"
    ]}
      coreIntuition={"非线性隐变量模型用神经网络参数化编码器与解码器，能够捕捉复杂流形结构并作为强大生成模型。"}
      commonMistakes={[
      "混淆相关概念的定义与适用场景。",
      "只记忆公式而忽略其背后的概率或优化假设。"
    ]}
      quiz={[
      {
        question: "关于“非线性流形”，下列说法是否正确？",
        options: ["真实数据常分布于低维非线性流形，线性方法难以充分刻画。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。真实数据常分布于低维非线性流形，线性方法难以充分刻画。",
      },
      {
        question: "关于“似然函数”，下列说法是否正确？",
        options: ["由于非线性映射的 Jacobian 复杂，精确似然通常难以计算。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。由于非线性映射的 Jacobian 复杂，精确似然通常难以计算。",
      },
      {
        question: "关于“四类生成方法”，下列说法是否正确？",
        options: ["包括自回归模型、流模型、GAN 与 VAE，它们在表示、训练与采样上各有优劣。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。包括自回归模型、流模型、GAN 与 VAE，它们在表示、训练与采样上各有优劣。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 16",
      section: "",
      pages: "",
    }}

    />
  );
}
