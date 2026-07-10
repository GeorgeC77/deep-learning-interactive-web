import BishopSectionPage from '@/components/BishopSectionPage';
import { Activity } from 'lucide-react';

export default function Ch02DiscriminativeClassifiersPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch02/discriminative-classifiers"
      heroIcon={<Activity className="w-9 h-9 text-blue-600" />}
      summary={"判别分类器直接建模后验概率。激活函数把线性输出映射到概率；逻辑回归与多类逻辑回归通过最大似然估计参数，probit 与典则联系函数提供不同选择。"}
      concepts={[
        {
          title: "Activation functions",
          description: "把线性组合映射到概率或类别的非线性函数，如 sigmoid、tanh、ReLU 等。",
          formula: String.raw`\sigma(a) = \frac{1}{1 + \exp(-a)}`,
        },
        {
          title: "Fixed basis functions",
          description: "与回归类似，可先对输入做非线性变换，再在线性特征空间上构建分类器。",
        },
        {
          title: "Logistic regression",
          description: "用 sigmoid 建模二分类后验，通过交叉熵损失进行最大似然估计。",
          formula: String.raw`p(\mathcal{C}_1 \mid \mathbf{x}) = \sigma(\mathbf{w}^{\!T}\boldsymbol{\phi}(\mathbf{x}))`,
        },
        {
          title: "Multi-class logistic regression",
          description: "用 softmax 函数把 K 个线性输出归一化为类别后验概率。",
          formula: String.raw`p(\mathcal{C}_k \mid \mathbf{x}) = \frac{\exp(a_k)}{\sum_j \exp(a_j)}`,
        },
        {
          title: "Probit regression",
          description: "用标准正态累积分布函数代替 sigmoid 建模后验，对异常值更鲁棒。",
          formula: String.raw`p(\mathcal{C}_1 \mid \mathbf{x}) = \Phi(a)`,
        },
        {
          title: "Canonical link functions",
          description: "广义线性模型中连接期望响应与线性预测器的函数，使推断与优化具有良好性质。",
        },
      ]}
      learningObjectives={[
        "理解 sigmoid 与 softmax 如何把实数输出转化为概率。",
        "能写出逻辑回归的似然函数与交叉熵损失。",
        "了解 probit 回归与逻辑回归的区别。",
      ]}
      coreIntuition={"判别分类器直接学习‘这条边界该怎么画’：sigmoid 给出二分类边界一侧的概率，softmax 把多条边界竞争结果归一化。"}
      commonMistakes={[
        "把逻辑回归的线性输出直接当作概率而不经过 sigmoid。",
        "在多分类中使用多个二分类 sigmoid 代替 softmax，导致概率和不为一。",
        "忽视特征尺度对梯度下降收敛的影响。",
      ]}
      quiz={[
        {
          question: "逻辑回归中，后验概率 p(C₁|x) 与线性输出 a 的关系是？",
          options: [
            "p(C₁|x) = σ(a)",
            "p(C₁|x) = a",
            "p(C₁|x) = exp(a)",
            "p(C₁|x) = 1 - a",
          ],
          correctIndex: 0,
          explanation: "sigmoid 把任意实数映射到 (0,1)，作为正类的后验概率。",
        },
        {
          question: "softmax 函数的主要作用是什么？",
          options: [
            "把 K 个实数输出归一化为和为 1 的类别概率。",
            "把概率映射到任意实数。",
            "计算两个分布的 KL 散度。",
            "替代损失函数。",
          ],
          correctIndex: 0,
          explanation: "softmax 取指数后归一化，确保多类后验概率非负且总和为 1。",
        },
        {
          question: "probit 回归与逻辑回归的主要区别在哪里？",
          options: [
            "probit 使用正态 CDF，逻辑回归使用 sigmoid。",
            "probit 只能处理二分类，逻辑回归只能处理多分类。",
            "probit 不需要最大似然估计。",
            "probit 使用平方损失。",
          ],
          correctIndex: 0,
          explanation: "两者都是把线性输出映射到概率，但使用的连接函数不同：probit 用 Φ，逻辑回归用 σ。",
        },
      ]}
      bishopMapping={{
        chapter: "Ch 5",
        section: "5.4",
        pages: "Ch 5",
        textbookSubsections: [
          "5.4 Discriminative Classifiers",
          "5.4.1 Activation functions",
          "5.4.2 Fixed basis functions",
          "5.4.3 Logistic regression",
          "5.4.4 Multi-class logistic regression",
          "5.4.5 Probit regression",
          "5.4.6 Canonical link functions"
        ],
        formulas: ["sigmoid", "softmax", "cross-entropy"],
        algorithms: ["logistic regression", "softmax regression"],
        exercises: [
          "推导逻辑回归的梯度下降更新式。",
          "用 softmax 实现多类分类并观察决策边界。",
        ],
      }}
    />
  );
}
