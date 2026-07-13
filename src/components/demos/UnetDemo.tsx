import { useState } from 'react';
import InteractiveDemo from '@/components/InteractiveDemo';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  computeUNetSizes,
  buildUNetStages,
  checkSkipCompatibility,
  requiredInputAlignment,
  computePaddedInputSize,
  computeOutputCrop,
  type UpsampleMode,
} from '@/lib/math/unet';

const INPUT_PRESETS = [250, 255, 256, 257];

type OutputStrategy = 'crop-logits' | 'pad-labels';

export default function UnetDemo() {
  const [levels, setLevels] = useState(3);
  const [inputSize, setInputSize] = useState(256);
  const [baseChannels, setBaseChannels] = useState(64);
  const [growth, setGrowth] = useState(2);
  const [numClasses, setNumClasses] = useState(21);
  const [outputStrategy, setOutputStrategy] = useState<OutputStrategy>('crop-logits');
  const [upsampleMode, setUpsampleMode] = useState<UpsampleMode>('bilinear-conv');

  const alignment = requiredInputAlignment(levels);
  const { paddedSize, totalPadding, top, bottom, left, right } =
    computePaddedInputSize(inputSize, levels);
  const isAligned = totalPadding === 0;

  const { bottleneckSize } = computeUNetSizes(paddedSize, levels);
  const stages = buildUNetStages(paddedSize, levels, baseChannels, growth, upsampleMode);
  const decoderStages = [...stages].reverse();
  const bottleneckChannels = baseChannels * Math.pow(growth, levels);

  const crop = computeOutputCrop(inputSize, paddedSize);

  const lastEncoder = stages[levels - 1].encoderPosition;
  const firstDecoder = decoderStages[0].decoderPosition;
  const bottleneckGap = firstDecoder.x - (lastEncoder.x + lastEncoder.w);
  const bottleneckRect = {
    x: lastEncoder.x + lastEncoder.w + bottleneckGap / 4,
    y: lastEncoder.y + lastEncoder.h / 2 - 15,
    w: bottleneckGap / 2,
    h: 30,
  };

  const svgWidth = 60 + (2 * levels + 3) * 120;
  const svgHeight = levels * 80 + 160;

  return (
    <InteractiveDemo title="U-Net 编码器-解码器结构">
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
              <span>下采样层数 L</span>
              <span>{levels}</span>
            </div>
            <Slider value={[levels]} min={1} max={5} step={1} onValueChange={(v) => setLevels(v[0])} />
          </div>
          <div>
            <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
              <span>输入分辨率 H×W</span>
              <span>{inputSize}×{inputSize}</span>
            </div>
            <Slider value={[inputSize]} min={64} max={512} step={1} onValueChange={(v) => setInputSize(v[0])} />
            <div className="flex flex-wrap gap-2 mt-2">
              {INPUT_PRESETS.map((preset) => (
                <Button
                  key={preset}
                  variant={inputSize === preset ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setInputSize(preset)}
                >
                  {preset}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
              <span>基础通道数 C₀</span>
              <span>{baseChannels}</span>
            </div>
            <Slider value={[baseChannels]} min={16} max={128} step={16} onValueChange={(v) => setBaseChannels(v[0])} />
          </div>
          <div>
            <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
              <span>通道增长率</span>
              <span>{growth}</span>
            </div>
            <Slider value={[growth]} min={1} max={4} step={1} onValueChange={(v) => setGrowth(v[0])} />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
            <span>类别数</span>
            <span>{numClasses}</span>
          </div>
          <Slider value={[numClasses]} min={2} max={100} step={1} onValueChange={(v) => setNumClasses(v[0])} />
        </div>

        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div className="space-y-2">
            <Label className="font-medium">上采样方式</Label>
            <RadioGroup
              value={upsampleMode}
              onValueChange={(value) => setUpsampleMode(value as UpsampleMode)}
              className="flex items-center gap-4"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="bilinear-conv" id="bilinear-conv" />
                <Label htmlFor="bilinear-conv" className="text-sm text-gray-700">
                  bilinear + 1×1 conv
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="transposed" id="transposed" />
                <Label htmlFor="transposed" className="text-sm text-gray-700">
                  transposed conv
                </Label>
              </div>
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label className="font-medium">非对齐输出策略</Label>
            <RadioGroup
              value={outputStrategy}
              onValueChange={(value) => setOutputStrategy(value as OutputStrategy)}
              className="flex items-center gap-4"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="crop-logits" id="crop-logits" />
                <Label htmlFor="crop-logits" className="text-sm text-gray-700">
                  crop logits 回原始尺寸
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="pad-labels" id="pad-labels" />
                <Label htmlFor="pad-labels" className="text-sm text-gray-700">
                  pad labels 并忽略填充像素
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="overflow-x-auto">
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full min-w-[700px] h-96 bg-gray-50 rounded-lg">
            {/* Encoder */}
            {stages.map((stage, i) => (
              <g key={`enc-${i}`}>
                <rect
                  x={stage.encoderPosition.x}
                  y={stage.encoderPosition.y}
                  width={stage.encoderPosition.w}
                  height={stage.encoderPosition.h}
                  fill="#bfdbfe"
                  stroke="#2563eb"
                  strokeWidth={2}
                />
                <text
                  x={stage.encoderPosition.x + stage.encoderPosition.w / 2}
                  y={stage.encoderPosition.y + stage.encoderPosition.h / 2}
                  textAnchor="middle"
                  fontSize={11}
                  fill="#1e3a8a"
                >
                  {stage.encoderSpatial[0].toFixed(0)}×{stage.encoderSpatial[1].toFixed(0)}×{stage.encoderChannels}
                </text>
                {i < levels - 1 && (
                  <>
                    <line
                      x1={stage.encoderPosition.x + stage.encoderPosition.w}
                      y1={stage.encoderPosition.y + stage.encoderPosition.h / 2}
                      x2={stages[i + 1].encoderPosition.x}
                      y2={stages[i + 1].encoderPosition.y + stages[i + 1].encoderPosition.h / 2}
                      stroke="#6b7280"
                      strokeWidth={2}
                      markerEnd="url(#arrow)"
                    />
                    <text
                      x={(stage.encoderPosition.x + stage.encoderPosition.w + stages[i + 1].encoderPosition.x) / 2}
                      y={(stage.encoderPosition.y + stage.encoderPosition.h / 2 + stages[i + 1].encoderPosition.y + stages[i + 1].encoderPosition.h / 2) / 2 + 12}
                      textAnchor="middle"
                      fontSize={10}
                      fill="#4b5563"
                    >
                      ↓2
                    </text>
                  </>
                )}
              </g>
            ))}

            {/* Bottleneck */}
            <rect
              x={bottleneckRect.x}
              y={bottleneckRect.y}
              width={bottleneckRect.w}
              height={bottleneckRect.h}
              fill="#fde68a"
              stroke="#d97706"
              strokeWidth={2}
            />
            <text
              x={bottleneckRect.x + bottleneckRect.w / 2}
              y={bottleneckRect.y + bottleneckRect.h / 2 + 4}
              textAnchor="middle"
              fontSize={11}
              fill="#78350f"
            >
              {bottleneckSize.toFixed(0)}×{bottleneckSize.toFixed(0)}×{bottleneckChannels}
            </text>

            {/* Decoder */}
            {decoderStages.map((stage, i) => (
              <g key={`dec-${i}`}>
                <rect
                  x={stage.decoderPosition.x}
                  y={stage.decoderPosition.y}
                  width={stage.decoderPosition.w}
                  height={stage.decoderPosition.h}
                  fill="#bbf7d0"
                  stroke="#059669"
                  strokeWidth={2}
                />
                <text
                  x={stage.decoderPosition.x + stage.decoderPosition.w / 2}
                  y={stage.decoderPosition.y + stage.decoderPosition.h / 2}
                  textAnchor="middle"
                  fontSize={11}
                  fill="#064e3b"
                >
                  {stage.decoderSpatial[0].toFixed(0)}×{stage.decoderSpatial[1].toFixed(0)}×{stage.outputChannels}
                </text>
                {i < levels - 1 && (
                  <>
                    <line
                      x1={stage.decoderPosition.x + stage.decoderPosition.w}
                      y1={stage.decoderPosition.y + stage.decoderPosition.h / 2}
                      x2={decoderStages[i + 1].decoderPosition.x}
                      y2={decoderStages[i + 1].decoderPosition.y + decoderStages[i + 1].decoderPosition.h / 2}
                      stroke="#6b7280"
                      strokeWidth={2}
                      markerEnd="url(#arrow)"
                    />
                    <text
                      x={(stage.decoderPosition.x + stage.decoderPosition.w + decoderStages[i + 1].decoderPosition.x) / 2}
                      y={(stage.decoderPosition.y + stage.decoderPosition.h / 2 + decoderStages[i + 1].decoderPosition.y + decoderStages[i + 1].decoderPosition.h / 2) / 2 - 6}
                      textAnchor="middle"
                      fontSize={10}
                      fill="#4b5563"
                    >
                      ↑2
                    </text>
                  </>
                )}
              </g>
            ))}

            {/* Skip connections: encoder[i] -> decoder[levels-1-i] */}
            {stages.map((stage, i) => {
              const target = decoderStages[levels - 1 - i].decoderPosition;
              const startX = stage.encoderPosition.x + stage.encoderPosition.w;
              const startY = stage.encoderPosition.y + stage.encoderPosition.h / 2;
              const endX = target.x;
              const endY = target.y + target.h / 2;
              const midX = (startX + endX) / 2;
              return (
                <path
                  key={`skip-${i}`}
                  d={`M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`}
                  fill="none"
                  stroke="#9333ea"
                  strokeWidth={1.5}
                  strokeDasharray="4 2"
                />
              );
            })}

            {/* Final 1x1 conv */}
            {decoderStages.length > 0 && (
              <g>
                <line
                  x1={decoderStages[levels - 1].decoderPosition.x + decoderStages[levels - 1].decoderPosition.w}
                  y1={decoderStages[levels - 1].decoderPosition.y + decoderStages[levels - 1].decoderPosition.h / 2}
                  x2={decoderStages[levels - 1].decoderPosition.x + decoderStages[levels - 1].decoderPosition.w + 60}
                  y2={decoderStages[levels - 1].decoderPosition.y + decoderStages[levels - 1].decoderPosition.h / 2}
                  stroke="#6b7280"
                  strokeWidth={2}
                  markerEnd="url(#arrow)"
                />
                <rect
                  x={decoderStages[levels - 1].decoderPosition.x + decoderStages[levels - 1].decoderPosition.w + 60}
                  y={decoderStages[levels - 1].decoderPosition.y + decoderStages[levels - 1].decoderPosition.h / 2 - 15}
                  width={60}
                  height={30}
                  fill="#fecaca"
                  stroke="#dc2626"
                  strokeWidth={2}
                />
                <text
                  x={decoderStages[levels - 1].decoderPosition.x + decoderStages[levels - 1].decoderPosition.w + 90}
                  y={decoderStages[levels - 1].decoderPosition.y + decoderStages[levels - 1].decoderPosition.h / 2 + 4}
                  textAnchor="middle"
                  fontSize={10}
                  fill="#7f1d1d"
                >
                  1×1
                </text>
                <text
                  x={decoderStages[levels - 1].decoderPosition.x + decoderStages[levels - 1].decoderPosition.w + 120}
                  y={decoderStages[levels - 1].decoderPosition.y + decoderStages[levels - 1].decoderPosition.h / 2 + 4}
                  fontSize={11}
                  fill="#1f2937"
                >
                  {paddedSize}×{paddedSize}×{numClasses}
                </text>
              </g>
            )}

            <defs>
              <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L0,6 L9,3 z" fill="#6b7280" />
              </marker>
            </defs>
          </svg>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-gray-800">阶段信息</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-700 border rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2">阶段</th>
                  <th className="px-4 py-2">Decoder input</th>
                  <th className="px-4 py-2">Upsample</th>
                  <th className="px-4 py-2">Skip</th>
                  <th className="px-4 py-2">Concat</th>
                  <th className="px-4 py-2">Output</th>
                  <th className="px-4 py-2">模式</th>
                  <th className="px-4 py-2">Skip 兼容</th>
                </tr>
              </thead>
              <tbody>
                {stages.map((stage, i) => (
                  <tr key={`stage-row-${i}`} className="border-t">
                    <td className="px-4 py-2">{i + 1}</td>
                    <td className="px-4 py-2">
                      {stage.decoderInputSpatial[0].toFixed(0)}×{stage.decoderInputSpatial[1].toFixed(0)}×{stage.decoderInputChannels}
                    </td>
                    <td className="px-4 py-2">
                      {stage.decoderSpatial[0].toFixed(0)}×{stage.decoderSpatial[1].toFixed(0)}×{stage.upsampledChannels}
                    </td>
                    <td className="px-4 py-2">
                      {stage.encoderSpatial[0].toFixed(0)}×{stage.encoderSpatial[1].toFixed(0)}×{stage.skipChannels}
                    </td>
                    <td className="px-4 py-2">
                      {stage.decoderSpatial[0].toFixed(0)}×{stage.decoderSpatial[1].toFixed(0)}×{stage.concatChannels}
                    </td>
                    <td className="px-4 py-2">
                      {stage.decoderSpatial[0].toFixed(0)}×{stage.decoderSpatial[1].toFixed(0)}×{stage.outputChannels}
                    </td>
                    <td className="px-4 py-2">{stage.upsampleMode === 'bilinear-conv' ? 'bilinear+conv' : 'transposed'}</td>
                    <td className="px-4 py-2">{checkSkipCompatibility(stage) ? '是' : '否'}</td>
                  </tr>
                ))}
                <tr className="border-t bg-yellow-50">
                  <td className="px-4 py-2">Bottleneck</td>
                  <td className="px-4 py-2">-</td>
                  <td className="px-4 py-2">-</td>
                  <td className="px-4 py-2">-</td>
                  <td className="px-4 py-2">-</td>
                  <td className="px-4 py-2">{bottleneckSize.toFixed(0)}×{bottleneckSize.toFixed(0)}×{bottleneckChannels}</td>
                  <td className="px-4 py-2">-</td>
                  <td className="px-4 py-2">-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <strong>上采样通道链</strong>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>
                <strong>bilinear + conv：</strong>
                <span className="font-mono">H/2×W/2×2C → 上采样 H×W×2C → 1×1 conv → H×W×C</span>
              </li>
              <li>
                <strong>transposed conv：</strong>
                <span className="font-mono">H/2×W/2×2C → ConvTranspose → H×W×C</span>
                （空间与通道变化同时进行）
              </li>
              <li>Skip 将同分辨率的 encoder 特征拼接到 decoder；</li>
              <li>Concat 后通过 conv block 输出 H×W×C。</li>
            </ul>
          </div>
          <div>
            <strong>输出对齐链</strong>
            <p className="mt-1">
              从原始输入到最终分割图的完整流程：
            </p>
            <p className="font-mono text-xs bg-gray-50 rounded p-2 mt-1">
              {inputSize}×{inputSize}×3 → 填充 → {paddedSize}×{paddedSize}×3 → U-Net → {paddedSize}×{paddedSize}×{numClasses} → {outputStrategy === 'crop-logits' ? '裁剪' : 'pad labels + loss mask'} → {inputSize}×{inputSize}×{numClasses}
            </p>
            <p className="mt-2">
              裁剪索引：top={crop.cropTop}, bottom={crop.cropBottom}, left={crop.cropLeft}, right={crop.cropRight}。
              有效区域大小：{crop.finalHeight}×{crop.finalWidth}。
            </p>
          </div>
        </div>

        <div className={`p-3 rounded-lg text-sm ${isAligned ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          <strong>输入对齐检查：</strong>
          {isAligned ? (
            <span> 输入尺寸 {inputSize} 可被 2^{levels} = {alignment} 整除，无需裁剪/填充。</span>
          ) : (
            <span>
              {' '}输入尺寸 {inputSize} 不能被 2^{levels} = {alignment} 整除。
              需要填充到 {paddedSize}×{paddedSize}：总填充 {totalPadding}px
              （上 {top} / 下 {bottom} / 左 {left} / 右 {right}）。
            </span>
          )}
        </div>

        {!isAligned && (
          <div className="text-sm text-gray-700 space-y-3">
            <p className="font-medium">非对齐处理细节</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-orange-50 border border-orange-200 rounded p-3">
                <p className="font-medium text-orange-900">填充区域</p>
                <p>灰色虚线框表示为对齐网络而填充的像素；这些位置没有真实标签。</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded p-3">
                <p className="font-medium text-green-900">有效区域</p>
                <p>绿色实线框表示原始图像范围内的像素；{outputStrategy === 'crop-logits' ? '最终 logits 会被裁剪回该区域' : '训练时标签也会被填充，但 loss 只计算有效区域'}。</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {stages.map((stage, i) => (
                <span key={`size-${i}`} className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs">
                  L{i + 1}: {stage.encoderSpatial[0].toFixed(0)}×{stage.encoderSpatial[1].toFixed(0)}
                  {checkSkipCompatibility(stage) ? ' ✓' : ' ✗'}
                </span>
              ))}
              <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs">
                BN: {bottleneckSize.toFixed(0)}×{bottleneckSize.toFixed(0)}
              </span>
            </div>
          </div>
        )}
      </div>
    </InteractiveDemo>
  );
}
