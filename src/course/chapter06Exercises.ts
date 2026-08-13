import type { LearningExercise } from '@/components/ExercisePanel';

export const chapter06InductiveBiasExercises: LearningExercise[] = [
  { id: 'bias-underdetermined', difficulty: 1, prompt: '有限训练数据通常对应多个零训练误差解。要对新输入作预测，还需要什么？', options: [{ id: 'bias', label: '归纳偏置，用于偏好某类解' }, { id: 'none', label: '不需要任何额外假设' }, { id: 'memorize', label: '只需把训练集顺序记住' }], correctOptionId: 'bias', hint: '训练数据只约束已观测点。', explanation: '从多个与训练数据一致的函数中选出一个可泛化解，必然依赖显式或隐式偏置。' },
  { id: 'bias-invariance', difficulty: 2, prompt: '图像平移 T 后，分类标签不变而分割图也随之平移。两项性质分别是什么？', options: [{ id: 'correct', label: '分类不变；分割等变' }, { id: 'reverse', label: '分类等变；分割不变' }, { id: 'same', label: '两者都必须输出完全相同数组' }], correctOptionId: 'correct', hint: '不变是 f(Tx)=f(x)，等变是 f(Tx)=Tf(x)。', explanation: '分类只关心物体身份，平移后标签不变；像素级分割必须与输入同步平移。' },
  { id: 'bias-augmentation', difficulty: 3, prompt: '哪种数据增强最可能引入错误归纳偏置？', options: [{ id: 'unsafe', label: '对数字 6/9 分类任务无条件旋转 180° 且保留标签' }, { id: 'safe', label: '在允许的小范围内改变亮度' }, { id: 'validate', label: '先验证变换是否保持任务标签' }], correctOptionId: 'unsafe', hint: '增强必须保持目标语义。', explanation: '若变换改变标签，增强会系统性制造错误样本；偏置必须匹配数据生成过程。' },
];

export const chapter06WeightDecayExercises: LearningExercise[] = [
  { id: 'decay-update', difficulty: 1, prompt: '对 Ẽ(w)=E(w)+λ||w||²/2 做一步 SGD，更新式是什么？', options: [{ id: 'correct', label: 'w←(1-ηλ)w-η∇E' }, { id: 'plus', label: 'w←(1+ηλ)w-η∇E' }, { id: 'gradient', label: 'w←w-λ∇E' }], correctOptionId: 'correct', hint: '正则项梯度为 λw。', explanation: 'SGD 中 L2 penalty 产生乘法收缩 (1-ηλ)w；自适应预条件下与解耦 decay 不再一般等价。' },
  { id: 'decay-bias', difficulty: 2, prompt: '教材的一致正则化器为何通常把 bias 与各层 weight 分开处理？', options: [{ id: 'transform', label: '输入/输出平移与缩放会要求不同的变换性质和超参数' }, { id: 'no-gradient', label: 'bias 从来没有梯度' }, { id: 'integer', label: 'bias 必须是整数' }], correctOptionId: 'transform', hint: '考虑改变输入原点。', explanation: '对所有参数施加同一惩罚会破坏某些输入/输出重新参数化下的映射一致性。' },
  { id: 'decay-lasso', difficulty: 3, prompt: '为什么 q=1 的 Lasso 比 q=2 的二次正则更容易得到精确零系数？', options: [{ id: 'corner', label: 'L1 约束区域有落在坐标轴上的尖角' }, { id: 'smooth', label: 'L1 在原点比 L2 更光滑' }, { id: 'no-lambda', label: 'L1 不需要正则系数' }], correctOptionId: 'corner', hint: '观察教材图 9.6 的菱形与圆形。', explanation: '误差等高线与 L1 菱形边界相切时常落在坐标轴尖角，从而产生稀疏解。' },
];

export const chapter06LearningCurveExercises: LearningExercise[] = [
  { id: 'curve-early-stop', difficulty: 1, prompt: '训练误差继续下降、验证误差已连续上升时，早停应依据哪一项？', options: [{ id: 'validation', label: '保存验证误差最低时的参数' }, { id: 'training', label: '等训练误差严格为零' }, { id: 'test', label: '反复查看测试集选择 epoch' }], correctOptionId: 'validation', hint: '测试集要留作最终评估。', explanation: '早停以独立验证集选择训练时刻，并恢复最佳 checkpoint；测试集不能参与选择。' },
  { id: 'curve-complexity', difficulty: 2, prompt: '为什么早停可被看作控制有效模型复杂度？', options: [{ id: 'trajectory', label: '从小初始化出发，训练时间决定沿优化轨迹走多远' }, { id: 'parameters', label: '它会永久删除一半参数' }, { id: 'labels', label: '它会减少类别数' }], correctOptionId: 'trajectory', hint: '比较教材图 9.8 与权重衰减图。', explanation: '在二次近似中，提前停止会抑制某些曲率方向，产生与权重衰减相似但不完全相同的效果。' },
  { id: 'curve-double-descent', difficulty: 3, prompt: '双下降的第二次下降是否意味着任意过参数化模型都必然泛化良好？', options: [{ id: 'no', label: '否，取决于数据、噪声、优化和隐式/显式正则化' }, { id: 'yes', label: '是，参数超过样本数就必然更好' }, { id: 'train', label: '只要训练误差为零就能保证' }], correctOptionId: 'no', hint: '教材描述的是现象而非无条件定理。', explanation: '插值阈值附近可能出现峰值，第二次下降也依赖具体问题和训练过程。' },
];

