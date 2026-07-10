import json
from pathlib import Path

OUT_PATH = Path("e:/python_project/Lecture/Deep_learning/linear_regression_web/app/src/course/manifest.ts")

# Define the new Bishop-based course structure.
# Each chapter has an id, title, bishopChapter label, and sections.
# Section statuses: completed / beta / draft.

parts = [
    {
        "id": "part-0",
        "number": 0,
        "title": "先修知识",
        "kind": "prerequisite",
        "bishopRange": "Bishop Ch 1–3",
        "chapters": [
            {
                "id": "pre-ch01",
                "number": 1,
                "title": "深度学习革命",
                "bishopChapter": "Ch 1",
                "sections": [
                    {"id": "pre-ch01-overview", "title": "课程概览", "path": "/prerequisite/ch01/overview", "status": "beta", "description": "深度学习的影响、 tutorial 示例与学习路线。"},
                    {"id": "pre-ch01-impact", "title": "1.1 深度学习的影响", "path": "/prerequisite/ch01/impact", "status": "beta", "description": "医疗诊断、蛋白质结构、图像合成、大语言模型等应用。"},
                    {"id": "pre-ch01-tutorial", "title": "1.2 Tutorial：多项式曲线拟合", "path": "/prerequisite/ch01/tutorial", "status": "beta", "description": "合成数据、线性模型、误差函数、模型复杂度、正则化与模型选择。"},
                    {"id": "pre-ch01-history", "title": "1.3 机器学习简史", "path": "/prerequisite/ch01/history", "status": "beta", "description": "单层网络、反向传播与深度网络的发展。"},
                ],
            },
            {
                "id": "pre-ch02",
                "number": 2,
                "title": "概率论",
                "bishopChapter": "Ch 2",
                "sections": [
                    {"id": "pre-ch02-overview", "title": "课程概览", "path": "/prerequisite/ch02/overview", "status": "beta", "description": "不确定性的两类来源、概率论在机器学习中的核心作用。"},
                    {"id": "pre-ch02-rules", "title": "2.1 概率规则", "path": "/prerequisite/ch02/rules", "status": "beta", "description": "和规则、积规则、贝叶斯定理、先验与后验。"},
                    {"id": "pre-ch02-densities", "title": "2.2 概率密度", "path": "/prerequisite/ch02/densities", "status": "beta", "description": "连续随机变量、期望、协方差。"},
                    {"id": "pre-ch02-gaussian", "title": "2.3 高斯分布", "path": "/prerequisite/ch02/gaussian", "status": "beta", "description": "均值与方差、似然函数、最大似然的偏差、线性回归的概率视角。"},
                    {"id": "pre-ch02-information", "title": "2.4 信息论", "path": "/prerequisite/ch02/information", "status": "beta", "description": "熵、微分熵、KL 散度、互信息。"},
                    {"id": "pre-ch02-bayesian", "title": "2.5 贝叶斯概率", "path": "/prerequisite/ch02/bayesian", "status": "beta", "description": "模型参数、正则化与贝叶斯机器学习。"},
                ],
            },
            {
                "id": "pre-ch03",
                "number": 3,
                "title": "标准分布",
                "bishopChapter": "Ch 3",
                "sections": [
                    {"id": "pre-ch03-overview", "title": "课程概览", "path": "/prerequisite/ch03/overview", "status": "beta", "description": "离散与连续标准分布、指数族与非参数方法。"},
                    {"id": "pre-ch03-discrete", "title": "3.1 离散变量", "path": "/prerequisite/ch03/discrete", "status": "beta", "description": "Bernoulli、Binomial 与 Multinomial 分布。"},
                    {"id": "pre-ch03-mvgaussian", "title": "3.2 多元高斯", "path": "/prerequisite/ch03/mvgaussian", "status": "beta", "description": "几何、矩、条件分布、边缘分布、最大似然。"},
                    {"id": "pre-ch03-exponential", "title": "3.3 指数族", "path": "/prerequisite/ch03/exponential", "status": "beta", "description": "指数族分布的统一形式与充分统计量。"},
                    {"id": "pre-ch03-nonparametric", "title": "3.4 非参数方法", "path": "/prerequisite/ch03/nonparametric", "status": "beta", "description": "直方图、核密度估计与最近邻。"},
                ],
            },
        ],
    },
    {
        "id": "part-1",
        "number": 1,
        "title": "监督学习基础",
        "kind": "main",
        "bishopRange": "Bishop Ch 4–5",
        "chapters": [
            {
                "id": "ch01",
                "number": 1,
                "title": "单层网络：回归",
                "bishopChapter": "Ch 4",
                "sections": [
                    {"id": "ch01-overview", "title": "课程概览", "path": "/ch01/overview", "status": "completed", "description": "线性回归作为最简单的单层神经网络。"},
                    {"id": "ch01-model", "title": "1.1 模型表示与基函数", "path": "/ch01/model", "status": "completed", "description": "线性模型、基函数、多项式/高斯/sigmoid 基函数。"},
                    {"id": "ch01-cost", "title": "1.2 代价函数与最大似然", "path": "/ch01/cost-function", "status": "completed", "description": "平方误差、高斯噪声假设、最大似然。"},
                    {"id": "ch01-gd", "title": "1.3 梯度下降与序列学习", "path": "/ch01/gradient-descent", "status": "completed", "description": "批量梯度下降、LMS / 随机梯度下降。"},
                    {"id": "ch01-normal", "title": "1.4 正规方程", "path": "/ch01/normal-equation", "status": "completed", "description": "设计矩阵与闭式解。"},
                    {"id": "ch01-prob", "title": "1.5 概率解释", "path": "/ch01/probabilistic", "status": "completed", "description": "高斯噪声与最大似然的等价性。"},
                    {"id": "ch01-overfit", "title": "1.6 过拟合与正则化", "path": "/ch01/overfitting", "status": "completed", "description": "过拟合、训练/测试误差、正则化与偏差-方差。"},
                ],
            },
            {
                "id": "ch02",
                "number": 2,
                "title": "单层网络：分类",
                "bishopChapter": "Ch 5",
                "sections": [
                    {"id": "ch02-overview", "title": "课程概览", "path": "/ch02/overview", "status": "draft", "description": "分类问题、判别函数与决策边界。"},
                ],
            },
        ],
    },
    {
        "id": "part-2",
        "number": 2,
        "title": "深度神经网络",
        "kind": "main",
        "bishopRange": "Bishop Ch 6–9",
        "chapters": [
            {
                "id": "ch03",
                "number": 3,
                "title": "深度神经网络",
                "bishopChapter": "Ch 6",
                "sections": [
                    {"id": "ch03-overview", "title": "课程概览", "path": "/ch03/overview", "status": "draft", "description": "多层网络、激活函数与深度学习的表示能力。"},
                ],
            },
            {
                "id": "ch04",
                "number": 4,
                "title": "梯度下降",
                "bishopChapter": "Ch 7",
                "sections": [
                    {"id": "ch04-overview", "title": "课程概览", "path": "/ch04/overview", "status": "draft", "description": "误差曲面、批量/SGD、动量、Adam、学习率调度。"},
                ],
            },
            {
                "id": "ch05",
                "number": 5,
                "title": "反向传播",
                "bishopChapter": "Ch 8",
                "sections": [
                    {"id": "ch05-overview", "title": "课程概览", "path": "/ch05/overview", "status": "draft", "description": "计算图、链式法则与反向传播算法。"},
                ],
            },
            {
                "id": "ch06",
                "number": 6,
                "title": "正则化",
                "bishopChapter": "Ch 9",
                "sections": [
                    {"id": "ch06-overview", "title": "课程概览", "path": "/ch06/overview", "status": "draft", "description": "权重衰减、早停、Dropout、双下降。"},
                ],
            },
        ],
    },
    {
        "id": "part-3",
        "number": 3,
        "title": "结构化数据与序列",
        "kind": "main",
        "bishopRange": "Bishop Ch 10–13",
        "chapters": [
            {
                "id": "ch07",
                "number": 7,
                "title": "卷积网络",
                "bishopChapter": "Ch 10",
                "sections": [
                    {"id": "ch07-overview", "title": "课程概览", "path": "/ch07/overview", "status": "draft", "description": "卷积、池化、CNN 架构与视觉任务。"},
                ],
            },
            {
                "id": "ch08",
                "number": 8,
                "title": "结构化分布",
                "bishopChapter": "Ch 11",
                "sections": [
                    {"id": "ch08-overview", "title": "课程概览", "path": "/ch08/overview", "status": "draft", "description": "图模型、条件独立与序列模型。"},
                ],
            },
            {
                "id": "ch09",
                "number": 9,
                "title": "Transformer",
                "bishopChapter": "Ch 12",
                "sections": [
                    {"id": "ch09-overview", "title": "课程概览", "path": "/ch09/overview", "status": "draft", "description": "注意力、自注意力、多头注意力与大语言模型。"},
                ],
            },
            {
                "id": "ch10",
                "number": 10,
                "title": "图神经网络",
                "bishopChapter": "Ch 13",
                "sections": [
                    {"id": "ch10-overview", "title": "课程概览", "path": "/ch10/overview", "status": "draft", "description": "消息传递、GCN、GAT 与几何深度学习。"},
                ],
            },
        ],
    },
    {
        "id": "part-4",
        "number": 4,
        "title": "概率模型与生成模型",
        "kind": "main",
        "bishopRange": "Bishop Ch 14–20",
        "chapters": [
            {
                "id": "ch11",
                "number": 11,
                "title": "采样",
                "bishopChapter": "Ch 14",
                "sections": [
                    {"id": "ch11-overview", "title": "课程概览", "path": "/ch11/overview", "status": "draft", "description": "拒绝采样、重要性采样、MCMC、Gibbs 与 Langevin。"},
                ],
            },
            {
                "id": "ch12",
                "number": 12,
                "title": "离散隐变量",
                "bishopChapter": "Ch 15",
                "sections": [
                    {"id": "ch12-overview", "title": "课程概览", "path": "/ch12/overview", "status": "draft", "description": "K-means、高斯混合模型与 EM 算法。"},
                ],
            },
            {
                "id": "ch13",
                "number": 13,
                "title": "连续隐变量",
                "bishopChapter": "Ch 16",
                "sections": [
                    {"id": "ch13-overview", "title": "课程概览", "path": "/ch13/overview", "status": "draft", "description": "PCA、因子分析、ICA 与非线性隐变量模型。"},
                ],
            },
            {
                "id": "ch14",
                "number": 14,
                "title": "生成对抗网络",
                "bishopChapter": "Ch 17",
                "sections": [
                    {"id": "ch14-overview", "title": "课程概览", "path": "/ch14/overview", "status": "draft", "description": "对抗训练、GAN 损失与 CycleGAN。"},
                ],
            },
            {
                "id": "ch15",
                "number": 15,
                "title": "标准化流",
                "bishopChapter": "Ch 18",
                "sections": [
                    {"id": "ch15-overview", "title": "课程概览", "path": "/ch15/overview", "status": "draft", "description": "耦合流、自回归流、连续流与神经 ODE。"},
                ],
            },
            {
                "id": "ch16",
                "number": 16,
                "title": "自编码器",
                "bishopChapter": "Ch 19",
                "sections": [
                    {"id": "ch16-overview", "title": "课程概览", "path": "/ch16/overview", "status": "draft", "description": "线性/深度/稀疏/去噪自编码器与 VAE。"},
                ],
            },
            {
                "id": "ch17",
                "number": 17,
                "title": "扩散模型",
                "bishopChapter": "Ch 20",
                "sections": [
                    {"id": "ch17-overview", "title": "课程概览", "path": "/ch17/overview", "status": "draft", "description": "前向/反向扩散、ELBO、分数匹配与引导扩散。"},
                ],
            },
        ],
    },
    {
        "id": "part-5",
        "number": 5,
        "title": "附录",
        "kind": "appendix",
        "bishopRange": "Appendix A–C",
        "chapters": [
            {
                "id": "appendix-a",
                "number": 1,
                "title": "线性代数",
                "bishopChapter": "Appendix A",
                "sections": [
                    {"id": "appendix-a-overview", "title": "矩阵运算", "path": "/appendix/a/overview", "status": "draft", "description": "矩阵恒等式、迹、行列式、导数与特征向量。"},
                ],
            },
            {
                "id": "appendix-b",
                "number": 2,
                "title": "变分法",
                "bishopChapter": "Appendix B",
                "sections": [
                    {"id": "appendix-b-overview", "title": "变分法基础", "path": "/appendix/b/overview", "status": "draft", "description": "泛函导数与欧拉-拉格朗日方程。"},
                ],
            },
            {
                "id": "appendix-c",
                "number": 3,
                "title": "拉格朗日乘子",
                "bishopChapter": "Appendix C",
                "sections": [
                    {"id": "appendix-c-overview", "title": "约束优化", "path": "/appendix/c/overview", "status": "draft", "description": "等式约束与拉格朗日乘子法。"},
                ],
            },
        ],
    },
]


