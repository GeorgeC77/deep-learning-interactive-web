import BishopSectionPage from '@/components/BishopSectionPage';
import { Waves } from 'lucide-react';

export default function Ch17OverviewPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch17/overview"
      heroIcon={<Waves className="w-9 h-9 text-blue-600" />}
      summary={"本页及后续小节采用 DDPM 常见记号 x_t；Bishop 教材中对应状态常记为 z_t。扩散模型通过渐进加噪与逐步去噪学习数据分布。"}
      concepts={[
        {
          title: "前向扩散",
          description: "在 T 步内向数据逐步加入高斯噪声，最终趋近简单先验。",
        },
        {
          title: "反向去噪",
          description: "训练神经网络预测噪声或分数，逐步恢复干净数据。",
        },
        {
          title: "引导生成",
          description: "分类器或无分类器引导可在采样时控制生成内容与语义对齐。",
        },
        {
          title: "记号说明",
          description: "本页采用 x_t 表示 t 时刻带噪样本；Bishop 教材常用 z_t，两者指代同一概念。",
        },
      ]}
      learningObjectives={[
        "理解扩散模型前向加噪与反向去噪的基本流程。",
        "知道 x_t 与教材 z_t 的记号对应关系。",
        "了解引导生成的作用。",
      ]}
      coreIntuition={"扩散模型先把数据磨成噪声，再学会一步一步把噪声雕回数据；生成过程就像在雾中逐步找回清晰的图像。"}
      commonMistakes={[
        "认为 β_t 必须随时间递增；这只是常见设计，并非扩散模型的数学必要条件。",
        "混淆 x_t（DDPM 记号）与 z_t（Bishop 教材记号）的符号差异。",
        "把扩散模型当成确定性映射；其训练和采样都涉及随机噪声。",
      ]}
      quiz={[
        {
          question: "关于 β_t schedule，下列说法正确的是？",
          options: [
            "β_t 随时间递增是常见设置，但不是数学必要条件。",
            "β_t 必须严格单调递增，否则模型不收敛。",
            "β_t 只能取常数。",
            "β_t 必须在第一步就接近 1。",
          ],
          correctIndex: 0,
          explanation: "递增 schedule 有助于逐步增强噪声，但扩散模型的数学推导对任意满足条件的 schedule 都成立。",
        },
        {
          question: "本页使用 x_t 表示带噪样本，Bishop 教材中常用什么符号？",
          options: ["z_t", "y_t", "h_t", "a_t"],
          correctIndex: 0,
          explanation: "Bishop 教材中扩散状态常记为 z_t；本页采用 DDPM 常见记号 x_t，两者等价。",
        },
        {
          question: "无分类器引导（classifier-free guidance）的主要作用是？",
          options: [
            "在采样时增强条件信号，提高生成内容与提示的一致性。",
            "替代反向去噪网络。",
            "减少训练所需的扩散步数。",
            "把无条件生成变为确定性生成。",
          ],
          correctIndex: 0,
          explanation: "无分类器引导通过插值条件与无条件分数，增强条件控制强度。",
        },
      ]}
      bishopMapping={{
        chapter: "Ch 20",
        section: "20",
        pages: "Ch 20",
        textbookSubsections: ["20.1 Forward encoder", "20.2 Reverse decoder", "20.3 Score matching", "20.4 Guided diffusion"],
        formulas: ["扩散前向核", "噪声预测损失"],
        algorithms: ["DDPM 采样", "无分类器引导"],
        exercises: ["对比 x_t 与 z_t 两种记号在前向过程中的定义。", "讨论 β_t schedule 改变对噪声强度的影响。"],
      }}
    />
  );
}
