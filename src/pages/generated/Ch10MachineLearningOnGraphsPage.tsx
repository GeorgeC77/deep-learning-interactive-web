import BishopSectionPage from '@/components/BishopSectionPage';
import DerivationStepper from '@/components/DerivationStepper';
import ExercisePanel from '@/components/ExercisePanel';
import GraphPermutationLab from '@/components/demos/GraphPermutationLab';
import { chapter10GraphBasicsExercises } from '@/course/chapter10Exercises';
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
          title: "直推与归纳学习",
          description: "直推节点分类在训练时可看到测试节点及图结构但不使用其标签；归纳学习则要求模型推广到训练时未出现的新节点或新图。",
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
        "区分直推学习与归纳学习中测试节点在训练阶段是否出现。",
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
        pages: "§13.1, pp. 409–412",
        textbookSubsections: [
          "13.1.1 Graph properties",
          "13.1.2 Adjacency matrix",
          "13.1.3 Permutation equivariance"
        ],
        formulas: ["置换等变 f(PAPᵀ,PX)=Pf(A,X)", "置换不变 f(PAPᵀ,PX)=f(A,X)"],
        algorithms: ["邻接矩阵的同步行列置换", "置换不变图级 readout"],
        exercises: ["计算 X′=PX 与 A′=PAPᵀ。", "判断节点/图任务需要等变还是不变。", "区分直推学习与归纳学习。"],
      }}
      extraContent={<div className="space-y-10"><GraphPermutationLab /><DerivationStepper title="分步推导：节点等变如何变成整图不变" steps={[
        { label: '重编号输入', formula: String.raw`\widetilde X=PX,\qquad \widetilde A=PAP^{\top}`, explanation: 'X 的行对应节点；A 的行和列都对应节点，因此同一个 P 要同时作用在两个索引上。' },
        { label: '节点映射等变', formula: String.raw`H(\widetilde X,\widetilde A)=P H(X,A)`, explanation: '重新编号不会改变每个真实节点得到的信息，只会改变这些节点表示在矩阵中的排列。' },
        { label: '对节点求和', formula: String.raw`r(H)=\mathbf 1^{\top}H`, explanation: '图级 readout 必须消除任意节点顺序；求和是最简单的置换不变聚合。' },
        { label: '得到不变性', formula: String.raw`r(PH)=\mathbf 1^{\top}PH=\mathbf 1^{\top}H=r(H)`, explanation: '置换只重排行，所以 1ᵀP=1ᵀ。于是节点级等变表示经对称 readout 后给出图级不变输出。' },
      ]} /><ExercisePanel exerciseSetId="chapter10-graph-basics" exercises={chapter10GraphBasicsExercises} /></div>}
    />
  );
}
