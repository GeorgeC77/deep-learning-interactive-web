import type { LearningExercise } from '@/components/ExercisePanel';

export const chapter09AttentionExercises: LearningExercise[] = [
  {
    id: 'attention-row-sum', difficulty: 1,
    prompt: '对固定查询 qi，softmax 得到的注意力系数 αij 必须满足什么性质？',
    options: [{ id: 'correct', label: '所有 αij>0，且沿键索引 j 的和为 1' }, { id: 'symmetric', label: '注意力矩阵必须对称' }, { id: 'columns', label: '每一列的和必须为 1' }],
    correctOptionId: 'correct', hint: 'softmax 是对一个查询对应的全部键得分做归一化。',
    explanation: '注意力矩阵每一行是一个离散概率分布；Q、K 使用不同投影时矩阵一般不对称，列和也不必为 1。',
  },
  {
    id: 'attention-scaling', difficulty: 2,
    prompt: '点积注意力为什么把 qᵀk 除以 √dk？',
    options: [{ id: 'correct', label: '控制得分方差，避免维度增大时 softmax 过度饱和' }, { id: 'normalize', label: '保证每个查询和键都是单位向量' }, { id: 'linear', label: '把 O(N²) 复杂度降为 O(N)' }],
    correctOptionId: 'correct', hint: '独立分量的 dk 项点积，其方差会随 dk 增长。',
    explanation: '若分量方差约为 1，点积方差约为 dk；除以 √dk 后方差回到常数量级，使 softmax 梯度更稳定。',
  },
  {
    id: 'attention-position', difficulty: 3,
    prompt: '不加入任何位置编码时，对输入 token 做同一置换会怎样？',
    options: [{ id: 'correct', label: '自注意力输出会按同一方式置换，即置换等变' }, { id: 'invariant', label: '输出保持逐位置完全不变，即置换不变' }, { id: 'random', label: '注意力权重会随机失效' }],
    correctOptionId: 'correct', hint: '“等变”意味着输入怎样重排，输出也怎样重排。',
    explanation: '内容注意力本身没有顺序坐标，因此只能跟随 token 一起重排；位置编码负责注入顺序或空间位置。',
  },
];

export const chapter09NaturalLanguageExercises: LearningExercise[] = [
  {
    id: 'embedding-shape', difficulty: 1,
    prompt: '词表大小为 |V|、嵌入维度为 D 时，embedding 查找表的形状是什么？',
    options: [{ id: 'correct', label: '|V|×D，每个 token id 选择一行' }, { id: 'transpose', label: 'D×|V|，每个 token id 选择一列且这是唯一约定' }, { id: 'square', label: '|V|×|V|' }],
    correctOptionId: 'correct', hint: '一共有 |V| 个 token，每个 token 需要一个 D 维向量。',
    explanation: '按教材的行向量约定，one-hot 向量乘以 |V|×D 的矩阵等价于查找对应行。',
  },
  {
    id: 'bag-order', difficulty: 2,
    prompt: '为什么词袋表示无法区分“狗追猫”和“猫追狗”？',
    options: [{ id: 'correct', label: '两句话的词频计数完全相同，词序已被丢弃' }, { id: 'vocab', label: '词袋不能表示“猫”或“狗”' }, { id: 'length', label: '词袋只适用于不同长度文本' }],
    correctOptionId: 'correct', hint: '比较两个句子的每个词出现次数。',
    explanation: '词袋是计数向量，对 token 置换不变；这对主题统计有用，却不适合需要句法角色的任务。',
  },
  {
    id: 'bptt-gradient', difficulty: 3,
    prompt: '标准 RNN 的长程梯度为什么容易消失或爆炸？',
    options: [{ id: 'correct', label: '梯度包含跨时间 Jacobian 的连乘，其范数会指数衰减或增长' }, { id: 'softmax', label: '因为输出 softmax 的概率和为 1' }, { id: 'tokens', label: '因为 token id 是整数' }],
    correctOptionId: 'correct', hint: '把 hT 对早期 hk 的导数用链式法则展开。',
    explanation: 'BPTT 反复乘以激活导数与循环权重矩阵；若典型谱范数小于或大于 1，长距离信号就会快速消失或爆炸。',
  },
];

