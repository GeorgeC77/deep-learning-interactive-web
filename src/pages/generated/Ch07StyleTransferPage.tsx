import BishopSectionPage from '@/components/BishopSectionPage';
import StyleTransferLab from '@/components/demos/StyleTransferLab';
import DerivationStepper from '@/components/DerivationStepper';
import ExercisePanel from '@/components/ExercisePanel';
import { chapter07StyleTransferExercises } from '@/course/chapter07Exercises';
import { Palette } from 'lucide-react';

export default function Ch07StyleTransferPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch07/style-transfer"
      heroIcon={<Palette className="w-9 h-9 text-blue-600" />}
      summary={"Bishop §10.6 固定预训练 CNN，用高层激活约束内容、用通道交叉相关矩阵约束风格，再从随机初始化图像出发直接优化生成图像 G。Gram 表示保留通道共现，却有意弱化具体空间位置。"}
      concepts={[
        {
          title: "Content representation",
          description: "使用预训练 CNN 的高层 feature map 表示图像的语义结构，忽略具体像素值。",
        },
        {
          title: "Style representation",
          description: "用 Gram 矩阵统计特征图通道之间的相关性，捕捉纹理、色彩和局部图案的分布。",
          formula: String.raw`F_{kk'}(G)=\sum_{i=1}^{I}\sum_{j=1}^{J}a_{ijk}(G)a_{ijk'}(G)`,
        },
        {
          title: "Content loss",
          description: "合成图像与内容图像在某一高层特征空间中的欧氏距离，约束语义结构保持一致。",
          formula: String.raw`E_{\text{content}}(G,C)=\sum_{i,j,k}\{a_{ijk}(G)-a_{ijk}(C)\}^2`,
        },
        {
          title: "Style loss",
          description: "合成图像与风格图像在多层上的 Gram 矩阵差异之和，约束纹理统计相似。",
          formula: String.raw`E_{\text{style}}(G,S)=\sum_l\lambda_lE_{\text{style}}^{(l)}(G,S)`,
        },
        {
          title: "Total objective",
          description: "内容损失与风格损失的加权组合，通过调节权重控制生成结果。",
          formula: String.raw`E(G)=E_{\text{content}}(G,C)+E_{\text{style}}(G,S)`,
        },
        {
          title: "Optimization process",
          description: "固定预训练 CNN 的权重，从随机初始化的 G 出发，对图像像素做梯度下降，使内容项与多层风格项共同减小。",
        },
      ]}
      learningObjectives={[
        "理解 CNN 高层特征如何表示图像内容。",
        "理解 Gram 矩阵为什么能捕捉风格纹理。",
        "能写出风格迁移的总目标函数并解释各层风格权重 λl 的作用。",
      ]}
      coreIntuition={"风格迁移像把一张照片的‘骨架’和一幅画的‘笔触’重新合成：内容损失保住骨架，风格损失引入笔触，优化过程则让像素同时满足两个约束。"}
      commonMistakes={[
        "把风格迁移理解成简单滤镜；它实际是在特征空间约束下的优化问题。",
        "认为 Gram 矩阵保留空间布局；它主要捕捉纹理统计，弱化空间位置信息。",
        "忽视内容与风格项、以及不同层 λl 的相对权重，导致结果过像风格或丢失内容。",
      ]}
      whyCards={[
        {
          question: "为什么 Gram 矩阵能表示风格？",
          answer: "Gram 矩阵统计特征图通道之间的相关性，捕捉纹理、色彩和图案的分布，而不关心具体位置，正好符合“风格”的定义。",
        },
        {
          question: "为什么需要同时优化内容和风格损失？",
          answer: "只优化内容损失会得到原图；只优化风格损失会得到纹理噪声。加权组合才能在保持语义结构的同时引入艺术风格。",
        },
      ]}
      counterexamples={[
        "把风格迁移当成滤镜直接应用，结果只是颜色映射而非纹理重组——说明风格迁移是特征空间优化而非简单滤镜。",
        "Gram 矩阵只统计通道相关性，不包含空间位置信息——说明风格表示丢失了“哪里有什么”的信息。",
      ]}
            bishopMapping={{
        chapter: "Ch 10",
        section: "10.6",
        pages: "§10.6, pp. 320–322",
        textbookSubsections: [
          "10.6 Style Transfer"
        ],
        formulas: ["E(G)=Econtent(G,C)+Estyle(G,S)", "Fkk′=Σij aijk aijk′", "multilayer style loss Σl λlE(l)"],
        algorithms: ["gradient-based neural style transfer"],
        exercises: [
          "用 2×2 feature map 手算 Gram matrix。",
          "调整 α/β 观察内容保持与风格强度的权衡。",
          "比较浅层和深层特征用于风格/内容表示的差异。",
        ],
      }}
      interactiveDemo={<StyleTransferLab />}
      extraContent={<div className="space-y-10"><DerivationStepper title="分步推导：Gram 风格矩阵为何丢弃位置" steps={[
        { label: '特征展开', formula: String.raw`A\in\mathbb R^{K\times M},\quad M=IJ`, explanation: '把 K 个通道各自的 I×J 空间网格展平成长度 M 的行向量。' },
        { label: '通道共现', formula: String.raw`F=AA^T,\quad F_{kk'}=\sum_{m=1}^{M}A_{km}A_{k'm}`, explanation: '每个元素是两个通道在全部空间位置上的内积。' },
        { label: '共享置换', formula: String.raw`P^TP=I,\quad (AP)(AP)^T=APP^TA^T=AA^T`, explanation: '同时打乱所有通道的空间列不会改变 Gram 矩阵。' },
        { label: '教学结论', formula: String.raw`F(G)\approx F(S)\ \nRightarrow\ A(G)\approx A(S)`, explanation: '相同风格矩阵不保证相同布局，因此必须另加内容特征损失保存结构。' },
      ]} /><ExercisePanel exerciseSetId="chapter07-style-transfer" exercises={chapter07StyleTransferExercises} /></div>}
    />
  );
}
