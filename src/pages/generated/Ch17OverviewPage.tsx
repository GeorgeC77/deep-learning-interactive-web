import BishopSectionPage from '@/components/BishopSectionPage';
import ChapterProgressCard from '@/components/ChapterProgressCard';
import { Waves } from 'lucide-react';

const progressSections = [
  { exerciseSetId: 'chapter17-forward', label: '20.1 前向编码器', path: '/ch17/forward-encoder', exerciseCount: 3 },
  { exerciseSetId: 'chapter17-reverse', label: '20.2 反向解码器', path: '/ch17/reverse-decoder', exerciseCount: 3 },
  { exerciseSetId: 'chapter17-score', label: '20.3 分数匹配', path: '/ch17/score-matching', exerciseCount: 3 },
  { exerciseSetId: 'chapter17-guided', label: '20.4 引导扩散', path: '/ch17/guided-diffusion', exerciseCount: 3 },
];

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
            bishopMapping={{
        chapter: "Ch 20",
        section: "20",
        pages: "pp. 581–608",
        textbookSubsections: [
          "20.1 Forward Encoder",
          "20.2 Reverse Decoder",
          "20.3 Score Matching",
          "20.4 Guided Diffusion"
        ],
        formulas: ["扩散前向核", "反向 ELBO", "去噪分数匹配", "引导分数"],
        algorithms: ["Algorithm 20.1 DDPM 训练", "Algorithm 20.2 DDPM 采样", "退火 Langevin 动力学", "无分类器引导"],
        exercises: ["由逐步高斯转移推导闭式扩散核。", "比较噪声预测、分数匹配与无分类器引导的目标。"],
      }}
      extraContent={(
        <>
          <ChapterProgressCard title="扩散模型掌握进度" sections={progressSections} />
          <p className="text-center text-sm text-emerald-800">
            完成四节共 12 道原创练习，即可串联闭式扩散核、ELBO、噪声预测、反向 SDE 与条件引导。
          </p>
        </>
      )}
    />
  );
}
