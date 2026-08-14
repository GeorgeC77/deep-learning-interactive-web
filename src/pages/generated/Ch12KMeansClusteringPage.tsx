import BishopSectionPage from '@/components/BishopSectionPage';
import DerivationStepper from '@/components/DerivationStepper';
import ExercisePanel from '@/components/ExercisePanel';
import { KMeansDemo } from '@/pages/chapters/chapter10/KMeansPage';
import { chapter12KMeansExercises } from '@/course/chapter12Exercises';
import { ScanSearch } from 'lucide-react';

export default function Ch12KMeansClusteringPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch12/k-means-clustering"
      heroIcon={<ScanSearch className="h-9 w-9 text-blue-600" />}
      summary={"K-means 用离散的 1-of-K 指示变量表示簇归属，并在硬分配与质心之间交替优化平方失真。它可用于图像颜色量化，但只适合近似球形、尺度相当的簇。"}
      concepts={[
        { title: '失真函数', description: 'rₙₖ∈{0,1} 且每个样本只属于一个簇；目标是所有样本到所属质心的平方距离之和。', formula: String.raw`J=\sum_{n=1}^{N}\sum_{k=1}^{K}r_{nk}\lVert\mathbf x_n-\boldsymbol\mu_k\rVert^2` },
        { title: '分配步骤', description: '固定质心时，各样本独立选择平方距离最小的质心；这一步给出硬后验。', formula: String.raw`r_{nk}=1\quad\text{if }k=\arg\min_j\lVert\mathbf x_n-\boldsymbol\mu_j\rVert^2` },
        { title: '质心更新', description: '固定分配时，对 J 关于 μₖ 求导，得到簇内样本的算术均值。', formula: String.raw`\boldsymbol\mu_k=\frac{\sum_n r_{nk}\mathbf x_n}{\sum_n r_{nk}}` },
        { title: '收敛与初始化', description: '两步都不会增大 J，有限种硬分配使算法最终稳定；但目标非凸，不同初始化可能到达不同固定点。' },
        { title: '图像分割与压缩', description: '把像素颜色视为数据点，用 K 个质心颜色替换原像素；K 越大通常失真越低，但编码量和模型复杂度更高。' },
        { title: '几何局限', description: '平方欧氏距离偏好球形、方差相近的簇，对特征尺度、异常值、空簇和非凸结构都敏感。' },
      ]}
      learningObjectives={[
        '能从失真函数推出“最近质心”分配规则和“簇内均值”更新。',
        '能解释目标单调不增、有限步稳定与非全局最优并不矛盾。',
        '能判断 K-means 用于图像颜色量化时 K 的质量—码长权衡。',
      ]}
      coreIntuition={"把“谁属于哪个簇”和“每个簇的代表是谁”拆开：固定一个变量时另一个都有简单最优解，交替执行就像反复整理座位与重算每组中心。"}
      commonMistakes={[
        '把一次“先更新质心、后分配”也当成标准 Lloyd 迭代；教材顺序是固定质心先分配，再固定分配更新质心。',
        '由失真单调下降误推出全局最优；单调性只说明不会沿当前轨迹变差。',
        '忽略特征量纲与异常值：平方距离会放大大尺度维度和离群点的影响。',
      ]}
      whyCards={[
        { question: '为什么质心是均值而不是中位数？', answer: '因为目标使用平方距离。对平方损失求导得到均值；若改用绝对距离，最优代表才是中位数。' },
        { question: '为什么算法会停下来却仍可能很差？', answer: '可行硬分配数量有限，每步又不增大目标，所以终会稳定；但非凸目标可能有许多不同的稳定分配。' },
      ]}
      counterexamples={[
        '两个同心圆无法被两个欧氏最近质心正确分开——说明 K-means 的 Voronoi 边界不适合非凸簇。',
        '给紧密点云加入一个极远异常点，均值质心会明显被拉走——说明平方损失并不稳健。',
      ]}
      bishopMapping={{
        chapter: 'Ch 15',
        section: '15.1',
        pages: '§15.1, pp. 460–466',
        textbookSubsections: ["15.1 K-means Clustering", "15.1.1 Image segmentation"],
        formulas: ['失真函数 (15.1)', '硬分配 (15.2)', '质心更新 (15.4)'],
        algorithms: ['Algorithm 15.1 K-means'],
        exercises: ['计算一次分配后的失真。', '从导数推出质心均值。', '辨析收敛、初始化与异常值。'],
      }}
      interactiveDemo={<KMeansDemo />}
      extraContent={
        <div className="space-y-10">
          <DerivationStepper title="分步推导：为什么 K-means 是交替最小化" steps={[
            { label: '写出联合目标', formula: String.raw`J(\mathbf R,\boldsymbol\mu)=\sum_{n,k}r_{nk}\lVert\mathbf x_n-\boldsymbol\mu_k\rVert^2`, explanation: 'R 是 1-of-K 硬分配矩阵。联合搜索 R 与 μ 很难，但分别固定其中一个时都有闭式最优。' },
            { label: '固定质心优化分配', formula: String.raw`r_{nk}=\mathbb 1\!\left[k=\arg\min_j\lVert\mathbf x_n-\boldsymbol\mu_j\rVert^2\right]`, explanation: 'J 对不同样本的分配可分离，每个样本只需选择最小距离项，所以该步骤不会增大 J。' },
            { label: '固定分配求导', formula: String.raw`\frac{\partial J}{\partial\boldsymbol\mu_k}=2\sum_n r_{nk}(\boldsymbol\mu_k-\mathbf x_n)=\mathbf0`, explanation: '只保留属于第 k 簇的项；平方距离的梯度把质心拉向所有成员。' },
            { label: '解出均值并判断收敛', formula: String.raw`\boldsymbol\mu_k=\frac{\sum_n r_{nk}\mathbf x_n}{N_k},\qquad J^{(t+1)}\le J^{(t)}`, explanation: '质心是加权均值。有限种分配配合单调下降保证稳定，但只能保证到达局部最优或固定点。' },
          ]} />
          <ExercisePanel exerciseSetId="chapter12-kmeans" exercises={chapter12KMeansExercises} />
        </div>
      }
    />
  );
}
