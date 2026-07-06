import BishopSectionPage from '@/components/BishopSectionPage';
import { RotateCw } from 'lucide-react';

export default function PrerequisiteCh03PeriodicPage() {
  return (
    <BishopSectionPage
      sectionPath="/prerequisite/ch03/periodic"
      heroIcon={<RotateCw className="w-9 h-9 text-blue-600" />}
      summary={"周期变量（如角度、方向）不能用普通高斯直接建模；Von Mises 分布是圆周上的自然类比。"}
      concepts={[
    {
      title: "Von Mises 分布",
      description: "在圆周上定义的位置-尺度分布，集中参数 m 控制分布尖锐程度。",
      formula: String.raw`p(\theta \mid \theta_0, m) = \frac{1}{2\pi I_0(m)} \exp\{ m \cos(\theta - \theta_0) \}`,
    },
    {
      title: "圆周矩",
      description: "用复指数或 (cos θ, sin θ) 计算均值，避免 0°/360° 不连续问题。",
    },
    {
      title: "与高斯分布的关系",
      description: "当 m 很大时，Von Mises 在峰值附近近似高斯；m=0 时退化为圆周均匀分布。",
    }
      ]}
      learningObjectives={[
      "理解 Von Mises 分布 的含义与作用。",
      "理解 圆周矩 的含义与作用。",
      "理解 与高斯分布的关系 的含义与作用。"
    ]}
      coreIntuition={"周期变量（如角度、方向）不能用普通高斯直接建模；Von Mises 分布是圆周上的自然类比。"}
      commonMistakes={[
      "把不同小节的概念混为一谈，忽视它们的假设与适用范围。",
      "只看公式形式而不验证推导条件或数值实例。"
    ]}
      quiz={[
      {
        question: "下列关于“Von Mises 分布”的叙述，哪一项最准确？",
        options: ["在圆周上定义的位置-尺度分布，集中参数 m 控制分布尖锐程度。", "Von Mises 分布 与本节讨论的问题完全无关。", "Von Mises 分布 在任何情况下都不需要额外假设即可使用。"],
        correctIndex: 0,
        explanation: "正确。在圆周上定义的位置-尺度分布，集中参数 m 控制分布尖锐程度。 这体现了本节的核心思想。",
      },
      {
        question: "在应用“圆周矩”时，下列哪种做法最危险？",
        options: ["忽视其前提假设，直接套用到不适用的数据分布上。", "只要样本量足够大，前提假设就不重要。", "该方法只适用于连续变量，离散变量完全无法使用。"],
        correctIndex: 0,
        explanation: "正确。圆周矩 的有效性依赖于特定假设，忽略前提会导致错误结论。",
      },
      {
        question: "在一个具体情境中，你发现“与高斯分布的关系”的结果与直觉相反，首先应该检查什么？",
        options: ["是否违反了该方法成立的前提条件或数据假设。", "直觉一定是错的，直接接受计算结果。", "一定是代码实现出错，与理论无关。"],
        correctIndex: 0,
        explanation: "正确。与高斯分布的关系 的可靠性取决于前提假设是否满足；违反假设时结果可能反直觉但合理。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 3",
      section: "3.3",
      pages: "Ch 3",
      textbookSubsections: ["3.3.1 Von Mises 分布", "3.3.2 圆周矩", "3.3.3 与高斯分布的关系"],
      formulas: ["Von Mises 分布公式"],
      exercises: ["复述本节核心公式并说明每个符号含义。", "用一个小例子验证本节概念或数值结论。", "找出本节结论与相邻小节结论的异同。"]
    }}
          demo={{
      title: "Von Mises 分布峰值",
      label: "集中参数 m",
      param: 2,
      min: 0,
      max: 8,
      step: 0.2,
      compute: (m) => {
        const value = m < 0.5 ? (1 / (2 * Math.PI)) * (1 + (m * m) / 4) : Math.sqrt(m / (2 * Math.PI));
        return {
          label: 'p(θ₀) 近似',
          value,
          display: String.raw`p(\theta_0)\approx ${value.toFixed(3)}`,
        };
      },
      formula: String.raw`p(\theta_0) \approx \sqrt{\frac{m}{2\pi}} \quad (m \gg 1)`,
    }}
    />
  );
}
