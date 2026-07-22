import BishopSectionPage from '@/components/BishopSectionPage';
import DSeparationLab from '@/components/demos/DSeparationLab';
import { Unlink } from 'lucide-react';

export default function Ch08ConditionalIndependencePage() {
  return (
    <BishopSectionPage
      sectionPath="/ch08/conditional-independence"
      heroIcon={<Unlink className="w-9 h-9 text-blue-600" />}
      summary={"条件独立性是图模型的核心语义；d-分离给出了一套仅依据图结构判断条件独立的完备准则。"}
      concepts={[
        {
          title: "链式结构",
          description: "A → B → C 中，B 是中间节点。无条件时 A 与 C 相关；给定 B 后路径被阻断，A 与 C 条件独立。",
          formula: "A \\not\\bot C, \\quad A \\bot C \\bigm| B",
        },
        {
          title: "分岔结构",
          description: "A ← B → C 中，B 是共同原因。无条件时 A 与 C 相关；给定 B 后二者条件独立。",
          formula: "A \\not\\bot C, \\quad A \\bot C \\bigm| B",
        },
        {
          title: "汇聚结构 / 解释消除",
          description: "A → B ← C 中，B 是共同结果。无条件时 A 与 C 独立；给定 B（或其任意子孙）后二者相关，称为 explaining away。",
          formula: "A \\bot C, \\quad A \\not\\bot C \\bigm| B",
        },
        {
          title: "d-分离判定规则",
          description: "一条路径被阻断，当且仅当其中存在链或分岔的中间节点被条件化，或存在汇聚节点且该节点及其所有子孙均未被条件化。",
          formula: "X \\bot_D Y \\bigm| Z \\text{ 当且仅当 } X,Y \\text{ 间的所有路径均被 } Z \\text{ 阻断}",
        },
        {
          title: "朴素贝叶斯",
          description: "类别节点作为所有特征节点的共同父节点；在类别条件下特征相互独立，使联合分布简化为 p(c)∏p(x_i|c)。",
        },
        {
          title: "马尔可夫毯",
          description: "一个节点的马尔可夫毯包括其父节点、子节点以及子节点的其他父节点；给定毯后该节点与图中其余节点条件独立。",
        },
        {
          title: "图作为分布滤波器",
          description: "同一 DAG 对应一族满足相同 d-分离关系的分布；图结构滤掉了不满足这些条件独立性的分布。",
        },
      ]}
      learningObjectives={[
        "能区分链式、分岔、汇聚三种基本结构对条件独立的影响。",
        "理解解释消除（explaining away）现象及其图结构来源。",
        "能应用 d-分离规则判断给定条件下两个节点是否独立。",
      ]}
      coreIntuition={"d-分离把‘条件独立’翻译成‘图上的路径阻断’：观察某些节点会关闭或打开变量之间的信息通道。"}
      commonMistakes={[
        "认为‘给定中间节点’在所有三种结构中都会阻断路径，忽略汇聚结构反而会开通路径。",
        "忽略条件化汇聚节点的子孙也会解除阻断。",
        "把 d-分离的图结构结论直接等同于因果论断。",
      ]}
            bishopMapping={{
        chapter: "Ch 11",
        section: "11.2",
        pages: "Ch 11",
        textbookSubsections: [
          "11.2 Conditional Independence",
          "11.2.1 Three example graphs",
          "11.2.2 Explaining away",
          "11.2.3 D-separation",
          "11.2.4 Naive Bayes",
          "11.2.5 Generative models",
          "11.2.6 Markov blanket",
          "11.2.7 Graphs as filters",
        ],
        exercises: [
          "对链式、分岔、汇聚三种结构分别写出条件独立关系。",
          "给定一个四节点图，判断某对节点在条件集 Z 下是否 d-分离。",
          "解释‘条件化 collider 的子孙也会开通路径’的原因。",
        ],
      }}
      interactiveDemo={<DSeparationLab />}
    />
  );
}
