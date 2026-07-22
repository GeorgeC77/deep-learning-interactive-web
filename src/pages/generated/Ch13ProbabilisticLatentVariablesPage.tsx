import BishopSectionPage from '@/components/BishopSectionPage';
import { GitBranch } from 'lucide-react';

const LatentTypeTable = () => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr className="bg-gray-50">
          <th className="border px-2 py-1 text-left">模型</th>
          <th className="border px-2 py-1 text-left">隐变量类型</th>
          <th className="border px-2 py-1 text-left">说明</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border px-2 py-1">高斯混合模型 GMM</td>
          <td className="border px-2 py-1">离散隐变量（成分标号）</td>
          <td className="border px-2 py-1">聚类可视为离散隐变量模型</td>
        </tr>
        <tr>
          <td className="border px-2 py-1">隐马尔可夫模型 HMM</td>
          <td className="border px-2 py-1">离散隐状态序列</td>
          <td className="border px-2 py-1">时序数据中的离散隐状态转移</td>
        </tr>
        <tr>
          <td className="border px-2 py-1">因子分析 FA</td>
          <td className="border px-2 py-1">连续隐向量</td>
          <td className="border px-2 py-1">线性高斯隐变量模型</td>
        </tr>
        <tr>
          <td className="border px-2 py-1">概率 PCA</td>
          <td className="border px-2 py-1">连续高斯隐向量</td>
          <td className="border px-2 py-1">噪声为各向同性时的线性模型</td>
        </tr>
        <tr>
          <td className="border px-2 py-1">变分自编码器 VAE</td>
          <td className="border px-2 py-1">通常为连续，亦有离散变体</td>
          <td className="border px-2 py-1">神经网络参数化的非线性隐变量模型</td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default function Ch13ProbabilisticLatentVariablesPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch13/probabilistic-latent-variables"
      heroIcon={<GitBranch className="w-9 h-9 text-blue-600" />}
      summary={"概率隐变量模型显式定义隐变量先验 p(z) 与条件似然 p(x|z)，通过边缘化得到观测分布。隐变量既可以是离散的，也可以是连续的；混合模型聚类是离散隐变量模型的典型例子。EM 算法是估计这类模型参数的核心工具。"}
      concepts={[
        {
          title: "生成模型",
          description: "观测数据由隐变量经概率变换生成，边缘分布通过对隐变量积分或求和得到。",
          formula: String.raw`p(\mathbf{x}) = \int p(\mathbf{x} \mid \mathbf{z}) \, p(\mathbf{z}) \, d\mathbf{z}`,
        },
        {
          title: "离散与连续隐变量",
          description: <LatentTypeTable />,
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
        "认识隐变量既可以是离散的，也可以是连续的。",
      ]}
      coreIntuition={"隐变量像是数据的‘幕后导演’；概率模型假设我们看到的观测是导演按某种剧本（p(x|z)）生成的，学习就是反推导演和剧本。导演既可以是连续向量，也可以是离散标号。"}
      commonMistakes={[
        "把隐变量模型与聚类模型对立起来；GMM 等聚类模型本身就是离散隐变量模型。",
        "认为 p(x) 的积分总有闭式解；只有线性高斯等特殊情况才有。",
        "忽视因子分析与概率 PCA 在噪声模型上的区别。",
      ]}
            bishopMapping={{
        chapter: "Ch 16",
        section: "16.2",
        pages: "Ch 16",
        textbookSubsections: [
          "16.2 Probabilistic Latent Variables",
          "16.2.1 Generative model",
          "16.2.2 Likelihood function",
          "16.2.3 Maximum likelihood",
          "16.2.4 Factor analysis",
          "16.2.5 Independent component analysis",
          "16.2.6 Kalman filters"
        ],
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
