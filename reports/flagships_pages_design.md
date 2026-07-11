# 旗舰页面设计文档

## 概述

五个旗舰页面采用新的 InteractiveLessonPage 框架（或维持 BishopSectionPage + 自定义 Lab 的模式），
每个页面遵循：问题引入 → 学生预测 → 操作实验 → 多视图联动 → 逐步解释 → 失败案例 → 检查点。

## 1. Ch7 梯度下降 — OptimizationLandscapeLab

**文件名**: `src/components/demos/OptimizationLandscapeLab.tsx`

**交互设计**:
- 4 种损失地表：quadratic / ill-conditioned / saddle / Rosenbrock
- 4 种优化器同屏对比：GD / Momentum / RMSProp / Adam
- 参数空间轨迹 + loss vs iteration 双视图
- 预设按钮：步长过小、振荡、发散、病态曲率、鞍点

**核心教学目标**:
- 理解不同优化器在相同起点和损失函数下的行为差异
- 观察动量如何加速收敛、Adam 如何自适应学习率
- 病态曲率时 GD 振荡剧烈而自适应方法平滑

## 2. Ch8 反向传播 — BackpropagationLab

**文件名**: `src/components/demos/BackpropagationLab.tsx`

**交互设计**:
- 可逐步执行的计算图：f(x,w₁,w₂) = w₂ · sin(w₁ · x + 1)
- Forward 按钮：逐节点计算 primal values
- Backward 按钮：逐节点计算 local derivatives 和 adjoints
- 箭头粗细 = 梯度大小
- 数值梯度校验：调节 h，显示相对误差
- 节点值表：前向值、局部梯度、累积梯度

**核心教学目标**:
- 直观理解链式法则在计算图中的传播
- 理解局部导数与累积梯度的区别
- 体验反向模式相对于有限差分的效率优势

## 3. Ch12 Attention — AttentionLab

**文件名**: `src/components/demos/AttentionLab.tsx`

**交互设计**:
- 真正的多头注意力计算：for each head: Q_h=X·W_Q, K_h=X·W_K, V_h=X·W_V
- 用户编辑 token 或选择预设句子
- 拖拽重排 token 顺序
- positional encoding 开关
- causal mask 开关
- 单头/多头切换
- 每个 head 独立 attention heatmap
- 点击矩阵单元显示 dot product 逐维计算
- 显示 Q/K/V/attention/output 维度
- 反例："猫追狗" vs "狗追猫" 在无 PE 时完全等价

**核心教学目标**:
- 理解 Q、K、V 通过输入 X 和不同权重矩阵投影得到
- 理解缩放因子 √dₖ 的作用
- 位置编码的必要性（通过反例说明）

## 4. Ch15 EM/ELBO — EMELBOLab

**文件名**: `src/components/demos/EMELBOLab.tsx`

**交互设计**:
- 二维 GMM 数据可视化
- E-step 与 M-step 分步执行
- log likelihood 变化曲线
- 对比 soft EM 与 K-means hard assignment
- 随机重置观察不同初始化的影响

**核心教学目标**:
- 理解 EM 通过交替优化 ELBO 间接提升对数似然
- 理解 E 步中 q(z)=p(z|x,θ) 时 KL=0，ELBO 接触 log p(x)
- 理解 K-means 是 EM 的 hard assignment 特例

## 5. Ch20 Diffusion — DiffusionTimelineLab

**文件名**: `src/components/demos/DiffusionTimelineLab.tsx`

**交互设计**:
- 二维点云（圆/Swiss Roll/Moons）
- 时间轴 slider t=0..T
- 同时显示 z₀、ε、z_t、ẑ₀
- ε̂ 含噪声开关（模拟不完美预测）
- z₀, z_t, ẑ₀ 三视图并排
- ᾱ_t 实时显示

**核心教学目标**:
- 理解正向扩散：z_t = √ᾱ_t·z₀ + √(1-ᾱ_t)·ε
- 理解 ε 在所有时间步都服从 N(0,I)，因此目标尺度统一
- 理解 z_t 由 z₀ 和 ε 构造，网络从 z_t 和 t 推断 ε