def status_sort_weight(status):
    return {"completed": 0, "beta": 1, "draft": 2}.get(status, 2)


def generate():
    lines = []
    lines.append('export type SectionStatus = "draft" | "beta" | "completed";\n')
    lines.append("")
    lines.append("export type Section = {")
    lines.append("  id: string;")
    lines.append("  title: string;")
    lines.append("  path: string;")
    lines.append("  status: SectionStatus;")
    lines.append("  description?: string;")
    lines.append("};")
    lines.append("")
    lines.append("export type PartKind = 'prerequisite' | 'main' | 'appendix';")
    lines.append("")
    lines.append("export type Chapter = {")
    lines.append("  id: string;")
    lines.append("  number: number;")
    lines.append("  title: string;")
    lines.append("  bishopChapter?: string;")
    lines.append("  sections: Section[];")
    lines.append("};")
    lines.append("")
    lines.append("export type Part = {")
    lines.append("  id: string;")
    lines.append("  number: number;")
    lines.append("  title: string;")
    lines.append("  kind: PartKind;")
    lines.append("  bishopRange?: string;")
    lines.append("  chapters: Chapter[];")
    lines.append("};")
    lines.append("")
    lines.append("export const courseManifest: Part[] = [")

    for pi, part in enumerate(parts):
        if pi > 0:
            lines.append("  },")
        lines.append("  {")
        lines.append(f'    id: "{part["id"]}",')
        lines.append(f'    number: {part["number"]},')
        lines.append(f'    title: "{part["title"]}",')
        lines.append(f'    kind: "{part["kind"]}",')
        if part.get("bishopRange"):
            lines.append(f'    bishopRange: "{part["bishopRange"]}",')
        lines.append("    chapters: [")
        for ci, chapter in enumerate(part["chapters"]):
            if ci > 0:
                lines.append("      },")
            lines.append("      {")
            lines.append(f'        id: "{chapter["id"]}",')
            lines.append(f'        number: {chapter["number"]},')
            lines.append(f'        title: "{chapter["title"]}",')
            if chapter.get("bishopChapter"):
                lines.append(f'        bishopChapter: "{chapter["bishopChapter"]}",')
            lines.append("        sections: [")
            for si, section in enumerate(chapter["sections"]):
                comma = "," if si < len(chapter["sections"]) - 1 else ""
                desc = section.get("description", "")
                lines.append("          {")
                lines.append(f'            id: "{section["id"]}",')
                lines.append(f'            title: "{section["title"]}",')
                lines.append(f'            path: "{section["path"]}",')
                lines.append(f'            status: "{section["status"]}",')
                if desc:
                    lines.append(f'            description: "{desc}",')
                lines.append(f"          }}{comma}")
            lines.append("        ],")
        lines.append("      },")
        # remove trailing comma from last chapter by replacing last line
        if lines[-1].endswith(","):
            lines[-1] = lines[-1][:-1]
        lines.append("    ],")
    lines.append("  },")
    # remove trailing comma from last part
    if lines[-1].endswith(","):
        lines[-1] = lines[-1][:-1]
    lines.append("];")

    # Helper functions
    lines.append("""
export function getAllSections(): Section[] {
  return courseManifest.flatMap((part) => part.chapters.flatMap((chapter) => chapter.sections));
}

export function getSectionByPath(path: string): Section | undefined {
  return getAllSections().find((section) => section.path === path);
}

export function getCompletedSections(): Section[] {
  return getAllSections().filter((section) => section.status === "completed");
}

export function getBetaSections(): Section[] {
  return getAllSections().filter((section) => section.status === "beta");
}

export function getDraftSections(): Section[] {
  return getAllSections().filter((section) => section.status === "draft");
}

export function getTotalSectionCount(): number {
  return getAllSections().length;
}

export function getCompletedCount(): number {
  return getCompletedSections().length;
}

export function getBetaCount(): number {
  return getBetaSections().length;
}

export function getDraftCount(): number {
  return getDraftSections().length;
}

export function getChapterStatus(chapter: Chapter): SectionStatus {
  const statuses = chapter.sections.map((s) => s.status);
  if (statuses.some((s) => s === "draft")) return "draft";
  if (statuses.some((s) => s === "beta")) return "beta";
  return "completed";
}

export function statusLabel(status: SectionStatus): string {
  switch (status) {
    case "draft":
      return "制作中";
    case "beta":
      return "预览版";
    case "completed":
      return "已完成";
    default:
      return "";
  }
}

export function getPartByChapterId(chapterId: string): Part | undefined {
  return courseManifest.find((part) => part.chapters.some((chapter) => chapter.id === chapterId));
}

export function getChapterById(chapterId: string): Chapter | undefined {
  for (const part of courseManifest) {
    const chapter = part.chapters.find((c) => c.id === chapterId);
    if (chapter) return chapter;
  }
  return undefined;
}

export function getChapterDisplayLabel(chapter: Chapter, part?: Part): string {
  const p = part ?? getPartByChapterId(chapter.id);
  if (!p) return `${chapter.number}. ${chapter.title}`;
  if (p.kind === "prerequisite") return `先修 Ch ${chapter.number}`;
  if (p.kind === "appendix") {
    const label = chapter.bishopChapter?.replace("Appendix ", "") ?? String(chapter.number);
    return `附录 ${label}`;
  }
  return `Ch ${chapter.number}`;
}

export function getChapterFullTitle(chapter: Chapter, part?: Part): string {
  const label = getChapterDisplayLabel(chapter, part);
  return `${label}. ${chapter.title}`;
}
""")

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text("\n".join(lines), encoding="utf-8")
    print(f"Generated {OUT_PATH}")


if __name__ == "__main__":
    generate()
