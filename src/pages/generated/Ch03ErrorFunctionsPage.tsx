import BishopSectionPage from '@/components/BishopSectionPage';
import { Activity } from 'lucide-react';

export default function Ch03ErrorFunctionsPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch03/error-functions"
      heroIcon={<Activity className="w-9 h-9 text-blue-600" />}
      summary={"误差函数将网络输出与目标之间的差距量化为可优化的标量，不同任务（回归、分类）对应不同的概率假设与损失。"}
      concepts={[
    {
      title: "回归：平方误差",
      description: "假设目标噪声服从高斯分布，最大似然等价于最小化输出与目标的平方距离。",
      formula: String.raw`E = \frac{1}{2} \sum_{n=1}^{N} \| y(x_n, w) - t_n \|^2`,
    },
    {
      title: "二分类：交叉熵",
      description: "对二元标签使用 sigmoid 输出，最大似然导出交叉熵损失。",
      formula: String.raw`E = -\sum_{n} \left[ t_n \ln y_n + (1-t_n) \ln(1-y_n) \right]`,
    },
    {
      title: "多分类：Softmax 交叉熵",
      description: "多类输出通过 softmax 得到概率分布，损失鼓励正确类别的对数概率最大化。",
      formula: String.raw`E = -\sum_{n} \sum_{k} t_{nk} \ln y_{nk}`,
    }
      ]}
      learningObjectives={[
      "理解 回归：平方误差 的含义与作用。",
      "理解 二分类：交叉熵 的含义与作用。",
      "理解 多分类：Softmax 交叉熵 的含义与作用。"
    ]}
      coreIntuition={"误差函数将网络输出与目标之间的差距量化为可优化的标量，不同任务（回归、分类）对应不同的概率假设与损失。"}
      commonMistakes={[
      "混淆相关概念的定义与适用场景。",
      "只记忆公式而忽略其背后的概率或优化假设。"
    ]}
      quiz={[
      {
        question: "关于“回归：平方误差”，下列说法是否正确？",
        options: ["假设目标噪声服从高斯分布，最大似然等价于最小化输出与目标的平方距离。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。假设目标噪声服从高斯分布，最大似然等价于最小化输出与目标的平方距离。",
      },
      {
        question: "关于“二分类：交叉熵”，下列说法是否正确？",
        options: ["对二元标签使用 sigmoid 输出，最大似然导出交叉熵损失。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。对二元标签使用 sigmoid 输出，最大似然导出交叉熵损失。",
      },
      {
        question: "关于“多分类：Softmax 交叉熵”，下列说法是否正确？",
        options: ["多类输出通过 softmax 得到概率分布，损失鼓励正确类别的对数概率最大化。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。多类输出通过 softmax 得到概率分布，损失鼓励正确类别的对数概率最大化。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 6",
      section: "",
      pages: "",
    }}
          demo={{
      title: "交叉熵随预测概率变化",
      label: "预测正确类概率 p",
      param: 0.8,
      min: 0.05,
      max: 0.99,
      step: 0.01,
      compute: (p) => ({
        label: '交叉熵',
        value: -Math.log(p),
        display: String.raw`H=-\ln ${p.toFixed(2)}`,
      }),
      formula: String.raw`H(p) = -\ln p`,
    }}
    />
  );
}
