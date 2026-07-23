import { useMemo, useState } from 'react';
import { Slider } from '@/components/ui/slider';
import InteractiveDemo from '@/components/InteractiveDemo';

const CANVAS_SIZE = 300;
const GRID_SIZE = 6;
const CELL_SIZE = CANVAS_SIZE / GRID_SIZE;

// 生成一个简单的“目标图案”
function generateTarget(): number[][] {
  const grid: number[][] = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
  // 一个简单的“X”图案
  for (let i = 0; i < GRID_SIZE; i++) {
    grid[i][i] = 1;
    grid[i][GRID_SIZE - 1 - i] = 1;
  }
  return grid;
}

// 模拟不同深度/宽度的网络学习效果
function simulateLearning(
  depth: number,
  width: number,
  epochs: number
): number {
  // 深度网络：特征逐层组合，学习效率随深度增加
  // 宽度网络：单层特征数量有限，学习效率随宽度增加但边际递减
  const depthFactor = Math.min(1, depth * 0.2);
  const widthFactor = Math.min(1, width * 0.15);
  const epochFactor = Math.min(1, epochs * 0.1);

  // 深度和宽度共同决定表达能力，但深度更高效
  const expressiveness = depthFactor * 0.7 + widthFactor * 0.3;
  return Math.min(1, expressiveness * epochFactor + Math.random() * 0.1);
}

// 生成学习后的图案（目标图案的模糊版本）
function generateLearnedPattern(accuracy: number, target: number[][]): number[][] {
  const result: number[][] = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      // 准确率越高，图案越接近目标
      result[y][x] = target[y][x] * accuracy + (Math.random() * (1 - accuracy) * 0.3);
    }
  }
  return result;
}

export default function DepthVsWidthLab() {
  const [depth, setDepth] = useState(2);
  const [width, setWidth] = useState(4);
  const [epochs, setEpochs] = useState(5);

  const target = useMemo(() => generateTarget(), []);
  const accuracy = useMemo(() => simulateLearning(depth, width, epochs), [depth, width, epochs]);
  const learnedPattern = useMemo(() => generateLearnedPattern(accuracy, target), [accuracy, target]);

  const params = useMemo(() => {
    // 简化的参数量计算：每层 width×width，共 depth 层
    return depth * width * width + width * 10;
  }, [depth, width]);

  return (
    <InteractiveDemo title="深度 vs 宽度：网络结构对学习能力的影响">
      <div className="space-y-6">
        <p className="text-gray-700">
          调整网络深度和宽度，观察学习效果和参数量变化。
          深度网络通过层次化组合特征，通常比单纯增加宽度更高效。
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">网络深度（层数）</label>
              <Slider value={[depth]} min={1} max={8} step={1} onValueChange={(v) => setDepth(v[0])} />
              <div className="text-sm text-gray-500 mt-1">{depth} 层</div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">网络宽度（每层神经元）</label>
              <Slider value={[width]} min={2} max={16} step={1} onValueChange={(v) => setWidth(v[0])} />
              <div className="text-sm text-gray-500 mt-1">{width} 个神经元</div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">训练轮数</label>
              <Slider value={[epochs]} min={1} max={20} step={1} onValueChange={(v) => setEpochs(v[0])} />
              <div className="text-sm text-gray-500 mt-1">{epochs} 轮</div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <div className="text-xs text-gray-600">参数量</div>
                <div className="text-lg font-bold text-blue-700">{params.toLocaleString()}</div>
              </div>
              <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                <div className="text-xs text-gray-600">学习准确率</div>
                <div className="text-lg font-bold text-emerald-700">{(accuracy * 100).toFixed(1)}%</div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="text-sm text-gray-700">
                <strong>分析：</strong>
                {depth <= 2 && width <= 4 && ' 网络太浅太窄，表达能力不足，难以学习复杂模式。'}
                {depth > 2 && depth <= 4 && width <= 8 && ' 中等深度和宽度，能够学习基本模式。'}
                {depth > 4 && ' 深度足够，能够层次化组合特征，即使宽度不大也能学习复杂模式。'}
                {width > 8 && depth <= 2 && ' 宽度很大但深度不足，参数量大但学习效率不高。'}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">目标图案</div>
              <svg width={CANVAS_SIZE} height={CANVAS_SIZE} className="border border-gray-300">
                {target.map((row, y) =>
                  row.map((cell, x) => (
                    <rect
                      key={`${x}-${y}`}
                      x={x * CELL_SIZE}
                      y={y * CELL_SIZE}
                      width={CELL_SIZE}
                      height={CELL_SIZE}
                      fill={cell === 1 ? '#3b82f6' : '#f3f4f6'}
                      stroke="#e5e7eb"
                      strokeWidth={0.5}
                    />
                  ))
                )}
              </svg>
            </div>

            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">学习后图案</div>
              <svg width={CANVAS_SIZE} height={CANVAS_SIZE} className="border border-gray-300">
                {learnedPattern.map((row, y) =>
                  row.map((cell, x) => (
                    <rect
                      key={`${x}-${y}`}
                      x={x * CELL_SIZE}
                      y={y * CELL_SIZE}
                      width={CELL_SIZE}
                      height={CELL_SIZE}
                      fill={cell > 0.5 ? '#10b981' : cell > 0.2 ? '#f59e0b' : '#f3f4f6'}
                      stroke="#e5e7eb"
                      strokeWidth={0.5}
                    />
                  ))
                )}
              </svg>
            </div>
          </div>
        </div>
      </div>
    </InteractiveDemo>
  );
}
