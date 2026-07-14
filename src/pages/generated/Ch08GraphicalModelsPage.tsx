import BishopSectionPage from '@/components/BishopSectionPage';
import GraphFactorizationLab from '@/components/demos/GraphFactorizationLab';
import { GitBranch } from 'lucide-react';

export default function Ch08GraphicalModelsPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch08/graphical-models"
      heroIcon={<GitBranch className="w-9 h-9 text-blue-600" />}
      summary={"图模型用节点表示随机变量、有向边表示给定父节点后的直接概率依赖；联合分布按 DAG 结构因子分解，并隐含着可通过 d-分离读取的条件独立性。"}
      concepts={[
        {
          title: "有向无环图（DAG）",
          description: "节点表示随机变量，有向边表示给定父节点后的直接概率依赖；图必须无环以保证因子分解有效。",
        },
        {
          title: "贝叶斯网络",
          description: "每个节点给定其父节点的条件概率相乘，得到所有变量的联合分布。这一分解适用于任意有向无环图，不仅限于链式结构。",
          formula: "p(\\mathbf{x}) = \\prod_{i} p(x_i \\mid \\text{pa}_i)",
        },
        {
          title: "因子分解与拓扑序",
          description: "按 DAG 的拓扑顺序写出条件概率乘积；每个节点只以其父节点为条件，体现局部因果关系。",
        },
        {
          title: "离散变量",
          description: "离散节点常用条件概率表（CPT）表示局部条件分布；父节点组合数随入度指数增长。",
        },
        {
          title: "高斯变量",
          description: "连续节点可用线性高斯模型表示；父节点对子节点的均值线性影响，方差由条件方差参数控制。",
        },
        {
          title: "参数与观测（Plate 表示）",
          description: "用 plate 框表示重复观测，参数节点与数据节点共同决定似然函数，便于推断参数后验。",
        },
        {
          title: "贝叶斯定理在图中的应用",
          description: "观测某些节点后，依赖关系沿活跃路径传播并更新其他节点的后验分布；d-分离决定哪些更新为零。",
        },
      ]}
      learningObjectives={[
        "理解贝叶斯网络的一般因子分解形式。",
        "能为一组给定的 DAG 写出联合分布的因子分解。",
        "区分一般 DAG 分解与一阶马尔可夫链分解。",
      ]}
      coreIntuition={"有向边编码‘给定父节点后的直接依赖’，整个图给出联合分布的因式分解；删除一条边就去掉一个条件变量。"}
      commonMistakes={[
        "把有向边直接解释为因果关系。",
        "将一阶马尔可夫链的分解 p(x_1)∏p(x_i|x_{i-1}) 误当成一般 DAG 分解。",
        "忽略因子分解与 d-分离之间的等价性。",
      ]}
      quiz={[
        {
          question: "对于 DAG X1 → X2 ← X3，其联合分布的正确分解是？",
          options: [
            "p(x1)p(x2|x1)p(x3|x2)",
            "p(x1)p(x3)p(x2|x1,x3)",
            "p(x1)p(x2|x1)p(x3|x1)",
            "p(x1,x2,x3) 无法分解",
          ],
          correctIndex: 1,
          explanation: "X1 和 X3 没有父节点；X2 的父节点是 {X1, X3}，因此 p(x)=p(x1)p(x3)p(x2|x1,x3)。",
        },
        {
          question: "一般贝叶斯网络的因子分解适用于什么情况？",
          options: [
            "任意有向无环图",
            "只能用于链式结构",
            "只能用于树结构",
            "只能用于高斯变量",
          ],
          correctIndex: 0,
          explanation: "p(x)=∏p(x_i|pa_i) 对任何有向无环图都成立；链式只是特例。",
        },
        {
          question: "如果删除 DAG 中一条 X → Y 的边，联合分布会怎样变化？",
          options: [
            "p(x) 不再可分解",
            "Y 的条件概率中不再以 X 为条件",
            "所有变量变得独立",
            "必须重新估计所有参数",
          ],
          correctIndex: 1,
          explanation: "删除边意味着 X 不再是 Y 的父节点，因此 Y 的局部条件概率不再包含 X。",
        },
      ]}
      bishopMapping={{
        chapter: "Ch 11",
        section: "11.1",
        pages: "Ch 11",
        textbookSubsections: [
          "11.1 Graphical Models",
          "11.1.1 Directed graphs",
          "11.1.2 Factorization",
          "11.1.3 Discrete variables",
          "11.1.4 Gaussian variables",
          "11.1.5 Binary classifier",
          "11.1.6 Parameters and observations",
          "11.1.7 Bayes' theorem",
        ],
        formulas: ["p(x)=\\prod_i p(x_i|pa_i)"],
        exercises: [
          "为给定的三节点 DAG 写出联合分布因子分解。",
          "比较链式结构与 V 结构的分解差异。",
          "说明删除一条边对因子分解的影响。",
        ],
      }}
      interactiveDemo={<GraphFactorizationLab />}
    />
  );
}
