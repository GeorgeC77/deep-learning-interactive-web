# 交互质量审计报告（更新）

> 更新日期：2026-07-12 | 审计范围：旗舰页面 + 第二批核心交互 + 第三批数学/教学语义修复 | 测试：`npm run test:math` 230 passed

## 第三批修复摘要

| Demo | 关键修复 | PredictionGate | 数学测试 |
|---|---|---|---|
| PPCAELBODemo | 稳定 `eig2x2`（atan2 + Rayleigh quotient）；删除 `E[x\|x]`；正确写出 `E[z\|x]` 与 `x̂_post = μ + W E[z\|x]`；M=0/1/2 分段解释 | ❌（无预测门） | ✅ Vitest |
| UnetDemo | encoder/decoder 同分辨率同 centreY；skip compatibility 比较真实 `encoderSpatial` 与 `decoderSpatial`；输入尺寸 step=1 + 250/255/256/257 预设；红色未对齐警告与填充详情 | ❌ | ✅ Vitest |
| DiscreteLatentELBODemo | PredictionGate 完全受控：预测 → 提交锁定 → 揭晓 → 反馈；hint 不再泄露答案索引；sample 切换重置 q/prediction/submitted/revealed；真实后验按钮仅在揭晓后出现 | ✅ | ✅ Vitest |
| IoUNMSDemo | Hard NMS class-aware/class-agnostic + scoreThreshold + trace；Soft-NMS 每轮按更新后分数重选最大值，支持 mode 与 scoreThreshold，完整 trace | ❌ | ✅ Vitest |

## 第三批教学不变量（新增 `src/pedagogical-tests/fourth-batch.test.tsx`）

- PPCA `eig2x2` 对 `diag(4,1)` / `diag(1,4)` / `diag(2,2)` / 旋转协方差返回正确特征对；特征向量单位长且正交；不会出现零向量。
- PPCA 页面不出现 `E[x\|x]`，出现 `E[z\|x]`；M=0 有明确 baseline 说明。
- U-Net 同分辨率 encoder/decoder 共享 centreY；skip compatibility 基于真实空间尺寸；非对齐输入预设触发红色警告。
- PredictionGate：未提交时 reveal 禁用；提交后 reveal 可用并触发回调；resetKey 变化清空 prediction。
- Soft-NMS：按更新后分数动态重选最大值；class-aware 不跨类衰减；class-agnostic 跨类衰减；阈值过滤作用于衰减后分数；trace 可复现最终分数；σ 越小高 IoU 框衰减越强。

## 旗舰页面评级（修复后）

| 页面 | 等级 | PredictionGate | LinkedViews | Counterexample | TransferChallenge | CustomDemo | 数学测试 |
|---|---|---|---|---|---|---|---|
| Ch7 梯度下降 | **L3** | ❌ | ✅ 轨迹+loss+contour | ✅ presets+common noise+鞍点 | ❌ | OptimizationLandscapeLab | ✅ Vitest |
| Ch8 反向传播 | **L3** | ❌ | ✅ 图+表+tape | ✅ h 过大/过小+分支图 | ❌ | BackpropagationLab | ✅ Vitest |
| Ch12 Attention | **L3** | ❌ | ✅ heatmap+维度+PE | ✅ PE/causal equivariance | ✅ 拖拽重排+多 permutation | AttentionLab | ✅ Vitest |
| Ch15 EM/ELBO | **L3** | ❌ | ✅ 散点+椭圆+logLik | ✅ 坏初始化+label switching | ❌ | EMELBOLab | ✅ Vitest |
| Ch20 Diffusion | **L3** | ❌ | ✅ z0/zt/x0pred+score field | ✅ prediction error+conditional vs marginal | ❌ | DiffusionTimelineLab | ✅ Vitest |

## 第二批核心交互审计

| Demo | 主要修复/升级 | 数学测试 |
|---|---|---|
| ROCInteractiveDemo | overlap↔AUC 单调性正确；理论/经验 AUC；AUC = P(pos>neg) 解释 | ✅ Vitest |
| LogisticDecisionBoundaryDemo | w2=0 垂直线；w1=w2=0 均匀分类；scaling experiment | ✅ Vitest |
| MessagePassingInvariantDemo | round slider 驱动消息传递；k-hop 邻域；置换等变/不变误差；over-smoothing | ✅ Vitest |
| PolynomialRegressionDemo (BiasVarianceLab) | 多训练集；bias²/variance/noise 分解；正交多项式稳定拟合 | ✅ Vitest |
| AutoregressiveSamplingDemo | first-order Markov toy；temperature/seed/context；top-k/top-p 过滤概率 | ✅ Vitest |
| ImportanceSamplingDemo | 可选 f；ESS；max weight share；q 均值/方差调节；尾部不足案例 | ✅ Vitest |
| MetropolisHastingsDemo | burn-in；trace/ACF/ESS；mode occupancy/switches；presets 强调 ESS 而非接受率 | ✅ Vitest |
| MaskedAutoencoderDemo | imageSeed/maskSeed 拆分；结构化图像；masked vs all-patch MSE；baselines | ✅ Vitest |
| ConvolutionSizeDemo | SAME padding 公式 `ceil(I/S)`；左右不对称 padding；移动窗口动画 | ✅ Vitest |

## 说明

- **PredictionGate** 在 `DiscreteLatentELBODemo` 中已实现真正的“先预测 → 提交锁定 → 揭晓 → 反馈”流程，标记为 ✅。其余页面未使用 PredictionGate。

## L4 晋升条件

仅在同时具有 **PredictionGate + Counterexample + TransferChallenge** 且交互等级达到 L3 以上时方可评为 L4。
当前无一页面达到 L4。

## 修复完成的底层问题

### 第一批（旗舰页面）
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

### 第二批（核心交互）
- ✅ ROC overlap 与 AUC 单调关系正确；理论 AUC 使用标准正态 CDF
- ✅ Logistic 决策边界处理垂直/均匀情况；权重缩放实验
- ✅ GNN 消息传递按 round 计算；置换等变/不变数值验证
- ✅ Bias-Variance 实验使用多训练集与正交多项式稳定拟合
- ✅ 自回归采样增加 temperature/seed/context；top-k/top-p 过滤概率可视化
- ✅ 重要性采样增加多目标函数、ESS、max weight share 与 proposal 尾部诊断
- ✅ MCMC 增加 burn-in、ACF、ESS、mode 诊断与 preset 对比
- ✅ MAE 拆分 image/mask seed；结构化图像；masked vs all-patch MSE 区分
- ✅ 卷积 SAME padding 公式与移动窗口动画

### 第三批（数学/教学语义）
- ✅ PPCA `eig2x2` 稳定特征分解，修复 `diag(1,4)` 零向量问题
- ✅ PPCA 后验均值公式正确化，删除 `E[x\|x]`，补充 M=0/1/2 语义
- ✅ U-Net 同分辨率 stage 同 centreY，skip compatibility 比较真实 H×W
- ✅ U-Net 输入对齐实验可触发红色警告（step=1 + 250/255/257 预设）
- ✅ PredictionGate 完全受控，流程为预测 → 提交锁定 → 揭晓 → 反馈
- ✅ 离散 ELBO 答案防泄露：hint 无答案索引，真实后验按钮仅揭晓后可见
- ✅ Soft-NMS 每轮按更新后分数重选最大值，支持 mode 与 scoreThreshold
- ✅ 新增/更新 `ppca/unet/discreteElbo/iouNms` math 测试与 `fourth-batch` 教学不变量测试
