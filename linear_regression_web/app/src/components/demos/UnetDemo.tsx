import { useState } from 'react';
import InteractiveDemo from '@/components/InteractiveDemo';
import { Slider } from '@/components/ui/slider';
import KaTeX from '@/components/KaTeX';

export default function UnetDemo() {
  const [levels, setLevels] = useState(3);
  const [inputSize, setInputSize] = useState(256);

  const sizes = Array.from({ length: levels + 1 }, (_, i) => inputSize / Math.pow(2, i));

  return (
    <InteractiveDemo title="U-Net 编码器-解码器结构">
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
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
        </div>

        <div className="overflow-x-auto">
          <svg viewBox={`0 0 ${(levels + 2) * 140} ${levels * 80 + 120}`} className="w-full min-w-[600px] h-80 bg-gray-50 rounded-lg">
            {/* Encoder */}
            {sizes.map((s, i) => (
              <g key={`enc-${i}`}>
                <rect x={20 + i * 120} y={20 + i * 60} width={80} height={80 - i * 10} fill="#bfdbfe" stroke="#2563eb" strokeWidth={2} />
                <text x={60 + i * 120} y={60 + i * 60} textAnchor="middle" fontSize={12} fill="#1e3a8a">{s.toFixed(0)}×{s.toFixed(0)}</text>
                {i < levels && (
                  <>
                    <line x1={100 + i * 120} y1={60 + i * 60} x2={20 + (i + 1) * 120} y2={80 + i * 60} stroke="#6b7280" strokeWidth={2} markerEnd="url(#arrow)" />
                    <text x={70 + i * 120} y={95 + i * 60} fontSize={10} fill="#4b5563">↓2</text>
                  </>
                )}
              </g>
            ))}
            {/* Bottleneck */}
            <rect x={20 + levels * 120} y={20 + levels * 60} width={80} height={30} fill="#fde68a" stroke="#d97706" strokeWidth={2} />
            <text x={60 + levels * 120} y={40 + levels * 60} textAnchor="middle" fontSize={11} fill="#78350f">Bottleneck</text>
            {/* Decoder */}
            {sizes.slice(0, levels).reverse().map((s, i) => (
              <g key={`dec-${i}`}>
                <rect x={20 + (levels + 1 + i) * 120} y={20 + (levels - 1 - i) * 60} width={80} height={50 + i * 10} fill="#bbf7d0" stroke="#059669" strokeWidth={2} />
                <text x={60 + (levels + 1 + i) * 120} y={55 + (levels - 1 - i) * 60} textAnchor="middle" fontSize={12} fill="#064e3b">{s.toFixed(0)}×{s.toFixed(0)}</text>
                {i < levels - 1 && (
                  <>
                    <line x1={100 + (levels + 1 + i) * 120} y1={45 + (levels - 1 - i) * 60} x2={20 + (levels + 2 + i) * 120} y2={35 + (levels - 2 - i) * 60} stroke="#6b7280" strokeWidth={2} />
                    <text x={70 + (levels + 1 + i) * 120} y={35 + (levels - 1 - i) * 60} fontSize={10} fill="#4b5563">↑2</text>
                  </>
                )}
              </g>
            ))}
            {/* Skip connections */}
            {sizes.slice(0, levels).map((_, i) => (
              <path
                key={`skip-${i}`}
                d={`M 60 ${60 + i * 60} C ${60 + levels * 60} ${60 + i * 60}, ${60 + levels * 60} ${50 + (2 * levels - i) * 60}, ${60 + (levels + 1) * 120} ${50 + (levels - 1 - i) * 60}`}
                fill="none"
                stroke="#9333ea"
                strokeWidth={1.5}
                strokeDasharray="4 2"
              />
            ))}
            <defs>
              <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L0,6 L9,3 z" fill="#6b7280" />
              </marker>
            </defs>
          </svg>
        </div>

        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <strong>结构说明</strong>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Encoder 逐步下采样提取高层语义；</li>
              <li>Bottleneck 位于最低分辨率；</li>
              <li>Decoder 逐步上采样恢复空间分辨率；</li>
              <li>Skip connection 将编码器特征直接拼接到解码器，保留细节。</li>
            </ul>
          </div>
          <div>
            <strong>为什么 FCN 可处理任意尺寸输入？</strong>
            <p className="mt-1">
              全卷积网络只使用卷积、池化与上采样，没有全连接层。卷积核数量固定，输出特征图尺寸随输入尺寸线性变化，因此可以接受任意 H×W 的图像并输出对应尺寸的像素级标签图。
            </p>
            <KaTeX math={String.raw`H_{\text{out}} = \left\lfloor \frac{H_{\text{in}} + 2P - K}{S} \right\rfloor + 1`} />
          </div>
        </div>
      </div>
    </InteractiveDemo>
  );
}
