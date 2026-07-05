import BishopSectionPage from '@/components/BishopSectionPage';
import { Zap } from 'lucide-react';

export default function Ch04ConvergencePage() {
  return (
    <BishopSectionPage
      sectionPath="/ch04/convergence"
      heroIcon={<Zap className="w-9 h-9 text-blue-600" />}
      summary={"加速收敛需要利用梯度历史：动量累积速度、自适应方法按维度缩放步长，学习率调度控制长期精细搜索。"}
      concepts={[
    {
      title: "动量法",
      description: "引入速度变量，使更新方向平滑并加速穿越一致梯度方向。",
      formula: String.raw`v^{(\tau+1)} = \mu v^{(\tau)} - \eta \nabla E \quad ; \quad w^{(\tau+1)} = w^{(\tau)} + v^{(\tau+1)}`,
    },
    {
      title: "RMSProp / Adam",
      description: "维护梯度平方的指数移动平均，为每个参数自适应调整学习率。",
    },
    {
      title: "学习率衰减",
      description: "步长随 epoch 递减，保证理论上收敛到局部极小值附近。",
    }
      ]}
      learningObjectives={[
      "理解 动量法 的含义与作用。",
      "理解 RMSProp / Adam 的含义与作用。",
      "理解 学习率衰减 的含义与作用。"
    ]}
      coreIntuition={"加速收敛需要利用梯度历史：动量累积速度、自适应方法按维度缩放步长，学习率调度控制长期精细搜索。"}
      commonMistakes={[
      "混淆相关概念的定义与适用场景。",
      "只记忆公式而忽略其背后的概率或优化假设。"
    ]}
      quiz={[
      {
        question: "关于“动量法”，下列说法是否正确？",
        options: ["引入速度变量，使更新方向平滑并加速穿越一致梯度方向。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。引入速度变量，使更新方向平滑并加速穿越一致梯度方向。",
      },
      {
        question: "关于“RMSProp / Adam”，下列说法是否正确？",
        options: ["维护梯度平方的指数移动平均，为每个参数自适应调整学习率。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。维护梯度平方的指数移动平均，为每个参数自适应调整学习率。",
      },
      {
        question: "关于“学习率衰减”，下列说法是否正确？",
        options: ["步长随 epoch 递减，保证理论上收敛到局部极小值附近。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。步长随 epoch 递减，保证理论上收敛到局部极小值附近。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 7",
      section: "",
      pages: "",
    }}
          demo={{
      title: "动量系数对有效步长的影响",
      label: "动量系数 μ",
      param: 0.9,
      min: 0,
      max: 0.99,
      step: 0.01,
      compute: (mu) => ({
        label: '有效累积因子',
        value: 1 / (1 - mu),
        display: String.raw`\frac{1}{1-${mu.toFixed(2)}}=${(1 / (1 - mu)).toFixed(1)}`,
      }),
      formula: String.raw`\text{有效累积} = \frac{1}{1-\mu}`,
    }}
    />
  );
}
