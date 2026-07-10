# 修复计划 - 交互式线性回归教学网页

## 问题总结
1. **KaTeX.tsx 缺少 fixLatexString** → 所有 `\mathcal`, `\ldots` 等被转义为控制字符
2. **GradientDescentPage.tsx** → 当前是二维等高线图，用户要求一维多峰代价函数展示：学习率太小陷入局部最优、太大震荡
3. **OverfittingPage.tsx** → 缺少交互式阶数滑块

## Stage 1: 修复 KaTeX.tsx
- 添加 fixLatexString 函数处理控制字符转义

## Stage 2: 重写 GradientDescentPage.tsx
- 一维多峰代价函数: J(θ) = 0.06*(θ-2)²*(θ-6)² + 0.5
- 两个谷底: θ=2(局部最优), θ=6(全局最优)
- 三个预设学习率:
  - α=0.12 → 陷入局部最优
  - α=0.40 → 适中，到达全局最优
  - α=1.20 → 太大，谷间震荡
- 带动量(β=0.85)的梯度下降实现震荡

## Stage 3: 重写 OverfittingPage.tsx
- 阶数滑块 1-15
- 复杂非线性数据生成
- 固定坐标轴
- 训练/测试误差曲线

## Stage 4: 构建 + 部署
