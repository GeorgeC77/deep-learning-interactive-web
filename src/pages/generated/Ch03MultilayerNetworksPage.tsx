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
      quiz={[
        {
          question: "ReLU(x) = max(0,x) 相比 sigmoid 的主要优势是什么？",
          options: [
            "正半轴梯度恒为 1，不饱和，缓解梯度消失",
            "输出范围更大",
            "计算更复杂",
            "始终输出正值",
          ],
          correctIndex: 0,
          explanation: "ReLU 在正半轴梯度为 1，避免了 sigmoid 和 tanh 在极端输入时的梯度消失问题。",
        },
        {
          question: "为什么交换两个隐藏神经元后网络输出不变？",
          options: [
            "隐藏层内无顺序——交换神经元 i 和 j 并同步交换与上下层的连接权重，前向计算完全不变",
            "因为激活函数是对称的",
            "因为损失函数是凸的",
            "这只是一个巧合",
          ],
          correctIndex: 0,
          explanation: "权重空间对称性揭示了损失面上有大量结构等价的点——初始化的随机性决定最终收敛到哪一个等价解。",
        },
        {
          question: "通用近似定理保证了什么？",
          options: [
            "存在一个足够宽的单隐藏网络可以近似任何连续函数",
            "任何网络都能在 100 轮内收敛",
            "深度网络一定比浅层网络好",
            "不需要正则化",
          ],
          correctIndex: 0,
          explanation: "定理只保证存在性——没说怎么找到、需要多少数据。但它奠定了神经网络的数学基础。",
        },
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
    />
  );
}
