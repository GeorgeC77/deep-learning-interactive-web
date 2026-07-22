import BishopSectionPage from '@/components/BishopSectionPage';
import { Scale } from 'lucide-react';
import PolynomialRegressionDemo from '@/components/demos/PolynomialRegressionDemo';

export default function Ch01BiasVariancePage() {
  return (
    <BishopSectionPage
      sectionPath="/ch01/bias-variance"
      heroIcon={<Scale className="w-9 h-9 text-blue-600" />}
      summary={
        "偏差-方差分解是理解模型泛化性能的核心理论工具。期望测试误差可精确分解为三项：偏差平方（模型族逼近真实函数的能力）、方差（对训练集波动的敏感度）与不可约噪声（数据本身的随机性）。"
      }
      concepts={[
        {
          title: "偏差（Bias）",
          description: "对所有可能的训练集取平均后，模型期望预测与真实回归函数 f(x) 的差距。高偏差意味着模型族结构上就无法逼近真实函数——即欠拟合。",
          formula: String.raw`\operatorname{Bias}[\hat{f}(x)] = \mathbb{E}_{\mathcal{D}}[\hat{f}(x)] - f(x)`,
        },
        {
          title: "方差（Variance）",
          description: "由于训练集的随机性，模型预测在期望预测周围的波动程度。高方差意味着模型对训练数据的细节极度敏感——即过拟合。",
          formula: String.raw`\operatorname{Var}[\hat{f}(x)] = \mathbb{E}_{\mathcal{D}}\bigl[(\hat{f}(x) - \mathbb{E}_{\mathcal{D}}[\hat{f}(x)])^2\bigr]`,
        },
        {
          title: "不可约噪声（Irreducible noise）",
          description: "即使知道了真实的 f(x)，观测值 y = f(x) + ε 中仍包含随机噪声 ε ~ N(0, σ²)。σ² 是任何模型都无法消除的理论下界。",
          formula: String.raw`\text{noise} = \sigma^2 = \mathbb{E}[(y - f(x))^2]`,
        },
        {
          title: "平方损失下的偏差-方差分解",
          description: "这是 Bishop §4.3 的核心结果：期望测试误差 = (偏差)² + 方差 + σ²。训练误差低 ≠ 泛化好——如果方差很高（过拟合），测试误差仍可能很大。",
          formula: String.raw`\mathbb{E}_{\mathcal{D}}\bigl[(y - \hat{f}(x;\mathcal{D}))^2\bigr] = \operatorname{Bias}^2 + \operatorname{Var} + \sigma^2`,
        },
        {
          title: "模型复杂度权衡",
          description: "简单模型（低 M/少参数）：偏差高，方差低（欠拟合）；复杂模型（高 M/多参数）：偏差低，方差高（过拟合）。最优复杂度在于最小化总误差（偏差² + 方差）之处。正则化是手动调整这一权衡的机制。",
        },
      ]}
      learningObjectives={[
        "能写出偏差和方差的数学定义，理解两者各自的含义",
        "推导平方损失下的偏差-方差-噪声三项分解",
        "能根据模型复杂度判断偏差和方差的主导因素（欠拟合 vs 过拟合）",
        "理解正则化如何影响偏差-方差的权衡",
        "知道不可约噪声 σ² 是任何模型的泛化误差下界",
      ]}
      coreIntuition={
        "偏差像射箭时的系统性瞄准偏移（全都偏左），方差像手抖导致的散布（分散在靶心四周）。增加模型复杂度可以纠正瞄准（降低偏差），但也可能让手抖更厉害（增加方差）。正则化就是在瞄准和稳定之间找到一个折中。"
      }
      commonMistakes={[
        "把训练误差低等同于低偏差；训练误差低完全可能伴随高方差（过拟合）",
        "认为偏差和方差可以同时任意减小——通常降低一个会升高另一个（U 形曲线）",
        "把不可约噪声 σ² 当成模型可消除的部分，结果过度追求零训练误差",
        "在偏差-方差分解中忽略噪声项的独立性——噪声不依赖模型和训练集",
        "用单一训练集的一次拟合来估计偏差和方差，需要多次重采样或 bootstrap",
      ]}
      whyCards={[
        {
          question: "为什么训练误差低不代表模型好？",
          answer: "模型可能只是背下了训练数据的噪声。真正重要的是在没见过的新数据上表现，而这取决于偏差与方差的平衡。",
        },
        {
          question: "为什么不能把模型做得越复杂越好？",
          answer: "越复杂越容易把噪声当成规律学进去（过拟合）。存在一个刚好的复杂度，让总误差最小。",
        },
      ]}
      counterexamples={[
        "用 20 次多项式拟合 10 个点，能穿过每个点（训练误差为 0），但曲线在点之间剧烈震荡，测试误差反而很大。",
        "一个永远输出平均值的模型方差为零、很稳定，但偏差极高——对所有输入都给同样的答案，显然不是好模型。",
      ]}
            bishopMapping={{
        chapter: "Ch 4",
        section: "4.3",
        pages: "§4.3, pp. 123–128",
        textbookSubsections: ["4.3 The Bias–Variance Trade-off"],
        formulas: ["Bias² + Var + σ² decomposition", "expected squared loss"],
        algorithms: ["bias-variance analysis"],
        exercises: [
          "推导平方损失下的偏差-方差-噪声完整分解",
          "用不同次数的多项式拟合合成数据，观察偏差和方差的 U 形曲线",
          "解释为什么测试误差在某个中间复杂度达到最小值",
        ],
      }}
      extraContent={<PolynomialRegressionDemo />}
    />
  );
}
