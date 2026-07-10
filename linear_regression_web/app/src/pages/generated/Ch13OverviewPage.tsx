import BishopSectionPage from '@/components/BishopSectionPage';
import { Shrink } from 'lucide-react';

export default function Ch13OverviewPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch13/overview"
      heroIcon={<Shrink className="w-9 h-9 text-blue-600" />}
      summary={"连续隐变量模型假设观测数据由低维连续隐变量经线性或非线性变换生成。PCA、因子分析、概率 PCA 与 VAE 都属此框架。"}
      concepts={[
        {
          title: "隐变量动机",
          description: "高维数据常分布于低维流形，隐变量提供紧凑表示并揭示数据结构。",
        },
        {
          title: "线性模型",
          description: "PCA、因子分析与概率 PCA 假设观测是隐变量的线性函数加噪声。",
        },
        {
          title: "概率与推断",
          description: "概率隐变量模型通过先验与似然定义联合分布，EM 算法用于参数估计。",
        },
        {
          title: "非线性扩展",
          description: "神经网络可参数化非线性编码器与解码器，形成 VAE 等深度生成模型。",
        },
      ]}
      learningObjectives={[
        "理解连续隐变量模型的基本假设。",
        "区分线性隐变量模型与非线性深度生成模型。",
        "了解隐变量模型在降维与生成中的统一视角。",
      ]}
      coreIntuition={"连续隐变量模型把高维数据点看成低维隐空间经过某种映射并加噪声后的投影；降维就是找映射，生成就是逆映射。"}
      commonMistakes={[
        "把 PCA 与概率 PCA 混为一谈；前者是确定性优化，后者是概率模型。",
        "认为隐变量模型一定需要可计算的 p(x)；VAE 用 ELBO 近似处理难解积分。",
        "忽视线性模型对非线性流形数据的局限性。",
      ]}
      quiz={[
        {
          question: "连续隐变量模型的核心假设是什么？",
          options: [
            "高维观测由低维连续隐变量经某种映射生成。",
            "隐变量必须是离散的。",
            "观测维度必须小于隐变量维度。",
            "映射必须是线性且可逆的。",
          ],
          correctIndex: 0,
          explanation: "隐变量模型假设存在低维隐空间，观测数据由其生成并可能加噪声。",
        },
        {
          question: "PCA 与概率 PCA 的主要区别是？",
          options: [
            "PCA 是确定性降维方法，概率 PCA 是带概率假设的生成模型。",
            "PCA 只能用于二维数据。",
            "概率 PCA 不使用特征分解。",
            "PCA 可以计算 p(x) 而概率 PCA 不能。",
          ],
          correctIndex: 0,
          explanation: "PCA 寻找最大方差方向；概率 PCA 假设线性高斯生成过程，可导出似然函数。",
        },
        {
          question: "当数据分布在高维空间的非线性流形上时，哪种方法更合适？",
          options: [
            "非线性隐变量模型，如 VAE。",
            "标准 PCA。",
            "线性回归。",
            "k-means 聚类。",
          ],
          correctIndex: 0,
          explanation: "非线性模型通过神经网络参数化复杂映射，能捕捉线性方法无法表示的流形结构。",
        },
      ]}
      bishopMapping={{
        chapter: "Ch 16",
        pages: "Ch 16",
        textbookSubsections: [
          "16.1 Principal Component Analysis",
          "16.2 Probabilistic Latent Variables",
          "16.3 Evidence Lower Bound",
          "16.4 Nonlinear Latent Variable Models"
        ],
        exercises: ["列出本章四种隐变量模型及其主要假设。", "比较 PCA 与概率 PCA 在优化目标上的差异。"],
      }}
      demo={{
        title: "隐变量维度对数据压缩的影响",
        label: "隐维度 d",
        param: 2,
        min: 1,
        max: 10,
        step: 1,
        compute: (d) => ({
          label: '相对压缩比（假设观测维 D=100）',
          value: d / 100,
          display: String.raw`\\frac{d}{D}=${(d / 100).toFixed(2)}`,
        }),
        formula: String.raw`\text{压缩比} = \frac{d}{D}`,
      }}
    />
  );
}
