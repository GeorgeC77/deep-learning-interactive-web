import { useState, useMemo, useRef } from 'react';
import InteractiveDemo from '@/components/InteractiveDemo';
import { Slider } from '@/components/ui/slider';
import KaTeX from '@/components/KaTeX';

function rectArea(r: { x: number; y: number; w: number; h: number }) {
  return Math.max(0, r.w) * Math.max(0, r.h);
}

function intersectionArea(a: { x: number; y: number; w: number; h: number }, b: { x: number; y: number; w: number; h: number }) {
  const x1 = Math.max(a.x, b.x);
  const y1 = Math.max(a.y, b.y);
  const x2 = Math.min(a.x + a.w, b.x + b.w);
  const y2 = Math.min(a.y + a.h, b.y + b.h);
  return Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
}

function computeIoU(a: { x: number; y: number; w: number; h: number }, b: { x: number; y: number; w: number; h: number }) {
  const inter = intersectionArea(a, b);
  const union = rectArea(a) + rectArea(b) - inter;
  return union > 0 ? inter / union : 0;
}

export default function IoUNMSDemo() {
  const [A, setA] = useState({ x: 30, y: 30, w: 80, h: 80 });
  const [B, setB] = useState({ x: 70, y: 70, w: 90, h: 70 });
  const [dragging, setDragging] = useState<'A' | 'B' | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const inter = intersectionArea(A, B);
  const union = rectArea(A) + rectArea(B) - inter;
  const iou = union > 0 ? inter / union : 0;

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
    updater((r) => ({ ...r, x: Math.max(0, Math.min(200 - r.w, svgP.x - r.w / 2)), y: Math.max(0, Math.min(200 - r.h, svgP.y - r.h / 2)) }));
  };

  // NMS demo state
  const [nmsThreshold, setNmsThreshold] = useState(0.5);
  const boxes = useMemo(
    () => [
      { id: 1, x: 20, y: 20, w: 70, h: 70, score: 0.95 },
      { id: 2, x: 35, y: 35, w: 65, h: 65, score: 0.88 },
      { id: 3, x: 120, y: 30, w: 60, h: 60, score: 0.82 },
      { id: 4, x: 130, y: 120, w: 55, h: 55, score: 0.75 },
      { id: 5, x: 40, y: 130, w: 50, h: 50, score: 0.6 },
    ],
    []
  );

  const kept = useMemo(() => {
    const sorted = [...boxes].sort((a, b) => b.score - a.score);
    const keep: number[] = [];
    const suppressed = new Set<number>();
    for (const box of sorted) {
      if (suppressed.has(box.id)) continue;
      keep.push(box.id);
      for (const other of sorted) {
        if (other.id === box.id || suppressed.has(other.id)) continue;
        if (computeIoU(box, other) > nmsThreshold) {
          suppressed.add(other.id);
        }
      }
    }
    return { keep, suppressed: Array.from(suppressed) };
  }, [boxes, nmsThreshold]);

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
            <rect x={A.x} y={A.y} width={A.w} height={A.h} fill="rgba(59,130,246,0.3)" stroke="#2563eb" strokeWidth={2} onMouseDown={handleMouseDown('A')} />
            <rect x={B.x} y={B.y} width={B.w} height={B.h} fill="rgba(239,68,68,0.3)" stroke="#dc2626" strokeWidth={2} onMouseDown={handleMouseDown('B')} />
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
            <KaTeX math={String.raw`\text{IoU}=\frac{|A\cap B|}{|A\cup B|}=\frac{${inter.toFixed(0)}}{${union.toFixed(0)}}=${iou.toFixed(3)}`} />
            <p className="text-sm text-gray-700">拖拽蓝色或红色矩形改变位置，观察交集（绿色）与 IoU 变化。</p>
          </div>
        </div>
      </InteractiveDemo>

      <InteractiveDemo title="非极大抑制（NMS）演示">
        <div className="grid md:grid-cols-2 gap-6">
          <svg viewBox="0 0 200 200" className="w-full h-64 bg-gray-50 border rounded-lg">
            {boxes.map((box) => {
              const isKept = kept.keep.includes(box.id);
              const isSuppressed = kept.suppressed.includes(box.id);
              return (
                <g key={box.id}>
                  <rect
                    x={box.x}
                    y={box.y}
                    width={box.w}
                    height={box.h}
                    fill={isSuppressed ? 'rgba(239,68,68,0.2)' : isKept ? 'rgba(16,185,129,0.3)' : 'rgba(156,163,175,0.2)'}
                    stroke={isSuppressed ? '#dc2626' : isKept ? '#059669' : '#6b7280'}
                    strokeWidth={2}
                  />
                  <text x={box.x + 4} y={box.y + 14} fontSize={10} fill={isSuppressed ? '#dc2626' : '#111827'}>
                    {box.score.toFixed(2)}
                  </text>
                </g>
              );
            })}
          </svg>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                <span>IoU 阈值</span>
                <span>{nmsThreshold.toFixed(2)}</span>
              </div>
              <Slider value={[nmsThreshold]} min={0} max={1} step={0.05} onValueChange={(v) => setNmsThreshold(v[0])} />
            </div>
            <p className="text-sm text-gray-700">
              绿色框被保留，红色框因与更高分框的 IoU 超过阈值而被抑制。当前保留编号：{kept.keep.join(', ')}；抑制编号：{kept.suppressed.join(', ') || '无'}。
            </p>
          </div>
        </div>
      </InteractiveDemo>
    </div>
  );
}
