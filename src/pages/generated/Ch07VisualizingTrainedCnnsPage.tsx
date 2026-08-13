import BishopSectionPage from '@/components/BishopSectionPage';
import SaliencyComparisonLab from '@/components/demos/SaliencyComparisonLab';
import DerivationStepper from '@/components/DerivationStepper';
import ExercisePanel from '@/components/ExercisePanel';
import { chapter07VisualizationExercises } from '@/course/chapter07Exercises';
import { Search } from 'lucide-react';

export default function Ch07VisualizingTrainedCnnsPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch07/visualizing-trained-cnns"
      heroIcon={<Search className="w-9 h-9 text-blue-600" />}
      summary={"可视化帮助理解 CNN 学到了什么：从低层滤波器到类激活图、显著性图与对抗样本。显著性图反映的是局部敏感度，而非因果重要性。"}
      concepts={[
        {
          title: "视觉皮层与 CNN 的类比",
          description: "CNN 的低层滤波器与视觉皮层简单细胞类似，都能对边缘、方向等局部特征产生选择性响应。",
        },
        {
          title: "滤波器可视化",
          description: "第一层滤波器常呈现 Gabor 边缘检测器；激活最大化可找到使某滤波器响应最大的偏好输入。",
        },
        {
          title: "输入梯度显著性",
          description: "把目标类别分数对输入像素的梯度绝对值作为局部敏感度；它便于计算，但会受到饱和、噪声和基线选择影响。",
          formula: String.raw`S_i = \left|\frac{\partial y_c}{\partial x_i}\right|`,
        },
        {
          title: "Grad-CAM 显著性图",
          description: "教材用目标类别预激活对最后卷积层各通道求梯度并作空间平均，再加权组合特征图；它保留定位但仍是模型证据的可视化，不等于因果解释。",
          formula: String.raw`\alpha_k=\frac1{M_k}\sum_{i,j}\frac{\partial a^{(c)}}{\partial a_{ij}^{(k)}},\quad L=\sum_k\alpha_kA^{(k)}`,
        },
        {
          title: "对抗样本",
          description: "对人眼不可察觉的扰动可导致网络高置信度错误分类；通常限制扰动范数。",
          formula: String.raw`\|\delta\|_p \le \epsilon`,
        },
        {
          title: "合成图像与激活最大化",
          description: "通过优化或生成方法构造使高层神经元响应极大的合成图像，可揭示模型偏好的抽象模式。",
        },
      ]}
      learningObjectives={[
        "理解滤波器可视化、显著性图与对抗样本的基本思想。",
        "区分显著性图的局部敏感度解释与因果重要性解释。",
        "认识梯度饱和、噪声与模型随机化对显著性方法的影响。",
      ]}
      coreIntuition={"CNN 的可视化是把模型内部的响应“翻译”成人类可理解的信号：滤波器看它能响应什么模式，显著性图看输入哪里最容易影响输出，对抗样本看决策边界附近的脆弱方向。"}
      commonMistakes={[
        "把显著性图直接解释为‘对分类最重要的区域’；它实际上是局部梯度敏感度。",
        "忽视饱和效应：当激活函数饱和时，梯度可能很小，但输入仍对输出有决定性影响。",
        "将对抗样本的泛化性误以为是人类视觉意义上的语义变化。",
      ]}
      whyCards={[
        {
          question: "为什么显著性图不等于因果重要性？",
          answer: "显著性图只反映当前输入附近 class score 对像素的局部敏感度。梯度小不代表输入不重要，可能是激活函数饱和或噪声导致。",
        },
        {
          question: "为什么需要对抗样本的扰动约束？",
          answer: "不限制扰动大小，任何图像都可以被改造成任意类别。约束扰动范数才能研究模型在“人眼不可察觉”范围内的脆弱性。",
        },
      ]}
      counterexamples={[
        "在饱和区域，显著性图显示梯度几乎为零，但遮挡该输入区域后分类结果完全改变——说明梯度小不等于不重要。",
        "对同一输入，梯度显著性和遮挡归因给出完全不同的高亮区域——说明不同归因方法衡量的不是同一件事。",
      ]}
            bishopMapping={{
        chapter: "Ch 10",
        section: "10.3",
        pages: "§10.3, pp. 302–308",
        textbookSubsections: [
          "10.3 Visualizing Trained CNNs",
          "10.3.1 Visual cortex",
          "10.3.2 Visualizing trained filters",
          "10.3.3 Saliency maps",
          "10.3.4 Adversarial attacks",
          "10.3.5 Synthetic images"
        ],
        formulas: ["S_i = |∂y_c/∂x_i|", "Grad-CAM channel weight αk", "L=Σk αk A(k)", "对抗扰动约束 ‖δ‖p≤ε", "DeepDream F(I)=Σijk aijk(I)²"],
        algorithms: ["激活最大化", "梯度显著性", "Occlusion 归因", "Integrated Gradients"],
        exercises: ["比较同一输入上 gradient、gradient×input、integrated gradients 的差异。", "用随机化权重 sanity check 显著性方法。"],
      }}
      interactiveDemo={<SaliencyComparisonLab />}
      extraContent={<div className="space-y-10"><DerivationStepper title="分步推导：Grad-CAM 从类别梯度到热力图" steps={[
        { label: '选择类别', formula: String.raw`a^{(c)}(x)`, explanation: '使用 softmax 之前的目标类别预激活，避免类别概率耦合掩盖证据。' },
        { label: '求局部梯度', formula: String.raw`g_{ij}^{(k)}=\frac{\partial a^{(c)}}{\partial a_{ij}^{(k)}}`, explanation: '梯度衡量类别分数对最后卷积层每个空间单元的局部敏感度。' },
        { label: '通道权重', formula: String.raw`\alpha_k=\frac1{M_k}\sum_{i,j}g_{ij}^{(k)}`, explanation: '对空间位置平均，把每个通道压成一个类别相关权重。' },
        { label: '组合热图', formula: String.raw`L=\sum_k\alpha_kA^{(k)}`, explanation: '加权通道仍保留最后卷积层的空间网格，可上采样叠加到原图；它是证据定位而非因果证明。' },
      ]} /><ExercisePanel exerciseSetId="chapter07-visualization" exercises={chapter07VisualizationExercises} /></div>}
    />
  );
}
