import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import InteractiveDemo from '@/components/InteractiveDemo';
import KaTeX from '@/components/KaTeX';

export default function ConvolutionSizeDemo() {
  const [I, setI] = useState(32);
  const [K, setK] = useState(3);
  const [P, setP] = useState(1);
  const [S, setS] = useState(2);

  const O = Math.floor((I + 2 * P - K) / S) + 1;
  const samePad = Math.max(0, Math.ceil(((I - 1) * S + K - I) / 2));

  return (
    <InteractiveDemo title="卷积输出尺寸与 padding 选择">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-5">
          <div>
            <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
              <span>输入尺寸 I</span>
              <span>{I}</span>
            </div>
            <Slider value={[I]} min={4} max={128} step={1} onValueChange={(v) => setI(v[0])} />
          </div>
          <div>
            <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
              <span>核尺寸 K</span>
              <span>{K}</span>
            </div>
            <Slider value={[K]} min={1} max={15} step={2} onValueChange={(v) => setK(v[0])} />
          </div>
          <div>
            <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
              <span>填充 P</span>
              <span>{P}</span>
            </div>
            <Slider value={[P]} min={0} max={16} step={1} onValueChange={(v) => setP(v[0])} />
          </div>
          <div>
            <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
              <span>步幅 S</span>
              <span>{S}</span>
            </div>
            <Slider value={[S]} min={1} max={8} step={1} onValueChange={(v) => setS(v[0])} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-sm text-gray-600">输出尺寸 O</div>
            <div className="text-3xl font-bold text-blue-700">{O >= 1 ? O : '无效'}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <KaTeX math={String.raw`O = \left\lfloor \frac{${I} + 2\cdot${P} - ${K}}{${S}} \right\rfloor + 1 = ${O >= 1 ? O : '\text{无效}'}`} />
          </div>
          <div className="text-sm text-gray-700 space-y-2">
            <p>
              <strong>Valid convolution：</strong>不填充（P=0），输出尺寸自然缩小。当前 P={P}，{P === 0 ? '属于 valid 设置。' : '不属于 valid 设置。'}
            </p>
            <p>
              <strong>Same convolution：</strong>选择 P 使得输出尺寸与输入相同。对当前 I={I}、K={K}、S={S}，需要 P={samePad}。
            </p>
            {O < 1 && <p className="text-red-600 font-medium">当前参数导致输出尺寸非正，请增大 I、P 或减小 K、S。</p>}
          </div>
        </div>
      </div>
    </InteractiveDemo>
  );
}
