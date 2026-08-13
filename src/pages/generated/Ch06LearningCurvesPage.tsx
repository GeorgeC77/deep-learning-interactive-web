import BishopSectionPage from '@/components/BishopSectionPage';
import LearningCurvesLab from '@/components/demos/LearningCurvesLab';
import DerivationStepper from '@/components/DerivationStepper';
import ExercisePanel from '@/components/ExercisePanel';
import { chapter06LearningCurveExercises } from '@/course/chapter06Exercises';
import { TrendingUp } from 'lucide-react';

export default function Ch06LearningCurvesPage() {
  return <BishopSectionPage
    sectionPath="/ch06/learning-curves"
    heroIcon={<TrendingUp className="w-9 h-9 text-blue-600" />}
    summary="Bishop §9.3 用学习曲线把训练过程本身视为复杂度控制：训练误差通常下降，而验证误差可能先降后升。早停应保存验证集最佳 checkpoint；现代过参数化模型还可能在插值阈值后呈现双下降，但这不是无条件规律。"
    concepts={[
      { title: '训练与验证学习曲线', description: '曲线以优化迭代或 epoch 为横轴。训练误差常近似单调下降；验证误差反映泛化，必须使用与训练独立的数据。' },
      { title: '早停', description: '当验证指标不再改善时停止并恢复历史最优参数。patience 控制对随机波动的容忍度，不能用测试集选择停止时刻。', formula: String.raw`t^*=\arg\min_t E_{\mathrm{val}}(w^{(t)})` },
      { title: '与权重衰减的关系', description: '从小权重初始化出发，在局部二次误差面上提前终止会抑制慢曲率方向，效果可类似权重衰减，但二者不是对一般非凸网络完全等价。' },
      { title: '双下降', description: '随模型规模、训练时长或正则强度改变，有些现代模型的测试误差在插值阈值附近上升，随后在过参数化区再次下降；具体形状取决于数据、噪声与训练算法。' },
    ]}
    learningObjectives={['根据训练/验证曲线选择并恢复最佳 checkpoint。','解释 patience、验证集与测试集在早停流程中的不同角色。','从有效复杂度角度比较早停与权重衰减。','识别插值阈值与双下降，并说明其适用边界。']}
    coreIntuition="训练越久，模型沿优化轨迹获得的有效自由度通常越多。早停不是等待训练变坏后使用最后模型，而是在独立验证曲线达到最低点时保存一份复杂度适中的解。"
    commonMistakes={['停止触发后直接使用最后参数，而没有恢复最佳验证 checkpoint。','反复查看测试集来选 epoch，造成测试信息泄漏。','把双下降理解为“大模型一定更好”，忽略插值峰值与任务依赖。']}
    whyCards={[{question:'为什么训练误差不能决定早停？',answer:'训练误差衡量对已见样本的拟合，通常会继续下降；验证误差才提供当前模型泛化表现的独立估计。'},{question:'为什么 patience 不等于最佳 epoch？',answer:'patience 允许最佳点之后再观察若干轮以过滤噪声；触发时刻晚于最佳点，所以必须恢复历史最优参数。'}]}
    counterexamples={['训练到第 100 轮时训练误差最低，但验证误差在第 43 轮已达到最低——说明最后模型不是早停模型。','在某些噪声和优化设置下，过参数化区测试误差不再下降——说明双下降不是普遍保证。']}
    bishopMapping={{
      chapter: 'Ch 9',
      section: '9.3',
      pages: '§9.3, pp. 266–270',
      textbookSubsections: [
        "9.3 Learning Curves",
        "9.3.1 Early stopping",
        "9.3.2 Double descent"
      ],
      formulas: ['t*=argmin validation error', 'early stopping in Hessian eigendirections', 'interpolation threshold'],
      algorithms: ['early stopping with best-checkpoint restoration'],
      exercises: ['从曲线选择最佳 checkpoint。', '比较训练时长与权重衰减的复杂度控制。', '解释插值阈值附近的测试误差峰值。']
    }}
    interactiveDemo={<LearningCurvesLab />}
    extraContent={<div className="space-y-10"><DerivationStepper title="分步推导：早停为何抑制慢曲率方向" steps={[
      {label:'二次方向',formula:String.raw`E=E^*+\frac12\sum_j\lambda_j(w_j-w_j^*)^2`,explanation:'在 Hessian 特征基底中，各方向独立。'},
      {label:'梯度递推',formula:String.raw`w_j^{(t)}-w_j^*=(1-\eta\lambda_j)^t(w_j^{(0)}-w_j^*)`,explanation:'大曲率方向更快接近最优，慢曲率方向需要更多迭代。'},
      {label:'提前停止',formula:String.raw`\eta\lambda_jt\gg1:\ w_j^{(t)}\approx w_j^*;\quad \eta\lambda_jt\ll1:\ w_j^{(t)}\approx w_j^{(0)}`,explanation:'有限训练时间选择性抑制尚未学到的慢方向。'},
      {label:'边界',formula:String.raw`t\ \text{is selected on validation data}`,explanation:'非凸网络中只是定性类比，实际停止点需验证数据决定。'},
    ]}/><ExercisePanel exerciseSetId="chapter06-learning-curves" exercises={chapter06LearningCurveExercises}/></div>}
  />;
}
