import BishopSectionPage from '@/components/BishopSectionPage';
import BackpropagationLab from '@/components/demos/BackpropagationLab';
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
      "将本节结论直接套用到前提条件不同的场景，忽略假设差异。",
      "只关注公式写法，却不检验推导前提或代入具体数值验证。"
    ]}
            bishopMapping={{
      chapter: "Ch 8",
      section: "8.2",
      pages: "Ch 8",
      textbookSubsections: [
          "8.2 Automatic Differentiation",
          "8.2.1 Forward-mode automatic differentiation",
          "8.2.2 Reverse-mode automatic differentiation"
        ],
      exercises: ["展开本节一个核心公式并说明每个符号的数学含义。", "用一个简单数值实例检验本节结论。", "对照前文结论，分析本节结论的适用边界与差异。"]
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
    extraContent={<BackpropagationLab />}
    />
  );
}
