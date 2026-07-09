import BishopSectionPage from '@/components/BishopSectionPage';
import { Scale } from 'lucide-react';

export default function Ch01BiasVariancePage() {
  return (
    <BishopSectionPage
      sectionPath="/ch01/bias-variance"
      heroIcon={<Scale className="w-9 h-9 text-blue-600" />}
      summary={"模型的测试误差可分解为偏差、方差与不可约噪声。偏差反映模型对真实关系的近似能力，方差反映对训练数据波动的敏感度，二者通常存在权衡。"}
      concepts={[
        {
          title: "偏差",
          description: "模型期望预测与真实函数之间的差距，衡量模型本身的表达能力。",
          formula: String.raw`\operatorname{Bias}[\hat{f}(x)] = \mathbb{E}[\hat{f}(x)] - f(x)`,
        },
        {
          title: "方差",
          description: "由于训练集随机性导致模型预测波动的程度。",
          formula: String.raw`\operatorname{Var}[\hat{f}(x)] = \mathbb{E}\bigl[(\hat{f}(x) - \mathbb{E}[\hat{f}(x)])^2\bigr]`,
        },
        {
          title: "偏差–方差分解",
          description: "期望测试误差的平方损失可分解为偏差平方、方差与噪声之和。",
          formula: String.raw`\mathbb{E}\bigl[(y - \hat{f}(x))^2\bigr] = \operatorname{Bias}^2 + \operatorname{Var} + \sigma^2`,
        },
        {
          title: "模型复杂度权衡",
          description: "复杂模型方差高、偏差低；简单模型偏差高、方差低。正则化与交叉验证用于寻找折中。",
        },
      ]}
      learningObjectives={[
        "能写出偏差与方差的定义。",
        "理解平方损失下的偏差–方差分解。",
        "能根据模型复杂度判断偏差与方差的主导因素。",
      ]}
      coreIntuition={"偏差像瞄准靶心时的系统性偏移，方差像手抖导致的散布；增加模型复杂度可以纠正瞄准，但也可能让手抖得更厉害。"}
      commonMistakes={[
        "把训练误差低等同于低偏差；训练误差低可能伴随高方差（过拟合）。",
        "认为偏差和方差可以同时任意减小；通常降低一个会升高另一个。",
        "把不可约噪声 σ² 当成模型可以消除的部分。",
      ]}
      quiz={[
        {
          question: "一个模型在训练集上表现很好但测试集上波动很大，主要问题最可能是？",
          options: ["高方差", "高偏差", "不可约噪声过大", "学习率太低"],
          correctIndex: 0,
          explanation: "训练好但测试波动大说明模型对训练数据过于敏感，即高方差（过拟合）。",
        },
        {
          question: "对平方损失，期望测试误差的分解包含哪三项？",
          options: [
            "偏差平方、方差、不可约噪声",
            "训练误差、验证误差、测试误差",
            "精确率、召回率、F1",
            "梯度、Hessian、学习率",
          ],
          correctIndex: 0,
          explanation: "平方损失下，期望误差 = Bias² + Var + σ²。",
        },
        {
          question: "增加多项式回归的次数通常会如何影响偏差和方差？",
          options: [
            "偏差降低，方差升高",
            "偏差升高，方差降低",
            "两者同时降低",
            "两者同时升高",
          ],
          correctIndex: 0,
          explanation: "更高次多项式更灵活，能更好逼近真实函数（偏差低），但也更容易受训练数据波动影响（方差高）。",
        },
      ]}
      bishopMapping={{
        chapter: "Ch 4",
        section: "4.3",
        pages: "Ch 4",
        textbookSubsections: [
          "4.3 The Bias–Variance Trade-off"
        ],
        formulas: ["Bias-Variance decomposition"],
        exercises: ["用多项式回归实验观察不同次数下的偏差与方差变化。"],
      }}
    />
  );
}
