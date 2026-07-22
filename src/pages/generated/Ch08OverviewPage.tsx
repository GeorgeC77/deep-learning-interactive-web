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
      "将本节结论直接套用到前提条件不同的场景，忽略假设差异。",
      "只关注公式写法，却不检验推导前提或代入具体数值验证。"
    ]}
            bishopMapping={{
      chapter: "Ch 11",
      pages: "Ch 11",
      textbookSubsections: [],
      exercises: ["展开本节一个核心公式并说明每个符号的数学含义。", "用一个简单数值实例检验本节结论。", "对照前文结论，分析本节结论的适用边界与差异。"]
    }}

    />
  );
}
