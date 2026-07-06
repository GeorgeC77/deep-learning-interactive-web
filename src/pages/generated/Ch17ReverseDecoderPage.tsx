import BishopSectionPage from '@/components/BishopSectionPage';
import { ArrowLeft } from 'lucide-react';

export default function Ch17ReverseDecoderPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch17/reverse-decoder"
      heroIcon={<ArrowLeft className="w-9 h-9 text-blue-600" />}
      summary={"反向解码器学习逐步去噪的条件分布；ELBO 可重写为噪声预测损失，使训练稳定且高效。本页采用 DDPM 记号 x_t；Bishop 教材中对应状态常记为 z_t。"}
      concepts={[
        {
          title: "反向条件分布",
          description: "当 β 很小时，反向过程也近似高斯，可用神经网络参数化。",
          formula: String.raw`p_\theta(x_{t-1} \mid x_t) = \mathcal{N}(x_{t-1} \mid \mu_\theta(x_t,t), \sigma_t^2 I)`,
        },
        {
          title: "变分下界",
          description: "优化 ELBO 等价于训练网络匹配真实的反向转移。",
        },
        {
          title: "简化损失",
          description: "直接预测加入的噪声 ϵ 通常比重构完整转移参数更稳定。",
          formula: String.raw`\mathcal{L} = \mathbb{E}_{t,x_0,\epsilon}\left[ \|\epsilon - \epsilon_\theta(x_t, t)\|^2 \right]`,
        },
        {
          title: "记号说明",
          description: "本页采用 x_t；Bishop 教材中对应状态常记为 z_t。",
        },
      ]}
      learningObjectives={[
        "理解反向过程为何近似高斯。",
        "能写出噪声预测损失的形式。",
        "知道 ELBO 与简化损失的关系。",
      ]}
      coreIntuition={"反向解码器就像一个‘去噪专家’：看到一张充满噪声的图，它猜出其中掺杂的噪声并减掉，从而一步一步还原出清晰图像。"}
      commonMistakes={[
        "认为反向过程的真实分布严格是高斯；它只是在 β 很小时的近似。",
        "忽略方差 schedule 对采样质量的影响。",
        "混淆 x_t 与 z_t 记号，导致与教材公式对照错误。",
      ]}
      quiz={[
        {
          question: "反向过程中 p_θ(x_{t-1}|x_t) 被近似为什么分布？",
          options: ["高斯分布", "均匀分布", "类别分布", "拉普拉斯分布"],
          correctIndex: 0,
          explanation: "当 β 很小时，反向转移可用高斯分布近似，其均值由神经网络预测。",
        },
        {
          question: "噪声预测损失直接优化的对象是？",
          options: [
            "加入前向过程的噪声 ϵ",
            "原始数据 x₀",
            "反向过程的方差",
            "β_t 的 schedule",
          ],
          correctIndex: 0,
          explanation: "简化损失让网络直接预测前向过程中加入的噪声 ε，训练更稳定。",
        },
        {
          question: "下列关于扩散模型反向过程的叙述，哪项最准确？",
          options: [
            "反向真实分布严格等于高斯，因此神经网络只需学习均值。",
            "反向过程的真实分布通常不是高斯，但在小步长下可用高斯近似。",
            "反向过程不需要随机噪声。",
            "反向过程一步即可完成去噪。",
          ],
          correctIndex: 1,
          explanation: "反向真实转移在高斯前向小步长假设下近似高斯，这是 DDPM 等模型的核心近似。",
        },
      ]}
      bishopMapping={{
        chapter: "Ch 20",
        section: "20.2",
        pages: "Ch 20",
        textbookSubsections: ["20.2.1 Reverse conditional distribution", "20.2.2 ELBO", "20.2.3 Simplified loss"],
        formulas: ["反向高斯近似", "噪声预测损失"],
        algorithms: ["DDPM 反向采样"],
        exercises: ["从简化损失出发推导均值参数化。", "对比直接预测 x₀ 与预测噪声两种参数化。"],
      }}
      demo={{
        title: "噪声预测 MSE",
        label: "预测误差",
        param: 0.5,
        min: 0,
        max: 2,
        step: 0.05,
        compute: (err) => ({
          label: '损失',
          value: err * err,
          display: String.raw`\|\epsilon-\epsilon_\theta\|^2=${(err * err).toFixed(3)}`,
        }),
        formula: String.raw`\|\epsilon - \epsilon_\theta(x_t, t)\|^2`,
      }}
    />
  );
}
