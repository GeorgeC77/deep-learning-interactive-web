import BishopSectionPage from '@/components/BishopSectionPage';
import { Share2 } from 'lucide-react';

export default function Ch10OverviewPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch10/overview"
      heroIcon={<Share2 className="w-9 h-9 text-blue-600" />}
      summary={"图神经网络将神经网络推广到不规则图结构，通过消息传递聚合邻域信息并满足置换等变性。"}
      concepts={[
    {
      title: "图数据",
      description: "节点、边与全局特征构成非欧数据，无法用常规网格卷积直接处理。",
    },
    {
      title: "消息传递",
      description: "每个节点收集并变换邻居信息，再更新自身表示。",
    },
    {
      title: "置换等变性",
      description: "节点编号改变时，GNN 输出仅相应置换，保持图结构语义不变。",
    }
      ]}
      learningObjectives={[
      "理解 图数据 的含义与作用。",
      "理解 消息传递 的含义与作用。",
      "理解 置换等变性 的含义与作用。"
    ]}
      coreIntuition={"图神经网络将神经网络推广到不规则图结构，通过消息传递聚合邻域信息并满足置换等变性。"}
      commonMistakes={[
      "将本节结论直接套用到前提条件不同的场景，忽略假设差异。",
      "只关注公式写法，却不检验推导前提或代入具体数值验证。"
    ]}
            bishopMapping={{
      chapter: "Ch 13",
      pages: "Ch 13",
      textbookSubsections: [],
      exercises: ["展开本节一个核心公式并说明每个符号的数学含义。", "用一个简单数值实例检验本节结论。", "对照前文结论，分析本节结论的适用边界与差异。"]
    }}

    />
  );
}
