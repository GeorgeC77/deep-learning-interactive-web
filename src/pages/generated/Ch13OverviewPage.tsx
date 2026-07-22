import BishopSectionPage from '@/components/BishopSectionPage';
import { Shrink } from 'lucide-react';

const ModelComparisonTable = () => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr className="bg-gray-50">
          <th className="border px-2 py-1 text-left">模型</th>
          <th className="border px-2 py-1 text-left">推断（Inference）</th>
          <th className="border px-2 py-1 text-left">生成（Generation）</th>
          <th className="border px-2 py-1 text-left">是否需要可逆映射</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border px-2 py-1">VAE</td>
          <td className="border px-2 py-1">编码器近似后验 q(z|x)</td>
          <td className="border px-2 py-1">解码器 p_θ(x|z)</td>
          <td className="border px-2 py-1">否</td>
        </tr>
        <tr>
          <td className="border px-2 py-1">GAN</td>
          <td className="border px-2 py-1">通常无显式编码器</td>
          <td className="border px-2 py-1">生成器 G(z)</td>
          <td className="border px-2 py-1">否</td>
        </tr>
        <tr>
          <td className="border px-2 py-1">Normalizing Flow</td>
          <td className="border px-2 py-1">z = f^{-1}(x)</td>
          <td className="border px-2 py-1">x = f(z)</td>
          <td className="border px-2 py-1">是</td>
        </tr>
        <tr>
          <td className="border px-2 py-1">Autoregressive</td>
          <td className="border px-2 py-1">{'逐维度推断 p(x_i|x_{<i})'}</td>
          <td className="border px-2 py-1">逐维度采样</td>
          <td className="border px-2 py-1">否</td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default function Ch13OverviewPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch13/overview"
      heroIcon={<Shrink className="w-9 h-9 text-blue-600" />}
      summary={"连续隐变量模型假设观测数据由低维连续隐变量经线性或非线性变换生成。PCA、因子分析、概率 PCA 与 VAE 都属此框架；推断与生成不必互为逆映射。"}
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
        {
          title: "推断与生成",
          description: <ModelComparisonTable />,
        },
      ]}
      learningObjectives={[
        "理解连续隐变量模型的基本假设。",
        "区分线性隐变量模型与非线性深度生成模型。",
        "了解隐变量模型在降维与生成中的统一视角。",
        "认识编码器与解码器不必互为逆映射。",
      ]}
      coreIntuition={"连续隐变量模型把高维数据点看成低维隐空间经过某种映射并加噪声后的投影。推断是从观测估计或采样隐变量；生成是从先验采样隐变量再通过模型生成观测。解码器可以是随机的，也只有标准化流才要求可逆映射。"}
      commonMistakes={[
        "把 PCA 与概率 PCA 混为一谈；前者是确定性优化，后者是概率模型。",
        "认为隐变量模型一定需要可计算的 p(x)；VAE 用 ELBO 近似处理难解积分。",
        "忽视线性模型对非线性流形数据的局限性。",
        "把降维/生成立刻等同于“找映射/逆映射”；多数深度生成模型中编码器与解码器并不互逆。",
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
