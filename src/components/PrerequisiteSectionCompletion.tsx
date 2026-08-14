import DerivationStepper from '@/components/DerivationStepper';
import ExercisePanel, { type LearningExercise } from '@/components/ExercisePanel';
import SectionMetadata from '@/components/SectionMetadata';
import {
  prerequisiteChapter02BayesianExercises,
  prerequisiteChapter02DensitiesExercises,
  prerequisiteChapter02GaussianExercises,
  prerequisiteChapter02InformationExercises,
  prerequisiteChapter02RulesExercises,
  prerequisiteChapter02TransformationExercises,
} from '@/course/prerequisiteChapter02Exercises';
import {
  prerequisiteChapter03DiscreteExercises,
  prerequisiteChapter03ExponentialExercises,
  prerequisiteChapter03MvGaussianExercises,
  prerequisiteChapter03NonparametricExercises,
  prerequisiteChapter03PeriodicExercises,
} from '@/course/prerequisiteChapter03Exercises';

type DerivationStep = { label: string; formula: string; explanation: string };

export type PrerequisiteSectionKey =
  | 'rules' | 'densities' | 'gaussian' | 'transformation' | 'information' | 'bayesian'
  | 'discrete' | 'mvgaussian' | 'periodic' | 'exponential' | 'nonparametric';

type CompletionConfig = {
  chapter: string;
  section: string;
  pages: string;
  textbookSections: string[];
  learningObjectives: string[];
  coreIntuition: string;
  commonMistakes: string[];
  derivationTitle: string;
  derivationSteps: DerivationStep[];
  exerciseSetId: string;
  exerciseDescription: string;
  exercises: LearningExercise[];
};

