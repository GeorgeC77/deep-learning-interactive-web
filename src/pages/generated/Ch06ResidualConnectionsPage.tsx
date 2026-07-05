import BishopSectionPage from '@/components/BishopSectionPage';
import { Layers } from 'lucide-react';

export default function Ch06ResidualConnectionsPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch06/residual-connections"
      heroIcon={<Layers className="w-9 h-9 text-blue-600" />}
      summary={"残差连接通过跳跃映射让网络学习残差函数 F(x)=H(x)-x，缓解深层网络的梯度消失与退化问题。"}
      concepts={[
    {
      title: "残差块",
      description: "输出为输入与变换后的特征相加，保留恒等映射的梯度传播路径。",
      formula: String.raw`y = \mathcal{F}(x, \{W_i\}) + x`,
    },
    {
      title: "缓解梯度消失",
      description: "反向传播时梯度可直接沿跳跃连接回传，避免被多个非线性层连续收缩。",
    },
    {
      title: "深层网络训练",
      description: "ResNet 等架构借助残差连接成功训练数百甚至上千层网络。",
    }
      ]}
      learningObjectives={[
      "理解 残差块 的含义与作用。",
      "理解 缓解梯度消失 的含义与作用。",
      "理解 深层网络训练 的含义与作用。"
    ]}
      coreIntuition={"残差连接通过跳跃映射让网络学习残差函数 F(x)=H(x)-x，缓解深层网络的梯度消失与退化问题。"}
      commonMistakes={[
      "混淆相关概念的定义与适用场景。",
      "只记忆公式而忽略其背后的概率或优化假设。"
    ]}
      quiz={[
      {
        question: "关于“残差块”，下列说法是否正确？",
        options: ["输出为输入与变换后的特征相加，保留恒等映射的梯度传播路径。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。输出为输入与变换后的特征相加，保留恒等映射的梯度传播路径。",
      },
      {
        question: "关于“缓解梯度消失”，下列说法是否正确？",
        options: ["反向传播时梯度可直接沿跳跃连接回传，避免被多个非线性层连续收缩。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。反向传播时梯度可直接沿跳跃连接回传，避免被多个非线性层连续收缩。",
      },
      {
        question: "关于“深层网络训练”，下列说法是否正确？",
        options: ["ResNet 等架构借助残差连接成功训练数百甚至上千层网络。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。ResNet 等架构借助残差连接成功训练数百甚至上千层网络。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 9",
      section: "",
      pages: "",
    }}
          demo={{
      title: "残差块的恒等梯度",
      label: "层数 L",
      param: 10,
      min: 1,
      max: 50,
      step: 1,
      compute: (L) => ({
        label: '普通梯度衰减',
        value: 0.9 ** L,
        display: String.raw`0.9^{${L.toFixed(0)}}=${(0.9 ** L).toFixed(4)}`,
      }),
      formula: String.raw`\text{普通梯度} \propto \alpha^L`,
    }}
    />
  );
}
