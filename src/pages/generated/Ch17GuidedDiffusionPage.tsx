import BishopSectionPage from '@/components/BishopSectionPage';
import { Crosshair } from 'lucide-react';

export default function Ch17GuidedDiffusionPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch17/guided-diffusion"
      heroIcon={<Crosshair className="w-9 h-9 text-blue-600" />}
      summary={"引导扩散在反向采样时引入条件信号，使生成结果朝向指定类别、文本或属性移动。常见方法包括分类器引导与无分类器引导。"}
      concepts={[
        {
          title: "分类器引导",
          description: "利用预训练分类器对带噪样本的类别梯度调整分数，增强条件对齐；可能牺牲样本多样性。",
          formula: String.raw`\hat{s}(x_t) = s(x_t) + \gamma \nabla_{x_t} \ln p(c \mid x_t)`,
        },
        {
          title: "无分类器引导",
          description: "训练时随机丢弃条件，采样时用条件预测与无条件预测之差控制方向。",
          formula: String.raw`\hat{\epsilon} = \epsilon_{\text{unc}} + w \, (\epsilon_{\text{cond}} - \epsilon_{\text{unc}})`,
        },
        {
          title: "引导强度 w",
          description: "权重 w 越大，生成样本与条件越一致，但多样性越低；w=1 对应普通条件采样。",
        },
        {
          title: "文本与属性条件",
          description: "条件 c 可以是类别、文本嵌入或其他属性向量，使扩散模型具备可控生成能力。",
        },
      ]}
      learningObjectives={[
        "理解分类器引导与无分类器引导的区别。",
        "能解释无分类器引导公式中 w 的作用。",
        "了解引导强度与多样性之间的权衡。",
      ]}
      coreIntuition={"无分类器引导像一个‘方向盘’：先看模型无条件时会往哪走，再把方向往条件目标多掰一点；掰得越狠，越听话，但画面也越雷同。"}
      commonMistakes={[
        "认为 w 越大总是越好；过高 w 会导致过饱和或模式坍塌。",
        "混淆分类器引导与无分类器引导：前者需要额外训练分类器，后者在训练时随机丢弃条件即可。",
        "忽视 w=1 只是普通条件采样，额外引导来自 w>1 的插值。",
      ]}
      quiz={[
        {
          question: "无分类器引导中，若 ε_unc=0.2、ε_cond=0.5、w=2，则 ε_hat 是多少？",
          options: [
            "0.8",
            "0.5",
            "0.2",
            "1.0",
          ],
          correctIndex: 0,
          explanation: "ε_hat = ε_unc + w(ε_cond - ε_unc) = 0.2 + 2×(0.5-0.2) = 0.8。",
        },
        {
          question: "增大引导权重 w 时，conditional alignment 和 sample diversity 如何变化？",
          options: [
            "conditional alignment 增强，diversity 下降",
            "conditional alignment 下降，diversity 增强",
            "两者都增强",
            "两者都下降",
          ],
          correctIndex: 0,
          explanation: "w 越大，采样方向越偏向条件预测，条件对齐越好，但分布多样性越低，过高会导致模式坍塌。",
        },
        {
          question: "分类器引导与无分类器引导的主要区别是？",
          options: [
            "分类器引导需要额外训练分类器，无分类器引导在训练时随机丢弃条件",
            "分类器引导只能用于文本条件",
            "无分类器引导必须训练两个独立模型",
            "两者在数学上完全等价",
          ],
          correctIndex: 0,
          explanation: "分类器引导依赖外部分类器的梯度；无分类器引导通过单一模型同时学习条件与无条件预测。",
        },
      ]}
      bishopMapping={{
        chapter: "Ch 20",
        section: "20.4",
        pages: "Ch 20",
        textbookSubsections: [
          "20.4.1 Classifier guidance",
          "20.4.2 Classifier-free guidance"
        ],
        supplementalTopics: [
          "guidance strength trade-off"
        ],
        formulas: ["分类器引导", "无分类器引导公式"],
        algorithms: ["Classifier guidance", "Classifier-free guidance"],
        exercises: ["比较两种引导方式对多样性的影响。", "推导无分类器引导公式在 w=1 时的退化形式。"],
      }}
      demo={{
        title: "无分类器引导强度",
        label: "引导权重 w",
        param: 1,
        min: 0,
        max: 5,
        step: 0.1,
        compute: (w) => ({
          label: '条件偏移倍数',
          value: w,
          display: String.raw`\\hat{\\epsilon}=\\epsilon_{\\text{unc}}+${w.toFixed(1)}(\\epsilon_{\\text{cond}}-\\epsilon_{\\text{unc}})`,
        }),
        formula: String.raw`\hat{\epsilon} = \epsilon_{\text{unc}} + w \, (\epsilon_{\text{cond}} - \epsilon_{\text{unc}})`,
      }}
    />
  );
}
