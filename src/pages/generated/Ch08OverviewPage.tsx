import BishopSectionPage from '@/components/BishopSectionPage';
import { Network } from 'lucide-react';

export default function Ch08OverviewPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch08/overview"
      heroIcon={<Network className="w-9 h-9 text-blue-600" />}
      summary={"结构化分布利用变量间的依赖关系进行紧凑建模；图模型与序列模型为复杂联合分布提供可解释框架。"}
      concepts={[
    {
      title: "联合分布的分解",
      description: "利用条件独立将高维分布分解为局部因子的乘积，降低表示与推断成本。",
    },
    {
      title: "有向与无向图",
      description: "贝叶斯网络用有向边表示因果关系，马尔可夫随机场用无向边表示软约束。",
    },
    {
      title: "序列结构",
      description: "时间或空间上的相邻变量相互依赖，适合用链或树结构建模。",
    }
      ]}
      learningObjectives={[
      "理解 联合分布的分解 的含义与作用。",
      "理解 有向与无向图 的含义与作用。",
      "理解 序列结构 的含义与作用。"
    ]}
      coreIntuition={"结构化分布利用变量间的依赖关系进行紧凑建模；图模型与序列模型为复杂联合分布提供可解释框架。"}
      commonMistakes={[
      "混淆相关概念的定义与适用场景。",
      "只记忆公式而忽略其背后的概率或优化假设。"
    ]}
      quiz={[
      {
        question: "关于“联合分布的分解”，下列说法是否正确？",
        options: ["利用条件独立将高维分布分解为局部因子的乘积，降低表示与推断成本。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。利用条件独立将高维分布分解为局部因子的乘积，降低表示与推断成本。",
      },
      {
        question: "关于“有向与无向图”，下列说法是否正确？",
        options: ["贝叶斯网络用有向边表示因果关系，马尔可夫随机场用无向边表示软约束。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。贝叶斯网络用有向边表示因果关系，马尔可夫随机场用无向边表示软约束。",
      },
      {
        question: "关于“序列结构”，下列说法是否正确？",
        options: ["时间或空间上的相邻变量相互依赖，适合用链或树结构建模。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。时间或空间上的相邻变量相互依赖，适合用链或树结构建模。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 11",
      section: "",
      pages: "",
    }}

    />
  );
}
