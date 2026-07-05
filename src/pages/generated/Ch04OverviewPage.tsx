import BishopSectionPage from '@/components/BishopSectionPage';
import { TrendingDown } from 'lucide-react';

export default function Ch04OverviewPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch04/overview"
      heroIcon={<TrendingDown className="w-9 h-9 text-blue-600" />}
      summary={"本章介绍训练深度网络的核心优化方法：从误差曲面的局部结构到批量、随机、动量、自适应学习率等实用算法。"}
      concepts={[
    {
      title: "误差曲面",
      description: "损失函数在高维参数空间形成复杂曲面，局部曲率决定优化难度。",
    },
    {
      title: "梯度下降族",
      description: "批量 GD、SGD 与小批量 SGD 在计算效率与梯度方差之间权衡。",
    },
    {
      title: "自适应方法",
      description: "动量、RMSProp 与 Adam 通过累积历史梯度信息加速收敛并减少震荡。",
    },
    {
      title: "学习率调度",
      description: "随训练进程降低学习率，兼顾快速收敛与精细逼近局部极小值。",
    }
      ]}
      learningObjectives={[
      "理解 误差曲面 的含义与作用。",
      "理解 梯度下降族 的含义与作用。",
      "理解 自适应方法 的含义与作用。"
    ]}
      coreIntuition={"本章介绍训练深度网络的核心优化方法：从误差曲面的局部结构到批量、随机、动量、自适应学习率等实用算法。"}
      commonMistakes={[
      "混淆相关概念的定义与适用场景。",
      "只记忆公式而忽略其背后的概率或优化假设。"
    ]}
      quiz={[
      {
        question: "关于“误差曲面”，下列说法是否正确？",
        options: ["损失函数在高维参数空间形成复杂曲面，局部曲率决定优化难度。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。损失函数在高维参数空间形成复杂曲面，局部曲率决定优化难度。",
      },
      {
        question: "关于“梯度下降族”，下列说法是否正确？",
        options: ["批量 GD、SGD 与小批量 SGD 在计算效率与梯度方差之间权衡。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。批量 GD、SGD 与小批量 SGD 在计算效率与梯度方差之间权衡。",
      },
      {
        question: "关于“自适应方法”，下列说法是否正确？",
        options: ["动量、RMSProp 与 Adam 通过累积历史梯度信息加速收敛并减少震荡。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。动量、RMSProp 与 Adam 通过累积历史梯度信息加速收敛并减少震荡。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 7",
      section: "",
      pages: "",
    }}
          demo={{
      title: "学习率对收敛步数的影响",
      label: "学习率 η",
      param: 0.3,
      min: 0.01,
      max: 1,
      step: 0.01,
      compute: (eta) => ({
        label: '单步相对进展',
        value: eta * Math.exp(-eta),
        display: String.raw`\Delta = ${(eta * Math.exp(-eta)).toFixed(3)}`,
      }),
      formula: String.raw`\Delta(\eta) = \eta e^{-\eta}`,
    }}
    />
  );
}
