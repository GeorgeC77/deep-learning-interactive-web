export type ActivationKey = 'relu' | 'sigmoid' | 'tanh' | 'leakyRelu' | 'elu';

export type ActivationSpec = {
  name: string;
  fn: (z: number) => number;
  grad: (z: number) => number;
  color: string;
};

export const ACTIVATIONS: Record<ActivationKey, ActivationSpec> = {
  relu: {
    name: 'ReLU',
    fn: (z) => Math.max(0, z),
    grad: (z) => (z > 0 ? 1 : 0),
    color: '#3b82f6',
  },
  sigmoid: {
    name: 'Sigmoid',
    fn: (z) => 1 / (1 + Math.exp(-z)),
    grad: (z) => {
      const value = 1 / (1 + Math.exp(-z));
      return value * (1 - value);
    },
    color: '#10b981',
  },
  tanh: {
    name: 'Tanh',
    fn: (z) => Math.tanh(z),
    grad: (z) => 1 - Math.tanh(z) ** 2,
    color: '#8b5cf6',
  },
  leakyRelu: {
    name: 'Leaky ReLU',
    fn: (z) => (z > 0 ? z : 0.01 * z),
    grad: (z) => (z > 0 ? 1 : 0.01),
    color: '#f59e0b',
  },
  elu: {
    name: 'ELU',
    fn: (z) => (z > 0 ? z : Math.exp(z) - 1),
    grad: (z) => (z > 0 ? 1 : Math.exp(z)),
    color: '#ef4444',
  },
};
