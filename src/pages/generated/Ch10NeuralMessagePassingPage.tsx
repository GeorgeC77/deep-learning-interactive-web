import BishopSectionPage from '@/components/BishopSectionPage';
import MessagePassingInvariantDemo from '@/components/demos/MessagePassingInvariantDemo';
import { MessageSquare } from 'lucide-react';

export default function Ch10NeuralMessagePassingPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch10/neural-message-passing"
      heroIcon={<MessageSquare className="w-9 h-9 text-blue-600" />}
      summary={"神经消息传递是图神经网络的核心框架：生成消息、置换不变地聚合邻居消息、更新节点表示，最后通过 readout 得到图级输出。"}
      concepts={[
        {
          title: "消息函数 Message",
          description: "根据源节点、目标节点及边特征计算要传递的消息。",
          formula: String.raw`\mathbf{m}_{uv} = \phi(\mathbf{h}_u, \mathbf{h}_v, \mathbf{e}_{uv})`,
        },
        {
          title: "聚合函数 Aggregate",
          description: "对邻居消息做求和、平均或最大值聚合；聚合函数本身是置换不变的。",
          formula: String.raw`\mathbf{a}_v = \bigoplus_{u \in \mathcal{N}(v)} \mathbf{m}_{uv}`,
        },
        {
          title: "更新函数 Update",
          description: "将当前节点表示与聚合后的邻居信息结合，得到新的节点表示。",
          formula: String.raw`\mathbf{h}_v' = \gamma(\mathbf{h}_v, \mathbf{a}_v)`,
        },
        {
          title: "Readout",
          description: "对全图节点表示做置换不变聚合，得到图级输出。",
          formula: String.raw`\mathbf{z} = \rho\left(\{\mathbf{h}_v \mid v \in \mathcal{G}\}\right)`,
        },
        {
          title: "GCN 更新",
          description: "谱域图卷积的一阶近似，用归一化邻接矩阵聚合邻居特征。",
          formula: String.raw`H^{(l+1)} = \sigma\left(\tilde{D}^{-1/2} \tilde{A} \tilde{D}^{-1/2} H^{(l)} W^{(l)}\right)`,
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
      quiz={[
        {
          question: "消息传递框架中，哪一步明确具有置换不变性？",
          options: [
            "聚合（aggregate）步骤，因为邻居顺序不影响 sum/mean/max 结果。",
            "消息函数本身，因为它只依赖单一邻居。",
            "更新后的节点表示作为整体具有置换不变性。",
            "Readout 步骤是置换等变的。",
          ],
          correctIndex: 0,
          explanation: "聚合操作对邻居集合求和/均值/取最大，不依赖输入顺序，因此是置换不变的。",
        },
        {
          question: "若将图节点编号整体重新排列，节点级 GNN 表示应如何变化？",
          options: [
            "按相同顺序重排——置换等变。",
            "保持不变——置换不变。",
            "变为原来表示的逆序。",
            "随机打乱。",
          ],
          correctIndex: 0,
          explanation: "节点级输出随输入节点顺序一起变化，这种性质称为置换等变。",
        },
        {
          question: "GCN 可以看作消息传递框架的特例，其聚合方式最接近？",
          options: ["归一化邻居特征的平均", "注意力加权邻居特征", "仅取最近邻特征", "忽略边结构的全连接层"],
          correctIndex: 0,
          explanation: "GCN 用归一化邻接矩阵对邻居特征做加权平均，是消息传递中聚合函数的一种具体选择。",
        },
      ]}
      bishopMapping={{
        chapter: "Ch 13",
        section: "13.2",
        pages: "Ch 13",
        textbookSubsections: ["13.2.1 Message passing", "13.2.2 Message function", "13.2.3 Aggregate function", "13.2.4 Update function", "13.2.5 Graph convolutional networks"],
        formulas: ["消息函数 m_uv=φ(h_u,h_v,e_uv)", "聚合 a_v=⊕ m_uv", "GCN 更新"],
        algorithms: ["消息传递神经网络 MPNN", "图卷积网络 GCN"],
        exercises: ["用邻接矩阵手动推导一轮 GCN 更新。", "说明聚合函数为何是置换不变的。"],
      }}
      extraContent={<MessagePassingInvariantDemo />}
    />
  );
}
