import BishopSectionPage from '@/components/BishopSectionPage';
import { BrainCircuit } from 'lucide-react';

export default function Ch02GenerativeClassifiersPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch02/generative-classifiers"
      heroIcon={<BrainCircuit className="w-9 h-9 text-blue-600" />}
      summary={"生成分类器为每个类别建模类条件分布 p(x|C_k) 与先验 p(C_k)，再用贝叶斯定理得到后验。连续输入常用高斯密度，离散特征常用朴素贝叶斯。"}
      concepts={[
        {
          title: "Continuous inputs",
          description: "假设类条件密度为高斯分布，均值与协方差由各类数据估计；协方差共享时得到线性决策边界。",
        },
        {
          title: "Maximum likelihood solution",
          description: "对每个类别分别最大化似然，得到类条件均值与协方差矩阵的最大似然估计。",
          formula: String.raw`\boldsymbol{\mu}_k = \frac{1}{N_k}\sum_{n \in \mathcal{C}_k} \mathbf{x}_n`,
        },
        {
          title: "Discrete features",
          description: "对离散属性建模条件概率；朴素贝叶斯假设特征条件独立，极大简化估计。",
          formula: String.raw`p(\mathbf{x} \mid \mathcal{C}_k) = \prod_{i=1}^{D} p(x_i \mid \mathcal{C}_k)`,
        },
        {
          title: "Exponential family",
          description: "包括高斯、伯努利等多种分布的统一形式，许多生成分类器可纳入此框架。",
        },
      ]}
      learningObjectives={[
        "能写出贝叶斯定理在分类中的应用形式。",
        "理解高斯类条件密度下参数的最大似然估计。",
        "了解朴素贝叶斯对离散特征的处理方式及其独立性假设。",
      ]}
      coreIntuition={"生成分类器像先为每个类别画一幅‘典型画像’（类条件分布），看到新样本时比较它更像哪一类；画像越准，分类越稳。"}
      commonMistakes={[
        "假设协方差矩阵必须共享，导致非线性可分数据时边界受限。",
        "忽视朴素贝叶斯的特征独立性假设，在强相关特征上估计失真。",
        "把生成分类器的后验直接当作置信度，而不考虑模型假设是否成立。",
      ]}
      quiz={[
        {
          question: "生成分类器与判别分类器的主要建模对象分别是？",
          options: [
            "p(x|C_k)p(C_k) 与 p(C_k|x)",
            "p(C_k|x) 与 p(x|C_k)",
            "p(x) 与 p(C_k)",
            "损失函数与决策边界",
          ],
          correctIndex: 0,
          explanation: "生成分类器建模输入与类别的联合分布，判别分类器直接建模后验。",
        },
        {
          question: "在高斯类条件密度且共享协方差矩阵时，决策边界是什么形状？",
          options: ["线性", "二次曲线", "圆形", "阶梯状"],
          correctIndex: 0,
          explanation: "共享协方差时二次项相消，后验的对数比为线性函数，因此决策边界是超平面。",
        },
        {
          question: "朴素贝叶斯的核心假设是什么？",
          options: [
            "在给定类别条件下，各特征相互独立。",
            "所有类别先验概率相等。",
            "特征必须服从高斯分布。",
            "决策边界是线性的。",
          ],
          correctIndex: 0,
          explanation: "朴素贝条件独立性假设使联合条件概率可分解为各特征条件概率的乘积。",
        },
      ]}
      bishopMapping={{
        chapter: "Ch 5",
        section: "5.3",
        pages: "Ch 5",
        textbookSubsections: [
          "5.3 Generative Classifiers",
          "5.3.1 Continuous inputs",
          "5.3.2 Maximum likelihood solution",
          "5.3.3 Discrete features",
          "5.3.4 Exponential family"
        ],
        formulas: ["Bayes theorem", "Gaussian class-conditional", "naive Bayes"],
        exercises: [
          "对二维数据估计两类高斯类条件密度并画出决策边界。",
          "用朴素贝叶斯处理离散特征分类问题。",
        ],
      }}
    />
  );
}
