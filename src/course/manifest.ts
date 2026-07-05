export type SectionStatus =
  | "skeleton"
  | "draft"
  | "content-reviewed"
  | "interactive-reviewed"
  | "teaching-ready";

export type QuizItem = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type Section = {
  id: string;
  title: string;
  path: string;
  status: SectionStatus;
  description?: string;
  bishopChapter?: string;
  bishopSection?: string;
  learningObjectives?: string[];
  commonMistakes?: string[];
  quiz?: QuizItem[];
};

export type PartKind = 'prerequisite' | 'main' | 'appendix';

export type Chapter = {
  id: string;
  number: number;
  title: string;
  bishopChapter?: string;
  sections: Section[];
};

export type Part = {
  id: string;
  number: number;
  title: string;
  kind: PartKind;
  bishopRange?: string;
  chapters: Chapter[];
};

export const courseManifest: Part[] = [
  {
    id: "part-0",
    number: 0,
    title: "先修知识",
    kind: "prerequisite",
    bishopRange: "Ch 1–3",
    chapters: [
      {
        id: "pre-ch01",
        number: 1,
        title: "深度学习革命",
        bishopChapter: "Ch 1",
        sections: [
          {
            id: "pre-ch01-overview",
            title: "课程概览",
            path: "/prerequisite/ch01/overview",
            status: "content-reviewed",
            description: "深度学习的影响、 tutorial 示例与学习路线。",
          },
          {
            id: "pre-ch01-impact",
            title: "1.1 深度学习的影响",
            path: "/prerequisite/ch01/impact",
            status: "content-reviewed",
            description: "医疗诊断、蛋白质结构、图像合成、大语言模型等应用。",
          },
          {
            id: "pre-ch01-tutorial",
            title: "1.2 Tutorial：多项式曲线拟合",
            path: "/prerequisite/ch01/tutorial",
            status: "content-reviewed",
            description: "合成数据、线性模型、误差函数、模型复杂度、正则化与模型选择。",
          },
          {
            id: "pre-ch01-history",
            title: "1.3 机器学习简史",
            path: "/prerequisite/ch01/history",
            status: "content-reviewed",
            description: "单层网络、反向传播与深度网络的发展。",
          }
        ],
      },
      {
        id: "pre-ch02",
        number: 2,
        title: "概率论",
        bishopChapter: "Ch 2",
        sections: [
          {
            id: "pre-ch02-overview",
            title: "课程概览",
            path: "/prerequisite/ch02/overview",
            status: "content-reviewed",
            description: "不确定性的两类来源、概率论在机器学习中的核心作用。",
          },
          {
            id: "pre-ch02-rules",
            title: "2.1 概率规则",
            path: "/prerequisite/ch02/rules",
            status: "content-reviewed",
            description: "和规则、积规则、贝叶斯定理、先验与后验。",
          },
          {
            id: "pre-ch02-densities",
            title: "2.2 概率密度",
            path: "/prerequisite/ch02/densities",
            status: "content-reviewed",
            description: "连续随机变量、期望、协方差。",
          },
          {
            id: "pre-ch02-gaussian",
            title: "2.3 高斯分布",
            path: "/prerequisite/ch02/gaussian",
            status: "content-reviewed",
            description: "均值与方差、似然函数、最大似然的偏差、线性回归的概率视角。",
          },
          {
            id: "pre-ch02-transformation",
            title: "2.4 密度变换",
            path: "/prerequisite/ch02/transformation",
            status: "content-reviewed",
            description: "变量替换、多元分布的密度变换。",
          },
          {
            id: "pre-ch02-information",
            title: "2.5 信息论",
            path: "/prerequisite/ch02/information",
            status: "content-reviewed",
            description: "熵、微分熵、KL 散度、互信息。",
          },
          {
            id: "pre-ch02-bayesian",
            title: "2.6 贝叶斯概率",
            path: "/prerequisite/ch02/bayesian",
            status: "content-reviewed",
            description: "模型参数、正则化与贝叶斯机器学习。",
          }
        ],
      },
      {
        id: "pre-ch03",
        number: 3,
        title: "标准分布",
        bishopChapter: "Ch 3",
        sections: [
          {
            id: "pre-ch03-overview",
            title: "课程概览",
            path: "/prerequisite/ch03/overview",
            status: "content-reviewed",
            description: "离散与连续标准分布、指数族与非参数方法。",
          },
          {
            id: "pre-ch03-discrete",
            title: "3.1 离散变量",
            path: "/prerequisite/ch03/discrete",
            status: "content-reviewed",
            description: "Bernoulli、Binomial 与 Multinomial 分布。",
          },
          {
            id: "pre-ch03-mvgaussian",
            title: "3.2 多元高斯",
            path: "/prerequisite/ch03/mvgaussian",
            status: "content-reviewed",
            description: "几何、矩、条件分布、边缘分布、最大似然。",
          },
          {
            id: "pre-ch03-periodic",
            title: "3.3 周期变量",
            path: "/prerequisite/ch03/periodic",
            status: "content-reviewed",
            description: "Von Mises 分布与角度数据。",
          },
          {
            id: "pre-ch03-exponential",
            title: "3.4 指数族",
            path: "/prerequisite/ch03/exponential",
            status: "content-reviewed",
            description: "指数族分布的统一形式与充分统计量。",
          },
          {
            id: "pre-ch03-nonparametric",
            title: "3.5 非参数方法",
            path: "/prerequisite/ch03/nonparametric",
            status: "content-reviewed",
            description: "直方图、核密度估计与最近邻。",
          }
        ],
      }
    ],
  },
  {
    id: "part-1",
    number: 1,
    title: "监督学习基础",
    kind: "main",
    bishopRange: "Ch 4–5",
    chapters: [
      {
        id: "ch01",
        number: 1,
        title: "单层网络：回归",
        bishopChapter: "Ch 4",
        sections: [
          {
            id: "ch01-overview",
            title: "课程概览",
            path: "/ch01/overview",
            status: "content-reviewed",
            description: "线性回归作为最简单的单层神经网络。",
          },
          {
            id: "ch01-linear-regression",
            title: "4.1 线性回归",
            path: "/ch01/linear-regression",
            status: "content-reviewed",
            description: "基函数、似然函数、最大似然、最小二乘几何、序列学习与正则化。",
          },
          {
            id: "ch01-decision-theory",
            title: "4.2 决策理论",
            path: "/ch01/decision-theory",
            status: "draft",
            description: "损失函数、期望损失与最优决策。",
          },
          {
            id: "ch01-bias-variance",
            title: "4.3 偏差–方差权衡",
            path: "/ch01/bias-variance",
            status: "teaching-ready",
            description: "偏差、方差分解与模型复杂度。",
          }
        ],
      },
      {
        id: "ch02",
        number: 2,
        title: "单层网络：分类",
        bishopChapter: "Ch 5",
        sections: [
          {
            id: "ch02-overview",
            title: "课程概览",
            path: "/ch02/overview",
            status: "content-reviewed",
            description: "分类问题、判别函数与决策边界。",
          },
          {
            id: "ch02-discriminant-functions",
            title: "5.1 判别函数",
            path: "/ch02/discriminant-functions",
            status: "draft",
            description: "二分类与多类判别函数、1-of-K 编码、最小二乘分类。",
          },
          {
            id: "ch02-decision-theory",
            title: "5.2 决策理论",
            path: "/ch02/decision-theory",
            status: "draft",
            description: "误分类率、期望损失、拒绝选项、推断与决策。",
          },
          {
            id: "ch02-generative-classifiers",
            title: "5.3 生成分类器",
            path: "/ch02/generative-classifiers",
            status: "content-reviewed",
            description: "连续输入、最大似然解、离散特征与指数族。",
          },
          {
            id: "ch02-discriminative-classifiers",
            title: "5.4 判别分类器",
            path: "/ch02/discriminative-classifiers",
            status: "content-reviewed",
            description: "激活函数、固定基函数、逻辑回归与多类逻辑回归。",
          }
        ],
      }
    ],
  },
  {
    id: "part-2",
    number: 2,
    title: "深度神经网络",
    kind: "main",
    bishopRange: "Ch 6–9",
    chapters: [
      {
        id: "ch03",
        number: 3,
        title: "深度神经网络",
        bishopChapter: "Ch 6",
        sections: [
          {
            id: "ch03-overview",
            title: "课程概览",
            path: "/ch03/overview",
            status: "content-reviewed",
            description: "多层网络、激活函数与深度学习的表示能力。",
          },
          {
            id: "ch03-limitations-of-fixed-basis-functions",
            title: "6.1 固定基函数的局限性",
            path: "/ch03/limitations-of-fixed-basis-functions",
            status: "content-reviewed",
            description: "维度灾难、高维空间、数据流形与数据相关基函数。",
          },
          {
            id: "ch03-multilayer-networks",
            title: "6.2 多层网络",
            path: "/ch03/multilayer-networks",
            status: "content-reviewed",
            description: "参数矩阵、通用近似、隐藏单元激活函数与权重空间对称性。",
          },
          {
            id: "ch03-deep-networks",
            title: "6.3 深度网络",
            path: "/ch03/deep-networks",
            status: "content-reviewed",
            description: "层次化表示、分布式表示、表示学习、迁移学习与对比学习。",
          },
          {
            id: "ch03-error-functions",
            title: "6.4 误差函数",
            path: "/ch03/error-functions",
            status: "content-reviewed",
            description: "回归、二分类与多分类的误差函数。",
          },
          {
            id: "ch03-mixture-density-networks",
            title: "6.5 混合密度网络",
            path: "/ch03/mixture-density-networks",
            status: "content-reviewed",
            description: "条件混合分布、机器人运动学示例与预测分布。",
          }
        ],
      },
      {
        id: "ch04",
        number: 4,
        title: "梯度下降",
        bishopChapter: "Ch 7",
        sections: [
          {
            id: "ch04-overview",
            title: "课程概览",
            path: "/ch04/overview",
            status: "content-reviewed",
            description: "误差曲面、批量/SGD、动量、Adam、学习率调度。",
          },
          {
            id: "ch04-error-surfaces",
            title: "7.1 误差曲面",
            path: "/ch04/error-surfaces",
            status: "content-reviewed",
            description: "局部二次近似与 Hessian 分析。",
          },
          {
            id: "ch04-gradient-descent-optimization",
            title: "7.2 梯度下降优化",
            path: "/ch04/gradient-descent-optimization",
            status: "content-reviewed",
            description: "批量梯度下降、随机梯度下降、小批量与参数初始化。",
          },
          {
            id: "ch04-convergence",
            title: "7.3 收敛性",
            path: "/ch04/convergence",
            status: "content-reviewed",
            description: "动量、学习率调度、RMSProp 与 Adam。",
          },
          {
            id: "ch04-normalization",
            title: "7.4 归一化",
            path: "/ch04/normalization",
            status: "content-reviewed",
            description: "数据归一化、批归一化与层归一化。",
          }
        ],
      },
      {
        id: "ch05",
        number: 5,
        title: "反向传播",
        bishopChapter: "Ch 8",
        sections: [
          {
            id: "ch05-overview",
            title: "课程概览",
            path: "/ch05/overview",
            status: "content-reviewed",
            description: "计算图、链式法则与反向传播算法。",
          },
          {
            id: "ch05-evaluation-of-gradients",
            title: "8.1 梯度求值",
            path: "/ch05/evaluation-of-gradients",
            status: "content-reviewed",
            description: "单层网络、一般前馈网络、Jacobian 与 Hessian 矩阵。",
          },
          {
            id: "ch05-automatic-differentiation",
            title: "8.2 自动微分",
            path: "/ch05/automatic-differentiation",
            status: "content-reviewed",
            description: "前向模式与反向模式自动微分。",
          }
        ],
      },
      {
        id: "ch06",
        number: 6,
        title: "正则化",
        bishopChapter: "Ch 9",
        sections: [
          {
            id: "ch06-overview",
            title: "课程概览",
            path: "/ch06/overview",
            status: "content-reviewed",
            description: "权重衰减、早停、Dropout、双下降。",
          },
          {
            id: "ch06-inductive-bias",
            title: "9.1 归纳偏置",
            path: "/ch06/inductive-bias",
            status: "content-reviewed",
            description: "逆问题、无免费午餐定理、对称性、不变性与等变性。",
          },
          {
            id: "ch06-weight-decay",
            title: "9.2 权重衰减",
            path: "/ch06/weight-decay",
            status: "content-reviewed",
            description: "一致正则化器与广义权重衰减。",
          },
          {
            id: "ch06-learning-curves",
            title: "9.3 学习曲线",
            path: "/ch06/learning-curves",
            status: "content-reviewed",
            description: "早停、双下降与模型复杂度。",
          },
          {
            id: "ch06-parameter-sharing",
            title: "9.4 参数共享",
            path: "/ch06/parameter-sharing",
            status: "content-reviewed",
            description: "软权重共享与卷积等结构中的参数共享。",
          },
          {
            id: "ch06-residual-connections",
            title: "9.5 残差连接",
            path: "/ch06/residual-connections",
            status: "content-reviewed",
            description: "跳跃连接与深度网络训练稳定性。",
          },
          {
            id: "ch06-model-averaging",
            title: "9.6 模型平均",
            path: "/ch06/model-averaging",
            status: "content-reviewed",
            description: "Dropout 与模型平均。",
          }
        ],
      }
    ],
  },
  {
    id: "part-3",
    number: 3,
    title: "结构化数据与序列",
    kind: "main",
    bishopRange: "Ch 10–13",
    chapters: [
      {
        id: "ch07",
        number: 7,
        title: "卷积网络",
        bishopChapter: "Ch 10",
        sections: [
          {
            id: "ch07-overview",
            title: "课程概览",
            path: "/ch07/overview",
            status: "content-reviewed",
            description: "卷积、池化、CNN 架构与视觉任务。",
          },
          {
            id: "ch07-computer-vision",
            title: "10.1 计算机视觉",
            path: "/ch07/computer-vision",
            status: "content-reviewed",
            description: "图像数据与视觉任务概述。",
          },
          {
            id: "ch07-convolutional-filters",
            title: "10.2 卷积滤波器",
            path: "/ch07/convolutional-filters",
            status: "content-reviewed",
            description: "特征检测器、平移等变性、填充、步幅、池化与多层卷积。",
          },
          {
            id: "ch07-visualizing-trained-cnns",
            title: "10.3 可视化训练后的 CNN",
            path: "/ch07/visualizing-trained-cnns",
            status: "content-reviewed",
            description: "视觉皮层、滤波器可视化、显著性图、对抗攻击与合成图像。",
          },
          {
            id: "ch07-object-detection",
            title: "10.4 目标检测",
            path: "/ch07/object-detection",
            status: "content-reviewed",
            description: "边界框、IoU、滑动窗口、多尺度检测、非极大抑制与 Fast R-CNN。",
          },
          {
            id: "ch07-image-segmentation",
            title: "10.5 图像分割",
            path: "/ch07/image-segmentation",
            status: "content-reviewed",
            description: "卷积分割、上采样、全卷积网络与 U-Net。",
          },
          {
            id: "ch07-style-transfer",
            title: "10.6 风格迁移",
            path: "/ch07/style-transfer",
            status: "content-reviewed",
            description: "神经风格迁移与特征重组。",
          }
        ],
      },
      {
        id: "ch08",
        number: 8,
        title: "结构化分布",
        bishopChapter: "Ch 11",
        sections: [
          {
            id: "ch08-overview",
            title: "课程概览",
            path: "/ch08/overview",
            status: "content-reviewed",
            description: "图模型、条件独立与序列模型。",
          },
          {
            id: "ch08-graphical-models",
            title: "11.1 图模型",
            path: "/ch08/graphical-models",
            status: "content-reviewed",
            description: "有向图、因子分解、离散/高斯变量与贝叶斯定理。",
          },
          {
            id: "ch08-conditional-independence",
            title: "11.2 条件独立",
            path: "/ch08/conditional-independence",
            status: "content-reviewed",
            description: "三种示例图、解释消除、d-分离、朴素贝叶斯与马尔可夫毯。",
          },
          {
            id: "ch08-sequence-models",
            title: "11.3 序列模型",
            path: "/ch08/sequence-models",
            status: "content-reviewed",
            description: "隐变量与序列建模。",
          }
        ],
      },
      {
        id: "ch09",
        number: 9,
        title: "Transformer",
        bishopChapter: "Ch 12",
        sections: [
          {
            id: "ch09-overview",
            title: "课程概览",
            path: "/ch09/overview",
            status: "draft",
            description: "注意力、自注意力、多头注意力与大语言模型。",
          },
          {
            id: "ch09-attention",
            title: "12.1 注意力机制",
            path: "/ch09/attention",
            status: "teaching-ready",
            description: "Transformer 处理流程、注意力系数、自注意力、多头注意力与位置编码。",
          },
          {
            id: "ch09-natural-language",
            title: "12.2 自然语言处理",
            path: "/ch09/natural-language",
            status: "draft",
            description: "词嵌入、分词、词袋、自回归模型、RNN 与随时间反向传播。",
          },
          {
            id: "ch09-transformer-language-models",
            title: "12.3 Transformer 语言模型",
            path: "/ch09/transformer-language-models",
            status: "draft",
            description: "解码器/编码器 Transformer、采样策略、序列到序列与大语言模型。",
          },
          {
            id: "ch09-multimodal-transformers",
            title: "12.4 多模态 Transformer",
            path: "/ch09/multimodal-transformers",
            status: "draft",
            description: "视觉 Transformer、图像生成 Transformer、音频、语音合成与视觉-语言模型。",
          }
        ],
      },
      {
        id: "ch10",
        number: 10,
        title: "图神经网络",
        bishopChapter: "Ch 13",
        sections: [
          {
            id: "ch10-overview",
            title: "课程概览",
            path: "/ch10/overview",
            status: "content-reviewed",
            description: "消息传递、GCN、GAT 与几何深度学习。",
          },
          {
            id: "ch10-machine-learning-on-graphs",
            title: "13.1 图上的机器学习",
            path: "/ch10/machine-learning-on-graphs",
            status: "content-reviewed",
            description: "图性质、邻接矩阵与置换等变性。",
          },
          {
            id: "ch10-neural-message-passing",
            title: "13.2 神经消息传递",
            path: "/ch10/neural-message-passing",
            status: "content-reviewed",
            description: "卷积滤波器、图卷积网络、聚合/更新算子与节点/边/图分类。",
          },
          {
            id: "ch10-general-graph-networks",
            title: "13.3 通用图网络",
            path: "/ch10/general-graph-networks",
            status: "content-reviewed",
            description: "图注意力网络、边嵌入、图嵌入、过平滑、正则化与几何深度学习。",
          }
        ],
      }
    ],
  },
  {
    id: "part-4",
    number: 4,
    title: "概率模型与生成模型",
    kind: "main",
    bishopRange: "Ch 14–20",
    chapters: [
      {
        id: "ch11",
        number: 11,
        title: "采样",
        bishopChapter: "Ch 14",
        sections: [
          {
            id: "ch11-overview",
            title: "课程概览",
            path: "/ch11/overview",
            status: "content-reviewed",
            description: "拒绝采样、重要性采样、MCMC、Gibbs 与 Langevin。",
          },
          {
            id: "ch11-basic-sampling-algorithms",
            title: "14.1 基本采样算法",
            path: "/ch11/basic-sampling-algorithms",
            status: "content-reviewed",
            description: "期望、标准分布、拒绝采样、自适应拒绝采样、重要性采样与 SIR。",
          },
          {
            id: "ch11-markov-chain-monte-carlo",
            title: "14.2 马尔可夫链蒙特卡洛",
            path: "/ch11/markov-chain-monte-carlo",
            status: "content-reviewed",
            description: "Metropolis 算法、马尔可夫链、Metropolis-Hastings 与 Gibbs 采样。",
          },
          {
            id: "ch11-langevin-sampling",
            title: "14.3 Langevin 采样",
            path: "/ch11/langevin-sampling",
            status: "content-reviewed",
            description: "基于能量的模型、似然最大化与 Langevin 动力学。",
          }
        ],
      },
      {
        id: "ch12",
        number: 12,
        title: "离散隐变量",
        bishopChapter: "Ch 15",
        sections: [
          {
            id: "ch12-overview",
            title: "课程概览",
            path: "/ch12/overview",
            status: "content-reviewed",
            description: "K-means、高斯混合模型与 EM 算法。",
          },
          {
            id: "ch12-k-means-clustering",
            title: "15.1 K-means 聚类",
            path: "/ch12/k-means-clustering",
            status: "content-reviewed",
            description: "K-means 算法与图像分割示例。",
          },
          {
            id: "ch12-mixtures-of-gaussians",
            title: "15.2 高斯混合",
            path: "/ch12/mixtures-of-gaussians",
            status: "content-reviewed",
            description: "似然函数与最大似然。",
          },
          {
            id: "ch12-expectation-maximization",
            title: "15.3 期望最大化算法",
            path: "/ch12/expectation-maximization",
            status: "content-reviewed",
            description: "高斯混合 EM、与 K-means 的关系、Bernoulli 混合。",
          },
          {
            id: "ch12-evidence-lower-bound",
            title: "15.4 证据下界",
            path: "/ch12/evidence-lower-bound",
            status: "draft",
            description: "ELBO、EM 再审视、i.i.d. 数据、参数先验与广义 EM。",
          }
        ],
      },
      {
        id: "ch13",
        number: 13,
        title: "连续隐变量",
        bishopChapter: "Ch 16",
        sections: [
          {
            id: "ch13-overview",
            title: "课程概览",
            path: "/ch13/overview",
            status: "draft",
            description: "PCA、因子分析、ICA 与非线性隐变量模型。",
          },
          {
            id: "ch13-principal-component-analysis",
            title: "16.1 主成分分析",
            path: "/ch13/principal-component-analysis",
            status: "content-reviewed",
            description: "最大方差形式、最小误差形式、数据压缩、白化与高维数据。",
          },
          {
            id: "ch13-probabilistic-latent-variables",
            title: "16.2 概率隐变量",
            path: "/ch13/probabilistic-latent-variables",
            status: "draft",
            description: "生成模型、似然函数、最大似然、因子分析与独立成分分析。",
          },
          {
            id: "ch13-evidence-lower-bound",
            title: "16.3 证据下界",
            path: "/ch13/evidence-lower-bound",
            status: "content-reviewed",
            description: "期望最大化、PCA 的 EM、因子分析的 EM。",
          },
          {
            id: "ch13-nonlinear-latent-variable-models",
            title: "16.4 非线性隐变量模型",
            path: "/ch13/nonlinear-latent-variable-models",
            status: "content-reviewed",
            description: "非线性流形、似然函数、离散数据与生成建模四种方法。",
          }
        ],
      },
      {
        id: "ch14",
        number: 14,
        title: "生成对抗网络",
        bishopChapter: "Ch 17",
        sections: [
          {
            id: "ch14-overview",
            title: "课程概览",
            path: "/ch14/overview",
            status: "content-reviewed",
            description: "对抗训练、GAN 损失与 CycleGAN。",
          },
          {
            id: "ch14-adversarial-training",
            title: "17.1 对抗训练",
            path: "/ch14/adversarial-training",
            status: "content-reviewed",
            description: "GAN 损失函数与实践中的训练技巧。",
          },
          {
            id: "ch14-image-gans",
            title: "17.2 图像 GAN",
            path: "/ch14/image-gans",
            status: "content-reviewed",
            description: "CycleGAN 与图像转换。",
          }
        ],
      },
      {
        id: "ch15",
        number: 15,
        title: "标准化流",
        bishopChapter: "Ch 18",
        sections: [
          {
            id: "ch15-overview",
            title: "课程概览",
            path: "/ch15/overview",
            status: "content-reviewed",
            description: "耦合流、自回归流、连续流与神经 ODE。",
          },
          {
            id: "ch15-coupling-flows",
            title: "18.1 耦合流",
            path: "/ch15/coupling-flows",
            status: "content-reviewed",
            description: "可逆耦合层与 RealNVP。",
          },
          {
            id: "ch15-autoregressive-flows",
            title: "18.2 自回归流",
            path: "/ch15/autoregressive-flows",
            status: "content-reviewed",
            description: "自回归变换与 MAF/IAF。",
          },
          {
            id: "ch15-continuous-flows",
            title: "18.3 连续流",
            path: "/ch15/continuous-flows",
            status: "content-reviewed",
            description: "神经微分方程、反向传播与神经 ODE 流。",
          }
        ],
      },
      {
        id: "ch16",
        number: 16,
        title: "自编码器",
        bishopChapter: "Ch 19",
        sections: [
          {
            id: "ch16-overview",
            title: "课程概览",
            path: "/ch16/overview",
            status: "content-reviewed",
            description: "线性/深度/稀疏/去噪自编码器与 VAE。",
          },
          {
            id: "ch16-deterministic-autoencoders",
            title: "19.1 确定性自编码器",
            path: "/ch16/deterministic-autoencoders",
            status: "content-reviewed",
            description: "线性、深度、稀疏、去噪与掩码自编码器。",
          },
          {
            id: "ch16-variational-autoencoders",
            title: "19.2 变分自编码器",
            path: "/ch16/variational-autoencoders",
            status: "content-reviewed",
            description: "摊销推断与重参数化技巧。",
          }
        ],
      },
      {
        id: "ch17",
        number: 17,
        title: "扩散模型",
        bishopChapter: "Ch 20",
        sections: [
          {
            id: "ch17-overview",
            title: "课程概览",
            path: "/ch17/overview",
            status: "content-reviewed",
            description: "前向/反向扩散、ELBO、分数匹配与引导扩散。",
          },
          {
            id: "ch17-forward-encoder",
            title: "20.1 前向编码器",
            path: "/ch17/forward-encoder",
            status: "content-reviewed",
            description: "扩散核与条件分布。",
          },
          {
            id: "ch17-reverse-decoder",
            title: "20.2 反向解码器",
            path: "/ch17/reverse-decoder",
            status: "content-reviewed",
            description: "训练解码器、ELBO、重写的 ELBO 与噪声预测。",
          },
          {
            id: "ch17-score-matching",
            title: "20.3 分数匹配",
            path: "/ch17/score-matching",
            status: "content-reviewed",
            description: "分数损失函数、改进的分数损失、噪声方差与随机微分方程。",
          },
          {
            id: "ch17-guided-diffusion",
            title: "20.4 引导扩散",
            path: "/ch17/guided-diffusion",
            status: "content-reviewed",
            description: "分类器引导与无分类器引导。",
          }
        ],
      }
    ],
  },
  {
    id: "part-5",
    number: 5,
    title: "附录",
    kind: "appendix",
    bishopRange: "Appendix A–C",
    chapters: [
      {
        id: "appendix-a",
        number: 1,
        title: "线性代数",
        bishopChapter: "Appendix A",
        sections: [
          {
            id: "appendix-a-overview",
            title: "矩阵运算",
            path: "/appendix/a/overview",
            status: "content-reviewed",
            description: "矩阵恒等式、迹、行列式、导数与特征向量。",
          }
        ],
      },
      {
        id: "appendix-b",
        number: 2,
        title: "变分法",
        bishopChapter: "Appendix B",
        sections: [
          {
            id: "appendix-b-overview",
            title: "变分法基础",
            path: "/appendix/b/overview",
            status: "content-reviewed",
            description: "泛函导数与欧拉-拉格朗日方程。",
          }
        ],
      },
      {
        id: "appendix-c",
        number: 3,
        title: "拉格朗日乘子",
        bishopChapter: "Appendix C",
        sections: [
          {
            id: "appendix-c-overview",
            title: "约束优化",
            path: "/appendix/c/overview",
            status: "content-reviewed",
            description: "等式约束与拉格朗日乘子法。",
          }
        ],
      }
    ],
  }
];

