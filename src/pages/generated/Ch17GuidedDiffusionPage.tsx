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
          formula: String.raw`\hat{s}(x_t) = s(x_t) + \gamma \nabla_{x_t} \ln p(c \mid x_t, t)`,
        },
        {
          title: "无分类器引导",
          description: "训练时随机丢弃条件，采样时用条件预测与无条件预测之差控制方向。",
          formula: String.raw`\hat{\epsilon} = \epsilon_{\text{unc}} + w \, (\epsilon_{\text{cond}} - \epsilon_{\text{unc}})`,
        },
        {
          title: "引导强度 w",
          description: "当 0≤w≤1 时，ε_hat 是条件预测与无条件预测之间的插值；w=1 退化为普通条件预测；w>1 则是向条件方向外推，超出原始条件预测。",
        },
        {
          title: "文本与属性条件",
          description: "条件 c 可以是类别、文本嵌入或其他属性向量，使扩散模型具备可控生成能力。",
        },
      ]}
      learningObjectives={[
        "理解分类器引导与无分类器引导的区别。",
        "能解释无分类器引导公式中 w 的作用：插值、普通条件预测与外推。",
        "了解引导强度与多样性之间的权衡。",
      ]}
      coreIntuition={"无分类器引导像一个‘方向盘’：先看模型无条件时会往哪走，再把方向往条件目标多掰一点。w=1 只是正常按条件开；w>1 是把方向盘继续往外打，属于外推。掰得越狠，越听话，但画面也越雷同，甚至出现过饱和或伪影。"}
      commonMistakes={[
        "认为 w 越大总是越好；过高 w 通常降低多样性，并可能造成过饱和、失真或伪影。",
        "混淆分类器引导与无分类器引导：前者需要额外训练分类器，后者在训练时随机丢弃条件即可。",
        "忽视 w=1 只是普通条件采样；0≤w≤1 才是插值，w>1 是外推。",
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
        formulas: ["分类器引导", "无分类器引导公式", "w 的插值/外推解释"],
        algorithms: ["Classifier guidance", "Classifier-free guidance"],
        exercises: ["比较两种引导方式对多样性的影响。", "推导无分类器引导公式在 w=1 时的退化形式。", "说明 w>1 为何是外推而非插值。"]
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
