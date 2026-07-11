# UI-Math 绑定审计报告

> 每个旗舰 demo 必须导入对应的 math lib 函数，不得重复实现核心数学。

| Page | testedMathFunction | importedByDemo | outputActuallyRendered | status |
|---|---|---|---|---|
| BackpropagationLab | forwardPass | ✅ | ✅ SVG + table | ✅ |
| BackpropagationLab | backwardPass | ✅ | ✅ SVG + table (Recoil<inId, number>) | ✅ |
| BackpropagationLab | centralDiff | ✅ | ✅ numerical check display | ✅ |
| AttentionLab | multiHeadAttention | ✅ | ✅ concat + final output table | ✅ |
| AttentionLab | softmax | ✅ | ✅ (via multiHeadAttention) | ✅ |
| AttentionLab | matMul | ✅ | ✅ (via multiHeadAttention) | ✅ |
| EMELBOLab | eStep | ✅ | ✅ responsibilities (color-coded scatter) | ✅ |
| EMELBOLab | mStep | ✅ | ✅ means/covs/pis update | ✅ |
| EMELBOLab | logLikelihood | ✅ | ✅ log-lik chart | ✅ |
| EMELBOLab | eigen2x2 | ✅ | ✅ covariance ellipses | ✅ |
| DiffusionTimelineLab | makeBetaSchedule | ✅ | ✅ alphaBar display | ✅ |
| DiffusionTimelineLab | alphaBar | ✅ | ✅ alphaBar display | ✅ |
| DiffusionTimelineLab | generateGaussianNoise | ✅ | ✅ epsilon via Box-Muller | ✅ |
| DiffusionTimelineLab | forwardClosed | ✅ | ✅ z_t visualization | ✅ |
| OptimizationLandscapeLab | loss | ✅ | ✅ contour grid | ✅ |
| OptimizationLandscapeLab | analyticalGrad | ✅ | ✅ gradient arrow | ✅ |
| OptimizationLandscapeLab | step | ✅ | ✅ optimizer paths | ✅ |
| OptimizationLandscapeLab | stationaryPoint | ✅ | ✅ ★ marker | ✅ |
| OptimizationLandscapeLab | hessianEigen | ✅ | ✅ eigenvalues display | ✅ |

## 未解决

- ELBO/KL: API 已拆分但 EMELBOLab 未暴露 ELBO 交互（需手动 q 调节器）
- DiffusionTimelineLab: 未实现 reverseStep（仅有 x0 prediction）
- BackpropagationLab: 无 branched graph preset
- OptimizationLandscapeLab: marching squares 精度有限
