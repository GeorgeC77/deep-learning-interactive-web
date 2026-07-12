import { useState } from 'react';
import InteractiveDemo from '@/components/InteractiveDemo';
import { Slider } from '@/components/ui/slider';
import KaTeX from '@/components/KaTeX';
import {
  computeUNetSizes,
  buildUNetStages,
  checkSkipCompatibility,
  requiredInputAlignment,
} from '@/lib/math/unet';

export default function UnetDemo() {
  const [levels, setLevels] = useState(3);
  const [inputSize, setInputSize] = useState(256);
  const [baseChannels, setBaseChannels] = useState(64);
  const [growth, setGrowth] = useState(2);
  const [numClasses, setNumClasses] = useState(21);

  const { bottleneckSize } = computeUNetSizes(inputSize, levels);
  const stages = buildUNetStages(inputSize, levels, baseChannels, growth);
  const decoderStages = [...stages].reverse();
  const alignment = requiredInputAlignment(levels);
  const isAligned = inputSize % alignment === 0;

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
            <Slider value={[inputSize]} min={64} max={512} step={64} onValueChange={(v) => setInputSize(v[0])} />
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
                  {stage.spatialSize.toFixed(0)}×{stage.spatialSize.toFixed(0)}×{stage.encoderChannels}
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
              {bottleneckSize.toFixed(0)}×{bottleneckSize.toFixed(0)}
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
                  {stage.spatialSize.toFixed(0)}×{stage.spatialSize.toFixed(0)}×{stage.decoderChannels}
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
                  {inputSize}×{inputSize}×{numClasses}
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
                  <th className="px-4 py-2">空间尺寸 H×W</th>
                  <th className="px-4 py-2">编码器通道</th>
                  <th className="px-4 py-2">解码器通道</th>
                  <th className="px-4 py-2">Skip 兼容</th>
                </tr>
              </thead>
              <tbody>
                {stages.map((stage, i) => (
                  <tr key={`stage-row-${i}`} className="border-t">
                    <td className="px-4 py-2">{i + 1}</td>
                    <td className="px-4 py-2">{stage.spatialSize.toFixed(0)}×{stage.spatialSize.toFixed(0)}</td>
                    <td className="px-4 py-2">{stage.encoderChannels}</td>
                    <td className="px-4 py-2">{stage.decoderChannels}</td>
                    <td className="px-4 py-2">{checkSkipCompatibility(stage) ? '是' : '否'}</td>
                  </tr>
                ))}
                <tr className="border-t bg-yellow-50">
                  <td className="px-4 py-2">Bottleneck</td>
                  <td className="px-4 py-2">{bottleneckSize.toFixed(0)}×{bottleneckSize.toFixed(0)}</td>
                  <td className="px-4 py-2">-</td>
                  <td className="px-4 py-2">-</td>
                  <td className="px-4 py-2">-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <strong>结构说明</strong>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Encoder 逐步下采样提取高层语义；</li>
              <li>Bottleneck 位于最低分辨率，只绘制一次；</li>
              <li>Decoder 逐步上采样恢复空间分辨率；</li>
              <li>Skip connection 将编码器特征直接拼接到解码器，保留细节。</li>
            </ul>
          </div>
          <div>
            <strong>拼接与分类头</strong>
            <p className="mt-1">
              解码器上采样后的特征图与对应编码器特征在通道维度拼接：
            </p>
            <KaTeX
              math={String.raw`H \times W \times C_{\text{up}} \;\|\; H \times W \times C_{\text{skip}} = H \times W \times (C_{\text{up}} + C_{\text{skip}})`}
            />
            <p className="mt-2">
              最后通过 1×1 卷积将通道数映射到类别数，并在每个像素上做 softmax：
            </p>
            <KaTeX
              math={String.raw`C_{\text{final}} \xrightarrow{\;1\times1\;} K \;\text{classes}, \quad p_k(x,y) = \frac{e^{z_k(x,y)}}{\sum_j e^{z_j(x,y)}}`}
            />
          </div>
        </div>

        <div className={`p-3 rounded-lg text-sm ${isAligned ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          <strong>输入对齐检查：</strong>
          {isAligned ? (
            <span> 输入尺寸 {inputSize} 可被 2^{levels} = {alignment} 整除，无需裁剪/填充。</span>
          ) : (
            <span>
              {' '}输入尺寸 {inputSize} 不能被 2^{levels} = {alignment} 整除。
              建议裁剪/填充到最近的 {alignment} 的倍数
              （例如 {Math.floor(inputSize / alignment) * alignment} 或 {Math.ceil(inputSize / alignment) * alignment}）。
            </span>
          )}
        </div>
      </div>
    </InteractiveDemo>
  );
}
