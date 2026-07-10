import BishopSectionPage from '@/components/BishopSectionPage';
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
          description: "预测总噪声 ε 使网络输入始终为标准高斯噪声，目标与 z_t 无关，训练更稳定；预测小步增量会随 t 变化剧烈。",
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
        "在采样时忽略反向转移中的随机项，把去噪当成确定性操作。",
        "混淆 x_t 与 z_t 记号，导致与教材公式对照错误。",
      ]}
      quiz={[
        {
          question: "反向解码器学习的目标分布是什么？",
          options: [
            "p(z_{t-1} | z_t, w)",
            "p(z_t | z_{t-1})",
            "p(z_0 | z_T)",
            "p(w | z_0)",
          ],
          correctIndex: 0,
          explanation: "反向解码器学习从当前带噪状态 z_t 回到上一时刻 z_{t-1} 的条件分布。",
        },
        {
          question: "为什么噪声预测网络通常预测 total noise ε 而不是 incremental noise？",
          options: [
            "total noise 与输入 z_t 的分布解耦，训练目标更稳定",
            "incremental noise 更容易解析计算",
            "total noise 需要更少的网络层",
            "ELBO 不允许预测 incremental noise",
          ],
          correctIndex: 0,
          explanation: "预测 total noise 使目标分布固定为标准高斯，而 incremental noise 的统计特性随 t 变化。",
        },
        {
          question: "训练完成后，生成新样本应从什么分布开始？",
          options: [
            "标准高斯 N(0,I)",
            "训练数据分布",
            "均匀分布",
            "任意固定向量",
          ],
          correctIndex: 0,
          explanation: "扩散模型从与最终前向分布一致的标准高斯噪声 z_T 出发，通过反向链生成数据。",
        },
      ]}
      bishopMapping={{
        chapter: "Ch 20",
        section: "20.2",
        pages: "Ch 20",
        textbookSubsections: [
          "20.2.1 Training the decoder",
          "20.2.2 Evidence lower bound",
          "20.2.3 Rewriting the ELBO",
          "20.2.4 Predicting the noise",
          "20.2.5 Generating new samples"
        ],
        formulas: ["p_w(z_{t-1}|z_t)", "噪声预测损失"],
        algorithms: ["Algorithm 20.1", "DDPM 反向采样"],
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
    />
  );
}
