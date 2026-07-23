import BishopSectionPage from '@/components/BishopSectionPage';
import { Layers } from 'lucide-react';

export default function Ch03MultilayerNetworksPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch03/multilayer-networks"
      heroIcon={<Layers className="w-9 h-9 text-blue-600" />}
      summary={
        "前馈网络的每一层由线性变换（参数矩阵）和非线性激活函数组成。本节覆盖 §6.2.1–6.2.4：参数矩阵的前向传播、通用近似定理、常见隐藏单元激活函数以及权重空间对称性。"
      }
      concepts={[
        {
          title: "参数矩阵（Parameter matrices）",
          description: "第 l 层的计算为 z^l = W^l·a^{l-1} + b^l，再经激活函数 a^l = h(z^l)。W^l 是 M_l × M_{l-1} 的权重矩阵。深度学习就是通过反向传播学习所有这些 W 和 b。",
          formula: String.raw`\mathbf{z}^{(l)} = \mathbf{W}^{(l)} \mathbf{a}^{(l-1)} + \mathbf{b}^{(l)},\quad \mathbf{a}^{(l)} = h(\mathbf{z}^{(l)})`,
        },
        {
          title: "通用近似定理（Universal approximation）",
          description: "一个足够宽的单隐藏网络可以以任意精度逼近定义在紧集上的任何连续函数。但定理没有告诉我们需要多宽（可能是天文数字），也没有说明如何从数据学习参数。更重要的是：深度往往比宽度更高效。",
        },
        {
          title: "隐藏单元激活函数",
          description: "tanh（零中心，饱和）、logistic sigmoid（0到1，饱和）、ReLU（max(0,z)，不饱和，计算快）、leaky ReLU（避免 dead ReLU）、ELU（平滑）、GeLU（随机正则化视角）。现代网络几乎全部使用 ReLU 及其变体。",
        },
        {
          title: "权重空间对称性",
          description: "交换隐藏层两个神经元并同步交换与上下层的连接权重，网络函数完全不变。这意味着损失函数有多个等效的最优解，也解释了不同随机初始化可能收敛到不同但等效的权重配置。",
        },
      ]}
      learningObjectives={[
        "写出单层前向传播的矩阵公式并解释各符号含义",
        "理解通用近似定理的内容和局限性",
        "比较 ReLU、tanh 和 sigmoid 的优缺点",
        "解释权重空间对称性及其对初始化的含义",
      ]}
      coreIntuition={
        "多层网络像乐高积木——每一层是基础积木块（线性变换+非线性）。通用近似定理说'只要积木够多，什么形状都能搭'，但实践发现：用深度（多层）比用宽度（巨宽一层）更高效，因为深度可以复用中间结构。"
      }
      commonMistakes={[
        "过度解读通用近似定理——它保证存在解，但没说我们能从有限数据中学到这个解",
        "在深层网络中使用 sigmoid 作为隐藏激活——梯度在饱和区接近零，导致梯度消失",
        "忽视权重对称性对初始化的重要性——如果所有权重初始化为相同值，网络无法打破对称",
      ]}
      whyCards={[
        {
          question: "为什么 ReLU 比 sigmoid 更适合深层网络？",
          answer: "sigmoid 在输入很大或很小时梯度接近零，深层网络中梯度会指数级消失。ReLU 在正区间梯度恒为 1，有效缓解了这个问题。",
        },
        {
          question: "为什么通用近似定理不能直接指导实践？",
          answer: "它只说存在足够宽的网络可以逼近任意函数，但没说需要多宽，也没说如何从数据中学到。实践中深度往往比宽度更高效。",
        },
      ]}
      counterexamples={[
        "用 sigmoid 激活训练 10 层网络，第一层权重几乎不更新——说明梯度消失不是理论问题而是实际障碍。",
        "把所有权重初始化为相同值，所有隐藏单元输出完全相同——说明打破对称性对训练至关重要。",
      ]}
            bishopMapping={{
        chapter: "Ch 6",
        section: "6.2",
        pages: "§6.2, pp. 180–185",
        textbookSubsections: [
          "6.2 Multilayer Networks",
          "6.2.1 Parameter matrices",
          "6.2.2 Universal approximation",
          "6.2.3 Hidden unit activation functions",
          "6.2.4 Weight-space symmetries",
        ],
      }}
      demo={{
        title: "不同激活函数的输出",
        label: "输入值 z",
        param: 0,
        min: -3,
        max: 3,
        step: 0.1,
        compute: (z) => {
          const relu = Math.max(0, z);
          const sigmoid = 1 / (1 + Math.exp(-z));
          const tanh = Math.tanh(z);
          return {
            label: `ReLU=${relu.toFixed(2)}, Sigmoid=${sigmoid.toFixed(2)}, Tanh=${tanh.toFixed(2)}`,
            value: relu,
            display: String.raw`\text{ReLU}=${relu.toFixed(2)}, \sigma=${sigmoid.toFixed(2)}, \tanh=${tanh.toFixed(2)}`,
          };
        },
        formula: String.raw`\text{ReLU}(z)=\max(0,z), \quad \sigma(z)=\frac{1}{1+e^{-z}}, \quad \tanh(z)=\frac{e^z-e^{-z}}{e^z+e^{-z}}`,
      }}
    />
  );
}
