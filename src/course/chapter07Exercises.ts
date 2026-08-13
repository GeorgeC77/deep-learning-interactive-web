import type { LearningExercise } from '@/components/ExercisePanel';

export const chapter07ComputerVisionExercises: LearningExercise[] = [
  { id: 'vision-output', difficulty: 1, prompt: '分类、检测、语义分割的输出粒度依次是什么？', options: [{ id: 'correct', label: '全局类别；对象集合与框；逐像素类别' }, { id: 'reverse', label: '逐像素类别；全局类别；对象集合' }, { id: 'same', label: '三者都只输出一个类别' }], correctOptionId: 'correct', hint: '问“整张图、每个对象、还是每个像素”。', explanation: '三种任务保留的空间信息不同，因此网络头和评价方式也不同。' },
  { id: 'vision-tensor', difficulty: 2, prompt: '一张 224×224 RGB 图像通常包含多少个标量强度？', options: [{ id: 'correct', label: '224×224×3' }, { id: 'gray', label: '224×224' }, { id: 'classes', label: '只有 3 个' }], correctOptionId: 'correct', hint: 'RGB 是三个通道。', explanation: '图像是 H×W×C 张量；视频或体数据还会增加时间/深度维。' },
  { id: 'vision-parameters', difficulty: 3, prompt: '为什么卷积首层比同宽全连接首层更适合百万像素图像？', options: [{ id: 'sharing', label: '局部连接和跨位置共享使参数量不随图像面积同速增长' }, { id: 'pixels', label: '卷积会在输入前删除全部像素' }, { id: 'labels', label: '卷积不需要训练标签' }], correctOptionId: 'sharing', hint: '区分连接次数与独立参数。', explanation: 'CNN 把图像的局部性和重复结构写入架构，显著减少自由度和样本需求。' },
];

export const chapter07ConvolutionExercises: LearningExercise[] = [
  { id: 'conv-output', difficulty: 1, prompt: '输入 I=7、核 K=3、填充 P=1、步幅 S=2 时，输出长度是多少？', options: [{ id: 'four', label: '4' }, { id: 'three', label: '3' }, { id: 'seven', label: '7' }], correctOptionId: 'four', hint: '代入 floor((I+2P-K)/S)+1。', explanation: 'floor((7+2-3)/2)+1=4。' },
  { id: 'conv-equivariance', difficulty: 2, prompt: '标准步幅 1 卷积的特征图对平移首先体现什么性质？', options: [{ id: 'equivariant', label: '输入平移，输出相应平移（等变）' }, { id: 'invariant', label: '输出数组始终完全不变' }, { id: 'permutation', label: '对任意像素置换等变' }], correctOptionId: 'equivariant', hint: '特征位置会跟着目标移动。', explanation: '共享核带来平移等变；池化、步幅和边界处理会使精确关系受限。' },
  { id: 'conv-feature', difficulty: 3, prompt: '在固定 ||x||₂ 下，哪个图像块使 wᵀx 最大？', options: [{ id: 'parallel', label: '与滤波器 w 同方向的 x=αw' }, { id: 'orthogonal', label: '与 w 正交的 x' }, { id: 'zero', label: '无条件取 x=0' }], correctOptionId: 'parallel', hint: '使用 Cauchy-Schwarz 不等式。', explanation: 'wᵀx≤||w||||x||，相等当且仅当 x 与 w 同方向；这解释了核作为特征检测器。' },
];

export const chapter07VisualizationExercises: LearningExercise[] = [
  { id: 'viz-gradcam', difficulty: 1, prompt: 'Grad-CAM 为什么使用最后一个卷积层而非最后的全连接层？', options: [{ id: 'spatial', label: '它仍保留空间位置，同时具有较高语义层次' }, { id: 'no-gradient', label: '全连接层无法求梯度' }, { id: 'pixels', label: '它与原图像素尺寸总是完全相同' }], correctOptionId: 'spatial', hint: '需要把类别证据定位回图像区域。', explanation: '最后卷积层兼顾语义和空间网格；后续全连接会丢失定位信息。' },
  { id: 'viz-saliency', difficulty: 2, prompt: '某像素梯度接近零，能否断言该像素对预测不重要？', options: [{ id: 'no', label: '不能，饱和等因素会让局部梯度很小' }, { id: 'yes', label: '能，梯度为零等价于因果无关' }, { id: 'delete', label: '应该直接删除全部零梯度像素' }], correctOptionId: 'no', hint: '比较局部敏感度和遮挡干预。', explanation: '显著性通常是当前点附近的敏感度，而非全局或因果重要性。' },
  { id: 'viz-deepdream', difficulty: 3, prompt: 'DeepDream 迭代时主要沿哪个方向修改输入图像？', options: [{ id: 'ascent', label: '沿选定隐藏激活目标的输入梯度上升' }, { id: 'random', label: '完全随机替换像素' }, { id: 'labels', label: '只修改训练标签' }], correctOptionId: 'ascent', hint: '目标是放大已有隐藏响应。', explanation: '它对输入做梯度上升以增加选定层激活，并配合平滑与像素裁剪。' },
];

