const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const GENERATED_DIR = path.join(ROOT, 'src', 'pages', 'generated');
const APP_TSX = path.join(ROOT, 'src', 'App.tsx');
const MANIFEST_TS = path.join(ROOT, 'src', 'course', 'manifest.ts');

function toPascal(str) {
  return str
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');
}

function pathToComponentName(sectionPath) {
  const parts = sectionPath.replace(/^\//, '').split('/');
  return parts.map(toPascal).join('') + 'Page';
}

function generatePage({ componentName, sectionPath, icon, summary, concepts, demo }) {
  const conceptsJsx = concepts
    .map((c) => {
      const formulaLine = c.formula
        ? `      formula: String.raw\`${c.formula}\`,\n`
        : '';
      return `    {\n      title: ${JSON.stringify(c.title)},\n      description: ${JSON.stringify(c.description)},\n${formulaLine}    }`;
    })
    .join(',\n');

  const demoJsx = demo
    ? `    demo={{\n      title: ${JSON.stringify(demo.title)},\n      label: ${JSON.stringify(demo.label)},\n      param: ${demo.param},\n      min: ${demo.min},\n      max: ${demo.max},\n      step: ${demo.step},\n      compute: ${demo.compute.toString()},\n      formula: String.raw\`${demo.formula}\`,\n    }}`
    : '';

  return `import BishopSectionPage from '@/components/BishopSectionPage';\nimport { ${icon} } from 'lucide-react';\n\nexport default function ${componentName}() {\n  return (\n    <BishopSectionPage\n      sectionPath="${sectionPath}"\n      heroIcon={<${icon} className="w-9 h-9 text-blue-600" />}\n      summary={${JSON.stringify(summary)}}\n      concepts={[\n${conceptsJsx}\n      ]}\n${demoJsx}\n    />\n  );\n}\n`;
}

// -----------------------------------------------------------------------------
// Content for every draft section.
// Each entry: icon, summary, concepts (2-4). Demo is optional but preferred.
// Formulas are plain LaTeX strings (the generator wraps them in String.raw).
// Compute is a real arrow function; its .toString() is emitted into the page.
// -----------------------------------------------------------------------------
const SECTIONS = {
  // =========================================================================
  // Prerequisite
  // =========================================================================
  '/prerequisite/ch02/transformation': {
    icon: 'Shuffle',
    summary:
      '密度变换描述随机变量经过可逆函数映射后，新变量的概率密度如何由原密度与 Jacobian 行列式共同决定。',
    concepts: [
      {
        title: '一元变量替换',
        description: '对单调可逆变换 y = g(x)，新密度等于原密度乘以导数绝对值的倒数。',
        formula: String.raw`p_y(y) = p_x(g^{-1}(y)) \left| \frac{dx}{dy} \right|`,
      },
      {
        title: '多元密度变换',
        description: '多维情形下用 Jacobian 行列式刻画体积元的伸缩，保证总概率仍为 1。',
        formula: String.raw`p_y(\mathbf{y}) = p_x(\mathbf{x}) \left| \det \frac{\partial \mathbf{x}}{\partial \mathbf{y}} \right|`,
      },
      {
        title: '标准化技巧',
        description: '通过可逆变换将复杂分布转化为简单分布（如标准高斯），便于采样与推断。',
      },
    ],
    demo: {
      title: '线性缩放对密度的影响',
      label: '缩放系数 a',
      param: 1.0,
      min: 0.2,
      max: 3.0,
      step: 0.1,
      compute: (a) => ({
        label: 'p_y(1)',
        value: (Math.exp(-a * a / 2) / Math.sqrt(2 * Math.PI)) * a,
        display: String.raw`p_y(1)=\frac{1}{\sqrt{2\pi}}e^{-${a.toFixed(1)}^2/2}\cdot ${a.toFixed(1)}`,
      }),
      formula: String.raw`p_y(y) = p_x(ay) \cdot a`,
    },
  },

  '/prerequisite/ch03/periodic': {
    icon: 'RotateCw',
    summary:
      '周期变量（如角度、方向）不能用普通高斯直接建模；Von Mises 分布是圆周上的自然类比。',
    concepts: [
      {
        title: 'Von Mises 分布',
        description: '在圆周上定义的位置-尺度分布，集中参数 m 控制分布尖锐程度。',
        formula: String.raw`p(\theta \mid \theta_0, m) = \frac{1}{2\pi I_0(m)} \exp\{ m \cos(\theta - \theta_0) \}`,
      },
      {
        title: '圆周矩',
        description: '用复指数或 (cos θ, sin θ) 计算均值，避免 0°/360° 不连续问题。',
      },
      {
        title: '与高斯分布的关系',
        description: '当 m 很大时，Von Mises 在峰值附近近似高斯；m=0 时退化为圆周均匀分布。',
      },
    ],
    demo: {
      title: 'Von Mises 分布峰值',
      label: '集中参数 m',
      param: 2.0,
      min: 0.0,
      max: 8.0,
      step: 0.2,
      compute: (m) => {
        const value = m < 0.5 ? (1 / (2 * Math.PI)) * (1 + (m * m) / 4) : Math.sqrt(m / (2 * Math.PI));
        return {
          label: 'p(θ₀) 近似',
          value,
          display: String.raw`p(\theta_0)\approx ${value.toFixed(3)}`,
        };
      },
      formula: String.raw`p(\theta_0) \approx \sqrt{\frac{m}{2\pi}} \quad (m \gg 1)`,
    },
  },

  // =========================================================================
  // Ch 3 (manifest ch03): Deep Neural Networks
  // =========================================================================
  '/ch03/error-functions': {
    icon: 'Activity',
    summary:
      '误差函数将网络输出与目标之间的差距量化为可优化的标量，不同任务（回归、分类）对应不同的概率假设与损失。',
    concepts: [
      {
        title: '回归：平方误差',
        description: '假设目标噪声服从高斯分布，最大似然等价于最小化输出与目标的平方距离。',
        formula: String.raw`E = \frac{1}{2} \sum_{n=1}^{N} \| y(x_n, w) - t_n \|^2`,
      },
      {
        title: '二分类：交叉熵',
        description: '对二元标签使用 sigmoid 输出，最大似然导出交叉熵损失。',
        formula: String.raw`E = -\sum_{n} \left[ t_n \ln y_n + (1-t_n) \ln(1-y_n) \right]`,
      },
      {
        title: '多分类：Softmax 交叉熵',
        description: '多类输出通过 softmax 得到概率分布，损失鼓励正确类别的对数概率最大化。',
        formula: String.raw`E = -\sum_{n} \sum_{k} t_{nk} \ln y_{nk}`,
      },
    ],
    demo: {
      title: '交叉熵随预测概率变化',
      label: '预测正确类概率 p',
      param: 0.8,
      min: 0.05,
      max: 0.99,
      step: 0.01,
      compute: (p) => ({
        label: '交叉熵',
        value: -Math.log(p),
        display: String.raw`H=-\ln ${p.toFixed(2)}`,
      }),
      formula: String.raw`H(p) = -\ln p`,
    },
  },

  '/ch03/mixture-density-networks': {
    icon: 'GitBranch',
    summary:
      '混合密度网络用神经网络输出条件混合分布的参数，从而建模多峰、非单值的逆问题映射。',
    concepts: [
      {
        title: '条件混合分布',
        description: '网络同时预测混合系数、均值与方差，输出完整的条件概率密度。',
        formula: String.raw`p(t \mid x) = \sum_{k=1}^{K} \pi_k(x) \, \mathcal{N}\bigl(t \mid \mu_k(x), \sigma_k^2(x)\bigr)`,
      },
      {
        title: '机器人运动学示例',
        description: '同一末端位置可能对应多个关节角，单值回归会取平均导致错误解；混合分布可表示多个可行解。',
      },
      {
        title: '似然训练',
        description: '直接最大化条件对数似然，网络自动学习何时需要多峰输出。',
      },
    ],
    demo: {
      title: '两个高斯分量的混合密度',
      label: '混合系数 π₁',
      param: 0.5,
      min: 0.0,
      max: 1.0,
      step: 0.05,
      compute: (pi) => ({
        label: 'p(t=0)',
        value: pi * 1 + (1 - pi) * Math.exp(-2),
        display: String.raw`p(0)=${pi.toFixed(2)}\cdot 1+${(1 - pi).toFixed(2)}\cdot e^{-2}`,
      }),
      formula: String.raw`p(t) = \pi_1 \mathcal{N}(t \mid 0,1) + \pi_2 \mathcal{N}(t \mid 2,1)`,
    },
  },

  // =========================================================================
  // Ch 4 (manifest ch04): Gradient Descent
  // =========================================================================
  '/ch04/overview': {
    icon: 'TrendingDown',
    summary:
      '本章介绍训练深度网络的核心优化方法：从误差曲面的局部结构到批量、随机、动量、自适应学习率等实用算法。',
    concepts: [
      {
        title: '误差曲面',
        description: '损失函数在高维参数空间形成复杂曲面，局部曲率决定优化难度。',
      },
      {
        title: '梯度下降族',
        description: '批量 GD、SGD 与小批量 SGD 在计算效率与梯度方差之间权衡。',
      },
      {
        title: '自适应方法',
        description: '动量、RMSProp 与 Adam 通过累积历史梯度信息加速收敛并减少震荡。',
      },
      {
        title: '学习率调度',
        description: '随训练进程降低学习率，兼顾快速收敛与精细逼近局部极小值。',
      },
    ],
    demo: {
      title: '学习率对收敛步数的影响',
      label: '学习率 η',
      param: 0.3,
      min: 0.01,
      max: 1.0,
      step: 0.01,
      compute: (eta) => ({
        label: '单步相对进展',
        value: eta * Math.exp(-eta),
        display: String.raw`\Delta = ${(eta * Math.exp(-eta)).toFixed(3)}`,
      }),
      formula: String.raw`\Delta(\eta) = \eta e^{-\eta}`,
    },
  },

  '/ch04/error-surfaces': {
    icon: 'Mountain',
    summary:
      '误差曲面在极小值附近可用二次型近似；Hessian 矩阵的特征值与特征向量揭示了参数空间的曲率方向。',
    concepts: [
      {
        title: '局部二次近似',
        description: '在驻点 w* 附近，损失变化由 Hessian 矩阵决定。',
        formula: String.raw`E(w) \approx E(w^*) + \frac{1}{2}(w-w^*)^{\!T} H (w-w^*)`,
      },
      {
        title: 'Hessian 与曲率',
        description: 'Hessian 特征值大的方向曲率大，小学习率易在这些方向发散。',
      },
      {
        title: '鞍点与 plateau',
        description: '高维空间中鞍点比局部极小值更常见，优化算法需要具备逃离鞍点的能力。',
      },
    ],
    demo: {
      title: '二次损失随曲率变化',
      label: 'Hessian 特征值 λ',
      param: 1.0,
      min: 0.1,
      max: 5.0,
      step: 0.1,
      compute: (lambda) => ({
        label: '最稳学习率',
        value: 2 / lambda,
        display: String.raw`\eta_{\max}=2/${lambda.toFixed(1)}=${(2 / lambda).toFixed(2)}`,
      }),
      formula: String.raw`\eta_{\max} = \frac{2}{\lambda}`,
    },
  },

  '/ch04/gradient-descent-optimization': {
    icon: 'ArrowDownCircle',
    summary:
      '梯度下降通过沿负梯度方向更新参数来降低损失；不同变体在数据使用方式、计算成本与收敛稳定性之间取舍。',
    concepts: [
      {
        title: '批量梯度下降',
        description: '每次更新使用全部训练数据，梯度精确但单步计算昂贵。',
        formula: String.raw`w^{(\tau+1)} = w^{(\tau)} - \eta \nabla E(w^{(\tau)})`,
      },
      {
        title: '随机梯度下降',
        description: '每次仅用一个样本估计梯度，噪声大但逃离局部极小值能力强。',
      },
      {
        title: '小批量梯度下降',
        description: '折中方案，利用矩阵运算效率并降低梯度方差，是深度学习中最常用的形式。',
      },
    ],
    demo: {
      title: '梯度下降单步损失下降',
      label: '当前参数 w',
      param: 2.0,
      min: -3.0,
      max: 3.0,
      step: 0.1,
      compute: (w) => ({
        label: 'E(w)=w²',
        value: w * w,
        display: String.raw`E(${w.toFixed(1)})=${(w * w).toFixed(2)}`,
      }),
      formula: String.raw`E(w) = w^2`,
    },
  },

  '/ch04/convergence': {
    icon: 'Zap',
    summary:
      '加速收敛需要利用梯度历史：动量累积速度、自适应方法按维度缩放步长，学习率调度控制长期精细搜索。',
    concepts: [
      {
        title: '动量法',
        description: '引入速度变量，使更新方向平滑并加速穿越一致梯度方向。',
        formula: String.raw`v^{(\tau+1)} = \mu v^{(\tau)} - \eta \nabla E \quad ; \quad w^{(\tau+1)} = w^{(\tau)} + v^{(\tau+1)}`,
      },
      {
        title: 'RMSProp / Adam',
        description: '维护梯度平方的指数移动平均，为每个参数自适应调整学习率。',
      },
      {
        title: '学习率衰减',
        description: '步长随 epoch 递减，保证理论上收敛到局部极小值附近。',
      },
    ],
    demo: {
      title: '动量系数对有效步长的影响',
      label: '动量系数 μ',
      param: 0.9,
      min: 0.0,
      max: 0.99,
      step: 0.01,
      compute: (mu) => ({
        label: '有效累积因子',
        value: 1 / (1 - mu),
        display: String.raw`\frac{1}{1-${mu.toFixed(2)}}=${(1 / (1 - mu)).toFixed(1)}`,
      }),
      formula: String.raw`\text{有效累积} = \frac{1}{1-\mu}`,
    },
  },

  '/ch04/normalization': {
    icon: 'Scale',
    summary:
      '归一化稳定输入分布与内部激活，使网络可以使用更大学习率、更快收敛，并降低对初始化的敏感度。',
    concepts: [
      {
        title: '数据归一化',
        description: '将输入特征缩放为零均值、单位方差，使各维度对损失的贡献均衡。',
        formula: String.raw`\hat{x} = \frac{x - \mu}{\sigma}`,
      },
      {
        title: '批归一化',
        description: '对每个 mini-batch 的激活做归一化，并通过可学习的缩放平移恢复表达能力。',
      },
      {
        title: '层归一化',
        description: '沿特征维度归一化，不依赖 batch 大小，广泛用于 RNN 与 Transformer。',
      },
    ],
    demo: {
      title: '标准化后的取值',
      label: '原始标准差 σ',
      param: 2.0,
      min: 0.2,
      max: 5.0,
      step: 0.1,
      compute: (sigma) => ({
        label: 'x=3 标准化后',
        value: 3 / sigma,
        display: String.raw`\hat{x}=\frac{3}{${sigma.toFixed(1)}}=${(3 / sigma).toFixed(2)}`,
      }),
      formula: String.raw`\hat{x} = \frac{x - \mu}{\sigma}`,
    },
  },

  // =========================================================================
  // Ch 5 (manifest ch05): Backpropagation
  // =========================================================================
  '/ch05/overview': {
    icon: 'GitMerge',
    summary:
      '反向传播是计算图上的链式法则实现，能够高效求出任意可微网络中损失对每一层参数的梯度。',
    concepts: [
      {
        title: '计算图',
        description: '将前向计算分解为基本操作的节点，便于自动应用求导规则。',
      },
      {
        title: '链式法则',
        description: '通过上游梯度与局部 Jacobian 相乘，逐层向后传递误差信号。',
        formula: String.raw`\frac{\partial L}{\partial x} = \frac{\partial L}{\partial y} \frac{\partial y}{\partial x}`,
      },
      {
        title: '前向与反向模式',
        description: '反向模式以一次前向、一次反向即可得到所有输入梯度，适合参数众多的神经网络。',
      },
    ],
    demo: {
      title: '链式法则：复合函数梯度',
      label: '输入 x',
      param: 1.0,
      min: -2.0,
      max: 2.0,
      step: 0.1,
      compute: (x) => ({
        label: 'd/dx tanh(x)',
        value: 1 - Math.tanh(x) ** 2,
        display: String.raw`\frac{d}{dx}\tanh ${x.toFixed(1)}=${(1 - Math.tanh(x) ** 2).toFixed(3)}`,
      }),
      formula: String.raw`\frac{d}{dx} \tanh x = 1 - \tanh^2 x`,
    },
  },

  '/ch05/automatic-differentiation': {
    icon: 'Calculator',
    summary:
      '自动微分将复杂函数拆分为基本运算，通过反向模式在计算图上机械地传播梯度，是现代框架的核心。',
    concepts: [
      {
        title: '反向模式自动微分',
        description: '先执行前向计算记录图，再从输出节点反向传播伴随向量。',
      },
      {
        title: '前向模式',
        description: '对每个输入方向单独传播导数，适合输入维度低的场景。',
      },
      {
        title: '计算图与拓扑序',
        description: '节点按依赖顺序求值，反向传播按逆拓扑序更新梯度。',
      },
    ],
    demo: {
      title: '自动微分示例 f(x)=x²',
      label: '输入 x',
      param: 2.0,
      min: -3.0,
      max: 3.0,
      step: 0.1,
      compute: (x) => ({
        label: 'f(x)=x²',
        value: x * x,
        display: String.raw`\frac{df}{dx}=2\cdot${x.toFixed(1)}=${(2 * x).toFixed(1)}`,
      }),
      formula: String.raw`f(x)=x^2 \Rightarrow \frac{df}{dx}=2x`,
    },
  },

  // =========================================================================
  // Ch 6 (manifest ch06): Regularization
  // =========================================================================
  '/ch06/inductive-bias': {
    icon: 'Compass',
    summary:
      '归纳偏置是模型对学习问题的先验假设；合理设计偏置能缩小搜索空间，而错误的偏置会导致失败。',
    concepts: [
      {
        title: '逆问题与欠定性',
        description: '训练数据通常无法唯一确定模型，需要偏置选择可泛化解。',
      },
      {
        title: '无免费午餐定理',
        description: '没有通用学习器能在所有任务上同时最优，偏置必须匹配任务结构。',
      },
      {
        title: '对称性、不变性与等变性',
        description: '卷积的平移等变性、池化的平移不变性都是结构化偏置的成功例子。',
      },
    ],
  },

  '/ch06/parameter-sharing': {
    icon: 'Share2',
    summary:
      '参数共享让同一组权重在多个位置复用，显著减少参数量并强制定义不变性或局部性先验。',
    concepts: [
      {
        title: '软权重共享',
        description: '通过正则化鼓励参数彼此接近，而非强制相等，保留一定柔性。',
      },
      {
        title: '卷积中的共享',
        description: '卷积核在整张特征图上滑动，天然实现平移等变性与局部连接。',
      },
      {
        title: '参数量与统计效率',
        description: '共享使模型需要的训练数据更少，同时降低过拟合风险。',
      },
    ],
    demo: {
      title: '共享参数数量对比',
      label: '特征图边长 H',
      param: 16.0,
      min: 4.0,
      max: 64.0,
      step: 4.0,
      compute: (h) => ({
        label: '全连接 / 卷积 参数量比',
        value: h * h,
        display: String.raw`\frac{K^2H^2}{K^2}=${(h * h).toFixed(0)}`,
      }),
      formula: String.raw`\frac{\text{全连接}}{\text{卷积}} = H^2`,
    },
  },

  '/ch06/residual-connections': {
    icon: 'Layers',
    summary:
      '残差连接通过跳跃映射让网络学习残差函数 F(x)=H(x)-x，缓解深层网络的梯度消失与退化问题。',
    concepts: [
      {
        title: '残差块',
        description: '输出为输入与变换后的特征相加，保留恒等映射的梯度传播路径。',
        formula: String.raw`y = \mathcal{F}(x, \{W_i\}) + x`,
      },
      {
        title: '缓解梯度消失',
        description: '反向传播时梯度可直接沿跳跃连接回传，避免被多个非线性层连续收缩。',
      },
      {
        title: '深层网络训练',
        description: 'ResNet 等架构借助残差连接成功训练数百甚至上千层网络。',
      },
    ],
    demo: {
      title: '残差块的恒等梯度',
      label: '层数 L',
      param: 10.0,
      min: 1.0,
      max: 50.0,
      step: 1.0,
      compute: (L) => ({
        label: '普通梯度衰减',
        value: 0.9 ** L,
        display: String.raw`0.9^{${L.toFixed(0)}}=${(0.9 ** L).toFixed(4)}`,
      }),
      formula: String.raw`\text{普通梯度} \propto \alpha^L`,
    },
  },

  '/ch06/model-averaging': {
    icon: 'Users',
    summary:
      '模型平均通过组合多个模型的预测降低方差；Dropout 可视为对大量子网络做指数级隐式模型平均。',
    concepts: [
      {
        title: '委员会机器',
        description: '独立训练多个模型并平均输出，通常能提升泛化性能。',
        formula: String.raw`y_{\text{avg}} = \frac{1}{M} \sum_{m=1}^{M} y_m(x)`,
      },
      {
        title: 'Dropout 作为平均',
        description: '训练时随机失活神经元，等价于采样子网络；测试时缩放近似所有子网络平均。',
      },
      {
        title: '贝叶斯模型平均',
        description: '按模型后验概率加权组合，理论上最优但计算昂贵。',
      },
    ],
    demo: {
      title: '集成数量对误差的影响',
      label: '模型数量 M',
      param: 5.0,
      min: 1.0,
      max: 20.0,
      step: 1.0,
      compute: (M) => ({
        label: '方差缩减比例',
        value: 1 / Math.sqrt(M),
        display: String.raw`\sigma_{\text{avg}}=\sigma/\sqrt{${M.toFixed(0)}}=${(1 / Math.sqrt(M)).toFixed(3)}`,
      }),
      formula: String.raw`\sigma_{\text{avg}} = \frac{\sigma}{\sqrt{M}}`,
    },
  },
};

// More sections appended.
Object.assign(SECTIONS, {
  // =========================================================================
  // Ch 7 (manifest ch07): Convolutional Networks
  // =========================================================================
  '/ch07/overview': {
    icon: 'Layers',
    summary:
      '卷积神经网络通过局部连接、权重共享与层次化特征提取，成为图像等网格数据的主流模型。',
    concepts: [
      {
        title: '卷积操作',
        description: '用滑动滤波器在输入上计算局部响应，捕获边缘、纹理等低层特征。',
      },
      {
        title: '平移等变性',
        description: '输入平移导致特征图相应平移，保持空间关系不变。',
      },
      {
        title: '池化与层次化',
        description: '下采样增大感受野并降低计算量，深层网络组合得到语义更强的特征。',
      },
    ],
    demo: {
      title: '卷积感受野随层数增长',
      label: '网络层数 L',
      param: 3.0,
      min: 1.0,
      max: 10.0,
      step: 1.0,
      compute: (L) => ({
        label: '3×3 核感受野边长',
        value: 1 + 2 * L,
        display: String.raw`R=1+2\cdot${L.toFixed(0)}=${(1 + 2 * L).toFixed(0)}`,
      }),
      formula: String.raw`R = 1 + 2L`,
    },
  },

  '/ch07/computer-vision': {
    icon: 'Eye',
    summary:
      '计算机视觉任务涵盖分类、检测、分割与图像生成；CNN 利用图像的局部相关性与层次结构取得突破性进展。',
    concepts: [
      {
        title: '图像表示',
        description: '图像由像素网格构成，局部区域往往具有强相关性。',
      },
      {
        title: '任务层次',
        description: '从全局标签（分类）到像素标签（分割），任务对空间精度的要求递增。',
      },
      {
        title: '数据增强',
        description: '随机裁剪、翻转、色彩抖动等增强可显著提升视觉模型泛化能力。',
      },
    ],
  },

  '/ch07/convolutional-filters': {
    icon: 'Filter',
    summary:
      '卷积滤波器是特征检测器；通过填充、步幅与池化控制输出尺寸，多层卷积逐步扩大感受野。',
    concepts: [
      {
        title: '特征检测器',
        description: '不同滤波器响应不同局部模式，如水平边缘、垂直边缘或特定纹理。',
      },
      {
        title: '输出尺寸公式',
        description: '填充与步幅共同决定特征图的空间大小。',
        formula: String.raw`O = \left\lfloor \frac{I + 2P - K}{S} \right\rfloor + 1`,
      },
      {
        title: '池化',
        description: '最大池化或平均池化降低分辨率，提供局部平移不变性。',
      },
    ],
    demo: {
      title: '卷积输出尺寸',
      label: '输入尺寸 I',
      param: 32.0,
      min: 8.0,
      max: 128.0,
      step: 1.0,
      compute: (I) => ({
        label: '3×3 核、步幅 2 输出尺寸',
        value: Math.floor((I - 3) / 2) + 1,
        display: String.raw`O=\\left\\lfloor\\frac{${I.toFixed(0)}-3}{2}\\right\\rfloor+1`,
      }),
      formula: String.raw`O = \left\lfloor \frac{I - K}{S} \right\rfloor + 1`,
    },
  },

  '/ch07/visualizing-trained-cnns': {
    icon: 'Search',
    summary:
      '可视化帮助理解 CNN 学到了什么：从低层滤波器到类激活图、显著性图与对抗样本。',
    concepts: [
      {
        title: '滤波器可视化',
        description: '第一层滤波器常呈现 Gabor 边缘检测器，与视觉皮层简单细胞类似。',
      },
      {
        title: '显著性图',
        description: '通过反向传播输入梯度，定位对分类决策最重要的图像区域。',
      },
      {
        title: '对抗样本',
        description: '对人眼不可察觉的扰动可导致网络高置信度错误分类。',
      },
    ],
  },

  '/ch07/object-detection': {
    icon: 'Target',
    summary:
      '目标检测需要同时预测物体的类别与边界框位置；多尺度、锚框与非极大抑制是核心组件。',
    concepts: [
      {
        title: '边界框与 IoU',
        description: '交并比衡量两个框的重叠程度，是评估与匹配的标准。',
        formula: String.raw`\text{IoU} = \frac{|A \cap B|}{|A \cup B|}`,
      },
      {
        title: '多尺度检测',
        description: '在不同分辨率特征图上并行预测，兼顾大目标与小目标。',
      },
      {
        title: '非极大抑制',
        description: '去除高度重叠的冗余预测框，只保留置信度最高的结果。',
      },
    ],
    demo: {
      title: 'IoU 随框偏移变化',
      label: '两框中心距离 d',
      param: 0.0,
      min: 0.0,
      max: 2.0,
      step: 0.05,
      compute: (d) => {
        const iou = d >= 1 ? 0 : Math.max(0, (1 - d) / (1 + d));
        return {
          label: 'IoU（单位框）',
          value: iou,
          display: String.raw`\\text{IoU}=${iou.toFixed(3)}`,
        };
      },
      formula: String.raw`\text{IoU} = \frac{|A \cap B|}{|A \cup B|}`,
    },
  },

  '/ch07/image-segmentation': {
    icon: 'Scissors',
    summary:
      '图像分割为每个像素分配语义标签；编码器-解码器结构与跳跃连接帮助恢复精细空间细节。',
    concepts: [
      {
        title: '上采样',
        description: '转置卷积或插值将低分辨率特征恢复到输入尺寸，便于逐像素预测。',
      },
      {
        title: 'U-Net 结构',
        description: '对称的编码器-解码器加跨层连接，在医学图像等领域广泛应用。',
      },
      {
        title: '全卷积网络',
        description: '用卷积替代全连接层，使任意尺寸输入都能输出对应尺寸的分割图。',
      },
    ],
  },

  '/ch07/style-transfer': {
    icon: 'Palette',
    summary:
      '神经风格迁移将内容图像的结构与风格图像的纹理分离并重组，通过优化或训练网络实现艺术化生成。',
    concepts: [
      {
        title: '内容表示',
        description: '使用高层特征图捕捉图像的语义结构，忽略具体像素值。',
      },
      {
        title: '风格表示',
        description: '用 Gram 矩阵统计特征图通道间的相关性，捕捉纹理与色彩分布。',
        formula: String.raw`G_{ij} = \sum_{k} F_{ik} F_{jk}`,
      },
      {
        title: '优化目标',
        description: '合成图像同时最小化与内容图像的特征距离和与风格图像的 Gram 距离。',
      },
    ],
  },

  // =========================================================================
  // Ch 8 (manifest ch08): Structured Distributions
  // =========================================================================
  '/ch08/overview': {
    icon: 'Network',
    summary:
      '结构化分布利用变量间的依赖关系进行紧凑建模；图模型与序列模型为复杂联合分布提供可解释框架。',
    concepts: [
      {
        title: '联合分布的分解',
        description: '利用条件独立将高维分布分解为局部因子的乘积，降低表示与推断成本。',
      },
      {
        title: '有向与无向图',
        description: '贝叶斯网络用有向边表示因果关系，马尔可夫随机场用无向边表示软约束。',
      },
      {
        title: '序列结构',
        description: '时间或空间上的相邻变量相互依赖，适合用链或树结构建模。',
      },
    ],
  },

  '/ch08/graphical-models': {
    icon: 'GitBranch',
    summary:
      '图模型用节点表示随机变量、边表示依赖；有向图的因子分解直观编码变量间的生成关系。',
    concepts: [
      {
        title: '贝叶斯网络',
        description: '每个节点给定父节点的条件概率相乘得到联合分布。',
        formula: String.raw`p(\mathbf{x}) = \prod_{i} p(x_i \mid \text{pa}_i)`,
      },
      {
        title: '离散与高斯变量',
        description: '条件概率表适合离散变量，线性高斯模型适合连续变量。',
      },
      {
        title: '贝叶斯定理在图中的应用',
        description: '观测某些节点后，依赖关系沿活跃路径传播并更新其他节点后验。',
      },
    ],
    demo: {
      title: '链式联合分布分解',
      label: '变量数 N',
      param: 4.0,
      min: 2.0,
      max: 10.0,
      step: 1.0,
      compute: (N) => ({
        label: '链式条件概率项数',
        value: N,
        display: String.raw`p(x_1)\prod_{i=2}^{${N.toFixed(0)}}p(x_i|x_{i-1})`,
      }),
      formula: String.raw`p(\mathbf{x}) = p(x_1) \prod_{i=2}^{N} p(x_i \mid x_{i-1})`,
    },
  },

  '/ch08/conditional-independence': {
    icon: 'Unlink',
    summary:
      '条件独立性是图模型的核心；d-分离提供了一套基于图结构判断独立性的完备规则。',
    concepts: [
      {
        title: '三种基本结构',
        description: '链式、分岔与汇聚会以不同方式决定条件独立关系。',
      },
      {
        title: '解释消除',
        description: '观测到共同结果时，两个原本独立的父节点可能变得相关。',
      },
      {
        title: 'd-分离',
        description: '若所有路径都被某个观测节点阻断，则称两变量在给定条件下 d-分离。',
      },
    ],
  },

  '/ch08/sequence-models': {
    icon: 'Clock',
    summary:
      '序列模型捕捉时间或顺序上的依赖；隐马尔可夫模型与线性动态系统是经典代表，现代则由 RNN 与 Transformer 扩展。',
    concepts: [
      {
        title: '马尔可夫假设',
        description: '当前状态仅依赖有限历史，使建模与推断大大简化。',
      },
      {
        title: '隐变量',
        description: '隐状态 summarises 过去信息，用于预测未来观测。',
      },
      {
        title: '前向-后向算法',
        description: '利用动态规划高效计算隐状态后验与模型似然。',
      },
    ],
  },

  // =========================================================================
  // Ch 9 (manifest ch09): Transformers
  // =========================================================================
  '/ch09/attention': {
    icon: 'Focus',
    summary:
      '注意力机制让模型根据查询动态加权键值对；自注意力与多头注意力是 Transformer 的核心构建块。',
    concepts: [
      {
        title: '缩放点积注意力',
        description: '用查询与键的内积计算相似度，除以维度平方根防止 softmax 饱和。',
        formula: String.raw`\text{Attention}(Q,K,V) = \text{softmax}\left(\frac{QK^{\!T}}{\sqrt{d_k}}\right)V`,
      },
      {
        title: '自注意力',
        description: '查询、键、值来自同一序列，使每个位置都能 attending 到其他位置。',
      },
      {
        title: '多头注意力',
        description: '多组独立注意力并行，捕捉不同子空间的关系模式。',
      },
      {
        title: '位置编码',
        description: '为序列注入位置信息，常用正弦/余弦函数或可学习嵌入。',
      },
    ],
    demo: {
      title: '缩放点积注意力权重',
      label: '查询-键相似度 s',
      param: 1.0,
      min: -3.0,
      max: 3.0,
      step: 0.1,
      compute: (s) => {
        const exp = Math.exp(s / Math.sqrt(8));
        return {
          label: '注意力权重',
          value: exp / (exp + 1),
          display: String.raw`\\alpha=${(exp / (exp + 1)).toFixed(3)}`,
        };
      },
      formula: String.raw`\alpha = \frac{\exp(s/\sqrt{d_k})}{\sum \exp(s/\sqrt{d_k})}`,
    },
  },

  // =========================================================================
  // Ch 10 (manifest ch10): Graph Neural Networks
  // =========================================================================
  '/ch10/overview': {
    icon: 'Share2',
    summary:
      '图神经网络将神经网络推广到不规则图结构，通过消息传递聚合邻域信息并满足置换等变性。',
    concepts: [
      {
        title: '图数据',
        description: '节点、边与全局特征构成非欧数据，无法用常规网格卷积直接处理。',
      },
      {
        title: '消息传递',
        description: '每个节点收集并变换邻居信息，再更新自身表示。',
      },
      {
        title: '置换等变性',
        description: '节点编号改变时，GNN 输出仅相应置换，保持图结构语义不变。',
      },
    ],
  },

  '/ch10/machine-learning-on-graphs': {
    icon: 'Globe',
    summary:
      '图机器学习利用邻接矩阵与节点特征完成任务；理解图性质与置换对称性是设计模型先验的关键。',
    concepts: [
      {
        title: '邻接矩阵',
        description: '用矩阵显式编码节点连接关系，稀疏形式可高效存储大规模图。',
      },
      {
        title: '节点、边、图级任务',
        description: '分别预测单个节点、单条边或整张图的标签。',
      },
      {
        title: '置换等变性',
        description: '对节点重新编号不应改变预测结果，这要求模型基于聚合操作。',
      },
    ],
    demo: {
      title: '度中心性',
      label: '节点度数 k',
      param: 4.0,
      min: 0.0,
      max: 20.0,
      step: 1.0,
      compute: (k) => ({
        label: '归一化度中心性',
        value: k / 20,
        display: String.raw`C_D=${(k / 20).toFixed(2)}`,
      }),
      formula: String.raw`C_D(v) = \frac{\deg(v)}{N-1}`,
    },
  },

  '/ch10/neural-message-passing': {
    icon: 'MessageSquare',
    summary:
      '神经消息传递框架统一了 GCN、GAT 等变体：聚合邻居消息、更新节点状态、迭代传播至全图。',
    concepts: [
      {
        title: '消息函数',
        description: '根据目标节点与源节点特征计算要传递的消息。',
      },
      {
        title: '聚合函数',
        description: '对邻居消息做求和、平均或最大值聚合，保证置换不变性。',
      },
      {
        title: 'GCN 更新',
        description: '归一化邻接矩阵与特征矩阵相乘实现谱域卷积的一阶近似。',
        formula: String.raw`H^{(l+1)} = \sigma\left(\tilde{D}^{-1/2} \tilde{A} \tilde{D}^{-1/2} H^{(l)} W^{(l)}\right)`,
      },
    ],
    demo: {
      title: '邻居聚合均值',
      label: '邻居数量 |N(v)|',
      param: 5.0,
      min: 1.0,
      max: 20.0,
      step: 1.0,
      compute: (N) => ({
        label: '聚合后缩放因子',
        value: 1 / N,
        display: String.raw`\\frac{1}{${N.toFixed(0)}}=${(1 / N).toFixed(3)}`,
      }),
      formula: String.raw`h_v^{(l+1)} = \frac{1}{|\mathcal{N}(v)|} \sum_{u \in \mathcal{N}(v)} m_{uv}`,
    },
  },

  '/ch10/general-graph-networks': {
    icon: 'Hexagon',
    summary:
      '通用图网络同时处理节点、边与全局特征；图注意力、几何深度学习等扩展提升了表达能力与物理一致性。',
    concepts: [
      {
        title: '边与全局更新',
        description: '消息传递可同时更新边嵌入和全局表示，适应更丰富的预测任务。',
      },
      {
        title: '图注意力网络',
        description: '为不同邻居学习自适应权重，避免 GCN 的固定归一化假设。',
      },
      {
        title: '过平滑问题',
        description: '深层 GNN 中节点表示趋于一致，限制了对远距离结构的区分能力。',
      },
    ],
  },
});

Object.assign(SECTIONS, {
  // =========================================================================
  // Ch 11 (manifest ch11): Sampling
  // =========================================================================
  '/ch11/overview': {
    icon: 'Dices',
    summary:
      '采样是从复杂分布中获取样本的技术，广泛应用于蒙特卡洛估计、隐变量推断与生成模型训练。',
    concepts: [
      {
        title: '蒙特卡洛估计',
        description: '用样本均值近似期望，随样本量增加方差以 1/N 下降。',
        formula: String.raw`\mathbb{E}[f] \approx \frac{1}{N} \sum_{n=1}^{N} f(x_n)`,
      },
      {
        title: '拒绝采样',
        description: '用简单提议分布包裹目标分布，按接受概率筛选样本。',
      },
      {
        title: 'MCMC',
        description: '构造马尔可夫链使其平稳分布为目标分布，适合高维复杂分布。',
      },
    ],
  },

  '/ch11/basic-sampling-algorithms': {
    icon: 'Shuffle',
    summary:
      '基本采样算法从简单分布生成样本：逆变换、拒绝采样、重要性采样与采样-重要性重采样构成了蒙特卡洛基础。',
    concepts: [
      {
        title: '逆变换采样',
        description: '对均匀随机变量应用 CDF 的逆函数，得到目标分布样本。',
      },
      {
        title: '拒绝采样',
        description: '需要提议分布 q 满足 kq(x) ≥ p(x)，接受率随维度急剧下降。',
      },
      {
        title: '重要性采样',
        description: '用提议分布加权样本估计期望，权重校正分布差异。',
        formula: String.raw`\mathbb{E}_p[f] = \mathbb{E}_q\left[ f(x) \frac{p(x)}{q(x)} \right]`,
      },
    ],
    demo: {
      title: '重要性采样权重',
      label: '提议与目标均值差 μ',
      param: 0.0,
      min: -2.0,
      max: 2.0,
      step: 0.1,
      compute: (mu) => ({
        label: 'x=0 处权重',
        value: Math.exp(-mu * mu / 2),
        display: String.raw`w(0)=e^{-${(mu * mu / 2).toFixed(2)}}`,
      }),
      formula: String.raw`w(x) = \frac{p(x)}{q(x)}`,
    },
  },

  '/ch11/markov-chain-monte-carlo': {
    icon: 'Route',
    summary:
      'MCMC 通过构建马尔可夫链产生相关样本，Metropolis-Hastings 与 Gibbs 采样是最常用的两类算法。',
    concepts: [
      {
        title: 'Metropolis 算法',
        description: '按提议分布扰动当前样本，以接受概率决定是否转移到新状态。',
      },
      {
        title: '细致平衡',
        description: '转移核满足细致平衡条件时，链的平稳分布即为目标分布。',
        formula: String.raw`p^*(x) T(x \to x') = p^*(x') T(x' \to x)`,
      },
      {
        title: 'Gibbs 采样',
        description: '逐个变量依条件分布采样，特别适用于条件分布易采样的模型。',
      },
    ],
    demo: {
      title: 'Metropolis 接受概率',
      label: '能量差 ΔE',
      param: 0.0,
      min: -3.0,
      max: 3.0,
      step: 0.1,
      compute: (dE) => ({
        label: '接受概率',
        value: Math.min(1, Math.exp(-dE)),
        display: String.raw`A=\\min(1,e^{-${dE.toFixed(1)}})`,
      }),
      formula: String.raw`A = \min\left(1, \exp\left(-\frac{\Delta E}{T}\right)\right)`,
    },
  },

  '/ch11/langevin-sampling': {
    icon: 'Wind',
    summary:
      'Langevin 动力学结合梯度信息与随机噪声，从能量模型中采样；是分数匹配与扩散模型的理论基础。',
    concepts: [
      {
        title: '基于能量的模型',
        description: '概率密度由能量函数通过 Boltzmann 分布定义。',
        formula: String.raw`p(x) = \frac{1}{Z} \exp(-E(x))`,
      },
      {
        title: 'Langevin 更新',
        description: '沿能量下降方向移动并注入高斯噪声，平衡探索与利用。',
        formula: String.raw`x^{(\tau+1)} = x^{(\tau)} - \frac{\eta}{2} \nabla E(x^{(\tau)}) + \sqrt{\eta} \, \epsilon`,
      },
      {
        title: '与分数匹配的联系',
        description: '能量梯度对应分数函数，Langevin 采样可视为沿分数场移动。',
      },
    ],
  },

  // =========================================================================
  // Ch 14 (manifest ch14): GANs
  // =========================================================================
  '/ch14/overview': {
    icon: 'Swords',
    summary:
      '生成对抗网络通过生成器与判别器的对抗博弈学习数据分布，开创了隐式生成模型的新范式。',
    concepts: [
      {
        title: '对抗博弈',
        description: '生成器试图欺骗判别器，判别器试图区分真伪，形成零和博弈。',
      },
      {
        title: '纳什均衡',
        description: '理想情况下生成器复现真实分布，判别器无法区分真假。',
      },
      {
        title: '训练挑战',
        description: '模式崩溃、训练不稳定与评估困难是 GAN 研究的核心问题。',
      },
    ],
  },

  '/ch14/adversarial-training': {
    icon: 'Scale',
    summary:
      'GAN 的损失函数定义了生成器与判别器的优化目标；实践中需要平衡两者更新频率与梯度稳定性。',
    concepts: [
      {
        title: '极小极大损失',
        description: '判别器最大化对数似然，生成器最小化被判别为假的概率。',
        formula: String.raw`\min_G \max_D V(D,G) = \mathbb{E}_{x\sim p_{\text{data}}}\ln D(x) + \mathbb{E}_{z\sim p_z}\ln(1-D(G(z)))`,
      },
      {
        title: '非饱和损失',
        description: '用 -ln D(G(z)) 替代 ln(1-D(G(z))))，缓解生成器早期梯度不足。',
      },
      {
        title: '训练技巧',
        description: '标签平滑、噪声输入、梯度惩罚等方法可提升稳定性。',
      },
    ],
    demo: {
      title: '判别器对生成样本的输出',
      label: '判别器输出 D(G(z))',
      param: 0.3,
      min: 0.01,
      max: 0.99,
      step: 0.01,
      compute: (d) => ({
        label: '生成器损失',
        value: -Math.log(d),
        display: String.raw`L_G=-\\ln ${d.toFixed(2)}=${(-Math.log(d)).toFixed(3)}`,
      }),
      formula: String.raw`L_G = -\ln D(G(z))`,
    },
  },

  '/ch14/image-gans': {
    icon: 'Image',
    summary:
      '图像 GAN 从早期全连接架构发展到卷积与条件生成；CycleGAN 等模型实现了无配对数据的图像域转换。',
    concepts: [
      {
        title: 'DCGAN',
        description: '将卷积与转置卷积引入 GAN，使生成高质量图像成为可能。',
      },
      {
        title: '条件 GAN',
        description: '向生成器和判别器输入类别或图像条件，实现可控生成。',
      },
      {
        title: 'CycleGAN',
        description: '通过循环一致性损失，在两个无配对图像域之间学习双向映射。',
      },
    ],
  },

  // =========================================================================
  // Ch 15 (manifest ch15): Normalizing Flows
  // =========================================================================
  '/ch15/overview': {
    icon: 'ArrowLeftRight',
    summary:
      '标准化流通过可逆神经网络将简单分布变换为复杂分布，同时保持精确的似然计算。',
    concepts: [
      {
        title: '可逆变换',
        description: '每一层都是双射，使得采样与密度评估都能高效进行。',
      },
      {
        title: '变量替换公式',
        description: '对数密度随 Jacobian 行列式变化，保证归一化。',
        formula: String.raw`\ln p_x(x) = \ln p_z(z) - \ln \left| \det \frac{\partial f}{\partial z} \right|`,
      },
      {
        title: '流架构',
        description: '耦合流、自回归流与连续流在表达能力与计算成本之间各有取舍。',
      },
    ],
  },

  '/ch15/coupling-flows': {
    icon: 'GitCommitHorizontal',
    summary:
      '耦合流将输入分成两部分，用其中一部分作为条件对另一部分做可逆变换，使 Jacobian 行列式易于计算。',
    concepts: [
      {
        title: '仿射耦合层',
        description: '一部分变量保持不变，另一部分做缩放与平移，缩放平移参数由不变部分经神经网络产生。',
        formula: String.raw`x_{1:d} = z_{1:d}, \quad x_{d+1:D} = z_{d+1:D} \odot \exp(s) + t`,
      },
      {
        title: 'RealNVP',
        description: '堆叠多个耦合层并交替划分维度，实现全变量的非线性变换。',
      },
      {
        title: '行列式计算',
        description: '耦合变换的 Jacobian 是三角矩阵，行列式等于缩放因子的乘积。',
      },
    ],
    demo: {
      title: '耦合层缩放对对数密度的影响',
      label: '缩放因子 s',
      param: 0.0,
      min: -2.0,
      max: 2.0,
      step: 0.1,
      compute: (s) => ({
        label: 'log-det-Jacobian',
        value: s,
        display: String.raw`\\ln|J|=${s.toFixed(1)}`,
      }),
      formula: String.raw`\ln |\det J| = \sum_i s_i`,
    },
  },

  '/ch15/autoregressive-flows': {
    icon: 'ArrowRight',
    summary:
      '自回归流按顺序对每个维度做条件变换，天然具有三角 Jacobian，是 MAF 与 IAF 等模型的基础。',
    concepts: [
      {
        title: '自回归分解',
        description: '联合分布分解为各维度的条件分布乘积。',
        formula: String.raw`p(x) = \prod_{i} p(x_i \mid x_{<i})`,
      },
      {
        title: 'MAF 与 IAF',
        description: 'MAF 便于密度估计，IAF 便于快速采样，两者在自回归方向上互补。',
      },
      {
        title: ' masked 自回归网络',
        description: '通过掩码保证每个输出只依赖前面维度，维持自回归结构。',
      },
    ],
  },

  '/ch15/continuous-flows': {
    icon: 'Waves',
    summary:
      '连续流将变换视为由神经网络定义的常微分方程，用 ODE 求解器前向与反向传播，实现任意精度的可逆变换。',
    concepts: [
      {
        title: '神经 ODE',
        description: '隐藏状态随连续时间演化，由神经网络参数化的导数驱动。',
        formula: String.raw`\frac{dh(t)}{dt} = f(h(t), t, \theta)`,
      },
      {
        title: '伴随敏感性',
        description: '通过求解增广 ODE 反向传播梯度，避免存储中间状态。',
      },
      {
        title: 'FFJORD',
        description: '用随机迹估计替代精确 Jacobian，扩展连续流到高维数据。',
      },
    ],
  },

  // =========================================================================
  // Ch 16 (manifest ch16): Autoencoders
  // =========================================================================
  '/ch16/overview': {
    icon: 'Shrink',
    summary:
      '自编码器通过编码器-解码器结构学习压缩表示，可用于降维、去噪与生成建模。',
    concepts: [
      {
        title: '编码器与解码器',
        description: '编码器将输入映射到低维隐空间，解码器重构原始输入。',
      },
      {
        title: '重构损失',
        description: '通常用均方误差或交叉熵衡量输入与重构之间的差距。',
      },
      {
        title: '生成视角',
        description: '变分自编码器在隐空间施加先验，使解码器成为生成模型。',
      },
    ],
  },

  '/ch16/deterministic-autoencoders': {
    icon: 'Box',
    summary:
      '确定性自编码器直接学习点到点的映射；通过欠完备、稀疏、去噪等约束获得有意义的隐表示。',
    concepts: [
      {
        title: '线性自编码器',
        description: '单隐层线性自编码器等价于主成分分析，学习数据的主子空间。',
      },
      {
        title: '稀疏自编码器',
        description: '在隐单元上施加稀疏惩罚，使每个输入仅激活少量特征。',
      },
      {
        title: '去噪自编码器',
        description: '从损坏输入重构干净输入，学习对输入扰动鲁棒的特征。',
      },
    ],
    demo: {
      title: '去噪重构误差',
      label: '噪声标准差 σ',
      param: 0.2,
      min: 0.0,
      max: 1.0,
      step: 0.05,
      compute: (sigma) => ({
        label: '期望噪声能量',
        value: sigma * sigma,
        display: String.raw`\\mathbb{E}[\\epsilon^2]=${(sigma * sigma).toFixed(3)}`,
      }),
      formula: String.raw`\mathbb{E}[\|\epsilon\|^2] = \sigma^2`,
    },
  },

  '/ch16/variational-autoencoders': {
    icon: 'Sparkles',
    summary:
      '变分自编码器将编码器输出解释为后验分布参数，通过重参数化技巧优化证据下界，实现连续隐空间的生成。',
    concepts: [
      {
        title: '摊销推断',
        description: '编码器同时输出每个数据点的变分后验参数，避免逐点优化。',
        formula: String.raw`q_\phi(z \mid x) = \mathcal{N}(z \mid \mu_\phi(x), \sigma_\phi^2(x)I)`,
      },
      {
        title: '重参数化技巧',
        description: '将随机性从网络参数中分离，使梯度能反向传播到 μ 与 σ。',
        formula: String.raw`z = \mu + \sigma \odot \epsilon, \quad \epsilon \sim \mathcal{N}(0,I)`,
      },
      {
        title: 'ELBO',
        description: '最大化重构似然与后验接近先验之间的平衡。',
        formula: String.raw`\mathcal{L} = \mathbb{E}_{q(z|x)}[\ln p(x|z)] - D_{KL}(q(z|x) \| p(z))`,
      },
    ],
    demo: {
      title: 'KL 散度随 σ 变化',
      label: '后验标准差 σ',
      param: 1.0,
      min: 0.1,
      max: 3.0,
      step: 0.1,
      compute: (sigma) => ({
        label: 'KL(q||N(0,1))',
        value: 0.5 * (sigma * sigma - Math.log(sigma * sigma) - 1),
        display: String.raw`D_{KL}=\\frac{1}{2}(${sigma.toFixed(1)}^2-\\ln ${sigma.toFixed(1)}^2-1)`,
      }),
      formula: String.raw`D_{KL}\bigl(\mathcal{N}(\mu,\sigma^2) \| \mathcal{N}(0,1)\bigr) = \frac{1}{2}\left(\sigma^2 - \ln \sigma^2 - 1 + \mu^2\right)`,
    },
  },

  // =========================================================================
  // Ch 13 (manifest ch13): Continuous Latent Variables — missed draft sections
  // =========================================================================
  '/ch13/evidence-lower-bound': {
    icon: 'Scale',
    summary:
      '连续隐变量模型中，证据下界为对数似然提供了可优化的下界；EM 算法可视为交替优化 ELBO 的过程。',
    concepts: [
      {
        title: 'ELBO',
        description: '通过引入变分后验，将难解的边缘似然转化为可计算的期望加 KL 惩罚。',
        formula: String.raw`\ln p(\mathbf{X}) \ge \mathcal{L}(q) = \mathbb{E}_q[\ln p(\mathbf{X},\mathbf{Z})] - \mathbb{E}_q[\ln q(\mathbf{Z})]`,
      },
      {
        title: 'EM 算法',
        description: 'E 步固定参数优化 q，M 步固定 q 优化模型参数，保证似然单调不减。',
      },
      {
        title: 'PCA 的 EM',
        description: '对概率 PCA 使用 EM 可处理高维数据并避免直接计算大协方差矩阵的特征分解。',
      },
    ],
    demo: {
      title: 'KL 项对 ELBO 的影响',
      label: '变分后验标准差 σ',
      param: 1.0,
      min: 0.1,
      max: 3.0,
      step: 0.1,
      compute: (sigma) => ({
        label: '-KL(q||N(0,1))',
        value: -0.5 * (sigma * sigma - Math.log(sigma * sigma) - 1),
        display: String.raw`-D_{KL}=${(-0.5 * (sigma * sigma - Math.log(sigma * sigma) - 1)).toFixed(3)}`,
      }),
      formula: String.raw`-D_{KL}\bigl(\mathcal{N}(0,\sigma^2) \| \mathcal{N}(0,1)\bigr) = -\frac{1}{2}(\sigma^2 - \ln \sigma^2 - 1)`,
    },
  },

  '/ch13/nonlinear-latent-variable-models': {
    icon: 'Network',
    summary:
      '非线性隐变量模型用神经网络参数化编码器与解码器，能够捕捉复杂流形结构并作为强大生成模型。',
    concepts: [
      {
        title: '非线性流形',
        description: '真实数据常分布于低维非线性流形，线性方法难以充分刻画。',
      },
      {
        title: '似然函数',
        description: '由于非线性映射的 Jacobian 复杂，精确似然通常难以计算。',
        formula: String.raw`p(x) = \int p(x|z) p(z) \, dz`,
      },
      {
        title: '四类生成方法',
        description: '包括自回归模型、流模型、GAN 与 VAE，它们在表示、训练与采样上各有优劣。',
      },
    ],
  },

  // =========================================================================
  // Ch 17 (manifest ch17): Diffusion Models
  // =========================================================================
  '/ch17/overview': {
    icon: 'Waves',
    summary:
      '扩散模型通过渐进加噪与逐步去噪学习数据分布，已成为高质量图像与音频生成的主流方法。',
    concepts: [
      {
        title: '前向扩散',
        description: '在 T 步内向数据逐步加入高斯噪声，最终趋近简单先验。',
      },
      {
        title: '反向去噪',
        description: '训练神经网络预测噪声或分数，逐步恢复干净数据。',
      },
      {
        title: '引导生成',
        description: '分类器或无分类器引导可在采样时控制生成内容与语义对齐。',
      },
    ],
  },

  '/ch17/forward-encoder': {
    icon: 'Wind',
    summary:
      '前向编码器按马尔可夫链逐步加噪；由于高斯转移核，任意时刻的边际分布都有闭式表达。',
    concepts: [
      {
        title: '扩散核',
        description: '每步将当前样本与高斯噪声按预设 schedule 混合。',
        formula: String.raw`q(x_t \mid x_{t-1}) = \mathcal{N}(x_t \mid \sqrt{1-\beta_t}\, x_{t-1}, \beta_t I)`,
      },
      {
        title: '闭式重参数化',
        description: '可直接从 x₀ 采样任意 t 时刻的加噪样本，无需迭代。',
        formula: String.raw`x_t = \sqrt{\bar{\alpha}_t}\, x_0 + \sqrt{1-\bar{\alpha}_t}\, \epsilon`,
      },
      {
        title: '噪声 schedule',
        description: 'β_t 随时间递增，控制从数据到噪声的过渡速度。',
      },
    ],
    demo: {
      title: '加噪样本中信号与噪声比例',
      label: '累积系数 ᾱ_t',
      param: 0.5,
      min: 0.01,
      max: 0.99,
      step: 0.01,
      compute: (alphaBar) => ({
        label: '信号比例',
        value: Math.sqrt(alphaBar),
        display: String.raw`\\sqrt{\\bar{\\alpha}_t}=${Math.sqrt(alphaBar).toFixed(3)}`,
      }),
      formula: String.raw`x_t = \sqrt{\bar{\alpha}_t}\, x_0 + \sqrt{1-\bar{\alpha}_t}\, \epsilon`,
    },
  },

  '/ch17/reverse-decoder': {
    icon: 'ArrowLeft',
    summary:
      '反向解码器学习逐步去噪的条件分布；ELBO 可重写为噪声预测损失，使训练稳定且高效。',
    concepts: [
      {
        title: '反向条件分布',
        description: '当 β 很小时，反向过程也近似高斯，可用神经网络参数化。',
      },
      {
        title: '变分下界',
        description: '优化 ELBO 等价于训练网络匹配真实的反向转移。',
      },
      {
        title: '简化损失',
        description: '直接预测加入的噪声 ϵ 通常比重构完整转移参数更稳定。',
        formula: String.raw`\mathcal{L} = \mathbb{E}_{t,x_0,\epsilon}\left[ \|\epsilon - \epsilon_\theta(x_t, t)\|^2 \right]`,
      },
    ],
    demo: {
      title: '噪声预测 MSE',
      label: '预测误差',
      param: 0.5,
      min: 0.0,
      max: 2.0,
      step: 0.05,
      compute: (err) => ({
        label: '损失',
        value: err * err,
        display: String.raw`\\|\\epsilon-\\epsilon_\\theta\\|^2=${(err * err).toFixed(3)}`,
      }),
      formula: String.raw`\|\epsilon - \epsilon_\theta(x_t, t)\|^2`,
    },
  },

  '/ch17/score-matching': {
    icon: 'Activity',
    summary:
      '分数匹配通过估计数据对数密度的梯度（分数函数）来建模分布；去噪分数匹配与扩散训练目标等价。',
    concepts: [
      {
        title: '分数函数',
        description: '分数是对数密度关于输入的梯度，指向数据密度增加最快的方向。',
        formula: String.raw`s(x) = \nabla_x \ln p(x)`,
      },
      {
        title: '分数匹配损失',
        description: '用模型分数与真实分数之间的 Fisher 散度作为目标。',
      },
      {
        title: '噪声水平与多尺度',
        description: '对不同噪声尺度的扰动数据训练分数网络，形成退火 Langevin 动力学。',
      },
    ],
    demo: {
      title: '高斯分布的分数',
      label: '位置 x',
      param: 1.0,
      min: -3.0,
      max: 3.0,
      step: 0.1,
      compute: (x) => ({
        label: 'N(0,1) 的分数',
        value: -x,
        display: String.raw`s(${x.toFixed(1)})=-${x.toFixed(1)}`,
      }),
      formula: String.raw`s(x) = \nabla_x \ln \mathcal{N}(x\mid 0,1) = -x`,
    },
  },

  '/ch17/guided-diffusion': {
    icon: 'Crosshair',
    summary:
      '引导扩散在采样时引入类别、文本或其他条件信号，使生成结果向目标语义移动。',
    concepts: [
      {
        title: '分类器引导',
        description: '利用预训练分类器的梯度调整分数，增强条件对齐但可能牺牲多样性。',
      },
      {
        title: '无分类器引导',
        description: '在训练时随机丢弃条件，采样时用条件与无条件预测的差值控制引导强度。',
        formula: String.raw`\hat{\epsilon} = \epsilon_{\text{unc}} + w \, (\epsilon_{\text{cond}} - \epsilon_{\text{unc}})`,
      },
      {
        title: '引导强度权衡',
        description: '权重 w 越大，样本与条件越对齐，但多样性越低。',
      },
    ],
    demo: {
      title: '无分类器引导强度',
      label: '引导权重 w',
      param: 1.0,
      min: 0.0,
      max: 5.0,
      step: 0.1,
      compute: (w) => ({
        label: '条件偏移倍数',
        value: w,
        display: String.raw`\\hat{\\epsilon}=\\epsilon_{\\text{unc}}+${w.toFixed(1)}(\\epsilon_{\\text{cond}}-\\epsilon_{\\text{unc}})`,
      }),
      formula: String.raw`\hat{\epsilon} = \epsilon_{\text{unc}} + w \, (\epsilon_{\text{cond}} - \epsilon_{\text{unc}})`,
    },
  },

  // =========================================================================
  // Appendix
  // =========================================================================
  '/appendix/a/overview': {
    icon: 'Grid3X3',
    summary:
      '线性代数附录回顾矩阵运算、迹、行列式、导数与特征分解，是理解神经网络公式的基础工具。',
    concepts: [
      {
        title: '矩阵求导',
        description: '掌握向量/矩阵值函数对向量/矩阵的导数规则，可快速推导梯度。',
        formula: String.raw`\frac{\partial}{\partial \mathbf{x}} (\mathbf{x}^{\!T} A \mathbf{x}) = (A + A^{\!T})\mathbf{x}`,
      },
      {
        title: '特征分解',
        description: '对称矩阵可正交对角化，特征值与特征向量刻画线性变换的主轴。',
        formula: String.raw`A = Q \Lambda Q^{\!T}`,
      },
      {
        title: '迹与行列式',
        description: '迹对循环置换不变，行列式表示线性变换对体积的缩放。',
      },
    ],
    demo: {
      title: '二次型取值',
      label: '向量 x',
      param: 2.0,
      min: -3.0,
      max: 3.0,
      step: 0.1,
      compute: (x) => ({
        label: 'x²',
        value: x * x,
        display: String.raw`${x.toFixed(1)}^2=${(x * x).toFixed(2)}`,
      }),
      formula: String.raw`f(x) = x^2`,
    },
  },

  '/appendix/b/overview': {
    icon: 'FunctionSquare',
    summary:
      '变分法研究泛函的极值问题，欧拉-拉格朗日方程是推导连续优化问题最优解的核心工具。',
    concepts: [
      {
        title: '泛函导数',
        description: '泛函对函数的导数定义了使泛函变化最快的方向。',
      },
      {
        title: '欧拉-拉格朗日方程',
        description: '最优函数必须满足该微分方程。',
        formula: String.raw`\frac{\partial L}{\partial y} - \frac{d}{dx}\frac{\partial L}{\partial y'} = 0`,
      },
      {
        title: '在机器学习中的应用',
        description: '高斯过程、核方法中的极值问题常通过变分法求解。',
      },
    ],
  },

  '/appendix/c/overview': {
    icon: 'Maximize',
    summary:
      '拉格朗日乘子法将带等式约束的优化问题转化为无约束问题，是推导正则化与最大熵等方法的基础。',
    concepts: [
      {
        title: '拉格朗日函数',
        description: '引入乘子将约束条件并入目标函数。',
        formula: String.raw`\mathcal{L}(x, \lambda) = f(x) + \lambda g(x)`,
      },
      {
        title: 'KKT 条件',
        description: '最优解处梯度、原始可行性与对偶可行性同时满足。',
      },
      {
        title: '约束优化示例',
        description: '最大熵分布、SVM 的对偶问题都可通过拉格朗日乘子导出。',
      },
    ],
    demo: {
      title: '等式约束下的二次目标',
      label: '约束值 c',
      param: 1.0,
      min: -2.0,
      max: 2.0,
      step: 0.1,
      compute: (c) => ({
        label: '最优 x²',
        value: c * c,
        display: String.raw`\\min x^2 \\text{ s.t. }x=c \\Rightarrow ${(c * c).toFixed(2)}`,
      }),
      formula: String.raw`\min_x x^2 \quad \text{s.t.} \quad x = c`,
    },
  },
});

// -----------------------------------------------------------------------------
// Generation logic
// -----------------------------------------------------------------------------

function main() {
  const sectionPaths = Object.keys(SECTIONS).sort();
  console.log(`Found ${sectionPaths.length} draft sections to generate.`);

  fs.mkdirSync(GENERATED_DIR, { recursive: true });

  const imports = [];
  const routeEntries = [];

  for (const sectionPath of sectionPaths) {
    const content = SECTIONS[sectionPath];
    const componentName = pathToComponentName(sectionPath);
    const fileName = `${componentName}.tsx`;
    const filePath = path.join(GENERATED_DIR, fileName);

    const pageSource = generatePage({
      componentName,
      sectionPath,
      icon: content.icon,
      summary: content.summary,
      concepts: content.concepts,
      demo: content.demo,
    });

    fs.writeFileSync(filePath, pageSource, 'utf8');
    console.log(`  wrote ${path.relative(ROOT, filePath)}`);

    imports.push(`import ${componentName} from './pages/generated/${componentName}';`);
    routeEntries.push(`  '${sectionPath}': ${componentName},`);
  }

  updateAppTsx(imports, routeEntries);
  updateManifestTs();

  console.log('Done.');
}

function updateAppTsx(imports, routeEntries) {
  let appSource = fs.readFileSync(APP_TSX, 'utf8');

  const importMarker = '// Generated Bishop section pages\n';
  const importBlock = importMarker + imports.join('\n') + '\n';

  if (appSource.includes(importMarker)) {
    // Replace existing generated imports block
    const regex = new RegExp(`// Generated Bishop section pages\\n(?:import .*? from '.*?';\\n)*`, 'g');
    appSource = appSource.replace(regex, importBlock);
  } else {
    // Insert before the manifest import
    appSource = appSource.replace(
      /(import \{ getAllSections \} from '\.\/course\/manifest';\n)/,
      `${importBlock}\n$1`
    );
  }

  const routeMarker = '  // Generated Bishop section routes\n';
  const routeBlock = routeMarker + routeEntries.join('\n') + '\n';

  if (appSource.includes(routeMarker)) {
    const regex = new RegExp(`  // Generated Bishop section routes\\n(?:  '.*?': .*?,\\n)*`, 'g');
    appSource = appSource.replace(regex, routeBlock);
  } else {
    // Insert before the closing brace of sectionComponents
    appSource = appSource.replace(
      /(};\n\nfunction App\(\) \{)/,
      `${routeBlock}};\n\nfunction App() {`
    );
  }

  fs.writeFileSync(APP_TSX, appSource, 'utf8');
  console.log(`  updated ${path.relative(ROOT, APP_TSX)}`);
}

function updateManifestTs() {
  let manifestSource = fs.readFileSync(MANIFEST_TS, 'utf8');
  const before = (manifestSource.match(/"draft"/g) || []).length;
  manifestSource = manifestSource.replace(/status: "draft"/g, 'status: "completed"');
  const after = (manifestSource.match(/"draft"/g) || []).length;
  fs.writeFileSync(MANIFEST_TS, manifestSource, 'utf8');
  console.log(`  updated ${path.relative(ROOT, MANIFEST_TS)} (${before} draft -> ${after} draft)`);
}

main();
