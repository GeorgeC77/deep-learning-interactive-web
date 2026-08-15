import type { LearningExercise } from '@/components/ExercisePanel';

export const appendixAExercises: LearningExercise[] = [
  {
    id: 'appendix-a-product-inverse', difficulty: 1,
    prompt: '若 A、B 都可逆，乘积 AB 的逆矩阵是哪一个？',
    options: [
      { id: 'reverse', label: 'B⁻¹A⁻¹' },
      { id: 'same', label: 'A⁻¹B⁻¹' },
      { id: 'sum', label: 'A⁻¹+B⁻¹' },
    ],
    correctOptionId: 'reverse',
    hint: '把候选答案右乘 AB，检查能否得到单位矩阵。',
    explanation: '(AB)(B⁻¹A⁻¹)=A(BB⁻¹)A⁻¹=I；相邻的 B 与 B⁻¹、A 与 A⁻¹ 必须按相反顺序消去。',
  },
  {
    id: 'appendix-a-trace-cycle', difficulty: 2,
    prompt: '对维数相容的三个方阵，哪一组迹恒等式总成立？',
    options: [
      { id: 'cyclic', label: 'Tr(ABC)=Tr(BCA)=Tr(CAB)' },
      { id: 'swap', label: 'Tr(ABC)=Tr(BAC)' },
      { id: 'reverse', label: 'Tr(ABC)=Tr(CBA)' },
    ],
    correctOptionId: 'cyclic',
    hint: '迹允许循环移动因子，但不允许任意交换相邻矩阵。',
    explanation: '循环置换保持乘法中的相对顺序；BAC 和 CBA 是非循环排列，一般会改变结果。',
  },
  {
    id: 'appendix-a-logdet-gradient', difficulty: 3,
    prompt: '可逆矩阵 A 的标量函数 ln|A| 对 A 的梯度是什么？',
    options: [
      { id: 'inverse-transpose', label: '(A⁻¹)ᵀ' },
      { id: 'inverse', label: 'A⁻¹，对任意非对称 A 都无需转置' },
      { id: 'transpose', label: 'Aᵀ' },
    ],
    correctOptionId: 'inverse-transpose',
    hint: '教材式 (A.28) 使用按 Aᵢⱼ 排列的矩阵梯度约定。',
    explanation: '∂ ln|A|/∂A=(A⁻¹)ᵀ。只有 A 对称时，A⁻¹ 也对称，转置才可以省略。',
  },
];

export const appendixBExercises: LearningExercise[] = [
  {
    id: 'appendix-b-function-versus-functional', difficulty: 1,
    prompt: '普通函数 y(x) 与泛函 F[y] 的输入输出分别是什么？',
    options: [
      { id: 'correct', label: 'y 接收数值并返回数值；F 接收整条函数并返回标量' },
      { id: 'both-functions', label: '二者都只能接收标量并返回函数' },
      { id: 'functional-vector', label: 'F 只能接收有限维向量，不能接收函数' },
    ],
    correctOptionId: 'correct',
    hint: '熵 H[p] 的输入是一个概率密度函数 p(x)。',
    explanation: '泛函把一个函数视为整体输入。变分法优化的未知量不是某个数，而是所有候选函数中的一条函数。',
  },
  {
    id: 'appendix-b-functional-stationarity', difficulty: 2,
    prompt: '若 ∫(δF/δy(x))η(x)dx=0 对所有允许的扰动 η 都成立，可推出什么？',
    options: [
      { id: 'zero-everywhere', label: 'δF/δy(x)=0 在积分域内处处成立' },
      { id: 'eta-zero', label: '只能推出 η(x)=0' },
      { id: 'integral-one', label: '只能推出泛函 F[y]=1' },
    ],
    correctOptionId: 'zero-everywhere',
    hint: '可以让 η 只在任意指定点的小邻域内非零。',
    explanation: '若泛函导数在某个邻域不为零，就能选择同号的局部扰动使积分不为零，因此驻点要求泛函导数处处为零。',
  },
  {
    id: 'appendix-b-euler-lagrange', difficulty: 3,
    prompt: '对 G(y,y′,x)=y²+(y′)²，Euler–Lagrange 方程是什么？',
    options: [
      { id: 'correct', label: 'y−y″=0' },
      { id: 'plus', label: 'y+y″=0' },
      { id: 'first', label: 'y−y′=0' },
    ],
    correctOptionId: 'correct',
    hint: '∂G/∂y=2y，∂G/∂y′=2y′，再对后者求 x 导数。',
    explanation: '2y−d(2y′)/dx=0，约去 2 后得到 y−y″=0；具体解还必须结合固定端点等边界条件。',
  },
];

export const appendixCExercises: LearningExercise[] = [
  {
    id: 'appendix-c-equality-example', difficulty: 1,
    prompt: '最大化 f=1−x₁²−x₂²，约束 x₁+x₂=1。教材示例的驻点是什么？',
    options: [
      { id: 'half-half', label: '(1/2, 1/2)' },
      { id: 'one-zero', label: '(1, 0)' },
      { id: 'zero-zero', label: '(0, 0)' },
    ],
    correctOptionId: 'half-half',
    hint: '两个变量在目标中完全对称，且它们的和固定为 1。',
    explanation: '驻点方程给出 −2x₁+λ=0 与 −2x₂+λ=0，所以 x₁=x₂；再用约束得到二者均为 1/2。',
  },
  {
    id: 'appendix-c-equality-lambda-sign', difficulty: 2,
    prompt: '对等式约束 g(x)=0，拉格朗日乘子 λ 的符号有什么限制？',
    options: [
      { id: 'none', label: '没有固定符号限制，可以为正或负' },
      { id: 'positive', label: '必须严格为正' },
      { id: 'zero', label: '必须恒为 0' },
    ],
    correctOptionId: 'none',
    hint: '等式约束曲面的法向可以朝两个相反方向。',
    explanation: '等式约束只要求 ∇f 与 ∇g 平行或反平行，因此 λ 可取任意符号；符号限制来自选定方向的不等式约束。',
  },
  {
    id: 'appendix-c-kkt-inactive', difficulty: 3,
    prompt: '按教材“最大化 f 且 g(x)≥0”的约定，若最优点严格位于 g(x)>0 的内部，KKT 乘子应满足什么？',
    options: [
      { id: 'lambda-zero', label: 'λ=0，约束不活跃' },
      { id: 'lambda-positive', label: 'λ必须严格大于 0' },
      { id: 'g-zero', label: '必须同时有 g(x)=0' },
    ],
    correctOptionId: 'lambda-zero',
    hint: '互补松弛要求 λg(x)=0。',
    explanation: '当 g(x)>0 时，互补松弛只能由 λ=0 满足；此时驻点条件退化为无约束的 ∇f=0。',
  },
];
