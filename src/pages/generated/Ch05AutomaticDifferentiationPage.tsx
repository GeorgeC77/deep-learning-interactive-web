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
        "理解反向模式自动微分的含义与作用。",
        "理解前向模式的含义与作用。",
        "理解计算图与拓扑序的含义与作用。"
      ]}
      coreIntuition={"自动微分将复杂函数拆分为基本运算，通过反向模式在计算图上机械地传播梯度，是现代框架的核心。"}
      commonMistakes={[
        "认为自动微分和数值微分一样有舍入误差——自动微分是精确的符号微分。",
        "混淆前向模式和反向模式的适用场景——输入维度高用反向，输出维度高用前向。",
      ]}
      whyCards={[
        {
          question: "为什么自动微分比数值微分更准确？",
          answer: "自动微分用链式法则精确计算导数，没有数值微分的截断误差和舍入误差。",
        },
        {
          question: "为什么反向模式适合神经网络？",
          answer: "神经网络输入维度高（参数多）、输出维度低（标量损失），反向模式只需一次前向加一次后向就能计算所有参数的梯度。",
        },
      ]}
      counterexamples={[
        "对输入维度 100 万、输出维度 1 的函数使用前向模式，需要 100 万次前向计算——说明模式选择决定计算成本。",
        "认为自动微分和数值微分一样有舍入误差——自动微分是精确的符号微分，没有截断误差。",
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
        exercises: ["比较前向模式与反向模式在不同输入输出维度下的计算成本。", "用一个简单计算图手动追踪反向传播的梯度流。"]
      }}
      demo={{
        title: "自动微分示例 f(x)=x²",
        label: "输入 x",
        param: 2,
        min: -3,
        max: 3,
        step: 0.1,
        compute: (x) => ({
          label: "f(x)=x²",
          value: x * x,
          display: String.raw`\frac{df}{dx}=2\cdot${x.toFixed(1)}=${(2 * x).toFixed(1)}`,
        }),
        formula: String.raw`f(x)=x^2 \Rightarrow \frac{df}{dx}=2x`,
      }}
      extraContent={<BackpropagationLab />}
    />
  );
}
