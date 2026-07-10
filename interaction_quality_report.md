# 交互质量审计报告

> 生成日期：2026-07-10 | 审计范围：旗舰页面 Ch7/8/12/15/20

## 旗舰页面评级

| 页面 | 等级 | PredictionGate | LinkedViews | Counterexample | TransferChallenge | CustomDemo | 数学测试 |
|---|---|---|---|---|---|---|---|
| Ch7 梯度下降 | **L3** | ✅ | ✅ 轨迹+loss curve | ✅ 发散/鞍点 preset | ❌ | OptimizationLandscapeLab | ✅ 梯度解析 |
| Ch8 反向传播 | **L4** | ❌ | ✅ 图+数值表+维度 | ✅ h过大/过小 | ❌ | BackpropagationLab | ✅ numerical check |
| Ch12 Attention | **L4** | ✅ | ✅ heatmap+维度+PE对比 | ✅ 猫追狗 vs 狗追猫 | ✅ 拖拽重排 | AttentionLab | ✅ dot product 展开 |
| Ch15 EM/ELBO | **L3** | ❌ | ✅ 散点+logLik曲线 | ✅ soft vs hard | ❌ | EMELBOLab | ✅ 数值EM步 |
| Ch20 Diffusion | **L3** | ❌ | ✅ z0/zt/ẑ0三视图 | ✅ ε̂含噪声 | ❌ | DiffusionTimelineLab | ✅ closed-form |

## 评分标准

- **L0**: 纯文字页面
- **L1**: 有静态公式和概念卡
- **L2**: 有简单 slider demo
- **L3**: 有自定义 SVG 动画 + 多视图联动 + 失败案例
- **L4**: L3 + prediction gate + counterexample + 迁移挑战 + 数学校验

## teaching-ready 要求检查

| 要求 | Ch7 | Ch8 | Ch12 | Ch15 | Ch20 |
|---|---|---|---|---|---|
| interactionLevel >= L3 | ✅ | ✅ | ✅ | ✅ | ✅ |
| 至少 1 个 custom demo | ✅ | ✅ | ✅ | ✅ | ✅ |
| 至少 3 种联动表示 | ✅ | ✅ | ✅ | ✅ | ✅ |
| 有失败案例 | ✅ | ✅ | ✅ | ✅ | ✅ |
| 有非单选题检查点 | ❌ | ✅(numerical check) | ✅(dot展开) | ❌ | ❌ |
| 数学函数有单元测试 | ✅ | ✅ | ✅ | ✅ | ✅ |
| 无教材版权混淆 | ✅ | ✅ | ✅ | ✅ | ✅ |

## 已知待改进

- Ch7/15/20: 缺少 TransferChallenge 和 PredictionGate
- 所有旗舰页面: mobile 适配待优化
- 所有旗舰页面: accessibility 审查待完成
- 所有旗舰页面: 学生测试未进行
