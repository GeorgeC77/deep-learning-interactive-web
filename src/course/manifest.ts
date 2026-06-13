export type Section = {
  id: string;
  title: string;
  path: string;
  completed: boolean;
  description?: string;
};

export type Chapter = {
  id: string;
  number: number;
  title: string;
  sections: Section[];
};

export type Part = {
  id: string;
  number: number;
  title: string;
  chapters: Chapter[];
};

export const courseManifest: Part[] = [
  {
    id: "part-i",
    number: 1,
    title: "监督学习",
    chapters: [
      {
        id: "ch01",
        number: 1,
        title: "线性回归",
        sections: [
          {
            id: "ch01-s01",
            title: "1.1 LMS 算法",
            path: "/ch01/s01",
            completed: true,
            description: "最小均方更新规则、批量梯度下降与随机梯度下降。",
          },
          {
            id: "ch01-s02",
            title: "1.2 正规方程",
            path: "/ch01/s02",
            completed: true,
            description: "通过矩阵求导与最小二乘得到闭式解。",
          },
          {
            id: "ch01-s03",
            title: "1.3 概率解释",
            path: "/ch01/s03",
            completed: true,
            description: "高斯噪声假设与最大似然估计。",
          },
          {
            id: "ch01-s04",
            title: "1.4 局部加权线性回归",
            path: "/ch01/s04",
            completed: true,
            description: "基于局部加权的非参数回归方法。",
          },
        ],
      },
      {
        id: "ch02",
        number: 2,
        title: "分类与逻辑回归",
        sections: [
          {
            id: "ch02-s01",
            title: "2.1 逻辑回归",
            path: "/ch02/s01",
            completed: true,
            description: "使用逻辑函数进行二分类。",
          },
          {
            id: "ch02-s02",
            title: "2.2 感知机学习算法",
            path: "/ch02/s02",
            completed: true,
            description: "一种简单的在线分类学习算法。",
          },
          {
            id: "ch02-s03",
            title: "2.3 多分类问题",
            path: "/ch02/s03",
            completed: true,
            description: "Softmax 回归处理多类别分类。",
          },
          {
            id: "ch02-s04",
            title: "2.4 最大化似然函数",
            path: "/ch02/s04",
            completed: true,
            description: "牛顿法与其他优化算法。",
          },
        ],
      },
      {
        id: "ch03",
        number: 3,
        title: "广义线性模型",
        sections: [
          {
            id: "ch03-overview",
            title: "3.0 课程概览",
            path: "/ch03/overview",
            completed: true,
            description: "GLM 的核心思想与学习路线。",
          },
          {
            id: "ch03-exponential-family",
            title: "3.1 指数族分布",
            path: "/ch03/exponential-family",
            completed: true,
            description: "统一描述多种概率分布的框架。",
          },
          {
            id: "ch03-building-glm",
            title: "3.2 构建 GLM",
            path: "/ch03/building-glm",
            completed: true,
            description: "三个假设与一般形式。",
          },
          {
            id: "ch03-ols-as-glm",
            title: "3.3 普通最小二乘作为 GLM",
            path: "/ch03/ols-as-glm",
            completed: true,
            description: "高斯分布导出线性回归。",
          },
          {
            id: "ch03-logistic-as-glm",
            title: "3.4 逻辑回归作为 GLM",
            path: "/ch03/logistic-as-glm",
            completed: true,
            description: "伯努利分布导出 sigmoid。",
          },
          {
            id: "ch03-softmax-as-glm",
            title: "3.5 Softmax 回归作为 GLM",
            path: "/ch03/softmax-as-glm",
            completed: true,
            description: "多项分布导出多分类。",
          },
          {
            id: "ch03-summary",
            title: "3.6 本章总结",
            path: "/ch03/summary",
            completed: true,
            description: "核心公式与模型对比。",
          },
        ],
      },
      {
        id: "ch04",
        number: 4,
        title: "生成学习算法",
        sections: [
          {
            id: "ch04-s01",
            title: "4.1 高斯判别分析",
            path: "/ch04/s01",
            completed: false,
            description: "基于多元高斯分布的生成式分类方法。",
          },
          {
            id: "ch04-s02",
            title: "4.2 朴素贝叶斯",
            path: "/ch04/s02",
            completed: false,
            description: "生成式文本分类与拉普拉斯平滑。",
          },
        ],
      },
      {
        id: "ch05",
        number: 5,
        title: "核方法",
        sections: [
          {
            id: "ch05-s01",
            title: "5.1 特征映射",
            path: "/ch05/s01",
            completed: false,
            description: "将输入映射到高维特征空间。",
          },
          {
            id: "ch05-s02",
            title: "5.2 特征空间中的 LMS",
            path: "/ch05/s02",
            completed: false,
            description: "在高维特征空间中进行梯度下降。",
          },
          {
            id: "ch05-s03",
            title: "5.3 核技巧",
            path: "/ch05/s03",
            completed: false,
            description: "通过核函数隐式实现高维计算。",
          },
          {
            id: "ch05-s04",
            title: "5.4 核函数的性质",
            path: "/ch05/s04",
            completed: false,
            description: "有效核函数及其封闭性质。",
          },
        ],
      },
      {
        id: "ch06",
        number: 6,
        title: "支持向量机",
        sections: [
          {
            id: "ch06-s01",
            title: "6.1 间隔的直观理解",
            path: "/ch06/s01",
            completed: false,
            description: "大间隔分类器的几何动机。",
          },
          {
            id: "ch06-s02",
            title: "6.2–6.8 SVM 理论与算法",
            path: "/ch06/s02",
            completed: false,
            description: "函数间隔、几何间隔、对偶问题、核方法、SMO 算法。",
          },
        ],
      },
    ],
  },
  {
    id: "part-ii",
    number: 2,
    title: "深度学习",
    chapters: [
      {
        id: "ch07",
        number: 7,
        title: "深度学习",
        sections: [
          {
            id: "ch07-s01",
            title: "7.1 非线性模型监督学习",
            path: "/ch07/s01",
            completed: false,
            description: "超越线性假设的模型。",
          },
          {
            id: "ch07-s02",
            title: "7.2 神经网络",
            path: "/ch07/s02",
            completed: false,
            description: "分层计算与激活函数。",
          },
          {
            id: "ch07-s03",
            title: "7.3 现代神经网络模块",
            path: "/ch07/s03",
            completed: false,
            description: "深度网络中常见的构建模块。",
          },
          {
            id: "ch07-s04",
            title: "7.4 反向传播",
            path: "/ch07/s04",
            completed: false,
            description: "计算图中的高效梯度计算。",
          },
          {
            id: "ch07-s05",
            title: "7.5 训练样本的向量化",
            path: "/ch07/s05",
            completed: false,
            description: "用矩阵表示并行化神经网络训练。",
          },
        ],
      },
    ],
  },
  {
    id: "part-iii",
    number: 3,
    title: "泛化与正则化",
    chapters: [
      {
        id: "ch08",
        number: 8,
        title: "泛化",
        sections: [
          {
            id: "ch08-s01",
            title: "8.1 偏差-方差权衡",
            path: "/ch08/s01",
            completed: false,
            description: "预测误差的分解。",
          },
          {
            id: "ch08-s02",
            title: "8.2 双下降现象",
            path: "/ch08/s02",
            completed: false,
            description: "超越经典 U 型风险曲线。",
          },
          {
            id: "ch08-s03",
            title: "8.3 样本复杂度上界",
            path: "/ch08/s03",
            completed: false,
            description: "有限与无限假设类的 PAC 学习理论。",
          },
        ],
      },
      {
        id: "ch09",
        number: 9,
        title: "正则化与模型选择",
        sections: [
          {
            id: "ch09-s01",
            title: "9.1 正则化",
            path: "/ch09/s01",
            completed: false,
            description: "通过惩罚项减少过拟合。",
          },
          {
            id: "ch09-s02",
            title: "9.2 隐式正则化效应",
            path: "/ch09/s02",
            completed: false,
            description: "优化过程本身如何起到正则化作用。",
          },
          {
            id: "ch09-s03",
            title: "9.3 交叉验证模型选择",
            path: "/ch09/s03",
            completed: false,
            description: "选择超参数与模型复杂度。",
          },
          {
            id: "ch09-s04",
            title: "9.4 贝叶斯统计与正则化",
            path: "/ch09/s04",
            completed: false,
            description: "从概率角度看正则化。",
          },
        ],
      },
    ],
  },
  {
    id: "part-iv",
    number: 4,
    title: "无监督学习",
    chapters: [
      {
        id: "ch10",
        number: 10,
        title: "聚类与 K-means 算法",
        sections: [
          {
            id: "ch10-s01",
            title: "10.1 K-means 聚类",
            path: "/ch10/s01",
            completed: false,
            description: "一种迭代聚类算法。",
          },
        ],
      },
      {
        id: "ch11",
        number: 11,
        title: "EM 算法",
        sections: [
          {
            id: "ch11-s01",
            title: "11.1 高斯混合模型的 EM",
            path: "/ch11/s01",
            completed: false,
            description: "用于高斯混合模型的期望最大化算法。",
          },
          {
            id: "ch11-s02",
            title: "11.2 Jensen 不等式",
            path: "/ch11/s02",
            completed: false,
            description: "EM 算法的数学基础。",
          },
          {
            id: "ch11-s03",
            title: "11.3 一般 EM 算法",
            path: "/ch11/s03",
            completed: false,
            description: "通用 EM 框架与 ELBO。",
          },
          {
            id: "ch11-s04",
            title: "11.4 高斯混合模型再探",
            path: "/ch11/s04",
            completed: false,
            description: "将通用 EM 应用于高斯混合模型。",
          },
          {
            id: "ch11-s05",
            title: "11.5 变分推断与变分自编码器",
            path: "/ch11/s05",
            completed: false,
            description: "可选内容：变分自编码器。",
          },
        ],
      },
      {
        id: "ch12",
        number: 12,
        title: "主成分分析",
        sections: [
          {
            id: "ch12-s01",
            title: "12.1 主成分分析",
            path: "/ch12/s01",
            completed: false,
            description: "通过特征向量进行降维。",
          },
        ],
      },
      {
        id: "ch13",
        number: 13,
        title: "独立成分分析",
        sections: [
          {
            id: "ch13-s01",
            title: "13.1–13.3 独立成分分析",
            path: "/ch13/s01",
            completed: false,
            description: "盲源分离与密度变换。",
          },
        ],
      },
      {
        id: "ch14",
        number: 14,
        title: "自监督学习与基础模型",
        sections: [
          {
            id: "ch14-s01",
            title: "14.1 预训练与适配",
            path: "/ch14/s01",
            completed: false,
            description: "从预训练表示迁移学习。",
          },
          {
            id: "ch14-s02",
            title: "14.2 计算机视觉中的预训练",
            path: "/ch14/s02",
            completed: false,
            description: "图像领域的自监督方法。",
          },
          {
            id: "ch14-s03",
            title: "14.3 预训练大语言模型",
            path: "/ch14/s03",
            completed: false,
            description: "Transformer、零样本学习与上下文学习。",
          },
        ],
      },
    ],
  },
  {
    id: "part-v",
    number: 5,
    title: "强化学习",
    chapters: [
      {
        id: "ch15",
        number: 15,
        title: "强化学习",
        sections: [
          {
            id: "ch15-s01",
            title: "15.1 马尔可夫决策过程",
            path: "/ch15/s01",
            completed: false,
            description: "强化学习的形式化问题设定。",
          },
          {
            id: "ch15-s02",
            title: "15.2 值迭代与策略迭代",
            path: "/ch15/s02",
            completed: false,
            description: "MDP 的动态规划算法。",
          },
          {
            id: "ch15-s03",
            title: "15.3 学习 MDP 模型",
            path: "/ch15/s03",
            completed: false,
            description: "基于模型的强化学习。",
          },
          {
            id: "ch15-s04",
            title: "15.4 连续状态 MDP",
            path: "/ch15/s04",
            completed: false,
            description: "离散化与值函数近似。",
          },
          {
            id: "ch15-s05",
            title: "15.5 值迭代与策略迭代的关系",
            path: "/ch15/s05",
            completed: false,
            description: "可选内容：动态规划算法的统一视角。",
          },
        ],
      },
      {
        id: "ch16",
        number: 16,
        title: "线性二次调节与最优控制",
        sections: [
          {
            id: "ch16-s01",
            title: "16.1 有限时域 MDP",
            path: "/ch16/s01",
            completed: false,
            description: "具有固定时间范围的 MDP。",
          },
          {
            id: "ch16-s02",
            title: "16.2 线性二次调节（LQR）",
            path: "/ch16/s02",
            completed: false,
            description: "线性系统的最优控制。",
          },
          {
            id: "ch16-s03",
            title: "16.3 从非线性动力学到 LQR",
            path: "/ch16/s03",
            completed: false,
            description: "线性化与微分动态规划。",
          },
          {
            id: "ch16-s04",
            title: "16.4 线性二次高斯（LQG）",
            path: "/ch16/s04",
            completed: false,
            description: "部分可观测下的 LQR。",
          },
        ],
      },
      {
        id: "ch17",
        number: 17,
        title: "策略梯度（REINFORCE）",
        sections: [
          {
            id: "ch17-s01",
            title: "17.1 策略梯度与 REINFORCE",
            path: "/ch17/s01",
            completed: false,
            description: "直接优化参数化策略。",
          },
        ],
      },
    ],
  },
];

export function getAllSections(): Section[] {
  return courseManifest.flatMap((part) => part.chapters.flatMap((chapter) => chapter.sections));
}

export function getSectionByPath(path: string): Section | undefined {
  return getAllSections().find((section) => section.path === path);
}

export function getCompletedSections(): Section[] {
  return getAllSections().filter((section) => section.completed);
}

export function getTotalSectionCount(): number {
  return getAllSections().length;
}

export function getCompletedCount(): number {
  return getCompletedSections().length;
}
