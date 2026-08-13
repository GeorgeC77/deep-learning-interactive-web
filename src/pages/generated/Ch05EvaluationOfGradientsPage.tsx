import BishopSectionPage from '@/components/BishopSectionPage';
import BackpropagationLab from '@/components/demos/BackpropagationLab';
import DerivationStepper from '@/components/DerivationStepper';
import ExercisePanel from '@/components/ExercisePanel';
import { chapter05GradientExercises } from '@/course/chapter05Exercises';
import { GitBranch } from 'lucide-react';

export default function Ch05EvaluationOfGradientsPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch05/evaluation-of-gradients"
      heroIcon={<GitBranch className="w-9 h-9 text-blue-600" />}
      summary={
        "Bishop §8.1 把反向传播严格限定为导数的数值求值过程，而不是网络架构或梯度下降更新。核心是先前向保存激活，再从输出误差信号开始，按逆拓扑序累积每条路径的局部链式法则贡献。"
      }
      concepts={[
        {
          title: "单层网络的局部梯度",
          description: "平方误差线性模型的权重梯度是输出残差与输入激活的乘积。这个“输出端误差信号 × 输入端激活”的结构会原样推广到多层网络。",
          formula: String.raw`\frac{\partial E_n}{\partial w_{ji}}=(y_{nj}-t_{nj})x_{ni}`,
        },
        {
          title: "一般前馈网络的反传递推",
          description: "定义 δj=∂En/∂aj。隐藏单元把所有下游单元 k 的贡献相加，再乘本单元激活导数；分支节点绝不能只保留一条路径。",
          formula: String.raw`\delta_j=h'(a_j)\sum_k w_{kj}\delta_k,\qquad \frac{\partial E_n}{\partial w_{ji}}=\delta_jz_i`,
        },
        {
          title: "简单两层示例",
          description: "对 tanh 隐藏层和线性输出层，h′(aj)=1-zj²，输出误差信号为 yk-tk。先算输出 δ，再递推隐藏 δ，最后得到两层权重梯度。",
          formula: String.raw`\delta_k=y_k-t_k,\qquad \delta_j=(1-z_j^2)\sum_k w^{(2)}_{kj}\delta_k`,
        },
        {
          title: "数值微分与梯度校验",
          description: "中心差分需要每个参数两次额外前向，不能替代训练中的反传，但可独立检查实现。ε 太大时截断误差主导，太小时浮点相消和舍入误差主导。",
          formula: String.raw`\frac{\partial E}{\partial w_i}\approx\frac{E(w_i+\varepsilon)-E(w_i-\varepsilon)}{2\varepsilon}+O(\varepsilon^2)`,
        },
        {
          title: "Jacobian 的局部敏感性",
          description: "Jki=∂yk/∂xi 描述网络输出对输入的局部线性响应。它依赖当前输入，关系 Δy≈JΔx 只对足够小的扰动成立；逐输出反传可构造各行。",
          formula: String.raw`J_{ki}=\frac{\partial y_k}{\partial x_i},\qquad \Delta\mathbf y\simeq \mathbf J\Delta\mathbf x`,
        },
        {
          title: "Hessian 与可扩展计算",
          description: "W 个参数的完整 Hessian 有 W² 个元素，显式计算和存储通常不可行；Hessian-vector product 可做到 O(W) 量级，而外积近似只在相应假设成立时可靠。",
          formula: String.raw`H_{ij}=\frac{\partial^2E}{\partial w_i\partial w_j},\qquad \mathbf H\simeq\sum_n\nabla a_n\nabla a_n^T`,
        },
      ]}
      learningObjectives={[
        "从 δj 的定义推导一般前馈网络的反向递推与权重梯度。",
        "在分支计算图中区分局部导数、上游 adjoint 与多路径梯度累加。",
        "使用中心差分校验解析梯度，并解释步长过大或过小的误差来源。",
        "说明 Jacobian 的局部性质，以及完整 Hessian、HVP 和近似 Hessian 的成本差异。",
      ]}
      coreIntuition={
        "前向传播为每个节点留下计算局部导数所需的值；反向传播从标量输出的 adjoint=1 出发，把“到最终损失的敏感度”逐边乘上局部导数。若变量沿多条路径影响损失，这些贡献在该变量处相加。"
      }
      commonMistakes={[
        "把反向传播等同于梯度下降——前者计算梯度，后者决定如何用梯度更新参数。",
        "分支计算图只沿一条路径回传——共享变量的 adjoint 必须累加所有下游贡献。",
        "说反传成本与参数数量无关——一次前向和反向都通常是 O(W)，准确说法是常数倍前向成本，而不是为每个参数各跑一次网络。",
        "把 Hessian 外积近似当作恒等式——教材明确指出一般网络中被忽略的二阶项通常不可忽略。",
      ]}
      whyCards={[
        {
          question: "为什么先前向、再按逆序反向？",
          answer: "局部导数通常依赖前向中间激活，而节点的 adjoint 又依赖所有下游子节点；逆拓扑序确保使用前这些下游贡献已经完整累积。",
        },
        {
          question: "为什么数值微分仍值得保留？",
          answer: "它只依赖前向代码，错误模式与反传实现相对独立，所以适合作为小模型和少量参数上的梯度校验基准。",
        },
      ]}
      counterexamples={[
        "对 y=x²+sin(x) 只回传平方分支会得到 2x，而正确梯度是 2x+cos(x)——说明分支贡献必须相加。",
        "中心差分把 ε 从 10⁻⁴ 一直减到机器精度附近，误差反而增大——说明更小步长不等于更准确。",
      ]}
      bishopMapping={{
        chapter: "Ch 8",
        section: "8.1",
        pages: "§8.1, pp. 234–244",
        textbookSubsections: [
          "8.1 Evaluation of Gradients",
          "8.1.1 Single-layer networks",
          "8.1.2 General feed-forward networks",
          "8.1.3 A simple example",
          "8.1.4 Numerical differentiation",
          "8.1.5 The Jacobian matrix",
          "8.1.6 The Hessian matrix"
        ],
        formulas: ["δj=h′(aj)Σk wkjδk", "∂En/∂wji=δjzi", "central differences", "Jacobian and Hessian"],
        algorithms: ["Algorithm 8.1 Backpropagation"],
        exercises: ["手算两层网络的一次完整反传。", "在分支计算图验证梯度贡献累加。", "扫描 ε 并比较中心差分与反传误差。"],
      }}
      interactiveDemo={<BackpropagationLab />}
      extraContent={
        <div className="space-y-10">
          <DerivationStepper
            title="分步推导：从局部链式法则到一般反传"
            steps={[
              { label: '定义预激活', formula: String.raw`a_j=\sum_iw_{ji}z_i,\qquad z_j=h(a_j)`, explanation: '前向传播计算并保存每个节点的预激活与激活。' },
              { label: '定义误差信号', formula: String.raw`\delta_j\equiv\frac{\partial E_n}{\partial a_j}`, explanation: 'δj 是最终损失对节点预激活的累积敏感度，不是节点自身的局部导数。' },
              { label: '沿下游累加', formula: String.raw`\delta_j=\sum_k\frac{\partial E_n}{\partial a_k}\frac{\partial a_k}{\partial a_j}=h'(a_j)\sum_kw_{kj}\delta_k`, explanation: '所有从 j 出发的下游路径都进入求和，随后乘本节点激活导数。' },
              { label: '得到权重梯度', formula: String.raw`\frac{\partial E_n}{\partial w_{ji}}=\frac{\partial E_n}{\partial a_j}\frac{\partial a_j}{\partial w_{ji}}=\delta_jz_i`, explanation: '每条连接的梯度只需输出端 δ 与输入端激活 z 的局部乘积。' },
            ]}
          />
          <ExercisePanel exerciseSetId="chapter05-gradient-evaluation" exercises={chapter05GradientExercises} />
        </div>
      }
    />
  );
}