export const chapter06ParameterSharingExercises: LearningExercise[] = [
  { id: 'sharing-gradient', difficulty: 1, prompt: '同一个共享参数在计算图中被使用 20 次，它的梯度如何得到？', options: [{ id: 'sum', label: '把 20 个使用位置的梯度贡献相加' }, { id: 'one', label: '只保留第一次使用的贡献' }, { id: 'average', label: '无条件除以 20' }], correctOptionId: 'sum', hint: '一个变量通过多条路径影响损失。', explanation: '自动微分会把所有引用同一参数的路径贡献累加；是否再平均取决于损失定义。' },
  { id: 'sharing-count', difficulty: 2, prompt: '卷积与同感受野的局部连接层，哪项通常相同、哪项不同？', options: [{ id: 'correct', label: '连接数相同；卷积独立参数更少' }, { id: 'reverse', label: '参数相同；卷积连接更多' }, { id: 'all', label: '两者在所有方面完全相同' }], correctOptionId: 'correct', hint: '共享改变 learnable scalars，不删除每个位置的计算连接。', explanation: '卷积跨位置复用同一核，所以保留局部连接图但减少自由度。' },
  { id: 'sharing-soft', difficulty: 3, prompt: '软权重共享与硬共享的区别是什么？', options: [{ id: 'soft', label: '软共享用正则鼓励权重聚类，不强制严格相等' }, { id: 'hard', label: '软共享要求所有权重恒等于零' }, { id: 'none', label: '软共享不包含任何可学习超参数' }], correctOptionId: 'soft', hint: '教材用高斯混合先验描述多组中心。', explanation: '软共享允许权重围绕多个学习到的中心聚类，比硬 tying 更灵活但也更复杂。' },
];

export const chapter06ResidualExercises: LearningExercise[] = [
  { id: 'residual-jacobian', difficulty: 1, prompt: '残差块 y=x+F(x) 对输入的 Jacobian 是什么？', options: [{ id: 'identity', label: 'I+JF' }, { id: 'only', label: '只有 JF' }, { id: 'product', label: 'I·JF' }], correctOptionId: 'identity', hint: '分别对 x 和 F(x) 求导。', explanation: '恒等支路贡献 I，残差支路贡献 JF，因此整体 Jacobian 是 I+JF。' },
  { id: 'residual-dimension', difficulty: 2, prompt: '输入输出维度不同时如何建立残差连接？', options: [{ id: 'projection', label: '在跳连支路使用可学习投影 W，使维度匹配' }, { id: 'ignore', label: '直接相加不同长度向量' }, { id: 'delete', label: '删除全部残差分支' }], correctOptionId: 'projection', hint: '教材式 (9.41)。', explanation: '可用 z_l=F_l(z_{l-1})+Wz_{l-1} 改变跳连维度。' },
  { id: 'residual-failure', difficulty: 3, prompt: '为什么残差连接不能无条件保证梯度稳定？', options: [{ id: 'cancel', label: '若 JF≈-I，I+JF 仍会接近零' }, { id: 'always', label: '因为恒等支路从不传梯度' }, { id: 'no-depth', label: '因为残差网络不能堆叠' }], correctOptionId: 'cancel', hint: '单位项也可能被残差 Jacobian 抵消。', explanation: '残差结构改善优化几何但不是数学保险，还需初始化、归一化和优化设置。' },
];

export const chapter06ModelAveragingExercises: LearningExercise[] = [
  { id: 'ensemble-independent', difficulty: 1, prompt: 'M 个等方差且误差互不相关的模型取平均，误差方差变为多少？', options: [{ id: 'divide', label: 'σ²/M' }, { id: 'same', label: 'σ²' }, { id: 'multiply', label: 'Mσ²' }], correctOptionId: 'divide', hint: '平均时系数为 1/M。', explanation: '互不相关时交叉协方差为零，M 个方差项除以 M² 后得到 σ²/M。' },
  { id: 'ensemble-correlation', difficulty: 2, prompt: '若模型误差高度相关，增加模型数量的收益如何？', options: [{ id: 'floor', label: '边际收益递减，并受相关性造成的方差下限限制' }, { id: 'zero', label: '无论相关性如何都严格降到零' }, { id: 'grow', label: '相关性越高收益越大' }], correctOptionId: 'floor', hint: '令 M→∞ 查看 σ²[ρ+(1-ρ)/M]。', explanation: '在等相关模型下，极限方差是 σ²ρ；多样性与单模型质量同样重要。' },
  { id: 'dropout-average', difficulty: 3, prompt: '关于 Dropout 与模型平均，哪项最准确？', options: [{ id: 'approx', label: '它训练共享参数的随机子网络，测试时缩放或 MC dropout 近似平均' }, { id: 'exact', label: '它精确独立训练并枚举全部 2^M 个网络' }, { id: 'single', label: '它与模型组合完全无关' }], correctOptionId: 'approx', hint: '子网络共享参数，通常只采样极少部分 mask。', explanation: 'Dropout 可由近似模型平均理解，但并不等价于独立训练所有子网络。' },
];
