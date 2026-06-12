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
    title: "Supervised Learning",
    chapters: [
      {
        id: "ch01",
        number: 1,
        title: "Linear Regression",
        sections: [
          {
            id: "ch01-s01",
            title: "1.1 LMS algorithm",
            path: "/ch01/s01",
            completed: true,
            description: "Least mean squares update rule, batch and stochastic gradient descent.",
          },
          {
            id: "ch01-s02",
            title: "1.2 The normal equations",
            path: "/ch01/s02",
            completed: false,
            description: "Closed-form solution via matrix derivatives and least squares.",
          },
          {
            id: "ch01-s03",
            title: "1.3 Probabilistic interpretation",
            path: "/ch01/s03",
            completed: false,
            description: "Gaussian noise and maximum likelihood estimation.",
          },
          {
            id: "ch01-s04",
            title: "1.4 Locally weighted linear regression",
            path: "/ch01/s04",
            completed: false,
            description: "Non-parametric regression with local weighting.",
          },
        ],
      },
      {
        id: "ch02",
        number: 2,
        title: "Classification and Logistic Regression",
        sections: [
          {
            id: "ch02-s01",
            title: "2.1 Logistic regression",
            path: "/ch02/s01",
            completed: false,
            description: "Binary classification with the logistic function.",
          },
          {
            id: "ch02-s02",
            title: "2.2 The perceptron learning algorithm",
            path: "/ch02/s02",
            completed: false,
            description: "A simple online learning algorithm for classification.",
          },
          {
            id: "ch02-s03",
            title: "2.3 Multi-class classification",
            path: "/ch02/s03",
            completed: false,
            description: "Softmax regression for multiple classes.",
          },
          {
            id: "ch02-s04",
            title: "2.4 Maximizing ℓ(θ)",
            path: "/ch02/s04",
            completed: false,
            description: "Newton's method and other optimization algorithms.",
          },
        ],
      },
      {
        id: "ch03",
        number: 3,
        title: "Generalized Linear Models",
        sections: [
          {
            id: "ch03-s01",
            title: "3.1 The exponential family",
            path: "/ch03/s01",
            completed: false,
            description: "A unified family of probability distributions.",
          },
          {
            id: "ch03-s02",
            title: "3.2 Constructing GLMs",
            path: "/ch03/s02",
            completed: false,
            description: "Building OLS and logistic regression from GLM assumptions.",
          },
        ],
      },
      {
        id: "ch04",
        number: 4,
        title: "Generative Learning Algorithms",
        sections: [
          {
            id: "ch04-s01",
            title: "4.1 Gaussian discriminant analysis",
            path: "/ch04/s01",
            completed: false,
            description: "Generative classification with multivariate Gaussians.",
          },
          {
            id: "ch04-s02",
            title: "4.2 Naive Bayes",
            path: "/ch04/s02",
            completed: false,
            description: "Generative text classification and Laplace smoothing.",
          },
        ],
      },
      {
        id: "ch05",
        number: 5,
        title: "Kernel Methods",
        sections: [
          {
            id: "ch05-s01",
            title: "5.1 Feature maps",
            path: "/ch05/s01",
            completed: false,
            description: "Mapping inputs to higher-dimensional spaces.",
          },
          {
            id: "ch05-s02",
            title: "5.2 LMS with features",
            path: "/ch05/s02",
            completed: false,
            description: "Gradient descent in feature space.",
          },
          {
            id: "ch05-s03",
            title: "5.3 The kernel trick",
            path: "/ch05/s03",
            completed: false,
            description: "Implicit high-dimensional computation via kernels.",
          },
          {
            id: "ch05-s04",
            title: "5.4 Properties of kernels",
            path: "/ch05/s04",
            completed: false,
            description: "Valid kernel functions and closure properties.",
          },
        ],
      },
      {
        id: "ch06",
        number: 6,
        title: "Support Vector Machines",
        sections: [
          {
            id: "ch06-s01",
            title: "6.1 Margins: intuition",
            path: "/ch06/s01",
            completed: false,
            description: "Geometric motivation for large-margin classifiers.",
          },
          {
            id: "ch06-s02",
            title: "6.2–6.8 SVM theory and algorithms",
            path: "/ch06/s02",
            completed: false,
            description: "Functional/geometric margins, duality, kernels, SMO.",
          },
        ],
      },
    ],
  },
  {
    id: "part-ii",
    number: 2,
    title: "Deep Learning",
    chapters: [
      {
        id: "ch07",
        number: 7,
        title: "Deep Learning",
        sections: [
          {
            id: "ch07-s01",
            title: "7.1 Supervised learning with non-linear models",
            path: "/ch07/s01",
            completed: false,
            description: "Beyond linear hypotheses.",
          },
          {
            id: "ch07-s02",
            title: "7.2 Neural networks",
            path: "/ch07/s02",
            completed: false,
            description: "Layered computation and activation functions.",
          },
          {
            id: "ch07-s03",
            title: "7.3 Modules in modern neural networks",
            path: "/ch07/s03",
            completed: false,
            description: "Common building blocks of deep networks.",
          },
          {
            id: "ch07-s04",
            title: "7.4 Backpropagation",
            path: "/ch07/s04",
            completed: false,
            description: "Efficient gradient computation in computational graphs.",
          },
          {
            id: "ch07-s05",
            title: "7.5 Vectorization over training examples",
            path: "/ch07/s05",
            completed: false,
            description: "Matrix notation for parallelizing neural network training.",
          },
        ],
      },
    ],
  },
  {
    id: "part-iii",
    number: 3,
    title: "Generalization and Regularization",
    chapters: [
      {
        id: "ch08",
        number: 8,
        title: "Generalization",
        sections: [
          {
            id: "ch08-s01",
            title: "8.1 Bias-variance tradeoff",
            path: "/ch08/s01",
            completed: false,
            description: "Decomposing prediction error.",
          },
          {
            id: "ch08-s02",
            title: "8.2 The double descent phenomenon",
            path: "/ch08/s02",
            completed: false,
            description: "Beyond the classical U-shaped risk curve.",
          },
          {
            id: "ch08-s03",
            title: "8.3 Sample complexity bounds",
            path: "/ch08/s03",
            completed: false,
            description: "PAC learning for finite and infinite hypothesis classes.",
          },
        ],
      },
      {
        id: "ch09",
        number: 9,
        title: "Regularization and Model Selection",
        sections: [
          {
            id: "ch09-s01",
            title: "9.1 Regularization",
            path: "/ch09/s01",
            completed: false,
            description: "Penalized objective functions to reduce overfitting.",
          },
          {
            id: "ch09-s02",
            title: "9.2 Implicit regularization effect",
            path: "/ch09/s02",
            completed: false,
            description: "How optimization choices act as regularization.",
          },
          {
            id: "ch09-s03",
            title: "9.3 Model selection via cross validation",
            path: "/ch09/s03",
            completed: false,
            description: "Choosing hyperparameters and model complexity.",
          },
          {
            id: "ch09-s04",
            title: "9.4 Bayesian statistics and regularization",
            path: "/ch09/s04",
            completed: false,
            description: "A probabilistic view of regularization.",
          },
        ],
      },
    ],
  },
  {
    id: "part-iv",
    number: 4,
    title: "Unsupervised Learning",
    chapters: [
      {
        id: "ch10",
        number: 10,
        title: "Clustering and the K-means Algorithm",
        sections: [
          {
            id: "ch10-s01",
            title: "10.1 K-means clustering",
            path: "/ch10/s01",
            completed: false,
            description: "An iterative clustering algorithm.",
          },
        ],
      },
      {
        id: "ch11",
        number: 11,
        title: "EM Algorithms",
        sections: [
          {
            id: "ch11-s01",
            title: "11.1 EM for mixture of Gaussians",
            path: "/ch11/s01",
            completed: false,
            description: "Expectation-Maximization for GMMs.",
          },
          {
            id: "ch11-s02",
            title: "11.2 Jensen's inequality",
            path: "/ch11/s02",
            completed: false,
            description: "Mathematical foundation for the EM algorithm.",
          },
          {
            id: "ch11-s03",
            title: "11.3 General EM algorithms",
            path: "/ch11/s03",
            completed: false,
            description: "The general EM framework and ELBO.",
          },
          {
            id: "ch11-s04",
            title: "11.4 Mixture of Gaussians revisited",
            path: "/ch11/s04",
            completed: false,
            description: "Applying general EM to GMMs.",
          },
          {
            id: "ch11-s05",
            title: "11.5 Variational inference and VAEs",
            path: "/ch11/s05",
            completed: false,
            description: "Optional: variational auto-encoders.",
          },
        ],
      },
      {
        id: "ch12",
        number: 12,
        title: "Principal Components Analysis",
        sections: [
          {
            id: "ch12-s01",
            title: "12.1 Principal components analysis",
            path: "/ch12/s01",
            completed: false,
            description: "Dimensionality reduction via eigenvectors.",
          },
        ],
      },
      {
        id: "ch13",
        number: 13,
        title: "Independent Components Analysis",
        sections: [
          {
            id: "ch13-s01",
            title: "13.1–13.3 ICA",
            path: "/ch13/s01",
            completed: false,
            description: "Blind source separation and density transformations.",
          },
        ],
      },
      {
        id: "ch14",
        number: 14,
        title: "Self-Supervised Learning and Foundation Models",
        sections: [
          {
            id: "ch14-s01",
            title: "14.1 Pretraining and adaptation",
            path: "/ch14/s01",
            completed: false,
            description: "Transfer learning from pretrained representations.",
          },
          {
            id: "ch14-s02",
            title: "14.2 Pretraining in computer vision",
            path: "/ch14/s02",
            completed: false,
            description: "Self-supervised methods for images.",
          },
          {
            id: "ch14-s03",
            title: "14.3 Pretrained large language models",
            path: "/ch14/s03",
            completed: false,
            description: "Transformers, zero-shot and in-context learning.",
          },
        ],
      },
    ],
  },
  {
    id: "part-v",
    number: 5,
    title: "Reinforcement Learning and Control",
    chapters: [
      {
        id: "ch15",
        number: 15,
        title: "Reinforcement Learning",
        sections: [
          {
            id: "ch15-s01",
            title: "15.1 Markov decision processes",
            path: "/ch15/s01",
            completed: false,
            description: "The formal RL problem setting.",
          },
          {
            id: "ch15-s02",
            title: "15.2 Value and policy iteration",
            path: "/ch15/s02",
            completed: false,
            description: "Dynamic programming algorithms for MDPs.",
          },
          {
            id: "ch15-s03",
            title: "15.3 Learning a model for an MDP",
            path: "/ch15/s03",
            completed: false,
            description: "Model-based reinforcement learning.",
          },
          {
            id: "ch15-s04",
            title: "15.4 Continuous state MDPs",
            path: "/ch15/s04",
            completed: false,
            description: "Discretization and function approximation.",
          },
          {
            id: "ch15-s05",
            title: "15.5 Connections between policy and value iteration",
            path: "/ch15/s05",
            completed: false,
            description: "Optional: unified view of DP algorithms.",
          },
        ],
      },
      {
        id: "ch16",
        number: 16,
        title: "LQR, DDP and LQG",
        sections: [
          {
            id: "ch16-s01",
            title: "16.1 Finite-horizon MDPs",
            path: "/ch16/s01",
            completed: false,
            description: "MDPs with a fixed time horizon.",
          },
          {
            id: "ch16-s02",
            title: "16.2 Linear Quadratic Regulation (LQR)",
            path: "/ch16/s02",
            completed: false,
            description: "Optimal control for linear systems.",
          },
          {
            id: "ch16-s03",
            title: "16.3 From non-linear dynamics to LQR",
            path: "/ch16/s03",
            completed: false,
            description: "Linearization and differential dynamic programming.",
          },
          {
            id: "ch16-s04",
            title: "16.4 Linear Quadratic Gaussian (LQG)",
            path: "/ch16/s04",
            completed: false,
            description: "LQR under partial observability.",
          },
        ],
      },
      {
        id: "ch17",
        number: 17,
        title: "Policy Gradient (REINFORCE)",
        sections: [
          {
            id: "ch17-s01",
            title: "17.1 Policy gradient and REINFORCE",
            path: "/ch17/s01",
            completed: false,
            description: "Direct optimization of parameterized policies.",
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
