import BishopSectionPage from '@/components/BishopSectionPage';
import { SeparatorVertical } from 'lucide-react';

export default function Ch02DiscriminantFunctionsPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch02/discriminant-functions"
      heroIcon={<SeparatorVertical className="w-9 h-9 text-blue-600" />}
      summary={"判别函数直接为输入分配类别标签。二分类用单个函数符号划分空间，多分类用多个函数取最大值；最小二乘分类提供闭式解但对异常值敏感。"}
      concepts={[
        {
          title: "Two classes",
          description: "用单个实值函数 y(x) 的符号决定类别；决策面 y(x)=0 是输入空间中的超平面。",
          formula: String.raw`y(\mathbf{x}) = \mathbf{w}^{\!T}\mathbf{x} + w_0`,
        },
        {
          title: "Multiple classes",
          description: "为每个类别定义一个判别函数 y_k(x)，选择最大值对应的类别；需避免 one-vs-rest 产生的不可分类区域。",
          formula: String.raw`\mathcal{C}(\mathbf{x}) = \arg\max_k y_k(\mathbf{x})`,
        },
        {
          title: "1-of-K coding",
          description: "将类别标签编码为 K 维向量，其中一个分量为 1，其余为 0，便于用回归框架处理分类目标。",
        },
        {
          title: "Least squares for classification",
          description: "用最小二乘拟合 1-of-K 编码目标，可解析求解，但对异常值和类别不平衡缺乏鲁棒性。",
          formula: String.raw`\mathbf{W}_{\text{ML}} = (\boldsymbol{\Phi}^{\!T}\boldsymbol{\Phi})^{-1}\boldsymbol{\Phi}^{\!T}\mathbf{T}`,
        },
      ]}
      learningObjectives={[
        "能写出二分类与多类判别函数的形式。",
        "理解 1-of-K 编码与最小二乘分类的关系。",
        "能指出最小二乘分类的主要局限。",
      ]}
      coreIntuition={"判别函数像在输入空间里画边界：二分类画一条线，多分类画几块区域；最小二乘用尺子直接量出边界，但异常点会把它拉偏。"}
      commonMistakes={[
        "用二分类 one-vs-rest 组合处理多分类，导致出现不可分类或重叠区域。",
        "把最小二乘分类的输出直接当作概率，而不经过 sigmoid/softmax 校准。",
        "忽视最小二乘对异常值的敏感性，导致决策边界偏移。",
      ]}
      quiz={[
        {
          question: "多类判别函数 y_k(x) 的预测规则是什么？",
          options: [
            "选择使 y_k(x) 最大的类别 k。",
            "选择使 y_k(x) 最小的类别 k。",
            "选择第一个大于 0 的 y_k(x)。",
            "随机选择一个 y_k(x) 非零的类别。",
          ],
          correctIndex: 0,
          explanation: "多类判别函数取最大值对应的类别作为预测。",
        },
        {
          question: "1-of-K 编码的主要作用是什么？",
          options: [
            "把离散类别标签转化为向量，使分类问题能用回归框架求解。",
            "把输入特征映射到高维空间。",
            "计算后验概率。",
            "实现正则化。",
          ],
          correctIndex: 0,
          explanation: "1-of-K 编码让每个类别对应一个标准基向量，从而可用矩阵形式处理分类目标。",
        },
        {
          question: "最小二乘分类对异常值敏感的主要原因是什么？",
          options: [
            "平方误差会放大远离决策边界的样本影响。",
            "它使用了 softmax 输出。",
            "它假设后验概率精确已知。",
            "它不能处理多类问题。",
          ],
          correctIndex: 0,
          explanation: "平方损失对大的残差施加重罚，导致异常点显著拉动决策边界。",
        },
      ]}
      bishopMapping={{
        chapter: "Ch 5",
        section: "5.1",
        pages: "Ch 5",
        textbookSubsections: [
          "5.1 Discriminant Functions",
          "5.1.1 Two classes",
          "5.1.2 Multiple classes",
          "5.1.3 1-of-K coding",
          "5.1.4 Least squares for classification"
        ],
        formulas: ["linear discriminant", "least-squares classifier"],
        algorithms: ["one-vs-one", "one-vs-rest"],
        exercises: [
          "画出二分类线性判别函数的决策边界。",
          "说明 one-vs-rest 在多分类中可能产生不可分类区域。",
        ],
      }}
      demo={{
        title: "决策边界随权重变化",
        label: "偏置 w₀",
        param: 0,
        min: -3,
        max: 3,
        step: 0.1,
        compute: (w0) => ({
          label: '边界 x 截距',
          value: -w0,
          display: String.raw`x=-${w0.toFixed(1)}`,
        }),
        formula: String.raw`x = -w_0 / w_1`,
      }}
    />
  );
}
