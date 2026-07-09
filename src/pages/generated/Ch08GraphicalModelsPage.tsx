import BishopSectionPage from '@/components/BishopSectionPage';
import { GitBranch } from 'lucide-react';

export default function Ch08GraphicalModelsPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch08/graphical-models"
      heroIcon={<GitBranch className="w-9 h-9 text-blue-600" />}
      summary={"图模型用节点表示随机变量、边表示依赖；有向图的因子分解直观编码变量间的生成关系。"}
      concepts={[
    {
      title: "贝叶斯网络",
      description: "每个节点给定父节点的条件概率相乘得到联合分布。",
      formula: String.raw`p(\mathbf{x}) = \prod_{i} p(x_i \mid \text{pa}_i)`,
    },
    {
      title: "离散与高斯变量",
      description: "条件概率表适合离散变量，线性高斯模型适合连续变量。",
    },
    {
      title: "贝叶斯定理在图中的应用",
      description: "观测某些节点后，依赖关系沿活跃路径传播并更新其他节点后验。",
    }
      ]}
      learningObjectives={[
      "理解 贝叶斯网络 的含义与作用。",
      "理解 离散与高斯变量 的含义与作用。",
      "理解 贝叶斯定理在图中的应用 的含义与作用。"
    ]}
      coreIntuition={"图模型用节点表示随机变量、边表示依赖；有向图的因子分解直观编码变量间的生成关系。"}
      commonMistakes={[
      "混淆本节核心概念与相邻小节的前提假设，导致错误套用。",
      "只记忆公式形式，而不验证其成立条件与具体数值。"
    ]}
      quiz={[
      {
        question: "下列关于“贝叶斯网络”的叙述，哪一项最准确？",
        options: ["每个节点给定父节点的条件概率相乘得到联合分布。", "贝叶斯网络 只是术语，没有独立建模意义。", "贝叶斯网络 不需要任何分布假设即可直接使用。"],
        correctIndex: 0,
        explanation: "正确。每个节点给定父节点的条件概率相乘得到联合分布。 这体现了本节的核心思想。",
      },
      {
        question: "在应用“离散与高斯变量”时，下列哪种做法最危险？",
        options: ["忽视其前提假设，直接套用到不适用的数据分布上。", "只要模型足够复杂，数据分布的形状就不重要。", "该方法只适用于连续变量，离散变量完全无法使用。"],
        correctIndex: 0,
        explanation: "正确。离散与高斯变量 的有效性依赖于特定假设，忽略前提会导致错误结论。",
      },
      {
        question: "在一个具体情境中，你发现“贝叶斯定理在图中的应用”的结果违背直觉，应优先排查哪些前提假设？",
        options: ["是否违反了该方法成立的前提条件或数据假设。", "直觉一定是错的，直接接受计算结果。", "一定是代码实现出错，与理论无关。"],
        correctIndex: 0,
        explanation: "正确。贝叶斯定理在图中的应用 的可靠性取决于前提假设是否满足；违反假设时结果可能反直觉但合理。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 11",
      section: "11.1",
      pages: "Ch 11",
      textbookSubsections: [
          "11.1 Graphical Models"
        ],
      formulas: ["贝叶斯网络公式"],
      exercises: ["推导本节核心公式的展开形式并说明每个符号含义。", "用一个小例子验证本节概念或数值结论。", "对比本节结论与先前章节结论的适用条件差异。"]
    }}
          demo={{
      title: "链式联合分布分解",
      label: "变量数 N",
      param: 4,
      min: 2,
      max: 10,
      step: 1,
      compute: (N) => ({
        label: '链式条件概率项数',
        value: N,
        display: String.raw`p(x_1)\prod_{i=2}^{${N.toFixed(0)}}p(x_i|x_{i-1})`,
      }),
      formula: String.raw`p(\mathbf{x}) = p(x_1) \prod_{i=2}^{N} p(x_i \mid x_{i-1})`,
    }}
    />
  );
}
