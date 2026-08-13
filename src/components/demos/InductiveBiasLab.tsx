import { useMemo, useState } from 'react';
import InteractiveDemo from '@/components/InteractiveDemo';
import { Slider } from '@/components/ui/slider';
import {
  activeCellCount,
  circularTranslateGrid,
  gridsEqual,
  rotateGrid90,
  type BinaryGrid,
} from '@/lib/math/symmetry';

const GRID_SIZE = 8;
const CELL_SIZE = 24;

function generateCat(): BinaryGrid {
  const grid = Array.from({ length: GRID_SIZE }, () => Array<number>(GRID_SIZE).fill(0));
  grid[1][2] = 1;
  grid[1][5] = 1;
  grid[3][2] = 1;
  grid[3][5] = 1;
  grid[4][3] = 1;
  grid[4][4] = 1;
  grid[5][2] = 1;
  grid[5][3] = 1;
  grid[5][4] = 1;
  grid[5][5] = 1;
  return grid;
}

function GridView({ grid, color, label }: { grid: BinaryGrid; color: string; label: string }) {
  return (
    <figure>
      <figcaption className="mb-2 text-sm font-medium text-gray-700">{label}</figcaption>
      <svg
        aria-label={label}
        className="border border-gray-300"
        height={GRID_SIZE * CELL_SIZE}
        viewBox={`0 0 ${GRID_SIZE * CELL_SIZE} ${GRID_SIZE * CELL_SIZE}`}
        width={GRID_SIZE * CELL_SIZE}
      >
        {grid.flatMap((row, y) => row.map((cell, x) => (
          <rect
            key={`${x}-${y}`}
            fill={cell === 1 ? color : '#f3f4f6'}
            height={CELL_SIZE}
            stroke="#e5e7eb"
            strokeWidth={0.5}
            width={CELL_SIZE}
            x={x * CELL_SIZE}
            y={y * CELL_SIZE}
          />
        )))}
      </svg>
    </figure>
  );
}

export default function InductiveBiasLab() {
  const [translateX, setTranslateX] = useState(0);
  const [rotate, setRotate] = useState(false);
  const originalGrid = useMemo(() => generateCat(), []);

  const transform = (grid: BinaryGrid) => {
    const rotated = rotate ? rotateGrid90(grid) : grid;
    return circularTranslateGrid(rotated, translateX, 0);
  };

  const transformedGrid = transform(originalGrid);
  const transformedSegmentationMask = transform(originalGrid);
  const invariantHolds = activeCellCount(originalGrid) === activeCellCount(transformedGrid);
  const equivariantHolds = gridsEqual(transformedSegmentationMask, transformedGrid);

  return (
    <InteractiveDemo title="不变性与等变性：输出究竟该不该移动？">
      <div className="space-y-6">
        <p className="text-gray-700">
          对输入施加同一个群作用 g：分类标签应保持不变，像素级分割掩码则应随输入一起变换。
          这里使用循环平移，避免有限网格边界裁剪破坏理论关系。
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          <GridView color="#2563eb" grid={originalGrid} label="原始输入 x" />
          <GridView color="#dc2626" grid={transformedGrid} label="变换后输入 g(x)" />
          <GridView color="#059669" grid={transformedSegmentationMask} label="变换后分割 g(f(x))" />
        </div>

        <div aria-label="不变性与等变性实验控制区" className="grid gap-5 rounded-xl border border-gray-200 bg-gray-50 p-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-gray-700" htmlFor="translation-slider">
              循环水平平移：{translateX > 0 ? `右移 ${translateX}` : translateX < 0 ? `左移 ${-translateX}` : '不平移'}
            </label>
            <Slider
              id="translation-slider"
              max={3}
              min={-3}
              onValueChange={(value) => setTranslateX(value[0])}
              step={1}
              value={[translateX]}
            />
          </div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <input checked={rotate} onChange={(event) => setRotate(event.target.checked)} type="checkbox" />
            再旋转 90°
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className={`rounded-xl border p-4 ${invariantHolds ? 'border-blue-200 bg-blue-50' : 'border-red-200 bg-red-50'}`}>
            <div className="font-semibold text-gray-900">分类不变性：f(g(x)) = f(x)</div>
            <p className="mt-1 text-sm text-gray-700">
              原图和变换图都输出“猫”；作为可检验的不变量，激活格数均为 {activeCellCount(originalGrid)}。
            </p>
            <div className="mt-2 font-mono text-sm">关系{invariantHolds ? '成立 ✓' : '不成立 ✗'}</div>
          </div>
          <div className={`rounded-xl border p-4 ${equivariantHolds ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'}`}>
            <div className="font-semibold text-gray-900">分割等变性：f(g(x)) = g(f(x))</div>
            <p className="mt-1 text-sm text-gray-700">
              掩码与目标一起移动；逐格比较两条计算路径，而不是虚构一个“准确率”。
            </p>
            <div className="mt-2 font-mono text-sm">关系{equivariantHolds ? '成立 ✓' : '不成立 ✗'}</div>
          </div>
        </div>

        <p className="text-sm text-gray-600">
          反例提醒：真实卷积若使用零填充，靠近边界时可能只近似平移等变；旋转也不是普通卷积自动具备的对称性。
        </p>
      </div>
    </InteractiveDemo>
  );
}
