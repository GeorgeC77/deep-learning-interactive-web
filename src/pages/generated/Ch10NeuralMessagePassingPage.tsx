import BishopSectionPage from '@/components/BishopSectionPage';
import MessagePassingInvariantDemo from '@/components/demos/MessagePassingInvariantDemo';
import DerivationStepper from '@/components/DerivationStepper';
import ExercisePanel from '@/components/ExercisePanel';
import { chapter10MessagePassingExercises } from '@/course/chapter10Exercises';
import { MessageSquare } from 'lucide-react';

export default function Ch10NeuralMessagePassingPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch10/neural-message-passing"
      heroIcon={<MessageSquare className="w-9 h-9 text-blue-600" />}
      summary={"神经消息传递是图神经网络的核心框架：生成消息、置换不变地聚合邻居消息、更新节点表示，最后通过 readout 得到图级输出。"}
      concepts={[
        {
          title: "卷积滤波器",
          description: "网格卷积在不同空间位置共享同一滤波器；将像素邻域视为规则图，可以看清局部聚合、共享参数与等变性的来源。",
          formula: String.raw`z_i^{(l+1)}=f\!\left(w_{\rm neigh}\sum_{j\in\mathcal N(i)}z_j^{(l)}+w_{\rm self}z_i^{(l)}+b\right)`,
        },
        {
          title: "图卷积网络",
          description: "把固定像素邻域替换为图邻域，并为每个节点执行相同的聚合—更新步骤；L 层传播让表示最多依赖 L 跳邻域。",
          formula: String.raw`\mathbf z_n^{(l)}=\operatorname{Aggregate}\{\mathbf h_m^{(l)}:m\in\mathcal N(n)\}`,
        },
        {
          title: "聚合函数 Aggregate",
          description: "对邻居消息做求和、平均或最大值聚合；聚合函数本身是置换不变的。",
          formula: String.raw`\mathbf{a}_v = \bigoplus_{u \in \mathcal{N}(v)} \mathbf{m}_{uv}`,
        },
        {
          title: "更新函数 Update",
          description: "将当前节点表示与聚合后的邻居信息结合，得到新的节点表示；参数在所有节点间共享。",
          formula: String.raw`\mathbf h_n^{(l+1)}=f(W_{\rm self}\mathbf h_n^{(l)}+W_{\rm neigh}\mathbf z_n^{(l)}+\mathbf b)`,
        },
        {
          title: "节点分类",
          description: "对每个最终节点嵌入应用共享分类器与 softmax；直推训练可让未标注节点参与传播，但交叉熵只在训练节点上求和。",
          formula: String.raw`p(c\mid n)=\operatorname{softmax}_c(W\mathbf h_n^{(L)}+\mathbf b)`,
        },
        {
          title: "边分类",
          description: "用一对节点的最终嵌入预测它们之间是否存在边；教材给出的基础形式是点积后接 logistic sigmoid。",
          formula: String.raw`p(n,m)=\sigma(\mathbf h_n^{\top}\mathbf h_m)`,
        },
        {
          title: "图分类",
          description: "先对全部最终节点嵌入做置换不变聚合，再由共享预测器输出整图标签或连续性质。",
          formula: String.raw`\mathbf y=f\!\left(\sum_{n\in\mathcal V}\mathbf h_n^{(L)}\right)`,
        },
  ]}
      learningObjectives={[
        "能写出消息传递的 message → aggregate → update → readout 流程。",
        "理解聚合函数的置换不变性与节点表示的置换等变性。",
        "能说明 GCN 与通用消息传递框架的关系。",
      ]}
      coreIntuition={"消息传递就像社交网络中的谣言传播：每个人（节点）听取邻居消息、做笔记（聚合）、更新自己的看法；对所有人做总结（readout）就得到全图观点。"}
      commonMistakes={[
        "说‘GNN 是置换不变的’——准确说法：聚合函数是置换不变的，节点级表示通常是置换等变的，图级 readout 才是置换不变的。",
        "把 GCN 的固定归一化当作唯一选择，忽略 attention 等自适应聚合。",
        "忽略消息函数中边特征的作用，导致无法区分不同类型的关系。",
      ]}
      whyCards={[
        {
          question: "为什么消息传递要置换不变？",
          answer: "图的节点没有天然顺序。无论怎么给邻居编号，同一个节点的更新结果都应一样，否则模型就依赖于随意的人为编号。",
        },
        {
          question: "为什么图神经网络要聚合邻居？",
          answer: "单个节点的信息往往不够。把邻居的特征聚合过来，节点才能利用周围结构，就像人通过朋友了解自己所在的圈子。",
        },
      ]}
      counterexamples={[
        "若用求和以外的非对称方式聚合（比如按邻居编号加权），交换两个邻居的编号就会改变结果，破坏置换不变性，模型就依赖于人为顺序。",
        "只聚合邻居而不保留自身特征，节点会在多层后丢失自己的信息（过度平滑），所有节点表示趋于相同。",
      ]}
            bishopMapping={{
        chapter: "Ch 13",
        section: "13.2",
        pages: "§13.2, pp. 412–420",
        textbookSubsections: [
          "13.2 Neural Message-Passing",
          "13.2.1 Convolutional filters",
          "13.2.2 Graph convolutional networks",
          "13.2.3 Aggregation operators",
          "13.2.4 Update operators",
          "13.2.5 Node classification",
          "13.2.6 Edge classification",
          "13.2.7 Graph classification"
        ],
        formulas: ["邻域聚合 z_n=Aggregate({h_m:m∈N(n)})", "更新 h_n'=Update(h_n,z_n)", "边概率与图级 readout"],
        algorithms: ["Algorithm 13.1 Neural message-passing", "sum/mean/degree-normalized aggregation"],
        exercises: ["判断邻居重排是否影响聚合。", "推导 L 层消息传递的感受野。", "辨认边概率与图级不变读出。"],
      }}
      extraContent={<div className="space-y-10"><MessagePassingInvariantDemo /><DerivationStepper title="分步推导：为什么一层消息传递是置换等变的" steps={[
        { label: '收集邻域', formula: String.raw`\mathcal M_n^{(l)}=\{\mathbf h_m^{(l)}:m\in\mathcal N(n)\}`, explanation: '节点重编号只会重命名中心节点与邻居，不会改变每个中心所对应的邻域多重集合。' },
        { label: '对称聚合', formula: String.raw`\mathbf z_n^{(l)}=\operatorname{Aggregate}(\mathcal M_n^{(l)})`, explanation: 'sum、mean、max 等聚合不依赖邻居枚举顺序，因此重编号前后的同一真实节点得到相同消息。' },
        { label: '共享更新', formula: String.raw`\mathbf h_n^{(l+1)}=\operatorname{Update}(\mathbf h_n^{(l)},\mathbf z_n^{(l)})`, explanation: '所有节点使用同一个 Update，而不是按节点编号使用不同参数，所以输出仍只跟随节点身份移动。' },
        { label: '整层等变', formula: String.raw`F(PH,PAP^{\top})=P F(H,A)`, explanation: '邻域保留、聚合对顺序不敏感、更新参数共享，三者合起来保证节点表示按同一置换重排。' },
      ]} /><ExercisePanel exerciseSetId="chapter10-message-passing" exercises={chapter10MessagePassingExercises} /></div>}
    />
  );
}
