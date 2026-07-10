import BishopSectionPage from '@/components/BishopSectionPage';
import MaskedAutoencoderDemo from '@/components/demos/MaskedAutoencoderDemo';
import { Box } from 'lucide-react';

export default function Ch16DeterministicAutoencodersPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch16/deterministic-autoencoders"
      heroIcon={<Box className="w-9 h-9 text-blue-600" />}
      summary={"确定性自编码器通过编码器-解码器结构学习压缩表示。线性自编码器等价于 PCA；深层自编码器能学习非线性流形；稀疏、去噪与掩码自编码器通过不同约束获得有意义的特征。"}
      concepts={[
        {
          title: "线性自编码器",
          description: "单隐层、使用恒等目标与均方误差的线性自编码器等价于主成分分析，学习数据的主子空间。",
        },
        {
          title: "深层自编码器",
          description: "用非线性编码器-解码器捕捉数据的非线性低维流形，比线性 PCA 更具表达能力。",
        },
        {
          title: "稀疏自编码器",
          description: "在隐层激活上施加稀疏惩罚，使每个输入仅由少量隐单元表示。",
        },
        {
          title: "去噪自编码器",
          description: "从被损坏的输入重构原始输入，迫使表示对局部扰动鲁棒。",
        },
        {
          title: "掩码自编码器（MAE）",
          description: "随机遮罩输入 patch，仅从未遮罩部分重建全部输入；训练完成后通常丢弃 decoder，保留 encoder 做下游任务。",
        },
      ]}
      learningObjectives={[
        "理解线性自编码器与 PCA 的等价性。",
        "了解深层自编码器相比线性版本的优势。",
        "区分稀疏、去噪与掩码自编码器的约束目标。",
      ]}
      coreIntuition={"自编码器像一台‘压缩-解压机’：好的隐表示不是简单复制输入，而是在压缩过程中保留重建所需的本质结构。"}
      commonMistakes={[
        "认为自编码器一定可以学到有用特征；没有约束时可能学到恒等映射。",
        "把欠完备隐层与过完备隐层混为一谈；后者需要额外正则化才有意义。",
        "将 MAE 与去噪自编码器混淆：MAE 的损坏是结构化遮罩，而去噪自编码器通常加像素级噪声。",
      ]}
      quiz={[
        {
          question: "单层线性自编码器（均方误差、恒等激活）在隐层维度为 M 时等价于什么？",
          options: [
            "保留前 M 个主成分的 PCA。",
            "k-means 聚类。",
            "高斯混合模型。",
            "随机投影。",
          ],
          correctIndex: 0,
          explanation: "线性自编码器的最优解由数据协方差的前 M 个特征向量张成，即 PCA 子空间。",
        },
        {
          question: "输入维度为 100、隐层维度为 20 的欠完备自编码器，其压缩比是多少？",
          options: ["20/100 = 0.2", "100/20 = 5", "(100-20)/100 = 0.8", "20"],
          correctIndex: 0,
          explanation: "压缩比 = 隐层维度 / 输入维度 = 20/100 = 0.2。",
        },
        {
          question: "某自编码器在测试数据上能完美重构训练见过的样本，但对相似新样本重构很差，最可能是？",
          options: [
            "过拟合 / 隐层过宽且缺乏约束",
            "训练不充分",
            "优化器学习率过高",
            "使用了线性激活",
          ],
          correctIndex: 0,
          explanation: "完美重构训练数据但泛化差是典型的过拟合；欠完备、稀疏、去噪或掩码约束可缓解。",
        },
      ]}
      bishopMapping={{
        chapter: "Ch 19",
        section: "19.1",
        pages: "Ch 19",
        textbookSubsections: [
          "19.1.1 Linear autoencoders",
          "19.1.2 Deep autoencoders",
          "19.1.3 Sparse autoencoders",
          "19.1.4 Denoising autoencoders",
          "19.1.5 Masked autoencoders"
        ],
        supplementalTopics: [
          "deep autoencoders as nonlinear PCA",
          "MAE pre-training"
        ],
        formulas: ["重构误差", "稀疏惩罚", "去噪目标"],
        algorithms: ["线性自编码器", "深层自编码器", "稀疏自编码器", "去噪自编码器", "MAE"],
        exercises: ["证明线性自编码器与 PCA 的关系。", "比较去噪自编码器与 MAE 的损坏方式差异。"],
      }}
      extraContent={<MaskedAutoencoderDemo />}
    />
  );
}
