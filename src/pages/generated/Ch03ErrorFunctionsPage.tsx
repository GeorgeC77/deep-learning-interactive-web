import BishopSectionPage from '@/components/BishopSectionPage';
import DerivationStepper from '@/components/DerivationStepper';
import ErrorFunctionLab from '@/components/demos/ErrorFunctionLab';
import ExercisePanel from '@/components/ExercisePanel';
import { chapter03ErrorExercises } from '@/course/chapter03Exercises';
import { Activity } from 'lucide-react';

export default function Ch03ErrorFunctionsPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch03/error-functions"
      heroIcon={<Activity className="w-9 h-9 text-blue-600" />}
      summary="误差函数把概率模型与任务目标连接起来。本节对应 Bishop §6.4.1–6.4.3：从高斯、伯努利和类别分布的最大似然，分别得到回归平方误差、二分类交叉熵和 softmax 交叉熵。"
      concepts={[
        {
          title: '回归：平方误差',
          description: '若目标等于网络输出加固定方差的独立高斯噪声，最小化负对数似然就等价于最小化残差平方和。噪声模型改变时，合适的损失也会改变。',
          formula: String.raw`E = \frac{1}{2} \sum_{n=1}^{N} \| y(x_n, w) - t_n \|^2`,
        },
        {
          title: '二分类：sigmoid 交叉熵',
          description: 'sigmoid 把 logit 映射为伯努利概率。与交叉熵组合后，对 logit 的导数化简为预测概率减标签，给出方向清晰的训练信号。',
          formula: String.raw`E = -\sum_n[t_n\ln y_n+(1-t_n)\ln(1-y_n)],\quad \frac{\partial E}{\partial a_n}=y_n-t_n`,
        },
        {
          title: '多分类：softmax 交叉熵',
          description: '互斥多分类使用 softmax 将 logits 归一化为和为 1 的类别概率；one-hot 交叉熵等于正确类别概率的负对数。多标签任务则不满足互斥假设。',
          formula: String.raw`y_k=\frac{e^{a_k}}{\sum_j e^{a_j}},\quad E=-\sum_n\sum_k t_{nk}\ln y_{nk}`,
        },
      ]}
      learningObjectives={[
        '从固定方差高斯似然推出回归平方误差',
        '用链式法则推出 sigmoid 交叉熵对 logit 的梯度 y-t',
        '区分互斥多分类的 softmax 与多标签任务的独立 sigmoid',
        '根据输出变量和噪声假设选择匹配的误差函数',
      ]}
      coreIntuition="损失函数不是随意挑选的记分规则：它隐含了对数据生成过程的假设。先明确目标是连续值、伯努利事件还是互斥类别，再写似然并取负对数，便能得到与任务匹配的训练目标。"
      commonMistakes={[
        '只比较损失对概率 y 的导数，却把它误称为反传到 logit a 的梯度——二者之间还差激活函数的链式因子',
        '认为分类损失只是工程选择，与伯努利或类别分布的概率假设无关',
        '对互斥多分类使用多个独立 sigmoid；反过来，多标签任务也不应强制使用 softmax',
      ]}
      whyCards={[
        {
          question: '为什么 sigmoid 交叉熵在置信但错误时仍有明显训练信号？',
          answer: '交叉熵对概率的导数与 sigmoid 导数相乘后化简为 y-t。若 t=1 而 y≈0，logit 梯度接近 -1；sigmoid 后平方误差还会多乘 y(1-y)，因此可能在饱和区接近零。',
        },
        {
          question: '为什么互斥多分类通常使用 softmax？',
          answer: 'softmax 把各类 logits 联合归一化，得到非负且和为 1 的类别分布。若类别可同时成立，应改用独立的 sigmoid，而不是套用互斥假设。',
        },
      ]}
      counterexamples={[
        '令 t=1、logit a=-8：交叉熵的 ∂E/∂a 约为 -1，而 sigmoid 后平方误差的梯度量级约为 10⁻⁴——说明比较训练信号时必须固定求导变量。',
        '一张图可同时包含“猫”和“室内”两个标签；softmax 会强迫二者竞争——说明多标签任务需要独立伯努利输出。',
      ]}
      bishopMapping={{
        chapter: 'Ch 6',
        section: '6.4',
        pages: '§6.4, pp. 194–197',
        textbookSubsections: [
          '6.4 Error Functions',
          '6.4.1 Regression',
          '6.4.2 Binary classification',
          '6.4.3 Multiclass classification',
        ],
        formulas: [
          'Gaussian negative log-likelihood and squared error',
          'sigmoid cross-entropy and ∂E/∂a = y-t',
          'softmax multiclass cross-entropy',
        ],
        exercises: [
          '令 t=1、a=-4，分别计算交叉熵与 sigmoid 后平方误差对 a 的梯度',
          '证明 softmax 输出非负且各类别概率之和为 1',
          '判断互斥三分类与多标签识别分别应使用哪种输出层和似然',
        ],
      }}
      interactiveDemo={<ErrorFunctionLab />}
      extraContent={
        <div className="space-y-10">
          <DerivationStepper
            title="分步推导：sigmoid 交叉熵为何得到 y-t"
            steps={[
              {
                label: '写出概率',
                formula: String.raw`y=\sigma(a)=\frac{1}{1+e^{-a}}`,
                explanation: 'a 是网络输出的 logit，y 是伯努利事件发生的概率。',
              },
              {
                label: '写出负对数似然',
                formula: String.raw`E=-t\ln y-(1-t)\ln(1-y)`,
                explanation: '这是单个样本的二分类交叉熵。',
              },
              {
                label: '分别求导',
                formula: String.raw`\frac{\partial E}{\partial y}=\frac{y-t}{y(1-y)},\quad \frac{\partial y}{\partial a}=y(1-y)`,
                explanation: '损失对概率的导数不是最终反传到网络的梯度，还要乘 sigmoid 导数。',
              },
              {
                label: '链式约分',
                formula: String.raw`\frac{\partial E}{\partial a}=\frac{\partial E}{\partial y}\frac{\partial y}{\partial a}=y-t`,
                explanation: '两个 y(1-y) 因子约掉，得到简洁的概率残差。',
              },
            ]}
          />
          <ExercisePanel exerciseSetId="chapter03-error" exercises={chapter03ErrorExercises} />
        </div>
      }
    />
  );
}
