import BishopSectionPage from '@/components/BishopSectionPage';
import { Scale } from 'lucide-react';

export default function Ch14AdversarialTrainingPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch14/adversarial-training"
      heroIcon={<Scale className="w-9 h-9 text-blue-600" />}
      summary={"生成对抗网络通过生成器 G 与判别器 D 的对抗博弈学习数据分布。理论上最优判别器下，生成器最小化真实分布与生成分布之间的 Jensen-Shannon 散度。"}
      concepts={[
        {
          title: "极小极大损失",
          description: "判别器最大化对数似然，生成器最小化被判别为假的概率。",
          formula: String.raw`
\min_G \max_D V(D,G) = \mathbb{E}_{x\sim p_{\text{data}}}\ln D(x) + \mathbb{E}_{z\sim p_z}\ln(1-D(G(z)))`,
        },
        {
          title: "非饱和损失",
          description: "用 -ln D(G(z)) 替代 ln(1-D(G(z)))，缓解生成器早期梯度不足的问题。",
          formula: String.raw`L_G = -\mathbb{E}_{z\sim p_z}\ln D(G(z))`,
        },
        {
          title: "最优判别器",
          description: "固定 G 时，最优 D*(x)=p_data(x)/(p_data(x)+p_G(x))。",
        },
        {
          title: "GAN 训练实践",
          description: "实际训练采用生成器与判别器交替更新，并借助标签平滑、梯度惩罚等技巧稳定优化；需警惕模式崩溃。",
        },
      ]}
      learningObjectives={[
        "能写出 GAN 的极小极大目标并解释 G 与 D 的角色。",
        "理解非饱和损失解决的梯度问题。",
        "了解 GAN 训练实践中交替更新、训练技巧与模式崩溃风险。",
      ]}
      coreIntuition={"GAN 像一场假币制造者与鉴定专家的博弈：假币越做越真，鉴定越来越难；最终假币与真币难以区分，生成分布逼近真实分布。"}
      commonMistakes={[
        "认为 GAN 的纳什均衡很容易达到；实际训练常不稳定。",
        "混淆原始极小极大损失与非饱和损失：前者对生成器使用 ln(1-D(G(z)))，后者使用 -ln D(G(z))。",
        "忽视判别器过强会导致生成器梯度消失。",
      ]}
      quiz={[
        {
          question: "原始 minimax generator loss 与非饱和 generator loss 的关键区别是什么？",
          options: [
            "minimax 使用 ln(1-D(G(z)))，在 D 很容易拒绝假样本时梯度很小；非饱和损失使用 -ln D(G(z))，早期梯度更稳定。",
            "两者在数学上完全等价，只是写法不同。",
            "非饱和损失不再需要训练判别器。",
            "minimax 直接最大化 D(G(z))，而非饱和损失最小化 D(G(z))。",
          ],
          correctIndex: 0,
          explanation: "minimax 目标中生成器最小化 ln(1-D(G(z)))，当 D(G(z))≈0 时梯度消失；非饱和损失 -ln D(G(z)) 在同样区域仍有强梯度。",
        },
        {
          question: "若 D(G(z))=0.1，则非饱和生成器损失 -ln D(G(z)) 等于多少？",
          options: [
            "-ln 0.1 ≈ 2.30",
            "ln 0.1 ≈ -2.30",
            "0.9",
            "0.1",
          ],
          correctIndex: 0,
          explanation: "-ln(0.1)=ln(10)≈2.302；数值越小，说明生成样本被判别为假的概率越高，损失越大。",
        },
        {
          question: "训练后期生成器只输出少数几类样本，判别器对这些样本给出高置信度，这最可能是？",
          options: [
            "模式崩溃（mode collapse）",
            "GAN 已收敛到纳什均衡",
            "判别器梯度消失",
            "生成器过拟合到单个真实样本",
          ],
          correctIndex: 0,
          explanation: "生成器陷入数据分布的少数模式，无法覆盖全部多样性，是 GAN 训练中典型的模式崩溃现象。",
        },
      ]}
      bishopMapping={{
        chapter: "Ch 17",
        section: "17.1",
        pages: "Ch 17",
        textbookSubsections: ["17.1.1 Loss function", "17.1.2 GAN training in practice"],
        supplementalTopics: ["label smoothing", "gradient penalty", "training heuristics"],
        formulas: ["极小极大损失", "非饱和损失", "D*(x)"],
        algorithms: ["GAN 训练", "交替梯度更新"],
        exercises: ["推导固定 G 时最优判别器 D*(x)。", "比较原始损失与非饱和损失的梯度行为。"],
      }}
      demo={{
        title: "判别器对生成样本的输出",
        label: "判别器输出 D(G(z))",
        param: 0.3,
        min: 0.01,
        max: 0.99,
        step: 0.01,
        compute: (d) => ({
          label: '生成器损失',
          value: -Math.log(d),
          display: String.raw`L_G=-\\ln ${d.toFixed(2)}=${(-Math.log(d)).toFixed(3)}`,
        }),
        formula: String.raw`L_G = -\ln D(G(z))`,
      }}
    />
  );
}
