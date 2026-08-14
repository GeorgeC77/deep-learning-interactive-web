import BishopSectionPage from '@/components/BishopSectionPage';
import Chapter17SectionCompletion from '@/components/Chapter17SectionCompletion';
import { ArrowLeft } from 'lucide-react';

export default function Ch17ReverseDecoderPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch17/reverse-decoder"
      heroIcon={<ArrowLeft className="w-9 h-9 text-blue-600" />}
      summary={"反向解码器学习条件分布 p(z_{t-1}|z_t,w)。通过变分下界（ELBO）训练后，可将其改写为预测前向过程中加入的总噪声；采样时从 z_T 开始逐步去噪生成新数据。"}
      concepts={[
        {
          title: "反向条件分布",
          description: "当 β_t 很小时，反向过程可用高斯近似，其均值和方差由神经网络参数化。",
          formula: String.raw`p_w(\mathbf{z}_{t-1} \mid \mathbf{z}_t) = \mathcal{N}\bigl(\mathbf{z}_{t-1} \mid \boldsymbol{\mu}_w(\mathbf{z}_t,t), \sigma_t^2 I\bigr)`,
        },
        {
          title: "ELBO 来自反向过程",
          description: "用变分分布近似真实反向转移，ELBO 包含重构项与 KL 散度，保证似然下界。",
        },
        {
          title: "改写成噪声预测",
          description: "将 ELBO 中关于均值的优化目标转化为直接预测前向过程加入的总噪声 ε。",
          formula: String.raw`\mathcal{L} = \mathbb{E}_{t,\mathbf{z}_0,\boldsymbol{\epsilon}}\!\left[ \|\boldsymbol{\epsilon} - \boldsymbol{\epsilon}_w(\mathbf{z}_t, t)\|^2 \right]`,
        },
        {
          title: "预测 total noise 而非 incremental noise",
          description: "总噪声目标 ε 的边缘分布固定为标准高斯；网络输入 z_t 仍依赖数据与时间 t。闭式构造 z_t 后，随机抽一个 t 就能获得低方差、统一尺度的监督信号。",
        },
        {
          title: "Algorithm 20.1：训练流程",
          description: "重复：从数据采样 z_0，随机选 t，采样 z_t，用 MSE 更新网络参数使 ε_w 逼近真实 ε。",
        },
        {
          title: "生成新样本",
          description: "从先验 z_T ~ N(0,I) 出发，迭代应用学习到的反向转移，最终得到 z_0。",
        },
      ]}
      learningObjectives={[
        "理解反向解码器学习 p(z_{t-1}|z_t,w) 的意义。",
        "能说明 ELBO 如何转化为噪声预测损失。",
        "掌握 Algorithm 20.1 的训练步骤与采样流程。",
      ]}
      coreIntuition={"反向解码器就像一个‘去噪专家’：看到一张充满噪声的图，它猜出从干净图到这张图一共加了多少噪声，然后一步一步减掉，最终还原出清晰图像。"}
      commonMistakes={[
        "认为反向过程的真实分布严格是高斯；它只是在 β 很小时的近似。",
        "让网络预测相邻两步之间的增量噪声；预测总噪声更稳定。",
        "认为所有反向步都必须加随机项；Algorithm 20.2 的中间步采样噪声，但最终生成无噪声 x 的一步不再加噪。",
        "混淆 x_t 与 z_t 记号，导致与教材公式对照错误。",
        "把删除时间权重后的简单噪声 MSE 说成与原始 ELBO 数值完全相同；它是改变了各时间步权重的代理目标。",
      ]}
      whyCards={[
        {
          question: "为什么预测总噪声比预测增量噪声更稳定？",
          answer: "每次监督目标 ε 都从同一个 N(0,I) 采样，并可用闭式核在任意 t 构造 z_t；输入 z_t 并非始终为标准高斯，且与 ε 统计相关。统一的是目标的边缘尺度，而不是输入分布。",
        },
        {
          question: "为什么反向过程只是近似高斯？",
          answer: "真实的反向条件分布依赖数据分布，不是严格高斯。但当每一步加的噪声很小时，可以用高斯近似。",
        },
      ]}
      counterexamples={[
        "把 z_t 当作始终服从 N(0,I) 的输入，会忽略小 t 时它仍保留大量数据结构——标准高斯假设只对极限端点 z_T 近似成立。",
        "在最终 z₁→x 的去噪步继续加入噪声，会污染本应无噪声的输出——随机项的处理依赖采样步骤。",
      ]}
            bishopMapping={{
        chapter: "Ch 20",
        section: "20.2",
        pages: "§20.2, pp. 585–594",
        textbookSubsections: [
          "20.2.1 Training the decoder",
          "20.2.2 Evidence lower bound",
          "20.2.3 Rewriting the ELBO",
          "20.2.4 Predicting the noise",
          "20.2.5 Generating new samples"
        ],
        formulas: ["p_w(z_{t-1}|z_t)", "噪声预测损失"],
        algorithms: ["Algorithm 20.1 DDPM 训练", "Algorithm 20.2 DDPM 采样"],
        exercises: ["从 ELBO 推导出噪声预测损失。", "说明生成时为什么从 z_T~N(0,I) 开始。"],
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
          display: String.raw`\\|\\epsilon-\\epsilon_w\\|^2=${(err * err).toFixed(3)}`,
        }),
        formula: String.raw`\|\boldsymbol{\epsilon} - \boldsymbol{\epsilon}_w(\mathbf{z}_t, t)\|^2`,
      }}
      extraContent={<Chapter17SectionCompletion sectionKey="reverse" />}
    />
  );
}
