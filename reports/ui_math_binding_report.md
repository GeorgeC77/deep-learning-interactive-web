# UI-Math 绑定审计报告

> 更新日期：2026-06-29

> 每个旗舰 demo 必须导入对应的 math lib 函数，不得重复实现核心数学。

| Page | testedMathFunction | importedByDemo | outputActuallyRendered | status |
|---|---|---|---|---|
| BackpropagationLab | `forwardTape` | ✅ | ✅ SVG + table + tape | ✅ |
| BackpropagationLab | `backwardPass` | ✅ | ✅ 梯度表（step trace / 一键） | ✅ |
| BackpropagationLab | `centralDiff` | ✅ | ✅ numerical check display | ✅ |
| BackpropagationLab | `canStepBackward` | ✅ | ✅ Next Bwd disabled state | ✅ |
| BackpropagationLab | `stepForwardOnce` / `stepBackwardOnce` | ✅ | ✅ 步进按钮与一键模式隔离 | ✅ |
| AttentionLab | `multiHeadAttention` | ✅ | ✅ concat + final output table | ✅ |
| AttentionLab | `softmax` | ✅ | ✅ via `multiHeadAttention` | ✅ |
| AttentionLab | `matMul` | ✅ | ✅ via `multiHeadAttention` | ✅ |
| EMELBOLab | `eStep` | ✅ | ✅ responsibilities（color-coded scatter） | ✅ |
| EMELBOLab | `mStep` / `mStepDetailed` | ✅ | ✅ means/covs/pis update | ✅ |
| EMELBOLab | `logLikelihood` | ✅ | ✅ log-lik chart | ✅ |
| EMELBOLab | `elbo` / `klResponsibilities` | ✅ | ✅ ELBO 交互面板 + “令 q = posterior” | ✅ |
| EMELBOLab | `eigen2x2` | ✅ | ✅ covariance ellipses（vals/vecs 配对正确） | ✅ |
| EMELBOLab | `runEM` / `kMeansInit` | ✅ | ✅ multi-start 收敛表格 | ✅ |
| EMELBOLab | `meanCenterError` | ✅ | ✅ 页面显示 mean = total / K（showTruth 开启后） | ✅ |
| DiffusionTimelineLab | `makeBetaSchedule` | ✅ | ✅ alphaBar display | ✅ |
| DiffusionTimelineLab | `alphaBar` | ✅ | ✅ alphaBar display | ✅ |
| DiffusionTimelineLab | `generateGaussianNoise` | ✅ | ✅ epsilon via Box-Muller | ✅ |
| DiffusionTimelineLab | `forwardClosed` / `forwardIncremental` | ✅ | ✅ z_t visualization | ✅ |
| DiffusionTimelineLab | `reverseChain` / `reverseStep` | ✅ | ✅ reverse trajectory + mean-only note | ✅ |
| DiffusionTimelineLab | `gaussianMixtureScore` / `epsilonFromScore` | ✅ | ✅ generation denoiser + score field | ✅ |
| DiffusionTimelineLab | `makeSharedHistogram` | ✅ | ✅ 共同 bin edges 的 histogram | ✅ |
| OptimizationLandscapeLab | `loss` | ✅ | ✅ contour grid | ✅ |
| OptimizationLandscapeLab | `analyticalGrad` | ✅ | ✅ gradient arrow | ✅ |
| OptimizationLandscapeLab | `step` | ✅ | ✅ optimizer paths | ✅ |
| OptimizationLandscapeLab | `generateNoiseSequence` | ✅ | ✅ common / independent noise | ✅ |
| OptimizationLandscapeLab | `stationaryPoint` | ✅ | ✅ ★ marker + dynamic caption | ✅ |
| OptimizationLandscapeLab | `hessianEigen` | ✅ | ✅ eigenvalues display | ✅ |

## 已解决

- ✅ ELBO/KL：EMELBOLab 已暴露 ELBO 交互（手动 q 调节器 + posterior 按钮）
- ✅ DiffusionTimelineLab：已实现 `reverseChain` / `reverseStep`、条件分布一致性、独立 seed 拆分
- ✅ BackpropagationLab：已实现 branched graph preset 与 tape 视图，步进/一键模式隔离
- ✅ OptimizationLandscapeLab：common / independent noise 与预设语义已对齐
- ✅ EMELBOLab：`showTruth` 隐藏真值，`meanCenterError` 语义与 K-means++ 初始化已接入

## 未实现

- ❌ **PredictionGate**：所有页面均未实现“先预测、锁定、再显示结果”的完整教学流程。该功能不在当前 math-lib 绑定审计范围内，需在 UI 层单独设计与实现。
