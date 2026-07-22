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
          description: "在圆周变量上定义的方向分布，θ₀ 控制平均方向，m 控制集中程度。",
          formula: String.raw`p(\theta \mid \theta_0, m) = \frac{1}{2\pi I_0(m)} \exp\{ m \cos(\theta - \theta_0) \}`,
        },
        {
          title: "补充：圆周矩",
          description: "用复指数或 (cos θ, sin θ) 计算均值，避免 0°/360° 不连续问题。这不是 Bishop 的编号小节。",
        },
        {
          title: "补充：与高斯分布的关系",
          description: "当 m 很大时，Von Mises 在峰值附近近似高斯；m=0 时退化为圆周均匀分布。这不是 Bishop 的编号小节。",
        },
      ]}
      learningObjectives={[
        "理解 Von Mises 分布的参数意义。",
        "知道周期变量为什么不能直接用普通高斯建模。",
        "了解 m→∞ 和 m=0 时的极限行为。",
      ]}
      coreIntuition={"在圆上没有起点和终点；Von Mises 用 cos(θ-θ₀) 把“最近方向”自然编码，m 越大分布越尖。"}
      commonMistakes={[
        "对角度数据直接使用普通高斯，忽略 0° 与 360° 等价。",
        "把 Von Mises 误称为普通高斯的位置-尺度分布；它是方向分布。",
        "在 m=0 时仍假设存在明显平均方向。",
      ]}
            bishopMapping={{
        chapter: "Ch 3",
        section: "3.3",
        pages: "Ch 3",
        textbookSubsections: [
          "3.3 Periodic Variables",
          "3.3.1 Von Mises distribution"
        ],
        formulas: ["Von Mises 分布公式"],
        algorithms: ["圆周均值计算"],
        exercises: ["推导 Von Mises 在 m 很大时的高斯近似。", "用复指数计算一组角度的圆周均值。"],
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
