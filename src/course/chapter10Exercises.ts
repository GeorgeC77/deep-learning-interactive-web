import type { LearningExercise } from '@/components/ExercisePanel';

export const chapter10GraphBasicsExercises: LearningExercise[] = [
  {
    id: 'permutation-matrices', difficulty: 1,
    prompt: '用置换矩阵 P 重新编号节点后，节点特征 X 与邻接矩阵 A 应分别怎样变换？',
    options: [{ id: 'correct', label: 'X′=PX，A′=PAPᵀ' }, { id: 'left', label: 'X′=XP，A′=PA' }, { id: 'fixed', label: 'X 与 A 都保持逐元素不变' }],
    correctOptionId: 'correct', hint: '节点特征只重排行，邻接矩阵的两个节点索引都要重排。',
    explanation: 'P 重排节点索引。X 只有节点这一行索引，所以左乘 P；A 的行列都对应节点，所以必须同时变成 PAPᵀ。',
  },
  {
    id: 'node-vs-graph-symmetry', difficulty: 2,
    prompt: '同一张图换一套节点编号后，节点分类输出与图分类输出应怎样变化？',
    options: [{ id: 'correct', label: '节点输出按 P 重排，图输出保持不变' }, { id: 'both-fixed', label: '两种输出都逐元素不变' }, { id: 'both-permute', label: '两种输出都按 P 重排' }],
    correctOptionId: 'correct', hint: '节点预测仍绑定具体节点；整图标签不绑定任何节点编号。',
    explanation: '节点级映射应置换等变，y(PX,PAPᵀ)=Py(X,A)；图级映射应置换不变，y(PX,PAPᵀ)=y(X,A)。',
  },
  {
    id: 'transductive-inductive', difficulty: 3,
    prompt: '半监督节点分类中，训练时图里包含未标注测试节点，但损失只在训练节点上计算。这属于什么设置？',
    options: [{ id: 'correct', label: '直推学习：未标注节点可参与消息传递' }, { id: 'inductive', label: '归纳学习：测试节点训练时完全不可见' }, { id: 'leakage', label: '必然属于标签泄漏' }],
    correctOptionId: 'correct', hint: '区分“看见节点与边”与“看见节点标签”。',
    explanation: '直推设置允许训练时利用整张图的结构与未标注节点特征，只是不把测试标签放入损失；归纳设置的测试节点或测试图训练时不存在。',
  },
];

export const chapter10MessagePassingExercises: LearningExercise[] = [
  {
    id: 'aggregation-order', difficulty: 1,
    prompt: '把某节点的三个邻居按另一顺序枚举，sum/mean 聚合结果会怎样？',
    options: [{ id: 'correct', label: '不变，因为加法与均值对顺序不敏感' }, { id: 'permute', label: '输出坐标会按邻居顺序重排' }, { id: 'random', label: '只有训练后才能判断' }],
    correctOptionId: 'correct', hint: '邻域在图中是集合或多重集合，不是序列。',
    explanation: 'sum、mean、max 都是对邻域排列不变的聚合；再对每个节点使用共享 update，整层就对节点重编号保持等变。',
  },
  {
    id: 'receptive-field', difficulty: 2,
    prompt: '不使用跳边或全局节点时，堆叠 L 层一跳消息传递后，节点表示最多直接依赖多远的节点？',
    options: [{ id: 'correct', label: 'L 跳邻域' }, { id: 'one', label: '始终只有一跳邻域' }, { id: 'all', label: '无论 L 多大都立即依赖全图' }],
    correctOptionId: 'correct', hint: '每一层只把感受野向外扩展一跳。',
    explanation: '第 1 层看到一跳邻居，第 2 层通过邻居看到两跳节点，归纳可得第 L 层最多覆盖 L 跳邻域。',
  },
  {
    id: 'readout-and-edge', difficulty: 3,
    prompt: '下面哪一组分别给出了教材中的边存在概率与置换不变图读出？',
    options: [{ id: 'correct', label: 'σ(hnᵀhm)；f(Σn hn)' }, { id: 'wrong-softmax', label: 'softmax(hn)；按节点编号拼接所有 hn' }, { id: 'wrong-order', label: 'σ(n−m)；只读取第 1 个节点' }],
    correctOptionId: 'correct', hint: '教材式 (13.22) 使用点积，式 (13.23) 先对节点求和。',
    explanation: '点积经 sigmoid 可得到边概率；节点嵌入之和与节点枚举顺序无关，因此其后的函数给出置换不变的图级预测。',
  },
];

export const chapter10GeneralGraphExercises: LearningExercise[] = [
  {
    id: 'gat-normalization', difficulty: 1,
    prompt: 'GAT 中 αuv 表示中心节点 v 聚合邻居 u 的权重。softmax 分母应对哪个集合求和？',
    options: [{ id: 'correct', label: '固定中心 v，对 k∈N(v) 求和' }, { id: 'source', label: '固定邻居 u，对所有中心节点求和' }, { id: 'global', label: '对整张图所有边一次归一化' }],
    correctOptionId: 'correct', hint: '每个中心节点都形成自己的一组邻居权重。',
    explanation: '对固定 v，{αkv:k∈N(v)} 是一组正权重且和为 1；换一个中心节点就要重新计算一套 softmax。',
  },
  {
    id: 'over-smoothing', difficulty: 2,
    prompt: '深层 GNN 出现过平滑时，哪项措施最直接保留浅层或节点自身信息？',
    options: [{ id: 'correct', label: '残差连接或拼接多层表示' }, { id: 'deeper', label: '继续无条件增加消息传递层数' }, { id: 'sort', label: '固定按节点编号排序' }],
    correctOptionId: 'correct', hint: '教材式 (13.36)–(13.37) 给出了两条信息旁路。',
    explanation: '残差把上一层表示直接加回，层间拼接则让预测器读取不同传播深度的信息；两者都能减弱反复混合造成的同质化。',
  },
  {
    id: 'geometric-symmetry', difficulty: 3,
    prompt: '若分子整体平移、旋转或镜像，哪种消息输入天然保持不变？',
    options: [{ id: 'correct', label: '成对平方距离 ‖xn−xm‖²' }, { id: 'absolute', label: '绝对坐标 xn' }, { id: 'axis', label: '两点的 x 轴坐标差' }],
    correctOptionId: 'correct', hint: '正交变换 Q 满足 QᵀQ=I，平移在坐标差中抵消。',
    explanation: '对 x′=Qx+t，有 ‖x′n−x′m‖²=‖Q(xn−xm)‖²=‖xn−xm‖²；绝对坐标和单轴分量依赖坐标系。',
  },
];
