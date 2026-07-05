import BishopSectionPage from '@/components/BishopSectionPage';
import { Waves } from 'lucide-react';

export default function Ch15ContinuousFlowsPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch15/continuous-flows"
      heroIcon={<Waves className="w-9 h-9 text-blue-600" />}
      summary={"连续流将变换视为由神经网络定义的常微分方程，用 ODE 求解器前向与反向传播，实现任意精度的可逆变换。"}
      concepts={[
    {
      title: "神经 ODE",
      description: "隐藏状态随连续时间演化，由神经网络参数化的导数驱动。",
      formula: String.raw`\frac{dh(t)}{dt} = f(h(t), t, \theta)`,
    },
    {
      title: "伴随敏感性",
      description: "通过求解增广 ODE 反向传播梯度，避免存储中间状态。",
    },
    {
      title: "FFJORD",
      description: "用随机迹估计替代精确 Jacobian，扩展连续流到高维数据。",
    }
      ]}
      learningObjectives={[
      "理解 神经 ODE 的含义与作用。",
      "理解 伴随敏感性 的含义与作用。",
      "理解 FFJORD 的含义与作用。"
    ]}
      coreIntuition={"连续流将变换视为由神经网络定义的常微分方程，用 ODE 求解器前向与反向传播，实现任意精度的可逆变换。"}
      commonMistakes={[
      "混淆相关概念的定义与适用场景。",
      "只记忆公式而忽略其背后的概率或优化假设。"
    ]}
      quiz={[
      {
        question: "关于“神经 ODE”，下列说法是否正确？",
        options: ["隐藏状态随连续时间演化，由神经网络参数化的导数驱动。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。隐藏状态随连续时间演化，由神经网络参数化的导数驱动。",
      },
      {
        question: "关于“伴随敏感性”，下列说法是否正确？",
        options: ["通过求解增广 ODE 反向传播梯度，避免存储中间状态。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。通过求解增广 ODE 反向传播梯度，避免存储中间状态。",
      },
      {
        question: "关于“FFJORD”，下列说法是否正确？",
        options: ["用随机迹估计替代精确 Jacobian，扩展连续流到高维数据。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。用随机迹估计替代精确 Jacobian，扩展连续流到高维数据。",
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
