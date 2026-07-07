import BishopSectionPage from '@/components/BishopSectionPage';
import { Network } from 'lucide-react';

export default function Ch13NonlinearLatentVariableModelsPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch13/nonlinear-latent-variable-models"
      heroIcon={<Network className="w-9 h-9 text-blue-600" />}
      summary={"非线性隐变量模型用神经网络参数化编码器与解码器，能够捕捉复杂流形结构。由于似然积分通常难以计算，VAE、GAN、流模型与自回归模型采取了不同的近似或绕过策略。"}
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
          description: "自回归模型、归一化流、GAN 与 VAE 在表示能力、训练目标与采样方式上各有取舍。",
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
      quiz={[
        {
          question: "非线性隐变量模型中，p(x) 的积分为什么通常难以计算？",
          options: [
            "因为解码器是非线性神经网络，积分没有解析式。",
            "因为隐变量维度一定大于观测维度。",
            "因为 p(z) 不是高斯分布。",
            "因为模型一定不可微。",
          ],
          correctIndex: 0,
          explanation: "非线性映射导致被积函数复杂，高维积分通常只能用采样或变分方法近似。",
        },
        {
          question: "以下哪种生成模型可以精确计算似然？",
          options: [
            "归一化流",
            "标准 VAE",
            "GAN",
            "都需要近似",
          ],
          correctIndex: 0,
          explanation: "归一化流通过可逆变换与 Jacobian 提供精确似然；VAE 用 ELBO 近似，GAN 通常不显式建模密度。",
        },
        {
          question: "处理二值图像像素时，解码器通常输出什么分布？",
          options: [
            "每个像素独立的 Bernoulli 分布。",
            "连续高斯分布。",
            "类别分布但所有像素共享参数。",
            "均匀分布。",
          ],
          correctIndex: 0,
          explanation: "二值像素用 Bernoulli 似然建模；灰度或彩色像素常用高斯或离散化 Logistic 分布。",
        },
      ]}
      bishopMapping={{
        chapter: "Ch 16",
        section: "16.4",
        pages: "Ch 16",
        textbookSubsections: ["16.4 Nonlinear Latent Variable Models", "16.4.1 Nonlinear manifolds", "16.4.2 Likelihood function", "16.4.3 Discrete data", "16.4.4 Four approaches to generative modelling"],
        formulas: ["p(x)=∫p(x|z)p(z)dz"],
        algorithms: ["VAE", "GAN", "Normalizing Flows", "Autoregressive models"],
        exercises: ["比较四类生成模型的似然可计算性。", "说明离散观测下解码器分布的选择。"],
      }}
    />
  );
}
