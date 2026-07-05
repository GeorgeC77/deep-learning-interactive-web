import BishopSectionPage from '@/components/BishopSectionPage';
import { Calculator } from 'lucide-react';

export default function Ch05AutomaticDifferentiationPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch05/automatic-differentiation"
      heroIcon={<Calculator className="w-9 h-9 text-blue-600" />}
      summary={"自动微分将复杂函数拆分为基本运算，通过反向模式在计算图上机械地传播梯度，是现代框架的核心。"}
      concepts={[
    {
      title: "反向模式自动微分",
      description: "先执行前向计算记录图，再从输出节点反向传播伴随向量。",
    },
    {
      title: "前向模式",
      description: "对每个输入方向单独传播导数，适合输入维度低的场景。",
    },
    {
      title: "计算图与拓扑序",
      description: "节点按依赖顺序求值，反向传播按逆拓扑序更新梯度。",
    }
      ]}
      learningObjectives={[
      "理解 反向模式自动微分 的含义与作用。",
      "理解 前向模式 的含义与作用。",
      "理解 计算图与拓扑序 的含义与作用。"
    ]}
      coreIntuition={"自动微分将复杂函数拆分为基本运算，通过反向模式在计算图上机械地传播梯度，是现代框架的核心。"}
      commonMistakes={[
      "混淆相关概念的定义与适用场景。",
      "只记忆公式而忽略其背后的概率或优化假设。"
    ]}
      quiz={[
      {
        question: "关于“反向模式自动微分”，下列说法是否正确？",
        options: ["先执行前向计算记录图，再从输出节点反向传播伴随向量。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。先执行前向计算记录图，再从输出节点反向传播伴随向量。",
      },
      {
        question: "关于“前向模式”，下列说法是否正确？",
        options: ["对每个输入方向单独传播导数，适合输入维度低的场景。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。对每个输入方向单独传播导数，适合输入维度低的场景。",
      },
      {
        question: "关于“计算图与拓扑序”，下列说法是否正确？",
        options: ["节点按依赖顺序求值，反向传播按逆拓扑序更新梯度。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。节点按依赖顺序求值，反向传播按逆拓扑序更新梯度。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 8",
      section: "",
      pages: "",
    }}
          demo={{
      title: "自动微分示例 f(x)=x²",
      label: "输入 x",
      param: 2,
      min: -3,
      max: 3,
      step: 0.1,
      compute: (x) => ({
        label: 'f(x)=x²',
        value: x * x,
        display: String.raw`\frac{df}{dx}=2\cdot${x.toFixed(1)}=${(2 * x).toFixed(1)}`,
      }),
      formula: String.raw`f(x)=x^2 \Rightarrow \frac{df}{dx}=2x`,
    }}
    />
  );
}