const completionConfigs: Record<PrerequisiteSectionKey, CompletionConfig> = {
  rules: {
    chapter: 'Ch 2', section: '2.1', pages: 'pp. 25–32',
    textbookSections: ['2.1.1 医学筛查', '2.1.2 和规则与积规则', '2.1.3 贝叶斯定理', '2.1.4 筛查问题再讨论', '2.1.5 先验与后验', '2.1.6 独立性'],
    learningObjectives: ['用和规则与积规则完成边缘化和条件分解。', '从两条基本规则推导贝叶斯定理并解释每一项。', '用自然频数检查低先验筛查问题，避免基础概率谬误。'],
    coreIntuition: '贝叶斯更新不是把检测准确率直接当作患病概率，而是在所有能产生阳性结果的原因之间重新分配概率质量。',
    commonMistakes: ['把 p(阳性|患病) 与 p(患病|阳性) 互换。', '忽略先验患病率，只关注灵敏度。', '把互斥与独立混为一谈。'],
    derivationTitle: '分步推导：医学筛查中的贝叶斯后验',
    derivationSteps: [
      { label: '定义事件', formula: String.raw`p(C)=0.01,\quad p(T\mid C)=0.90,\quad p(T\mid \neg C)=0.03`, explanation: 'C 表示患病，T 表示检测阳性；先区分先验、灵敏度与假阳性率。' },
      { label: '真阳性质量', formula: String.raw`p(T,C)=p(T\mid C)p(C)=0.90\times0.01=0.009`, explanation: '积规则把条件概率与先验组合为联合概率。' },
      { label: '全部阳性质量', formula: String.raw`p(T)=0.009+0.03\times0.99=0.0387`, explanation: '和规则把真阳性与假阳性两个互斥来源相加。' },
      { label: '归一化为后验', formula: String.raw`p(C\mid T)=\frac{0.009}{0.0387}\approx0.233`, explanation: '阳性样本中约 23.3% 真正患病，而不是 90%。' },
    ],
    exerciseSetId: 'prerequisite-ch02-rules', exerciseDescription: '从边缘化、独立性到低先验条件下的贝叶斯更新。', exercises: prerequisiteChapter02RulesExercises,
  },
  densities: {
    chapter: 'Ch 2', section: '2.2', pages: 'pp. 32–36',
    textbookSections: ['2.2.1 常见概率密度', '2.2.2 期望与协方差'],
    learningObjectives: ['区分概率密度值与区间概率。', '用积分计算归一化、期望、方差与协方差。', '说明零协方差为何一般不足以推出独立。'],
    coreIntuition: '密度是“每单位长度的概率浓度”；只有乘上微小宽度并积分后，才得到无量纲的概率。',
    commonMistakes: ['把 p(x) 当作连续变量恰好等于 x 的概率。', '认为密度值不能超过 1。', '由零协方差直接断言任意变量独立。'],
    derivationTitle: '分步推导：从密度得到均值与协方差',
    derivationSteps: [
      { label: '概率质量', formula: String.raw`P(a\le X\le b)=\int_a^b p(x)\,dx`, explanation: '区间概率是密度曲线下的面积。' },
      { label: '函数的期望', formula: String.raw`\mathbb E[f(X)]=\int f(x)p(x)\,dx`, explanation: '用密度作为权重，对函数值做连续加权平均。' },
      { label: '中心化', formula: String.raw`\operatorname{cov}(X,Y)=\mathbb E[(X-\mu_X)(Y-\mu_Y)]`, explanation: '先减去均值，协方差才只反映共同波动。' },
      { label: '展开形式', formula: String.raw`\operatorname{cov}(X,Y)=\mathbb E[XY]-\mathbb E[X]\mathbb E[Y]`, explanation: '利用期望线性展开，得到便于计算的等价形式。' },
    ],
    exerciseSetId: 'prerequisite-ch02-densities', exerciseDescription: '检查密度、期望与协方差的概念边界。', exercises: prerequisiteChapter02DensitiesExercises,
  },
  gaussian: {
    chapter: 'Ch 2', section: '2.3', pages: 'pp. 36–42',
    textbookSections: ['2.3.1 均值与方差', '2.3.2 似然函数', '2.3.3 最大似然方差的偏差', '2.3.4 线性回归的概率视角'],
    learningObjectives: ['解释高斯均值和方差对密度形状的作用。', '从独立样本的对数似然推导均值与方差估计。', '连接高斯观测噪声、平方误差与线性回归。'],
    coreIntuition: '高斯负对数似然就是按噪声尺度归一化的平方距离，因此最小二乘可以理解为一种概率模型的最大似然学习。',
    commonMistakes: ['把标准差 σ 与方差 σ² 混用。', '忘记独立同分布假设才允许似然写成乘积。', '把有偏的 1/N 方差估计误称为无偏估计。'],
    derivationTitle: '分步推导：高斯均值的最大似然估计',
    derivationSteps: [
      { label: '样本似然', formula: String.raw`p(\mathcal D\mid\mu,\sigma^2)=\prod_{n=1}^N\mathcal N(x_n\mid\mu,\sigma^2)`, explanation: '独立样本使联合似然分解为单点密度的乘积。' },
      { label: '取对数', formula: String.raw`\ell(\mu)=\text{const}-\frac{1}{2\sigma^2}\sum_n(x_n-\mu)^2`, explanation: '对数把乘积变成求和，并保留最大值位置。' },
      { label: '求导', formula: String.raw`\frac{\partial\ell}{\partial\mu}=\frac{1}{\sigma^2}\sum_n(x_n-\mu)=0`, explanation: '极大似然点满足所有带符号残差之和为 0。' },
      { label: '得到估计', formula: String.raw`\mu_{\mathrm{ML}}=\frac1N\sum_{n=1}^N x_n`, explanation: '解一阶条件得到样本均值；这也最小化平方误差。' },
    ],
    exerciseSetId: 'prerequisite-ch02-gaussian', exerciseDescription: '从曲线形状到最大似然与估计偏差。', exercises: prerequisiteChapter02GaussianExercises,
  },
  transformation: {
    chapter: 'Ch 2', section: '2.4', pages: 'pp. 42–46',
    textbookSections: ['2.4 密度变换', '2.4.1 多元分布'],
    learningObjectives: ['从概率质量守恒推导一元变量替换公式。', '解释导数绝对值与 Jacobian 行列式的几何意义。', '识别非单调变换需要汇总多个逆像分支。'],
    coreIntuition: '变换拉伸空间时，同一概率质量被摊到更大体积，密度必须按局部体积伸缩的倒数补偿。',
    commonMistakes: ['遗漏 Jacobian 的绝对值。', '混淆 ∂x/∂y 与 ∂y/∂x。', '对多对一变换只计算一个逆像。'],
    derivationTitle: '分步推导：一元密度的变量替换',
    derivationSteps: [
      { label: '质量守恒', formula: String.raw`p_X(x)\,|dx|=p_Y(y)\,|dy|`, explanation: '对应微小区间携带相同概率质量。' },
      { label: '除以新宽度', formula: String.raw`p_Y(y)=p_X(x)\left|\frac{dx}{dy}\right|`, explanation: '密度按逆变换的局部长度缩放进行补偿。' },
      { label: '代入逆变换', formula: String.raw`p_Y(y)=p_X(g^{-1}(y))\left|\frac{d g^{-1}(y)}{dy}\right|`, explanation: '最终表达式必须只依赖新变量 y。' },
      { label: '线性检查', formula: String.raw`Y=aX+b\Rightarrow p_Y(y)=\frac1{|a|}p_X\!\left(\frac{y-b}{a}\right)`, explanation: '积分仍为 1；|a| 越大，密度越宽、峰值越低。' },
    ],
    exerciseSetId: 'prerequisite-ch02-transformation', exerciseDescription: '用守恒直觉检查一元、多元及多分支变换。', exercises: prerequisiteChapter02TransformationExercises,
  },
  information: {
    chapter: 'Ch 2', section: '2.5', pages: 'pp. 46–54',
    textbookSections: ['2.5.1 熵', '2.5.2 物理学视角', '2.5.3 微分熵', '2.5.4 最大熵', '2.5.5 KL 散度', '2.5.6 条件熵', '2.5.7 互信息'],
    learningObjectives: ['把熵解释为平均编码长度与不确定性。', '区分离散熵、微分熵、交叉熵和 KL 散度。', '用互信息判断两个随机变量是否独立。'],
    coreIntuition: '信息量由“结果有多意外”衡量；熵对这种惊讶取平均，KL 则衡量用错误分布编码数据多付出的平均代价。',
    commonMistakes: ['把 KL 散度当作对称距离。', '把微分熵也理解为必定非负。', '认为零协方差与零互信息等价。'],
    derivationTitle: '分步推导：互信息是联合分布的依赖度',
    derivationSteps: [
      { label: '联合与独立模型', formula: String.raw`p(x,y)\quad\text{vs.}\quad p(x)p(y)`, explanation: '若 X、Y 独立，这两个分布完全相同。' },
      { label: '定义为 KL', formula: String.raw`I(X;Y)=\mathrm{KL}\!\left(p(x,y)\,\|\,p(x)p(y)\right)`, explanation: '用 KL 衡量真实联合分布偏离独立模型的程度。' },
      { label: '展开期望', formula: String.raw`I(X;Y)=\mathbb E_{p(x,y)}\!\left[\log\frac{p(x,y)}{p(x)p(y)}\right]`, explanation: '比值表示观测一对 (x,y) 后，相比独立假设增加了多少信息。' },
      { label: '独立判据', formula: String.raw`I(X;Y)\ge0,\qquad I(X;Y)=0\iff p(x,y)=p(x)p(y)`, explanation: 'KL 的非负性给出互信息的非负性和精确独立判据。' },
    ],
    exerciseSetId: 'prerequisite-ch02-information', exerciseDescription: '从二元熵到 KL 非对称性与互信息。', exercises: prerequisiteChapter02InformationExercises,
  },
  bayesian: {
    chapter: 'Ch 2', section: '2.6', pages: 'pp. 54–58',
    textbookSections: ['2.6.1 模型参数', '2.6.2 正则化', '2.6.3 贝叶斯机器学习'],
    learningObjectives: ['区分最大似然、MAP 与完整贝叶斯推断。', '把正则化项解释为参数先验的负对数。', '用后验预测积分传播参数不确定性。'],
    coreIntuition: '参数不是必须被压缩成一个“最优数字”；贝叶斯方法保留一整个可信度分布，并在预测时对它加权平均。',
    commonMistakes: ['把先验理解为不能被数据改变的结论。', '混淆 MAP 点估计与后验分布。', '用训练数据反复选择先验却不检查泛化。'],
    derivationTitle: '分步推导：高斯先验为何对应 L2 正则化',
    derivationSteps: [
      { label: '后验目标', formula: String.raw`p(\mathbf w\mid\mathcal D)\propto p(\mathcal D\mid\mathbf w)p(\mathbf w)`, explanation: 'MAP 选择后验密度最大的参数。' },
      { label: '取负对数', formula: String.raw`-\log p(\mathbf w\mid\mathcal D)= -\log p(\mathcal D\mid\mathbf w)-\log p(\mathbf w)+C`, explanation: '乘积变成数据项与先验项之和。' },
      { label: '代入高斯先验', formula: String.raw`p(\mathbf w)=\mathcal N(\mathbf 0,\alpha^{-1}\mathbf I)\Rightarrow-\log p(\mathbf w)=\frac\alpha2\|\mathbf w\|_2^2+C`, explanation: '零均值各向同性高斯惩罚远离原点的大权重。' },
      { label: '得到正则目标', formula: String.raw`\mathbf w_{MAP}=\arg\min_{\mathbf w}\left[-\log p(\mathcal D\mid\mathbf w)+\frac\alpha2\|\mathbf w\|_2^2\right]`, explanation: 'L2 权重衰减就是该先验假设下的 MAP 优化。' },
    ],
    exerciseSetId: 'prerequisite-ch02-bayesian', exerciseDescription: '连接后验更新、MAP 正则化与后验预测。', exercises: prerequisiteChapter02BayesianExercises,
  },
  discrete: {
    chapter: 'Ch 3', section: '3.1', pages: 'pp. 66–70',
    textbookSections: ['3.1.1 Bernoulli 分布', '3.1.2 二项分布', '3.1.3 多项分布'],
    learningObjectives: ['写出 Bernoulli、Binomial 与 Multinomial 的概率质量函数。', '计算其均值、方差与最大似然参数。', '解释组合系数与概率单纯形约束。'],
    coreIntuition: 'Bernoulli 描述一次二元试验，Binomial 汇总多次试验的成功数，Multinomial 再把二元结果扩展到多个互斥类别。',
    commonMistakes: ['遗漏二项分布的组合系数。', '让类别概率之和不等于 1。', '把概率质量函数写成连续密度。'],
    derivationTitle: '分步推导：Bernoulli 参数的最大似然估计',
    derivationSteps: [
      { label: '写出似然', formula: String.raw`p(\mathcal D\mid\mu)=\prod_{n=1}^N\mu^{x_n}(1-\mu)^{1-x_n}`, explanation: '每个 xₙ 只取 0 或 1，指数选择对应概率。' },
      { label: '取对数', formula: String.raw`\ell(\mu)=\sum_n[x_n\log\mu+(1-x_n)\log(1-\mu)]`, explanation: '对数把独立样本的乘积变成求和。' },
      { label: '一阶条件', formula: String.raw`\frac{\partial\ell}{\partial\mu}=\frac{\sum_nx_n}{\mu}-\frac{N-\sum_nx_n}{1-\mu}=0`, explanation: '成功和失败的加权残差在最优点平衡。' },
      { label: '样本比例', formula: String.raw`\mu_{ML}=\frac1N\sum_{n=1}^N x_n`, explanation: 'Bernoulli 成功概率的最大似然估计就是观察到的成功比例。' },
    ],
    exerciseSetId: 'prerequisite-ch03-discrete', exerciseDescription: '从一次试验扩展到计数与多类别结果。', exercises: prerequisiteChapter03DiscreteExercises,
  },
  mvgaussian: {
    chapter: 'Ch 3', section: '3.2', pages: 'pp. 70–89',
    textbookSections: ['3.2.1 几何', '3.2.2 矩', '3.2.3 局限', '3.2.4 条件分布', '3.2.5 边缘分布', '3.2.6 高斯变量的贝叶斯定理', '3.2.7 最大似然', '3.2.8 顺序估计', '3.2.9 高斯混合'],
    learningObjectives: ['用协方差特征分解解释高斯等密度椭球。', '计算高斯的边缘分布与条件分布。', '说明单高斯的局限以及混合模型的表达优势。'],
    coreIntuition: '协方差矩阵同时编码每个方向的尺度和变量间的线性耦合；条件化利用已观测变量消除一部分不确定性。',
    commonMistakes: ['把协方差矩阵当作任意矩阵，忽略对称半正定约束。', '混淆边缘化与条件化。', '认为单个高斯可以表示任意多峰分布。'],
    derivationTitle: '分步推导：分块高斯的条件均值与协方差',
    derivationSteps: [
      { label: '分块参数', formula: String.raw`\boldsymbol\mu=\binom{\mu_a}{\mu_b},\quad\boldsymbol\Sigma=\begin{pmatrix}\Sigma_{aa}&\Sigma_{ab}\\\Sigma_{ba}&\Sigma_{bb}\end{pmatrix}`, explanation: '把待预测变量 a 与已观测变量 b 对应分块。' },
      { label: '观测校正', formula: String.raw`\mathbb E[\mathbf x_a\mid\mathbf x_b]=\mu_a+\Sigma_{ab}\Sigma_{bb}^{-1}(\mathbf x_b-\mu_b)`, explanation: 'b 偏离均值的部分按交叉协方差线性传递给 a。' },
      { label: '剩余不确定性', formula: String.raw`\operatorname{cov}[\mathbf x_a\mid\mathbf x_b]=\Sigma_{aa}-\Sigma_{ab}\Sigma_{bb}^{-1}\Sigma_{ba}`, explanation: 'Schur 补扣除可由 b 解释的方差。' },
      { label: '独立特例', formula: String.raw`\Sigma_{ab}=0\Rightarrow p(\mathbf x_a\mid\mathbf x_b)=p(\mathbf x_a)`, explanation: '联合高斯中零交叉协方差意味着独立，观测 b 不再改变 a。' },
    ],
    exerciseSetId: 'prerequisite-ch03-mvgaussian', exerciseDescription: '连接协方差几何、边缘化与条件化。', exercises: prerequisiteChapter03MvGaussianExercises,
  },
  periodic: {
    chapter: 'Ch 3', section: '3.3', pages: 'pp. 89–94',
    textbookSections: ['3.3 周期变量', '3.3.1 Von Mises 分布'],
    learningObjectives: ['解释普通高斯为何不适合跨越 0/2π 边界的角度。', '说明 Von Mises 平均方向与集中参数的作用。', '用单位向量计算圆周均值。'],
    coreIntuition: '圆上没有绝对的起点和终点；用 cos(θ−μ) 衡量方向接近程度，能自然保持 2π 周期性。',
    commonMistakes: ['直接对跨越 0° 的角度做算术平均。', '把集中参数 κ 当作方差本身。', 'κ=0 时仍声称存在唯一平均方向。'],
    derivationTitle: '分步推导：Von Mises 的高集中度近似',
    derivationSteps: [
      { label: '方向密度', formula: String.raw`p(\theta\mid\mu,\kappa)=\frac{\exp\{\kappa\cos(\theta-\mu)\}}{2\pi I_0(\kappa)}`, explanation: '余弦使密度在 θ 与 θ+2π 处完全一致。' },
      { label: '峰值附近', formula: String.raw`\delta=\theta-\mu,\qquad\cos\delta\approx1-\frac{\delta^2}{2}`, explanation: '集中度大时概率主要落在很小的角度偏差附近。' },
      { label: '代入指数', formula: String.raw`\exp\{\kappa\cos\delta\}\approx e^\kappa\exp\!\left(-\frac\kappa2\delta^2\right)`, explanation: '与 δ 上方差约为 1/κ 的高斯核同形。' },
      { label: '解释参数', formula: String.raw`\kappa\uparrow\Rightarrow\operatorname{Var}(\delta)\approx\kappa^{-1}\downarrow`, explanation: 'κ 越大，方向越集中；κ=0 时则退化为圆周均匀分布。' },
    ],
    exerciseSetId: 'prerequisite-ch03-periodic', exerciseDescription: '练习圆周边界、集中参数与方向均值。', exercises: prerequisiteChapter03PeriodicExercises,
  },
  exponential: {
    chapter: 'Ch 3', section: '3.4', pages: 'pp. 94–98',
    textbookSections: ['3.4 指数族', '3.4.1 充分统计量'],
    learningObjectives: ['把常见分布改写成指数族的自然参数形式。', '解释充分统计量对样本信息的压缩作用。', '由 log-partition 的导数得到矩。'],
    coreIntuition: '指数族把数据与参数的耦合集中到 ηᵀu(x)，因此归一化函数的导数可以系统地产生充分统计量的均值与协方差。',
    commonMistakes: ['混淆普通参数与自然参数。', '遗漏基准测度 h(x) 或归一化项。', '认为充分统计量必定只有一个标量。'],
    derivationTitle: '分步推导：log-partition 的导数为何给出期望',
    derivationSteps: [
      { label: '规范形式', formula: String.raw`p(x\mid\eta)=h(x)\exp\{\eta^\top u(x)-A(\eta)\}`, explanation: 'A(η) 负责让密度或质量函数归一化。' },
      { label: '归一化', formula: String.raw`1=\int h(x)\exp\{\eta^\top u(x)-A(\eta)\}\,dx`, explanation: '对任意合法 η，总概率必须为 1。' },
      { label: '关于参数求导', formula: String.raw`0=\int p(x\mid\eta)[u(x)-\nabla A(\eta)]\,dx`, explanation: '在正则条件下交换求导与积分，并把被积式识别为期望。' },
      { label: '矩恒等式', formula: String.raw`\nabla A(\eta)=\mathbb E[u(X)],\qquad\nabla^2A(\eta)=\operatorname{cov}[u(X)]`, explanation: '二阶导数是协方差，因此 A(η) 是凸函数。' },
    ],
    exerciseSetId: 'prerequisite-ch03-exponential', exerciseDescription: '从自然参数、充分统计量到 log-partition 的矩。', exercises: prerequisiteChapter03ExponentialExercises,
  },
  nonparametric: {
    chapter: 'Ch 3', section: '3.5', pages: 'pp. 98–105',
    textbookSections: ['3.5.1 直方图', '3.5.2 核密度估计', '3.5.3 最近邻'],
    learningObjectives: ['比较参数方法与直方图、KDE、kNN 的假设。', '解释带宽和邻居数引起的偏差—方差权衡。', '说明维度灾难为何使非参数估计需要更多数据。'],
    coreIntuition: '非参数并非“没有参数”，而是不预先固定有限维分布形状；模型复杂度会随数据量和带宽或邻居数共同变化。',
    commonMistakes: ['认为小带宽总能得到更准确的密度。', '忘记 KDE 中的 1/(Nh^D) 归一化。', '认为 kNN 在高维空间不受样本稀疏影响。'],
    derivationTitle: '分步推导：核密度估计的归一化与带宽',
    derivationSteps: [
      { label: '局部计数', formula: String.raw`p(x)\approx\frac{K}{NV}`, explanation: 'N 个样本中有 K 个落入 x 附近体积 V，局部频率除以体积近似密度。' },
      { label: '平滑计数', formula: String.raw`K\leadsto\sum_{n=1}^N K\!\left(\frac{x-x_n}{h}\right)`, explanation: '用连续核替代硬边界计数，避免直方图分箱边缘不连续。' },
      { label: 'KDE 公式', formula: String.raw`\hat p_h(x)=\frac1{Nh^D}\sum_{n=1}^N K\!\left(\frac{x-x_n}{h}\right)`, explanation: 'hᴰ 补偿 D 维空间的体积缩放，使积分保持为 1。' },
      { label: '权衡', formula: String.raw`h\downarrow:\ \text{低偏差/高方差},\qquad h\uparrow:\ \text{高偏差/低方差}`, explanation: '带宽决定观察邻域，需用验证数据或规则选择，而不是越小越好。' },
    ],
    exerciseSetId: 'prerequisite-ch03-nonparametric', exerciseDescription: '比较直方图、KDE 与 kNN 的平滑尺度。', exercises: prerequisiteChapter03NonparametricExercises,
  },
};

export default function PrerequisiteSectionCompletion({ sectionKey }: { sectionKey: PrerequisiteSectionKey }) {
  const config = completionConfigs[sectionKey];
  return (
    <>
      <DerivationStepper title={config.derivationTitle} steps={config.derivationSteps} />
      <ExercisePanel
        exerciseSetId={config.exerciseSetId}
        title="主动练习"
        description={config.exerciseDescription}
        exercises={config.exercises}
      />
      <SectionMetadata
        bishopChapter={config.chapter}
        bishopSection={`${config.section} · ${config.pages}`}
        textbookSections={config.textbookSections}
        learningObjectives={config.learningObjectives}
        coreIntuition={<p>{config.coreIntuition}</p>}
        commonMistakes={config.commonMistakes}
      />
    </>
  );
}
