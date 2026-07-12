import { useMemo, useRef, useState } from 'react';
import InteractiveDemo from '@/components/InteractiveDemo';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import KaTeX from '@/components/KaTeX';
import {
  computeIoU,
  intersectionArea,
  rectArea,
  nmsTrace,
  scoreThresholdFilter,
  softNms,
  type Box,
  type SoftNmsResult,
} from '@/lib/math/iouNms';

const DEFAULT_BOXES: Box[] = [
  { id: 1, x: 20, y: 20, w: 70, h: 70, score: 0.95, classId: 0 },
  { id: 2, x: 35, y: 35, w: 65, h: 65, score: 0.88, classId: 0 },
  { id: 3, x: 120, y: 30, w: 60, h: 60, score: 0.82, classId: 0 },
  { id: 4, x: 130, y: 120, w: 55, h: 55, score: 0.75, classId: 0 },
  { id: 5, x: 40, y: 130, w: 50, h: 50, score: 0.6, classId: 0 },
];

const CROWDED_SAME_CLASS: Box[] = [
  { id: 1, x: 30, y: 30, w: 70, h: 70, score: 0.95, classId: 0 },
  { id: 2, x: 50, y: 35, w: 65, h: 65, score: 0.92, classId: 0 },
  { id: 3, x: 70, y: 40, w: 60, h: 60, score: 0.88, classId: 0 },
  { id: 4, x: 90, y: 45, w: 55, h: 55, score: 0.85, classId: 0 },
  { id: 5, x: 120, y: 120, w: 50, h: 50, score: 0.6, classId: 0 },
];

const OVERLAPPING_DIFFERENT_CLASS: Box[] = [
  { id: 1, x: 40, y: 40, w: 80, h: 80, score: 0.95, classId: 0 },
  { id: 2, x: 60, y: 60, w: 80, h: 80, score: 0.9, classId: 1 },
  { id: 3, x: 140, y: 40, w: 50, h: 50, score: 0.85, classId: 0 },
  { id: 4, x: 130, y: 130, w: 55, h: 55, score: 0.75, classId: 1 },
  { id: 5, x: 50, y: 140, w: 45, h: 45, score: 0.65, classId: 0 },
];

