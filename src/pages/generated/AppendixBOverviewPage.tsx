import AppendixSectionCompletion from '@/components/AppendixSectionCompletion';
import BishopSectionPage from '@/components/BishopSectionPage';
import { FunctionSquare } from 'lucide-react';

export default function AppendixBOverviewPage() {
  return (
    <BishopSectionPage
      sectionPath="/appendix/b/overview"
      heroIcon={<FunctionSquare className="w-9 h-9 text-blue-600" />}
      summary="变分法把普通微积分中“选择一个数使函数取极值”推广为“选择一整条函数使泛函取极值”。教材从任意函数扰动出发，经分部积分推导 Euler–Lagrange 方程。"
      concepts={[
        {
          title: '函数与泛函',
          description: '函数 y(x) 接收数值并返回数值；泛函 F[y] 接收整条函数并返回一个标量，例如概率密度 p 的熵 H[p]。',
        },
        {
          title: '泛函导数',
          description: '用任意小扰动 εη(x) 定义泛函的一阶变化，δF/δy(x) 是有限维梯度在连续函数空间中的对应物。',
          formula: String.raw`F[y+\epsilon\eta]=F[y]+\epsilon\int\frac{\delta F}{\delta y(x)}\eta(x)\,dx+O(\epsilon^2)`,
        },
        {
          title: '固定边界与分部积分',
          description: '当 y 的边界值固定时，允许扰动 η 必须在边界为零，才能消去分部积分产生的边界项。',
        },
        {
          title: 'Euler–Lagrange 方程',
          description: '对 F[y]=∫G(y,y′,x)dx，驻函数必须满足一个微分方程；它是必要条件，仍需结合边界条件求解。',
          formula: String.raw`\frac{\partial G}{\partial y}-\frac{d}{dx}\left(\frac{\partial G}{\partial y'}\right)=0`,
        },
      ]}
      learningObjectives={[
        '能区分普通函数、泛函和泛函导数。',
        '能解释“对任意扰动成立”为何推出泛函导数处处为零。',
        '会通过分部积分推导 Euler–Lagrange 方程，并明确固定边界前提。',
      ]}
      coreIntuition="普通梯度询问每个坐标该怎样动；泛函导数则询问函数曲线在每个位置该怎样变形。若任何局部小变形都不能产生一阶改善，这条函数才是驻函数。"
      commonMistakes={[
        '把泛函 F[y] 当作普通的复合函数 F(y(x))；泛函的输入是整条函数。',
        '从积分为零直接推出被积函数为零，却忘记这一结论依赖 η 可以任意局部变化。',
        '分部积分时无条件丢弃边界项；固定端点时 η 才在边界为零。',
        '把 Euler–Lagrange 方程当成自动保证全局最小值的充分条件；它首先给出驻点的必要条件。',
      ]}
      whyCards={[
        {
          question: '为什么扰动函数 η 必须任意？',
          answer: '只有允许 η 聚焦到任意局部区域，才能由所有一阶变化都为零推出泛函导数在每个位置都为零。',
        },
        {
          question: '为什么 Euler–Lagrange 方程通常是微分方程？',
          answer: '泛函 integrand 同时依赖 y 与 y′；把 η′ 通过分部积分转移到 ∂G/∂y′ 上，就自然出现关于 x 的导数。',
        },
      ]}
      counterexamples={[
        '若端点允许自由变化却仍直接删除边界项，会漏掉自然边界条件，得到不完整的驻点系统。',
        '满足 Euler–Lagrange 方程的函数可能对应最大值、最小值或鞍点，仍需结合问题结构判断。',
      ]}
      bishopMapping={{
        chapter: 'Appendix B',
        pages: 'pp. 617–619',
        textbookSubsections: ['Appendix B Calculus of Variations'],
        formulas: ['functional derivative definition', 'stationarity under arbitrary variations', 'Euler–Lagrange equation'],
        algorithms: ['函数扰动与分部积分推导'],
        exercises: ['区分函数与泛函。', '说明固定边界如何消去边界项。', '推导一个简单 integrand 的 Euler–Lagrange 方程。'],
      }}
      extraContent={<AppendixSectionCompletion appendix="b" />}
    />
  );
}
