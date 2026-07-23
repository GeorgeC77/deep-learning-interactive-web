import BishopSectionPage from '@/components/BishopSectionPage';
import GANGradientLab from '@/components/demos/GANGradientLab';
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
      whyCards={[
        {
          question: "为什么 GAN 训练不稳定？",
          answer: "GAN 是两人博弈，不是单方优化。生成器和判别器目标相反，参数更新可能相互追逐而不收敛。",
        },
        {
          question: "为什么需要非饱和损失？",
          answer: "原始损失在判别器很强时，生成器的梯度接近零。非饱和损失让生成器在训练早期也能获得足够梯度。",
        },
      ]}
      counterexamples={[
        "判别器训练得太好，生成器梯度几乎为零——说明 GAN 需要平衡双方能力。",
        "认为非饱和损失和原始损失等价——实际上非饱和损失改变了生成器的梯度尺度。",
      ]}
            bishopMapping={{
        chapter: "Ch 17",
        section: "17.1",
        pages: "Ch 17",
        textbookSubsections: [
          "17.1.1 Loss function",
          "17.1.2 GAN training in practice"
        ],
        supplementalTopics: [
          "non-saturating generator loss",
          "label smoothing",
          "instance noise",
          "gradient penalty"
        ],
        formulas: ["minimax loss", "non-saturating loss"],
        algorithms: ["GAN training"],
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
      interactiveDemo={<GANGradientLab />}
    />
  );
}
