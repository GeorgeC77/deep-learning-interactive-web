# 机器学习交互式课程

一套面向机器学习初学者的交互式学习网站。

🔗 **在线访问**：https://georgec77.github.io/machine-learning-interactive-web/

## 课程结构

网站覆盖机器学习从基础到进阶的核心主题，共分为五大部分：

- **第一部分 — 监督学习**
  - 线性回归
  - 分类与逻辑回归
  - 广义线性模型
  - 生成学习算法
  - 核方法
  - 支持向量机
- **第二部分 — 深度学习**
- **第三部分 — 泛化与正则化**
- **第四部分 — 无监督学习**
- **第五部分 — 强化学习**

每个章节的小节都有独立的网页。当前已完成：

- 第一章第一节：LMS 算法（线性回归交互式内容）

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
