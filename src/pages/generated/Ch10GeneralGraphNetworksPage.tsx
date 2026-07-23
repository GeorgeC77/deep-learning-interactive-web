import BishopSectionPage from '@/components/BishopSectionPage';
import GraphAttentionLab from '@/components/demos/GraphAttentionLab';
import { Hexagon } from 'lucide-react';

export default function Ch10GeneralGraphNetworksPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch10/general-graph-networks"
      heroIcon={<Hexagon className="w-9 h-9 text-blue-600" />}
      summary={"通用图网络同时更新节点、边与全局特征，扩展了消息传递框架；图注意力让邻居聚合权重可学习，几何深度学习则进一步要求模型尊重物理对称性。"}
      concepts={[
        {
          title: "边与全局更新",
          description: "不仅更新节点，也根据节点表示更新边嵌入和全局图级表示，适应更复杂任务。",
        },
        {
          title: "边嵌入",
          description: "为每条边学习向量表示，可编码边属性并支持边级预测任务，如分子键性质判断。",
        },
        {
          title: "图级嵌入",
          description: "通过聚合所有节点与边的信息得到图级向量，用于图分类、图性质预测等整图任务。",
        },
        {
          title: "图注意力网络 GAT",
          description: "为每个邻居学习自适应权重，避免 GCN 固定归一化的局限。α_uv 表示节点 v 聚合邻居 u 时的注意力权重，分母对 v 的所有邻居做 softmax。",
          formula: "\\alpha_{uv} = \\frac{\\exp(\\text{LeakyReLU}(\\mathbf{a}^{\\top}[W\\mathbf{h}_u \\| W\\mathbf{h}_v]))}{\\sum_{k\\in\\mathcal{N}(v)} \\exp(\\text{LeakyReLU}(\\mathbf{a}^{\\top}[W\\mathbf{h}_k \\| W\\mathbf{h}_v]))}",
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
        "能说明 GAT 与 GCN 在聚合权重上的区别，并写出注意力系数公式。",
        "认识过平滑问题及其缓解思路。",
      ]}
      coreIntuition={"通用图网络把图看作（节点、边、全局）三元组，消息在三者之间流动；GAT 让邻居权重可学习，几何深度学习则进一步要求模型尊重物理空间的对称性。"}
      commonMistakes={[
        "认为层数越深的 GNN 一定越好，忽略过平滑导致的表达能力下降。",
        "把 attention 权重当作可解释性的唯一依据，而不验证其稳定性。",
        "在需要几何等变的任务中使用普通 GNN，导致模型预测依赖坐标系选择。",
        "GAT 注意力系数公式的分母错误地以源节点而非中心节点做归一化。",
      ]}
      whyCards={[
        {
          question: "为什么 GAT 比 GCN 更灵活？",
          answer: "GCN 用固定的度归一化聚合邻居，GAT 为每个邻居学习自适应权重，能根据任务自动调整不同邻居的重要性。",
        },
        {
          question: "为什么 GNN 会过平滑？",
          answer: "多层消息传递会让所有节点的表示趋于一致，远距离节点难以区分。这就像反复搅拌咖啡，最终所有区域都变得相同。",
        },
      ]}
      counterexamples={[
        "增加 GNN 层数从 2 到 10，节点分类精度先升后降——说明过平滑不是理论问题而是实际障碍。",
        "在分子性质预测中使用普通 GNN，旋转分子坐标后预测结果改变——说明几何等变性对物理任务至关重要。",
      ]}
            bishopMapping={{
        chapter: "Ch 13",
        section: "13.3",
        pages: "Ch 13",
        textbookSubsections: [
          "13.3.4 Over-smoothing",
          "13.3.1 Graph attention networks",
          "13.3.2 Edge embeddings",
          "13.3.3 Graph embeddings",
          "13.3.5 Regularization",
          "13.3.6 Geometric deep learning",
        ],
        formulas: ["GAT attention coefficient \\alpha_{uv}"],
        algorithms: ["通用图网络 GN block", "GAT"],
        exercises: [
          "对比 GCN 与 GAT 在同一图上的聚合差异。",
          "分析增加 GNN 层数对节点分类精度的影响。",
        ],
      }}
      interactiveDemo={<GraphAttentionLab />}
    />
  );
}