export function getAllSections(): Section[] {
  return courseManifest.flatMap((part) => part.chapters.flatMap((chapter) => chapter.sections));
}

export function getSectionByPath(path: string): Section | undefined {
  return getAllSections().find((section) => section.path === path);
}

export function getTeachingReadySections(): Section[] {
  return getAllSections().filter((section) => section.status === "teaching-ready");
}

export function getInteractiveReviewedSections(): Section[] {
  return getAllSections().filter((section) => section.status === "interactive-reviewed");
}

export function getContentReviewedSections(): Section[] {
  return getAllSections().filter((section) => section.status === "content-reviewed");
}

export function getDraftSections(): Section[] {
  return getAllSections().filter((section) => section.status === "draft");
}

export function getSkeletonSections(): Section[] {
  return getAllSections().filter((section) => section.status === "skeleton");
}

export function getTotalSectionCount(): number {
  return getAllSections().length;
}

export function getTeachingReadyCount(): number {
  return getTeachingReadySections().length;
}

export function getInteractiveReviewedCount(): number {
  return getInteractiveReviewedSections().length;
}

export function getContentReviewedCount(): number {
  return getContentReviewedSections().length;
}

export function getDraftCount(): number {
  return getDraftSections().length;
}

export function getSkeletonCount(): number {
  return getSkeletonSections().length;
}

