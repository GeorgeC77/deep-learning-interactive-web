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
      quiz={[
        {
          question: "节点分类任务中，若把节点编号重新排列，正确的模型输出应该如何变化？",
          options: [
            "节点标签按相同顺序重排——这是置换等变性。",
            "节点标签全部变为同一个值——这是置换不变性。",
            "节点标签随机打乱，与输入顺序无关。",
            "节点标签应完全不变。",
          ],
          correctIndex: 0,
          explanation: "节点级预测应当是置换等变的：输入节点顺序改变，输出也按同样顺序改变。",
        },
        {
          question: "图级分类任务中，模型应满足哪种性质？",
          options: [
            "置换不变性：节点重排不改变图级输出。",
            "置换等变性：节点重排导致图级输出重排。",
            "平移不变性：把节点坐标平移不改变输出。",
            "尺度不变性：图的大小不改变输出。",
          ],
          correctIndex: 0,
          explanation: "图级标签是标量，不应随节点编号变化，因此需要置换不变性。",
        },
        {
          question: "下列哪种操作本身具有置换不变性？",
          options: ["求和、均值、最大值聚合", "矩阵乘法 W X", "按节点序号排序", "取第一个节点的特征"],
          correctIndex: 0,
          explanation: "聚合操作不依赖输入顺序；矩阵乘法、排序、取首节点都依赖顺序。",
        },
      ]}
      bishopMapping={{
        chapter: "Ch 13",
        section: "13.1",
        pages: "Ch 13",
        textbookSubsections: [
          "13.1.1 Graph properties",
          "13.1.2 Adjacency matrix"
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
