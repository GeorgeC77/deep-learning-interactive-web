import BishopSectionPage from '@/components/BishopSectionPage';
import ParameterSharingLab from '@/components/demos/ParameterSharingLab';
import DerivationStepper from '@/components/DerivationStepper';
import ExercisePanel from '@/components/ExercisePanel';
import { chapter06ParameterSharingExercises } from '@/course/chapter06Exercises';
import { Share2 } from 'lucide-react';

export default function Ch06ParameterSharingPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch06/parameter-sharing"
      heroIcon={<Share2 className="w-9 h-9 text-blue-600" />}
      summary={
        "Bishop §9.4 将参数共享定义为让多个网络连接引用同一个可学习参数，从而使自由度小于连接数，并编码预先已知的结构偏置。软权重共享则不强制相等，而用可学习混合先验鼓励权重围绕多个中心聚类。"
      }
      concepts={[
        {
          title: "软权重共享",
          description: "用高斯混合先验及其负对数正则项鼓励大量权重聚集到若干学习到的中心，而不是强制严格相等；混合系数、均值和方差也参与学习。",
          formula: String.raw`\Omega(\mathbf w)=-\sum_i\ln\sum_j\pi_j\mathcal N(w_i\mid\mu_j,\sigma_j^2)`,
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
        pages: "§9.4, pp. 270–274",
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
      extraContent={<div className="space-y-10"><DerivationStepper title="分步推导：共享参数为何累加多处梯度" steps={[
        { label: '多处引用', formula: String.raw`E=E(w^{(1)},\ldots,w^{(R)}),\qquad w^{(r)}\equiv\theta`, explanation: '计算图中 R 条连接都引用同一个底层参数 θ。' },
        { label: '全导数', formula: String.raw`\frac{dE}{d\theta}=\sum_{r=1}^{R}\frac{\partial E}{\partial w^{(r)}}\frac{\partial w^{(r)}}{\partial\theta}`, explanation: 'θ 通过所有使用位置影响损失，所以各路径贡献相加。' },
        { label: '恒等引用', formula: String.raw`\frac{\partial w^{(r)}}{\partial\theta}=1\quad\Rightarrow\quad\frac{dE}{d\theta}=\sum_r\frac{\partial E}{\partial w^{(r)}}`, explanation: '自动微分会自动完成这项累加，无需为每条连接存独立权重。' },
        { label: '结构结果', formula: String.raw`\#\text{degrees of freedom}<\#\text{connections}`, explanation: '卷积保留大量局部连接计算，却用较少独立参数编码平移等变偏置。' },
      ]}/><ExercisePanel exerciseSetId="chapter06-parameter-sharing" exercises={chapter06ParameterSharingExercises}/></div>}
    />
  );
}
