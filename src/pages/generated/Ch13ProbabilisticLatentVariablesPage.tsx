import BishopSectionPage from '@/components/BishopSectionPage';
import { GitBranch } from 'lucide-react';

export default function Ch13ProbabilisticLatentVariablesPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch13/probabilistic-latent-variables"
      heroIcon={<GitBranch className="w-9 h-9 text-blue-600" />}
      summary={"概率隐变量模型显式定义隐变量先验 p(z) 与条件似然 p(x|z)，通过边缘化得到观测分布。EM 算法是估计这类模型参数的核心工具。"}
      concepts={[
        {
          title: "生成模型",
          description: "观测数据由隐变量经概率变换生成，边缘分布通过对隐变量积分得到。",
          formula: String.raw`p(\mathbf{x}) = \int p(\mathbf{x} \mid \mathbf{z}) \, p(\mathbf{z}) \, d\mathbf{z}`,
        },
        {
          title: "似然函数",
          description: "对数似然通常包含难以直接计算的积分，需要 EM 或变分方法。",
        },
        {
          title: "最大似然与 EM",
          description: "E 步推断隐变量后验，M 步更新模型参数，迭代提升似然。",
        },
        {
          title: "因子分析",
          description: "线性高斯隐变量模型，允许各观测维度具有独立的噪声方差。",
          formula: String.raw`\mathbf{x} = \mathbf{W}\mathbf{z} + \boldsymbol{\mu} + \boldsymbol{\epsilon}, \quad \boldsymbol{\epsilon} \sim \mathcal{N}(0, \boldsymbol{\Psi})`,
        },
        {
          title: "独立成分分析",
          description: "寻找统计独立的非高斯隐变量源，常用于盲源分离。",
        },
        {
          title: "卡尔曼滤波",
          description: "隐变量随时间演化的线性高斯状态空间模型，用于时序推断。",
        },
      ]}
      learningObjectives={[
        "理解概率隐变量模型的生成视角。",
        "掌握 EM 算法在隐变量模型中的作用。",
        "区分因子分析、ICA 与卡尔曼滤波的应用场景。",
      ]}
      coreIntuition={"隐变量像是数据的‘幕后导演’；概率模型假设我们看到的观测是导演按某种剧本（p(x|z)）生成的，学习就是反推导演和剧本。"}
      commonMistakes={[
        "把隐变量模型与聚类模型混为一谈；前者通常连续，后者离散。",
        "认为 p(x) 的积分总有闭式解；只有线性高斯等特殊情况才有。",
        "忽视因子分析与概率 PCA 在噪声模型上的区别。",
      ]}
      quiz={[
        {
          question: "概率隐变量模型中，观测 x 的边缘分布如何得到？",
          options: [
            "对隐变量 z 积分：p(x)=∫p(x|z)p(z)dz。",
            "直接令 z 等于 x 的均值。",
            "对 z 求和且 z 必须是离散变量。",
            "p(x)=p(x|z)p(z) 对任意固定 z。",
          ],
          correctIndex: 0,
          explanation: "边缘分布通过对隐变量积分（或求和）得到，体现了隐变量的不确定性。",
        },
        {
          question: "因子分析与概率 PCA 在噪声模型上的主要区别是？",
          options: [
            "因子分析允许每个观测维度有独立噪声方差，概率 PCA 使用各向同性 σ²。",
            "因子分析没有噪声项。",
            "概率 PCA 只能用于一维数据。",
            "两者在数学上完全相同。",
          ],
          correctIndex: 0,
          explanation: "因子分析的噪声协方差 Ψ 是对角矩阵；概率 PCA 假设 Ψ=σ²I。",
        },
        {
          question: "独立成分分析（ICA）通常假设隐变量源是什么分布？",
          options: [
            "非高斯分布。",
            "标准高斯分布。",
            "均匀分布。",
            "伯努利分布。",
          ],
          correctIndex: 0,
          explanation: "ICA 利用非高斯性来分离独立源；高斯分布的旋转不可识别性使得 PCA 无法完成此任务。",
        },
      ]}
      bishopMapping={{
        chapter: "Ch 16",
        section: "16.2",
        pages: "Ch 16",
        textbookSubsections: ["16.2 Probabilistic Latent Variables", "16.2.1 Generative model", "16.2.2 Likelihood function", "16.2.3 Maximum likelihood", "16.2.4 Factor analysis", "16.2.5 Independent component analysis", "16.2.6 Kalman filters"],
        formulas: ["p(x)=∫p(x|z)p(z)dz", "因子分析模型"],
        algorithms: ["EM 算法", "因子分析", "ICA"],
        exercises: ["推导线性高斯隐变量模型的边缘分布。", "比较因子分析与概率 PCA 的噪声假设。"],
      }}
      demo={{
        title: "隐变量先验对边缘方差的贡献",
        label: "隐变量方差 σ_z²",
        param: 1,
        min: 0.1,
        max: 4,
        step: 0.1,
        compute: (sz2) => ({
          label: '观测方差（单位载荷）',
          value: sz2 + 0.2,
          display: String.raw`\\sigma_x^2=${(sz2 + 0.2).toFixed(2)}`,
        }),
        formula: String.raw`\sigma_x^2 = W^2 \sigma_z^2 + \sigma_\epsilon^2`,
      }}
    />
  );
}
