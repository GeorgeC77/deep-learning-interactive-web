import BishopSectionPage from '@/components/BishopSectionPage';
import ParameterSharingLab from '@/components/demos/ParameterSharingLab';
import { Share2 } from 'lucide-react';

export default function Ch06ParameterSharingPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch06/parameter-sharing"
      heroIcon={<Share2 className="w-9 h-9 text-blue-600" />}
      summary={
        "参数共享让同一组权重在多个位置复用，显著减少参数量并强制定义不变性或局部性先验。卷积是最常见的共享形式，它与全连接、局部连接在连接数、参数量与自由度上有本质区别。"
      }
      concepts={[
        {
          title: "软权重共享",
          description: "通过正则化鼓励参数彼此接近，而非强制相等，保留一定柔性。",
        },
        {
          title: "卷积中的共享",
          description: "卷积核在整张特征图上滑动，天然实现平移等变性与局部连接。共享后许多连接引用同一个 parameter。",
          formula: String.raw`\text{Conv params} = K_h K_w C_{in} C_{out} + C_{out}`,
        },
        {
          title: "局部连接（Locally connected）",
          description: "每个输出位置拥有独立的核权重，保持局部连接但不共享。参数量是卷积的 H_out·W_out 倍。",
          formula: String.raw`\text{Locally connected params} = H_{out} W_{out} K_h K_w C_{in} C_{out} + H_{out} W_{out} C_{out}`,
        },
        {
          title: "全连接（Dense）",
          description: "每个输入单元与每个输出单元都有独立权重。当把空间维度也视为输入/输出大小时，参数量远高于卷积。",
          formula: String.raw`\text{Dense params} = H_{in} W_{in} C_{in} \cdot H_{out} W_{out} C_{out} + H_{out} W_{out} C_{out}`,
        },
        {
          title: "连接数、参数量与自由度",
          description: "连接数是前向计算中的连接总数；参数量是实际存储的独立标量个数；自由度通常等于参数量（无正则/共享约束时）。卷积通过共享大幅降低参数量，但连接数与局部连接相同。",
          formula: String.raw`\text{Connections} = H_{out} W_{out} C_{out} \cdot K_h K_w C_{in}`,
        },
        {
          title: "平移等变性",
          description: "同一卷积核作用于平移后的输入，输出也相应平移。局部连接由于位置相关权重，不保证此性质。",
        },
      ]}
      learningObjectives={[
        "能分别写出卷积、局部连接、全连接的参数量公式",
        "区分连接数、参数量与自由度",
        "理解参数共享如何把连接数与参数量解耦",
        "解释卷积为何具有平移等变性而局部连接不一定",
      ]}
      coreIntuition={
        "卷积像用同一枚印章在整张纸上盖图案：印章只保存一次（参数少），但盖了很多次（连接多），而且把纸平移后图案也平移。局部连接则每处都用不同的印章，虽然连接一样多，但要保存的印章数量大增。"
      }
      commonMistakes={[
        "把 H² 当作全连接与卷积的参数比——它实际上是局部连接与卷积的参数比",
        "混淆连接数与参数量：卷积连接数与局部连接相同，但参数量少得多",
        "认为卷积和局部连接表达能力相同——卷积的共享约束强加了平移等变性",
        "忽视偏置项 C_out 在参数量公式中的贡献",
      ]}
      whyCards={[
        {
          question: "为什么卷积能大幅减少参数量？",
          answer: "同一卷积核在整张特征图上滑动，所有位置共享同一组权重，参数量与特征图大小无关。",
        },
        {
          question: "为什么卷积具有平移等变性而局部连接没有？",
          answer: "卷积核权重共享，同一模式无论出现在哪里都会被检测到；局部连接每个位置有独立权重，无法保证平移等变性。",
        },
      ]}
      counterexamples={[
        "把卷积的连接数与参数量混淆，认为卷积计算量小——实际上卷积连接数与局部连接相同，只是参数量少。",
        "用局部连接替代卷积处理大图像，参数量爆炸且失去平移等变性——说明参数共享是卷积的核心优势。",
      ]}
            bishopMapping={{
        chapter: "Ch 9",
        section: "9.4",
        pages: "Ch 9",
        textbookSubsections: ["9.4 Parameter Sharing", "9.4.1 Soft weight sharing"],
        formulas: [
          "Conv params = Kh Kw Cin Cout + Cout",
          "Locally connected params = Hout Wout Kh Kw Cin Cout + Hout Wout Cout",
          "Dense params = Hin Win Cin Hout Wout Cout + Hout Wout Cout",
        ],
        exercises: [
          "分别推导卷积、局部连接、全连接的参数量",
          "解释为何卷积的连接数与局部连接相同但参数量更少",
          "用数值例子验证平移等变性",
        ],
      }}
      interactiveDemo={<ParameterSharingLab />}
    />
  );
}
