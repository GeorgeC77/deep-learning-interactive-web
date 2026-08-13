import BishopSectionPage from '@/components/BishopSectionPage';
import SequenceModelsLab from '@/components/demos/SequenceModelsLab';
import DerivationStepper from '@/components/DerivationStepper';
import ExercisePanel from '@/components/ExercisePanel';
import { chapter08SequenceModelsExercises } from '@/course/chapter08Exercises';
import { Clock } from 'lucide-react';

export default function Ch08SequenceModelsPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch08/sequence-models"
      heroIcon={<Clock className="w-9 h-9 text-blue-600" />}
      summary="Bishop §11.3 从相互独立的序列基线出发，用一阶或高阶马尔可夫假设限制历史依赖；再引入隐状态 z，使状态链保持一阶马尔可夫，而观测 x 在边缘化 z 后通常不满足任何有限阶马尔可夫性质。"
      concepts={[
        {
          title: '独立序列基线',
          description: '最简单的模型把每个位置看成独立同分布，因此联合分布是各边缘分布的乘积；它无法表达相邻项之间的相关性。',
          formula: String.raw`p(x_1,\ldots,x_N)=\prod_{n=1}^{N}p(x_n)`,
        },
        {
          title: '一阶马尔可夫链',
          description: '给定前一个变量后，当前变量与更早历史条件独立，使链式法则中的每个条件项只保留一个前驱。',
          formula: String.raw`p(x_{1:N})=p(x_1)\prod_{n=2}^{N}p(x_n\mid x_{n-1})`,
        },
        {
          title: '高阶依赖与参数代价',
          description: 'M 阶模型保留最近 M 个变量。若每个变量有 K 个状态，平稳条件概率表需要约 K^M(K−1) 个自由参数，随阶数指数增长。',
          formula: String.raw`p(x_n\mid x_{1:n-1})=p(x_n\mid x_{n-M:n-1})`,
        },
        {
          title: '隐状态空间模型',
          description: '不可见状态 z 形成一阶马尔可夫链，每个观测 x 只由同一时刻的状态生成；状态承担“预测未来所需的信息摘要”。',
          formula: String.raw`p(\mathbf x,\mathbf z)=p(z_1)\prod_{n=2}^{N}p(z_n\mid z_{n-1})\prod_{n=1}^{N}p(x_n\mid z_n)`,
        },
        {
          title: '观测序列通常不马尔可夫',
          description: '边缘化隐状态后，历史观测通过过滤后验 p(z_n|x1:n) 影响未来；最后若干个观测通常不能替代这个后验。',
        },
        {
          title: 'HMM 与线性动态系统',
          description: '隐状态离散时得到隐马尔可夫模型（HMM）；隐状态和观测均为线性高斯条件分布时得到线性动态系统，也称卡尔曼滤波模型。',
        },
      ]}
      learningObjectives={[
        '能从链式法则推导一阶马尔可夫序列的联合分布分解。',
        '能说明高阶离散马尔可夫模型为何遭遇指数级参数增长。',
        '能区分隐状态链的马尔可夫性质与观测序列边缘分布的非马尔可夫性。',
      ]}
      coreIntuition="马尔可夫性质并不是“模型忘掉了历史”，而是当前状态已经包含预测未来所需的历史信息；当这个充分摘要不可直接观测时，就把它建模成隐状态。"
      commonMistakes={[
        '认为一阶马尔可夫假设意味着变量完全没有长期相关；长期影响仍可沿状态链逐步传播。',
        '把隐状态链的一阶马尔可夫性质错误地转移给观测序列；边缘化隐状态会重新引入对观测历史的依赖。',
        '把前向—后向算法当成 §11.3 已推导的内容；本节只建立序列与隐状态模型，具体推断算法属于后续扩展。',
      ]}
      whyCards={[
        {
          question: '为什么不直接提高马尔可夫阶数？',
          answer: '离散状态的历史组合数按 K^M 增长。隐状态可以用固定维度的表示概括历史，在表达能力与参数规模之间取得更好的平衡。',
        },
        {
          question: '为什么观测序列通常不是一阶马尔可夫？',
          answer: '同一个最新观测可能来自不同的隐状态后验，而这个后验取决于更早的全部观测；因此预测下一个观测不能只看最后一个观测。',
        },
      ]}
      counterexamples={[
        '天气状态今天只依赖昨天，但一把雨伞不足以确定天气；连续多天的雨伞记录会改变今天的天气后验——说明观测并不自动继承状态的一阶马尔可夫性。',
        '把文本直接建成高阶离散马尔可夫链时，词表大小 K 与阶数 M 共同造成 K^M 级历史组合——说明“多记几步”并非可扩展方案。',
      ]}
      bishopMapping={{
        chapter: 'Ch 11',
        section: '11.3',
        pages: '§11.3, pp. 349–353',
        textbookSubsections: [
          "11.3 Sequence Models",
          "11.3.1 Hidden variables",
        ],
        formulas: [
          'p(x1:N)=p(x1)∏n=2:N p(xn|x(n−1))',
          'z(n+1) ⟂ z(n−1) | z(n)',
          'p(x1:N,z1:N)=p(z1)∏n=2:N p(zn|z(n−1))∏n=1:N p(xn|zn)',
        ],
        algorithms: ['隐状态过滤（教学扩展；教材本节建立模型但未推导前向—后向算法）'],
        exercises: [
          '从链式法则写出一阶和二阶马尔可夫分解。',
          '计算 K 状态、M 阶离散模型的自由参数量。',
          '解释边缘观测序列为何通常不满足有限阶马尔可夫性质。',
        ],
      }}
      interactiveDemo={<SequenceModelsLab />}
      extraContent={(
        <div className="space-y-10">
          <DerivationStepper title="分步推导：隐状态为何不让观测自动变成马尔可夫链" steps={[
            { label: '状态链假设', formula: String.raw`p(z_{1:N})=p(z_1)\prod_{n=2}^{N}p(z_n\mid z_{n-1})`, explanation: '模型只在隐状态层明确施加一阶马尔可夫性质。' },
            { label: '连接观测', formula: String.raw`p(x_{1:N},z_{1:N})=p(z_{1:N})\prod_{n=1}^{N}p(x_n\mid z_n)`, explanation: '给定状态后，每个观测只依赖对应时刻的隐状态。' },
            { label: '边缘化隐状态', formula: String.raw`p(x_{1:N})=\sum_{z_{1:N}}p(x_{1:N},z_{1:N})`, explanation: '看不见 z 时必须对全部状态路径求和，状态不确定性把不同时刻的观测重新耦合起来。' },
            { label: '预测未来', formula: String.raw`p(x_{n+1}\mid x_{1:n})=\sum_{z_n,z_{n+1}}p(x_{n+1}\mid z_{n+1})p(z_{n+1}\mid z_n)p(z_n\mid x_{1:n})`, explanation: '全部历史通过过滤后验 p(z_n|x1:n) 进入预测；一般不能把它替换成只依赖最后有限个观测的分布。' },
          ]} />
          <ExercisePanel exerciseSetId="chapter08-sequence-models" exercises={chapter08SequenceModelsExercises} />
        </div>
      )}
    />
  );
}
