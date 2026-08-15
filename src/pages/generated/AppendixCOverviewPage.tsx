import AppendixSectionCompletion from '@/components/AppendixSectionCompletion';
import BishopSectionPage from '@/components/BishopSectionPage';
import { Maximize } from 'lucide-react';

export default function AppendixCOverviewPage() {
  return (
    <BishopSectionPage
      sectionPath="/appendix/c/overview"
      heroIcon={<Maximize className="w-9 h-9 text-blue-600" />}
      summary="拉格朗日乘子法用约束曲面的法向几何，把带约束驻点转化为对变量与乘子的联立驻点问题。教材进一步讨论不等式约束、活跃约束与 KKT 条件。"
      concepts={[
        {
          title: '约束曲面的法向',
          description: '在 g(x)=0 曲面上，任意可行微小位移都与 ∇g 正交，因此 ∇g 给出约束曲面的法向方向。',
          formula: String.raw`\boldsymbol\epsilon^T\nabla g(\mathbf x)=0`,
        },
        {
          title: '等式约束的 Lagrangian',
          description: '约束驻点处 ∇f 与 ∇g 平行或反平行；对 x 与 λ 同时求驻点即可连同约束一起求解。',
          formula: String.raw`\mathcal L(\mathbf x,\lambda)=f(\mathbf x)+\lambda g(\mathbf x)`,
        },
        {
          title: '活跃与不活跃约束',
          description: '不等式约束在边界 g=0 时活跃；若解严格位于可行域内部，则约束不活跃，对应乘子为 0。',
        },
        {
          title: 'KKT 条件',
          description: '按教材最大化 f、g≥0 的约定，除驻点条件外还需原始可行性、乘子非负与互补松弛。',
          formula: String.raw`g(\mathbf x)\ge0,\qquad\lambda\ge0,\qquad\lambda g(\mathbf x)=0`,
        },
      ]}
      learningObjectives={[
        '能从约束曲面的切向与法向解释拉格朗日乘子的几何意义。',
        '会联立 ∇x𝓛=0 与 ∂𝓛/∂λ=0 求解等式约束驻点。',
        '能区分等式乘子的自由符号与不等式 KKT 乘子的符号约束。',
      ]}
      coreIntuition="受约束时不能沿任意方向移动，只能沿可行曲面的切向移动。驻点意味着目标梯度在所有可行切向上的投影为零，因此它只能落在约束法向的张成空间中。"
      commonMistakes={[
        '只令 ∇x𝓛=0，却忘记 ∂𝓛/∂λ=0 才会恢复原约束。',
        '认为等式约束的 λ 必须非负；等式法向可取两个方向，λ 没有固定符号。',
        '把互补松弛 λg=0 误读成 λ 与 g 都必须为零；实际只要求至少一个为零。',
        '更换最大化/最小化或 g≥0/g≤0 的约定后仍机械沿用同一 Lagrangian 符号。',
      ]}
      whyCards={[
        {
          question: '为什么驻点处 ∇f 必须与 ∇g 平行？',
          answer: '若 ∇f 还有切向分量，就能沿约束曲面朝该分量移动并继续提高目标，与驻点假设矛盾。',
        },
        {
          question: '互补松弛表达了什么？',
          answer: '若约束严格满足，则它不影响局部最优性、乘子为零；若乘子非零，则约束必须恰好位于边界。',
        },
      ]}
      counterexamples={[
        '候选点 (0,0) 可能满足无约束目标的驻点条件，却不满足 x₁+x₂=1，因此不是约束问题的可行解。',
        '内部可行点若配上非零不等式乘子会违反互补松弛，说明不活跃约束不能继续施加法向力。',
      ]}
      bishopMapping={{
        chapter: 'Appendix C',
        pages: 'pp. 621–624',
        textbookSubsections: ['Appendix C Lagrange Multipliers'],
        formulas: ['constraint tangent orthogonality', 'equality-constrained Lagrangian', 'KKT feasibility and complementary slackness'],
        algorithms: ['等式约束联立求解', '活跃约束与 KKT 判断'],
        exercises: ['求解教材二元等式约束示例。', '解释等式乘子的符号。', '判断不等式约束是否活跃。'],
      }}
      extraContent={<AppendixSectionCompletion appendix="c" />}
    />
  );
}
