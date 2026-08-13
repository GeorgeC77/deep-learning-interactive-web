import BishopSectionPage from '@/components/BishopSectionPage';
import OptimizationLandscapeLab from '@/components/demos/OptimizationLandscapeLab';
import { Mountain } from 'lucide-react';
import DerivationStepper from '@/components/DerivationStepper';
import ExercisePanel from '@/components/ExercisePanel';
import { chapter04ErrorSurfaceExercises } from '@/course/chapter04Exercises';

export default function Ch04ErrorSurfacesPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch04/error-surfaces"
      heroIcon={<Mountain className="w-9 h-9 text-blue-600" />}
      summary={"误差函数在参数空间上形成曲面。Bishop §7.1 从驻点附近的二阶泰勒展开出发，用 Hessian 的特征值判断极小值、极大值和鞍点，并解释等高线为何沿特征向量形成椭圆。"}
      concepts={[
        {
          title: "局部二次近似",
          description: "在驻点 w* 附近对误差函数做泰勒展开，一阶项为零，二阶项由 Hessian 矩阵 H 决定。这给出了损失曲面的局部几何。",
          formula: String.raw`E(\mathbf{w}) \simeq E(\mathbf{w}^*) + \frac{1}{2}(\mathbf{w}-\mathbf{w}^*)^{\!T}\mathbf{H}(\mathbf{w}-\mathbf{w}^*)`,
        },
        {
          title: "Hessian 矩阵",
          description: "H 是误差函数对参数的二阶偏导矩阵 H_{ij}=∂²E/∂w_i∂w_j，其特征值 λ_i 沿特征向量方向给出曲率。",
          formula: String.raw`\mathbf{H}_{ij} = \frac{\partial^2 E}{\partial w_i \,\partial w_j}`,
        },
        {
          title: "曲率与学习率",
          description: "对正定二次模型，沿特征值 λ 的方向，误差坐标每步乘以 1-ηλ。固定步长的严格稳定条件是 0<η<2/λ_max；η=2/λ_max 只是临界振荡，并不收敛。",
          formula: String.raw`0 < \eta < \frac{2}{\lambda_{\max}}`,
        },
        {
          title: "条件数",
          description: "条件数 κ=λ_max/λ_min 衡量曲面各向异性程度。κ 越大，梯度下降越容易出现锯齿形路径，收敛越慢。",
          formula: String.raw`\kappa = \frac{\lambda_{\max}}{\lambda_{\min}}`,
        },
        {
          title: "鞍点与高原",
          description: "若驻点 Hessian 同时有正、负特征值，它就是鞍点。深度网络中鞍点和近零曲率区域会造成停滞，但它们是否比局部极小值更常见取决于误差面结构，不能只由维数作无条件判断。",
        },
        {
          title: "梯度下降的轨迹",
          description: "在条件数大的曲面上，梯度方向并不指向极小值，而是呈现之字形振荡，这正是自适应优化方法被提出的动机之一。",
        },
      ]}
      learningObjectives={[
        "能写出误差函数在极小值附近的局部二次近似，并解释 Hessian 的作用。",
        "理解 Hessian 特征值与曲率方向的关系，以及它如何约束最大学习率。",
        "能用条件数解释为何各向异性曲面会导致梯度下降收敛缓慢。",
        "根据 Hessian 特征值符号区分局部极小值、极大值和鞍点。",
      ]}
      coreIntuition={"误差曲面像一片起伏的地形：Hessian 的特征值告诉你每个方向有多陡。如果某个方向极陡（大 λ），走快一点就会跨过谷底来回反弹；如果某方向极缓（小 λ），走得再慢也几乎不动。条件数大的曲面就像一条狭长峡谷，梯度下降会在两壁间反复横跳却沿谷底方向缓慢前进。"}
      commonMistakes={[
        "认为梯度方向总是指向极小值；在各向异性曲面上，梯度几乎垂直于通向极小值的方向。",
        "对所有方向使用相同学习率而不考虑曲率差异，导致陡峭方向发散或平缓方向停滞。",
        "把训练停滞直接判定为局部极小值；小梯度也可能来自鞍点、平台或数值尺度。",
        "把 η=2/λ_max 当作可收敛的最大学习率——该边界会产生不衰减的临界振荡。",
      ]}
      whyCards={[
        {
          question: "为什么梯度下降会在狭长峡谷中来回振荡？",
          answer: "峡谷两侧陡峭，梯度几乎垂直指向谷底；学习率稍大就会从一侧跳到另一侧，沿谷底方向却前进缓慢。",
        },
        {
          question: "为什么只看梯度为零还不能判断到达极小值？",
          answer: "梯度为零只说明一阶变化消失。还需检查 Hessian：全正曲率才是严格局部极小值，正负混合则是鞍点。",
        },
      ]}
      counterexamples={[
        "对 E=0.05x²+5y²，稳定学习率受 y 方向限制，而 x 方向曲率只有其 1/100——说明单一学习率会在病态曲面上顾此失彼。",
        "把训练停滞误判为到达局部极小值，实际上 Hessian 有正有负，是鞍点——说明高维优化需要逃离鞍点的策略。",
      ]}
            bishopMapping={{
        chapter: "Ch 7",
        section: "7.1",
        pages: "§7.1, pp. 210–213",
        textbookSubsections: [
          "7.1 Error Surfaces",
          "7.1.1 Local quadratic approximation"
        ],
        formulas: ["local quadratic approximation", "Hessian matrix", "strict stability interval 0<η<2/λ_max", "condition number"],
        algorithms: ["gradient descent stability analysis"],
        exercises: [
          "对二次函数 E(w)=½wᵀHw 推导梯度下降的收敛条件。",
          "给定 Hessian 的特征值，计算最优学习率与条件数。",
          "讨论鞍点对深度网络训练的影响及常用逃离策略。",
        ],
      }}
      demo={{
        title: "二次近似下的稳定边界",
        label: "Hessian 最大特征值 λ_max",
        param: 2,
        min: 0.1,
        max: 10,
        step: 0.1,
        compute: (lambda) => ({
          label: '稳定边界 η_boundary（严格收敛需更小）',
          value: 2 / lambda,
          display: String.raw`0<\eta<\frac{2}{${lambda.toFixed(1)}}=${(2 / lambda).toFixed(3)}`,
        }),
        formula: String.raw`0 < \eta < \frac{2}{\lambda_{\max}}`,
      }}
      interactiveDemo={<OptimizationLandscapeLab />}
      extraContent={
        <div className="space-y-10">
          <DerivationStepper
            title="分步推导：二次曲面上的稳定步长"
            steps={[
              { label: '特征坐标', formula: String.raw`E=E^*+\frac12\sum_i\lambda_i\alpha_i^2`, explanation: '在 Hessian 特征向量基底中，各曲率方向彼此解耦。' },
              { label: '方向梯度', formula: String.raw`\frac{\partial E}{\partial\alpha_i}=\lambda_i\alpha_i`, explanation: '每个方向都是一个曲率为 λᵢ 的一维二次函数。' },
              { label: '一次更新', formula: String.raw`\alpha_i^{(t+1)}=(1-\eta\lambda_i)\alpha_i^{(t)}`, explanation: '距离极小值的该方向分量每步乘以固定因子。' },
              { label: '稳定条件', formula: String.raw`|1-\eta\lambda_i|<1\ \forall i\quad\Longrightarrow\quad 0<\eta<\frac{2}{\lambda_{\max}}`, explanation: '严格小于 1 才会衰减；等于 1 时只是保持振幅。' },
            ]}
          />
          <ExercisePanel exerciseSetId="chapter04-error-surfaces" exercises={chapter04ErrorSurfaceExercises} />
        </div>
      }
    />
  );
}
