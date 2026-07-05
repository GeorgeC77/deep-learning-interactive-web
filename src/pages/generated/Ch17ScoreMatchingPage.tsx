import BishopSectionPage from '@/components/BishopSectionPage';
import { Activity } from 'lucide-react';

export default function Ch17ScoreMatchingPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch17/score-matching"
      heroIcon={<Activity className="w-9 h-9 text-blue-600" />}
      summary={"分数匹配通过估计数据对数密度的梯度（分数函数）来建模分布；去噪分数匹配与扩散训练目标等价。"}
      concepts={[
    {
      title: "分数函数",
      description: "分数是对数密度关于输入的梯度，指向数据密度增加最快的方向。",
      formula: String.raw`s(x) = \nabla_x \ln p(x)`,
    },
    {
      title: "分数匹配损失",
      description: "用模型分数与真实分数之间的 Fisher 散度作为目标。",
    },
    {
      title: "噪声水平与多尺度",
      description: "对不同噪声尺度的扰动数据训练分数网络，形成退火 Langevin 动力学。",
    }
      ]}
      learningObjectives={[
      "理解 分数函数 的含义与作用。",
      "理解 分数匹配损失 的含义与作用。",
      "理解 噪声水平与多尺度 的含义与作用。"
    ]}
      coreIntuition={"分数匹配通过估计数据对数密度的梯度（分数函数）来建模分布；去噪分数匹配与扩散训练目标等价。"}
      commonMistakes={[
      "混淆相关概念的定义与适用场景。",
      "只记忆公式而忽略其背后的概率或优化假设。"
    ]}
      quiz={[
      {
        question: "关于“分数函数”，下列说法是否正确？",
        options: ["分数是对数密度关于输入的梯度，指向数据密度增加最快的方向。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。分数是对数密度关于输入的梯度，指向数据密度增加最快的方向。",
      },
      {
        question: "关于“分数匹配损失”，下列说法是否正确？",
        options: ["用模型分数与真实分数之间的 Fisher 散度作为目标。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。用模型分数与真实分数之间的 Fisher 散度作为目标。",
      },
      {
        question: "关于“噪声水平与多尺度”，下列说法是否正确？",
        options: ["对不同噪声尺度的扰动数据训练分数网络，形成退火 Langevin 动力学。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。对不同噪声尺度的扰动数据训练分数网络，形成退火 Langevin 动力学。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 20",
      section: "",
      pages: "",
    }}
          demo={{
      title: "高斯分布的分数",
      label: "位置 x",
      param: 1,
      min: -3,
      max: 3,
      step: 0.1,
      compute: (x) => ({
        label: 'N(0,1) 的分数',
        value: -x,
        display: String.raw`s(${x.toFixed(1)})=-${x.toFixed(1)}`,
      }),
      formula: String.raw`s(x) = \nabla_x \ln \mathcal{N}(x\mid 0,1) = -x`,
    }}
    />
  );
}
