import AppendixSectionCompletion from '@/components/AppendixSectionCompletion';
import BishopSectionPage from '@/components/BishopSectionPage';
import { Grid3X3 } from 'lucide-react';

export default function AppendixAOverviewPage() {
  return (
    <BishopSectionPage
      sectionPath="/appendix/a/overview"
      heroIcon={<Grid3X3 className="w-9 h-9 text-blue-600" />}
      summary="线性代数附录汇总深度学习中反复出现的矩阵恒等式、迹与行列式、矩阵导数和对称矩阵特征分解。重点不是背公式，而是掌握乘法次序、维度与可逆性等使用前提。"
      concepts={[
        {
          title: 'A.1 矩阵恒等式',
          description: '转置和求逆会反转乘法顺序；Woodbury 恒等式可把大型逆矩阵问题转化为较小矩阵的求逆。',
          formula: String.raw`(AB)^{-1}=B^{-1}A^{-1}`,
        },
        {
          title: 'A.2 迹与行列式',
          description: '迹在循环置换下不变，行列式满足乘法性，并衡量线性映射的有向体积缩放。',
          formula: String.raw`\operatorname{Tr}(ABC)=\operatorname{Tr}(BCA),\qquad |AB|=|A||B|`,
        },
        {
          title: 'A.3 矩阵导数',
          description: '按教材的矩阵梯度约定，可由乘积法则推导逆矩阵与 log-determinant 的导数。',
          formula: String.raw`\frac{\partial}{\partial A}\ln|A|=(A^{-1})^T`,
        },
        {
          title: 'A.4 特征向量',
          description: '实对称矩阵具有实特征值和正交特征向量，可在特征基中直接计算逆、迹、行列式与正定性。',
          formula: String.raw`A=U\Lambda U^T`,
        },
      ]}
      learningObjectives={[
        '能在转置、求逆和迹运算中保持正确的矩阵乘法次序。',
        '会用迹、行列式和 log-determinant 导数化简深度学习公式。',
        '能从对称矩阵的特征值判断秩、正定性与条件数。',
      ]}
      coreIntuition="矩阵公式的关键是结构：乘法次序决定映射组合，迹与行列式把矩阵结构压缩成标量，特征分解则选择一个让对称线性变换变成逐轴缩放的坐标系。"
      commonMistakes={[
        '把 (AB)⁻¹ 写成 A⁻¹B⁻¹；求逆必须反转乘法次序。',
        '把迹的循环性质误解为任意排列不变；Tr(ABC)=Tr(BCA)，但一般不等于 Tr(BAC)。',
        '在非对称矩阵上省略 ∂ln|A|/∂A=(A⁻¹)ᵀ 中的转置。',
        '认为元素全部为正就能推出矩阵正定；正定性取决于二次型或对称矩阵的全部特征值。',
      ]}
      whyCards={[
        {
          question: '为什么 Woodbury 恒等式在机器学习中重要？',
          answer: '当一个大型易求逆矩阵只受到低秩修正时，它把大矩阵求逆转化为小矩阵求逆，可显著降低时间与存储成本。',
        },
        {
          question: '为什么实对称矩阵特别容易处理？',
          answer: '它的特征值为实数，且可选正交特征向量；在该基下矩阵是对角的，逆、迹、行列式和正定性都变成逐特征值运算。',
        },
      ]}
      counterexamples={[
        '对非交换矩阵任意交换迹中的因子会改变结果，说明“循环”不能扩展成“任意排列”。',
        '教材矩阵 [[1,2],[3,4]] 的元素都为正却有一个负特征值，说明逐元素为正不等于正定。',
      ]}
      bishopMapping={{
        chapter: 'Appendix A',
        pages: 'pp. 609–615',
        textbookSubsections: [
          'A.1 Matrix Identities',
          'A.2 Traces and Determinants',
          'A.3 Matrix Derivatives',
          'A.4 Eigenvectors',
        ],
        formulas: ['Woodbury identity', 'trace cyclic property', 'matrix inverse derivative', 'log-determinant derivative', 'symmetric eigendecomposition'],
        algorithms: ['用低秩结构化简矩阵逆', '用特征值计算迹与行列式'],
        exercises: ['验证乘积逆矩阵的顺序。', '区分迹的循环置换与任意排列。', '由特征值判断正定性。'],
      }}
      extraContent={<AppendixSectionCompletion appendix="a" />}
    />
  );
}
