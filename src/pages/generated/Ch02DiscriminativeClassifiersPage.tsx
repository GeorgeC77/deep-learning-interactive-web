import BishopSectionPage from '@/components/BishopSectionPage';
import LinkFunctionLab from '@/components/demos/LinkFunctionLab';
import LogisticDecisionBoundaryDemo from '@/components/demos/LogisticDecisionBoundaryDemo';
import { Activity } from 'lucide-react';

export default function Ch02DiscriminativeClassifiersPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch02/discriminative-classifiers"
      heroIcon={<Activity className="w-9 h-9 text-blue-600" />}
      summary={
        "判别分类器直接建模后验概率 p(C_k|x)，跳过对输入分布 p(x) 的建模。逻辑回归（sigmoid）是二分类的经典方法，softmax 回归将其推广到多分类。本节还涵盖 probit 回归与规范链接函数，覆盖 §5.4.1–5.4.6，是深度学习分类器的理论基础。"
      }
      concepts={[
        {
          title: "激活函数（Activation functions）",
          description: "将线性输出 a = wᵀϕ(x) 映射到概率空间。sigmoid σ(a) = 1/(1+e⁻ᵃ) 是 log-odds 的逆函数；softmax 是 sigmoid 的多类推广。关键性质：单调、可微、输出 (0,1) 或和为 1 的概率向量。",
          formula: String.raw`\text{sigmoid: } \sigma(a) = \frac{1}{1+e^{-a}},\quad \text{softmax: } \frac{e^{a_k}}{\sum_j e^{a_j}}`,
        },
        {
          title: "固定基函数（Fixed basis functions）",
          description: "与回归相同，可先用非线性基函数 ϕ(x) 将输入变换到特征空间，再在此空间上学习线性判别。这使得即使是线性分类器也能解决非线性分类问题——前提是基函数设计恰当。",
        },
        {
          title: "逻辑回归（Logistic regression）",
          description: "二分类：p(C₁|x) = σ(wᵀϕ(x))。通过最大化伯努利似然（等价于最小化交叉熵损失）估计 w。损失是凸的，可用梯度下降或 Newton-Raphson 优化。log-odds（对数几率）是 x 的线性函数。",
          formula: String.raw`p(\mathcal{C}_1 \mid \mathbf{x}) = \sigma(\mathbf{w}^{\!T}\boldsymbol{\phi}(\mathbf{x})),\quad \ln\frac{p(\mathcal{C}_1)}{p(\mathcal{C}_2)} = \mathbf{w}^{\!T}\boldsymbol{\phi}(\mathbf{x})`,
        },
        {
          title: "多类逻辑回归（Softmax regression）",
          description: "K 类时，第 k 类的后验 p(C_k|x) = exp(a_k)/Σ_j exp(a_j)，其中 a_k = w_kᵀϕ(x)。交叉熵损失 L = −Σ_{n,k} t_{nk}·ln p(C_k|x_n) 对每组权重独立可导。最终决策边界分段线性。",
          formula: String.raw`p(\mathcal{C}_k \mid \mathbf{x}) = \frac{\exp(a_k)}{\sum_j \exp(a_j)},\quad a_k = \mathbf{w}_k^{\!T}\boldsymbol{\phi}(\mathbf{x})`,
        },
        {
          title: "Probit 回归",
          description: "用标准正态累积分布函数 Φ(a) 代替 sigmoid，源自潜在变量阈值模型。probit 与 logit 的预测概率形状相似，但 score（对数似然对 a 的梯度）行为不同：对于远离真实标签的异常点，probit 的梯度幅度大致随 |a| 增长，而 logistic 的梯度有界。因此不能仅凭概率尾部更薄就认为 probit 更鲁棒。",
          formula: String.raw`p(\mathcal{C}_1 \mid \mathbf{x}) = \Phi(a) = \int_{-\infty}^{a} \mathcal{N}(z \mid 0, 1) \, dz`,
        },
        {
          title: "规范链接函数（Canonical link functions）",
          description: "在广义线性模型（GLM）中，规范链接函数将自然参数 η 与线性预测器连接。对于伯努利分布，规范链接是 logit（对应逻辑回归）；对正态分布，规范链接是恒等（对应线性回归）。使用规范链接可保证似然的凸性。",
        },
      ]}
      learningObjectives={[
        "理解 sigmoid 函数作为 log-odds 逆函数的概率解释",
        "能写出逻辑回归的似然函数和交叉熵损失",
        "推导逻辑回归的梯度下降更新式",
        "理解 softmax 如何确保多类后验非负且和为 1",
        "对比 probit 与 logistic 在 score（梯度）行为上的差异，而非仅比较概率尾部",
        "了解规范链接函数在 GLM 框架中的作用",
      ]}
      coreIntuition={
        "判别分类器直接回答'这条线怎么画'的问题。sigmoid 说'在线的这边，你是正类的概率是 70%'；softmax 说'在这片区域里，你是三类中最有可能是第二类的那 55%'。它们把所有精力都放在决策边界附近，不浪费参数去建模不相干的 x。"
      }
      commonMistakes={[
        "把逻辑回归的线性输出 a = wᵀx 直接当作概率——必须经过 sigmoid 映射到 (0,1)",
        "在多分类中用 K 个独立的二分类 sigmoid 代替 softmax——概率和不等于 1，模型之间无法比较",
        "忽视特征缩放对梯度下降收敛的影响——逻辑回归的 loss landscape 对尺度敏感",
        "在类别完全线性可分时不加正则化——最大似然会使权重发散到无穷大（'完美分离问题'），需要加 L2 正则化",
        "混淆 probit 和 logit——probit 使用正态 CDF，logit 使用 sigmoid；更关键的是，极端误分类时 probit 的 score 可能更大",
        "仅凭概率尾部更薄就断言 probit 更鲁棒：鲁棒性取决于 score 是否有界，而不是尾部衰减速度",
      ]}
      quiz={[
        {
          question: "逻辑回归中，log-odds ln[p(C₁)/p(C₂)] 与输入 x 的关系是什么？",
          options: [
            "x 的线性函数",
            "x 的 sigmoid 函数",
            "x 的二次函数",
            "与 x 无关的常数",
          ],
          correctIndex: 0,
          explanation: "p(C₁) = σ(wᵀx) ⇒ logit = ln[σ/(1−σ)] = wᵀx，即 log-odds 是 x 的线性函数，这是逻辑回归得名'回归'的原因。",
        },
        {
          question: "softmax(a_k) 的分母 Σ_j exp(a_j) 的作用是什么？",
          options: [
            "确保所有输出非负且总和为 1，形成有效的概率分布",
            "加速计算",
            "防止过拟合",
            "消除特征间的相关性",
          ],
          correctIndex: 0,
          explanation: "exp 确保非负，除以总和确保归一化——这就是 softmax 作为概率映射的核心机制。",
        },
        {
          question: "在多类分类中，以下哪个损失函数是正确且凸的？",
          options: [
            "交叉熵损失：−Σ_k t_k·ln(softmax(a_k))",
            "平方误差：Σ_k (t_k − a_k)²",
            "hinge 损失：Σ_k max(0, 1 − a_k)",
            "绝对值误差：Σ_k |t_k − a_k|",
          ],
          correctIndex: 0,
          explanation: "与 softmax 配合的交叉熵损失是凸的且导数为 softmax(a_k) − t_k，形式简洁优雅。平方误差配合 softmax 是非凸的。",
        },
      ]}
      bishopMapping={{
        chapter: "Ch 5",
        section: "5.4",
        pages: "§5.4, pp. 157–166",
        textbookSubsections: [
          "5.4 Discriminative Classifiers",
          "5.4.1 Activation functions",
          "5.4.2 Fixed basis functions",
          "5.4.3 Logistic regression",
          "5.4.4 Multi-class logistic regression",
          "5.4.5 Probit regression",
          "5.4.6 Canonical link functions",
        ],
        formulas: [
          "sigmoid σ(a)",
          "softmax",
          "cross-entropy loss",
          "probit Φ(a)",
          "canonical link (GLM)",
        ],
        algorithms: [
          "logistic regression",
          "softmax regression",
          "gradient descent",
          "Newton-Raphson",
        ],
        exercises: [
          "推导逻辑回归的梯度下降更新式并与线性回归的对比",
          "实现 softmax 多分类并可视化决策边界",
          "在含异常值的数据上比较逻辑回归和 probit 的 score 行为",
        ],
      }}
      interactiveDemo={<LinkFunctionLab />}
      extraContent={<LogisticDecisionBoundaryDemo />}
    />
  );
}