export default function IoUNMSDemo() {
  const [A, setA] = useState({ x: 30, y: 30, w: 80, h: 80 });
  const [B, setB] = useState({ x: 70, y: 70, w: 90, h: 70 });
  const [dragging, setDragging] = useState<'A' | 'B' | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const inter = intersectionArea(A, B);
  const union = rectArea(A) + rectArea(B) - inter;
  const iou = computeIoU(A, B);

  const handleMouseDown = (which: 'A' | 'B') => (e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(which);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging || !svgRef.current) return;
    const pt = svgRef.current.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svgRef.current.getScreenCTM()?.inverse());
    const updater = dragging === 'A' ? setA : setB;
    updater((r) => ({
      ...r,
      x: Math.max(0, Math.min(200 - r.w, svgP.x - r.w / 2)),
      y: Math.max(0, Math.min(200 - r.h, svgP.y - r.h / 2)),
    }));
  };

  // NMS demo state
  const [boxes, setBoxes] = useState<Box[]>(DEFAULT_BOXES);
  const [nmsThreshold, setNmsThreshold] = useState(0.5);
  const [scoreThreshold, setScoreThreshold] = useState(0.5);
  const [mode, setMode] = useState<'class-aware' | 'class-agnostic'>('class-aware');
  const [showSoftNms, setShowSoftNms] = useState(false);
  const [softSigma, setSoftSigma] = useState(0.5);

  const candidates = useMemo(
    () => scoreThresholdFilter(boxes, scoreThreshold).sort((a, b) => b.score - a.score || b.id - a.id),
    [boxes, scoreThreshold],
  );

  const result = useMemo(
    () => nmsTrace(candidates, nmsThreshold, mode),
    [candidates, nmsThreshold, mode],
  );

  const softResult = useMemo<SoftNmsResult>(
    () => softNms(candidates, softSigma, mode, scoreThreshold),
    [candidates, softSigma, mode, scoreThreshold],
  );

  const keptSet = useMemo(() => new Set(result.kept), [result.kept]);
  const suppressedSet = useMemo(() => new Set(result.suppressed), [result.suppressed]);
  const candidateSet = useMemo(() => new Set(candidates.map((b) => b.id)), [candidates]);

  const applyPreset = (preset: Box[]) => {
    setBoxes(preset);
  };

  return (
    <div className="space-y-6">
      <InteractiveDemo title="二维 IoU 可视化">
        <div className="grid md:grid-cols-2 gap-6">
          <svg
            ref={svgRef}
            viewBox="0 0 200 200"
            className="w-full h-64 bg-gray-50 border rounded-lg cursor-crosshair"
            onMouseMove={handleMouseMove}
            onMouseUp={() => setDragging(null)}
            onMouseLeave={() => setDragging(null)}
          >
            <rect
              x={A.x}
              y={A.y}
              width={A.w}
              height={A.h}
              fill="rgba(59,130,246,0.3)"
              stroke="#2563eb"
              strokeWidth={2}
              onMouseDown={handleMouseDown('A')}
            />
            <rect
              x={B.x}
              y={B.y}
              width={B.w}
              height={B.h}
              fill="rgba(239,68,68,0.3)"
              stroke="#dc2626"
              strokeWidth={2}
              onMouseDown={handleMouseDown('B')}
            />
            {inter > 0 && (
              <rect
                x={Math.max(A.x, B.x)}
                y={Math.max(A.y, B.y)}
                width={Math.min(A.x + A.w, B.x + B.w) - Math.max(A.x, B.x)}
                height={Math.min(A.y + A.h, B.y + B.h) - Math.max(A.y, B.y)}
                fill="rgba(16,185,129,0.4)"
              />
            )}
          </svg>
          <div className="space-y-3">
            <KaTeX
              math={String.raw`\text{IoU}=\frac{|A\cap B|}{|A\cup B|}=\frac{${inter.toFixed(0)}}{${union.toFixed(0)}}=${iou.toFixed(3)}`}
            />
            <p className="text-sm text-gray-700">
              拖拽蓝色或红色矩形改变位置，观察交集（绿色）与 IoU 变化。
            </p>
          </div>
        </div>
      </InteractiveDemo>

      <InteractiveDemo title="非极大抑制（NMS）演示">
        <div className="space-y-4">
          <p className="text-sm text-gray-700">
            当前默认是 single-class hard NMS。可通过下方按钮切换典型场景，观察 class-aware
            与 class-agnostic 模式以及 soft-NMS 的区别。
          </p>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => applyPreset(CROWDED_SAME_CLASS)}>
              拥挤同类物体
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => applyPreset(OVERLAPPING_DIFFERENT_CLASS)}
            >
              跨类重叠物体
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                applyPreset(CROWDED_SAME_CLASS);
                setShowSoftNms(true);
              }}
            >
              Soft-NMS 对比
            </Button>
            <Button variant="ghost" size="sm" onClick={() => applyPreset(DEFAULT_BOXES)}>
              重置
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <svg viewBox="0 0 200 200" className="w-full h-64 bg-gray-50 border rounded-lg">
            {boxes.map((box) => {
              const isCandidate = candidateSet.has(box.id);
              const isKept = keptSet.has(box.id);
              const isSuppressed = suppressedSet.has(box.id);
              const fill = isSuppressed
                ? 'rgba(239,68,68,0.2)'
                : isKept
                  ? 'rgba(16,185,129,0.3)'
                  : isCandidate
                    ? 'rgba(59,130,246,0.15)'
                    : 'rgba(156,163,175,0.1)';
              const stroke = isSuppressed
                ? '#dc2626'
                : isKept
                  ? '#059669'
                  : isCandidate
                    ? '#2563eb'
                    : '#9ca3af';
              return (
                <g key={box.id}>
                  <rect
                    x={box.x}
                    y={box.y}
                    width={box.w}
                    height={box.h}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={2}
                    strokeDasharray={isCandidate ? undefined : '4 2'}
                  />
                  <text
                    x={box.x + 4}
                    y={box.y + 14}
                    fontSize={10}
                    fill={isSuppressed ? '#dc2626' : '#111827'}
                  >
                    {box.id}:{box.score.toFixed(2)} (c{box.classId})
                  </text>
                </g>
              );
            })}
          </svg>

          <div className="space-y-5">
            <div>
              <Label className="text-sm font-medium text-gray-700">NMS 模式</Label>
              <RadioGroup
                value={mode}
                onValueChange={(value) => setMode(value as 'class-aware' | 'class-agnostic')}
                className="flex items-center gap-4 mt-2"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="class-aware" id="class-aware" />
                  <Label htmlFor="class-aware" className="text-sm text-gray-700">
                    class-aware
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="class-agnostic" id="class-agnostic" />
                  <Label htmlFor="class-agnostic" className="text-sm text-gray-700">
                    class-agnostic
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                <span>置信度阈值</span>
                <span>{scoreThreshold.toFixed(2)}</span>
              </div>
              <Slider
                value={[scoreThreshold]}
                min={0}
                max={1}
                step={0.05}
                onValueChange={(v) => setScoreThreshold(v[0])}
              />
            </div>

            <div>
              <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                <span>IoU 阈值</span>
                <span>{nmsThreshold.toFixed(2)}</span>
              </div>
              <Slider
                value={[nmsThreshold]}
                min={0}
                max={1}
                step={0.05}
                onValueChange={(v) => setNmsThreshold(v[0])}
              />
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">候选框（按分数排序）</h4>
              <div className="flex flex-wrap gap-2">
                {candidates.length === 0 && (
                  <span className="text-sm text-gray-500">无候选框</span>
                )}
                {candidates.map((box) => (
                  <span
                    key={box.id}
                    className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-indigo-700/10"
                  >
                    #{box.id} · {box.score.toFixed(2)} · c{box.classId}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-sm text-gray-700">
              绿色框被保留，红色框被抑制，虚线框未通过置信度阈值。当前保留编号：
              {result.kept.join(', ') || '无'}；抑制编号：
              {result.suppressed.join(', ') || '无'}。
            </p>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">逐对比较轨迹</h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>轮次</TableHead>
                <TableHead>选中框</TableHead>
                <TableHead>对比框</TableHead>
                <TableHead>IoU</TableHead>
                <TableHead>阈值</TableHead>
                <TableHead>决策</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.trace.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500">
                    无比较记录
                  </TableCell>
                </TableRow>
              )}
              {result.trace.map((entry, idx) => (
                <TableRow key={idx}>
                  <TableCell>{entry.iteration}</TableCell>
                  <TableCell>#{entry.selectedBox}</TableCell>
                  <TableCell>#{entry.comparedBox}</TableCell>
                  <TableCell>{entry.iou.toFixed(3)}</TableCell>
                  <TableCell>{entry.threshold.toFixed(2)}</TableCell>
                  <TableCell>
                    <span
                      className={
                        entry.action === 'suppress'
                          ? 'text-red-600 font-medium'
                          : 'text-green-600 font-medium'
                      }
                    >
                      {entry.action === 'suppress' ? '抑制' : '保留'}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSoftNms((s) => !s)}
          >
            {showSoftNms ? '隐藏 Soft-NMS 对比' : '显示 Soft-NMS 对比'}
          </Button>

          {showSoftNms && (
            <div className="mt-4 space-y-4">
              <div>
                <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                  <span>Soft-NMS σ</span>
                  <span>{softSigma.toFixed(2)}</span>
                </div>
                <Slider
                  value={[softSigma]}
                  min={0.1}
                  max={1}
                  step={0.05}
                  onValueChange={(v) => setSoftSigma(v[0])}
                />
              </div>

              <p className="text-sm text-gray-700">
                Soft-NMS 每轮从当前剩余框中选择分数最高者，然后按 IoU 衰减其它框的分数；
                衰减后低于置信度阈值的框被移除。选择顺序由<strong>实时更新后的分数</strong>决定。
              </p>

              <div className="flex flex-wrap gap-2 text-sm">
                <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-700/10">
                  选择顺序：{softResult.selectedOrder.join(' → ') || '无'}
                </span>
                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10">
                  保留：{softResult.kept.join(', ') || '无'}
                </span>
                <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-red-700/10">
                  阈值过滤：{softResult.removedByThreshold.join(', ') || '无'}
                </span>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>框</TableHead>
                    <TableHead>类别</TableHead>
                    <TableHead>原始分数</TableHead>
                    <TableHead>最终分数</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {candidates.map((box) => {
                    const final = softResult.finalScores.get(box.id) ?? box.score;
                    return (
                      <TableRow key={box.id}>
                        <TableCell>#{box.id}</TableCell>
                        <TableCell>c{box.classId}</TableCell>
                        <TableCell>{box.score.toFixed(3)}</TableCell>
                        <TableCell>{final.toFixed(3)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Soft-NMS 衰减轨迹</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>轮次</TableHead>
                      <TableHead>选中框</TableHead>
                      <TableHead>被衰减框</TableHead>
                      <TableHead>IoU</TableHead>
                      <TableHead>旧分数</TableHead>
                      <TableHead>新分数</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {softResult.trace.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-gray-500">
                          无衰减记录
                        </TableCell>
                      </TableRow>
                    )}
                    {softResult.trace.map((entry, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{entry.iteration}</TableCell>
                        <TableCell>#{entry.selectedBox}</TableCell>
                        <TableCell>#{entry.comparedBox}</TableCell>
                        <TableCell>{entry.iou.toFixed(3)}</TableCell>
                        <TableCell>{entry.oldScore.toFixed(3)}</TableCell>
                        <TableCell>{entry.newScore.toFixed(3)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
      </InteractiveDemo>
    </div>
  );
}
