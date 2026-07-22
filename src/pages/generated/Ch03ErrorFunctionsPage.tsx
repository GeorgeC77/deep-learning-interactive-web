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
      "将本节结论直接套用到前提条件不同的场景，忽略假设差异。",
      "只关注公式写法，却不检验推导前提或代入具体数值验证。"
    ]}
            bishopMapping={{
      chapter: "Ch 6",
      section: "6.4",
      pages: "Ch 6",
      textbookSubsections: [
          "6.4 Error Functions",
          "6.4.1 Regression",
          "6.4.2 Binary classification",
          "6.4.3 multiclass classification"
        ],
      formulas: ["回归：平方误差公式", "二分类：交叉熵公式", "多分类：Softmax 交叉熵公式"],
      exercises: ["展开本节一个核心公式并说明每个符号的数学含义。", "用一个简单数值实例检验本节结论。", "对照前文结论，分析本节结论的适用边界与差异。"]
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
