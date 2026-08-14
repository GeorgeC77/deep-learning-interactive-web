import BishopSectionPage from '@/components/BishopSectionPage';
import GaussianMixtureLab from '@/components/demos/GaussianMixtureLab';
import DerivationStepper from '@/components/DerivationStepper';
import ExercisePanel from '@/components/ExercisePanel';
import { chapter12GmmExercises } from '@/course/chapter12Exercises';
import { ChartNoAxesCombined } from 'lucide-react';

export default function Ch12MixturesOfGaussiansPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch12/mixtures-of-gaussians"
      heroIcon={<ChartNoAxesCombined className="h-9 w-9 text-blue-600" />}
      summary={"高斯混合把每个样本的分量编号写成离散 1-of-K 隐变量。边缘化该编号得到加权高斯和；反过来条件化于观测，则得到衡量软归属的后验责任度。"}
      concepts={[
        { title: '混合密度', description: '非负混合系数之和为 1，每个分量拥有自己的均值与协方差。', formula: String.raw`p(\mathbf x)=\sum_{k=1}^{K}\pi_k\,\mathcal N(\mathbf x\mid\boldsymbol\mu_k,\boldsymbol\Sigma_k),\quad \sum_k\pi_k=1` },
        { title: '离散隐变量', description: 'z 用 1-of-K 编码表示生成该样本的分量，p(zₖ=1)=πₖ，p(x|zₖ=1) 是第 k 个高斯。', formula: String.raw`p(\mathbf z)=\prod_k\pi_k^{z_k},\qquad p(\mathbf x\mid\mathbf z)=\prod_k\mathcal N_k(\mathbf x)^{z_k}` },
        { title: '责任度', description: 'Bayes 规则把先验权重与局部似然相乘再归一化；γ(zₖ) 是观测 x 后属于分量 k 的概率。', formula: String.raw`\gamma(z_k)=\frac{\pi_k\mathcal N(\mathbf x\mid\boldsymbol\mu_k,\boldsymbol\Sigma_k)}{\sum_j\pi_j\mathcal N(\mathbf x\mid\boldsymbol\mu_j,\boldsymbol\Sigma_j)}` },
        { title: '对数似然', description: '数据独立时，对数似然是 log-sum 之和；分量求和位于对数内部，参数彼此耦合，不能直接分别求闭式最大值。', formula: String.raw`\ell(\boldsymbol\theta)=\sum_{n=1}^{N}\ln\!\left\{\sum_k\pi_k\mathcal N(\mathbf x_n\mid\boldsymbol\mu_k,\boldsymbol\Sigma_k)\right\}` },
        { title: '似然奇异性', description: '某个分量可塌缩到单一样本并令协方差行列式趋零，使该点的密度和总似然无界；实践中需要协方差 floor 或先验。' },
        { title: '不可识别性与复杂度', description: '置换 K 个分量标签不改变边缘密度，产生 K! 个等价参数解；过多分量还可能带来过拟合与较高计算成本。' },
      ]}
      learningObjectives={[
        '能从 p(z) 与 p(x|z) 边缘化得到 GMM 密度。',
        '能用 Bayes 规则计算责任度，并区分先验、似然与后验。',
        '能解释最大似然中的 log-sum 耦合、奇异点和标签不可识别性。',
      ]}
      coreIntuition={"K-means 只说“这个点属于第 k 类”；GMM 还说“以多大概率属于每一类”，并用每个分量的形状表达方向、尺度与重叠不确定性。"}
      commonMistakes={[
        '只比较样本到均值的距离，忘记责任度还取决于混合权重与协方差。',
        '把 Σₖ log pₖ(x) 当成 log Σₖpₖ(x)；混合似然的求和在对数内部。',
        '把标签交换产生的等价解当成估计失败；应使用标签不变的比较指标。',
      ]}
      whyCards={[
        { question: '为什么引入 z，最后又把它求和消掉？', answer: 'z 让生成过程和条件分布变得简单；边缘化 z 得到灵活密度，条件化 z 则让后续 EM 更新可分解。' },
        { question: '为什么最近的均值不一定责任度最大？', answer: '后验同时考虑分量先验和局部密度；窄分量的峰更高，权重更大的分量也有先验优势。' },
      ]}
      counterexamples={[
        '两个分量的均值到 x 等距，但权重为 0.9 与 0.1 时，后验并非各 0.5——说明距离不是全部。',
        '交换两个分量的全部参数后 p(x) 完全不变——说明参数标签本身没有可识别语义。',
      ]}
      bishopMapping={{
        chapter: 'Ch 15',
        section: '15.2',
        pages: '§15.2, pp. 466–474',
        textbookSubsections: ["15.2 Mixtures of Gaussians", "15.2.1 Likelihood function", "15.2.2 Maximum likelihood"],
        formulas: ['GMM 密度 (15.6)', '隐变量联合分解 (15.9–15.11)', '责任度', '观测数据对数似然'],
        algorithms: ['Bayes 责任度归一化', '最大似然问题诊断'],
        exercises: ['归一化两个分量的责任度。', '计算混合均值。', '解释协方差塌缩奇异点。'],
      }}
      interactiveDemo={<GaussianMixtureLab />}
      extraContent={
        <div className="space-y-10">
          <DerivationStepper title="分步推导：从隐变量联合分布到责任度" steps={[
            { label: '写出分量先验', formula: String.raw`p(z_k=1)=\pi_k,\qquad \pi_k\ge0,\quad\sum_k\pi_k=1`, explanation: '1-of-K 变量恰有一个元素为 1，混合权重就是选中每个分量的先验概率。' },
            { label: '条件生成观测', formula: String.raw`p(\mathbf x\mid z_k=1)=\mathcal N(\mathbf x\mid\boldsymbol\mu_k,\boldsymbol\Sigma_k)`, explanation: '一旦知道分量编号，复杂的混合就退化成一个普通高斯。' },
            { label: '边缘化隐变量', formula: String.raw`p(\mathbf x)=\sum_k p(z_k=1)p(\mathbf x\mid z_k=1)=\sum_k\pi_k\mathcal N_k(\mathbf x)`, explanation: '对 K 个互斥隐状态求和，得到观测空间里的混合密度。' },
            { label: 'Bayes 反推归属', formula: String.raw`p(z_k=1\mid\mathbf x)=\frac{\pi_k\mathcal N_k(\mathbf x)}{\sum_j\pi_j\mathcal N_j(\mathbf x)}`, explanation: '分母正是混合密度，保证所有责任度非负且和为 1；它们会成为 EM 的软计数。' },
          ]} />
          <ExercisePanel exerciseSetId="chapter12-gmm" exercises={chapter12GmmExercises} />
        </div>
      }
    />
  );
}
