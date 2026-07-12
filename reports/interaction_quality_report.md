# 交互质量审计报告（更新）

> 更新日期：2026-06-29 | 审计范围：旗舰页面 Ch7/8/12/15/20 | 测试：`npm run test:math` 109 passed

## 旗舰页面评级（修复后）

| 页面 | 等级 | PredictionGate | LinkedViews | Counterexample | TransferChallenge | CustomDemo | 数学测试 |
|---|---|---|---|---|---|---|---|
| Ch7 梯度下降 | **L3** | ❌ | ✅ 轨迹+loss+contour | ✅ presets+common noise+鞍点 | ❌ | OptimizationLandscapeLab | ✅ Vitest |
| Ch8 反向传播 | **L3** | ❌ | ✅ 图+表+tape | ✅ h 过大/过小+分支图 | ❌ | BackpropagationLab | ✅ Vitest |
| Ch12 Attention | **L3** | ❌ | ✅ heatmap+维度+PE | ✅ PE/causal equivariance | ✅ 拖拽重排+多 permutation | AttentionLab | ✅ Vitest |
| Ch15 EM/ELBO | **L3** | ❌ | ✅ 散点+椭圆+logLik | ✅ 坏初始化+label switching | ❌ | EMELBOLab | ✅ Vitest |
| Ch20 Diffusion | **L3** | ❌ | ✅ z0/zt/x0pred+score field | ✅ prediction error+conditional vs marginal | ❌ | DiffusionTimelineLab | ✅ Vitest |

## 说明

- **PredictionGate** 目前未在任何页面实现真正的“先预测、锁定、再显示结果”流程，因此全部标记为 ❌。
  若要评为 ✅，需实现：学生先预测 → 提交预测 → 锁定 → 显示数值结果 → 判断正误并解释。

## L4 晋升条件

仅在同时具有 **PredictionGate + Counterexample + TransferChallenge** 且交互等级达到 L3 以上时方可评为 L4。
当前无一页面达到 L4。

## 修复完成的底层问题

- ✅ 反向传播输出节点处理
- ✅ `localGrads: Record<inId, number>`
- ✅ 数值梯度中心差分
- ✅ Token embedding 基于内容 hash
- ✅ numHeads 只用 dModel 的约数
- ✅ 完整协方差估计
- ✅ Box-Muller 高斯噪声
- ✅ 真实网格等高线
- ✅ Momentum 经典定义 `v = βv + g`
- ✅ 5 个 math lib 函数库 + Vitest 测试
- ✅ Diffusion 独立 data/forward/reverse/compare seed
- ✅ Diffusion `makeSharedHistogram` 与条件分布一致性
- ✅ Optimization common / independent random noise
- ✅ EM label-invariant 误差、K-means++、收敛披露、数值保护标注
- ✅ Backprop 步进/一键模式隔离，`canStepBackward` 保护 `Next Bwd`
- ✅ 新增 `src/pedagogical-tests/` 与 `npm run test:pedagogical`
