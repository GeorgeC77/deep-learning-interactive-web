import BishopSectionPage from '@/components/BishopSectionPage';
import { Shrink } from 'lucide-react';

export default function Ch16OverviewPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch16/overview"
      heroIcon={<Shrink className="w-9 h-9 text-blue-600" />}
      summary={"自编码器通过编码器-解码器结构学习数据的有效表示，可用于降维、去噪与生成建模。确定性自编码器关注重构与约束，变分自编码器则在隐空间引入概率分布。"}
      concepts={[
        {
          title: "编码器与解码器",
          description: "编码器将输入压缩为隐表示，解码器从隐表示重构输入。",
        },
        {
          title: "重构损失",
          description: "通常用均方误差或交叉熵衡量输入与重构之间的差异。",
        },
        {
          title: "隐表示约束",
          description: "通过欠完备、稀疏、去噪或掩码等方式防止学到平凡恒等映射。",
        },
        {
          title: "生成视角",
          description: "VAE 在隐空间定义概率先验，使解码器成为可从中采样的生成模型。",
        },
      ]}
      learningObjectives={[
        "理解自编码器的基本结构与重构目标。",
        "了解常见约束如何帮助学习有意义表示。",
        "区分确定性自编码器与变分自编码器。",
      ]}
      coreIntuition={"自编码器先‘压缩’再‘解压’；压缩得越狠，学到的表示越抽象，但也越需要精心设计目标来防止信息无损复制。"}
      commonMistakes={[
        "认为自编码器天然是生成模型；普通确定性自编码器通常需要额外设计才能采样。",
        "忽视隐层维度与约束的匹配：过宽且无约束容易学到恒等映射。",
        "把重构误差小直接等同于表示质量好；好的表示还应便于下游任务或插值。",
      ]}
            bishopMapping={{
        chapter: "Ch 19",
        pages: "Ch 19",
        textbookSubsections: [
          "19.1 Deterministic Autoencoders",
          "19.2 Variational Autoencoders"
        ],
        algorithms: ["编码器-解码器结构"],
        exercises: ["列出三种防止自编码器学到恒等映射的方法。", "比较自编码器与 PCA 在降维上的异同。"],
      }}
    />
  );
}
