# 项目结构说明

## 概述

**深度学习交互式课程 (Deep Learning Interactive Web)** —— 一套面向深度学习初学者的交互式学习网站，内容严格跟随 Christopher Bishop & Hugh Bishop 的《Deep Learning: Foundations and Concepts》。

- **在线访问**: https://georgec77.github.io/deep-learning-interactive-web/
- **技术栈**: React 19 + TypeScript + Vite + Tailwind CSS + shadcn/ui + KaTeX + D3

---

## 目录结构

```
Deep_learning/
├── src/                        # 源代码（核心）
│   ├── components/             # 通用组件
│   │   ├── ui/                 # shadcn/ui 基础组件（自动生成）
│   │   ├── demos/              # 交互式 Demo 组件
│   │   └── ...                 # 业务组件
│   ├── pages/                  # 页面
│   │   ├── chapters/           # 手动编写的章节页面
│   │   ├── generated/          # 自动生成的 Bishop 对齐页面
│   │   ├── prerequisite/       # 先修知识页面
│   │   ├── HomePage.tsx        # 首页
│   │   └── DynamicPlaceholderPage.tsx
│   ├── course/                 # 课程结构定义
│   │   ├── manifest.ts         # 课程大纲与路由
│   │   └── coverage_matrix.json # Bishop 章节映射
│   ├── data/                   # 静态数据
│   ├── hooks/                  # 自定义 Hooks
│   ├── lib/                    # 工具函数
│   ├── App.tsx                 # 主应用入口
│   └── main.tsx                # Vite 入口
│
├── scripts/                    # 构建 & 审计脚本（仅保留核心）
│   ├── generate-double-descent-data.cjs  # 生成 double descent 数据（dev/build 前运行）
│   ├── build-coverage-matrix.cjs         # 生成 coverage_matrix.json
│   ├── check-coverage.cjs                # 审计路由 & 元数据一致性
│   ├── audit_bishop_alignment.ts         # 审计 Bishop 教材对齐度
│   └── allowedSubsections.json           # 审计用的合法子节列表
│
├── public/                     # 静态资源（直接复制到构建输出）
│   ├── 404.html
│   ├── og-image.png
│   └── data/
│
├── references/                 # 参考文献
│   └── Deep Learning Foundations and Concepts (...Bishop).pdf  # 教材
│   └── toc.txt                 # 教材目录
│
├── reports/                    # 自动生成的审计/覆盖报告（gitignore）
│   ├── coverage_report.md
│   ├── route_audit_report.md
│   └── invalid_bishop_subsections_report.md
│
├── archive/                    # 归档（已 gitignore，不推送）
│   ├── linear_regression_web/  # 项目旧版副本
│   ├── scripts/                # 一次性修复/生成脚本（21个）
│   ├── node.zip / node22.zip   # Node.js 离线安装包
│   └── nodejs/                 # 本地 Node 运行时
│
├── dist/                       # 构建输出（gitignore）
├── node_modules/               # 依赖（gitignore）
│
├── config/                     # 工程配置文件
│   ├── vite.config.ts          # Vite 配置
│   ├── tailwind.config.js      # Tailwind CSS 配置
│   ├── postcss.config.js       # PostCSS 配置
│   ├── eslint.config.js        # ESLint 配置
│   ├── components.json         # shadcn/ui 配置
│   ├── tsconfig.app.json       # 应用 TS 配置
│   └── tsconfig.node.json      # Node 端 TS 配置
│
├── docs/                       # 项目文档
│   ├── PROJECT_STRUCTURE.md    # 本文档
│   └── LICENSE_AND_ATTRIBUTION.md  # 许可与版权归属
│
├── index.html                  # Vite HTML 入口
├── tsconfig.json               # TypeScript solution 配置
├── package.json                # 项目依赖与脚本
├── package-lock.json           # 依赖锁定
├── .gitignore                  # Git 忽略规则
├── LICENSE                     # 许可
└── README.md                   # 项目说明
```

---

## 课程结构

| 分类 | 章节 |
|---|---|
| 先修知识 | 第1章：深度学习革命 / 第2章：概率论 / 第3章：标准分布 |
| 第一部分 — 监督学习基础 | 第4章：单层网络：回归 / 第5章：单层网络：分类 |
| 第二部分 — 深度神经网络 | 第6章：深度神经网络 / 第7章：梯度下降 / 第8章：反向传播 / 第9章：正则化 |
| 第三部分 — 结构化数据与序列 | 第10章：卷积网络 / 第11章：结构化分布 / 第12章：Transformer / 第13章：图神经网络 |
| 第四部分 — 概率模型与生成模型 | 第14章：采样 / 第15章：离散隐变量 / 第16章：连续隐变量 / 第17章：生成对抗网络 / 第18章：归一化流 / 第19章：自编码器 / 第20章：扩散模型 |
| 附录 | 附录A：线性代数 / 附录B：变分法 / 附录C：拉格朗日乘子 |

---

## 常用命令

```bash
npm run dev              # 启动本地开发服务器
npm run build            # 生产构建
npm run coverage:build   # 生成覆盖矩阵
npm run coverage:check   # 运行路由审计
npm run audit:bishop     # 审计 Bishop 教材对齐度
npm run lint             # ESLint 检查
```

---

## .gitignore 说明

以下内容不会被推送到 GitHub：

- `node_modules/` — npm 依赖
- `dist/` — 构建输出
- `archive/` — 归档文件（旧版副本、一次性脚本、Node 安装包等）
- `reports/` — 自动生成的审计报告

---


## 注意事项

- 网站章节号与 Bishop 教材章节号不一一对应。UI 中标注 `Bishop Ch N` 以示区分。
- 所有章节页面应包含 `<SectionMetadata />` 组件。
- GitHub Pages 使用 HashRouter 确保刷新时路由正常工作。
