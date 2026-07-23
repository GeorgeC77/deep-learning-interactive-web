import BishopSectionPage from '@/components/BishopSectionPage';
import ErrorFunctionLab from '@/components/demos/ErrorFunctionLab';
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
      "在分类任务中使用平方误差，导致 sigmoid 饱和区梯度消失。",
      "认为误差函数只是工程选择，与概率假设无关。",
      "对多分类使用多个独立 sigmoid 而不是 softmax，概率和不为 1。",
    ]}
      whyCards={[
      {
        question: "为什么分类任务要用交叉熵而不是平方误差？",
        answer: "平方误差假设输出是连续值且噪声高斯；分类输出是离散标签，伯努利似然对应交叉熵。用平方误差会导致梯度在 sigmoid 饱和区消失。",
      },
      {
        question: "为什么多分类要用 softmax 而不是多个 sigmoid？",
        answer: "多个独立 sigmoid 的概率和可以大于 1，无法比较类别。softmax 保证所有类别概率非负且和为 1，形成真正的概率分布。",
      },
    ]}
      counterexamples={[
      "对二分类问题使用平方误差，当预测概率接近 0 或 1 时梯度几乎为零——说明损失函数选择直接影响训练。",
      "对三分类问题用三个独立 sigmoid，预测概率可能为 [0.8, 0.7, 0.6]——说明概率和不等于 1，无法决策。",
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
      interactiveDemo={<ErrorFunctionLab />}
    />
  );
}
