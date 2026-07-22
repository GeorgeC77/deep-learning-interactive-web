import BishopSectionPage from '@/components/BishopSectionPage';
import SaliencyComparisonLab from '@/components/demos/SaliencyComparisonLab';
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
          title: "显著性图",
          description: "通过反向传播输入梯度，显示当前输入附近 class score 对像素的局部敏感度。",
          formula: String.raw`S_i = \left|\frac{\partial y_c}{\partial x_i}\right|`,
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
            bishopMapping={{
        chapter: "Ch 10",
        section: "10.3",
        pages: "Ch 10",
        textbookSubsections: [
          "10.3 Visualizing Trained CNNs",
          "10.3.1 Visual cortex",
          "10.3.2 Visualizing trained filters",
          "10.3.3 Saliency maps",
          "10.3.4 Adversarial attacks",
          "10.3.5 Synthetic images"
        ],
        formulas: ["S_i = |∂y_c/∂x_i|", "对抗扰动约束 ‖δ‖_p ≤ ε"],
        algorithms: ["激活最大化", "梯度显著性", "Occlusion 归因", "Integrated Gradients"],
        exercises: ["比较同一输入上 gradient、gradient×input、integrated gradients 的差异。", "用随机化权重 sanity check 显著性方法。"],
      }}
      interactiveDemo={<SaliencyComparisonLab />}
    />
  );
}
