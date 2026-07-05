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
      "混淆相关概念的定义与适用场景。",
      "只记忆公式而忽略其背后的概率或优化假设。"
    ]}
      quiz={[
      {
        question: "关于“Von Mises 分布”，下列说法是否正确？",
        options: ["在圆周上定义的位置-尺度分布，集中参数 m 控制分布尖锐程度。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。在圆周上定义的位置-尺度分布，集中参数 m 控制分布尖锐程度。",
      },
      {
        question: "关于“圆周矩”，下列说法是否正确？",
        options: ["用复指数或 (cos θ, sin θ) 计算均值，避免 0°/360° 不连续问题。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。用复指数或 (cos θ, sin θ) 计算均值，避免 0°/360° 不连续问题。",
      },
      {
        question: "关于“与高斯分布的关系”，下列说法是否正确？",
        options: ["当 m 很大时，Von Mises 在峰值附近近似高斯；m=0 时退化为圆周均匀分布。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。当 m 很大时，Von Mises 在峰值附近近似高斯；m=0 时退化为圆周均匀分布。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 3",
      section: "periodic",
      pages: "",
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
