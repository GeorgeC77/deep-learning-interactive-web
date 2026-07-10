# 数学验证报告

## 已验证的数学函数

### BackpropagationLab
- ✅ 链式法则：逐节点 ∂out/∂in × adjoint → 累积梯度
- ✅ 数值梯度校验：(f(w+h)−f(w−h))/(2h) vs 反传结果
- ✅ multiply 局部导数 = 另一个操作数
- ✅ sin 局部导数 = cos(input)
- ✅ add 局部导数 = 1（梯度不变传递）
- ✅ 反向模式一次性计算所有参数梯度（2 个权重 w1, w2）

### AttentionLab
- ✅ Multi-head: for each h, Q_h=X×W_Q^h, K_h=X×W_K^h, V_h=X×W_V^h
- ✅ Attention: A = softmax(QKᵀ/√dₖ)
- ✅ Output: O_h = A×V, Concat → O = Concat×W_O
- ✅ softmax 归一化为概率分布
- ✅ Causal mask: 上三角置 −∞
- ✅ Positional encoding: sin/cos 在不同频率
- ✅ 维度追踪：head 维度 = d_model / num_heads

### OptimizationLandscapeLab
- ✅ Gradient: central difference (f(x+h)−f(x−h))/(2h)
- ✅ Momentum: v = βv + (1-β)g
- ✅ RMSProp: s = β₂s + (1-β₂)g²
- ✅ Adam: bias-corrected (v̂, ŝ) = (v/(1-β₁ᵗ), s/(1-β₂ᵗ))
- ✅ Update: θ = θ − lr × v̂ / (√ŝ + ε)
- ✅ Loss 一致性：同一初始点、同一 loss 函数、同一 lr 下可复现

### EMELBOLab
- ✅ Gaussian PDF: (2π√det)⁻¹ exp(−½(x−μ)ᵀΣ⁻¹(x−μ))
- ✅ E-step: responsibilities = prior_k × N(x|μ_k,Σ_k) / sum
- ✅ M-step: μ_k = Σ r_ik x_i / Σ r_ik
- ✅ Log-likelihood monotonic increase property verified through iteration
- ✅ K-means: hard assignment = argmin distance

### DiffusionTimelineLab
- ✅ Forward: z_t = √ᾱ_t × z_0 + √(1-ᾱ_t) × ε
- ✅ Reverse: ẑ_0 = (z_t − √(1-ᾱ_t) × ε̂) / √ᾱ_t
- ✅ ᾱ_t 单调递减：∏(1-β_s) from s=0 to t
- ✅ ε ~ N(0,I) ∀t（标准高斯，时间无关）
- ✅ Loss = MSE(ε, ε̂) = (1/N) Σ ‖ε_i − ε̂_i‖²

## 待验证

- [ ] 所有页面的边缘情况（N=1, d_model=0, T=0）
- [ ] 浮点精度在极端参数下的稳定性
- [ ] 大规模输入（N > 1000）的性能
