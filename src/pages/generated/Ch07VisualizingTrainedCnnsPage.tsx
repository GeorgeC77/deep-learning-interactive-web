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
      quiz={[
        {
          question: "显著性图中的梯度 S_i = |∂y_c/∂x_i| 表示什么？",
          options: [
            "输入 x_i 附近 class score 的局部敏感度。",
            "x_i 对分类结果的因果重要性。",
            "x_i 被模型直接注视的概率。",
            "x_i 与标签之间的互信息。",
          ],
          correctIndex: 0,
          explanation: "梯度显著性衡量的是在当前输入附近，像素值微小变化对 class score 的影响，不是因果重要性。",
        },
        {
          question: "滤波器可视化常通过什么方式找到某个滤波器的偏好输入？",
          options: [
            "激活最大化：寻找使该滤波器响应最大的输入。",
            "随机采样大量输入并取平均。",
            "直接用训练集中响应最大的真实图像。",
            "对权重矩阵做 PCA。",
          ],
          correctIndex: 0,
          explanation: "激活最大化通过优化输入来最大化某神经元的响应，常配合正则化约束得到可解释的模式。",
        },
        {
          question: "对抗扰动通常需要满足什么约束？",
          options: [
            "扰动范数不超过某个小阈值 ε。",
            "必须改变图像的语义内容。",
            "必须加到图像的前景区域。",
            "必须让模型置信度降到 0。",
          ],
          correctIndex: 0,
          explanation: "对抗样本的定义核心在于：对人眼不可察觉的小扰动（如 ℓ_p 范数 ≤ ε）就能导致模型错误分类。",
        },
        {
          question: "梯度显著性图与 occlusion 归因的主要差异是什么？",
          options: [
            "梯度图用局部线性近似，occlusion 用遮挡后的分数变化。",
            "梯度图只能用于 CNN，occlusion 只能用于全连接网络。",
            "梯度图需要重新训练模型，occlusion 不需要。",
            "两者在数学上完全等价。",
          ],
          correctIndex: 0,
          explanation: "梯度图基于当前输入处的导数，occlusion 通过遮挡输入区域观察分数变化；前者是局部近似，后者是非局部扰动实验。",
        },
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
