import BishopSectionPage from '@/components/BishopSectionPage';
import { Hexagon } from 'lucide-react';

export default function Ch10GeneralGraphNetworksPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch10/general-graph-networks"
      heroIcon={<Hexagon className="w-9 h-9 text-blue-600" />}
      summary={"通用图网络同时更新节点、边与全局特征，扩展了消息传递框架；图注意力、几何深度学习等方向在表达能力与物理一致性上做了进一步改进。"}
      concepts={[
        {
          title: "边与全局更新",
          description: "不仅更新节点，也根据节点表示更新边嵌入和全局图级表示，适应更复杂任务。",
        },
        {
          title: "图注意力网络 GAT",
          description: "为每个邻居学习自适应权重，避免 GCN 固定归一化的局限。",
          formula: String.raw`\alpha_{uv} = \frac{\exp(\text{LeakyReLU}(\mathbf{a}^{\top}[W\mathbf{h}_u \| W\mathbf{h}_v]))}{\sum_{k\in\mathcal{N}(v)} \exp(\text{LeakyReLU}(\mathbf{a}^{\top}[W\mathbf{h}_u \| W\mathbf{h}_k]))}`,
        },
        {
          title: "过平滑问题",
          description: "深层 GNN 中节点表示趋于一致，导致远距离节点难以区分。",
        },
        {
          title: "几何深度学习",
          description: "在具有几何结构的数据上引入等变约束，如 E(n)-等变图神经网络。",
        },
      ]}
      learningObjectives={[
        "理解通用图网络中节点、边、全局三层更新的交互。",
        "能说明 GAT 与 GCN 在聚合权重上的区别。",
        "认识过平滑问题及其缓解思路。",
      ]}
      coreIntuition={"通用图网络把图看作（节点、边、全局）三元组，消息在三者之间流动；GAT 让邻居权重可学习，几何深度学习则进一步要求模型尊重物理空间的对称性。"}
      commonMistakes={[
        "认为层数越深的 GNN 一定越好，忽略过平滑导致的表达能力下降。",
        "把 attention 权重当作可解释性的唯一依据，而不验证其稳定性。",
        "在需要几何等变的任务中使用普通 GNN，导致模型预测依赖坐标系选择。",
      ]}
      quiz={[
        {
          question: "GAT 与 GCN 在聚合邻居时的主要区别是？",
          options: [
            "GAT 通过学习注意力系数自适应加权邻居，GCN 使用固定归一化权重。",
            "GAT 不能处理无向图，GCN 可以。",
            "GCN 使用注意力，GAT 使用均值聚合。",
            "两者在数学上完全相同。",
          ],
          correctIndex: 0,
          explanation: "GAT 的核心是用可学习的注意力权重替代 GCN 中由度矩阵固定的归一化权重。",
        },
        {
          question: "过平滑问题通常表现为？",
          options: [
            "深层网络中不同节点的表示变得非常相似。",
            "训练损失无法下降。",
            "模型对训练集过拟合。",
            "图注意力权重全部变为 0。",
          ],
          correctIndex: 0,
          explanation: "过平滑指随着层数增加，节点表示差异被平均掉，导致节点分类性能下降。",
        },
        {
          question: "在预测分子能量时，若要求模型对分子的旋转和平移保持不变，应使用？",
          options: ["几何等变/不变图神经网络", "普通 GCN", "纯 MLP", "RNN"],
          correctIndex: 0,
          explanation: "分子能量是物理标量，不应随坐标系旋转/平移变化；几何深度学习通过等变约束保证这一点。",
        },
      ]}
      bishopMapping={{
        chapter: "Ch 13",
        section: "13.3",
        pages: "Ch 13",
        textbookSubsections: [
          "13.3.4 Over-smoothing"
        ],
        formulas: ["GAT 注意力系数 α_uv"],
        algorithms: ["通用图网络 GN block", "GAT"],
        exercises: ["对比 GCN 与 GAT 在同一图上的聚合差异。", "分析增加 GNN 层数对节点分类精度的影响。"],
      }}
    />
  );
}
