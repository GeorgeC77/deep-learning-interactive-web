# 数学验证报告

> 更新日期：2026-06-29 | 范围：5 个旗舰 demo 对应 math lib | 测试：`npm run test:math` 109 passed

## 已验证的数学函数

### BackpropagationLab
- ✅ 链式法则：逐节点 ∂out/∂in × adjoint → 累积梯度
- ✅ 数值梯度校验：`(f(w+h)−f(w−h))/(2h)` vs 反传结果
- ✅ `multiply` 局部导数 = 另一个操作数
- ✅ `sin` 局部导数 = `cos(input)`
- ✅ `add` 局部导数 = 1（梯度不变传递）
- ✅ 反向模式一次性计算所有参数梯度（含分支图）
- ✅ `forwardTape` 保存 forward primal，`backwardPass` 读取并统计 memory cost
- ✅ `canStepBackward` / `stepForwardOnce` / `stepBackwardOnce`：步进与一键模式状态隔离

### AttentionLab
- ✅ Multi-head：for each h，Q_h = X × W_Q^h，K_h = X × W_K^h，V_h = X × W_V^h
- ✅ Attention：A = softmax(QKᵀ / √dₖ)
- ✅ Output：O_h = A × V，Concat → O = Concat × W_O
- ✅ softmax 归一化为概率分布
- ✅ Causal mask：上三角置 −∞
- ✅ Positional encoding：sin/cos 在不同频率
- ✅ 维度追踪：head 维度 = d_model / num_heads
- ✅ 等变性：无 PE 且无 causal mask 时 Y(PX) = P·Y(X)，对 reverse / cyclic / swap / random 均验证

### OptimizationLandscapeLab
- ✅ Gradient：central difference `(f(x+h)−f(x−h))/(2h)`
- ✅ Momentum：经典定义 `v = βv + g`（非 EMA）
- ✅ RMSProp：`s = β₂s + (1−β₂)g²`
- ✅ Adam：bias-corrected `(v̂, ŝ) = (v/(1−β₁ᵗ), s/(1−β₂ᵗ))`
- ✅ Update：`θ = θ − lr × v̂ / (√ŝ + ε)`
- ✅ Loss 一致性：同一初始点、同一 loss 函数、同一 lr 下可复现
- ✅ `generateNoiseSequence`：确定性 Box-Muller；common / independent 两种模式
- ✅ 预设语义：GD η=0.5 一步到最优、η=1.0 等幅振荡、η=1.2 发散；新增鞍点预设

### EMELBOLab
- ✅ Gaussian PDF：`(2π√det)⁻¹ exp(−½(x−μ)ᵀΣ⁻¹(x−μ))`
- ✅ Log-domain：`logGaussian`、`logSumExp`、E-step、log-likelihood、ELBO / KL
- ✅ M-step：`μ_k = Σ r_ik x_i / Σ r_ik`，带 covariance floor / empty-component reset / π floor + 重归一化
- ✅ 带数值保护的 EM：完整迭代 likelihood 不降（未触发保护时）
- ✅ Label-invariant 中心误差：`Hungarian matching`，`meanCenterError = total / K`
- ✅ `runEM`：按相对 likelihood 变化收敛；`kMeansInit`：K-means++ 初始化；多起点诊断表

### DiffusionTimelineLab
- ✅ Forward：`z_t = √ᾱ_t × z_0 + √(1−ᾱ_t) × ε`
- ✅ Incremental forward：`z_t = √(1−β_t) × z_{t−1} + √β_t × ε_t`
- ✅ `ᾱ_t` 单调递减：`∏(1−β_s)` from s=0 to t
- ✅ `ε ~ N(0,I)` ∀t（标准高斯，时间无关）
- ✅ Seed 拆分：`dataSeed / forwardNoiseSeed / reverseNoiseSeed / compareSeed`
- ✅ `reverseStep` / `reverseChain`：支持外部 seed 或 RNG；最终步 deterministic
- ✅ Generation denoiser：2D Gaussian-mixture analytic score，`ε̂ = −√(1−ᾱ_t)·score_t(z)`
- ✅ `makeSharedHistogram`：双数据集共用 bin edges，便于叠加比较
- ✅ 条件分布一致性：固定 z0 下 closed-form / incremental 经验均值、协方差与理论 `N(√ᾱ_t z0, (1−ᾱ_t)I)` 一致
- ✅ 总体边缘分布比较（forward-compare）与条件分布比较（conditional-compare）并存

## 新增教学不变量测试（`src/pedagogical-tests/`）

- 优化预设：一步到最优 / 临界振荡 / 发散
- 扩散 score 方向、reverse chain 稳定性、closed/incremental 分布一致性、seed 可复现性、共享直方图
- EM likelihood 非降、`meanCenterError` 语义、K-means++ 参数合法性
- Attention 排列等变性
- Backprop 步进状态与完整反传梯度一致

## 待验证

- [ ] 所有页面的边缘情况（N=1，d_model=0，T=0）
- [ ] 浮点精度在极端参数下的稳定性
- [ ] 大规模输入（N > 1000）的性能
