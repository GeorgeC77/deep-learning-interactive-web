import BishopSectionPage from '@/components/BishopSectionPage';
import EMELBOLab from '@/components/demos/EMELBOLab';
import DerivationStepper from '@/components/DerivationStepper';
import ExercisePanel from '@/components/ExercisePanel';
import { chapter12EmExercises } from '@/course/chapter12Exercises';
import { GitBranch } from 'lucide-react';

export default function Ch12ExpectationMaximizationPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch12/expectation-maximization"
      heroIcon={<GitBranch className="h-9 w-9 text-blue-600" />}
      summary={"EM 把含隐变量的最大似然拆成两步：E-step 用当前参数计算隐变量后验，M-step 用这些软计数更新参数。GMM 给出闭式更新，K-means 是共享球形方差趋零时的硬分配极限。"}
      concepts={[
        { title: '完整数据视角', description: '若观测 X 与隐变量 Z 都已知，完整数据对数似然通常按样本和分量分解；困难来自 Z 未观测。', formula: String.raw`\ln p(\mathbf X,\mathbf Z\mid\boldsymbol\theta)=\sum_{n,k}z_{nk}\{\ln\pi_k+\ln\mathcal N(\mathbf x_n\mid\boldsymbol\mu_k,\boldsymbol\Sigma_k)\}` },
        { title: 'E-step：软计数', description: '固定旧参数，计算每个样本属于每个分量的后验责任度。', formula: String.raw`\gamma_{nk}=\frac{\pi_k\mathcal N(\mathbf x_n\mid\boldsymbol\mu_k,\boldsymbol\Sigma_k)}{\sum_j\pi_j\mathcal N(\mathbf x_n\mid\boldsymbol\mu_j,\boldsymbol\Sigma_j)}` },
        { title: 'M-step：有效样本数', description: 'Nₖ=Σₙγₙₖ 是分量 k 的软样本数；混合权重等于它占总样本数的比例。', formula: String.raw`N_k=\sum_n\gamma_{nk},\qquad \pi_k^{\mathrm{new}}=\frac{N_k}{N}` },
        { title: '均值与协方差更新', description: '用责任度作为权重计算每个分量的均值与二阶中心矩。', formula: String.raw`\boldsymbol\mu_k^{\mathrm{new}}=\frac1{N_k}\sum_n\gamma_{nk}\mathbf x_n,\quad \boldsymbol\Sigma_k^{\mathrm{new}}=\frac1{N_k}\sum_n\gamma_{nk}(\mathbf x_n-\boldsymbol\mu_k)(\mathbf x_n-\boldsymbol\mu_k)^\top` },
        { title: '与 K-means 的关系', description: '若各分量权重相同、协方差都为 εI，责任度与 exp(−距离²/2ε) 成正比；ε→0 时只剩最近质心，软分配变成硬分配。' },
        { title: 'Bernoulli 混合', description: '对二元向量把高斯分量换成独立 Bernoulli 乘积；E-step 仍算责任度，M-step 更新为责任度加权的每维取 1 频率。' },
      ]}
      learningObjectives={[
        '能按 E-step→M-step 写出 GMM-EM 的一次完整迭代。',
        '能从责任度加权目标推出 π、μ 与 Σ 的更新。',
        '能说明 K-means 的小方差极限，并把 EM 思路迁移到 Bernoulli 混合。',
      ]}
      coreIntuition={"E-step 先用当前模型给每个样本分配一张“软选票”，M-step 再按这些选票重算每个分量。旧选票不能和更新后的参数混用；完成 M-step 后必须重新投票。"}
      commonMistakes={[
        '在 M-step 更新参数后继续沿用旧责任度做下一次 M-step；责任度属于 θ_old，参数改变后必须重新 E-step。',
        '认为似然不下降就等于找到全局最优；EM 仍依赖初始化，并可能到达局部极值或奇异解。',
        '把一般 GMM 的椭圆协方差也直接等同于 K-means；硬最近质心极限需要共享球形小方差等条件。',
      ]}
      whyCards={[
        { question: '为什么不直接对观测似然求导？', answer: '对数内部含分量求和，参数相互耦合；引入隐变量后，E-step 给出软分量身份，M-step 就变成加权的熟悉估计。' },
        { question: '为什么需要多起点？', answer: 'EM 只沿当前下界方向改进，坏初始化可能造成分量重叠、空分量或落入较差局部极值。' },
      ]}
      counterexamples={[
        '两个初始均值放在同一数据团附近，EM 可能让它们竞争同一簇而漏掉远处簇——说明初始化会影响结果。',
        '若一个 GMM 分量协方差可无限缩小到单点，似然可以无界上升——说明“似然增加”本身不保证有意义的解。',
      ]}
      bishopMapping={{
        chapter: 'Ch 15',
        section: '15.3',
        pages: '§15.3, pp. 474–485',
        textbookSubsections: ["15.3 Expectation–Maximization Algorithm", "15.3.1 Gaussian mixtures", "15.3.2 Relation to K-means", "15.3.3 Mixtures of Bernoulli distributions"],
        formulas: ['责任度 (15.35)', '有效样本数与 GMM M-step', '小方差硬分配极限', 'Bernoulli 混合更新'],
        algorithms: ['Algorithm 15.2 GMM 的 EM'],
        exercises: ['判断标准 E/M 顺序。', '计算有效样本数与混合权重。', '连接小方差 GMM、K-means 与 Bernoulli 混合。'],
      }}
      extraContent={
        <div className="space-y-10">
          <EMELBOLab />
          <DerivationStepper title="分步推导：GMM 的 M-step 为什么是责任度加权统计量" steps={[
            { label: '固定 E-step 责任度', formula: String.raw`Q(\boldsymbol\theta)=\sum_{n,k}\gamma_{nk}\{\ln\pi_k+\ln\mathcal N(\mathbf x_n\mid\boldsymbol\mu_k,\boldsymbol\Sigma_k)\}`, explanation: 'E-step 后 γₙₖ 视为常数，M-step 最大化期望完整数据对数似然。' },
            { label: '对均值求导', formula: String.raw`\frac{\partial Q}{\partial\boldsymbol\mu_k}=\boldsymbol\Sigma_k^{-1}\sum_n\gamma_{nk}(\mathbf x_n-\boldsymbol\mu_k)=\mathbf0`, explanation: '每个样本对分量 k 的拉力按责任度缩放；责任度越大，影响越强。' },
            { label: '得到加权均值与协方差', formula: String.raw`\boldsymbol\mu_k=\frac{\sum_n\gamma_{nk}\mathbf x_n}{N_k},\qquad \boldsymbol\Sigma_k=\frac{\sum_n\gamma_{nk}(\mathbf x_n-\boldsymbol\mu_k)(\mathbf x_n-\boldsymbol\mu_k)^\top}{N_k}`, explanation: '它们正是软分配下的一阶与二阶充分统计量；Nₖ=Σₙγₙₖ。' },
            { label: '在单纯形约束下更新权重', formula: String.raw`\mathcal J=\sum_k N_k\ln\pi_k+\lambda(\sum_k\pi_k-1)\quad\Longrightarrow\quad\pi_k=\frac{N_k}{N}`, explanation: '拉格朗日乘子强制权重和为 1。完成 M-step 后参数已变，下一轮必须重新计算责任度。' },
          ]} />
          <ExercisePanel exerciseSetId="chapter12-em" exercises={chapter12EmExercises} />
        </div>
      }
    />
  );
}
