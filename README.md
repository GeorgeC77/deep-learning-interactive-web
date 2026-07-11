# 深度学习交互式课程

一套面向深度学习初学者的交互式学习网站，内容严格跟随 Christopher Bishop & Hugh Bishop 的《Deep Learning: Foundations and Concepts》。

🔗 **在线访问**：https://georgec77.github.io/deep-learning-interactive-web/

## 课程结构

- **先修知识**
  - 第 1 章：深度学习革命
  - 第 2 章：概率论
  - 第 3 章：标准分布
- **第一部分 — 监督学习基础**
  - 第 4 章：单层网络：回归
  - 第 5 章：单层网络：分类
- **第二部分 — 深度神经网络**
  - 第 6 章：深度神经网络
  - 第 7 章：梯度下降
  - 第 8 章：反向传播
  - 第 9 章：正则化
- **第三部分 — 结构化数据与序列**
  - 第 10 章：卷积网络
  - 第 11 章：结构化分布
  - 第 12 章：Transformer
  - 第 13 章：图神经网络
- **第四部分 — 概率模型与生成模型**
  - 第 14 章：采样
  - 第 15 章：离散隐变量
  - 第 16 章：连续隐变量
  - 第 17 章：生成对抗网络
  - 第 18 章：归一化流（Normalizing Flows）
  - 第 19 章：自编码器
  - 第 20 章：扩散模型
- **附录**
  - 附录 A：线性代数
  - 附录 B：变分法
  - 附录 C：拉格朗日乘子

## 技术栈

React 19 + TypeScript + Vite + Tailwind CSS + shadcn/ui + KaTeX + D3

## 本地开发

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```

## 常用命令

| 命令 | 说明 |
|---|---|
| `npm run dev` | 启动本地开发服务器 |
| `npm run build` | 生产构建 |
| `npm run coverage:build` | 生成 Bishop 覆盖矩阵 |
| `npm run coverage:check` | 审计路由和元数据 |
| `npm run audit:bishop` | 审计 Bishop 教材对齐度 |
| `npm run lint` | ESLint 检查 |

## 部署

- GitHub Pages: https://georgec77.github.io/deep-learning-interactive-web/
- 使用 HashRouter，确保刷新时路由正常
- Vite base 路径: `/deep-learning-interactive-web/`

## 注意事项

- 网站章节号与 Bishop 教材章节号不一一对应，UI 中标注 `Bishop Ch N` 区分
- 所有章节页面需包含 `<SectionMetadata />` 组件
- 详细项目结构见 [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)

## 许可

代码：MIT。教材原文、原图及习题解答版权归原作者和出版方所有。