export const chapter09LanguageModelExercises: LearningExercise[] = [
  {
    id: 'causal-mask', difficulty: 1,
    prompt: '训练自回归 decoder 时，因果掩码的核心作用是什么？',
    options: [{ id: 'correct', label: '阻止位置 n 读取未来 token，只允许条件于 y<n' }, { id: 'padding', label: '删除词表中的低频 token' }, { id: 'bidirectional', label: '让每个位置同时读取左右文' }],
    correctOptionId: 'correct', hint: '生成时未来 token 尚不存在。',
    explanation: '掩码让训练条件与生成条件一致；否则模型可从未来位置直接抄答案，低训练损失并不代表能生成。',
  },
  {
    id: 'greedy-sequence', difficulty: 2,
    prompt: '为什么逐步 greedy 解码不保证得到联合概率最高的完整序列？',
    options: [{ id: 'correct', label: '当前最高概率 token 可能把后续带入低概率分支' }, { id: 'deterministic', label: '因为 greedy 具有随机性' }, { id: 'normalization', label: '因为每步概率没有归一化' }],
    correctOptionId: 'correct', hint: '局部最优选择不必组成全局最优路径。',
    explanation: '完整序列概率是各条件概率的乘积；beam search 保留多个前缀正是为了减少过早丢掉更优完整路径的风险。',
  },
  {
    id: 'cross-attention', difficulty: 3,
    prompt: 'encoder-decoder Transformer 的 cross-attention 中，Q、K、V 通常来自哪里？',
    options: [{ id: 'correct', label: 'Q 来自 decoder，K、V 来自 encoder 输出' }, { id: 'encoder', label: 'Q、K、V 全来自 encoder 输入' }, { id: 'decoder', label: 'Q、K、V 全来自 decoder 当前层' }],
    correctOptionId: 'correct', hint: 'decoder 正在查询源序列中与当前生成位置相关的信息。',
    explanation: 'decoder 状态形成查询，encoder 表示提供键和值；这与两侧各自的 self-attention 是不同的注意力子层。',
  },
];

export const chapter09MultimodalExercises: LearningExercise[] = [
  {
    id: 'vit-patches', difficulty: 1,
    prompt: '224×224 图像用不重叠的 16×16 patch 分词，不计分类 token 时共有多少个 token？',
    options: [{ id: 'correct', label: '14×14=196' }, { id: 'pixels', label: '224×224=50176' }, { id: 'wrong', label: '16×16=256' }],
    correctOptionId: 'correct', hint: '高和宽各自除以 patch 边长。',
    explanation: '每个轴有 224/16=14 个 patch，因此总数 N=HW/P²=196；注意力配对规模是 N²。',
  },
  {
    id: 'audio-representation', difficulty: 2,
    prompt: '教材介绍音频 Transformer 时，为什么常先把波形转成 mel spectrogram？',
    options: [{ id: 'correct', label: '它把信号组织成时间×感知频率表示，便于形成声学 token' }, { id: 'lossless', label: '它保证完全无损并自动生成文字' }, { id: 'position', label: '它使位置编码不再需要' }],
    correctOptionId: 'correct', hint: 'mel 频带按听觉感知设计。',
    explanation: 'mel spectrogram 是时间-频率矩阵，可像图像一样切片或经编码器转成 token；它不是自动转写，也没有消除时间顺序。',
  },
  {
    id: 'unified-tokens', difficulty: 3,
    prompt: '“只要能 token 化输入并解码输出，就可能使用 Transformer”这句话的边界是什么？',
    options: [{ id: 'correct', label: '统一架构不等于统一表示；各模态仍需合适的 token 化、位置和输出解码' }, { id: 'same', label: '所有模态可直接共用完全相同的原始 token' }, { id: 'free', label: 'token 数量与二次注意力成本无关' }],
    correctOptionId: 'correct', hint: '第 12.4 章的创新重点恰恰在输入输出表示。',
    explanation: '核心层可以复用，但图像 patch、离散图像码、声学单元和文本子词的统计结构不同；token 数量还直接决定注意力成本。',
  },
];
