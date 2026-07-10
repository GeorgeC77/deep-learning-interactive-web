# 深度学习交互式课程 | Deep Learning Interactive Course

一套面向深度学习初学者的交互式学习网站，内容严格跟随 Christopher Bishop & Hugh Bishop 的《Deep Learning: Foundations and Concepts》。

An interactive web-based learning platform for deep learning beginners, following Christopher Bishop & Hugh Bishop's "Deep Learning: Foundations and Concepts".

🔗 **在线访问 | Live**: https://georgec77.github.io/deep-learning-interactive-web/

## 课程结构 | Course Structure

- **先修知识 | Prerequisites**
  - 第 1 章：深度学习革命
  - 第 2 章：概率论
  - 第 3 章：标准分布
- **第一部分 — 监督学习基础 | Part I — Supervised Learning Foundations**
  - 第 4 章：单层网络：回归
  - 第 5 章：单层网络：分类
- **第二部分 — 深度神经网络 | Part II — Deep Neural Networks**
  - 第 6 章：深度神经网络
  - 第 7 章：梯度下降
  - 第 8 章：反向传播
  - 第 9 章：正则化
- **第三部分 — 结构化数据与序列 | Part III — Structured Data & Sequences**
  - 第 10 章：卷积网络
  - 第 11 章：结构化分布
  - 第 12 章：Transformer
  - 第 13 章：图神经网络
- **第四部分 — 概率模型与生成模型 | Part IV — Probabilistic & Generative Models**
  - 第 14 章：采样
  - 第 15 章：离散隐变量
  - 第 16 章：连续隐变量
  - 第 17 章：生成对抗网络
  - 第 18 章：归一化流（Normalizing Flows）
  - 第 19 章：自编码器
  - 第 20 章：扩散模型
- **附录 | Appendices**
  - 附录 A：线性代数
  - 附录 B：变分法
  - 附录 C：拉格朗日乘子

## 技术栈 | Tech Stack

React 19 + TypeScript + Vite + Tailwind CSS + shadcn/ui + KaTeX + D3

## 项目结构 | Project Structure

```
Deep_learning/
├── linear_regression_web/           # Main web application
│   ├── app/                         # Application source code
│   │   ├── src/
│   │   │   ├── components/          # React components & UI library
│   │   │   ├── pages/              # Chapter pages & demos
│   │   │   ├── course/             # Course manifest & coverage
│   │   │   └── data/               # Sample data
│   │   ├── scripts/                # Build & utility scripts
│   │   ├── public/                 # Static assets
│   │   └── package.json
│   ├── scripts/                     # PDF extraction & utility scripts
│   ├── info.md                      # Project information
│   ├── plan.md                      # Project plan (v1)
│   ├── plan-v2.md                   # Project plan (v2)
│   └── ML_LinearRegression_Style_Guide.docx
├── .gitignore
└── README.md
```

## 本地开发 | Local Development

```bash
cd linear_regression_web/app
npm install
npm run dev
```

## 构建 | Build

```bash
cd linear_regression_web/app
npm run build
```

## 许可 | License

本课程内容仅供个人学习交流使用，采用 CC BY-NC 4.0 非商业许可。

This course content is for personal educational use only, licensed under CC BY-NC 4.0.