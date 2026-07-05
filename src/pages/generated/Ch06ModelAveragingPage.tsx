import BishopSectionPage from '@/components/BishopSectionPage';
import { Users } from 'lucide-react';

export default function Ch06ModelAveragingPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch06/model-averaging"
      heroIcon={<Users className="w-9 h-9 text-blue-600" />}
      summary={"模型平均通过组合多个模型的预测降低方差；Dropout 可视为对大量子网络做指数级隐式模型平均。"}
      concepts={[
    {
      title: "委员会机器",
      description: "独立训练多个模型并平均输出，通常能提升泛化性能。",
      formula: String.raw`y_{\text{avg}} = \frac{1}{M} \sum_{m=1}^{M} y_m(x)`,
    },
    {
      title: "Dropout 作为平均",
      description: "训练时随机失活神经元，等价于采样子网络；测试时缩放近似所有子网络平均。",
    },
    {
      title: "贝叶斯模型平均",
      description: "按模型后验概率加权组合，理论上最优但计算昂贵。",
    }
      ]}
      learningObjectives={[
      "理解 委员会机器 的含义与作用。",
      "理解 Dropout 作为平均 的含义与作用。",
      "理解 贝叶斯模型平均 的含义与作用。"
    ]}
      coreIntuition={"模型平均通过组合多个模型的预测降低方差；Dropout 可视为对大量子网络做指数级隐式模型平均。"}
      commonMistakes={[
      "混淆相关概念的定义与适用场景。",
      "只记忆公式而忽略其背后的概率或优化假设。"
    ]}
      quiz={[
      {
        question: "关于“委员会机器”，下列说法是否正确？",
        options: ["独立训练多个模型并平均输出，通常能提升泛化性能。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。独立训练多个模型并平均输出，通常能提升泛化性能。",
      },
      {
        question: "关于“Dropout 作为平均”，下列说法是否正确？",
        options: ["训练时随机失活神经元，等价于采样子网络；测试时缩放近似所有子网络平均。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。训练时随机失活神经元，等价于采样子网络；测试时缩放近似所有子网络平均。",
      },
      {
        question: "关于“贝叶斯模型平均”，下列说法是否正确？",
        options: ["按模型后验概率加权组合，理论上最优但计算昂贵。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。按模型后验概率加权组合，理论上最优但计算昂贵。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 9",
      section: "",
      pages: "",
    }}
          demo={{
      title: "集成数量对误差的影响",
      label: "模型数量 M",
      param: 5,
      min: 1,
      max: 20,
      step: 1,
      compute: (M) => ({
        label: '方差缩减比例',
        value: 1 / Math.sqrt(M),
        display: String.raw`\sigma_{\text{avg}}=\sigma/\sqrt{${M.toFixed(0)}}=${(1 / Math.sqrt(M)).toFixed(3)}`,
      }),
      formula: String.raw`\sigma_{\text{avg}} = \frac{\sigma}{\sqrt{M}}`,
    }}
    />
  );
}
