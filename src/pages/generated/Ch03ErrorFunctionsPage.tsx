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
      "混淆本节核心概念与相邻小节的前提假设，导致错误套用。",
      "只记忆公式形式，而不验证其成立条件与具体数值。"
    ]}
      quiz={[
      {
        question: "下列关于“回归：平方误差”的叙述，哪一项最准确？",
        options: ["假设目标噪声服从高斯分布，最大似然等价于最小化输出与目标的平方距离。", "回归：平方误差 只是术语，没有独立建模意义。", "回归：平方误差 不需要任何分布假设即可直接使用。"],
        correctIndex: 0,
        explanation: "正确。假设目标噪声服从高斯分布，最大似然等价于最小化输出与目标的平方距离。 这体现了本节的核心思想。",
      },
      {
        question: "在“二分类：交叉熵”的公式中，若忽略其中某一项，最可能导致什么后果？",
        options: ["得到形式上“简洁”但数值或概率意义错误的结论。", "结果只是略有不精确，不会影响最终决策。", "公式会自动退化为另一种更简单的正确形式。"],
        correctIndex: 0,
        explanation: "正确。二分类：交叉熵 的每一项都有明确的数学或物理意义，随意省略会破坏等式成立的条件。",
      },
      {
        question: "在一个具体情境中，你发现“多分类：Softmax 交叉熵”的结果违背直觉，应优先排查哪些前提假设？",
        options: ["是否违反了该方法成立的前提条件或数据假设。", "直觉一定是错的，直接接受计算结果。", "一定是代码实现出错，与理论无关。"],
        correctIndex: 0,
        explanation: "正确。多分类：Softmax 交叉熵 的可靠性取决于前提假设是否满足；违反假设时结果可能反直觉但合理。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 6",
      section: "6.4",
      pages: "Ch 6",
      textbookSubsections: [
          "6.4 Error Functions"
        ],
      formulas: ["回归：平方误差公式", "二分类：交叉熵公式", "多分类：Softmax 交叉熵公式"],
      exercises: ["推导本节核心公式的展开形式并说明每个符号含义。", "用一个小例子验证本节概念或数值结论。", "对比本节结论与先前章节结论的适用条件差异。"]
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
