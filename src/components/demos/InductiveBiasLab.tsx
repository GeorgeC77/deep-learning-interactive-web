import { useMemo, useState } from 'react';
import { Slider } from '@/components/ui/slider';
import InteractiveDemo from '@/components/InteractiveDemo';

const CANVAS_SIZE = 200;
const GRID_SIZE = 8;
const CELL_SIZE = CANVAS_SIZE / GRID_SIZE;

// 生成一个简单的“猫”图案（用 1 表示有像素，0 表示无）
function generateCat(): number[][] {
  const grid: number[][] = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
  // 耳朵
  grid[1][2] = 1; grid[1][5] = 1;
  // 眼睛
  grid[3][2] = 1; grid[3][5] = 1;
  // 鼻子
  grid[4][3] = 1; grid[4][4] = 1;
  // 嘴巴
  grid[5][2] = 1; grid[5][3] = 1; grid[5][4] = 1; grid[5][5] = 1;
  return grid;
}

// 平移图案
function translateGrid(grid: number[][], dx: number, dy: number): number[][] {
  const result: number[][] = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE) {
        result[ny][nx] = grid[y][x];
      }
    }
  }
  return result;
}

// 旋转图案 90 度
function rotateGrid(grid: number[][]): number[][] {
  const result: number[][] = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      result[x][GRID_SIZE - 1 - y] = grid[y][x];
    }
  }
  return result;
}

// 计算两个网格的相似度（IoU）
function gridSimilarity(a: number[][], b: number[][]): number {
  let intersection = 0;
  let union = 0;
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      if (a[y][x] === 1 && b[y][x] === 1) intersection++;
      if (a[y][x] === 1 || b[y][x] === 1) union++;
    }
  }
  return union === 0 ? 0 : intersection / union;
}

// 模拟不同归纳偏置的模型预测
function predictWithBias(
  input: number[][],
  biasType: 'none' | 'translation' | 'rotation' | 'local',
  _target: number[][]
): number {
  // 模拟：有正确归纳偏置的模型对变换后的输入仍能保持高准确率
  const similarity = gridSimilarity(input, _target);
  switch (biasType) {
    case 'none':
      // 无偏置：对变换敏感，准确率随相似度线性下降
      return similarity * 0.6;
    case 'translation':
      // 平移等变：对平移不变，准确率保持较高
      return 0.9 - (1 - similarity) * 0.2;
    case 'rotation':
      // 旋转不变：对旋转不变，准确率保持较高
      return 0.85 - (1 - similarity) * 0.3;
    case 'local':
      // 局部连接：对局部模式敏感，中等准确率
      return 0.75 - (1 - similarity) * 0.4;
    default:
      return 0.5;
  }
}

export default function InductiveBiasLab() {
  const [biasType, setBiasType] = useState<'none' | 'translation' | 'rotation' | 'local'>('translation');
  const [translateX, setTranslateX] = useState(0);
  const [rotate, setRotate] = useState(false);

  const originalGrid = useMemo(() => generateCat(), []);
  const transformedGrid = useMemo(() => {
    let grid = originalGrid;
    if (rotate) grid = rotateGrid(grid);
    if (translateX !== 0) grid = translateGrid(grid, translateX, 0);
    return grid;
  }, [originalGrid, translateX, rotate]);

  const accuracy = useMemo(() => {
    return predictWithBias(transformedGrid, biasType, originalGrid);
  }, [transformedGrid, biasType, originalGrid]);

  const similarity = useMemo(() => {
    return gridSimilarity(transformedGrid, originalGrid);
  }, [transformedGrid, originalGrid]);

  return (
    <InteractiveDemo title="归纳偏置对模型性能的影响">
      <div className="space-y-6">
        <p className="text-gray-700">
          选择一个归纳偏置类型，然后对输入图像进行平移或旋转，观察模型准确率的变化。
          有合适归纳偏置的模型对相应变换更鲁棒。
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="text-sm font-medium text-gray-700 mb-2">原始图像</div>
            <svg width={CANVAS_SIZE} height={CANVAS_SIZE} className="border border-gray-300">
              {originalGrid.map((row, y) =>
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
            <div className="text-sm font-medium text-gray-700 mb-2">变换后图像</div>
            <svg width={CANVAS_SIZE} height={CANVAS_SIZE} className="border border-gray-300">
              {transformedGrid.map((row, y) =>
                row.map((cell, x) => (
                  <rect
                    key={`${x}-${y}`}
                    x={x * CELL_SIZE}
                    y={y * CELL_SIZE}
                    width={CELL_SIZE}
                    height={CELL_SIZE}
                    fill={cell === 1 ? '#ef4444' : '#f3f4f6'}
                    stroke="#e5e7eb"
                    strokeWidth={0.5}
                  />
                ))
              )}
            </svg>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">归纳偏置类型</label>
              <div className="flex gap-2 mt-2">
                {(['none', 'translation', 'rotation', 'local'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setBiasType(type)}
                    className={`px-3 py-1.5 text-sm rounded-lg border ${
                      biasType === type
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {type === 'none' && '无偏置'}
                    {type === 'translation' && '平移等变'}
                    {type === 'rotation' && '旋转不变'}
                    {type === 'local' && '局部连接'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">水平平移</label>
              <Slider value={[translateX]} min={-3} max={3} step={1} onValueChange={(v) => setTranslateX(v[0])} />
              <div className="text-sm text-gray-500 mt-1">{translateX > 0 ? `右移 ${translateX}` : translateX < 0 ? `左移 ${-translateX}` : '不平移'}</div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="rotate"
                checked={rotate}
                onChange={(e) => setRotate(e.target.checked)}
                className="rounded border-gray-300"
              />
              <label htmlFor="rotate" className="text-sm font-medium text-gray-700">
                旋转 90°
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="text-sm text-gray-600">输入与原始相似度</div>
              <div className="text-2xl font-bold text-blue-700">{(similarity * 100).toFixed(1)}%</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="text-sm text-gray-600">模型准确率</div>
              <div className="text-2xl font-bold text-blue-700">{(accuracy * 100).toFixed(1)}%</div>
            </div>
            <div className="text-sm text-gray-600">
              {biasType === 'translation' && translateX !== 0 && '平移等变模型对平移变换保持高准确率。'}
              {biasType === 'rotation' && rotate && '旋转不变模型对旋转变换保持高准确率。'}
              {biasType === 'none' && (translateX !== 0 || rotate) && '无偏置模型对变换敏感，准确率下降明显。'}
              {biasType === 'local' && '局部连接模型对局部模式敏感，但对全局变换的鲁棒性有限。'}
            </div>
          </div>
        </div>
      </div>
    </InteractiveDemo>
  );
}
