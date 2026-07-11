# 交互质量审计报告（更新）

> 更新日期：2026-07-11 | 审计范围：旗舰页面 Ch7/8/12/15/20

## 旗舰页面评级（修复后）

| 页面 | 等级 | PredictionGate | LinkedViews | Counterexample | TransferChallenge | CustomDemo | 数学测试 |
|---|---|---|---|---|---|---|---|
| Ch7 梯度下降 | **L2** | ❌ | ✅ 轨迹+loss | ✅ presets | ❌ | OptimizationLandscapeLab | ✅ Vitest |
| Ch8 反向传播 | **L3** | ❌ | ✅ 图+表+维度 | ✅ h过大/过小 | ❌ | BackpropagationLab | ✅ Vitest |
| Ch12 Attention | **L3** | ✅ | ✅ heatmap+维度+PE | ✅ PE equivariance | ✅ 拖拽重排 | AttentionLab | ✅ Vitest |
| Ch15 EM/ELBO | **L2** | ❌ | ✅ 散点+椭圆+logLik | ✅ 坏初始化 | ❌ | EMELBOLab | ✅ Vitest |
| Ch20 Diffusion | **L2** | ❌ | ✅ z0/zt/x0pred | ✅ prediction error | ❌ | DiffusionTimelineLab | ✅ Vitest |

## L4 晋升条件

仅在同时具有 **PredictionGate + Counterexample + TransferChallenge** 且交互等级达到 L3 以上时方可评为 L4。
当前无一页面达到 L4。

## 修复完成的底层问题

- ✅ 反向传播输出节点处理
- ✅ localGrads: Record<inId, number>
- ✅ 数值梯度中心差分
- ✅ Token embedding 基于内容hash
- ✅ numHeads 只用 dModel 的约数
- ✅ 完整协方差估计
- ✅ Box-Muller 高斯噪声
- ✅ 真实网格等高线
- ✅ Momentum 经典定义
- ✅ 5个 math lib 函数库 + Vitest 测试
