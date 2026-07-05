import BishopSectionPage from '@/components/BishopSectionPage';
import { Globe } from 'lucide-react';

export default function Ch10MachineLearningOnGraphsPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch10/machine-learning-on-graphs"
      heroIcon={<Globe className="w-9 h-9 text-blue-600" />}
      summary={"图机器学习利用邻接矩阵与节点特征完成任务；理解图性质与置换对称性是设计模型先验的关键。"}
      concepts={[
    {
      title: "邻接矩阵",
      description: "用矩阵显式编码节点连接关系，稀疏形式可高效存储大规模图。",
    },
    {
      title: "节点、边、图级任务",
      description: "分别预测单个节点、单条边或整张图的标签。",
    },
    {
      title: "置换等变性",
      description: "对节点重新编号不应改变预测结果，这要求模型基于聚合操作。",
    }
      ]}
      learningObjectives={[
      "理解 邻接矩阵 的含义与作用。",
      "理解 节点、边、图级任务 的含义与作用。",
      "理解 置换等变性 的含义与作用。"
    ]}
      coreIntuition={"图机器学习利用邻接矩阵与节点特征完成任务；理解图性质与置换对称性是设计模型先验的关键。"}
      commonMistakes={[
      "混淆相关概念的定义与适用场景。",
      "只记忆公式而忽略其背后的概率或优化假设。"
    ]}
      quiz={[
      {
        question: "关于“邻接矩阵”，下列说法是否正确？",
        options: ["用矩阵显式编码节点连接关系，稀疏形式可高效存储大规模图。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。用矩阵显式编码节点连接关系，稀疏形式可高效存储大规模图。",
      },
      {
        question: "关于“节点、边、图级任务”，下列说法是否正确？",
        options: ["分别预测单个节点、单条边或整张图的标签。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。分别预测单个节点、单条边或整张图的标签。",
      },
      {
        question: "关于“置换等变性”，下列说法是否正确？",
        options: ["对节点重新编号不应改变预测结果，这要求模型基于聚合操作。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。对节点重新编号不应改变预测结果，这要求模型基于聚合操作。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 13",
      section: "",
      pages: "",
    }}
          demo={{
      title: "度中心性",
      label: "节点度数 k",
      param: 4,
      min: 0,
      max: 20,
      step: 1,
      compute: (k) => ({
        label: '归一化度中心性',
        value: k / 20,
        display: String.raw`C_D=${(k / 20).toFixed(2)}`,
      }),
      formula: String.raw`C_D(v) = \frac{\deg(v)}{N-1}`,
    }}
    />
  );
}
