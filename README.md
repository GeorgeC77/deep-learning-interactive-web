# CS229 机器学习交互式课程

基于 Stanford CS229 Lecture Notes（Andrew Ng & Tengyu Ma, 2023）构建的交互式机器学习学习网站。

🔗 **在线访问**：https://georgec77.github.io/machine-learning-interactive-web/

## 课程结构

网站按照 CS229 Lecture Notes 的完整目录组织，共分为五大部分：

- **Part I — Supervised Learning**
  - Linear Regression
  - Classification and Logistic Regression
  - Generalized Linear Models
  - Generative Learning Algorithms
  - Kernel Methods
  - Support Vector Machines
- **Part II — Deep Learning**
- **Part III — Generalization and Regularization**
- **Part IV — Unsupervised Learning**
- **Part V — Reinforcement Learning and Control**

每个章节的小节都有独立的网页。当前已完成：

- Chapter 1, Section 1.1: LMS algorithm（线性回归交互式内容）

其他小节为占位页面，将陆续补充交互式教学内容。

## 技术栈

- React 19 + TypeScript
- Vite
- Tailwind CSS + shadcn/ui
- KaTeX（公式渲染）
- D3.js（交互式图表）

## 本地开发

```bash
npm install
npm run dev
```

## 部署

项目使用 GitHub Actions 自动部署到 GitHub Pages。每次 `push` 到 `main` 分支后，Actions 会自动构建并发布。

## 版权声明

本课程内容采用 **Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)** 许可。

仅供个人学习交流使用。**未经授权，严禁以任何形式用于商业用途**，包括但不限于商业培训、付费课程、企业内训等。违者将依法追究法律责任。

详见 [LICENSE](./LICENSE)。
