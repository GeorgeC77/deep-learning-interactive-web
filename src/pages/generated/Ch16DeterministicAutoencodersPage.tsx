import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Box,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  ShieldAlert,
  SlidersHorizontal,
} from 'lucide-react';
import ConceptCard from '@/components/ConceptCard';
import FormulaCard from '@/components/FormulaCard';
import InteractiveDemo from '@/components/InteractiveDemo';
import KaTeX from '@/components/KaTeX';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { getAllSections, getSectionByPath } from '@/course/manifest';
import type { Section } from '@/course/manifest';

const SECTION_PATH = '/ch16/deterministic-autoencoders';

export default function Ch16DeterministicAutoencodersPage() {
  const section = getSectionByPath(SECTION_PATH);
  const allSections = getAllSections();
  const currentIndex = allSections.findIndex((s) => s.path === SECTION_PATH);
  const prevSection: Section | null = allSections[currentIndex - 1] ?? null;
  const nextSection: Section | null = allSections[currentIndex + 1] ?? null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Hero */}
      <section className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
            <Box className="w-9 h-9 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{section?.title ?? '19.1 确定性自编码器'}</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          确定性自编码器直接学习输入到隐向量、隐向量到重构的确定性映射。
          通过欠完备、稀疏、去噪或掩码等约束，可迫使模型学到对数据有意义的压缩表示。
        </p>
        <p className="mt-6 text-sm text-amber-800">
          <ShieldAlert className="w-4 h-4 inline-block mr-1" />
          本页内容仅供教学与非商业学习使用（CC BY-NC 4.0）。
        </p>
      </section>

      {/* Concepts */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">主要形式</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <ConceptCard
            title="线性自编码器"
            description={
              <>
                编码器与解码器都是线性变换时，单隐层自编码器在平方损失下的最优解等价于 PCA：
                隐空间张成数据前 <KaTeX math={String.raw`M`} /> 个主成分方向。
              </>
            }
          />
          <ConceptCard
            title="深度自编码器"
            description="使用多层非线性网络作为编码器与解码器，可学习非线性低维流形，广泛应用于降维、哈希与预训练。"
          />
          <ConceptCard
            title="稀疏自编码器"
            description={
              <>
                在隐单元激活上施加稀疏惩罚，如 <KaTeX math={String.raw`\Omega(\boldsymbol{h})`} />，
                使每个样本仅激活少量神经元，从而学到局部化、可解释的特征。
              </>
            }
          />
          <ConceptCard
            title="去噪自编码器"
            description="输入先被加噪或破坏，模型仍需重构干净样本，迫使表示对输入扰动鲁棒。"
          />
          <ConceptCard
            title="掩码自编码器"
            description="随机遮挡图像块或文本 token，只从未遮挡部分重构被遮挡内容，是视觉与语言自监督预训练的重要范式。"
          />
        </div>
      </section>

      {/* Reconstruction loss */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">重构损失</h2>
        <p className="text-gray-700 mb-4">
          自编码器通过最小化输入 <KaTeX math={String.raw`\boldsymbol{x}`} /> 与重构
          <KaTeX math={String.raw`\hat{\boldsymbol{x}}=f(g(\boldsymbol{x}))`} /> 之间的距离来训练。
          不同数据类型使用不同损失：
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <FormulaCard
            title="均方误差"
            formula={String.raw`\ell_{\text{MSE}}(\boldsymbol{x},\hat{\boldsymbol{x}}) = \|\boldsymbol{x}-\hat{\boldsymbol{x}}\|^2`}
            description="适用于连续实值输入，如图像像素或传感器信号。"
          />
          <FormulaCard
            title="交叉熵"
            formula={String.raw`\ell_{\text{CE}}(\boldsymbol{x},\hat{\boldsymbol{x}}) = -\sum_i \bigl[x_i\ln \hat{x}_i + (1-x_i)\ln(1-\hat{x}_i)\bigr]`}
            description="适用于二元或归一化到 [0,1] 的输入。"
          />
        </div>
      </section>

      {/* Sparse / denoising / masked formulas */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">约束与正则化</h2>
        <div className="space-y-4">
          <FormulaCard
            title="稀疏自编码器目标"
            formula={String.raw`\mathcal{L} = \frac{1}{N}\sum_{n=1}^{N} \|\boldsymbol{x}^{(n)}-\hat{\boldsymbol{x}}^{(n)}\|^2 + \lambda \, \Omega(\boldsymbol{h}^{(n)})`}
            description="λ 控制重构精度与隐层稀疏度之间的权衡。"
          />
          <FormulaCard
            title="去噪自编码器目标"
            formula={String.raw`\mathcal{L} = \mathbb{E}_{q(\tilde{\boldsymbol{x}}\mid\boldsymbol{x})}\bigl[\|\boldsymbol{x}-f(g(\tilde{\boldsymbol{x}}))\|^2\bigr]`}
            description="q 表示对输入的损坏过程，如加性高斯噪声或随机遮掩。"
          />
          <FormulaCard
            title="掩码自编码器目标"
            formula={String.raw`\mathcal{L} = \sum_{i\in\mathcal{M}} \ell\bigl(x_i, f(g(\boldsymbol{x}_{\backslash\mathcal{M}}))_i\bigr)`}
            description="只对被掩码的位置 ℳ 计算重构损失，其余位置不参与监督。"
          />
        </div>
      </section>

      {/* Interactive demo */}
      <InteractiveDemo title="交互演示：二维隐空间控制合成解码器输出">
        <LatentSpaceDecoderDemo />
      </InteractiveDemo>

      {/* Navigation */}
      <section className="flex flex-wrap justify-between gap-4">
        {prevSection ? (
          <Link
            to={prevSection.path}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            {prevSection.title}
          </Link>
        ) : (
          <div />
        )}
        {nextSection && (
          <Link
            to={nextSection.path}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            {nextSection.title}
            <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </section>
    </div>
  );
}

const GRID_SIZE = 18;

function LatentSpaceDecoderDemo() {
  const [z1, setZ1] = useState(0);
  const [z2, setZ2] = useState(0);

  const pixels = useMemo(() => {
    const cells: number[] = [];
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        const x = (j / (GRID_SIZE - 1)) * 2 - 1;
        const y = (i / (GRID_SIZE - 1)) * 2 - 1;
        const cx = z1 / 3;
        const cy = z2 / 3;
        const v = Math.exp(-((x - cx) ** 2 + (y - cy) ** 2) / 0.15);
        cells.push(v);
      }
    }
    return cells;
  }, [z1, z2]);

  return (
    <div className="space-y-6">
      <p className="text-gray-700">
        拖动两个滑块改变隐变量 <KaTeX math={String.raw`z_1,z_2`} />，观察解码器输出的二维“图像”如何变化。
        这里解码器是一个合成的高斯斑生成器，真实深度解码器会学习更复杂的映射。
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                隐变量 <KaTeX math={String.raw`z_1`} />
              </label>
              <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{z1.toFixed(2)}</span>
            </div>
            <Slider value={[z1]} min={-3} max={3} step={0.1} onValueChange={(v) => setZ1(v[0])} />
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                隐变量 <KaTeX math={String.raw`z_2`} />
              </label>
              <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{z2.toFixed(2)}</span>
            </div>
            <Slider value={[z2]} min={-3} max={3} step={0.1} onValueChange={(v) => setZ2(v[0])} />
          </div>
          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={() => { setZ1(0); setZ2(0); }}>
              <RefreshCw className="w-4 h-4 mr-2" />
              重置
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700 text-center">合成解码器输出</div>
          <div
            className="aspect-square bg-gray-50 rounded-lg border border-gray-200 p-2 grid gap-0.5"
            style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}
          >
            {pixels.map((v, idx) => (
              <div
                key={idx}
                className="rounded-[1px]"
                style={{ backgroundColor: `hsl(220, 80%, ${10 + 80 * v}%)` }}
              />
            ))}
          </div>
        </div>
      </div>

      <FormulaCard
        title="合成解码器"
        formula={String.raw`\hat{x}_{ij} = \exp\!\left(-\frac{(x_i-z_1/3)^2+(y_j-z_2/3)^2}{2\sigma^2}\right)`}
        description="每个像素强度由隐变量决定的位置高斯斑给出。"
      />
    </div>
  );
}
