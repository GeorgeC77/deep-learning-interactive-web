import BishopSectionPage from '@/components/BishopSectionPage';
import { Globe } from 'lucide-react';

export default function Ch10MachineLearningOnGraphsPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch10/machine-learning-on-graphs"
      heroIcon={<Globe className="w-9 h-9 text-blue-600" />}
      summary={"图机器学习利用邻接矩阵与节点特征完成节点、边、图级任务；设计模型时必须区分节点级预测的置换等变性与图级预测的置换不变性。"}
      concepts={[
        {
          title: "邻接矩阵",
          description: "用矩阵显式编码节点连接关系；节点重排对应邻接矩阵的行列同步置换。",
        },
        {
          title: "节点、边、图级任务",
          description: "分别预测单个节点、单条边或整张图的标签，不同任务对置换对称性的要求不同。",
        },
        {
          title: "置换等变性",
          description: "若对输入节点重新编号，节点级输出也按同样顺序重排。",
          formula: String.raw`f(P A P^{\top}, P X) = P f(A, X)`,
        },
        {
          title: "置换不变性",
          description: "对输入节点重新编号，图级输出保持不变。",
          formula: String.raw`f(P A P^{\top}, P X) = f(A, X)`,
        },
      ]}
      learningObjectives={[
        "能用邻接矩阵表示简单图。",
        "区分节点级任务的置换等变性与图级任务的置换不变性。",
        "理解为什么图模型应基于聚合操作。",
      ]}
      coreIntuition={"图没有天然的节点顺序；好的图模型应像“集合上的函数”：节点级输出随节点顺序一起变，图级输出则不随顺序变。"}
      commonMistakes={[
        "混淆置换等变性与置换不变性：节点预测应是等变，图预测才是不变。",
        "在预处理中给节点赋予固定序号并当作序列处理，破坏图的对称性。",
        "认为图级 readout 必须用求和；其实任何置换不变的聚合（mean、max、sum）都可行。",
      ]}
      whyCards={[
        {
          question: "为什么图模型需要置换等变性？",
          answer: "图没有天然的节点顺序。如果重新编号节点，节点级预测也应该按同样顺序重排，否则模型会错误地认为节点顺序有语义。",
        },
        {
          question: "为什么图级预测需要置换不变性？",
          answer: "整张图的标签不应该依赖于节点编号方式。无论怎么重新编号节点，图级预测都应该保持不变。",
        },
      ]}
      counterexamples={[
        "把图节点当作序列输入 RNN，重新排列节点后预测结果改变——说明序列模型不满足图的对称性。",
        "用固定顺序的邻接矩阵训练图模型，测试时改变节点顺序导致性能下降——说明模型没有学到置换等变性。",
      ]}
            bishopMapping={{
        chapter: "Ch 13",
        section: "13.1",
        pages: "Ch 13",
        textbookSubsections: [
          "13.1.1 Graph properties",
          "13.1.2 Adjacency matrix",
          "13.1.3 Permutation equivariance"
        ],
        formulas: ["置换等变 f(PAPᵀ,PX)=Pf(A,X)", "置换不变 f(PAPᵀ,PX)=f(A,X)"],
        algorithms: ["度中心性", "图特征提取"],
        exercises: ["写出 4 节点环图的邻接矩阵，并验证节点重排后的置换等价。", "判断节点分类与图分类分别需要哪种置换性质。"],
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
