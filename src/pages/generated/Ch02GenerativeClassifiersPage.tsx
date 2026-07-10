import BishopSectionPage from '@/components/BishopSectionPage';
import { BrainCircuit } from 'lucide-react';

export default function Ch02GenerativeClassifiersPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch02/generative-classifiers"
      heroIcon={<BrainCircuit className="w-9 h-9 text-blue-600" />}
      summary={
        "生成分类器先建模联合分布 p(x, C_k) = p(x|C_k)·p(C_k)，再用贝叶斯定理推导后验 p(C_k|x)。这与判别分类器（直接建模后验）形成互补——生成模型在数据少时更稳健，且能检测异常样本。本节覆盖连续输入 (Gaussian)、离散特征 (朴素贝叶斯) 与指数族统一框架 (§5.3.1–5.3.4)。"
      }
      concepts={[
        {
          title: "贝叶斯分类框架",
          description: "基本流程：估计先验 p(C_k)（各类样本比例），为每个类别建模类条件密度 p(x|C_k)，用贝叶斯定理输出后验 p(C_k|x) ∝ p(x|C_k)·p(C_k)。",
          formula: String.raw`p(\mathcal{C}_k \mid \mathbf{x}) = \frac{p(\mathbf{x} \mid \mathcal{C}_k) \, p(\mathcal{C}_k)}{\sum_j p(\mathbf{x} \mid \mathcal{C}_j) \, p(\mathcal{C}_j)}`,
        },
        {
          title: "连续输入：高斯类条件密度",
          description: "假设每类的 p(x|C_k) = N(x|μ_k, Σ_k)。若各类共享协方差 Σ_k = Σ，后验的 log-odds 是 x 的线性函数 → 线性决策边界。若 Σ_k 不共享，决策边界变为二次。",
          formula: String.raw`p(\mathbf{x} \mid \mathcal{C}_k) = \mathcal{N}(\mathbf{x} \mid \boldsymbol{\mu}_k, \boldsymbol{\Sigma}_k)`,
        },
        {
          title: "最大似然解",
          description: "对每个类别分别最大化似然 Σ_{n∈C_k} ln p(x_n|C_k)。均值估计为类内样本均值，共享协方差为加权池化协方差。先验为各类样本比例。",
          formula: String.raw`\boldsymbol{\mu}_k = \frac{1}{N_k}\sum_{n \in \mathcal{C}_k} \mathbf{x}_n,\quad \boldsymbol{\Sigma} = \frac{1}{N}\sum_{k=1}^{K}\sum_{n \in \mathcal{C}_k} (\mathbf{x}_n - \boldsymbol{\mu}_k)(\mathbf{x}_n - \boldsymbol{\mu}_k)^{\!T}`,
        },
        {
          title: "离散特征：朴素贝叶斯",
          description: "当特征是离散变量时（如词汇、类别属性），朴素贝叶斯假设特征之间条件独立——已知类别后各特征独立。这一'朴素'假设使联合概率 p(x|C_k) 可分解为各特征概率的乘积，大幅减少参数。",
          formula: String.raw`p(\mathbf{x} \mid \mathcal{C}_k) = \prod_{i=1}^{D} p(x_i \mid \mathcal{C}_k)`,
        },
        {
          title: "指数族（Exponential family）",
          description: "高斯、伯努利、多项分布等都属于指数族 p(x|η) = h(x)·g(η)·exp(ηᵀu(x))。在指数族框架下，类条件密度建模具有统一的最大似然解形式和充分统计量结构。",
        },
      ]}
      learningObjectives={[
        "写出贝叶斯定理在分类问题中的应用，理解先验·似然 → 后验的流程",
        "推导共享协方差高斯假设下决策边界为线性的原因",
        "能写出最大似然估计的类内均值与池化协方差公式",
        "理解朴素贝叶斯的条件独立性假设及其带来的参数简化",
        "对比生成模型与判别模型在不同数据量下的优劣",
      ]}
      coreIntuition={
        "生成分类器像为每个类别画一幅'典型肖像'（类条件分布），然后比较新样本更像哪类的'成员'。因为建模了完整的 x 的分布，它不仅能分类，还能说'这个人不像任何一类，可能是陌生的'。"
      }
      commonMistakes={[
        "强制共享协方差矩阵导致线性决策边界，无法分离'环状'等非线性可分类数据",
        "在朴素贝叶斯中忽视特征相关性——如文本中 'machine' 和 'learning' 经常共现，独立性假设低估了这一组合的证据强度",
        "把生成模型的后验概率当作校准好的置信度——如果类条件假设不成立（如高斯近似 multimodal 分布），后验可能严重失真",
        "认为生成模型总是比判别模型差——数据量少时，生成模型的额外结构假设反而带来更稳定的估计",
      ]}
      quiz={[
        {
          question: "共享协方差 Σ 的高斯分类器（LDA）的决策边界是什么形状？",
          options: ["线性（超平面）", "二次曲线", "圆形", "任意形状"],
          correctIndex: 0,
          explanation: "log p(C_k|x) 中 xᵀΣ⁻¹x 项对各类相同，相消后只剩下 μ_kᵀΣ⁻¹x 等线性项。",
        },
        {
          question: "朴素贝叶斯中 '朴素' 指的是什么？",
          options: [
            "假设给定类别后，各特征条件独立",
            "假设所有类别先验相等",
            "假设数据没有噪声",
            "假设特征必须离散",
          ],
          correctIndex: 0,
          explanation: "条件独立假设使 p(x|C_k) = ∏_i p(x_i|C_k)，避免了 D 维联合分布的直接估计。",
        },
        {
          question: "以下哪种情况更适合使用生成分类器而非判别分类器？",
          options: [
            "训练数据很少，但类条件分布有较好的先验知识可以建模",
            "有海量标注数据，只追求最高准确率",
            "特征全是连续实数",
            "只关心决策，不关心概率",
          ],
          correctIndex: 0,
          explanation: "生成模型的额外结构（类条件分布形式）在小样本时提供了有益的正则化。数据海量时判别模型通常更优。",
        },
        {
          question: "生成模型的一个判别模型没有的优势是？",
          options: [
            "能检测异常样本（低 p(x)），并能生成新样本",
            "决策边界更复杂",
            "不需要概率计算",
            "一定比判别模型准确率高",
          ],
          correctIndex: 0,
          explanation: "因为生成模型建模了 p(x) = Σ_k p(x|C_k)p(C_k)，可以判断一个输入是否来自训练分布。",
        },
      ]}
      bishopMapping={{
        chapter: "Ch 5",
        section: "5.3",
        pages: "§5.3, pp. 150–157",
        textbookSubsections: [
          "5.3 Generative Classifiers",
          "5.3.1 Continuous inputs",
          "5.3.2 Maximum likelihood solution",
          "5.3.3 Discrete features",
          "5.3.4 Exponential family",
        ],
        formulas: ["Bayes theorem p(C_k|x)", "Gaussian class-conditional", "Naive Bayes"],
        algorithms: ["LDA (shared Σ)", "QDA (separate Σ)", "Naive Bayes"],
        exercises: [
          "在二维数据上分别拟合 LDA 和 QDA，观察决策边界的区别",
          "用朴素贝叶斯做文本分类（如垃圾邮件检测）",
          "推导共享协方差假设下 log-odds 为线性的证明",
        ],
      }}
    />
  );
}
