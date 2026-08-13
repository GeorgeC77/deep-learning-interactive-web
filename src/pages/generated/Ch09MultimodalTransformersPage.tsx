import BishopSectionPage from '@/components/BishopSectionPage';
import MultimodalTokenLab from '@/components/demos/MultimodalTokenLab';
import DerivationStepper from '@/components/DerivationStepper';
import ExercisePanel from '@/components/ExercisePanel';
import { chapter09MultimodalExercises } from '@/course/chapter09Exercises';
import { ImagePlus } from 'lucide-react';

export default function Ch09MultimodalTransformersPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch09/multimodal-transformers"
      heroIcon={<ImagePlus className="w-9 h-9 text-blue-600" />}
      summary="Bishop §12.4 强调：Transformer 核心层跨模态保持相对稳定，关键创新集中在输入输出表示。图像可变成 patch 或离散码，音频可变成 mel 频谱或声学 token，文本、视觉和语音 token 随后可在 encoder-decoder 或统一序列中交互。"
      concepts={[
        {
          title: '视觉 Transformer（ViT）',
          description: '将 H×W×C 图像切成不重叠 P×P patch，每个 patch 展平成 P²C 向量并线性投影；通常再加入学习的位置编码。',
          formula: String.raw`N=\frac{HW}{P^2},\qquad x_p\in\mathbb R^{N\times(P^2C)}`,
        },
        {
          title: 'patch 与计算成本',
          description: '逐像素 token 会产生不可承受的 N² 注意力矩阵；增大 patch 可大幅减少 token，却也会丢失细粒度空间信息。',
        },
        {
          title: '生成式图像 Transformer',
          description: '把图像 patch 量化为有限码本中的离散 token，再像语言一样自回归生成；向量量化不可导时可使用 straight-through 梯度近似。',
        },
        {
          title: '音频数据',
          description: '原始波形常先变成时间×感知频率的 mel spectrogram，再切片或编码为连续/离散声学 token，供分类、识别和生成使用。',
        },
        {
          title: '文本到语音',
          description: '模型可把文本 token 映射为离散语音 token，再由码本解码成波形；附加说话人语音 token 可控制音色。',
        },
        {
          title: '视觉-语言 Transformer',
          description: '文本可作为图像生成条件，也可与图像 token 共同作为输入；encoder-decoder 把跨模态任务写成一种序列到序列建模问题。',
        },
      ]}
      learningObjectives={[
        '能计算 ViT 的 patch token 数、展平维度和注意力配对规模。',
        '能区分判别式 patch 表示与生成式离散图像码。',
        '能说明 mel spectrogram、语音 token 与视觉-语言 token 如何接入 Transformer。',
      ]}
      coreIntuition="跨模态 Transformer 并不是把原始像素、声压和文字编号直接混在一起；它先为每种模态构造可比较、可定位、可解码的 token，再让同一种注意力机制学习 token 之间的关系。"
      commonMistakes={[
        '认为视觉 Transformer 不需要位置编码；patch 顺序决定二维空间结构，教材指出实践中常使用学习的位置 embedding。',
        '把图像生成 Transformer 与扩散模型混为一谈；教材本节的生成模型主要把离散图像码作为自回归 token。',
        '认为统一 Transformer 架构就不再需要模态专用设计；tokenizer、码本、位置表示和 decoder 仍决定信息瓶颈。',
      ]}
      whyCards={[
        { question: '为什么不把每个像素直接作为 token？', answer: '标准注意力内存随 token 数平方增长。224×224 图像有 50176 个像素 token，而 16×16 patch 只有 196 个，配对数相差数万倍。' },
        { question: '为什么生成图像常需要离散码本？', answer: '直接把每个 patch 的所有像素组合当成类别会造成指数级词典；向量量化用学习到的有限码本压缩常见视觉模式。' },
      ]}
      counterexamples={[
        '把 patch 从 16 放大到 64 虽可显著降低注意力成本，却可能把小目标压进单个 token 而无法定位——说明 token 更少不总是更好。',
        '仅把图像和文本 token 拼接而不标注位置或模态来源，模型难以区分“哪里”以及“来自哪种传感器”——说明统一序列仍需结构信息。',
      ]}
      bishopMapping={{
        chapter: 'Ch 12',
        section: '12.4',
        pages: '§12.4, pp. 394–403',
        textbookSubsections: [
          "12.4 Multimodal Transformers",
          "12.4.1 Vision transformers",
          "12.4.2 Generative image transformers",
          "12.4.3 Audio data",
          "12.4.4 Text-to-speech",
          "12.4.5 Vision and language transformers",
        ],
        formulas: ['N=HW/P²', 'xp∈R^{N×(P²C)}', 'attention pairs N²'],
        algorithms: ['image patch embedding', 'vector-quantized image tokens', 'mel-spectrogram tokenization'],
        exercises: ['手算 ViT 的 patch token 数和注意力配对数。', '比较连续 patch embedding 与离散图像码。', '设计文本、图像和音频 token 的统一序列。'],
      }}
      interactiveDemo={<MultimodalTokenLab />}
      extraContent={(
        <div className="space-y-10">
          <DerivationStepper title="分步推导：patch 大小为何四次方影响注意力配对数" steps={[
            { label: '二维切块', formula: String.raw`N_h=H/P,\quad N_w=W/P`, explanation: '不重叠 patch 在高、宽两个轴分别把位置数缩小 P 倍。' },
            { label: 'token 总数', formula: String.raw`N=N_hN_w=HW/P^2`, explanation: '二维网格的 token 数随 patch 边长平方反比变化。' },
            { label: '注意力矩阵', formula: String.raw`A\in\mathbb R^{N\times N},\quad |A|=N^2=H^2W^2/P^4`, explanation: '每个查询都与每个键配对，因此空间和时间开销对 token 数再次平方。' },
            { label: '表示权衡', formula: String.raw`P\uparrow\Rightarrow |A|\downarrow\quad\text{but}\quad\text{spatial resolution}\downarrow`, explanation: '更大的 patch 大幅省算力，却把更多像素压进同一个 token；token 化本身就是模型归纳偏置。' },
          ]} />
          <ExercisePanel exerciseSetId="chapter09-multimodal" exercises={chapter09MultimodalExercises} />
        </div>
      )}
    />
  );
}
