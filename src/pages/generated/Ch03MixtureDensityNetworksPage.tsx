import BishopSectionPage from '@/components/BishopSectionPage';
import DerivationStepper from '@/components/DerivationStepper';
import MDNLab from '@/components/demos/MDNLab';
import ExercisePanel from '@/components/ExercisePanel';
import { chapter03MdnExercises } from '@/course/chapter03Exercises';
import { GitBranch } from 'lucide-react';

export default function Ch03MixtureDensityNetworksPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch03/mixture-density-networks"
      heroIcon={<GitBranch className="w-9 h-9 text-blue-600" />}
      summary="混合密度网络（MDN）让神经网络输出条件混合分布的参数，从而描述一对多、异方差和多峰预测。它不是只给出一条回归曲线，而是学习完整的 p(t|x)。"
      concepts={[
        {
          title: '条件混合分布',
          description: '网络同时预测混合权重 πₖ(x)、均值 μₖ(x) 与尺度 σₖ(x)。权重依赖输入，因此不同 x 可以具有不同的模态数量、位置和相对概率。',
          formula: String.raw`p(t\mid x)=\sum_{k=1}^{K}\pi_k(x)\,\mathcal N\!\left(t\mid\mu_k(x),\sigma_k^2(x)\right)`,
        },
        {
          title: '机器人逆运动学示例',
          description: '同一末端位置可能对应多个关节配置。平方误差回归得到的是条件均值，它可能落在两个可行姿态之间；MDN 能同时保留多个候选解及其概率。',
        },
        {
          title: '合法参数与似然训练',
          description: '常用 softmax 保证 πₖ≥0 且和为 1，用 exp 或 softplus 保证 σₖ>0。训练时最小化条件负对数似然，并在实现中用 log-sum-exp 防止小密度下溢。',
          formula: String.raw`E=-\sum_n\log\!\left[\sum_k\pi_k(x_n)\,\mathcal N(t_n\mid\mu_k(x_n),\sigma_k^2(x_n))\right]`,
        },
        {
          title: '条件均值、模态与采样',
          description: '条件均值适合平方误差决策，却不一定是高密度样本；模态给出局部最可能解；先抽取分量再从该分量采样，可生成服从预测分布的候选结果。',
          formula: String.raw`\mathbb E[t\mid x]=\sum_k\pi_k(x)\mu_k(x)`,
        },
      ]}
      learningObjectives={[
        '解释单值平方误差回归为何会平均掉多峰解',
        '用 softmax 与正值变换构造合法的 MDN 参数',
        '写出并稳定计算条件混合分布的负对数似然',
        '区分条件均值、密度模态和预测采样的决策含义',
      ]}
      coreIntuition="普通回归回答“平均答案是什么”，MDN 回答“有哪些可能答案，各自多可能”。当一个输入确实对应多个合理输出时，完整的条件分布比单个点预测保留了更多决策信息。"
      commonMistakes={[
        '把条件均值当作密度最高的输出——对对称双峰分布，均值甚至可能位于低密度谷底',
        '直接使用无约束网络输出作为混合权重或标准差，得到负尺度或权重和不为 1 的非法分布',
        '先在线性域计算极小高斯密度之和再取对数，导致数值下溢；应使用对数域稳定聚合',
        '把分量编号理解为跨样本固定类别——混合分量存在置换对称性，编号本身没有语义保证',
      ]}
      whyCards={[
        {
          question: '为什么逆问题常需要条件密度而不是单点回归？',
          answer: '逆映射可能是一对多的。平方误差最优点是条件均值，可能把多个可行解平均成不可行输出；条件密度保留各个模态，允许按风险选择或采样。',
        },
        {
          question: '为什么 MDN 训练要使用 log-sum-exp？',
          answer: '远离分量均值时，各高斯密度可能小到浮点数下溢。把加权密度写到对数域并先减最大值，可以保持负对数似然和梯度稳定。',
        },
      ]}
      counterexamples={[
        '两个等权窄高斯位于 -2 和 2 时，条件均值为 0，但 0 附近密度很低——说明“均值”不等于“典型解”。',
        '若直接把线性输出 -0.3 当作标准差，高斯密度便不合法——说明输出约束是概率模型的一部分。',
      ]}
      bishopMapping={{
        chapter: 'Ch 6',
        section: '6.5',
        pages: '§6.5, pp. 198–203',
        textbookSubsections: [
          '6.5 Mixture Density Networks',
          '6.5.1 Robot kinematics example',
          '6.5.2 Conditional mixture distributions',
          '6.5.3 Gradient optimization',
          '6.5.4 Predictive distribution',
        ],
        formulas: [
          'p(t|x) = Σₖ πₖ(x)N(t|μₖ(x),σₖ²(x))',
          'Gaussian normalization 1/√(2πσ²)',
          'conditional negative log-likelihood',
          'E[t|x] = Σₖ πₖ(x)μₖ(x)',
        ],
        algorithms: ['log-sum-exp likelihood training', 'ancestral mixture sampling'],
        exercises: [
          '计算等权双峰分布的条件均值并判断它是否位于模态',
          '说明 softmax 与 softplus 分别保证了哪一项概率约束',
          '写出先抽分量再抽高斯样本的两步预测采样流程',
        ],
      }}
      demo={{
        title: '两个高斯分量的混合密度',
        label: '混合系数 π₁',
        param: 0.5,
        min: 0,
        max: 1,
        step: 0.05,
        compute: (pi) => {
          const norm = 1 / Math.sqrt(2 * Math.PI);
          const value = norm * (pi + (1 - pi) * Math.exp(-2));
          return {
            label: 'p(t=0)',
            value,
            display: String.raw`p(0)=\frac{${pi.toFixed(2)}+${(1 - pi).toFixed(2)}e^{-2}}{\sqrt{2\pi}}=${value.toFixed(4)}`,
          };
        },
        formula: String.raw`p(0)=\frac{\pi_1+\pi_2e^{-2}}{\sqrt{2\pi}}`,
      }}
      interactiveDemo={<MDNLab />}
      extraContent={
        <div className="space-y-10">
          <DerivationStepper
            title="分步构造：从网络输出到合法混合密度"
            steps={[
              {
                label: '无约束输出',
                formula: String.raw`a_k(x),\quad m_k(x),\quad s_k(x)\in\mathbb R`,
                explanation: '网络先输出任意实数 logits、位置和尺度参数。',
              },
              {
                label: '施加约束',
                formula: String.raw`\pi_k=\operatorname{softmax}(a)_k,\quad \mu_k=m_k,\quad \sigma_k=\operatorname{softplus}(s_k)+\varepsilon`,
                explanation: 'softmax 将权重放到概率单纯形，softplus 保证尺度严格为正。',
              },
              {
                label: '组成密度',
                formula: String.raw`p(t\mid x)=\sum_k\pi_k\mathcal N(t\mid\mu_k,\sigma_k^2)`,
                explanation: '合法权重与归一化分量的加权和仍是合法概率密度。',
              },
              {
                label: '优化似然',
                formula: String.raw`E=-\sum_n\operatorname{logsumexp}_k\!\left(\log\pi_{nk}+\log\mathcal N_{nk}\right)`,
                explanation: '在对数域聚合分量，避免直接求和极小密度造成下溢。',
              },
            ]}
          />
          <ExercisePanel exerciseSetId="chapter03-mdn" exercises={chapter03MdnExercises} />
        </div>
      }
    />
  );
}
