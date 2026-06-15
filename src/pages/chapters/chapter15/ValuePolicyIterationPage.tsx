import { useState } from 'react';
import { ShieldAlert, Activity, CheckCircle2, RefreshCw, SkipForward } from 'lucide-react';
import KaTeX from '@/components/KaTeX';
import FormulaCard from '@/components/FormulaCard';
import {
  defaultConfig,
  valueIterationStep,
  policyEvaluationStep,
  extractPolicy,
  indexToState,
  isTerminal,
  ACTIONS,
} from './GridWorld';

export default function ValuePolicyIterationPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <section className="text-center py-8 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="text-sm font-medium text-blue-600 mb-2 tracking-wide uppercase">
          第十五章 · 强化学习
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">值迭代与策略迭代</h1>
        <p className="text-gray-600 max-w-2xl mx-auto px-4">
          当转移概率和奖励函数已知时，值迭代与策略迭代是求解有限状态 MDP 的两个经典动态规划算法。
        </p>

        <div className="mt-6 inline-flex items-center gap-2 bg-amber-50 border border-amber-300 rounded-lg px-5 py-3 max-w-3xl mx-auto">
          <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <span className="text-sm font-medium text-amber-800">
            © 版权声明：本课程内容仅供个人学习交流使用，采用 CC BY-NC 4.0 许可。未经授权，严禁以任何形式用于商业用途。
          </span>
        </div>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Activity className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">值迭代</h2>
        </div>
        <p className="text-gray-700 mb-4">
          值迭代从任意初始价值函数（通常为零）出发，反复应用 Bellman 最优算子，使价值函数逐步收敛到最优价值函数 V*：
        </p>
        <FormulaCard
          title="值迭代更新"
          formula={
            <KaTeX
              math={String.raw`V(s) := R(s) + \gamma \max_{a \in A} \sum_{s' \in S} P_{sa}(s') V(s')`}
              display
            />
          }
          description="对每一个状态同步或异步地更新，直到 V 收敛。"
        />
        <p className="text-gray-700 mt-4">
          值迭代不会在经过有限步后精确达到 V*，但可以任意接近。收敛后，通过贪婪策略提取即可得到最优策略。
        </p>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">策略迭代</h2>
        <p className="text-gray-700 mb-4">
          策略迭代交替执行两步：
        </p>
        <ol className="list-decimal list-inside space-y-2 text-gray-700 mb-4">
          <li><strong>策略评估：</strong>对当前策略 π，求解线性方程组得到 V^π。</li>
          <li><strong>策略改进：</strong>根据 V^π 更新策略为贪婪策略。</li>
        </ol>
        <FormulaCard
          title="策略迭代"
          formula={
            <KaTeX
              math={String.raw`\pi(s) := \arg\max_{a \in A} \sum_{s' \in S} P_{sa}(s') V^\pi(s')`}
              display
            />
          }
          description="当策略不再改变时，即已找到最优策略。"
        />
        <p className="text-gray-700 mt-4">
          策略迭代通常比值迭代更快收敛到精确最优策略，但每次迭代需要求解一个线性方程组，状态空间很大时计算代价高。
          因此，实际中值迭代往往更常用。
        </p>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">交互演示：逐步求解</h2>
        <p className="text-gray-700 mb-4">
          在下面的网格世界中，你可以选择「值迭代」或「策略迭代」模式，点击按钮逐步观察算法如何收敛。
          绿色格子为目标，红色格子为陷阱，黑色格子为障碍。
        </p>
        <IterationDemo />
      </section>

      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
        <h3 className="text-lg font-bold text-blue-800 mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          小结
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">●</span>
            <span>值迭代通过反复应用 Bellman 最优算子收敛到 V*。</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">●</span>
            <span>策略迭代交替进行策略评估和策略改进。</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">●</span>
            <span>小状态空间可用策略迭代精确求解；大状态空间常用值迭代。</span>
          </li>
        </ul>
      </section>
    </div>
  );
}

