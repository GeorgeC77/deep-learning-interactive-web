import BishopSectionPage from '@/components/BishopSectionPage';
import AutodiffModeLab from '@/components/demos/AutodiffModeLab';
import DerivationStepper from '@/components/DerivationStepper';
import ExercisePanel from '@/components/ExercisePanel';
import { chapter05AutodiffExercises } from '@/course/chapter05Exercises';
import { Calculator } from 'lucide-react';

export default function Ch05AutomaticDifferentiationPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch05/automatic-differentiation"
      heroIcon={<Calculator className="w-9 h-9 text-blue-600" />}
      summary={
        "Bishop §8.2 将自动微分与手工推导、有限差分和符号微分明确区分：autodiff 不生成庞大的闭式导数，而是把程序执行拆成基本运算，在 evaluation trace 上同步传播 primal 与 tangent，或反向传播 adjoint。"
      }
      concepts={[
        {
          title: "四种导数求值方式",
          description: "手工反传易出错且难维护；有限差分有截断/舍入折中且扩展差；符号微分可能产生表达式膨胀；自动微分复用程序的中间变量，生成计算导数的代码。",
        },
        {
          title: "执行轨迹而非闭式表达式",
          description: "程序运行时把函数分解成基本算子和 primal 变量。自动微分对这条实际轨迹应用局部求导规则，因此能处理分支、循环和过程调用，但导数仍是机器精度下的浮点结果。",
          formula: String.raw`v_i=\phi_i(v_{\mathrm{pa}(i)})`,
        },
        {
          title: "前向模式：传播 tangent",
          description: "为输入播种方向 r，并随 primal 同步传播 v̇。一次前向传播得到 J r；要构造完整 K×D Jacobian，通常需要 D 个输入方向。",
          formula: String.raw`\dot v_i=\sum_{j\in\mathrm{pa}(i)}\frac{\partial v_i}{\partial v_j}\dot v_j,\qquad \dot{\mathbf x}=\mathbf r\Rightarrow\dot{\mathbf f}=\mathbf J\mathbf r`,
        },
        {
          title: "反向模式：传播 adjoint",
          description: "对一个输出播种 adjoint=1，并按逆轨迹累加。一次反向传播得到一个输出对全部输入的导数，即 VJP；完整 Jacobian 通常需要 K 次。",
          formula: String.raw`\bar v_i=\sum_{j\in\mathrm{ch}(i)}\bar v_j\frac{\partial v_j}{\partial v_i},\qquad \bar{\mathbf f}=\mathbf u^T\Rightarrow\bar{\mathbf x}=\mathbf u^T\mathbf J`,
        },
        {
          title: "模式选择与内存",
          description: "D≪K 时前向模式适合，K≪D 时反向模式适合。神经网络训练是百万参数到标量损失，故采用反向模式；代价是通常要保存前向中间值或用检查点重算。",
          formula: String.raw`C_{\mathrm{full\ J}}^{\mathrm{forward}}\propto D,\qquad C_{\mathrm{full\ J}}^{\mathrm{reverse}}\propto K`,
        },
      ]}
      learningObjectives={[
        "区分有限差分、符号微分与自动微分的计算对象、误差来源和扩展性。",
        "沿基本运算执行轨迹手算一次前向 tangent 传播和反向 adjoint 传播。",
        "用 D 与 K 比较完整 Jacobian 的前向/反向传播次数，并选择合适模式。",
        "解释反向模式为何适合标量损失训练，以及保存 tape 带来的内存权衡。",
      ]}
      coreIntuition={
        "前向模式问“给输入一个方向性扰动，所有中间量会怎样变化”；反向模式问“给某个输出一个权重，每个中间量对它贡献多少”。两者应用同一链式法则，只是遍历方向和种子位置不同。"
      }
      commonMistakes={[
        "把自动微分说成符号微分——autodiff 通常生成并执行导数计算，不要求构造闭式代数表达式。",
        "声称自动微分完全没有舍入误差——它没有有限差分的截断误差，但浮点运算仍只有机器精度。",
        "把模式选择简化成‘输入高就反向’——应比较所求映射的输入维度 D、输出维度 K，以及是否只需 JVP/VJP。",
        "忽略反向模式的内存成本——局部导数依赖 primal 值，必须保存、压缩或重算前向中间量。",
      ]}
      whyCards={[
        {
          question: "为什么神经网络训练几乎总用反向模式？",
          answer: "训练目标通常是一个标量损失 K=1，而可学习参数 D 极大；一次反向传播就得到损失对全部参数的梯度。",
        },
        {
          question: "为什么自动微分比展开符号导数更实用？",
          answer: "它复用前向中间变量，避免重复子表达式，并能沿实际程序轨迹处理循环、分支和函数调用。",
        },
      ]}
      counterexamples={[
        "对 D=2、K=10,000 的完整 Jacobian 使用反向模式要按输出反传约 10,000 次，而前向模式只需约 2 次——说明反向模式并非总是更快。",
        "把中心差分称作自动微分会引入 ε 的选择问题；真正的 autodiff 不通过有限扰动估计导数——说明二者误差机制不同。",
      ]}
      bishopMapping={{
        chapter: "Ch 8",
        section: "8.2",
        pages: "§8.2, pp. 244–250",
        textbookSubsections: [
          "8.2 Automatic Differentiation",
          "8.2.1 Forward-mode automatic differentiation",
          "8.2.2 Reverse-mode automatic differentiation"
        ],
        formulas: ["forward tangent recursion", "JVP Jr", "reverse adjoint recursion", "VJP uᵀJ"],
        algorithms: ["forward-mode automatic differentiation", "reverse-mode automatic differentiation"],
        exercises: ["沿教材式 (8.49) 手算两个 tangent 列。", "用一次反向传播得到同一函数的完整梯度。", "比较不同 D、K 下的传播次数与内存。"],
      }}
      interactiveDemo={<AutodiffModeLab />}
      extraContent={
        <div className="space-y-10">
          <DerivationStepper
            title="分步对比：同一执行轨迹上的 tangent 与 adjoint"
            steps={[
              { label: '分解 primal', formula: String.raw`v_1=x_1,\ v_2=x_2,\ v_3=v_1v_2,\ldots,\ v_7=f`, explanation: '先把程序执行拆成基本操作；每个节点只需知道直接父节点。' },
              { label: '前向播种', formula: String.raw`\dot{\mathbf x}=\mathbf e_j\quad\Longrightarrow\quad\dot v_i=\sum_{p\in\mathrm{pa}(i)}\frac{\partial v_i}{\partial v_p}\dot v_p`, explanation: '一次种子 ej 得到 Jacobian 的第 j 列；一般完整 Jacobian 需 D 次。' },
              { label: '反向播种', formula: String.raw`\bar v_7=1\quad\Longrightarrow\quad\bar v_i=\sum_{c\in\mathrm{ch}(i)}\bar v_c\frac{\partial v_c}{\partial v_i}`, explanation: '一个标量输出只需一次逆序遍历；分支的多个 child 贡献在求和中累积。' },
              { label: '比较成本', formula: String.raw`D\ll K:\ \text{forward};\qquad K\ll D:\ \text{reverse}`, explanation: '这是构造完整 Jacobian 的传播次数准则；只求 JVP 或 VJP 时各自一次即可。' },
            ]}
          />
          <ExercisePanel exerciseSetId="chapter05-autodiff" exercises={chapter05AutodiffExercises} />
        </div>
      }
    />
  );
}
