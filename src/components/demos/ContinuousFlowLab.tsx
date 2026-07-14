import { useMemo, useState, useCallback, type JSX } from 'react';
import InteractiveDemo from '@/components/InteractiveDemo';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import KaTeX from '@/components/KaTeX';
import PredictionGate from '@/components/PredictionGate';
import {
  FLOW_PRESETS,
  flowMapForward,
  flowMapInverse,
  distance,
  logDensityChange,
  traceJacobian,
  type FlowPresetId,
  type Solver,
} from '@/lib/math/continuousFlow';

const VIEW_SIZE = 400;
const DOMAIN = 3;
const SCALE = VIEW_SIZE / (2 * DOMAIN);

function toSvg(x: number, y: number): { x: number; y: number } {
  return {
    x: VIEW_SIZE / 2 + x * SCALE,
    y: VIEW_SIZE / 2 - y * SCALE,
  };
}

function fromSvg(sx: number, sy: number): { x: number; y: number } {
  return {
    x: (sx - VIEW_SIZE / 2) / SCALE,
    y: -(sy - VIEW_SIZE / 2) / SCALE,
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export default function ContinuousFlowLab() {
  const [presetId, setPresetId] = useState<FlowPresetId>('rotation');
  const [solver, setSolver] = useState<Solver>('rk4');
  const [dt, setDt] = useState(0.02);
  const [stepCount, setStepCount] = useState(100);
  const [point, setPoint] = useState<[number, number]>([1.2, 0.6]);

  const [prediction, setPrediction] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const preset = FLOW_PRESETS.find((p) => p.id === presetId)!;
  const field = preset.field;
  const t0 = 0;
  const t1 = dt * stepCount;

  const forward = useMemo(
    () => flowMapForward([point[0], point[1]], field, t0, t1, dt, solver),
    [point, field, t0, t1, dt, solver],
  );

  const backward = useMemo(
    () => flowMapInverse(forward.final, field, t1, t0, dt, solver),
    [forward.final, field, t1, t0, dt, solver],
  );

  const forwardFinite = forward.trajectory.filter(
    (p) => Number.isFinite(p[0]) && Number.isFinite(p[1]),
  );
  const forwardBlowup = forwardFinite.length < forward.trajectory.length;
  const backwardValid =
    Number.isFinite(forward.final[0]) && Number.isFinite(forward.final[1]);
  const reconstructionError = backwardValid ? distance(point, backward.final) : NaN;

  const density = useMemo(
    () => logDensityChange(field, forward.trajectory, dt),
    [field, forward.trajectory, dt],
  );

  const traceAtStart = traceJacobian(field, point, 0, 1e-5);

  const handleSvgClick = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const svgX = ((e.clientX - rect.left) / rect.width) * VIEW_SIZE;
    const svgY = ((e.clientY - rect.top) / rect.height) * VIEW_SIZE;
    const { x, y } = fromSvg(svgX, svgY);
    setPoint([clamp(x, -DOMAIN + 0.1, DOMAIN - 0.1), clamp(y, -DOMAIN + 0.1, DOMAIN - 0.1)]);
  }, []);

  const gridLines: JSX.Element[] = [];
  for (let v = -2; v <= 2; v += 1) {
    const a = toSvg(v, -DOMAIN);
    const b = toSvg(v, DOMAIN);
    const c = toSvg(-DOMAIN, v);
    const d = toSvg(DOMAIN, v);
    gridLines.push(
      <line key={`v-${v}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#e5e7eb" strokeWidth={1} />,
      <line key={`h-${v}`} x1={c.x} y1={c.y} x2={d.x} y2={d.y} stroke="#e5e7eb" strokeWidth={1} />,
    );
  }

  const arrows = useMemo(() => {
    const items: JSX.Element[] = [];
    const step = 0.6;
    const maxLen = 14;
    for (let x = -2.4; x <= 2.4; x += step) {
      for (let y = -2.4; y <= 2.4; y += step) {
        const [fx, fy] = field([x, y], 0);
        const len = Math.sqrt(fx * fx + fy * fy);
        if (len < 1e-8) continue;
        const drawLen = Math.min(len * 3, maxLen);
        const ux = (fx / len) * drawLen;
        const uy = -(fy / len) * drawLen; // flip y for SVG
        const start = toSvg(x, y);
        const endX = start.x + ux;
        const endY = start.y + uy;
        const angle = Math.atan2(uy, ux);
        const head1 = `${endX - 5 * Math.cos(angle - Math.PI / 6)},${endY - 5 * Math.sin(angle - Math.PI / 6)}`;
        const head2 = `${endX - 5 * Math.cos(angle + Math.PI / 6)},${endY - 5 * Math.sin(angle + Math.PI / 6)}`;
        items.push(
          <g key={`arrow-${x}-${y}`}>
            <line
              x1={start.x}
              y1={start.y}
              x2={endX}
              y2={endY}
              stroke="#6366f1"
              strokeWidth={1.5}
              opacity={0.75}
            />
            <polygon points={`${endX},${endY} ${head1} ${head2}`} fill="#6366f1" opacity={0.75} />
          </g>,
        );
      }
    }
    return items;
  }, [field]);

  const trajectoryPoly = forwardFinite
    .map(([x, y]) => `${toSvg(x, y).x},${toSvg(x, y).y}`)
    .join(' ');
  const backwardPoly = backwardValid
    ? backward.trajectory
        .filter((p) => Number.isFinite(p[0]) && Number.isFinite(p[1]))
        .map(([x, y]) => `${toSvg(x, y).x},${toSvg(x, y).y}`)
        .join(' ')
    : '';

  const startPos = toSvg(point[0], point[1]);
  const endPos = toSvg(
    Number.isFinite(forward.final[0]) ? forward.final[0] : point[0],
    Number.isFinite(forward.final[1]) ? forward.final[1] : point[1],
  );
  const backPos = backwardValid
    ? toSvg(backward.final[0], backward.final[1])
    : startPos;

  const evaluatePrediction = (value: string) => {
    const text = value.toLowerCase();
    const correct =
      text.includes('否') ||
      text.includes('no') ||
      text.includes('不一定') ||
      text.includes('not necessarily');
    return {
      correct,
      category: correct ? '理解流映射的可逆性' : ' misconception',
      feedback: correct ? (
        <span>正确。局部 Lipschitz 是必要的，但还不够：解必须在整个目标时间区间内存在，才能定义可逆流映射。</span>
      ) : (
        <span>再想想：积分是沿曲线“前进”，返回时只需沿同一曲线倒退。但反向积分只在解未爆破的区间上有定义；局部 Lipschitz 不保证全局存在性。</span>
      ),
    };
  };

  return (
    <InteractiveDemo title="连续流实验：非双射向量场也能产生可逆流映射">
      <div className="space-y-5">
        <div className="text-sm text-gray-600">
          通过数值积分观察向量场生成的流映射。局部 Lipschitz 条件保证积分曲线的局部唯一性，
          但可逆流映射还需要解在整个目标时间区间内存在。
          例如 <KaTeX math="dx/dt=x^2" /> 的解 <KaTeX math="x(t)=x_0/(1-x_0 t)" /> 在 <KaTeX math="t=1/x_0" /> 处爆破；
          全局 Lipschitz 场（如旋转场）则对所有时间都存在。
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Vector field view */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-700">向量场与正向轨迹</h4>
              <span className="text-xs text-gray-500">点击 SVG 设置起点</span>
            </div>
            <div className="bg-white rounded-xl border overflow-hidden">
              <svg
                viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`}
                className="w-full cursor-crosshair"
                onClick={handleSvgClick}
              >
                <rect width={VIEW_SIZE} height={VIEW_SIZE} fill="#fafafa" />
                {gridLines}
                {arrows}
                <polyline points={trajectoryPoly} fill="none" stroke="#ef4444" strokeWidth={2} opacity={0.8} />
                <circle cx={startPos.x} cy={startPos.y} r={5} fill="#3b82f6" stroke="white" strokeWidth={2} />
                <circle cx={endPos.x} cy={endPos.y} r={5} fill="#ef4444" stroke="white" strokeWidth={2} />
                <text x={startPos.x + 8} y={startPos.y - 8} className="text-[10px] fill-blue-600">
                  h₀
                </text>
                <text x={endPos.x + 8} y={endPos.y - 8} className="text-[10px] fill-red-600">
                  φ_t(h₀)
                </text>
              </svg>
            </div>
          </div>

          {/* Forward-backward view */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-700">正向 + 反向还原</h4>
            <div className="bg-white rounded-xl border overflow-hidden">
              <svg viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`} className="w-full">
                <rect width={VIEW_SIZE} height={VIEW_SIZE} fill="#fafafa" />
                {gridLines}
                <polyline points={trajectoryPoly} fill="none" stroke="#ef4444" strokeWidth={2} opacity={0.6} />
                <polyline
                  points={backwardPoly}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth={2}
                  strokeDasharray="6 4"
                  opacity={0.8}
                />
                <circle cx={startPos.x} cy={startPos.y} r={5} fill="#3b82f6" stroke="white" strokeWidth={2} />
                <circle cx={endPos.x} cy={endPos.y} r={5} fill="#ef4444" stroke="white" strokeWidth={2} />
                <circle cx={backPos.x} cy={backPos.y} r={5} fill="#10b981" stroke="white" strokeWidth={2} />
                <text x={startPos.x + 8} y={startPos.y - 8} className="text-[10px] fill-blue-600">
                  h₀
                </text>
                <text x={backPos.x + 8} y={backPos.y + 14} className="text-[10px] fill-emerald-600">
                  {'φ_{-t}(φ_t(h₀))'}
                </text>
              </svg>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-50 border rounded-lg p-3">
            <div className="text-slate-500">正向终点</div>
            <div className="font-mono text-slate-800">
              {Number.isFinite(forward.final[0]) && Number.isFinite(forward.final[1])
                ? `[${forward.final[0].toFixed(3)}, ${forward.final[1].toFixed(3)}]`
                : 'N/A（解已爆破）'}
            </div>
          </div>
          <div className="bg-slate-50 border rounded-lg p-3">
            <div className="text-slate-500">反向还原误差</div>
            <div className={`font-mono font-bold ${!forwardBlowup && reconstructionError < 1e-3 ? 'text-emerald-600' : 'text-amber-600'}`}>
              {Number.isFinite(reconstructionError)
                ? reconstructionError.toExponential(2)
                : 'N/A（解已爆破）'}
            </div>
          </div>
          <div className="bg-slate-50 border rounded-lg p-3">
            <div className="text-slate-500">起点处 tr(J_f)</div>
            <div className="font-mono text-slate-800">{traceAtStart.toFixed(5)}</div>
            <div className="text-[10px] text-slate-400">
              累积 log-density 变化: {density.cumulative[density.cumulative.length - 1].toFixed(4)}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-4 border rounded-xl p-4 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium">反例/对照：向量场预设</Label>
              <RadioGroup value={presetId} onValueChange={(v) => setPresetId(v as FlowPresetId)}>
                {FLOW_PRESETS.map((p) => (
                  <div key={p.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={p.id} id={`preset-${p.id}`} />
                    <Label htmlFor={`preset-${p.id}`} className="text-sm text-gray-700">
                      {p.name}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              <div className="pt-1">
                <KaTeX math={preset.latex} className="text-sm text-indigo-700" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">数值积分器</Label>
              <RadioGroup value={solver} onValueChange={(v) => setSolver(v as Solver)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="rk4" id="solver-rk4" />
                  <Label htmlFor="solver-rk4" className="text-sm text-gray-700">
                    RK4
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="euler" id="solver-euler" />
                  <Label htmlFor="solver-euler" className="text-sm text-gray-700">
                    Euler
                  </Label>
                </div>
              </RadioGroup>
              <div className="text-xs text-gray-500">
                切换积分器可比较 forward-backward 重构误差。选择“有限时间爆破场”可观察区间存在性不足时无法定义可逆流映射。
              </div>
              {forwardBlowup && (
                <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded p-2 mt-2">
                  检测到数值发散：当前向量场在目标时间区间内发生有限时间爆破，无法定义可逆流映射。
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>步长 dt</span>
                <span className="font-mono">{dt.toFixed(3)}</span>
              </div>
              <Slider value={[dt]} min={0.001} max={0.1} step={0.001} onValueChange={([v]) => setDt(v)} />
            </div>

            <div>
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>积分步数</span>
                <span className="font-mono">{stepCount}</span>
              </div>
              <Slider
                value={[stepCount]}
                min={10}
                max={300}
                step={10}
                onValueChange={([v]) => setStepCount(v)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>起点 x</span>
                  <span className="font-mono">{point[0].toFixed(2)}</span>
                </div>
                <Slider
                  value={[point[0]]}
                  min={-2}
                  max={2}
                  step={0.05}
                  onValueChange={([v]) => setPoint((p) => [v, p[1]])}
                />
              </div>
              <div>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>起点 y</span>
                  <span className="font-mono">{point[1].toFixed(2)}</span>
                </div>
                <Slider
                  value={[point[1]]}
                  min={-2}
                  max={2}
                  step={0.05}
                  onValueChange={([v]) => setPoint((p) => [p[0], v])}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setPoint([1.2, 0.6])}>
              重置起点
            </Button>
            <Button variant="outline" onClick={() => setSolver((s) => (s === 'euler' ? 'rk4' : 'euler'))}>
              切换 RK4 / Euler
            </Button>
          </div>
        </div>

        <PredictionGate
          resetKey={presetId}
          prediction={prediction}
          onPredictionChange={setPrediction}
          submitted={submitted}
          onSubmit={() => setSubmitted(true)}
          revealed={revealed}
          onReveal={() => setRevealed((r) => !r)}
          canReveal={submitted}
          question="如果向量场 f 本身不是双射，由它积分得到的流映射是否一定不可逆？"
          hint="考虑反向积分：把 dt 取反，沿同一条曲线倒退回去。"
          evaluatePrediction={evaluatePrediction}
          revealContent={
            <div className="space-y-3 text-sm text-gray-700">
              <div>
                <strong>答案：不一定。</strong> 流映射的可逆性取决于向量场是否局部 Lipschitz <strong>并且</strong> 解在整个目标区间上存在，而不是 f 是否为一一映射。
              </div>
              <div>
                对自治 ODE <KaTeX math="\frac{dh}{dt}=f(h)" />，局部 Lipschitz 保证 Picard–Lindelöf 局部唯一解。正向流映射
                <KaTeX math="\phi_t(h_0)" /> 的逆是反向积分，但它只在解存在的区间上有定义：
              </div>
              <div className="bg-slate-50 border rounded p-2">
                <KaTeX math="\phi_{-t}(h_1)=h_0\quad\text{其中}\quad \frac{dh}{d\tau}=-f(h),\ h(0)=h_1" display />
              </div>
              <div>
                反例： <KaTeX math="dx/dt=x^2" /> 的解 <KaTeX math="x(t)=x_0/(1-x_0 t)" /> 在 <KaTeX math="t=1/x_0" /> 爆破，
                因此无法定义超过该时刻的可逆流映射。全局 Lipschitz 场（如旋转场）才保证任意有限/无限区间的存在性。
              </div>
              <div>
                下方实验中，非线性场 <KaTeX math="f([x,y])=[\sin y, x]" /> 显然不是双射（例如 sin 是周期函数），但在解存在的有限时间 horizon 内，正向+反向积分仍能几乎完美地回到起点。
              </div>
            </div>
          }
        />
      </div>
    </InteractiveDemo>
  );
}