function IterationDemo() {
  const config = defaultConfig();
  const [mode, setMode] = useState<'value' | 'policy'>('value');
  const [V, setV] = useState<number[]>(() => new Array(config.rows * config.cols).fill(0));
  const [policy, setPolicy] = useState<number[]>(() => new Array(config.rows * config.cols).fill(0));
  const [iterations, setIterations] = useState(0);

  const displayedPolicy = mode === 'value' ? extractPolicy(V, config) : policy;

  const doStep = () => {
    if (mode === 'value') {
      setV((current) => valueIterationStep(current, config));
    } else {
      const newV = policyEvaluationStep(V, policy, config);
      const newPolicy = extractPolicy(newV, config);
      setV(newV);
      setPolicy(newPolicy);
    }
    setIterations((it) => it + 1);
  };

  const reset = () => {
    setV(new Array(config.rows * config.cols).fill(0));
    setPolicy(new Array(config.rows * config.cols).fill(0));
    setIterations(0);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => { setMode('value'); reset(); }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === 'value' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          值迭代
        </button>
        <button
          onClick={() => { setMode('policy'); reset(); }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === 'policy' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          策略迭代
        </button>
        <button
          onClick={doStep}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm"
        >
          <SkipForward className="w-4 h-4" />
          执行一步
        </button>
        <button
          onClick={() => { for (let i = 0; i < 20; i++) doStep(); }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          执行 20 步
        </button>
        <button
          onClick={reset}
          className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          重置
        </button>
      </div>

      <GridWorld config={config} V={V} policy={displayedPolicy} />

      <div className="text-sm text-gray-600">
        模式: <span className="font-medium text-gray-800">{mode === 'value' ? '值迭代' : '策略迭代'}</span>，
        已执行步数: <span className="font-mono font-medium text-blue-700">{iterations}</span>
      </div>
    </div>
  );
}

function GridWorld({ config, V, policy }: { config: ReturnType<typeof defaultConfig>; V: number[]; policy: number[] }) {
  const cellSize = 72;
  const width = config.cols * cellSize;
  const height = config.rows * cellSize;

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[300px]" style={{ maxHeight: 360 }}>
        <defs>
          <marker id="arrow-blue" markerWidth={10} markerHeight={10} refX={9} refY={3} orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L9,3 z" fill="#2563eb" />
          </marker>
        </defs>
        {Array.from({ length: config.rows * config.cols }).map((_, idx) => {
          const pos = indexToState(idx, config.cols);
          const x = pos.c * cellSize;
          const y = pos.r * cellSize;
          const isGoal = pos.r === config.goal.r && pos.c === config.goal.c;
          const isTrap = config.traps.some((t) => t.r === pos.r && t.c === pos.c);
          const isObs = config.obstacles.some((o) => o.r === pos.r && o.c === pos.c);
          const isStart = pos.r === config.start.r && pos.c === config.start.c;

          let fill = '#ffffff';
          if (isGoal) fill = '#d1fae5';
          else if (isTrap) fill = '#fee2e2';
          else if (isObs) fill = '#374151';

          return (
            <g key={idx}>
              <rect x={x} y={y} width={cellSize} height={cellSize} fill={fill} stroke="#d1d5db" strokeWidth={1} />
              {!isObs && (
                <text x={x + cellSize / 2} y={y + cellSize / 2 + 4} textAnchor="middle" fontSize={13} fill="#1f2937">
                  {V[idx].toFixed(2)}
                </text>
              )}
              {isStart && (
                <text x={x + cellSize / 2} y={y + cellSize - 8} textAnchor="middle" fontSize={10} fill="#2563eb">
                  起点
                </text>
              )}
              {!isObs && !isTerminal(idx, config) && policy[idx] >= 0 && (
                <Arrow x={x + cellSize / 2} y={y + cellSize / 2} actionIdx={policy[idx]} size={18} />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function Arrow({ x, y, actionIdx, size }: { x: number; y: number; actionIdx: number; size: number }) {
  const action = ACTIONS[actionIdx];
  const dx = action.dc * size;
  const dy = action.dr * size;
  return (
    <line
      x1={x - dx * 0.4}
      y1={y - dy * 0.4}
      x2={x + dx * 0.4}
      y2={y + dy * 0.4}
      stroke="#2563eb"
      strokeWidth={3}
      markerEnd="url(#arrow-blue)"
    />
  );
}