export function getChapterStatus(chapter: Chapter): SectionStatus {
  const statuses = chapter.sections.map((s) => s.status);
  const order: SectionStatus[] = [
    "skeleton",
    "draft",
    "content-reviewed",
    "interactive-reviewed",
    "teaching-ready",
  ];
  // Chapter status is the minimum (least mature) among its sections.
  return order[Math.min(...statuses.map((s) => order.indexOf(s)))];
}

export function statusLabel(status: SectionStatus): string {
  switch (status) {
    case "skeleton":
      return "骨架";
    case "draft":
      return "制作中";
    case "content-reviewed":
      return "内容审校";
    case "interactive-reviewed":
      return "交互审校";
    case "teaching-ready":
      return "可教学";
    default:
      return "";
  }
}

export function getPartByChapterId(chapterId: string): Part | undefined {
  return courseManifest.find((part) => part.chapters.some((chapter) => chapter.id === chapterId));
}

export function getChapterById(chapterId: string): Chapter | undefined {
  for (const part of courseManifest) {
    const chapter = part.chapters.find((c) => c.id === chapterId);
    if (chapter) return chapter;
  }
  return undefined;
}

export function getChapterDisplayLabel(chapter: Chapter, part?: Part): string {
  const p = part ?? getPartByChapterId(chapter.id);
  if (!p) return `${chapter.number}. ${chapter.title}`;
  if (p.kind === "prerequisite") return `先修 Ch ${chapter.number}`;
  if (p.kind === "appendix") {
    const label = chapter.bishopChapter?.replace("Appendix ", "") ?? String(chapter.number);
    return `附录 ${label}`;
  }
  return chapter.bishopChapter ?? `Ch ${chapter.number}`;
}

export function getChapterFullTitle(chapter: Chapter, part?: Part): string {
  const label = getChapterDisplayLabel(chapter, part);
  return `${label}. ${chapter.title}`;
}
