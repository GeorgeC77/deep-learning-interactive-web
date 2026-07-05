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
      "混淆相关概念的定义与适用场景。",
      "只记忆公式而忽略其背后的概率或优化假设。"
    ]}
      quiz={[
      {
        question: "关于“贝叶斯网络”，下列说法是否正确？",
        options: ["每个节点给定父节点的条件概率相乘得到联合分布。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。每个节点给定父节点的条件概率相乘得到联合分布。",
      },
      {
        question: "关于“离散与高斯变量”，下列说法是否正确？",
        options: ["条件概率表适合离散变量，线性高斯模型适合连续变量。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。条件概率表适合离散变量，线性高斯模型适合连续变量。",
      },
      {
        question: "关于“贝叶斯定理在图中的应用”，下列说法是否正确？",
        options: ["观测某些节点后，依赖关系沿活跃路径传播并更新其他节点后验。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。观测某些节点后，依赖关系沿活跃路径传播并更新其他节点后验。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 11",
      section: "",
      pages: "",
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
