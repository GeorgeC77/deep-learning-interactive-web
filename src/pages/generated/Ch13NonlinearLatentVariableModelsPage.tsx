import BishopSectionPage from '@/components/BishopSectionPage';
import ContinuousLatentChapterLab from '@/components/demos/ContinuousLatentChapterLab';
import Chapter13SectionCompletion from '@/components/Chapter13SectionCompletion';
import { Network } from 'lucide-react';

export default function Ch13NonlinearLatentVariableModelsPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch13/nonlinear-latent-variable-models"
      heroIcon={<Network className="w-9 h-9 text-blue-600" />}
      summary={"非线性隐变量模型用深度网络表达从潜在空间到数据空间的复杂变换。由于边缘似然或逆映射通常难解，Bishop §16.4.4 将后续生成方法归纳为 GAN、VAE、Normalizing Flow 与 Diffusion 四条路线。"}
      concepts={[
        {
          title: "非线性流形",
          description: "真实数据常分布于低维非线性流形，线性方法难以充分刻画。",
        },
        {
          title: "难解的似然积分",
          description: "非线性映射使 p(x)=∫p(x|z)p(z)dz 通常没有解析式，需要近似或隐式方法。",
          formula: String.raw`p(\mathbf{x}) = \int p(\mathbf{x} \mid \mathbf{z}) \, p(\mathbf{z}) \, d\mathbf{z}`,
        },
        {
          title: "四类生成方法",
          description: "GAN、VAE、Normalizing Flow 与 Diffusion 在似然可计算性、结构约束与采样成本上各有取舍。",
        },
        {
          title: "离散数据扩展",
          description: "将解码器输出改为 Bernoulli 或 Categorical 分布，可处理图像像素等离散观测。",
        },
      ]}
      learningObjectives={[
        "理解为什么非线性隐变量模型的似然积分通常难解。",
        "了解四类生成方法的核心思想。",
        "知道离散观测的建模方式。",
      ]}
      coreIntuition={"线性模型只能拟合直线或平面；非线性模型像一张可弯曲的网，能贴合复杂的数据流形，但也让精确计算变得更加困难。"}
      commonMistakes={[
        "认为 VAE 可以给出精确似然；它只能优化 ELBO。",
        "把 GAN 与流模型混为一谈；前者不计算似然，后者精确计算似然。",
        "忽视离散数据需要不同的输出分布假设。",
      ]}
      whyCards={[
        {
          question: "为什么非线性隐变量模型的似然积分难解？",
          answer: "非线性映射让 p(x|z) 和 p(z) 的乘积积分没有解析形式，无法直接计算或优化。",
        },
        {
          question: "为什么需要多种生成模型？",
          answer: "VAE、GAN、流模型和自回归模型在表示能力、训练稳定性和似然可计算性上各有取舍，没有单一方法在所有方面都最优。",
        },
      ]}
      counterexamples={[
        "用线性 PCA 拟合 S 形流形数据，投影方向完全错误——说明线性方法无法捕捉非线性结构。",
        "认为 VAE 可以给出精确似然，实际上它只能优化 ELBO——说明近似方法与精确方法的边界。",
      ]}
            bishopMapping={{
        chapter: "Ch 16",
        section: "16.4",
        pages: "§16.4, pp. 522–527",
        textbookSubsections: [
          "16.4 Nonlinear Latent Variable Models",
          "16.4.1 Nonlinear manifolds",
          "16.4.2 Likelihood function",
          "16.4.3 Discrete data",
          "16.4.4 Four approaches to generative modelling"
        ],
        formulas: ["p(x)=∫p(x|z)p(z)dz"],
        algorithms: ["VAE", "GAN", "Normalizing Flows", "Diffusion models"],
        exercises: ["比较四类生成模型的似然可计算性。", "说明离散观测下解码器分布的选择。"],
      }}
      extraContent={(
        <>
          <ContinuousLatentChapterLab mode="nonlinear" />
          <Chapter13SectionCompletion sectionKey="nonlinear" />
        </>
      )}
    />
  );
}