export const chapter07DetectionExercises: LearningExercise[] = [
  { id: 'detect-iou', difficulty: 1, prompt: '两个完全相同且面积非零的边界框，IoU 是多少？', options: [{ id: 'one', label: '1' }, { id: 'zero', label: '0' }, { id: 'two', label: '2' }], correctOptionId: 'one', hint: '交集与并集面积相等。', explanation: 'IoU=|A∩B|/|A∪B|，相同框的比值为 1。' },
  { id: 'detect-nms', difficulty: 2, prompt: '类别感知 NMS 是否应让“行人”框抑制高重叠的“自行车”框？', options: [{ id: 'no', label: '不应，不同类别分别执行抑制' }, { id: 'yes', label: '应，只要 IoU 高就无条件抑制' }, { id: 'score', label: '应删除分数更高的框' }], correctOptionId: 'no', hint: '同一区域可包含不同语义对象。', explanation: '教材描述按对象类别依次执行 NMS；类别无关抑制是另一个需明确选择的变体。' },
  { id: 'detect-fast', difficulty: 3, prompt: '哪项准确区分 Fast R-CNN 与 Faster R-CNN？', options: [{ id: 'correct', label: 'Fast R-CNN 使用外部候选区域；RPN 是 Faster R-CNN 的扩展' }, { id: 'same', label: '两者都必须由同一个 RPN 生成候选' }, { id: 'window', label: 'Fast R-CNN 对每个像素独立训练完整 CNN' }], correctOptionId: 'correct', hint: '教材在 10.4.6 先介绍 region proposal，再提后续 RPN。', explanation: 'Fast R-CNN 共享卷积特征并处理候选区域；Faster R-CNN 用可训练 RPN 取代外部提议。' },
];

export const chapter07SegmentationExercises: LearningExercise[] = [
  { id: 'segment-output', difficulty: 1, prompt: 'C 类语义分割网络在每个像素通常输出什么？', options: [{ id: 'probabilities', label: 'C 个类别分数或概率' }, { id: 'box', label: '一个边界框' }, { id: 'global', label: '整图唯一标量' }], correctOptionId: 'probabilities', hint: '输出张量与输入共享空间网格。', explanation: '语义分割逐像素分类，最后常用 1×1 卷积把通道数降到 C。' },
  { id: 'segment-skip', difficulty: 2, prompt: 'U-Net 的同分辨率跳跃连接主要补回什么？', options: [{ id: 'detail', label: '下采样丢失的高分辨率定位与边界细节' }, { id: 'labels', label: '测试集标签' }, { id: 'optimizer', label: '优化器状态' }], correctOptionId: 'detail', hint: '编码器深层语义强，但空间精度下降。', explanation: '跳连把编码器的高分辨率特征拼接到对应解码层，兼顾语义与定位。' },
  { id: 'segment-size', difficulty: 3, prompt: '含 4 次二倍下采样的 U-Net，输入边长至少需按哪个倍数对齐以免产生小数尺寸？', options: [{ id: 'sixteen', label: '2⁴=16' }, { id: 'four', label: '4' }, { id: 'eight', label: '8' }], correctOptionId: 'sixteen', hint: '每次将尺寸除以 2。', explanation: '四次下采样要求边长可被 16 整除；否则需明确填充和输出裁剪策略。' },
];

export const chapter07StyleTransferExercises: LearningExercise[] = [
  { id: 'style-gram', difficulty: 1, prompt: 'Gram 风格矩阵 Fkk′ 统计什么？', options: [{ id: 'channels', label: '不同特征通道在所有空间位置上的共现' }, { id: 'pixels', label: '每个像素的绝对坐标' }, { id: 'labels', label: '训练标签频率' }], correctOptionId: 'channels', hint: '对 i,j 空间索引求和。', explanation: '空间求和弱化具体布局，保留通道相关性，因此适合纹理统计。' },
  { id: 'style-permutation', difficulty: 2, prompt: '若对所有特征通道施加相同的空间位置置换，Gram 矩阵如何变化？', options: [{ id: 'same', label: '保持不变' }, { id: 'transpose', label: '必然转置' }, { id: 'zero', label: '必然变为零' }], correctOptionId: 'same', hint: '内积不依赖列的排列顺序。', explanation: '共享列置换不改变任意两通道的内积，这也说明 Gram 表示不保存具体布局。' },
  { id: 'style-objective', difficulty: 3, prompt: '只最小化风格损失、完全不约束内容，最可能出现什么？', options: [{ id: 'layout', label: '得到纹理统计相似但内容布局不受保证的图像' }, { id: 'copy', label: '必然精确复制内容图' }, { id: 'classification', label: '自动变成目标检测器' }], correctOptionId: 'layout', hint: 'Gram 矩阵丢弃了“哪里有什么”。', explanation: '内容项负责结构，风格项负责通道共现；二者共同约束才形成可辨识的风格化内容。' },
];
